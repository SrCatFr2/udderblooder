export type Equipment = {
  id: string;
  name: string;
  description: string;
  damage: number;
  cooldown: number;
  speed: number;
  color: number;
  kind: "fists" | "projectile";
};

export const EQUIPMENT: Record<string, Equipment> = {
  fists: {
    id: "fists",
    name: "BARE HANDS",
    description: "Combate cuerpo a cuerpo.",
    damage: 18,
    cooldown: 420,
    speed: 0,
    color: 0xd7b18c,
    kind: "fists",
  },
  "arc-pulse": {
    id: "arc-pulse",
    name: "ARC PULSE",
    description: "Dispositivo de energía ficticio.",
    damage: 25,
    cooldown: 520,
    speed: 440,
    color: 0x82cfff,
    kind: "projectile",
  },
  "foam-burst": {
    id: "foam-burst",
    name: "FOAM BURST",
    description: "Lanzador de espuma de corto alcance.",
    damage: 12,
    cooldown: 300,
    speed: 330,
    color: 0xd8e9ff,
    kind: "projectile",
  },
  "echo-wave": {
    id: "echo-wave",
    name: "ECHO WAVE",
    description: "Pulso de energía de alto impacto.",
    damage: 40,
    cooldown: 900,
    speed: 360,
    color: 0xd69aff,
    kind: "projectile",
  },
};
