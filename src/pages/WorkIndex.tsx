import { useMemo, useState } from "react";
import { AskRecord } from "../components/AskRecord";
import { WorkRow } from "../components/WorkRow";
import { MAILTO, featuredWork, otherWork } from "../content";
import { useDebouncedValue } from "../hooks";
import { searchRecord } from "../lib/record-search";

const coverPlate = (item: (typeof featuredWork)[number]) =>
  item.plates.find((plate) => plate.wide) ?? item.plates[0];

export function WorkIndex() {
  const [query, setQuery] = useState("");
  const asked = useDebouncedValue(query);
  const result = useMemo(() => searchRecord(asked), [asked]);
  // A question with no answer keeps the record on the page rather than
  // leaving an empty screen under the sentence that says so.
  const filtering = result.matches.length > 0;

  return (
    <>
      <div
        className={
          filtering ? "wrap page-head" : "wrap page-head page-head--fill"
        }
      >
        <h1>Work</h1>
        <p>
          Four detailed case studies, plus selected client, university and
          open-source work.
        </p>
        <AskRecord query={query} onQueryChange={setQuery} result={result} />

        {/* The cover shows the work before the list argues for it. It repeats
            the plates in the rows below, so it carries no alt text and steps
            out of the way as soon as the page is being searched. */}
        {!filtering && (
          <>
            <div className="page-head__cover">
              {featuredWork.map((item) => {
                const plate = coverPlate(item);
                if (!plate) return null;
                return (
                  <img
                    key={item.slug}
                    src={plate.src}
                    srcSet={plate.srcSet}
                    sizes="(min-width: 681px) 22vw, 44vw"
                    alt=""
                    width={plate.width}
                    height={plate.height}
                    loading="lazy"
                    decoding="async"
                  />
                );
              })}
            </div>

            <div className="page-head__actions">
              <a className="action action--solid" href={MAILTO}>
                Email me
              </a>
            </div>
          </>
        )}
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

              <div className="section__close">
                <p>Open to full-time roles, Melbourne or remote.</p>
                <a className="action action--solid" href={MAILTO}>
                  Email me
                </a>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
