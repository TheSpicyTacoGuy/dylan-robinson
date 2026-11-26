import type { WorkItem } from "../content";
import { handleLinkClick } from "../lib/router";

type WorkRowProps = {
  item: WorkItem;
  detail: "summary" | "role";
};

export function WorkRow({ item, detail }: WorkRowProps) {
  const shot =
    detail === "summary"
      ? (item.plates.find((plate) => plate.wide) ?? item.plates[0])
      : undefined;
  const shotIsTall = shot ? shot.height > shot.width : false;

  return (
    <li className="work-list__item">
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
              sizes="9.5rem"
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
