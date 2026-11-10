import { useEffect, useState } from "react";
import { CV_URL, sectionIds } from "./content";

/** Tracks which section the reader is looking at, for the spine index. */
export function useActiveSection() {
  const [active, setActive] = useState(sectionIds[0]);

  useEffect(() => {
    const measure = () => {
      const line = window.scrollY + window.innerHeight * 0.35;
      let current = sectionIds[0];

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) return;
        const top = element.getBoundingClientRect().top + window.scrollY;
        if (top <= line) current = id;
      });

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;

      setActive(atBottom ? sectionIds[sectionIds.length - 1] : current);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return active;
}

/**
 * Checks whether the CV file is actually deployed. Hosts often answer a
 * missing file with the SPA shell and a 200, so the content type decides.
 */
export function useCvAvailable() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(CV_URL)
      .then((response) => {
        const type = response.headers.get("content-type") ?? "";
        return response.ok && type.includes("pdf");
      })
      .then((exists) => {
        if (!cancelled) setAvailable(exists);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return available;
}

/**
 * Publishes how far down the page the reader is as `--scroll-progress` on the
 * root element. The spine follows it in CSS, so scrolling never re-renders
 * React.
 */
export function useScrollProgressVar() {
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        progress.toFixed(4),
      );
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
}

/**
 * One scroll loop for every layer that carries `data-parallax`. Each layer says
 * how far it may travel in pixels, and the loop writes a single custom property
 * on it, so the browser only ever does a transform. Layers are queried once and
 * re-queried only when the document height changes, which happens when a
 * project row opens. Reduced motion leaves everything at rest.
 */
export function useParallaxScene() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;
    let layers: HTMLElement[] = [];
    let lastHeight = 0;

    const collect = () => {
      layers = Array.from(
        document.querySelectorAll<HTMLElement>("[data-parallax]"),
      );
      lastHeight = document.documentElement.scrollHeight;
    };

    const update = () => {
      frame = 0;

      if (document.documentElement.scrollHeight !== lastHeight) collect();

      const viewport = window.innerHeight;

      for (const layer of layers) {
        const rect = layer.getBoundingClientRect();

        // Skip anything well outside the viewport. This is the whole reason
        // one loop can carry a dozen layers without costing anything.
        if (rect.bottom < -200 || rect.top > viewport + 200) continue;

        const strength = Number(layer.dataset.parallax) || 0;
        const progress =
          (rect.top + rect.height / 2 - viewport / 2) / viewport;
        const y = Math.max(-1.2, Math.min(1.2, progress)) * strength;

        layer.style.setProperty("--par", `${y.toFixed(2)}px`);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    collect();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
}
