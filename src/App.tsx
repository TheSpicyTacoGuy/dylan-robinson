import { Spine } from "./components/Spine";
import {
  useCvAvailable,
  useParallaxScene,
  useScrollProgressVar,
} from "./hooks";
import { useSectionRouting } from "./lib/nav";
import { Background } from "./sections/Background";
import { Contact } from "./sections/Contact";
import { Facts } from "./sections/Facts";
import { Hero } from "./sections/Hero";
import { History } from "./sections/History";
import { Work } from "./sections/Work";

function App() {
  const hasCv = useCvAvailable();
  useScrollProgressVar();
  useParallaxScene();
  useSectionRouting();

  return (
    <div className="site">
      <button
        type="button"
        className="skip"
        onClick={() => document.getElementById("main")?.focus()}
      >
        Skip to content
      </button>

      <Spine hasCv={hasCv} />

      <main id="main" tabIndex={-1}>
        <Hero hasCv={hasCv} />
        <Work />
        <Facts hasCv={hasCv} />
        <History />
        <Background />
        <Contact hasCv={hasCv} />
      </main>
    </div>
  );
}

export default App;
