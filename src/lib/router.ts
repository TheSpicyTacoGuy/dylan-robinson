import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { workBySlug } from "../content";

export type Route =
  | { name: "home" }
  | { name: "work" }
  | { name: "workItem"; slug: string }
  | { name: "experience" }
  | { name: "contact" }
  | { name: "notFound" };

const trim = (pathname: string) => pathname.replace(/^\/+|\/+$/g, "");

export const pathForWorkItem = (slug: string) => `/work/${slug}`;

export function parseRoute(pathname: string): Route {
  const path = trim(pathname);
  if (path === "") return { name: "home" };
  if (path === "work") return { name: "work" };
  if (path === "experience") return { name: "experience" };
  if (path === "contact") return { name: "contact" };

  const [section, slug] = path.split("/");
  if (section === "work" && slug && workBySlug.has(slug)) {
    return { name: "workItem", slug };
  }

  return { name: "notFound" };
}

/** The old section paths still exist in links and bookmarks. */
export function legacyTarget(pathname: string): string | null {
  const path = trim(pathname);
  const targets: Record<string, string> = {
    intro: "/",
    facts: "/experience",
    history: "/experience",
    background: "/experience",
    about: "/experience",
  };
  return targets[path] ?? null;
}

const legacyHashes: Record<string, string> = {
  contact: "/contact",
  work: "/work",
  experience: "/experience",
  about: "/experience",
};

/** Runs once before React mounts, so no stale section path ever renders. */
export function normaliseLegacyPath() {
  const target = legacyTarget(window.location.pathname);
  if (target) {
    window.history.replaceState({}, "", target);
    return;
  }

  if (window.location.pathname === "/") {
    const hash = window.location.hash.replace(/^#/, "");
    const hashTarget = legacyHashes[hash];
    if (hashTarget) window.history.replaceState({}, "", hashTarget);
  }
}

export function useRoute() {
  const [location, setLocation] = useState(() => ({
    pathname: window.location.pathname,
    hash: window.location.hash,
  }));

  useEffect(() => {
    const read = () =>
      setLocation({
        pathname: window.location.pathname,
        hash: window.location.hash,
      });

    window.addEventListener("popstate", read);
    window.addEventListener("routechange", read);
    return () => {
      window.removeEventListener("popstate", read);
      window.removeEventListener("routechange", read);
    };
  }, []);

  return {
    route: parseRoute(location.pathname),
    hash: location.hash.replace(/^#/, ""),
  };
}

export function handleLinkClick(event: MouseEvent<HTMLAnchorElement>) {
  if (event.defaultPrevented) return;
  if (event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const anchor = event.currentTarget;
  if (anchor.target && anchor.target !== "_self") return;
  if (anchor.hasAttribute("download")) return;

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return;

  // A same-page anchor is the browser's job.
  if (
    url.pathname === window.location.pathname &&
    url.hash &&
    !anchor.dataset.route
  ) {
    return;
  }

  event.preventDefault();
  const next = `${url.pathname}${url.hash}`;
  if (next === `${window.location.pathname}${window.location.hash}`) return;

  window.history.pushState({}, "", next);
  window.dispatchEvent(new Event("routechange"));
}
