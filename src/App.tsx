import { Spine } from "./components/Spine";
import { useCvAvailable, useParallaxScene, useScrollProgressVar } from "./hooks";
import { Background } from "./sections/Background";
import { Contact } from "./sections/Contact";
import { Hero } from "./sections/Hero";
import { History } from "./sections/History";
import { Work } from "./sections/Work";

function App() {
  const hasCv = useCvAvailable();
  useScrollProgressVar();
  useParallaxScene();

  return (
    <div className="site">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <Spine hasCv={hasCv} />

      <main id="main" tabIndex={-1}>
        <Hero hasCv={hasCv} />
        <Work />
        <History />
        <Background />
        <Contact hasCv={hasCv} />
      </main>
    </div>
  );
}

export default App;
