"use client";

import { useEffect, useRef } from "react";

type Direction = "up" | "down" | "left" | "right";

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let game: any = null;
    let cancelled = false;

    async function startGame() {
      const [phaserModule, sceneModule] = await Promise.all([
        import("phaser"),
        import("@/game/scenes/GameScene"),
      ]);
      const Phaser = (phaserModule as any).default ?? phaserModule;
      const GameScene = sceneModule.default;

      if (cancelled || !containerRef.current) return;

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: 1280,
        height: 720,
        backgroundColor: "#171a20",
        pixelArt: true,
        antialias: false,
        roundPixels: true,
        physics: {
          default: "arcade",
          arcade: { debug: false },
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: [GameScene],
      });
    }

    startGame().catch((error) => {
      console.error("Error iniciando Udder Blooder:", error);
    });

    return () => {
      cancelled = true;
      if (game) game.destroy(true);
    };
  }, []);

  function sendDirection(direction: Direction | null) {
    const vectors = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };
    const value = direction ? vectors[direction] : { x: 0, y: 0 };
    window.dispatchEvent(new CustomEvent("udder:move", { detail: value }));
  }

  function action(name: string) {
    window.dispatchEvent(new Event(`udder:${name}`));
  }

  const control = (direction: Direction, label: string, className: string) => (
    <button
      type="button"
      className={`touch-control ${className}`}
      aria-label={label}
      onPointerDown={(event) => {
        event.preventDefault();
        (event.currentTarget as HTMLButtonElement).setPointerCapture(event.pointerId);
        sendDirection(direction);
      }}
      onPointerUp={() => sendDirection(null)}
      onPointerCancel={() => sendDirection(null)}
      onLostPointerCapture={() => sendDirection(null)}
    >
      {direction === "up" && "↑"}
      {direction === "down" && "↓"}
      {direction === "left" && "←"}
      {direction === "right" && "→"}
    </button>
  );

  const actionButton = (name: string, label: string, className: string) => (
    <button
      type="button"
      className={`action-control ${className}`}
      onPointerDown={(event) => {
        event.preventDefault();
        action(name);
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="game-container" ref={containerRef} aria-label="Udder Blooder game">
      <div className="mobile-controls">
        <div className="control-pad">
          {control("up", "Arriba", "control-up")}
          {control("left", "Izquierda", "control-left")}
          {control("down", "Abajo", "control-down")}
          {control("right", "Derecha", "control-right")}
        </div>
        <div className="action-pad">
          {actionButton("interact", "USE", "use")}
          {actionButton("kick", "KICK", "kick")}
          {actionButton("attack", "PUNCH", "attack")}
        </div>
      </div>
    </div>
  );
}
