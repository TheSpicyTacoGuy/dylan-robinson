export function Colophon() {
  return (
    <footer className="colophon">
      <p>Design by Dylan Robinson, {new Date().getFullYear()}.</p>
      <p>Set in Martian Mono, IBM Plex Sans and JetBrains Mono.</p>
      <p>React and hand-written CSS. No UI kit, no animation library.</p>
      <p className="colophon__hint">
        Press <kbd>S</kbd> to switch theme
      </p>
    </footer>
  );
}
