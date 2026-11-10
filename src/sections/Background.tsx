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
      </div>
    </section>
  );
}
