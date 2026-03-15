import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initTheme } from "./theme";
import "./index.css";

// Apply theme as early as possible to avoid flash of unstyled theme.
initTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
