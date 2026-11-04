import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { CV_URL, EMAIL, sections } from "../content";
import { useActiveSection } from "../hooks";
import { GrowthRings } from "./GrowthRings";

type RailProps = {
  hasCv: boolean;
};

export function Rail({ hasCv }: RailProps) {
  const active = useActiveSection();
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <aside className="rail">
      <GrowthRings />

      <div className="rail__top">
        <a className="rail__name" href="#intro">
          <span className="rail__full">Dylan Robinson</span>
          <span className="rail__short">DR</span>
        </a>
        <p className="rail__role">Software developer, Yarra Valley</p>
      </div>

      <nav className="rail__nav" aria-label="Sections">
        {sections.map((section, index) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={
              active === section.id ? "nav-link is-active" : "nav-link"
            }
            aria-current={active === section.id ? "location" : undefined}
          >
            <span className="nav-link__num">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{section.label}</span>
          </a>
        ))}
      </nav>

      <div className="rail__bottom">
        <a className="rail__mail" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
        {hasCv && (
          <a
            className="rail__mail"
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            CV (PDF)
          </a>
        )}
      </div>

      <motion.div
        className="rail__progress"
        style={{ scaleY: reduceMotion ? 1 : progress }}
        aria-hidden="true"
      />
      <motion.div
        className="rail__progress-h"
        style={{ scaleX: reduceMotion ? 1 : progress }}
        aria-hidden="true"
      />
    </aside>
  );
}
