import * as Phaser from "phaser";

export class Controls {
  private keys: any;
  private cursors: any;
  private attackKey: Phaser.Input.Keyboard.Key;
  private interactKey: Phaser.Input.Keyboard.Key;
  private kickKey: Phaser.Input.Keyboard.Key;
  private sprintKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard;
    this.cursors = keyboard?.createCursorKeys();
    this.keys = keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      one: Phaser.Input.Keyboard.KeyCodes.ONE,
      two: Phaser.Input.Keyboard.KeyCodes.TWO,
      three: Phaser.Input.Keyboard.KeyCodes.THREE,
    });
    this.attackKey = keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.interactKey = keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.kickKey = keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.sprintKey = keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  }

  getDirection() {
    let x = 0;
    let y = 0;
    if (this.cursors?.left?.isDown || this.keys?.left?.isDown) x--;
    if (this.cursors?.right?.isDown || this.keys?.right?.isDown) x++;
    if (this.cursors?.up?.isDown || this.keys?.up?.isDown) y--;
    if (this.cursors?.down?.isDown || this.keys?.down?.isDown) y++;
    const length = Math.hypot(x, y);
    if (length > 0) { x /= length; y /= length; }
    return { x, y };
  }

  isSprinting() {
    return !!this.sprintKey?.isDown;
  }

  attackPressed() {
    return Phaser.Input.Keyboard.JustDown(this.attackKey);
  }

  interactPressed() {
    return Phaser.Input.Keyboard.JustDown(this.interactKey);
  }

  kickPressed() {
    return Phaser.Input.Keyboard.JustDown(this.kickKey);
  }

  equipmentPressed() {
    return {
      one: Phaser.Input.Keyboard.JustDown(this.keys?.one),
      two: Phaser.Input.Keyboard.JustDown(this.keys?.two),
      three: Phaser.Input.Keyboard.JustDown(this.keys?.three),
    };
  }
}
