import * as Phaser from "phaser";

import { GAME_SETTINGS } from "../config/settings";
import { createHouse } from "../world/House";
import { createPlayer } from "../entities/Player";
import { createTrainingTarget } from "../entities/TrainingTarget";
import { CombatSystem } from "../combat/CombatSystem";
import { Controls } from "../systems/Controls";
import { Interactions } from "../systems/Interactions";

export default class GameScene extends Phaser.Scene {
  private player: any;
  private controls!: Controls;
  private combat!: CombatSystem;
  private interactions!: Interactions;

  private touchDirection = { x: 0, y: 0 };
  private touchAttack = false;
  private touchInteract = false;

  private equipmentKeys: any;
  private equipmentText: any;

  private touchHandler: any;
  private attackHandler: any;
  private interactHandler: any;

  constructor() {
    super("GameScene");
  }

  create() {
    const { width, height } = GAME_SETTINGS;

    this.physics.world.setBounds(0, 0, width, height);
    this.cameras.main.setBounds(0, 0, width, height);

    // Crear escenario
    const house = createHouse(this);

    // Crear jugador
    this.player = createPlayer(this);

    // Crear objetivo de entrenamiento
    const target = createTrainingTarget(this, 1100, 590);

    // Crear sistemas
    this.controls = new Controls(this);

    this.combat = new CombatSystem(
      this,
      target,
      house.obstacles,
    );

    this.interactions = new Interactions(
      this,
      house.doors,
    );

    // Colisiones
    this.physics.add.collider(
      this.player.sprite,
      house.obstacles,
    );

    // Cámara
    this.cameras.main.startFollow(
      this.player.sprite,
      true,
      GAME_SETTINGS.camera.followSpeed,
      GAME_SETTINGS.camera.followSpeed,
    );

    // Teclas para cambiar equipamiento
    this.equipmentKeys = this.input.keyboard?.addKeys({
      one: Phaser.Input.Keyboard.KeyCodes.ONE,
      two: Phaser.Input.Keyboard.KeyCodes.TWO,
      three: Phaser.Input.Keyboard.KeyCodes.THREE,
    });

    // Interfaz
    this.createInterface();

    // Eventos táctiles
    this.touchHandler = (event: Event) => {
      const custom = event as CustomEvent<{
        x: number;
        y: number;
      }>;

      this.touchDirection = custom.detail;
    };

    this.attackHandler = () => {
      this.touchAttack = true;
    };

    this.interactHandler = () => {
      this.touchInteract = true;
    };

    window.addEventListener("udder:move", this.touchHandler);
    window.addEventListener("udder:attack", this.attackHandler);
    window.addEventListener("udder:interact", this.interactHandler);

    this.events.once("shutdown", () => {
      window.removeEventListener("udder:move", this.touchHandler);
      window.removeEventListener("udder:attack", this.attackHandler);
      window.removeEventListener("udder:interact", this.interactHandler);
    });
  }

  createInterface() {
    this.add
      .text(25, 25, "UDDER BLOODER // RESIDENCE 01", {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setScrollFactor(0)
      .setDepth(100);

    this.add
      .text(25, 49, "WASD: MOVER  |  SPACE: ACCIÓN  |  E: INTERACTUAR", {
        fontFamily: "Arial",
        fontSize: "10px",
        color: "#c2c2c8",
      })
      .setScrollFactor(0)
      .setDepth(100);

    this.equipmentText = this.add
      .text(25, 68, "", {
        fontFamily: "Arial",
        fontSize: "11px",
        color: "#82cfff",
        fontStyle: "bold",
      })
      .setScrollFactor(0)
      .setDepth(100);

    this.updateEquipmentText();
  }

  updateEquipmentText() {
    if (!this.equipmentText || !this.combat) return;

    const equipment = this.combat.getEquipment();

    this.equipmentText.setText(
      `EQUIPAMIENTO: ${equipment.name}  |  1 / 2 / 3 PARA CAMBIAR`,
    );
  }

  update() {
    if (!this.player?.body) return;

    const keyboardDirection = this.controls.getDirection();

    let x = keyboardDirection.x + this.touchDirection.x;
    let y = keyboardDirection.y + this.touchDirection.y;

    const length = Math.hypot(x, y);

    if (length > 0) {
      x /= length;
      y /= length;

      this.player.direction = { x, y };
    }

    const speed = GAME_SETTINGS.player.speed;

    this.player.body.setVelocity(x * speed, y * speed);

    // Actualizar sombra
    this.player.shadow.setPosition(
      this.player.sprite.x,
      this.player.sprite.y + 14,
    );

    // Ataque arcade
    if (this.controls.attackPressed() || this.touchAttack) {
      this.combat.attack(
        this.player.sprite.x,
        this.player.sprite.y,
        this.player.direction,
      );
    }

    // Interacción con puertas
    this.interactions.update(
      this.player.sprite,
      this.controls.interactPressed() || this.touchInteract,
    );

    // Cambiar equipamiento
    if (
      this.equipmentKeys &&
      Phaser.Input.Keyboard.JustDown(this.equipmentKeys.one)
    ) {
      this.combat.equip("arc-pulse");
      this.updateEquipmentText();
    }

    if (
      this.equipmentKeys &&
      Phaser.Input.Keyboard.JustDown(this.equipmentKeys.two)
    ) {
      this.combat.equip("foam-burst");
      this.updateEquipmentText();
    }

    if (
      this.equipmentKeys &&
      Phaser.Input.Keyboard.JustDown(this.equipmentKeys.three)
    ) {
      this.combat.equip("echo-wave");
      this.updateEquipmentText();
    }

    // Evitar repetir acciones táctiles
    this.touchAttack = false;
    this.touchInteract = false;
  }
}
