import { handleLinkClick } from "../lib/router";

export function NotFound() {
  return (
    <div className="wrap page-head">
      <h1>Nothing here</h1>
      <p>
        That address does not match a page on this site. The work is still one
        click away.
      </p>
      <p>
        <a
          className="link-quiet"
          href="/"
          onClick={handleLinkClick}
          data-route
        >
          Back to the start
        </a>
      </p>
    </div>
  );
}
