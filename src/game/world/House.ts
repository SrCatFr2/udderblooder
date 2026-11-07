import * as Phaser from "phaser";

export type HouseDoor = {
  sprite: any;
  open: boolean;
  x: number;
  y: number;
};

export type HouseResult = {
  obstacles: any;
  doors: HouseDoor[];
};

export function createHouse(scene: Phaser.Scene): HouseResult {
  const obstacles = scene.physics.add.staticGroup();
  const doors: HouseDoor[] = [];

  const graphics = scene.add.graphics();

  graphics.fillStyle(0x25272a);
  graphics.fillRect(0, 0, 1280, 720);

  drawRoom(scene, 40, 40, 350, 270, 0x343638);
  drawRoom(scene, 420, 40, 390, 270, 0x303234);
  drawRoom(scene, 840, 40, 400, 270, 0x343638);

  drawRoom(scene, 40, 370, 350, 300, 0x303234);
  drawRoom(scene, 420, 370, 390, 300, 0x343638);
  drawRoom(scene, 840, 370, 400, 300, 0x303234);

  graphics.lineStyle(1, 0xffffff, 0.035);

  for (let x = 0; x <= 1280; x += 48) {
    graphics.lineBetween(x, 0, x, 720);
  }

  for (let y = 0; y <= 720; y += 48) {
    graphics.lineBetween(0, y, 1280, y);
  }

  // Paredes exteriores
  addWall(scene, obstacles, 20, 20, 1240, 18);
  addWall(scene, obstacles, 20, 682, 1240, 18);
  addWall(scene, obstacles, 20, 20, 18, 680);
  addWall(scene, obstacles, 1242, 20, 18, 680);

  // Paredes interiores
  addWall(scene, obstacles, 400, 40, 14, 100);
  addWall(scene, obstacles, 400, 210, 14, 100);

  addWall(scene, obstacles, 820, 40, 14, 100);
  addWall(scene, obstacles, 820, 210, 14, 100);

  addWall(scene, obstacles, 40, 330, 130, 14);
  addWall(scene, obstacles, 235, 330, 165, 14);

  addWall(scene, obstacles, 420, 330, 120, 14);
  addWall(scene, obstacles, 610, 330, 200, 14);

  addWall(scene, obstacles, 840, 330, 140, 14);
  addWall(scene, obstacles, 1050, 330, 190, 14);

  addWall(scene, obstacles, 400, 370, 14, 110);
  addWall(scene, obstacles, 400, 550, 14, 120);

  addWall(scene, obstacles, 820, 370, 14, 110);
  addWall(scene, obstacles, 820, 550, 14, 120);

  // Muebles
  addFurniture(scene, obstacles, 90, 100, 115, 65, 0x63534c);
  addFurniture(scene, obstacles, 250, 210, 80, 55, 0x514c49);

  addFurniture(scene, obstacles, 500, 100, 130, 65, 0x67564b);
  addFurniture(scene, obstacles, 700, 220, 65, 45, 0x4d555c);

  addFurniture(scene, obstacles, 950, 100, 125, 60, 0x5d514a);
  addFurniture(scene, obstacles, 1100, 220, 70, 45, 0x50545a);

  addFurniture(scene, obstacles, 100, 450, 110, 65, 0x55504b);
  addFurniture(scene, obstacles, 280, 570, 65, 45, 0x55504b);

  addFurniture(scene, obstacles, 500, 440, 120, 70, 0x655149);
  addFurniture(scene, obstacles, 700, 580, 65, 45, 0x50545a);

  addFurniture(scene, obstacles, 950, 450, 110, 65, 0x655149);
  addFurniture(scene, obstacles, 1110, 580, 65, 45, 0x50545a);

  // Puertas
  createDoor(scene, obstacles, doors, 407, 175, 18, 70);
  createDoor(scene, obstacles, doors, 827, 175, 18, 70);

  createDoor(scene, obstacles, doors, 185, 337, 55, 18);
  createDoor(scene, obstacles, doors, 570, 337, 55, 18);
  createDoor(scene, obstacles, doors, 990, 337, 55, 18);

  createDoor(scene, obstacles, doors, 407, 505, 18, 70);
  createDoor(scene, obstacles, doors, 827, 505, 18, 70);

  return { obstacles, doors };
}

function drawRoom(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  color: number,
) {
  const room = scene.add.rectangle(
    x + width / 2,
    y + height / 2,
    width,
    height,
    color,
  );

  room.setStrokeStyle(1, 0xffffff, 0.08);
}

function addWall(
  scene: Phaser.Scene,
  group: any,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const wall = scene.add.rectangle(
    x + width / 2,
    y + height / 2,
    width,
    height,
    0x777477,
  );

  wall.setStrokeStyle(1, 0xaaa4a4);

  group.add(wall);

  const body = wall.body as Phaser.Physics.Arcade.StaticBody;
  body.updateFromGameObject();

  return wall;
}

function addFurniture(
  scene: Phaser.Scene,
  obstacles: any,
  x: number,
  y: number,
  width: number,
  height: number,
  color: number,
) {
  const furniture = scene.add.rectangle(
    x + width / 2,
    y + height / 2,
    width,
    height,
    color,
  );

  furniture.setStrokeStyle(2, 0x171719);
  furniture.setDepth(3);

  scene.add.rectangle(
    x + width / 2,
    y + height - 3,
    width - 10,
    6,
    0x000000,
    0.2,
  ).setDepth(2);

  const bodyObject = scene.add.rectangle(
    x + width / 2,
    y + height / 2,
    width - 8,
    height - 8,
    0xffffff,
    0,
  );

  obstacles.add(bodyObject);

  const body = bodyObject.body as Phaser.Physics.Arcade.StaticBody;
  body.updateFromGameObject();
}

function createDoor(
  scene: Phaser.Scene,
  obstacles: any,
  doors: HouseDoor[],
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const door = scene.add.rectangle(
    x + width / 2,
    y + height / 2,
    width,
    height,
    0x98775c,
  );

  door.setStrokeStyle(2, 0xd0ad83);

  obstacles.add(door);

  const body = door.body as Phaser.Physics.Arcade.StaticBody;
  body.updateFromGameObject();

  doors.push({
    sprite: door,
    open: false,
    x: x + width / 2,
    y: y + height / 2,
  });
}
