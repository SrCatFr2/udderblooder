export type CharacterPose = "idle" | "punch" | "weapon" | "kick-door" | "dead";

export type CharacterDefinition = {
  id: string;
  name: string;
  sprites: Record<CharacterPose, string>;
  displayWidth: number;
  displayHeight: number;
  hitboxWidth: number;
  hitboxHeight: number;
  hitboxOffsetY: number;
};

export const CHARACTERS: Record<string, CharacterDefinition> = {
  abraham: {
    id: "abraham",
    name: "Abraham",
    sprites: {
      idle: "/sprites/characters/abraham/idle.png",
      punch: "/sprites/characters/abraham/punch.png",
      weapon: "/sprites/characters/abraham/weapon.png",
      "kick-door": "/sprites/characters/abraham/kick-door.png",
      dead: "/sprites/characters/abraham/dead.png",
    },
    displayWidth: 52,
    displayHeight: 68,
    hitboxWidth: 22,
    hitboxHeight: 20,
    hitboxOffsetY: 20,
  },
};

export const DEFAULT_CHARACTER_ID = "abraham";

export function getCharacter(id: string): CharacterDefinition {
  return CHARACTERS[id] ?? CHARACTERS[DEFAULT_CHARACTER_ID];
}

export function characterTextureKey(characterId: string, pose: CharacterPose) {
  return `character-${characterId}-${pose}`;
}
