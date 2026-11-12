import { useEffect } from "react";
import type { MouseEvent } from "react";
import { sectionIds } from "../content";

const homeId = sectionIds[0];

/** `/work`, or `/` for the first section. No hashes anywhere. */
export function pathFor(sectionId: string) {
  return sectionId === homeId ? "/" : `/${sectionId}`;
}

/** The section a path points at, or null for the home page. */
export function sectionFromPath(pathname: string) {
  const clean = pathname.replace(/^\/+|\/+$/g, "");
  return sectionIds.includes(clean) ? clean : null;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToSection(sectionId: string, smooth: boolean) {
  const element = document.getElementById(sectionId);
  if (!element) return;
  element.scrollIntoView({
    behavior: smooth && !prefersReducedMotion() ? "smooth" : "auto",
    block: "start",
  });
}

/**
 * Section links are real links, so they navigate on their own without
 * JavaScript and can be opened in a new tab. This only upgrades the common
 * case into a scroll instead of a page load, and keeps the address bar on the
 * plain path.
 */
export function onSectionClick(
  event: MouseEvent<HTMLAnchorElement>,
  sectionId: string,
) {
  if (event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const path = pathFor(sectionId);
  event.preventDefault();

  if (window.location.pathname !== path) {
    window.history.pushState({}, "", path);
  }

  scrollToSection(sectionId, true);
}

/**
 * Lands on the right section when someone opens `/work` directly or uses the
 * back button. The second pass runs after the portrait has settled, because a
 * late image load moves every section below the hero.
 */
export function useSectionRouting() {
  useEffect(() => {
    const apply = (smooth: boolean) => {
      const sectionId = sectionFromPath(window.location.pathname);
      if (sectionId) scrollToSection(sectionId, smooth);
    };

    const frame = requestAnimationFrame(() => apply(false));
    const timer = window.setTimeout(() => apply(false), 260);

    const onPopState = () => apply(true);
    window.addEventListener("popstate", onPopState);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);
}
