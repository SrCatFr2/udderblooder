import * as Phaser from "phaser";
import { GAME_SETTINGS } from "../config/settings";
import { createHouse } from "../world/House";
import { createPlayer, type PlayerEntity } from "../entities/Player";
import { createTrainingTarget } from "../entities/TrainingTarget";
import { CHARACTERS, DEFAULT_CHARACTER_ID, characterTextureKey, type CharacterPose } from "../entities/characters";
import { CombatSystem } from "../combat/CombatSystem";
import { Controls } from "../systems/Controls";
import { Interactions } from "../systems/Interactions";

export default class GameScene extends Phaser.Scene {
  private player!: PlayerEntity;
  private controls!: Controls;
  private combat!: CombatSystem;
  private interactions!: Interactions;
  private touchDirection = { x: 0, y: 0 };
  private touchAttack = false;
  private touchInteract = false;
  private touchKick = false;
  private touchHandler: any;
  private attackHandler: any;
  private interactHandler: any;
  private kickHandler: any;
  private equipmentText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private selectedEquipment = "fists";

  constructor() {
    super("GameScene");
  }

  preload() {
    for (const character of Object.values(CHARACTERS)) {
      const poses: CharacterPose[] = ["idle", "punch", "weapon", "kick-door", "dead"];
      for (const pose of poses) {
        this.load.image(characterTextureKey(character.id, pose), character.sprites[pose]);
      }
    }
  }

  create() {
    const { width, height } = GAME_SETTINGS;
    this.physics.world.setBounds(0, 0, width, height);
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.setBackgroundColor("#171a20");

    const house = createHouse(this);
    this.player = createPlayer(this, DEFAULT_CHARACTER_ID);
    const target = createTrainingTarget(this, 1090, 475);
    this.controls = new Controls(this);
    this.combat = new CombatSystem(this, this.player, target, house.obstacles);
    this.interactions = new Interactions(this, house.doors);

    this.physics.add.collider(this.player.sprite, house.obstacles);
    this.physics.add.collider(this.player.sprite, target.sprite);

    this.cameras.main.startFollow(
      this.player.sprite,
      true,
      GAME_SETTINGS.camera.followSpeed,
      GAME_SETTINGS.camera.followSpeed,
    );
    this.cameras.main.setDeadzone(180, 110);
    this.cameras.main.setZoom(1.04);

    this.createInterface();
    this.bindTouchControls();

    this.events.once("shutdown", () => this.unbindTouchControls());
  }

  private createInterface() {
    const panel = this.add.rectangle(16, 16, 340, 94, 0x0b0e13, 0.82)
      .setOrigin(0).setStrokeStyle(1, 0x887263, 0.5).setScrollFactor(0).setDepth(150);
    this.add.text(32, 27, "UDDER BLOODER", {
      fontFamily: "Arial", fontSize: "16px", color: "#f4e8dc", fontStyle: "bold",
    }).setScrollFactor(0).setDepth(151);
    this.add.text(32, 49, `RESIDENCE 01   /   ${CHARACTERS[DEFAULT_CHARACTER_ID].name.toUpperCase()}`, {
      fontFamily: "Arial", fontSize: "9px", color: "#b9a99b", letterSpacing: 1.5,
    }).setScrollFactor(0).setDepth(151);
    this.equipmentText = this.add.text(32, 72, "", {
      fontFamily: "Arial", fontSize: "10px", color: "#8fc8e8", fontStyle: "bold",
    }).setScrollFactor(0).setDepth(151);
    this.statusText = this.add.text(1248, 28, "TRAINING AREA", {
      fontFamily: "Arial", fontSize: "10px", color: "#b9a99b", fontStyle: "bold",
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(151);
    this.updateEquipmentText();
  }

  private updateEquipmentText() {
    const item = this.combat.getEquipment();
    this.equipmentText.setText(`LOADOUT  ${item.name}     [1] [2] [3]`);
  }

  private bindTouchControls() {
    this.touchHandler = (event: Event) => {
      const custom = event as CustomEvent<{ x: number; y: number }>;
      this.touchDirection = custom.detail;
    };
    this.attackHandler = () => { this.touchAttack = true; };
    this.interactHandler = () => { this.touchInteract = true; };
    this.kickHandler = () => { this.touchKick = true; };
    window.addEventListener("udder:move", this.touchHandler);
    window.addEventListener("udder:attack", this.attackHandler);
    window.addEventListener("udder:interact", this.interactHandler);
    window.addEventListener("udder:kick", this.kickHandler);
  }

  private unbindTouchControls() {
    window.removeEventListener("udder:move", this.touchHandler);
    window.removeEventListener("udder:attack", this.attackHandler);
    window.removeEventListener("udder:interact", this.interactHandler);
    window.removeEventListener("udder:kick", this.kickHandler);
  }

  update() {
    if (!this.player?.body) return;

    const input = this.controls.getDirection();
    let x = input.x + this.touchDirection.x;
    let y = input.y + this.touchDirection.y;
    const length = Math.hypot(x, y);
    if (length > 1) { x /= length; y /= length; }

    const moving = Math.abs(x) + Math.abs(y) > 0;
    const sprinting = this.controls.isSprinting();
    const maxSpeed = sprinting ? GAME_SETTINGS.player.sprintSpeed : GAME_SETTINGS.player.maxSpeed;

    this.player.body.setMaxVelocity(maxSpeed, maxSpeed);
    this.player.body.setAcceleration(
      moving ? x * GAME_SETTINGS.player.acceleration : 0,
      moving ? y * GAME_SETTINGS.player.acceleration : 0,
    );

    if (moving) {
      this.player.direction = { x, y };
      this.player.setFacing(x, y);
    }

    this.player.shadow.setPosition(this.player.sprite.x + 2, this.player.sprite.y + 23);
    this.player.shadow.setDepth(this.player.sprite.y - 1);
    this.player.sprite.setDepth(this.player.sprite.y + 10);

    if (this.controls.attackPressed() || this.touchAttack) {
      this.combat.attack();
    }

    const interact = this.controls.interactPressed() || this.touchInteract;
    const kick = this.controls.kickPressed() || this.touchKick;
    this.interactions.update(this.player, interact, kick);

    const equipment = this.controls.equipmentPressed();
    if (equipment.one) this.selectEquipment("fists");
    if (equipment.two) this.selectEquipment("arc-pulse");
    if (equipment.three) this.selectEquipment("echo-wave");

    this.touchAttack = false;
    this.touchInteract = false;
    this.touchKick = false;
  }

  private selectEquipment(id: string) {
    if (this.combat.equip(id)) {
      this.selectedEquipment = id;
      this.updateEquipmentText();
    }
  }
}
