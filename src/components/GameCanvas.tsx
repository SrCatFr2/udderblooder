"use client";

import { useEffect, useRef } from "react";

type Direction = "up" | "down" | "left" | "right";

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let game: any = null;
    let cancelled = false;

    async function startGame() {
      const Phaser = (await import("phaser")).default;

      if (cancelled || !containerRef.current) return;

      class HouseScene extends Phaser.Scene {
        private player: any;
        private cursors: any;
        private keys: any;
        private obstacles: any;
        private touchDirection = { x: 0, y: 0 };
        private collected = 0;
        private counterText: any;
        private shadow: any;

        constructor() {
          super("HouseScene");
        }

        create() {
          const width = 960;
          const height = 540;

          this.physics.world.setBounds(0, 0, width, height);
          this.cameras.main.setBounds(0, 0, width, height);

          this.obstacles = this.physics.add.staticGroup();

          // Suelo principal
          const floor = this.add.graphics();

          floor.fillStyle(0x292b2d);
          floor.fillRect(0, 0, width, height);

          // Cuadrícula sutil
          floor.lineStyle(1, 0xffffff, 0.035);

          for (let x = 0; x <= width; x += 48) {
            floor.lineBetween(x, 0, x, height);
          }

          for (let y = 0; y <= height; y += 48) {
            floor.lineBetween(0, y, width, y);
          }

          // Habitaciones
          this.drawRoom(35, 35, 330, 205, 0x343638);
          this.drawRoom(390, 35, 535, 205, 0x303234);
          this.drawRoom(35, 280, 250, 220, 0x303234);
          this.drawRoom(315, 280, 300, 220, 0x343638);
          this.drawRoom(645, 280, 280, 220, 0x303234);

          // Paredes exteriores
          this.addWall(20, 20, 920, 15);
          this.addWall(20, 505, 920, 15);
          this.addWall(20, 20, 15, 500);
          this.addWall(925, 20, 15, 500);

          // Separaciones interiores
          this.addWall(365, 35, 12, 85);
          this.addWall(365, 165, 12, 75);

          this.addWall(390, 240, 535, 12);
          this.addWall(35, 240, 115, 12);
          this.addWall(205, 240, 160, 12);

          this.addWall(285, 280, 12, 90);
          this.addWall(285, 425, 12, 75);

          this.addWall(615, 280, 12, 90);
          this.addWall(615, 425, 12, 75);

          // Muebles
          this.drawFurniture(110, 100, 100, 55, 0x5a4844);
          this.drawFurniture(480, 85, 130, 65, 0x66534a);
          this.drawFurniture(710, 90, 95, 45, 0x4e565c);
          this.drawFurniture(90, 350, 85, 45, 0x56504a);
          this.drawFurniture(390, 350, 110, 55, 0x5d4943);
          this.drawFurniture(730, 365, 100, 60, 0x56504a);

          // Muebles sólidos
          this.addWall(114, 104, 92, 47);
          this.addWall(484, 89, 122, 57);
          this.addWall(714, 94, 87, 37);
          this.addWall(94, 354, 77, 37);
          this.addWall(394, 354, 102, 47);
          this.addWall(734, 369, 92, 52);

          // Jugador provisional
          this.player = this.add.rectangle(
            170,
            190,
            22,
            28,
            0xe8d8bd,
          );

          this.physics.add.existing(this.player);

          this.player.body.setSize(18, 22);
          this.player.body.setCollideWorldBounds(true);

          this.player.setDepth(10);

          // Sombra del jugador
          this.shadow = this.add.ellipse(
            170,
            204,
            25,
            10,
            0x000000,
            0.35,
          );

          this.shadow.setDepth(9);

          // Colisiones con paredes y muebles
          this.physics.add.collider(this.player, this.obstacles);

          // Objetos coleccionables
          const items = this.physics.add.group();

          this.createItem(items, 330, 160);
          this.createItem(items, 550, 190);
          this.createItem(items, 790, 180);
          this.createItem(items, 480, 455);
          this.createItem(items, 840, 450);

          this.physics.add.overlap(
            this.player,
            items,
            (_player: any, item: any) => {
              if (!item.active) return;

              item.destroy();

              this.collected++;

              this.counterText.setText(
                `OBJETOS ENCONTRADOS: ${this.collected}/5`,
              );
            },
          );

          // Controles de teclado
          this.cursors = this.input.keyboard?.createCursorKeys();

          this.keys = this.input.keyboard?.addKeys("W,A,S,D");

          // Cámara
          this.cameras.main.startFollow(
            this.player,
            true,
            0.08,
            0.08,
          );

          // Interfaz
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

          // Comunicación con los controles táctiles
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

        addWall(x: number, y: number, width: number, height: number) {
          const wall = this.add.rectangle(
            x + width / 2,
            y + height / 2,
            width,
            height,
            0x777477,
          );

          wall.setStrokeStyle(1, 0xaaa4a4);
          this.obstacles.add(wall);

          return wall;
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
          this.add.rectangle(
            x + width / 2,
            y + height / 2,
            width,
            height,
            color,
          )
            .setStrokeStyle(2, 0x171719)
            .setDepth(3);

          this.add.rectangle(
            x + width / 2,
            y + height - 4,
            width - 12,
            5,
            0x000000,
            0.18,
          ).setDepth(4);
        }

        createItem(group: any, x: number, y: number) {
          const item = this.add.circle(
            x,
            y,
            9,
            0xd6b75e,
          );

          item.setStrokeStyle(2, 0xffe6a1);
          item.setDepth(5);

          this.physics.add.existing(item);

          item.body.setCircle(9);

          group.add(item);
        }

        update() {
          if (!this.player?.body) return;

          const speed = 155;

          let x = 0;
          let y = 0;

          if (
            this.cursors?.left?.isDown ||
            this.keys?.A?.isDown
          ) {
            x -= 1;
          }

          if (
            this.cursors?.right?.isDown ||
            this.keys?.D?.isDown
          ) {
            x += 1;
          }

          if (
            this.cursors?.up?.isDown ||
            this.keys?.W?.isDown
          ) {
            y -= 1;
          }

          if (
            this.cursors?.down?.isDown ||
            this.keys?.S?.isDown
          ) {
            y += 1;
          }

          x += this.touchDirection.x;
          y += this.touchDirection.y;

          const length = Math.hypot(x, y);

          if (length > 0) {
            x /= length;
            y /= length;
          }

          this.player.body.setVelocity(
            x * speed,
            y * speed,
          );

          if (this.shadow && this.player.active) {
            this.shadow.setPosition(
              this.player.x,
              this.player.y + 13,
            );
          }
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
    <div
      className="game-container"
      ref={containerRef}
      aria-label="Área de juego de Udder Blooder"
    >
      <div className="control-pad">
        {control("up", "Arriba", "control-up")}
        {control("left", "Izquierda", "control-left")}
        {control("down", "Abajo", "control-down")}
        {control("right", "Derecha", "control-right")}
      </div>
    </div>
  );
}
