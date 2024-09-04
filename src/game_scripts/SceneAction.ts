// SceneAction.ts
import { Character, CharacterState } from "./character"; // Import CharacterState from character.ts
export type ActionCallback = () => void;

export type SceneActionType =
  | "moveCameraTo"
  | "followObject"
  | "releaseCamera"
  | "zoomCamera"
  | "changeCharacterState"
  | "moveCharacterTo"
  | "changeCharacterAppearance"
  | "playCharacterAnimation"
  | "displayPopup"
  | "updateStoryWindow"
  | "triggerInkEvent"
  | "triggerBattle"
  | "triggerCutscene"
  | "playSoundEffect"
  | "displayDialogue";

export default interface SceneActionData {
  x?: number;
  y?: number;
  zoom?: number;
  character?: Character;
  newState?: CharacterState;
  animationKey?: string;
  text?: string;
  object?: Phaser.GameObjects.GameObject;
  soundKey?: string;
  inkEventKey?: string;
  popupText?: string;
  appearanceKey?: string;
  storyText?: string;
  targetGrids?: { x: number; y: number }[]; // Add targetGrids array
  delta?: number; // Add delta
  speed?: number; // Add speed
}

export class SceneAction {
  type: SceneActionType;
  data: SceneActionData;
  callback?: ActionCallback;

  constructor(
    type: SceneActionType,
    data: SceneActionData,
    callback?: ActionCallback
  ) {
    this.type = type;

    // Ensure newState is provided when changing character state
    if (type === "changeCharacterState" && !data.newState) {
      throw new Error("newState is required for changeCharacterState actions");
    }

    this.data = data;
    this.callback = callback;
  }
}
