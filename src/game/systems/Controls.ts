import Phaser from "phaser";

export class Controls {
  private scene: Phaser.Scene;
  private keys: any;
  private cursors: any;
  private attackKey: any;
  private interactKey: any;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    const keyboard = scene.input.keyboard;

    this.cursors = keyboard?.createCursorKeys();

    this.keys = keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.attackKey = keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    this.interactKey = keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.E,
    );
  }

  getDirection() {
    let x = 0;
    let y = 0;

    if (this.cursors?.left?.isDown || this.keys?.left?.isDown) x--;
    if (this.cursors?.right?.isDown || this.keys?.right?.isDown) x++;
    if (this.cursors?.up?.isDown || this.keys?.up?.isDown) y--;
    if (this.cursors?.down?.isDown || this.keys?.down?.isDown) y++;

    const length = Math.hypot(x, y);

    if (length > 0) {
      x /= length;
      y /= length;
    }

    return { x, y };
  }

  attackPressed() {
    return this.attackKey
      ? Phaser.Input.Keyboard.JustDown(this.attackKey)
      : false;
  }

  interactPressed() {
    return this.interactKey
      ? Phaser.Input.Keyboard.JustDown(this.interactKey)
      : false;
  }
}
