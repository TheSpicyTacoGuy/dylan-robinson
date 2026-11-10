import { RingTimeline } from "../components/RingTimeline";

export function History() {
  return (
    <section className="band band--bark" id="history">
      <div className="band__inner">
        <header className="band__head">
          <h2 className="band__title">History</h2>
          <p className="band__note">The work so far, one ring for each year.</p>
        </header>

        <RingTimeline />
      </div>
    </section>
  );
}
