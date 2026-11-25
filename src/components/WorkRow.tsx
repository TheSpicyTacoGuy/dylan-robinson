import type { WorkItem } from "../content";
import { handleLinkClick } from "../lib/router";

type WorkRowProps = {
  item: WorkItem;
  detail: "summary" | "role";
};

export function WorkRow({ item, detail }: WorkRowProps) {
  return (
    <li className="work-list__item">
      <a
        className="work-row"
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
      </a>
    </li>
  );
}
