"use client";

import { useEffect, useRef } from "react";

type Direction = "up" | "down" | "left" | "right";

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);

  useEffect(() => {
    let game: any;
    let cancelled = false;

    async function startGame() {
      const Phaser = (await import("phaser")).default;

      if (cancelled || !containerRef.current) return;

      class HouseScene extends Phaser.Scene {
        private player!: Phaser.Physics.Arcade.Sprite;
        private cursors!: any;
        private keys!: any;
        private touchDirection = { x: 0, y: 0 };
        private collected = 0;
        private counterText!: Phaser.GameObjects.Text;

        constructor() {
          super("HouseScene");
        }

        create() {
          const width = 960;
          const height = 540;

          this.cameras.main.setBounds(0, 0, width, height);
          this.physics.world.setBounds(0, 0, width, height);

          // Suelo
          const floor = this.add.graphics();
          floor.fillStyle(0x292b2d);
          floor.fillRect(0, 0, width, height);

          // Cuadrícula del suelo
          floor.lineStyle(1, 0xffffff, 0.035);

          for (let x = 0; x <= width; x += 48) {
            floor.lineBetween(x, 0, x, height);
          }

          for (let y = 0; y <= height; y += 48) {
            floor.lineBetween(0, y, width, y);
          }

          // Habitaciones y zonas
          this.drawRoom(35, 35, 330, 205, 0x343638);
          this.drawRoom(390, 35, 535, 205, 0x303234);
          this.drawRoom(35, 280, 250, 220, 0x303234);
          this.drawRoom(315, 280, 300, 220, 0x343638);
          this.drawRoom(645, 280, 280, 220, 0x303234);

          // Paredes exteriores
          const walls: Phaser.GameObjects.Rectangle[] = [];

          const addWall = (
            x: number,
            y: number,
            w: number,
            h: number,
          ) => {
            const wall = this.add.rectangle(
              x + w / 2,
              y + h / 2,
              w,
              h,
              0x777477,
            );

            wall.setStrokeStyle(2, 0xaaa4a4);
            this.physics.add.existing(wall, true);
            walls.push(wall);
          };

          // Paredes exteriores con espacios de paso
          addWall(20, 20, 920, 15);
          addWall(20, 505, 920, 15);
          addWall(20, 20, 15, 500);
          addWall(925, 20, 15, 500);

          // Separaciones interiores
          addWall(365, 35, 12, 85);
          addWall(365, 165, 12, 75);
          addWall(390, 240, 535, 12);
          addWall(35, 240, 115, 12);
          addWall(205, 240, 160, 12);
          addWall(285, 280, 12, 90);
          addWall(285, 425, 12, 75);
          addWall(615, 280, 12, 90);
          addWall(615, 425, 12, 75);

          // Muebles decorativos y obstáculos
          this.drawFurniture(110, 100, 100, 55, 0x5a4844);
          this.drawFurniture(480, 85, 130, 65, 0x66534a);
          this.drawFurniture(710, 90, 95, 45, 0x4e565c);
          this.drawFurniture(90, 350, 85, 45, 0x56504a);
          this.drawFurniture(390, 350, 110, 55, 0x5d4943);
          this.drawFurniture(730, 365, 100, 60, 0x56504a);

          // Colisiones de muebles
          const furniturePositions = [
            [110, 100, 100, 55],
            [480, 85, 130, 65],
            [710, 90, 95, 45],
            [90, 350, 85, 45],
            [390, 350, 110, 55],
            [730, 365, 100, 60],
          ];

          for (const [x, y, w, h] of furniturePositions) {
            const obstacle = this.add.rectangle(
              x + w / 2,
              y + h / 2,
              w - 8,
              h - 8,
              0xffffff,
              0,
            );

            this.physics.add.existing(obstacle, true);
            walls.push(obstacle);
          }

          // Crear jugador
          this.player = this.physics.add.sprite(
            170,
            190,
            "__WHITE",
          );

          this.player.setDisplaySize(22, 28);
          this.player.setTint(0xe8d8bd);
          this.player.setCollideWorldBounds(true);
          this.player.setDepth(10);

          // Sombra del jugador
          const shadow = this.add.ellipse(
            170,
            204,
            25,
            10,
            0x000000,
            0.35,
          );

          shadow.setDepth(9);

          this.player.on("destroy", () => shadow.destroy());

          // Mantener sombra debajo del jugador
          this.events.on("update", () => {
            if (this.player.active) {
              shadow.setPosition(
                this.player.x,
                this.player.y + 13,
              );
            }
          });

          // Colisiones
          for (const wall of walls) {
            this.physics.add.collider(this.player, wall);
          }

          // Objetos coleccionables
          const items = [
            this.createItem(330, 160),
            this.createItem(550, 190),
            this.createItem(790, 180),
            this.createItem(480, 455),
            this.createItem(840, 450),
          ];

          this.physics.add.overlap(
            this.player,
            items,
            (_player, item) => {
              const collectible = item as Phaser.GameObjects.Arc;

              if (!collectible.active) return;

              collectible.destroy();
              this.collected++;

              this.counterText.setText(
                `OBJETOS ENCONTRADOS: ${this.collected}/5`,
              );
            },
          );

          // Controles
          this.cursors = this.input.keyboard?.createCursorKeys();

          this.keys = this.input.keyboard?.addKeys(
            "W,A,S,D",
          );

          // Cámara
          this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

          // Interfaz del juego
          this.add
            .text(25, 25, "RESIDENCE / 01", {
              fontFamily: "Arial",
              fontSize: "13px",
              color: "#ffffff",
              fontStyle: "bold",
            })
            .setScrollFactor(0)
            .setDepth(100);

          this.counterText = this.add
            .text(25, 45, "OBJETOS ENCONTRADOS: 0/5", {
              fontFamily: "Arial",
              fontSize: "10px",
              color: "#d5c9c9",
            })
            .setScrollFactor(0)
            .setDepth(100);

          // Recibir controles táctiles
          const handleTouch = (event: Event) => {
            const custom = event as CustomEvent<{
              x: number;
              y: number;
            }>;

            this.touchDirection = custom.detail;
          };

          window.addEventListener("udder:move", handleTouch);

          this.events.once("shutdown", () => {
            window.removeEventListener("udder:move", handleTouch);
          });
        }

        drawRoom(
          x: number,
          y: number,
          width: number,
          height: number,
          color: number,
        ) {
          const room = this.add.rectangle(
            x + width / 2,
            y + height / 2,
            width,
            height,
            color,
          );

          room.setStrokeStyle(1, 0xffffff, 0.08);
        }

        drawFurniture(
          x: number,
          y: number,
          width: number,
          height: number,
          color: number,
        ) {
          const furniture = this.add.rectangle(
            x + width / 2,
            y + height / 2,
            width,
            height,
            color,
          );

          furniture.setStrokeStyle(2, 0x171719);
          furniture.setDepth(3);

          this.add.rectangle(
            x + width / 2,
            y + height - 4,
            width - 12,
            5,
            0x000000,
            0.18,
          ).setDepth(4);
        }

        createItem(x: number, y: number) {
          const item = this.add.circle(
            x,
            y,
            9,
            0xd6b75e,
          );

          item.setStrokeStyle(2, 0xffe6a1);
          item.setDepth(5);

          this.physics.add.existing(item);
          (item.body as Phaser.Physics.Arcade.Body).setCircle(9);

          return item;
        }

        update() {
          const speed = 155;
          let x = 0;
          let y = 0;

          if (this.cursors.left.isDown || this.keys.A.isDown) {
            x -= 1;
          }

          if (this.cursors.right.isDown || this.keys.D.isDown) {
            x += 1;
          }

          if (this.cursors.up.isDown || this.keys.W.isDown) {
            y -= 1;
          }

          if (this.cursors.down.isDown || this.keys.S.isDown) {
            y += 1;
          }

          x += this.touchDirection.x;
          y += this.touchDirection.y;

          const length = Math.hypot(x, y);

          if (length > 0) {
            x /= length;
            y /= length;
          }

          this.player.setVelocity(x * speed, y * speed);
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: 960,
        height: 540,
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
        scene: [HouseScene],
      });

      gameRef.current = game;
    }

    startGame();

    return () => {
      cancelled = true;

      if (game) {
        game.destroy(true);
      }

      gameRef.current = null;
    };
  }, []);

  const setDirection = (direction: Direction | null) => {
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
  };

  const control = (direction: Direction, label: string, className: string) => (
    <button
      className={className}
      aria-label={label}
      onPointerDown={(event) => {
        event.preventDefault();
        setDirection(direction);
      }}
      onPointerUp={() => setDirection(null)}
      onPointerLeave={() => setDirection(null)}
      onPointerCancel={() => setDirection(null)}
    >
      {direction === "up" && "↑"}
      {direction === "down" && "↓"}
      {direction === "left" && "←"}
      {direction === "right" && "→"}
    </button>
  );

  return (
    <div className="game-container" ref={containerRef}>
      <div className="control-pad">
        {control("up", "Arriba", "control-up")}
        {control("left", "Izquierda", "control-left")}
        {control("down", "Abajo", "control-down")}
        {control("right", "Derecha", "control-right")}
      </div>
    </div>
  );
}
