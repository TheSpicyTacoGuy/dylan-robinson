import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { shots } from "../content";

export function Shots() {
  const [missing, setMissing] = useState<string[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const hasOpened = useRef(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], [18, -18]);

  const visible = shots.filter((shot) => !missing.includes(shot.src));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (openIndex === null) {
      if (dialog.open) dialog.close();
      if (hasOpened.current) triggerRef.current?.focus();
      return;
    }

    hasOpened.current = true;
    if (!dialog.open) dialog.showModal();
  }, [openIndex]);

  if (visible.length === 0) return null;

  const active = openIndex === null ? null : visible[openIndex];

  const step = (direction: number) => {
    setOpenIndex((current) => {
      if (current === null) return current;
      return (current + direction + visible.length) % visible.length;
    });
  };

  return (
    <>
      <figure className="shots">
        <div className="shots__grid" ref={gridRef}>
          {visible.map((shot, index) => (
            <motion.div
              className={shot.wide ? "shot shot--wide" : "shot"}
              key={shot.src}
              style={reduceMotion || !shot.wide ? undefined : { y: drift }}
            >
              <button
                type="button"
                className="shot__button"
                onClick={(event) => {
                  triggerRef.current = event.currentTarget;
                  setOpenIndex(index);
                }}
                aria-label={`Open ${shot.caption} at full size`}
              >
                <img
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.width}
                  height={shot.height}
                  loading="lazy"
                  decoding="async"
                  onError={() =>
                    setMissing((current) =>
                      current.includes(shot.src)
                        ? current
                        : [...current, shot.src],
                    )
                  }
                />
              </button>
              <p className="shot__caption">{shot.caption}</p>
            </motion.div>
          ))}
        </div>
        <figcaption className="shots__note">
          CTRL tax return app, using test data. Open a screen for the full size.
        </figcaption>
      </figure>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Screenshot viewer"
        onClose={() => setOpenIndex(null)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setOpenIndex(null);
            return;
          }
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpenIndex(null);
        }}
      >
        {active && (
          <div className="lightbox__inner">
            <img
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
            />
            <div className="lightbox__bar">
              <p className="lightbox__caption">{active.caption}</p>
              <div className="lightbox__actions">
                <button
                  type="button"
                  className="lightbox__btn"
                  onClick={() => step(-1)}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="lightbox__btn"
                  onClick={() => step(1)}
                >
                  Next
                </button>
                <button
                  type="button"
                  className="lightbox__btn"
                  onClick={() => setOpenIndex(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
