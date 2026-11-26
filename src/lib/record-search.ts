import { workItems, type WorkItem } from "../content";

/**
 * Reads the work record on this page and nothing else.
 *
 * There is no model and no network call: a question is reduced to its own
 * words, those words are matched against the title, stack, summary and notes
 * of every item, and the answer quotes the words that were asked. If the
 * record does not mention something, the answer says so instead of guessing.
 *
 * Everything it knows comes from `workItems` in content.ts, which already
 * drives the work index, every case page and the resume. A new item is
 * searchable the moment it is added there, with no list to keep in step.
 */

export type RecordField = "title" | "stack" | "summary" | "facts";

export type RecordMatch = {
  item: WorkItem;
  score: number;
  field: RecordField;
  /** The words the visitor typed that this item answers. */
  origins: string[];
  order: number;
};

export type RecordResult = {
  kind: "empty" | "no-terms" | "no-match" | "match";
  /** Distinct words from the question, in the order they were asked. */
  terms: string[];
  matches: RecordMatch[];
  coverage: string[];
};

const FIELD_WEIGHT: Record<RecordField, number> = {
  title: 6,
  stack: 4,
  summary: 2,
  facts: 1,
};

// Descending weight, so the first field that matches is the strongest one.
const FIELD_ORDER: RecordField[] = ["title", "stack", "summary", "facts"];

/** Words that carry no subject, so a question can be asked as a sentence. */
const STOP_WORDS = new Set([
  "a",
  "about",
  "an",
  "and",
  "any",
  "anything",
  "are",
  "as",
  "at",
  "be",
  "been",
  "build",
  "building",
  "built",
  "can",
  "could",
  "did",
  "do",
  "does",
  "doing",
  "done",
  "experience",
  "find",
  "for",
  "from",
  "get",
  "give",
  "has",
  "have",
  "help",
  "hi",
  "how",
  "i",
  "if",
  "in",
  "is",
  "it",
  "its",
  "know",
  "knowledge",
  "list",
  "look",
  "made",
  "make",
  "me",
  "my",
  "need",
  "of",
  "on",
  "or",
  "our",
  "please",
  "project",
  "projects",
  "search",
  "see",
  "show",
  "skill",
  "skills",
  "something",
  "tell",
  "that",
  "the",
  "their",
  "them",
  "there",
  "these",
  "thing",
  "things",
  "think",
  "this",
  "those",
  "to",
  "use",
  "used",
  "using",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "with",
  "work",
  "worked",
  "working",
  "works",
  "would",
  "you",
  "your",
]);

/**
 * Shorter names for things the record already names, and nothing looser. Add a
 * row here only when a tool has a nickname a visitor would reasonably type.
 */
const SYNONYMS: Record<string, string[]> = {
  js: ["javascript"],
  ts: ["typescript"],
  db: ["sql", "database", "postgresql", "mysql", "mariadb"],
  database: ["sql", "postgresql", "mysql", "mariadb"],
  ecommerce: ["woocommerce"],
  mobile: ["android", "kotlin"],
};

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9+#]+/)
    .flatMap((token) => {
      // "vue3" and "php8" should also answer a search for "vue" and "php".
      const plain = token.replace(/\d+$/, "");
      return plain && plain !== token ? [token, plain] : [token];
    })
    .filter((token) => token.length > 1 || /^\d{4}$/.test(token));

type Term = { term: string; origin: string };

const buildTerms = (query: string): Term[] => {
  const terms: Term[] = [];
  for (const origin of tokenize(query)) {
    if (STOP_WORDS.has(origin)) continue;
    for (const term of [origin, ...(SYNONYMS[origin] ?? [])]) {
      if (!terms.some((entry) => entry.term === term)) {
        terms.push({ term, origin });
      }
    }
  }
  return terms;
};

const matchesToken = (term: string, token: string) =>
  token === term || (term.length >= 3 && token.startsWith(term));

type Doc = {
  item: WorkItem;
  order: number;
  tokens: Record<RecordField, string[]>;
};

const buildDoc = (item: WorkItem, order: number): Doc => ({
  item,
  order,
  tokens: {
    title: tokenize(item.title),
    stack: tokenize([...(item.stack ?? []), item.tech ?? ""].join(" ")),
    summary: tokenize(
      [item.summary, item.blurb ?? "", item.role, item.when].join(" "),
    ),
    facts: tokenize(
      [...item.facts, item.note ?? "", item.status ?? ""].join(" "),
    ),
  },
});

// Built once for the life of the page, not once per keystroke.
let docs: Doc[] | null = null;
const getDocs = () => (docs ??= workItems.map(buildDoc));

/** The tool each item leads with, so the record can name what it does cover. */
const COVERAGE = (() => {
  const seen = new Map<string, number>();
  for (const item of workItems) {
    const lead = item.stack?.[0] ?? item.tech?.split(",")[0];
    if (!lead) continue;
    // "Kotlin Multiplatform" and "Kotlin" are the same answer to a visitor.
    const name = lead
      .replace(/\s+v?\d+(?:\.\d+)*\s*$/i, "")
      .trim()
      .split(/\s+/)[0];
    if (name) seen.set(name, (seen.get(name) ?? 0) + 1);
  }
  return [...seen.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name);
})();

export function searchRecord(query: string): RecordResult {
  const terms = buildTerms(query);

  if (!query.trim() || terms.length === 0) {
    return {
      kind: query.trim() ? "no-terms" : "empty",
      terms: [],
      matches: [],
      coverage: COVERAGE,
    };
  }

  const matches: RecordMatch[] = [];

  for (const doc of getDocs()) {
    let score = 0;
    let field: RecordField | null = null;
    let fieldWeight = 0;
    const origins: string[] = [];

    for (const { term, origin } of terms) {
      const matchedAt = FIELD_ORDER.find((candidate) =>
        doc.tokens[candidate].some((token) => matchesToken(term, token)),
      );
      if (!matchedAt) continue;

      if (!origins.includes(origin)) origins.push(origin);
      score += FIELD_WEIGHT[matchedAt];

      if (FIELD_WEIGHT[matchedAt] > fieldWeight) {
        fieldWeight = FIELD_WEIGHT[matchedAt];
        field = matchedAt;
      }
    }

    if (field) {
      matches.push({ item: doc.item, score, field, origins, order: doc.order });
    }
  }

  matches.sort(
    (a, b) =>
      b.origins.length - a.origins.length ||
      b.score - a.score ||
      a.order - b.order,
  );

  return {
    kind: matches.length > 0 ? "match" : "no-match",
    terms: [...new Set(terms.map((entry) => entry.origin))],
    matches,
    coverage: COVERAGE,
  };
}
