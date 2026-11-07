import * as Phaser from "phaser";

export function createTrainingTarget(
  scene: Phaser.Scene,
  x: number,
  y: number,
) {
  const sprite = scene.add.rectangle(
    x,
    y,
    27,
    30,
    0x8e777c,
  );

  sprite.setStrokeStyle(2, 0x392d33);
  sprite.setDepth(10);

  scene.physics.add.existing(sprite);

  const body = sprite.body as Phaser.Physics.Arcade.Body;

  body.setImmovable(true);
  body.setAllowGravity(false);

  const healthBar = scene.add.rectangle(
    x,
    y - 25,
    36,
    5,
    0x70d68b,
  );

  healthBar.setDepth(11);

  return {
    sprite,
    body,
    health: 100,
    maxHealth: 100,
    healthBar,
  };
}
