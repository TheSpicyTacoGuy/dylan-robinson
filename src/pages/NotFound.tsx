import { featuredWork } from "../content";
import { handleLinkClick } from "../lib/router";

export function NotFound() {
  return (
    <div className="wrap page-head">
      <h1>Nothing here</h1>
      <p>
        That address does not match a page on this site. The four case studies
        are below, and the work page lists the rest.
      </p>

      <ul className="not-found__list">
        {featuredWork.map((item) => (
          <li key={item.slug}>
            <a
              className="not-found__row"
              href={`/work/${item.slug}`}
              onClick={handleLinkClick}
              data-route
            >
              <span className="not-found__title">{item.title}</span>
              <span className="not-found__year">{item.when}</span>
            </a>
          </li>
        ))}
      </ul>

      <p className="not-found__more">
        <a
          className="link-quiet"
          href="/work"
          onClick={handleLinkClick}
          data-route
        >
          See all work
        </a>
      </p>
    </div>
  );
}
