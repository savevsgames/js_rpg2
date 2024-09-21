// SceneManager.ts
import { handleTransition, TransitionConfig } from "./SceneTransition";

export default class SceneManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  loadNewScene(targetScene: string, tilesetKey: string, duration = 2000): void {
    const transitionConfig: TransitionConfig = {
      targetScene,
      duration,
      fadeColor: 0x000000, // Black fade transition, you can change this as needed
      data: { tilesetKey }, // Pass the tilesetKey to the next scene
    };

    handleTransition(this.scene, transitionConfig);
  }
}
