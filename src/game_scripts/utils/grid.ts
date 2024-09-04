export default class Grid {
  private scene: Phaser.Scene;
  private cellSize: number;
  private graphics: Phaser.GameObjects.Graphics;
  private visible: boolean;

  constructor(scene: Phaser.Scene, cellSize: number = 16) {
    this.scene = scene;
    this.cellSize = cellSize;
    this.graphics = scene.add.graphics();
    this.visible = true;

    this.draw();
    // Add camera move listener
    this.scene.cameras.main.on("cameramove", this.updateGrid, this);
  }

  draw(): void {
    this.graphics.clear();

    const worldBounds = this.scene.physics.world.bounds;

    this.graphics.lineStyle(1, 0xffffff, 0.5); // White lines with 0.5 alpha

    // Calculate the starting and ending grid lines based on the entire world bounds
    const startX = worldBounds.left;
    const startY = worldBounds.top;
    const endX = worldBounds.right;
    const endY = worldBounds.bottom;

    // Draw vertical lines across the entire world bounds
    for (let x = startX; x <= endX; x += this.cellSize) {
      this.graphics.moveTo(x, startY);
      this.graphics.lineTo(x, endY);
    }

    // Draw horizontal lines across the entire world bounds
    for (let y = startY; y <= endY; y += this.cellSize) {
      this.graphics.moveTo(startX, y);
      this.graphics.lineTo(endX, y);
    }

    this.graphics.strokePath();
  }

  // Method to get the next position on the grid
  getNextPosition(
    currentX: number,
    currentY: number,
    direction: string
  ): { x: number; y: number } {
    let nextX = Math.floor(currentX / this.cellSize); // Convert current world position to grid coordinate
    let nextY = Math.floor(currentY / this.cellSize); // Convert current world position to grid coordinate

    switch (direction) {
      case "up":
        nextY -= 1;
        break;
      case "down":
        nextY += 1;
        break;
      case "left":
        nextX -= 1;
        break;
      case "right":
        nextX += 1;
        break;
    }

    // Convert back to world coordinates for checking collisions
    return { x: nextX, y: nextY };
  }

  toggle(): void {
    this.visible = !this.visible;
    this.graphics.setVisible(this.visible);
  }

  show(): void {
    this.visible = true;
    this.graphics.setVisible(true);
  }

  hide(): void {
    this.visible = false;
    this.graphics.setVisible(false);
  }

  updateGrid(): void {
    if (this.visible) {
      this.draw();
    }
  }

  destroy(): void {
    this.scene.cameras.main.off("cameramove", this.updateGrid, this);
    this.graphics.destroy();
  }

  getCellSize(): number {
    return this.cellSize;
  }
}
