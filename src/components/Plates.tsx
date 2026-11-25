import { useEffect, useRef, useState } from "react";
import type { ProjectShot } from "../content";

type PlatesProps = {
  label: string;
  plates: ProjectShot[];
  layout?: "phones";
  columns?: 2 | 3;
};

export function Plates({ label, plates, layout, columns }: PlatesProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const originRef = useRef<DOMRect | null>(null);
  const hasOpened = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (openIndex === null) {
      if (dialog.open) dialog.close();
      if (hasOpened.current) triggerRef.current?.focus();
      return;
    }

    const firstOpen = !dialog.open;
    hasOpened.current = true;
    if (firstOpen) dialog.showModal();

    // The plate is the origin of the full size view: measure it, then settle
    // the stage image from that box so the click has a visible source instead of
    // the image simply appearing. Stepping between plates keeps no animation.
    const origin = originRef.current;
    const image = dialog.querySelector("img");
    if (!firstOpen || !origin || !image) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const settle = image.getBoundingClientRect();
    if (settle.width === 0 || settle.height === 0) return;

    const scaleX = origin.width / settle.width;
    const scaleY = origin.height / settle.height;
    const offsetX =
      origin.left + origin.width / 2 - (settle.left + settle.width / 2);
    const offsetY =
      origin.top + origin.height / 2 - (settle.top + settle.height / 2);

    image.animate(
      [
        {
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scaleX}, ${scaleY})`,
        },
        { transform: "none" },
      ],
      { duration: 260, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
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

  const className = [
    "plates",
    plates.length === 1 ? "plates--single" : "",
    layout === "phones" ? "plates--phones" : "",
    columns === 3 ? "plates--three" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className={className}>
        {plates.map((shot, index) => (
          <figure
            className={shot.wide ? "plate plate--wide" : "plate"}
            key={shot.src}
          >
            <button
              type="button"
              className="plate__button"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                originRef.current = event.currentTarget.getBoundingClientRect();
                setOpenIndex(index);
              }}
              aria-label={`Open ${shot.caption ?? shot.alt} at full size`}
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
            {shot.caption && (
              <figcaption className="plate__caption">{shot.caption}</figcaption>
            )}
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
                {active.caption ?? active.alt}
                {openIndex !== null && plates.length > 1 && (
                  <span className="lightbox__count">
                    {" "}
                    {openIndex + 1} of {plates.length}
                  </span>
                )}
              </p>
              <div className="lightbox__actions">
                {plates.length > 1 && (
                  <>
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
                  </>
                )}
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
