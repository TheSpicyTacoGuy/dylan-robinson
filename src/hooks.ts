import { useEffect, useState } from "react";
import { CV_URL } from "./content";

/**
 * Keeps the field instant while the answer waits for a pause, so a set of
 * results is revealed once rather than restarted on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delay = 120) {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return settled;
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
