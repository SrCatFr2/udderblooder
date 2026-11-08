import * as Phaser from "phaser";
import type { HouseDoor } from "../world/House";
import type { PlayerEntity } from "../entities/Player";

export class Interactions {
  private doors: HouseDoor[];
  private prompt: Phaser.GameObjects.Container;
  private promptText: Phaser.GameObjects.Text;
  private nearest: HouseDoor | null = null;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, doors: HouseDoor[]) {
    this.scene = scene;
    this.doors = doors;
    const bg = scene.add.rectangle(0, 0, 170, 30, 0x11151c, 0.92).setStrokeStyle(1, 0xb38b69, 0.7);
    this.promptText = scene.add.text(0, 0, "E  OPEN DOOR", {
      fontFamily: "Arial",
      fontSize: "11px",
      color: "#f3e6d5",
      fontStyle: "bold",
    }).setOrigin(0.5);
    this.prompt = scene.add.container(0, 0, [bg, this.promptText]).setScrollFactor(0).setDepth(200).setVisible(false);
  }

  update(player: PlayerEntity, interactPressed: boolean, kickPressed: boolean) {
    this.nearest = null;
    let nearestDistance = 66;
    for (const door of this.doors) {
      const distance = Phaser.Math.Distance.Between(player.sprite.x, player.sprite.y, door.x, door.y);
      if (distance < nearestDistance) {
        this.nearest = door;
        nearestDistance = distance;
      }
    }

    this.prompt.setVisible(!!this.nearest);
    if (this.nearest) {
      this.prompt.setPosition(640, 660);
      this.promptText.setText(this.nearest.open ? "E  CLOSE DOOR   ·   F  KICK" : "E  OPEN DOOR   ·   F  KICK");
    }
    if (!this.nearest) return;

    if (kickPressed && !this.nearest.open) {
      player.setPose("kick-door");
      this.toggleDoor(this.nearest, true);
      this.scene.time.delayedCall(420, () => {
        if (player.pose !== "dead") player.setPose("idle");
      });
    } else if (interactPressed) {
      this.toggleDoor(this.nearest, false);
    }
  }

  private toggleDoor(door: HouseDoor, kicked: boolean) {
    if (door.open) {
      door.open = false;
      door.sprite.setAngle(door.angle);
      const body = (door.sprite as any).body as Phaser.Physics.Arcade.StaticBody;
      body.enable = true;
      body.updateFromGameObject();
      return;
    }

    door.open = true;
    const body = (door.sprite as any).body as Phaser.Physics.Arcade.StaticBody;
    body.enable = false;
    this.scene.tweens.add({
      targets: door.sprite,
      angle: door.angle + (door.angle === 0 ? 88 : -88),
      duration: kicked ? 180 : 280,
      ease: kicked ? "Back.Out" : "Cubic.Out",
    });
  }
}
