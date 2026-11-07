export type Equipment = {
  id: string;
  name: string;
  description: string;
  damage: number;
  cooldown: number;
  speed: number;
  color: number;
};

export const EQUIPMENT: Record<string, Equipment> = {
  "arc-pulse": {
    id: "arc-pulse",
    name: "ARC PULSE",
    description: "Proyectil energético de precisión.",
    damage: 25,
    cooldown: 450,
    speed: 430,
    color: 0x82cfff,
  },

  "foam-burst": {
    id: "foam-burst",
    name: "FOAM BURST",
    description: "Disparo ficticio de espuma.",
    damage: 12,
    cooldown: 250,
    speed: 320,
    color: 0xd8e9ff,
  },

  "echo-wave": {
    id: "echo-wave",
    name: "ECHO WAVE",
    description: "Pulso de energía.",
    damage: 40,
    cooldown: 850,
    speed: 350,
    color: 0xd69aff,
  },
};
