import { useMemo, useState } from "react";
import { AskRecord } from "../components/AskRecord";
import { WorkRow } from "../components/WorkRow";
import { featuredWork, otherWork } from "../content";
import { useDebouncedValue } from "../hooks";
import { searchRecord } from "../lib/record-search";

export function WorkIndex() {
  const [query, setQuery] = useState("");
  const asked = useDebouncedValue(query);
  const result = useMemo(() => searchRecord(asked), [asked]);
  // A question with no answer keeps the record on the page rather than
  // leaving an empty screen under the sentence that says so.
  const filtering = result.matches.length > 0;

  return (
    <>
      <div className="wrap page-head">
        <h1>Work</h1>
        <p>
          Four detailed case studies, plus selected client, university and
          open-source work.
        </p>
        <AskRecord query={query} onQueryChange={setQuery} result={result} />
      </div>

      {filtering ? (
        <section className="section" aria-labelledby="matches">
          <div className="wrap">
            <h2 id="matches">Matches</h2>
            <ul
              className="work-list work-list--matches"
              key={result.matches.map((match) => match.item.slug).join("|")}
            >
              {result.matches.map((match, index) => (
                <WorkRow
                  key={match.item.slug}
                  item={match.item}
                  detail="summary"
                  step={index}
                />
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <>
          <section className="section" aria-labelledby="case-studies">
            <div className="wrap">
              <h2 id="case-studies">Case studies</h2>
              <ul className="work-list">
                {featuredWork.map((item) => (
                  <WorkRow key={item.slug} item={item} detail="summary" />
                ))}
              </ul>
            </div>
          </section>

          <section className="section" aria-labelledby="also-built">
            <div className="wrap">
              <h2 id="also-built">Also built</h2>
              <p className="section__note">
                Client, university and open-source work. NDA-bound projects stay
                high-level.
              </p>
              <ul className="work-list">
                {otherWork.map((item) => (
                  <WorkRow key={item.slug} item={item} detail="role" />
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </>
  );
}
