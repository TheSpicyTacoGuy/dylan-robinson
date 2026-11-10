import { useEffect, useRef, useState } from "react";
import type { Shot } from "../content";

type PlatesProps = {
  label: string;
  plates: Shot[];
};

export function Plates({ label, plates }: PlatesProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const hasOpened = useRef(false);

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

  useEffect(() => {
    if (openIndex === null) return;
    const previous = {
      root: document.documentElement.style.overflow,
      body: document.body.style.overflow,
    };
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous.root;
      document.body.style.overflow = previous.body;
    };
  }, [openIndex]);

  const active = openIndex === null ? null : plates[openIndex];

  const step = (direction: number) => {
    setOpenIndex((current) => {
      if (current === null) return current;
      return (current + direction + plates.length) % plates.length;
    });
  };

  return (
    <>
      <div
        className={plates.length === 1 ? "plates plates--single" : "plates"}
      >
        {plates.map((shot) => (
          <figure
            className="plate"
            key={shot.src}
            data-parallax={
              plates.length > 1 ? String(28 - (plates.indexOf(shot) % 3) * 28) : "0"
            }
          >
            <button
              type="button"
              className="plate__button"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setOpenIndex(plates.indexOf(shot));
              }}
              aria-label={`Open ${shot.caption} at full size`}
            >
              <img
                src={shot.src}
                srcSet={shot.srcSet}
                sizes={shot.sizes}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                loading="lazy"
                decoding="async"
              />
            </button>
            <figcaption className="plate__caption">{shot.caption}</figcaption>
          </figure>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={`${label}, screenshots`}
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
            <div className="lightbox__stage">
              <img
                src={active.src}
                alt={active.alt}
                width={active.width}
                height={active.height}
              />
            </div>
            <div className="lightbox__bar">
              <p className="lightbox__caption">
                {active.caption}
                {openIndex !== null && (
                  <span className="lightbox__count">
                    {" "}
                    {openIndex + 1} of {plates.length}
                  </span>
                )}
              </p>
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
