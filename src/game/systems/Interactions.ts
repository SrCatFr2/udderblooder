import * as Phaser from "phaser";
import type { HouseDoor } from "../world/House";

export class Interactions {
  private doors: HouseDoor[];
  private message: any;

  constructor(scene: Phaser.Scene, doors: HouseDoor[]) {
    this.doors = doors;

    this.message = scene.add
      .text(0, 0, "E - INTERACTUAR", {
        fontFamily: "Arial",
        fontSize: "12px",
        color: "#ffffff",
        backgroundColor: "#111111cc",
        padding: { x: 8, y: 5 },
      })
      .setScrollFactor(0)
      .setDepth(100)
      .setVisible(false);
  }

  update(player: any, interactPressed: boolean) {
    let nearest: HouseDoor | null = null;
    let nearestDistance = 65;

    for (const door of this.doors) {
      const distance = Phaser.Math.Distance.Between(
        player.x,
        player.y,
        door.x,
        door.y,
      );

      if (distance < nearestDistance) {
        nearest = door;
        nearestDistance = distance;
      }
    }

    this.message.setVisible(!!nearest);

    if (!nearest || !interactPressed) return;

    nearest.open = !nearest.open;
    nearest.sprite.setVisible(!nearest.open);

    const body = nearest.sprite.body as Phaser.Physics.Arcade.StaticBody;

    if (body) {
      body.enable = !nearest.open;

      if (!nearest.open) {
        body.updateFromGameObject();
      }
    }
  }
}
