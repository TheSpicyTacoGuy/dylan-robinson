import type { CSSProperties } from "react";
import type { WorkItem } from "../content";
import { handleLinkClick } from "../lib/router";

type WorkRowProps = {
  item: WorkItem;
  detail: "summary" | "role";
  /** Position in a filtered list, so a set of rows can arrive one beat apart. */
  step?: number;
};

export function WorkRow({ item, detail, step }: WorkRowProps) {
  const shot =
    detail === "summary"
      ? (item.plates.find((plate) => plate.wide) ?? item.plates[0])
      : undefined;
  const shotIsTall = shot ? shot.height > shot.width : false;
  const style =
    step === undefined
      ? undefined
      : ({ "--rise": Math.min(step, 8) } as CSSProperties);

  return (
    <li className="work-list__item" style={style}>
      <a
        className={shot ? "work-row work-row--shot" : "work-row"}
        href={`/work/${item.slug}`}
        onClick={handleLinkClick}
        data-route
      >
        <span className="work-row__year">{item.when}</span>
        <span className="work-row__title">{item.title}</span>
        <span className="work-row__line">
          {detail === "summary" ? item.blurb ?? item.summary : item.role}
        </span>
        {detail === "summary" && (item.stack || item.tech) && (
          <span className="work-row__tech">
            {item.stack ? item.stack.slice(0, 5).join(", ") : item.tech}
          </span>
        )}
        {shot && (
          <span
            className={
              shotIsTall ? "work-row__shot work-row__shot--tall" : "work-row__shot"
            }
          >
            <img
              src={shot.src}
              srcSet={shot.srcSet}
              sizes={
                shotIsTall
                  ? "(min-width: 681px) 6rem, 11rem"
                  : "(min-width: 681px) 9.5rem, 92vw"
              }
              alt=""
              width={shot.width}
              height={shot.height}
              loading="lazy"
              decoding="async"
            />
          </span>
        )}
      </a>
    </li>
  );
}
