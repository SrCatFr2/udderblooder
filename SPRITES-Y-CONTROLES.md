# Udder Blooder — rework de Residence 01

## Personaje inicial: Abraham

El registro de personajes vive en `src/game/entities/characters.ts`.
Los PNG de Abraham van en `public/sprites/characters/abraham/`:

- `idle.png`
- `punch.png`
- `weapon.png`
- `kick-door.png`
- `dead.png`

Todos deben ser PNG transparentes, cenitales, mirando hacia la parte superior y con el mismo lienzo y pivote. El tamaño recomendado del lienzo es 128×128 px. El juego muestra una figura provisional si todavía falta alguno.

Para añadir otro personaje:
1. Crea `public/sprites/characters/<id>/`.
2. Coloca los mismos cinco PNG.
3. Añade una entrada en `CHARACTERS` dentro de `src/game/entities/characters.ts`.
4. Si quieres iniciarlo por defecto, cambia `DEFAULT_CHARACTER_ID`.

## Controles

- WASD / flechas: moverse.
- SHIFT: correr.
- SPACE: puñetazo / usar equipamiento.
- E: abrir o cerrar una puerta cercana.
- F: patear una puerta cercana.
- 1: puños.
- 2: Arc Pulse.
- 3: Echo Wave.

## Importante sobre `.env`

El ZIP original contenía un archivo `.env`. No se incluyó en este paquete de rework. No subas secretos al repositorio: configura `MONGODB_URI` y cualquier otra variable desde Vercel → Project → Settings → Environment Variables. Si un secreto estuvo publicado en GitHub, rótalo.
