import { Colophon } from "./components/Colophon";
import { Rail } from "./components/Rail";
import { useCvAvailable } from "./hooks";
import { Contact } from "./sections/Contact";
import { History } from "./sections/History";
import { Intro } from "./sections/Intro";
import { Study } from "./sections/Study";
import { Work } from "./sections/Work";

function App() {
  const hasCv = useCvAvailable();

  return (
    <div className="frame">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <Rail hasCv={hasCv} />

      <div className="sheet">
        <main id="main" tabIndex={-1}>
          <Intro />
          <Work />
          <History />
          <Study />
          <Contact hasCv={hasCv} />
        </main>

        <Colophon />
      </div>
    </div>
  );
}

export default App;
