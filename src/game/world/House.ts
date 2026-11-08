import * as Phaser from "phaser";

export type HouseDoor = {
  sprite: any;
  open: boolean;
  x: number;
  y: number;
  angle: number;
};

export type HouseResult = {
  obstacles: any;
  doors: HouseDoor[];
};

const W = 1280;
const H = 720;

export function createHouse(scene: Phaser.Scene): HouseResult {
  const obstacles = scene.physics.add.staticGroup();
  const doors: HouseDoor[] = [];
  const floor = scene.add.graphics().setDepth(-20);

  // Base floor, room slabs and subtle floorboard pattern.
  floor.fillStyle(0x171a20, 1);
  floor.fillRect(0, 0, W, H);
  const rooms = [
    { x: 38, y: 38, w: 354, h: 276, c: 0x343238 },
    { x: 418, y: 38, w: 394, h: 276, c: 0x34363a },
    { x: 838, y: 38, w: 404, h: 276, c: 0x302f32 },
    { x: 38, y: 368, w: 354, h: 314, c: 0x303238 },
    { x: 418, y: 368, w: 394, h: 314, c: 0x373237 },
    { x: 838, y: 368, w: 404, h: 314, c: 0x30343a },
  ];

  for (const room of rooms) {
    floor.fillStyle(room.c, 1);
    floor.fillRect(room.x, room.y, room.w, room.h);
    floor.lineStyle(2, 0x777078, 0.22);
    floor.strokeRect(room.x + 5, room.y + 5, room.w - 10, room.h - 10);
    floor.lineStyle(1, 0xd0bda2, 0.045);
    for (let y = room.y + 22; y < room.y + room.h; y += 28) {
      floor.lineBetween(room.x + 8, y, room.x + room.w - 8, y);
    }
    for (let x = room.x + 18; x < room.x + room.w; x += 64) {
      floor.lineStyle(1, 0x000000, 0.07);
      floor.lineBetween(x, room.y + 8, x, room.y + room.h - 8);
    }
  }

  // Scuffs, rug details and room accents.
  floor.fillStyle(0x6d4448, 0.28);
  floor.fillRoundedRect(68, 180, 145, 88, 8);
  floor.lineStyle(2, 0xb58b79, 0.22);
  floor.strokeRoundedRect(76, 188, 129, 72, 5);
  floor.fillStyle(0x5e4c42, 0.3);
  floor.fillRoundedRect(875, 190, 170, 76, 8);
  floor.lineStyle(2, 0xbca18b, 0.16);
  floor.strokeRoundedRect(884, 198, 152, 60, 4);

  // Exterior and interior walls. Gaps are intentionally left for doorways.
  addWall(scene, obstacles, 20, 20, 1240, 20);
  addWall(scene, obstacles, 20, 680, 1240, 20);
  addWall(scene, obstacles, 20, 20, 20, 680);
  addWall(scene, obstacles, 1240, 20, 20, 680);

  addWall(scene, obstacles, 400, 40, 16, 100);
  addWall(scene, obstacles, 400, 210, 16, 100);
  addWall(scene, obstacles, 820, 40, 16, 100);
  addWall(scene, obstacles, 820, 210, 16, 100);

  addWall(scene, obstacles, 40, 330, 130, 16);
  addWall(scene, obstacles, 240, 330, 160, 16);
  addWall(scene, obstacles, 420, 330, 120, 16);
  addWall(scene, obstacles, 630, 330, 190, 16);
  addWall(scene, obstacles, 840, 330, 140, 16);
  addWall(scene, obstacles, 1050, 330, 190, 16);

  addWall(scene, obstacles, 400, 370, 16, 110);
  addWall(scene, obstacles, 400, 550, 16, 130);
  addWall(scene, obstacles, 820, 370, 16, 110);
  addWall(scene, obstacles, 820, 550, 16, 130);

  // Decorative wall trims and window frames.
  addWindow(scene, 110, 29, 104, 10);
  addWindow(scene, 548, 29, 118, 10);
  addWindow(scene, 1000, 29, 112, 10);
  addWindow(scene, 29, 475, 10, 92);
  addWindow(scene, 1241, 475, 10, 92);

  // Furnishings: each visual object has a separate invisible collision body.
  addBed(scene, obstacles, 78, 78, 130, 78);
  addNightstand(scene, obstacles, 228, 90, 38, 38);
  addSofa(scene, obstacles, 260, 205, 94, 58);
  addDiningTable(scene, obstacles, 520, 88, 126, 78);
  addCabinet(scene, obstacles, 700, 215, 70, 54);
  addKitchen(scene, obstacles, 885, 82, 270, 54);
  addPlant(scene, obstacles, 1160, 225);
  addDesk(scene, obstacles, 80, 445, 122, 68);
  addSofa(scene, obstacles, 260, 565, 94, 58);
  addDiningTable(scene, obstacles, 500, 430, 132, 80);
  addCabinet(scene, obstacles, 700, 565, 74, 56);
  addBed(scene, obstacles, 890, 430, 138, 84);
  addDesk(scene, obstacles, 1080, 560, 112, 66);
  addPlant(scene, obstacles, 1160, 430);

  // Door hinges sit at the edge of each opening. Doors rotate instead of vanishing.
  createDoor(scene, obstacles, doors, 400, 140, 70, 90);
  createDoor(scene, obstacles, doors, 820, 140, 70, 90);
  createDoor(scene, obstacles, doors, 170, 330, 70, 0);
  createDoor(scene, obstacles, doors, 560, 330, 70, 0);
  createDoor(scene, obstacles, doors, 980, 330, 70, 0);
  createDoor(scene, obstacles, doors, 400, 480, 70, 90);
  createDoor(scene, obstacles, doors, 820, 480, 70, 90);

  return { obstacles, doors };
}

