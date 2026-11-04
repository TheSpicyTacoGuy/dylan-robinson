import { useEffect, useState } from "react";
import { CV_URL, sectionIds } from "./content";

/** Tracks which section the reader is looking at, for the rail index. */
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
