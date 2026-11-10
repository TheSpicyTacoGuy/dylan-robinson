import { createHash } from "node:crypto";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

/**
 * Adds a Content-Security-Policy to the built page. The only inline script is
 * the theme bootstrap in index.html, so its hash is computed from the built
 * HTML rather than kept by hand. Build only: the dev server injects its own
 * inline scripts for hot reloading.
 */
function inlineCsp(): Plugin {
  return {
    name: "inline-csp",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const inline = html.match(/<script>([\s\S]*?)<\/script>/);
        if (!inline) return html;

        const hash = createHash("sha256")
          .update(inline[1], "utf8")
          .digest("base64");

        const policy = [
          "default-src 'self'",
          `script-src 'self' 'sha256-${hash}'`,
          "style-src 'self' 'unsafe-inline'",
          "font-src 'self'",
          "img-src 'self' data:",
          "connect-src 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "object-src 'none'",
        ].join("; ");

        return html.replace(
          "</head>",
          `    <meta http-equiv="Content-Security-Policy" content="${policy}" />\n  </head>`,
        );
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), inlineCsp()],
});
