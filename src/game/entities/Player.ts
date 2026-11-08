import * as Phaser from "phaser";
import { GAME_SETTINGS } from "../config/settings";
import {
  characterTextureKey,
  getCharacter,
  type CharacterPose,
} from "./characters";

export type PlayerEntity = {
  sprite: Phaser.GameObjects.Image;
  body: Phaser.Physics.Arcade.Body;
  shadow: Phaser.GameObjects.Ellipse;
  direction: { x: number; y: number };
  characterId: string;
  pose: CharacterPose;
  setPose: (pose: CharacterPose) => void;
  setFacing: (x: number, y: number) => void;
};

function createFallbackTexture(
  scene: Phaser.Scene,
  key: string,
  pose: CharacterPose,
) {
  if (scene.textures.exists(key)) return;

  const g = scene.add.graphics();
  g.fillStyle(0x000000, 0.28);
  g.fillEllipse(32, 51, 37, 14);
  g.fillStyle(0x252b35, 1);
  g.fillRoundedRect(17, 19, 30, 35, 9);
  g.lineStyle(3, 0x11151c, 1);
  g.strokeRoundedRect(17, 19, 30, 35, 9);
  g.fillStyle(0xc7a17f, 1);
  g.fillCircle(32, 15, 12);
  g.lineStyle(2, 0x624b3d, 1);
  g.strokeCircle(32, 15, 12);
  g.fillStyle(0x17191f, 1);
  g.fillRoundedRect(20, 4, 24, 9, 5);
  g.fillStyle(0x9b303c, 1);
  g.fillRoundedRect(20, 30, 24, 8, 3);

  if (pose === "punch") {
    g.lineStyle(5, 0xc7a17f, 1);
    g.lineBetween(19, 29, 5, 21);
    g.fillStyle(0xc7a17f, 1);
    g.fillCircle(5, 20, 4);
  } else if (pose === "weapon") {
    g.lineStyle(5, 0xc7a17f, 1);
    g.lineBetween(43, 29, 54, 22);
    g.fillStyle(0x82cfff, 1);
    g.fillRoundedRect(48, 12, 7, 17, 2);
  } else if (pose === "kick-door") {
    g.lineStyle(5, 0xc7a17f, 1);
    g.lineBetween(24, 49, 11, 59);
    g.lineBetween(40, 49, 54, 56);
  } else if (pose === "dead") {
    g.fillStyle(0x9b303c, 0.9);
    g.fillEllipse(32, 54, 36, 8);
    g.lineStyle(2, 0xe6d9cf, 1);
    g.lineBetween(25, 12, 39, 18);
    g.lineBetween(39, 12, 25, 18);
  }

  g.generateTexture(key, 64, 64);
  g.destroy();
}

export function createPlayer(
  scene: Phaser.Scene,
  characterId = "abraham",
): PlayerEntity {
  const config = getCharacter(characterId);
  const fallbackKey = (pose: CharacterPose) => `fallback-${characterId}-${pose}`;
  const poses: CharacterPose[] = ["idle", "punch", "weapon", "kick-door", "dead"];

  for (const pose of poses) {
    createFallbackTexture(scene, fallbackKey(pose), pose);
  }

  const idleKey = characterTextureKey(characterId, "idle");
  const sprite = scene.add.image(
    GAME_SETTINGS.player.startX,
    GAME_SETTINGS.player.startY,
    scene.textures.exists(idleKey) ? idleKey : fallbackKey("idle"),
  );

  sprite.setDisplaySize(config.displayWidth, config.displayHeight);
  sprite.setDepth(GAME_SETTINGS.player.startY);
  scene.physics.add.existing(sprite);

  const body = (sprite as any).body as Phaser.Physics.Arcade.Body;
  body.setSize(config.hitboxWidth, config.hitboxHeight);
  body.setOffset(
    (config.displayWidth - config.hitboxWidth) / 2,
    (config.displayHeight - config.hitboxHeight) / 2 + config.hitboxOffsetY,
  );
  body.setCollideWorldBounds(true);
  body.setDamping(false);
  body.setDrag(GAME_SETTINGS.player.drag);
  body.setMaxVelocity(GAME_SETTINGS.player.maxSpeed, GAME_SETTINGS.player.maxSpeed);

  const shadow = scene.add.ellipse(
    sprite.x,
    sprite.y + 23,
    36,
    13,
    0x000000,
    0.34,
  );
  shadow.setDepth(sprite.y - 1);

  let currentPose: CharacterPose = "idle";
  const setPose = (nextPose: CharacterPose) => {
    currentPose = nextPose;
    const key = characterTextureKey(characterId, nextPose);
    sprite.setTexture(
      scene.textures.exists(key) ? key : fallbackKey(nextPose),
    );
    sprite.setDisplaySize(config.displayWidth, config.displayHeight);
  };

  const setFacing = (x: number, y: number) => {
    if (x === 0 && y === 0) return;
    // All artwork is drawn facing screen-up; rotate toward the current direction.
    sprite.setRotation(Math.atan2(y, x) + Math.PI / 2);
  };

  return {
    sprite,
    body,
    shadow,
    direction: { x: 0, y: -1 },
    characterId,
    get pose() { return currentPose; },
    setPose,
    setFacing,
  };
}