function addWall(
  scene: Phaser.Scene,
  group: any,
  x: number, y: number, width: number, height: number,
) {
  const shadow = scene.add.rectangle(x + width / 2 + 4, y + height / 2 + 5, width + 7, height + 7, 0x000000, 0.35);
  shadow.setDepth(2);
  const wall = scene.add.rectangle(x + width / 2, y + height / 2, width, height, 0x55545b);
  wall.setStrokeStyle(2, 0xaaa0a0, 0.65);
  wall.setDepth(4);
  const cap = scene.add.rectangle(x + width / 2, y + height / 2 - height * 0.22, width - 3, Math.max(3, height * 0.18), 0x8c8585, 0.8);
  cap.setDepth(5);
  group.add(wall);
  const body = (wall as any).body as Phaser.Physics.Arcade.StaticBody;
  body.updateFromGameObject();
}

function addWindow(scene: Phaser.Scene, x: number, y: number, w: number, h: number) {
  const g = scene.add.graphics().setDepth(6);
  g.fillStyle(0x101b28, 1);
  g.fillRect(x, y, w, h);
  g.lineStyle(3, 0x9b8d80, 0.9);
  g.strokeRect(x, y, w, h);
  g.lineStyle(2, 0x79a6bb, 0.45);
  if (w > h) {
    g.lineBetween(x + w / 2, y + 2, x + w / 2, y + h - 2);
    g.lineBetween(x + 2, y + h / 2, x + w - 2, y + h / 2);
  } else {
    g.lineBetween(x + w / 2, y + 2, x + w / 2, y + h - 2);
  }
}

function addCollider(
  scene: Phaser.Scene,
  group: any,
  x: number, y: number, w: number, h: number,
) {
  const hit = scene.add.rectangle(x + w / 2, y + h / 2, w, h, 0xffffff, 0);
  group.add(hit);
  const body = (hit as any).body as Phaser.Physics.Arcade.StaticBody;
  body.updateFromGameObject();
}

