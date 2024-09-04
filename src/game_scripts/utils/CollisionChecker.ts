import Phaser from "phaser";
import Grid from "./grid";

export class CollisionChecker {
  private scene: Phaser.Scene;
  private collisionLayer: Phaser.Tilemaps.TilemapLayer;
  private gridSize: number;

  constructor(
    scene: Phaser.Scene,
    collisionLayer: Phaser.Tilemaps.TilemapLayer,
    grid: Grid
  ) {
    this.scene = scene;
    this.collisionLayer = collisionLayer;
    this.gridSize = grid.getCellSize();
  }

  isPositionFree(nextOccupiedGrids: { x: number; y: number }[]): boolean {
    return !nextOccupiedGrids.some((grid) => {
      const worldX = grid.x * this.gridSize;
      const worldY = grid.y * this.gridSize;
      const tile = this.collisionLayer.getTileAtWorldXY(worldX, worldY);
      return tile && tile.properties.collides;
    });
  }
}
