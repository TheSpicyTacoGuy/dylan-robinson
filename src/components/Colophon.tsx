export function Colophon() {
  return (
    <footer className="colophon">
      <p>Design by Dylan Robinson, {new Date().getFullYear()}.</p>
      <p>Set in Archivo and IBM Plex.</p>
      <p className="colophon__hint">
        Press <kbd>S</kbd> to switch theme
      </p>
    </footer>
  );
}
