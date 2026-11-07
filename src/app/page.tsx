import GameCanvas from "@/components/GameCanvas";

export default function Home() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          UDDER <span>BLOODER</span>
        </div>

        <div className="status">
          <span className="status-dot" />
          PROTOTYPE BUILD 0.1
        </div>
      </header>

      <section className="main-content">
        <div className="hero">
          <div className="eyebrow">EARLY DEVELOPMENT</div>

          <h1>
            ENTER THE
            <br />
            UNKNOWN.
          </h1>

          <p>
            Explora. Encuentra objetos. Descubre qué hay dentro.
          </p>
        </div>

        <section className="game-panel">
          <div className="game-header">
            <strong>INTRUDER // TRAINING</strong>
            <span>RESIDENCE 01</span>
          </div>

          <GameCanvas />

          <div className="game-footer">
            <span>WASD / FLECHAS PARA MOVERTE</span>
            <span>OBJETOS: 5 DISPONIBLES</span>
          </div>
        </section>
      </section>
    </main>
  );
}
