import { motion, useReducedMotion, useScroll } from "framer-motion";
import { useRef } from "react";
import { roles } from "../content";

export function History() {
  const reduceMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 92%", "end 55%"],
  });

  return (
    <section className="section" id="history">
      <h2 className="section__label">History</h2>

      <div className="timeline" ref={timelineRef}>
        <div className="timeline__rail" aria-hidden="true">
          <motion.span
            className="timeline__fill"
            style={reduceMotion ? { scaleY: 1 } : { scaleY: scrollYProgress }}
          />
        </div>

        {roles.map((role) => (
          <article
            className="timeline__row"
            key={`${role.company}-${role.when}`}
          >
            <p className="timeline__when">{role.when}</p>
            <h3 className="timeline__title">{role.company}</h3>
            <p className="timeline__role">
              {role.title}, {role.place}
              {role.note ? ` (${role.note})` : ""}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
