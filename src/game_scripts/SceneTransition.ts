import Phaser from "phaser";

// Interface for transition configuration
export interface TransitionConfig {
  targetScene: string;
  duration?: number;
  fadeColor?: number;
  callback?: () => void;
  data?: any; // optional data to pass to the target scene
}

// Function to handle the transition
export function handleTransition(
  scene: Phaser.Scene,
  config: TransitionConfig
) {
  const {
    targetScene,
    duration = 1000,
    fadeColor = 0x000000,
    callback,
    data,
  } = config;

  // Use Phaser's scene transition feature
  scene.cameras.main.fadeOut(
    duration,
    (fadeColor >> 16) & 0xff,
    (fadeColor >> 8) & 0xff,
    fadeColor & 0xff
  );

  scene.cameras.main.once("camerafadeoutcomplete", () => {
    // Start the target scene
    scene.scene.start(targetScene, data);

    // If provided, call the callback after the transition
    if (callback) {
      callback();
    }
  });
}
