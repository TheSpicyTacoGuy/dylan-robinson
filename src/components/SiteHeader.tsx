import { CV_URL, featuredWork } from "../content";
import { handleLinkClick } from "../lib/router";
import { applyTheme, useTheme } from "../theme";
import { flushSync } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent, PointerEvent as ReactPointerEvent } from "react";

type SiteHeaderProps = {
  hasCv: boolean;
  current?: "work" | "experience" | "contact";
};

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function SiteHeader({ hasCv, current }: SiteHeaderProps) {
  const { resolved, setTheme } = useTheme();
  const isDark = resolved === "dark";
  const navRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const closePreviewTimer = useRef<number | undefined>(undefined);
  const openPreviewTimer = useRef<number | undefined>(undefined);
  const [previewOpen, setPreviewOpen] = useState(false);

  // The strip is a pointer affordance only: it duplicates the four case studies
  // that the Work page already lists, so it stays out of the tab order and is
  // never shown on touch, where the tap goes straight to the page. Opened on a
  // mouse only, and closed on a short delay so the pointer can cross the gap
  // between the link and the strip.
  const cancelPreviewClose = () => {
    if (closePreviewTimer.current) {
      window.clearTimeout(closePreviewTimer.current);
      closePreviewTimer.current = undefined;
    }
  };

  const cancelPreviewOpen = () => {
    if (openPreviewTimer.current) {
      window.clearTimeout(openPreviewTimer.current);
      openPreviewTimer.current = undefined;
    }
  };

  const schedulePreviewClose = () => {
    cancelPreviewOpen();
    cancelPreviewClose();
    closePreviewTimer.current = window.setTimeout(
      () => setPreviewOpen(false),
      160,
    );
  };

  // A short dwell before opening, so crossing Work on the way to another link
  // does not flash the strip open.
  const openPreview = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return;
    cancelPreviewClose();
    cancelPreviewOpen();
    openPreviewTimer.current = window.setTimeout(
      () => setPreviewOpen(true),
      130,
    );
  };

  useEffect(() => {
    setPreviewOpen(false);
    if (openPreviewTimer.current) window.clearTimeout(openPreviewTimer.current);
    if (closePreviewTimer.current) window.clearTimeout(closePreviewTimer.current);
  }, [current]);

  useEffect(
    () => () => {
      if (openPreviewTimer.current) window.clearTimeout(openPreviewTimer.current);
      if (closePreviewTimer.current) window.clearTimeout(closePreviewTimer.current);
    },
    [],
  );

  // The rule under the current section slides between links, so a route change
  // reads as the marker moving instead of one underline vanishing while another
  // appears. Measured from the live links, so it holds through font and width
  // changes without listening to scroll.
  useLayoutEffect(() => {
    const nav = navRef.current;
    const mark = markRef.current;
    if (!nav || !mark) return;

    const place = () => {
      const active = nav.querySelector<HTMLElement>('[aria-current="page"]');
      if (!active) {
        mark.setAttribute("data-idle", "");
        return;
      }
      mark.removeAttribute("data-idle");
      const origin = nav.getBoundingClientRect();
      const box = active.getBoundingClientRect();
      mark.style.setProperty("--nav-mark-x", `${box.left - origin.left}px`);
      mark.style.setProperty("--nav-mark-w", `${box.width}px`);
    };

    place();
    const resize = new ResizeObserver(place);
    resize.observe(nav);
    document.fonts?.ready.then(place).catch(() => undefined);

    return () => resize.disconnect();
  }, [current, hasCv]);

  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? "light" : "dark";
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => {
        ready: Promise<void>;
      };
    };

    if (!doc.startViewTransition || reduce) {
      setTheme(next);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = doc.startViewTransition(() => {
      flushSync(() => {
        applyTheme(next);
        setTheme(next);
      });
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 450,
            easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => undefined);
  };

  return (
    <header
      className="site-header"
      onPointerLeave={schedulePreviewClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") setPreviewOpen(false);
      }}
    >
      <div className="wrap site-header__inner">
        <a
          className="brand"
          href="/"
          onClick={handleLinkClick}
          data-route
          aria-label="Dylan Robinson, home"
        >
          Dylan Robinson
        </a>

        <nav className="site-nav" aria-label="Sections" ref={navRef}>
          <span className="site-nav__mark" aria-hidden="true" ref={markRef} />
          <a
            className="site-nav__link"
            href="/work"
            aria-current={current === "work" ? "page" : undefined}
            onClick={handleLinkClick}
            onPointerEnter={openPreview}
            onPointerLeave={schedulePreviewClose}
            data-route
          >
            Work
          </a>
          <a
            className="site-nav__link"
            href="/experience"
            aria-current={current === "experience" ? "page" : undefined}
            onClick={handleLinkClick}
            data-route
          >
            Experience
          </a>
          <a
            className="site-nav__link"
            href="/contact"
            aria-current={current === "contact" ? "page" : undefined}
            onClick={handleLinkClick}
            data-route
          >
            Contact
          </a>
          {hasCv && (
            <a
              className="site-nav__link site-nav__cv"
              href={CV_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              CV
            </a>
          )}
        </nav>

        <button
          type="button"
          className="icon-button"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      <div
        className={previewOpen ? "nav-preview is-open" : "nav-preview"}
        aria-hidden="true"
        inert={!previewOpen}
        onPointerEnter={cancelPreviewClose}
        onPointerLeave={schedulePreviewClose}
      >
        <div className="wrap">
          <ul className="nav-preview__list">
            {featuredWork.map((item) => (
              <li key={item.slug}>
                <a
                  className="nav-preview__link"
                  href={`/work/${item.slug}`}
                  onClick={handleLinkClick}
                  data-route
                >
                  <span className="nav-preview__title">{item.title}</span>
                  <span className="nav-preview__year">{item.when}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
