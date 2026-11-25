import { useEffect, useState } from "react";
import { CV_URL } from "./content";

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
