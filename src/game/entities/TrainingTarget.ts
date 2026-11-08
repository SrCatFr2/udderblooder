import * as Phaser from "phaser";

export function createTrainingTarget(scene: Phaser.Scene, x: number, y: number) {
  const visual = scene.add.container(x, y).setDepth(y);
  const shadow = scene.add.ellipse(3, 15, 48, 17, 0x000000, 0.35);
  const legs = scene.add.rectangle(0, 8, 27, 22, 0x292d35).setStrokeStyle(2, 0x11151b);
  const torso = scene.add.rectangle(0, -5, 34, 32, 0x71604f).setStrokeStyle(2, 0x302821);
  const head = scene.add.circle(0, -27, 12, 0xb98f70).setStrokeStyle(2, 0x4a352c);
  const cap = scene.add.ellipse(0, -34, 25, 10, 0x343b43);
  const targetMark = scene.add.circle(0, -6, 5, 0xb93e4b, 0.9);
  visual.add([shadow, legs, torso, head, cap, targetMark]);

  const hitbox = scene.add.rectangle(x, y - 4, 38, 42, 0xffffff, 0);
  scene.physics.add.existing(hitbox);
  const body = (hitbox as any).body as Phaser.Physics.Arcade.Body;
  body.setImmovable(true);
  body.setAllowGravity(false);

  const healthBack = scene.add.rectangle(x, y - 55, 48, 6, 0x111318, 0.95).setDepth(y + 30);
  const healthBar = scene.add.rectangle(x - 23, y - 55, 46, 4, 0x76d69a).setOrigin(0, 0.5).setDepth(y + 31);

  return {
    sprite: hitbox,
    visual,
    health: 100,
    maxHealth: 100,
    healthBar,
    healthBack,
  };
}
