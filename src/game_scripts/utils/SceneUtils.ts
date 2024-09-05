import { Character } from "../character";

export function visualizeOccupiedGrids(
  debugGraphics: Phaser.GameObjects.Graphics,
  grids: { x: number; y: number }[],
  cellSize: number,
  color: number
) {
  debugGraphics.fillStyle(color, 0.3);
  grids.forEach((grid) => {
    debugGraphics.fillRect(
      grid.x * cellSize,
      grid.y * cellSize,
      cellSize,
      cellSize
    );
  });
}

export function selectCharacter(
  selectedCharacter: Character | null,
  character: Character | null
) {
  selectedCharacter = character;
  if (character) {
    console.log("Character selected:", character.texture.key);
  } else {
    console.log("No character selected.");
  }
}

export function handlePointerDown(
  pointer: Phaser.Input.Pointer,
  camera: Phaser.Cameras.Scene2D.Camera,
  characters: Character[],
  selectCharacter: (character: Character | null) => void
) {
  const worldPoint = pointer.positionToCamera(camera) as Phaser.Math.Vector2;

  const clickedCharacter = characters.find((character) => {
    const bounds = character.getBounds();
    return bounds.contains(worldPoint.x, worldPoint.y);
  });

  if (clickedCharacter) {
    selectCharacter(clickedCharacter);
  } else {
    selectCharacter(null);
  }
}
