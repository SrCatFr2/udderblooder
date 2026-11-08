import * as Phaser from "phaser";
import { EQUIPMENT } from "./equipment";
import { GAME_SETTINGS } from "../config/settings";
import { createImpact } from "../effects/Effects";
import type { PlayerEntity } from "../entities/Player";

type CombatTarget = {
  sprite: Phaser.GameObjects.Rectangle;
  visual: Phaser.GameObjects.Container;
  health: number;
  maxHealth: number;
  healthBar: Phaser.GameObjects.Rectangle;
  healthBack: Phaser.GameObjects.Rectangle;
};

export class CombatSystem {
  private scene: Phaser.Scene;
  private player: PlayerEntity;
  private target: CombatTarget;
  private projectiles: Phaser.Physics.Arcade.Group;
  private equipmentId = GAME_SETTINGS.combat.defaultEquipment;
  private lastAttack = 0;
  private poseTimer?: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, player: PlayerEntity, target: CombatTarget, obstacles: any) {
    this.scene = scene;
    this.player = player;
    this.target = target;
    this.projectiles = scene.physics.add.group();

    scene.physics.add.overlap(this.projectiles, target.sprite, (a) => {
      this.hitTarget(a as Phaser.GameObjects.Arc);
    });

    scene.physics.add.collider(this.projectiles, obstacles, (a) => {
      (a as Phaser.GameObjects.GameObject).destroy();
    });
  }

  getEquipment() {
    return EQUIPMENT[this.equipmentId];
  }

  equip(id: string) {
    if (!EQUIPMENT[id]) return false;
    this.equipmentId = id;
    this.player.setPose(EQUIPMENT[id].kind === "projectile" ? "weapon" : "idle");
    return true;
  }

  attack() {
    const equipment = this.getEquipment();
    const now = this.scene.time.now;
    if (now - this.lastAttack < equipment.cooldown) return false;
    this.lastAttack = now;

    if (equipment.kind === "fists") {
      this.player.setPose("punch");
      this.scene.cameras.main.shake(65, 0.0018);
      const dx = this.target.sprite.x - this.player.sprite.x;
      const dy = this.target.sprite.y - this.player.sprite.y;
      const distance = Math.hypot(dx, dy);
      const facingDot = (dx * this.player.direction.x + dy * this.player.direction.y) / Math.max(1, distance);
      if (distance < 66 && facingDot > 0.25) {
        this.damageTarget(equipment.damage, equipment.color);
      }
    } else {
      this.player.setPose("weapon");
      const direction = this.player.direction;
      const projectile = this.scene.add.circle(
        this.player.sprite.x + direction.x * 26,
        this.player.sprite.y + direction.y * 26 - 5,
        7,
        equipment.color,
      ).setStrokeStyle(2, 0xffffff, 0.85).setDepth(this.player.sprite.y + 40);
      this.scene.physics.add.existing(projectile);
      const body = (projectile as any).body as Phaser.Physics.Arcade.Body;
      body.setAllowGravity(false);
      body.setCircle(7);
      body.setVelocity(direction.x * equipment.speed, direction.y * equipment.speed);
      this.projectiles.add(projectile);
      this.scene.time.delayedCall(GAME_SETTINGS.combat.projectileLifetime, () => {
        if (projectile.active) projectile.destroy();
      });
    }

    this.poseTimer?.remove(false);
    this.poseTimer = this.scene.time.delayedCall(260, () => {
      if (this.player.pose !== "dead") {
        this.player.setPose(this.equipmentId === "fists" ? "idle" : "weapon");
      }
    });
    return true;
  }

  private hitTarget(projectile: Phaser.GameObjects.Arc) {
    if (!projectile.active) return;
    projectile.destroy();
    this.damageTarget(this.getEquipment().damage, this.getEquipment().color);
  }

  private damageTarget(damage: number, color: number) {
    if (this.target.health <= 0) return;
    this.target.health = Math.max(0, this.target.health - damage);
    const ratio = this.target.health / this.target.maxHealth;
    this.target.healthBar.setSize(Math.max(0, 46 * ratio), 4);
    this.target.healthBar.setFillStyle(ratio > 0.5 ? 0x76d69a : 0xe7a04f);
    this.target.healthBar.setVisible(true);
    this.target.healthBack.setVisible(true);

    createImpact(this.scene, this.target.sprite.x, this.target.sprite.y - 8, color);
    this.scene.tweens.add({
      targets: this.target.visual,
      x: this.target.sprite.x + this.player.direction.x * 7,
      duration: 65,
      yoyo: true,
      repeat: 1,
      onComplete: () => this.target.visual.setPosition(this.target.sprite.x, this.target.sprite.y),
    });

    if (this.target.health <= 0) {
      this.target.visual.setAlpha(0.35);
      this.target.healthBar.setVisible(false);
      this.target.healthBack.setVisible(false);
      this.scene.time.delayedCall(1800, () => {
        this.target.health = this.target.maxHealth;
        this.target.visual.setAlpha(1);
        this.target.healthBar.setVisible(true);
        this.target.healthBack.setVisible(true);
        this.target.healthBar.setSize(46, 4);
        this.target.healthBar.setFillStyle(0x76d69a);
      });
    }
  }
}
