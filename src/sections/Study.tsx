import { study } from "../content";

export function Study() {
  return (
    <section className="section" id="study">
      <h2 className="section__label">Study</h2>

      <dl className="study">
        {study.map((item) => (
          <div className="study__row" key={item.title}>
            <dt className="study__when">{item.when}</dt>
            <dd className="study__what">
              <span className="study__title">{item.title}</span>
              <span className="study__place">
                {item.place}
                {item.note ? ` (${item.note})` : ""}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