function addBed(scene: Phaser.Scene, group: any, x: number, y: number, w: number, h: number) {
  const g = scene.add.graphics().setDepth(y + h);
  g.fillStyle(0x000000, 0.3); g.fillRoundedRect(x + 5, y + 8, w, h, 8);
  g.fillStyle(0x493b3d, 1); g.fillRoundedRect(x, y, w, h, 8);
  g.lineStyle(3, 0x8d7772, 0.8); g.strokeRoundedRect(x, y, w, h, 8);
  g.fillStyle(0xb9b1a5, 1); g.fillRoundedRect(x + 7, y + 7, w - 14, h * 0.42, 6);
  g.fillStyle(0x6b3945, 1); g.fillRoundedRect(x + 7, y + h * 0.48, w - 14, h * 0.43, 5);
  g.lineStyle(1, 0xd5b4a2, 0.4); g.lineBetween(x + 12, y + h * 0.5, x + w - 12, y + h * 0.5);
  addCollider(scene, group, x + 4, y + 4, w - 8, h - 8);
}

function addNightstand(scene: Phaser.Scene, group: any, x: number, y: number, w: number, h: number) {
  const g = scene.add.graphics().setDepth(y + h);
  g.fillStyle(0x000000, 0.25); g.fillRoundedRect(x + 4, y + 5, w, h, 5);
  g.fillStyle(0x6e5140, 1); g.fillRoundedRect(x, y, w, h, 5);
  g.lineStyle(2, 0xb28a69, 0.8); g.strokeRoundedRect(x, y, w, h, 5);
  g.fillStyle(0x2d2524, 1); g.fillCircle(x + w / 2, y + h / 2, 3);
  addCollider(scene, group, x, y, w, h);
}

function addSofa(scene: Phaser.Scene, group: any, x: number, y: number, w: number, h: number) {
  const g = scene.add.graphics().setDepth(y + h);
  g.fillStyle(0x000000, 0.28); g.fillRoundedRect(x + 5, y + 7, w, h, 10);
  g.fillStyle(0x4a3b3d, 1); g.fillRoundedRect(x, y, w, h, 10);
  g.lineStyle(3, 0x94716b, 0.8); g.strokeRoundedRect(x, y, w, h, 10);
  g.fillStyle(0x75535a, 1); g.fillRoundedRect(x + 7, y + 7, w - 14, h - 14, 7);
  g.lineStyle(2, 0xb18a80, 0.55); g.lineBetween(x + w / 2, y + 10, x + w / 2, y + h - 10);
  addCollider(scene, group, x, y + 5, w, h - 10);
}

function addDiningTable(scene: Phaser.Scene, group: any, x: number, y: number, w: number, h: number) {
  const g = scene.add.graphics().setDepth(y + h);
  g.fillStyle(0x000000, 0.3); g.fillRoundedRect(x + 6, y + 8, w, h, 8);
  g.fillStyle(0x514034, 1); g.fillRoundedRect(x, y, w, h, 8);
  g.lineStyle(3, 0xa27d59, 0.9); g.strokeRoundedRect(x, y, w, h, 8);
  g.lineStyle(2, 0x2a211e, 0.55); g.strokeRoundedRect(x + 9, y + 9, w - 18, h - 18, 4);
  g.fillStyle(0xc1a77e, 0.8); g.fillCircle(x + w / 2, y + h / 2, 5);
  addCollider(scene, group, x + 4, y + 4, w - 8, h - 8);
}

function addCabinet(scene: Phaser.Scene, group: any, x: number, y: number, w: number, h: number) {
  const g = scene.add.graphics().setDepth(y + h);
  g.fillStyle(0x000000, 0.28); g.fillRoundedRect(x + 5, y + 6, w, h, 4);
  g.fillStyle(0x42434a, 1); g.fillRoundedRect(x, y, w, h, 4);
  g.lineStyle(2, 0x9a8d83, 0.8); g.strokeRoundedRect(x, y, w, h, 4);
  g.lineStyle(2, 0x24252a, 0.8); g.lineBetween(x + w / 2, y + 5, x + w / 2, y + h - 5);
  g.fillStyle(0xc1a77e, 1); g.fillCircle(x + w / 2 - 5, y + h / 2, 2); g.fillCircle(x + w / 2 + 5, y + h / 2, 2);
  addCollider(scene, group, x, y, w, h);
}

