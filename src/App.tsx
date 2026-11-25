import { useEffect, useRef } from "react";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { SITE_URL, workBySlug } from "./content";
import { useCvAvailable } from "./hooks";
import { useRoute, type Route } from "./lib/router";
import { Contact } from "./pages/Contact";
import { Experience } from "./pages/Experience";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { WorkIndex } from "./pages/WorkIndex";
import { WorkItemPage } from "./pages/WorkItem";

const defaultDescription =
  "Software developer in the Yarra Valley. I build the CTRL Accounting tax return app and the Four Seasons Horse Rugs site and admin. Open to roles in Melbourne or remote.";

function shorten(value: string, limit = 155) {
  if (value.length <= limit) return value;
  const cut = value.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(" "))}...`;
}

function metaFor(route: Route) {
  if (route.name === "work") {
    return {
      title: "Work, Dylan Robinson",
      description:
        "Four detailed case studies, plus selected client, university and open-source work by Dylan Robinson, a software developer in the Yarra Valley.",
    };
  }

  if (route.name === "experience") {
    return {
      title: "Experience, Dylan Robinson",
      description:
        "Software developer in the Yarra Valley. Experience at CTRL Accounting, Powelltown Sawmills and Technology2You, study at Swinburne, and the tools used day to day.",
    };
  }

  if (route.name === "contact") {
    return {
      title: "Contact, Dylan Robinson",
      description:
        "Email Dylan Robinson, a software developer in the Yarra Valley, about full time roles in Melbourne or remote.",
    };
  }

  if (route.name === "workItem") {
    const item = workBySlug.get(route.slug);
    if (item) {
      return {
        title: `${item.title}, Dylan Robinson`,
        description: shorten(item.summary),
      };
    }
  }

  if (route.name === "notFound") {
    return {
      title: "Nothing here, Dylan Robinson",
      description: "That address does not match a page on this site.",
    };
  }

  return {
    title: "Dylan Robinson, software developer",
    description: defaultDescription,
  };
}

function setMeta(name: string, content: string, attribute = "name") {
  const element = document.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${name}"]`,
  );
  if (element) element.content = content;
}

function App() {
  const hasCv = useCvAvailable();
  const { route, hash } = useRoute();
  const mainRef = useRef<HTMLElement>(null);
  const lastKey = useRef<string | null>(null);

  const key =
    route.name === "workItem"
      ? `work/${route.slug}`
      : route.name === "notFound"
        ? "not-found"
        : route.name;

  const canonicalPath =
    route.name === "home"
      ? "/"
      : route.name === "work"
        ? "/work"
        : route.name === "experience"
          ? "/experience"
          : route.name === "contact"
            ? "/contact"
            : route.name === "workItem"
              ? `/work/${route.slug}`
              : "/";

  const meta = metaFor(route);

  useEffect(() => {
    document.title = meta.title;
    setMeta("description", meta.description);
    setMeta("og:title", meta.title, "property");
    setMeta("og:description", meta.description, "property");
    setMeta("og:url", `${SITE_URL}${canonicalPath}`, "property");

    const canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (canonical) canonical.href = `${SITE_URL}${canonicalPath}`;
  }, [meta.title, meta.description, canonicalPath]);

  useEffect(() => {
    const changed = lastKey.current !== null && lastKey.current !== key;
    lastKey.current = key;

    if (hash) {
      const target = document.getElementById(hash);
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: "start" });
      }
    } else {
      window.scrollTo(0, 0);
      if (changed) mainRef.current?.focus({ preventScroll: true });
    }
  }, [key, hash]);

  return (
    <div className="site">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <SiteHeader
        hasCv={hasCv}
        current={
          key === "work" || key.startsWith("work/")
            ? "work"
            : key === "experience"
              ? "experience"
              : key === "contact"
                ? "contact"
                : undefined
        }
      />

      <main id="main" tabIndex={-1} ref={mainRef}>
        <div className="page" key={key}>
          {route.name === "home" && <Home hasCv={hasCv} />}
          {route.name === "work" && <WorkIndex />}
          {route.name === "workItem" && (
            <WorkItemPage item={workBySlug.get(route.slug)!} />
          )}
          {route.name === "experience" && <Experience hasCv={hasCv} />}
          {route.name === "contact" && <Contact hasCv={hasCv} />}
          {route.name === "notFound" && <NotFound />}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default App;
