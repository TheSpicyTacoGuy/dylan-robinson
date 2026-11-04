import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { easing } from "../motion";

export function Intro() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const nameY = useTransform(scrollYProgress, [0, 0.2], [0, -64]);
  const nameFade = useTransform(scrollYProgress, [0, 0.18], [1, 0.2]);

  return (
    <header className="intro" id="intro">
      <p className="intro__kicker">Yarra Valley, Victoria</p>

      <motion.h1
        className="intro__name"
        style={reduceMotion ? undefined : { y: nameY, opacity: nameFade }}
      >
        {["Dylan", "Robinson"].map((word, index) => (
          <span className="intro__word" key={word}>
            <motion.span
              initial={reduceMotion ? false : { y: "115%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 1,
                delay: 0.08 + index * 0.09,
                ease: easing,
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      <div className="intro__text">
        <p className="intro__lede">
          I build the online tax return app at CTRL Accounting, where I am lead
          developer and a director. It is being prepared for launch.
        </p>

        <p className="intro__body">
          Before the app I worked part-time for eight years in a computer repair
          shop in the Yarra Valley, fixing PCs and building WordPress sites for
          local businesses. I finished a computer science degree at Swinburne in
          May 2026.
        </p>

        <p className="intro__body">
          I work on whatever part of a system is causing trouble: the database,
          the front end, or the person on the phone explaining what went wrong.
        </p>
      </div>
    </header>
  );
}
