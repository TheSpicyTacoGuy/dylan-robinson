import { Plates } from "../components/Plates";
import { type WorkItem, workInOrder } from "../content";
import { handleLinkClick } from "../lib/router";

type WorkItemPageProps = {
  item: WorkItem;
};

export function WorkItemPage({ item }: WorkItemPageProps) {
  // Previous and next stay inside the same group, so the four case studies read as
  // a set and the shorter client work reads as its own list. Both follow the
  // order the work page lists them in.
  const group = workInOrder.filter((entry) => entry.featured === item.featured);
  const position = group.findIndex((entry) => entry.slug === item.slug);
  const previous = group[(position - 1 + group.length) % group.length];
  const next = group[(position + 1) % group.length];

  const splitLead =
    item.platesLayout !== "phones" &&
    item.platesColumns !== 3 &&
    item.plates.length > 1;
  const lead = splitLead ? item.plates[0] : null;
  const rest = splitLead ? item.plates.slice(1) : item.plates;

  return (
    <article>
      <div className="wrap case__head">
        <a
          className="back"
          href="/work"
          onClick={handleLinkClick}
          data-route
        >
          Back to work
        </a>

        <h1 className="case__title">{item.title}</h1>

        <p className="case__meta">
          <span>{item.when}</span>
          <span>{item.role}</span>
          {item.status && <span>{item.status}</span>}
        </p>

        {(item.stack || item.tech) && (
          <p className="case__stack">
            {item.stack ? item.stack.join(", ") : item.tech}
          </p>
        )}

        <p className="case__summary">{item.summary}</p>

        {item.link && (
          <div className="case__actions">
            <a
              className="action"
              href={item.link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.link.label}
            </a>
          </div>
        )}
      </div>

      {lead && (
        <div className="wrap case__media">
          <Plates label={item.title} plates={[lead]} />
        </div>
      )}

      {item.facts.length > 0 && (
        <div className="wrap">
          <div className="case__section case__section--wide">
            <h2>How it works</h2>
            <ul className="case__facts">
              {item.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {item.clip && (
        <div className="wrap case__media">
          <figure
            className={`clip${
              item.clip.height > item.clip.width ? " clip--portrait" : ""
            }`}
          >
            <video
              controls
              muted
              playsInline
              preload="none"
              poster={item.clip.poster}
              width={item.clip.width}
              height={item.clip.height}
              aria-label={item.clip.label}
            >
              <source src={item.clip.src} type="video/mp4" />
            </video>
            <figcaption className="clip__caption">
              {item.clip.caption}
            </figcaption>
          </figure>
        </div>
      )}

      {rest.length > 0 && (
        <div className="wrap case__media">
          <Plates
            label={item.title}
            plates={rest}
            layout={item.platesLayout}
            columns={item.platesColumns}
          />
        </div>
      )}

      {item.note && (
        <div className="wrap">
          <div className="case__section">
            <p className="case__note">{item.note}</p>
          </div>
        </div>
      )}

      <nav className="wrap case__next" aria-label="More work">
        <div className="case__step">
          <span>Previous project</span>
          <a
            className="link-quiet"
            href={`/work/${previous.slug}`}
            onClick={handleLinkClick}
            data-route
          >
            {previous.title}
          </a>
        </div>
        <div className="case__step case__step--next">
          <span>Next project</span>
          <a
            className="link-quiet"
            href={`/work/${next.slug}`}
            onClick={handleLinkClick}
            data-route
          >
            {next.title}
          </a>
        </div>
      </nav>
    </article>
  );
}
