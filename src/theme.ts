import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "theme-preference";

// Must track the --background tokens in src/index.css so browser chrome
// (address bar, scrollbars) matches the page instead of the wrong theme.
const THEME_COLOR = { light: "#f6f2e8", dark: "#2b241d" } as const;

const applyThemeColor = (mode: "light" | "dark") => {
  let meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = THEME_COLOR[mode];
};

const getSystemTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export const resolveTheme = (mode: ThemeMode) =>
  mode === "system" ? getSystemTheme() : mode;

export const applyTheme = (mode: ThemeMode) => {
  const resolved = resolveTheme(mode);
  const html = document.documentElement;

  html.classList.toggle("dark", resolved === "dark");
  html.classList.toggle("light", resolved === "light");
  html.dataset.theme = resolved;

  applyThemeColor(resolved);

  return resolved;
};

export const getStoredTheme = (): ThemeMode | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "light" || value === "dark" || value === "system") {
      return value;
    }
  } catch {
    // ignore
  }
  return null;
};

export const setStoredTheme = (value: ThemeMode) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // ignore
  }
};

export const initTheme = () => {
  const stored = getStoredTheme();
  const mode: ThemeMode = stored ?? "system";

  applyTheme(mode);

  if (mode === "system") {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }

    // Fallback for older browsers
    type LegacyMediaQueryList = MediaQueryList & {
      addListener?: (
        listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void,
      ) => void;
      removeListener?: (
        listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void,
      ) => void;
    };

    const mqLegacy = mq as LegacyMediaQueryList;

    if (typeof mqLegacy.addListener === "function") {
      mqLegacy.addListener(onChange);
      return () => {
        mqLegacy.removeListener?.(onChange);
      };
    }
  }

  return () => undefined;
};

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>(
    () => getStoredTheme() ?? "system",
  );

  useEffect(() => {
    applyTheme(theme);
    setStoredTheme(theme);

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = () => applyTheme("system");
      mq.addEventListener?.("change", onChange);
      return () => mq.removeEventListener?.("change", onChange);
    }

    return undefined;
  }, [theme]);

  const cycleTheme = useCallback(() => {
    setTheme((current) =>
      current === "light" ? "dark" : current === "dark" ? "system" : "light",
    );
  }, []);

  const resolved = theme === "system" ? getSystemTheme() : theme;

  return { theme, resolved, isDark: resolved === "dark", setTheme, cycleTheme };
};
