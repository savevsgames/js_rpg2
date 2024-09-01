import Phaser from "phaser";
import Level from "./scenes/Level";
import Preload from "./scenes/Preload";
import MainGameScene from "./scenes/MainGameScene.ts";

class Boot extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.pack("pack", "assets/preload-asset-pack.json");
  }

  create() {
    this.scene.start("MainGameScene");
  }
}

window.addEventListener("load", function () {
  const game = new Phaser.Game({
    width: 1920,
    height: 1080,
    backgroundColor: "#2f2f2f",
    parent: "game-container",
    scale: {
      mode: Phaser.Scale.ScaleModes.FIT,
      autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    },
    scene: [Boot, Preload, Level, MainGameScene],
    dom: {
      createContainer: true,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: {
          x: 0,
          y: 0,
        },
      },
    },
  });

  game.scene.start("Boot");
});
