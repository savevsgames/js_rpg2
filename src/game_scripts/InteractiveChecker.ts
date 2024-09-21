// InteractiveChecker.ts
import Phaser from "phaser";
import { SceneActionManager } from "./SceneActionManager";
import SceneManager from "./SceneManager"; // Import SceneManager
import utils from "./utils/utils";
import Grid from "./utils/grid";

export class InteractiveChecker {
  private scene: Phaser.Scene;
  private grid: Grid;
  private sceneActionManager: SceneActionManager;
  private sceneManager: SceneManager; // Add SceneManager
  private teleporters: { x: number; y: number; targetMap: string; targetTileset: string }[] = [];
  private interactions: { x: number; y: number; action: () => void }[] = []; // For interactive grid spaces

  constructor(scene: Phaser.Scene, grid: Grid, sceneActionManager: SceneActionManager, sceneManager: SceneManager) {
    this.scene = scene;
    this.grid = grid;
    this.sceneActionManager = sceneActionManager;
    this.sceneManager = sceneManager; // Initialize SceneManager
  }

  // Method to add a teleporter to the grid
  addTeleporter(x: number, y: number, targetMap: string, targetTileset: string) {
    this.teleporters.push({ x, y, targetMap, targetTileset });
  }

  // Method to add interaction areas
  addInteraction(x: number, y: number, action: () => void) {
    this.interactions.push({ x, y, action });
  }

  // Check if the character is moving into a teleporter grid
  checkForTeleporter(characterGridPosition: { x: number; y: number }): boolean {
    const teleporter = this.teleporters.find(teleporter =>
      teleporter.x === characterGridPosition.x && teleporter.y === characterGridPosition.y
    );

    if (teleporter) {
      // Call the instance method from sceneManager instead of a static call
      this.sceneManager.loadNewScene(teleporter.targetMap, teleporter.targetTileset);
      return true;
    }
    return false;
  }

  // Check if the character is moving into an interaction grid
  checkForInteraction(characterGridPosition: { x: number; y: number }): boolean {
    const interaction = this.interactions.find(interaction =>
      interaction.x === characterGridPosition.x && interaction.y === characterGridPosition.y
    );

    if (interaction) {
      // Trigger action via SceneActionManager
      interaction.action();
      return true;
    }
    return false;
  }

  // Combined check for teleporter and interaction
  checkGridInteractions(nextOccupiedGrids: { x: number; y: number }[]): void {
    nextOccupiedGrids.forEach(grid => {
      if (this.checkForTeleporter(grid)) {
        console.log("Teleporter triggered.");
        return; // Skip further checks if teleporter is triggered
      }

      if (this.checkForInteraction(grid)) {
        console.log("Interaction triggered.");
        return; // Skip further checks if interaction is triggered
      }
    });
  }
}
