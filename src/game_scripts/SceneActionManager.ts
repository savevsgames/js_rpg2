// SceneActionManager.ts
import utils from "./utils/utils";
import { SceneAction, SceneActionType, ActionCallback } from "./SceneAction";
import { Character, CharacterState } from "./character"; // Import CharacterState from character.ts
// import SceneActionData from "../game_scripts/utils/SceneActionData"; // Import SceneActionData interface

export class SceneActionManager {
  private scene: Phaser.Scene;
  private actionQueue: SceneAction[] = [];
  private isExecuting: boolean = false;
  private camera: Phaser.Cameras.Scene2D.Camera;
  private speed: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.camera = scene.cameras.main;
    this.speed = utils.speed;
  }

  // Queue a new action and attempt to execute it
  queueAction(action: SceneAction) {
    this.actionQueue.push(action);
    this.tryExecuteNextAction(0); // Pass 0 as a default delta
  }

  // Update method that should be called in the main scene update loop
  update(time: number, delta: number) {
    if (!this.isExecuting && this.actionQueue.length > 0) {
      this.tryExecuteNextAction(delta);
    }
  }

  // Attempt to execute the next action in the queue
  private tryExecuteNextAction(delta?: number) {
    if (this.isExecuting || this.actionQueue.length === 0) {
      return;
    }

    const nextAction = this.actionQueue.shift();
    if (nextAction) {
      this.isExecuting = true;
      this.executeAction(nextAction, delta || 0); // Pass 0 as a default delta
    }
  }

  // Executes the given action based on its type
  private executeAction(action: SceneAction, delta: number) {
    switch (action.type) {
      case "moveCameraTo":
        this.moveCameraTo(
          action.data.x!,
          action.data.y!,
          action.data.zoom!,
          delta,
          action.callback
        );
        break;
      case "zoomCamera":
        this.zoomCamera(action.data.zoom!, delta, action.callback);
        break;
      case "moveCharacterTo":
        this.moveCharacterTo(
          action.data.character!,
          action.data.targetGrids!, // Pass the array of target grids
          delta, // Pass delta to the moveCharacterTo method
          action.callback
        );
        break;
      case "changeCharacterAppearance":
        this.changeCharacterAppearance(
          action.data.character!,
          action.data.appearanceKey!,
          delta,
          action.callback
        );
        break;
      case "playCharacterAnimation":
        this.playCharacterAnimation(
          action.data.character!,
          action.data.animationKey!,
          action.callback
        );
        break;
      case "displayPopup":
        this.displayPopup(
          action.data.text!,
          action.data.x!,
          action.data.y!,
          action.callback
        );
        break;
      case "updateStoryWindow":
        this.updateStoryWindow(action.data.storyText!, action.callback);
        break;
      case "triggerInkEvent":
        this.triggerInkEvent(action.data.inkEventKey!, action.callback);
        break;
      case "triggerBattle":
        this.triggerBattle(action.callback);
        break;
      case "triggerCutscene":
        this.triggerCutscene(action.callback);
        break;
      case "playSoundEffect":
        this.playSoundEffect(action.data.soundKey!, action.callback);
        break;
      case "displayDialogue":
        this.displayDialogue(
          action.data.text!,
          action.data.character!,
          action.callback
        );
        break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
        this.completeAction();
        break;
    }
  }

  private moveCameraTo(
    x: number,
    y: number,
    zoom: number,
    delta: number,
    callback?: ActionCallback
  ) {
    this.camera.pan(x, y, 1000, "Power2");
    this.camera.zoomTo(zoom, 1000, "Power2", true, (camera, progress) => {
      if (progress === 1) {
        callback?.();
        this.completeAction(delta);
      }
    });
  }

  // Follow a specific game object with the camera
  private followObject(
    object: Phaser.GameObjects.GameObject,
    delta: number,
    callback?: ActionCallback
  ) {
    this.camera.startFollow(object, true, 0.05, 0.05);
    callback?.();
    this.completeAction(delta);
  }

  // Release the camera from following any object and reset zoom
  private releaseCamera(delta: number, callback?: ActionCallback) {
    this.camera.stopFollow();
    this.camera.zoomTo(1, 1000, "Power2", true, (camera, progress) => {
      if (progress === 1) {
        callback?.();
        this.completeAction(delta);
      }
    });
  }

  // Zoom the camera to a specific level
  private zoomCamera(zoom: number, delta: number, callback?: ActionCallback) {
    this.camera.zoomTo(zoom, 1000, "Power2", true, (camera, progress) => {
      if (progress === 1) {
        callback?.();
        this.completeAction(delta);
      }
    });
  }

  // Change the state of a character (e.g., idle, walking, attacking)
  private changeCharacterState(
    character: Character,
    newState: CharacterState,
    delta: number,
    callback?: ActionCallback
  ) {
    character.setCharacterState(newState);
    callback?.();
    this.completeAction(delta);
  }

  // Move a character to a specific position over time
  private moveCharacterTo(
    character: Character,
    targetGrids: { x: number; y: number }[],
    delta: number,
    callback?: ActionCallback
  ) {
    // Check if targetGrids is properly defined
    if (!targetGrids || targetGrids.length === 0) {
      console.error("No valid target grids to move to.");
      return;
    }
    // Set the character's target grids
    character.setTargetGrids(targetGrids);
    // Start the movement towards the grid
    character.moveToGrid(targetGrids, delta);

    // Check periodically if the movement is done
    const checkMovementCompletion = () => {
      if (character.hasReachedTarget()) {
        console.log("Character has reached the target!");

        // When movement is complete, update grids
        character.updateOccupiedGrids();

        // Call the callback if provided
        if (callback) {
          callback();
        }

        // Complete the action in the action manager
        this.completeAction(delta);

        // Stop the checking loop
        this.scene.time.removeAllEvents();
      }
    };

    // Use Phaser's built-in event timer to check periodically if the character has finished moving
    this.scene.time.addEvent({
      delay: 100, // Check every 100ms (adjust this interval as needed)
      callback: checkMovementCompletion,
      loop: true,
    });
  }

  // Change the appearance of a character (e.g., swap textures)
  private changeCharacterAppearance(
    character: Character,
    appearanceKey: string,
    delta: number,
    callback?: ActionCallback
  ) {
    character.setTexture(appearanceKey);
    callback?.();
    this.completeAction(delta);
  }

  // Play a specific animation on a character
  private playCharacterAnimation(
    character: Character,
    animationKey: string,
    callback?: ActionCallback
  ) {
    character.play(animationKey);
    character.once("animationcomplete", () => {
      callback?.();
      this.completeAction();
    });
  }

  // Display a popup message at a specified location
  private displayPopup(
    text: string,
    x: number,
    y: number,
    callback?: ActionCallback // Ensure callback is optional and properly typed
  ) {
    const popup = this.scene.add
      .text(x, y, text, {
        fontSize: "24px",
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: { x: 10, y: 10 },
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setDepth(999);

    this.scene.time.delayedCall(3000, () => {
      popup.destroy();
      callback?.(); // Safely call the callback if it exists
      this.completeAction();
    });
  }

  // Update the story window with new text
  // Update the story window with new text
  private updateStoryWindow(storyText: string, callback?: ActionCallback) {
    // TODO: Implement logic to update the story window with the provided text.
    console.log("Updating story window:", storyText);

    // Mark the action as complete
    callback?.(); // Call the callback if provided
    this.completeAction();
  }

  // Trigger an event in the Ink story system
  private triggerInkEvent(inkEventKey: string, callback?: ActionCallback) {
    // TODO: Implement logic to trigger an event in Ink using the provided event key.
    console.log("Triggering Ink event:", inkEventKey);

    // Mark the action as complete
    callback?.(); // Call the callback if provided
    this.completeAction();
  }

  // Trigger a battle sequence
  private triggerBattle(callback?: ActionCallback) {
    // TODO: Implement logic to start a battle sequence.
    console.log("Starting battle...");

    // Mark the action as complete
    callback?.(); // Call the callback if provided
    this.completeAction();
  }

  // Trigger a cutscene
  private triggerCutscene(callback?: ActionCallback) {
    // TODO: Implement logic to start a cutscene.
    console.log("Starting cutscene...");

    // Mark the action as complete
    callback?.(); // Call the callback if provided
    this.completeAction();
  }

  // Play a sound effect
  private playSoundEffect(soundKey: string, callback?: ActionCallback) {
    // Play the sound effect associated with the given key
    this.scene.sound.play(soundKey);

    // Mark the action as complete
    callback?.(); // Call the callback if provided
    this.completeAction();
  }

  // Display dialogue for a character
  private displayDialogue(
    text: string,
    character: Character,
    callback?: ActionCallback
  ) {
    // TODO: Implement logic to display dialogue for the specified character.
    console.log(`Displaying dialogue for ${character}: ${text}`);

    // Mark the action as complete
    callback?.(); // Call the callback if provided
    this.completeAction();
  }

  // Mark the current action as complete and attempt to execute the next one
  private completeAction(delta?: number) {
    this.isExecuting = false;
    this.tryExecuteNextAction(delta || 0); // Pass 0 as a default delta
  }

  // Add the method to check if an action is being executed
  public isActionPlaying(): boolean {
    return this.isExecuting;
  }
}
