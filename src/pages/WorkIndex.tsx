import { useMemo, useState } from "react";
import { AskRecord } from "../components/AskRecord";
import { WorkRow } from "../components/WorkRow";
import { MAILTO, featuredWork, otherWork } from "../content";
import { useDebouncedValue } from "../hooks";
import { searchRecord } from "../lib/record-search";
import { handleLinkClick } from "../lib/router";

const coverPlate = (item: (typeof featuredWork)[number]) =>
  item.plates.find((plate) => plate.wide) ?? item.plates[0];

export function WorkIndex() {
  const [query, setQuery] = useState("");
  const asked = useDebouncedValue(query);
  const result = useMemo(() => searchRecord(asked), [asked]);
  // A question with no answer keeps the record on the page rather than
  // leaving an empty screen under the sentence that says so.
  const filtering = result.matches.length > 0;
  const [lead, ...rest] = featuredWork;
  const leadPlate = lead ? coverPlate(lead) : undefined;

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

              {/* The lead case study carries its plate at the full measure so
                  the page opens on the work itself. The other three follow as
                  ruled rows, so the set reads as one hierarchy rather than four
                  equal thumbnails. */}
              <a
                className="lead"
                href={`/work/${lead.slug}`}
                onClick={handleLinkClick}
                data-route
              >
                {leadPlate && (
                  <span className="lead__shot">
                    <img
                      src={leadPlate.src}
                      srcSet={leadPlate.srcSet}
                      sizes="(min-width: 681px) 76rem, 100vw"
                      alt=""
                      width={leadPlate.width}
                      height={leadPlate.height}
                      loading="eager"
                      decoding="async"
                    />
                  </span>
                )}
                <span className="lead__body">
                  <span className="lead__when">{lead.when}</span>
                  <span className="lead__title">{lead.title}</span>
                  <span className="lead__line">
                    {lead.blurb ?? lead.summary}
                  </span>
                  {(lead.stack || lead.tech) && (
                    <span className="lead__tech">
                      {lead.stack ? lead.stack.slice(0, 5).join(", ") : lead.tech}
                    </span>
                  )}
                </span>
              </a>

              <ul className="work-list work-list--lead">
                {rest.map((item) => (
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
              <ul className="work-list work-list--index">
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
