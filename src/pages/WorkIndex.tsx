import { WorkRow } from "../components/WorkRow";
import { featuredWork, otherWork } from "../content";

export function WorkIndex() {
  return (
    <>
      <div className="wrap page-head">
        <h1>Work</h1>
        <p>
          Four detailed case studies, plus selected client, university and
          open-source work.
        </p>
      </div>

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
        </div>
      </section>
    </>
  );
}
