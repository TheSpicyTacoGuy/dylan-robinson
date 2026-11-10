import { study, toolGroups } from "../content";

export function Background() {
  return (
    <section className="band band--bone band--sunk" id="background">
      <div className="band__inner">
        <header className="band__head">
          <h2 className="band__title">Background</h2>
          <p className="band__note">Study, and the tools I reach for.</p>
        </header>

        <div className="background">
          <dl className="study">
            {study.map((item) => (
              <div className="study__row" key={item.title}>
                <dt className="study__when">{item.when}</dt>
                <dd>
                  <span className="study__title">{item.title}</span>
                  <span className="study__place">
                    {item.place}
                    {item.note ? ` (${item.note})` : ""}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <dl className="tools">
            {toolGroups.map((group) => (
              <div className="tools__row" key={group.label}>
                <dt className="tools__label">{group.label}</dt>
                <dd className="tools__items">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="background__note">
          I work on whatever part of a system is causing trouble: the database,
          the front end, or the person on the phone explaining what went wrong.
        </p>

        <figure className="about-portrait" data-parallax="-24">
          <div className="about-portrait__frame">
            <picture>
              <source
                media="(max-width: 700px)"
                srcSet="/portrait-tall-800.webp 800w, /portrait-tall-1200.webp 1200w"
                sizes="100vw"
              />
              <img
                src="/portrait-wide-1200.webp"
                srcSet="/portrait-wide-1200.webp 1200w, /portrait-wide-2000.webp 2000w"
                sizes="(min-width: 700px) 34rem, 100vw"
                alt="Dylan Robinson in the Yarra Valley."
                width={1200}
                height={545}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
          <figcaption>Yarra Valley, Victoria.</figcaption>
        </figure>
      </div>
    </section>
  );
}
