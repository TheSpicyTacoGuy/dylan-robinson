import { useEffect } from "react";
import { CV_URL, EMAIL, sections } from "../content";
import { useActiveSection } from "../hooks";
import { useTheme } from "../theme";

type SpineProps = {
  hasCv: boolean;
};

function MoonIcon() {
  return (
    <svg
      width="15"
      height="15"
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
      width="15"
      height="15"
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

export function Spine({ hasCv }: SpineProps) {
  const active = useActiveSection();
  const { resolved, setTheme, cycleTheme } = useTheme();
  const isDark = resolved === "dark";

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "s") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        (target instanceof HTMLInputElement && target.type !== "checkbox") ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      event.preventDefault();
      cycleTheme();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cycleTheme]);

  return (
    <aside className="spine">
      <a
        className="spine__mark"
        href="#intro"
        aria-label="Dylan Robinson, back to top"
      >
        DR
      </a>

      <nav className="spine__nav" aria-label="Sections">
        {sections.map((section) => {
          const isActive = section.id === active;

          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={isActive ? "spine__link is-active" : "spine__link"}
              aria-current={isActive ? "location" : undefined}
            >
              <span className="spine__label">{section.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="spine__foot">
        <button
          type="button"
          className="spine__control"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
          <span aria-hidden="true">{isDark ? "Light" : "Dark"}</span>
        </button>

        <a
          className="spine__control spine__control--link"
          href={`mailto:${EMAIL}`}
        >
          Email
        </a>

        {hasCv && (
          <a
            className="spine__control spine__control--link"
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            CV
          </a>
        )}
      </div>

      <span className="spine__progress" aria-hidden="true" />
      <span className="spine__progress-h" aria-hidden="true" />
    </aside>
  );
}
