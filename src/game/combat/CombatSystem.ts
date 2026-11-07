import Phaser from "phaser";
import { EQUIPMENT } from "./equipment";
import { GAME_SETTINGS } from "../config/settings";
import { createImpact, createStylizedMark } from "../effects/Effects";

export class CombatSystem {
  private scene: Phaser.Scene;
  private projectiles: any;
  private equipmentId: string;
  private lastAttack = 0;
  private target: any;

  constructor(scene: Phaser.Scene, target: any, obstacles: any) {
    this.scene = scene;
    this.target = target;

    this.equipmentId = GAME_SETTINGS.combat.defaultEquipment;

    this.projectiles = scene.physics.add.group();

    scene.physics.add.overlap(
      this.projectiles,
      target.sprite,
      (projectile: any) => {
        this.hitTarget(projectile);
      },
    );

    scene.physics.add.collider(
      this.projectiles,
      obstacles,
      (projectile: any) => {
        projectile.destroy();
      },
    );
  }

  getEquipment() {
    return EQUIPMENT[this.equipmentId];
  }

  equip(id: string) {
    if (!EQUIPMENT[id]) return false;

    this.equipmentId = id;
    return true;
  }

  attack(x: number, y: number, direction: { x: number; y: number }) {
    const equipment = this.getEquipment();
    const now = this.scene.time.now;

    if (now - this.lastAttack < equipment.cooldown) {
      return false;
    }

    if (direction.x === 0 && direction.y === 0) {
      return false;
    }

    this.lastAttack = now;

    const projectile = this.scene.add.circle(
      x + direction.x * 22,
      y + direction.y * 22,
      7,
      equipment.color,
    );

    projectile.setStrokeStyle(1, 0xffffff, 0.8);
    projectile.setDepth(20);

    this.scene.physics.add.existing(projectile);

    const body = projectile.body as Phaser.Physics.Arcade.Body;

    body.setAllowGravity(false);
    body.setCircle(7);

    body.setVelocity(
      direction.x * equipment.speed,
      direction.y * equipment.speed,
    );

    this.projectiles.add(projectile);

    this.scene.time.delayedCall(
      GAME_SETTINGS.combat.projectileLifetime,
      () => {
        if (projectile.active) projectile.destroy();
      },
    );

    return true;
  }

  private hitTarget(projectile: any) {
    if (!projectile.active || this.target.health <= 0) {
      projectile.destroy();
      return;
    }

    const equipment = this.getEquipment();

    projectile.destroy();

    this.target.health = Math.max(
      0,
      this.target.health - equipment.damage,
    );

    const ratio = this.target.health / this.target.maxHealth;

    this.target.healthBar.setScale(ratio, 1);
    this.target.healthBar.setFillStyle(
      ratio > 0.5 ? 0x70d68b : 0xe7a04f,
    );

    createImpact(
      this.scene,
      this.target.sprite.x,
      this.target.sprite.y,
      equipment.color,
    );

    createStylizedMark(
      this.scene,
      this.target.sprite.x + Phaser.Math.Between(-12, 12),
      this.target.sprite.y + Phaser.Math.Between(-12, 12),
    );

    if (this.target.health <= 0) {
      this.target.sprite.setFillStyle(0x5c5155);
      this.target.healthBar.setVisible(false);

      this.scene.time.delayedCall(1600, () => {
        this.target.health = this.target.maxHealth;

        this.target.sprite.setFillStyle(0x8e777c);
        this.target.healthBar.setVisible(true);
        this.target.healthBar.setScale(1, 1);
        this.target.healthBar.setFillStyle(0x70d68b);
      });
    }
  }
}
