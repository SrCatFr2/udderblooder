"use client";

import { useEffect, useRef } from "react";

type Direction = "up" | "down" | "left" | "right";

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let game: any = null;
    let cancelled = false;

    async function startGame() {
      const [{ default: Phaser }, { default: GameScene }] =
        await Promise.all([
          import("phaser"),
          import("@/game/scenes/GameScene"),
        ]);

      if (cancelled || !containerRef.current) return;

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: 1280,
        height: 720,
        backgroundColor: "#17191c",
        pixelArt: true,
        antialias: false,

        physics: {
          default: "arcade",
          arcade: {
            debug: false,
          },
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

      if (game) {
        game.destroy(true);
      }
    };
  }, []);

  function sendDirection(direction: Direction | null) {
    const vectors = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };

    const value = direction
      ? vectors[direction]
      : { x: 0, y: 0 };

    window.dispatchEvent(
      new CustomEvent("udder:move", {
        detail: value,
      }),
    );
  }

  function action(name: string) {
    window.dispatchEvent(new Event(`udder:${name}`));
  }

  const control = (
    direction: Direction,
    label: string,
    className: string,
  ) => (
    <button
      type="button"
      className={className}
      aria-label={label}
      onPointerDown={(event) => {
        event.preventDefault();
        sendDirection(direction);
      }}
      onPointerUp={() => sendDirection(null)}
      onPointerLeave={() => sendDirection(null)}
      onPointerCancel={() => sendDirection(null)}
    >
      {direction === "up" && "↑"}
      {direction === "down" && "↓"}
      {direction === "left" && "←"}
      {direction === "right" && "→"}
    </button>
  );

  const actionStyle = {
    width: 64,
    height: 64,
    borderRadius: "50%",
    border: "1px solid #ffffff55",
    background: "#17131be0",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 800,
    touchAction: "none" as const,
    userSelect: "none" as const,
  };

  return (
    <div
      className="game-container"
      ref={containerRef}
      aria-label="Udder Blooder game"
    >
      <div className="control-pad">
        {control("up", "Arriba", "control-up")}
        {control("left", "Izquierda", "control-left")}
        {control("down", "Abajo", "control-down")}
        {control("right", "Derecha", "control-right")}
      </div>

      <div
        style={{
          position: "absolute",
          right: 18,
          bottom: 20,
          display: "flex",
          gap: 10,
          zIndex: 10,
        }}
      >
        <button
          type="button"
          style={actionStyle}
          onPointerDown={(event) => {
            event.preventDefault();
            action("interact");
          }}
        >
          USE
        </button>

        <button
          type="button"
          style={{
            ...actionStyle,
            borderColor: "#e74b55",
            background: "#8d2735e8",
          }}
          onPointerDown={(event) => {
            event.preventDefault();
            action("attack");
          }}
        >
          ACT
        </button>
      </div>
    </div>
  );
}
