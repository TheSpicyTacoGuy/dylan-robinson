import { useEffect } from "react";
import { GITHUB_URL, LINKEDIN_URL } from "../content";
import { useTheme } from "../theme";

export function Colophon() {
  const { resolved, setTheme, cycleTheme } = useTheme();
  const isDark = resolved === "dark";

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "s") return;
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        (target instanceof HTMLInputElement && target.type !== "checkbox") ||
        target instanceof HTMLTextAreaElement
      )
        return;
      event.preventDefault();
      cycleTheme();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cycleTheme]);

  return (
    <footer className="colophon">
      <div className="colophon__links">
        <a
          className="icon-link"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0.297C5.373 0.297 0 5.67 0 12.297c0 5.29 3.438 9.773 8.205 11.366.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.045.138 3.003.404 2.29-1.553 3.296-1.23 3.296-1.23.656 1.653.244 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.92.43.37.815 1.102.815 2.222 0 1.605-.015 2.898-.015 3.293 0 .319.216.694.825.576C20.565 22.065 24 17.584 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </a>

        <a
          className="icon-link"
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M4.98 3.5C4.98 5.43 3.43 7 1.5 7S-2 5.43-2 3.5 0.57 0 2.5 0 4.98 1.57 4.98 3.5zM.02 8H5V24H.02V8zM8.5 8H13.3v2.15h.07c.66-1.25 2.28-2.57 4.69-2.57 5.01 0 5.94 3.3 5.94 7.6V24h-4.98V15.3c0-2.06-.04-4.7-2.86-4.7-2.87 0-3.3 2.24-3.3 4.56V24H8.5V8z" />
          </svg>
        </a>
      </div>

      <div className="colophon__meta">
        <button
          type="button"
          className="colophon__theme"
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? "Light mode" : "Dark mode"}
        </button>

        <p className="colophon__hint">
          Press <kbd>S</kbd> to switch
        </p>
      </div>
    </footer>
  );
}
