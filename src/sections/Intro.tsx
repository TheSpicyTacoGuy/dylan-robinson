import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useState } from "react";

const portraitSources = ["/portrait.jpg", "/portrait.png"];

export function Intro() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const nameY = useTransform(scrollYProgress, [0, 0.2], [0, -48]);
  const nameFade = useTransform(scrollYProgress, [0, 0.18], [1, 0.25]);

  const [portraitIndex, setPortraitIndex] = useState(0);
  const [portraitMissing, setPortraitMissing] = useState(false);

  return (
    <header className="intro" id="intro">
      <p className="intro__kicker">Yarra Valley, Victoria</p>

      <motion.h1
        className="intro__name"
        style={reduceMotion ? undefined : { y: nameY, opacity: nameFade }}
      >
        Dylan Robinson
      </motion.h1>

      <span className="intro__rule" aria-hidden="true" />

      <div
        className={
          portraitMissing
            ? "intro__details intro__details--solo"
            : "intro__details"
        }
      >
        {!portraitMissing && (
          <figure className="portrait">
            <img
              src={portraitSources[portraitIndex]}
              alt="Dylan Robinson"
              width={800}
              height={1000}
              decoding="async"
              fetchPriority="high"
              onError={() => {
                if (portraitIndex < portraitSources.length - 1) {
                  setPortraitIndex(portraitIndex + 1);
                } else {
                  setPortraitMissing(true);
                }
              }}
            />
          </figure>
        )}

        <div className="intro__text">
          <p className="intro__lede">
            I build the online tax return app at CTRL Accounting, where I am
            lead developer and a director. It is being prepared for launch.
          </p>

          <p className="intro__body">
            Before the app I worked part-time for eight years in a computer
            repair shop in the Yarra Valley, fixing PCs and building WordPress
            sites for local businesses. At Powelltown Sawmills I stacked timber,
            then fixed their Access databases, built a new inventory system for
            Smokemaster, and added tracking for timber moving between the mill
            and storage. I finished a computer science degree at Swinburne in
            May 2026.
          </p>

          <p className="intro__body">
            I work on whatever part of a system is causing trouble: the
            database, the front end, or the person on the phone explaining what
            went wrong.
          </p>
        </div>
      </div>
    </header>
  );
}
