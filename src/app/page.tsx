import GameCanvas from "@/components/GameCanvas";

export default function Home() {
  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="/" aria-label="Udder Blooder home">
          <span className="brand-mark">U</span>
          <span>UDDER <b>BLOODER</b></span>
        </a>
        <div className="topbar-right">
          <span className="build-label">EARLY ACCESS</span>
          <span className="status"><i /> SYSTEM ONLINE</span>
        </div>
      </header>

      <section className="main-content">
        <div className="intro-row">
          <div className="hero">
            <div className="eyebrow"><span /> A TOP-DOWN ARCADE EXPERIENCE</div>
            <h1>NO ONE<br /><em>GETS OUT</em><br />CLEAN.</h1>
            <p>Entra. Explora. Sobrevive a lo que hay dentro.</p>
          </div>
          <aside className="brief-card">
            <span className="brief-kicker">CURRENT SCENARIO</span>
            <strong>RESIDENCE 01</strong>
            <p>Una casa. Habitaciones desconocidas. Cada puerta cambia el recorrido.</p>
            <div className="brief-meta"><span>01</span><span>TRAINING BUILD</span></div>
          </aside>
        </div>

        <section className="game-panel">
          <div className="game-header">
            <div className="game-title"><span className="live-dot" /> <strong>RESIDENCE / TRAINING</strong></div>
            <div className="game-coords">ABRAHAM <span>•</span> SOLO SESSION</div>
          </div>
          <GameCanvas />
          <div className="game-footer">
            <div><b>WASD</b> MOVE <b>SHIFT</b> SPRINT <b>SPACE</b> PUNCH</div>
            <div><b>E</b> OPEN <b>F</b> KICK DOOR <b>1–3</b> LOADOUT</div>
          </div>
        </section>

        <footer className="bottom-note">
          <span>UDDER BLOODER <i>—</i> DEVELOPMENT BUILD</span>
          <span>CHARACTER SYSTEM: ABRAHAM</span>
        </footer>
      </section>
    </main>
  );
}
