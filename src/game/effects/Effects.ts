import type Phaser from "phaser";

export function createImpact(
  scene: Phaser.Scene,
  x: number,
  y: number,
  color: number,
) {
  const flash = scene.add.circle(x, y, 5, color, 0.95);

  flash.setDepth(30);

  scene.tweens.add({
    targets: flash,
    scale: 3.5,
    alpha: 0,
    duration: 220,
    ease: "Cubic.Out",
    onComplete: () => flash.destroy(),
  });

  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6;
    const distance = Phaser.Math.Between(12, 25);

    const particle = scene.add.circle(
      x,
      y,
      Phaser.Math.Between(2, 4),
      color,
    );

    particle.setDepth(29);

    scene.tweens.add({
      targets: particle,
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance,
      alpha: 0,
      scale: 0.2,
      duration: 280,
      onComplete: () => particle.destroy(),
    });
  }
}

export function createStylizedMark(
  scene: Phaser.Scene,
  x: number,
  y: number,
) {
  const mark = scene.add.circle(
    x,
    y,
    Phaser.Math.Between(3, 7),
    0x9f263b,
    0.45,
  );

  mark.setDepth(2);
}
