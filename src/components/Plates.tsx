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
  const closing = useRef(false);

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
    // A close in flight leaves the image shrunk toward its plate; an open or a
    // step cancels that so the stage is never left mid flight.
    image?.getAnimations().forEach((animation) => animation.cancel());
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

  // Closing runs the open in reverse: the stage image shrinks back into the
  // plate that opened it, so the dialog has a destination instead of a flash.
  const close = () => {
    if (closing.current) return;
    closing.current = true;
    const dialog = dialogRef.current;
    const image = dialog?.querySelector("img");
    const trigger = triggerRef.current;
    if (
      !dialog?.open ||
      !image ||
      !trigger ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setOpenIndex(null);
      return;
    }

    const from = image.getBoundingClientRect();
    const to = trigger.getBoundingClientRect();
    if (from.width === 0 || to.width === 0) {
      setOpenIndex(null);
      return;
    }

    const scaleX = to.width / from.width;
    const scaleY = to.height / from.height;
    const offsetX =
      to.left + to.width / 2 - (from.left + from.width / 2);
    const offsetY =
      to.top + to.height / 2 - (from.top + from.height / 2);

    const settle = image.animate(
      [
        { transform: "none" },
        {
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scaleX}, ${scaleY})`,
        },
      ],
      { duration: 200, easing: "cubic-bezier(0.4, 0, 0.6, 1)", fill: "forwards" },
    );

    settle.finished
      .then(() => setOpenIndex(null))
      .catch(() => setOpenIndex(null));
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
                closing.current = false;
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
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            close();
            return;
          }
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
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
                  onClick={close}
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
