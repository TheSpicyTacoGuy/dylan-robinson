import { GITHUB_URL, LINKEDIN_URL, MAILTO } from "../content";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <nav className="site-footer__links" aria-label="Elsewhere">
          <a href={MAILTO}>Email</a>
          <a href={GITHUB_URL} target="_blank" rel="me noopener noreferrer">
            GitHub
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="me noopener noreferrer">
            LinkedIn
          </a>
          <a href="/resume/">Resume</a>
        </nav>
      </div>
    </footer>
  );
}