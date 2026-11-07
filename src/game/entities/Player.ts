import type Phaser from "phaser";
import { GAME_SETTINGS } from "../config/settings";

export function createPlayer(scene: Phaser.Scene) {
  const { player } = GAME_SETTINGS;

  const sprite = scene.add.rectangle(
    player.startX,
    player.startY,
    player.width,
    player.height,
    0xe8d8bd,
  );

  sprite.setStrokeStyle(2, 0x51443b);
  sprite.setDepth(10);

  scene.physics.add.existing(sprite);

  const body = sprite.body as Phaser.Physics.Arcade.Body;

  body.setSize(player.width - 5, player.height - 7);
  body.setCollideWorldBounds(true);

  const shadow = scene.add.ellipse(
    player.startX,
    player.startY + 13,
    27,
    10,
    0x000000,
    0.4,
  );

  shadow.setDepth(9);

  return {
    sprite,
    body,
    shadow,
    direction: { x: 1, y: 0 },
  };
}
