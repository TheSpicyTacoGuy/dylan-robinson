import { roles } from "../content";

export function History() {
  return (
    <section className="band band--bark" id="history">
      <div className="band__inner">
        <header className="band__head">
          <h2 className="band__title">Experience</h2>
          <p className="band__note">
            Roles across software, support and the sawmill.
          </p>
        </header>

        <ol className="experience">
          {roles.map((role) => (
            <li className="experience__item" key={role.id}>
              <p className="experience__when">{role.when}</p>
              <div>
                <h3 className="experience__company">{role.company}</h3>
                <p className="experience__role">
                  {role.title}, {role.place}
                </p>
                {role.note && <p className="experience__note">{role.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