function addKitchen(scene: Phaser.Scene, group: any, x: number, y: number, w: number, h: number) {
  const g = scene.add.graphics().setDepth(y + h);
  g.fillStyle(0x000000, 0.25); g.fillRoundedRect(x + 4, y + 6, w, h, 5);
  g.fillStyle(0x4a4c4c, 1); g.fillRoundedRect(x, y, w, h, 5);
  g.lineStyle(3, 0x9c9b91, 0.8); g.strokeRoundedRect(x, y, w, h, 5);
  g.fillStyle(0x25282b, 1); g.fillRoundedRect(x + 10, y + 8, 54, h - 16, 4);
  g.lineStyle(2, 0xb0a99e, 0.6); g.strokeCircle(x + 28, y + h / 2, 9); g.strokeCircle(x + 49, y + h / 2, 9);
  g.fillStyle(0x25282b, 1); g.fillRoundedRect(x + 82, y + 8, 48, h - 16, 4);
  g.fillStyle(0x8d9b9b, 0.8); g.fillRoundedRect(x + 153, y + 8, 98, h - 16, 4);
  addCollider(scene, group, x, y, w, h);
}

function addDesk(scene: Phaser.Scene, group: any, x: number, y: number, w: number, h: number) {
  const g = scene.add.graphics().setDepth(y + h);
  g.fillStyle(0x000000, 0.3); g.fillRoundedRect(x + 5, y + 6, w, h, 5);
  g.fillStyle(0x514239, 1); g.fillRoundedRect(x, y, w, h, 5);
  g.lineStyle(2, 0x9b7c63, 0.8); g.strokeRoundedRect(x, y, w, h, 5);
  g.fillStyle(0x252a31, 1); g.fillRoundedRect(x + 12, y + 10, w - 24, h - 20, 3);
  g.fillStyle(0x8b9ba6, 0.7); g.fillRect(x + w / 2 - 12, y + 15, 24, 3);
  addCollider(scene, group, x, y, w, h);
}

function addPlant(scene: Phaser.Scene, group: any, x: number, y: number) {
  const g = scene.add.graphics().setDepth(y + 25);
  g.fillStyle(0x000000, 0.25); g.fillEllipse(x + 3, y + 8, 37, 17);
  g.fillStyle(0x765748, 1); g.fillRoundedRect(x - 12, y - 2, 25, 25, 5);
  g.fillStyle(0x3c7955, 1); g.fillEllipse(x, y - 12, 15, 30); g.fillEllipse(x - 10, y - 4, 16, 22); g.fillEllipse(x + 10, y - 4, 16, 22);
  g.lineStyle(1, 0x8eb47c, 0.7); g.lineBetween(x, y - 24, x, y + 4);
  addCollider(scene, group, x - 14, y - 4, 28, 28);
}

function createDoor(
  scene: Phaser.Scene,
  group: any,
  doors: HouseDoor[],
  hingeX: number,
  hingeY: number,
  length: number,
  angle: number,
) {
  const horizontal = angle === 0;
  const sprite = scene.add.rectangle(
    hingeX,
    hingeY,
    length,
    13,
    0x76533e,
  );
  sprite.setOrigin(0, 0.5);
  sprite.setAngle(angle);
  sprite.setStrokeStyle(2, 0xc39a70, 1);
  sprite.setDepth(hingeY + 8);
  group.add(sprite);
  const body = sprite.body as Phaser.Physics.Arcade.StaticBody;
  body.updateFromGameObject();

  const door: HouseDoor = {
    sprite,
    open: false,
    x: hingeX + (horizontal ? length / 2 : 0),
    y: hingeY + (horizontal ? 0 : length / 2),
    angle,
  };
  doors.push(door);
}
