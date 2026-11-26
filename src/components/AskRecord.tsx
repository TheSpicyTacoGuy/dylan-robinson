import { useEffect, useId, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import type { RecordField, RecordResult } from "../lib/record-search";

type AskRecordProps = {
  query: string;
  onQueryChange: (value: string) => void;
  result: RecordResult;
};

const NUMBER_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
];

const FIELD_WORDING: Record<
  RecordField | "mixed",
  { one: string; many: string; tail: string }
> = {
  title: { one: "names", many: "name", tail: " in the title" },
  stack: { one: "lists", many: "list", tail: " in the stack" },
  summary: { one: "mentions", many: "mention", tail: "" },
  facts: { one: "mentions", many: "mention", tail: "" },
  mixed: { one: "matches", many: "match", tail: "" },
};

const countItems = (n: number) => {
  const word = n < NUMBER_WORDS.length ? NUMBER_WORDS[n] : String(n);
  return `${word} ${n === 1 ? "item" : "items"}`;
};

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const joinWithAnd = (parts: string[]) => {
  if (parts.length <= 1) return parts[0] ?? "";
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
};

/** The visitor's own words, so the accent marks what was asked, not a result. */
const quoted = (terms: string[]) => (
  <>
    {terms.map((term, index) => (
      <span key={term}>
        {index > 0 ? (index === terms.length - 1 ? " and " : ", ") : ""}
        <mark className="ask__term">{`"${term}"`}</mark>
      </span>
    ))}
  </>
);

function answer(result: RecordResult): ReactNode {
  if (result.kind === "empty") return null;

  if (result.kind === "no-terms") {
    return `No word in that names a tool, a client or a year. Try "postgres" or "school".`;
  }

  if (result.kind === "no-match") {
    return (
      <>
        Nothing in the record matches {quoted(result.terms)}. The record covers{" "}
        {joinWithAnd(result.coverage)}.
      </>
    );
  }

  const fields = new Set(result.matches.map((match) => match.field));
  const wording = FIELD_WORDING[fields.size === 1 ? [...fields][0] : "mixed"];
  const asked = result.terms.filter((term) =>
    result.matches.some((match) => match.origins.includes(term)),
  );
  const plural = result.matches.length !== 1;

  return (
    <>
      {capitalise(countItems(result.matches.length))}{" "}
      {plural ? wording.many : wording.one} {quoted(asked)}
      {wording.tail}.
    </>
  );
}

export function AskRecord({ query, onQueryChange, result }: AskRecordProps) {
  const fieldId = useId();
  const noteId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusOnSlash = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }

      event.preventDefault();
      inputRef.current?.focus();
    };

    window.addEventListener("keydown", focusOnSlash);
    return () => window.removeEventListener("keydown", focusOnSlash);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Escape") return;
    if (query) {
      onQueryChange("");
    } else {
      inputRef.current?.blur();
    }
  };

  return (
    <div className="ask" role="search" aria-label="Search the work record">
      <label className="ask__label" htmlFor={fieldId}>
        Ask the record
      </label>

      <div className="ask__row">
        <input
          ref={inputRef}
          id={fieldId}
          className="ask__input"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-describedby={noteId}
          placeholder="What have you built with MySQL?"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={120}
        />
        <span className="ask__key" aria-hidden="true">
          /
        </span>
        {query && (
          <button
            type="button"
            className="ask__clear"
            onClick={() => {
              onQueryChange("");
              inputRef.current?.focus();
            }}
          >
            Clear
          </button>
        )}
      </div>

      <p className="ask__note" id={noteId}>
        Reads every item on this page and nothing else.
      </p>

      <p className="ask__answer" role="status">
        {/* A new key restarts the entrance, so a changed answer reads as newly
            written rather than silently swapped. */}
        <span
          key={`${result.kind}:${result.terms.join(",")}:${result.matches.length}`}
          className="ask__answer-text"
        >
          {answer(result)}
        </span>
      </p>
    </div>
  );
}
