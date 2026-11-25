import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { normaliseLegacyPath } from "./lib/router";
import { initTheme } from "./theme";
import "./index.css";

// Apply theme as early as possible to avoid flash of unstyled theme.
initTheme();
normaliseLegacyPath();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
