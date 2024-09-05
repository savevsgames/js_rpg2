import Phaser from "phaser";
import Grid from "./grid";
import utils from "./utils";

export class CollisionChecker {
  private scene: Phaser.Scene;
  private collisionLayer: Phaser.Tilemaps.TilemapLayer;
  private gridSize: number;
  private worldWidth: number;
  private worldHeight: number;

  constructor(
    scene: Phaser.Scene,
    collisionLayer: Phaser.Tilemaps.TilemapLayer,
    grid: Grid,
    worldWidth: number,
    worldHeight: number
  ) {
    this.scene = scene;
    this.collisionLayer = collisionLayer;
    this.gridSize = grid.getCellSize();
    this.worldWidth = this.scene.physics.world.bounds.width;
    this.worldHeight = this.scene.physics.world.bounds.height;
  }

  isPositionFree(nextOccupiedGrids: { x: number; y: number }[]): boolean {
    // Check if the next position is within the world bounds
    const isWithinBounds = nextOccupiedGrids.every((grid) => {
      const worldX = utils.withGrid(grid.x);
      const worldY = utils.withGrid(grid.y);
      return (
        worldX >= 0 &&
        worldX < this.worldWidth &&
        worldY >= 0 &&
        worldY < this.worldHeight
      );
    });

    if (!isWithinBounds) {
      return false; // Block movement if out of bounds
    }
    // Check if the next position is free of collidable tiles
    return !nextOccupiedGrids.some((grid) => {
      const worldX = grid.x * this.gridSize;
      const worldY = grid.y * this.gridSize;
      const tile = this.collisionLayer.getTileAtWorldXY(worldX, worldY);
      // Debug output
      console.log(`Checking tile at world position (${worldX}, ${worldY})`);
      console.log(
        `Tile at (${grid.x}, ${grid.y}) in grid. Collidable: `,
        tile ? tile.properties.collides : "No tile"
      );

      return tile && tile.properties.collides;
    });
  }
}
