// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
/* START-USER-IMPORTS */
import { Character, CharacterState } from "../game_scripts/character";
import Grid from "../game_scripts/utils/grid";
import utils, { withGrid } from "../game_scripts/utils/utils";
import StoryBox from "../game_scripts/StoryBox";
import { StoryBoxConfig } from "../game_scripts/interfaces/StoryBoxConfig";
import { DirectionInput } from "../game_scripts/utils/DirectionInput";
import { CollisionChecker } from "../game_scripts/utils/CollisionChecker";
import * as inkjs from "inkjs";
import {
  handleTransition,
  TransitionConfig,
} from "../game_scripts/SceneTransition";
// Add SceneActionManager to the Scene
import {
  SceneAction,
  SceneActionType,
} from "../../src/game_scripts/SceneAction";
import { SceneActionManager } from "../../src/game_scripts/SceneActionManager";
import speed from "../game_scripts/utils/utils";
import {
  visualizeOccupiedGrids,
  selectCharacter,
  handlePointerDown,
} from "../game_scripts/utils/SceneUtils";
import { DesktopControls } from "../game_scripts/utils/DesktopControls";
/* END-USER-IMPORTS */

export default class ShadowtideHarbourV1 extends Phaser.Scene {

	constructor() {
		super("ShadowtideHarbourV1");

		/* START-USER-CTR-CODE */
    // Write your code here.
    this.grid = null;
    this.cellSize = 16;
    this.characters;
    /* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// shadowtide_harbour_v1_baselayer_1
		const shadowtide_harbour_v1_baselayer_1 = this.add.tilemap("shadowtide_harbour_v1_baselayer_1");
		shadowtide_harbour_v1_baselayer_1.addTilesetImage("Shadowtide_Harbour_Base_Map", "Shadowtide_Harbour_V1");

		// Shadowtide Harbour TilemapLayer
		shadowtide_harbour_v1_baselayer_1.createLayer("Base Map", ["Shadowtide_Harbour_Base_Map"], 0, 0);

		this.shadowtide_harbour_v1_baselayer_1 = shadowtide_harbour_v1_baselayer_1;

		this.events.emit("scene-awake");
	}

	private shadowtide_harbour_v1_baselayer_1!: Phaser.Tilemaps.Tilemap;

	/* START-USER-CODE */
  private character!: Character;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private grid: Grid | null;
  private cellSize: number;
  private storyBox: StoryBox | null = null;
  private directionInput = new DirectionInput();
  private collisionChecker!: CollisionChecker;
  private debugGraphics!: Phaser.GameObjects.Graphics;
  private jsonData: any;
  private backgroundMusic!: Phaser.Sound.BaseSound;
  private controls!: Phaser.Cameras.Controls.SmoothedKeyControl;
  private characters: Character[] = []; // Array to store all characters
  private selectedCharacter: Character | null = null; // Track selected character
  private actionManager!: SceneActionManager; // Declare the actionManager property
  private speed: number;
  private isDragging: boolean = false; // Track whether dragging is active
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private desktopControls: DesktopControls;

  // Write your code here

  create() {
    this.editorCreate();

    let delta = this.game.loop.delta;

    // Define the cameraBounds for the world to allow the controls initialization
    const cameraBounds = {
      width: 3840, // Use the actual width of your world or scene
      height: 2160, // Use the actual height of your world or scene
    };

    // Set the world bounds
    this.physics.world.setBounds(0, 0, 3840, 2160);

    // set the world bounds to collide
    this.physics.world.setBoundsCollision(true, true, true, true);

    // Create the grid
    this.grid = new Grid(this, this.cellSize);

    if (!this.grid) {
      console.log("Grid does not exist. Creating a new one from utils.");
      this.grid = utils.createGrid(this, 16); // Assuming 16 is your grid cell size, adjust as needed
    }

    // this.collisionChecker = new CollisionChecker(
    //   this,
    //   this.tile_Layer,
    //   this.grid,
    //   this.physics.world.bounds.width,
    //   this.physics.world.bounds.height
    // );

    // Proceed to initialize the DesktopControls
    this.desktopControls = new DesktopControls(
      this,
      this.directionInput,
      this.collisionChecker
    );

    // Call the setupInputs method to initialize input handling
    this.desktopControls.setupInputs(
      this.characters,
      this.grid,
      { width: 3840, height: 2160 }, // Example camera bounds
      (character: Character | null) => {
        // Update the selected character when it's changed
        this.selectedCharacter = character;
        if (character) {
          console.log("Character selected:", character.texture.key);
        } else {
          console.log("No character selected.");
        }
      }
    );

    // Initialize debug graphics for visualizing occupied grids
    this.debugGraphics = this.add.graphics({
      lineStyle: { width: 1, color: 0xff0000, alpha: 0.8 },
      fillStyle: { color: 0xff0000, alpha: 0.3 },
    });

    // Initialize the player
    this.speed = utils.speed;
    this.character = new Character(this, 5, 5, "Warrior_Blue", this.grid);
    this.characters.push(this.character);
    const character_2 = new Character(this, 20, 5, "Warrior_Blue", this.grid);
    this.characters.push(character_2);
    // Initialize selected character as null
    this.selectedCharacter = null;

    // Set up DirectionInput for WASD
    this.directionInput.init();

    // Enable collision for tiles with the 'collides' property
    this.shadowtide_harbour_v1_baselayer_1.setCollisionByProperty({
      collides: true,
    });

    // CAMERA SETTINGS
    this.cameras.main.setBounds(0, 0, 3840, 2160);

    // STORY JSON CREATION
    const storyData = this.cache.json.entries.get("chapter_1.ink");

    if (storyData) {
      // Now you can use this data to create your Ink story
      const story = new inkjs.Story(storyData);

      // Use the story object as needed
      console.log(story.Continue());
    } else {
      console.error("Failed to load ink story data");
    }
    const inkStory = new inkjs.Story(storyData);

    // STORY BOX CONFIGURATION using Ink content

    this.displayInkContent(inkStory);

    // Initialize Occupied Grids Visualization
    this.character.updateOccupiedGrids();
    visualizeOccupiedGrids(
      this.debugGraphics,
      this.character.getOccupiedGrids(),
      16,
      0x00ff00
    ); // Current position in green
    // console.log("Occupied Grids:", this.character.getOccupiedGrids());

    // Add Music to the Scene
    // Initialize the background music
    this.backgroundMusic = this.sound.add("The_Journey_Begins_110bpm_120s");

    // Play the background music
    this.backgroundMusic.play({
      loop: true, // Make the music loop
      volume: 0.5, // Adjust the volume as needed
    });

    // SCENE ACTION MANAGER
    // Create SceneActionManager instance
    // const actionManager = new SceneActionManager(this);
    // Initialize the action manager
    this.actionManager = new SceneActionManager(this);

    // Queue actions
    // Queue actions

    // Move camera to a specific location with a certain zoom level
    this.actionManager.queueAction(
      new SceneAction("moveCameraTo", { x: 1920, y: 1080, zoom: 0.5 })
    );

    // Move the character to a specific position
    this.actionManager.queueAction(
      new SceneAction("moveCharacterTo", {
        character: character_2,
        targetGrids: [{ x: 20, y: 100 }], // Ensure this is defined
        delta: delta, // Ensure delta is provided
      })
    );

    //
    //
  } // End of create method

  /**
   *
   * @param inkStory
   *
   */
  // DisplayInkContent
  displayInkContent(inkStory: inkjs.Story): void {
    let storyContent: string[] = [];

    // Ensure to get the first piece of content right away
    if (inkStory.canContinue) {
      storyContent.push(inkStory?.Continue()?.trim() || "");
    }

    // Continue the story until there's no more content or a choice is reached
    while (inkStory.canContinue || inkStory.currentChoices.length > 0) {
      // Add the current story content
      if (inkStory.canContinue) {
        storyContent.push(inkStory?.Continue()?.trim() || "");
      }

      // Handle choices if any
      if (inkStory.currentChoices.length > 0) {
        inkStory.currentChoices.forEach((choice, index) => {
          storyContent.push(`${index + 1}: ${choice.text}`);
        });

        // Make a choice (for debugging purposes, always pick the first one)
        inkStory.ChooseChoiceIndex(0);
      }
    }

    // Filter out any empty strings
    const filteredStoryContent = storyContent.filter(
      (text): text is string => text.length > 0
    );

    // Log the entire content
    console.log("Story Content:", filteredStoryContent.join("\n"));

    // STORY BOX CONFIGURATION
    const storyConfig: StoryBoxConfig = {
      texts: filteredStoryContent,
      style: {
        fontSize: "40px",
        backgroundColor: "rgb(199, 147, 99)",
        textColor: "rgb(24, 18, 12)",
        padding: "2rem",
        borderRadius: "2rem",
        fontFamily:
          "Copperplate, Papyrus, Playbill, Luminari, Garamond, Georgia, serif",
      },
      revealSpeed: 30,
      onComplete: () => {
        console.log("Story completed!");
      },
    };

    this.storyBox = new StoryBox(this, storyConfig);
    this.storyBox.create();
  }

  update(time: number, delta: number): void {
    // Update each character in the scene
    this.characters.forEach((character) => {
      character.update(delta);
    });

    // Ensure delta is updated from the game loop
    delta = this.game.loop.delta;
    this.debugGraphics.clear();

    // Update desktop controls
    this.desktopControls.handleInput(delta); // Move the character based on inputs
    this.desktopControls.update(delta); // Handle camera movement and updates

    // Update camera controls
    // if (this.controls) {
    //   this.controls.update(delta);
    // }

    // Update the grid, if present
    if (this.grid) {
      this.grid.updateGrid();
    }

    // Update the story box, if present
    this.storyBox?.update();

    let activeScenePlaying = this.actionManager.isActionPlaying();
    // console.log("Active Scene Playing:", activeScenePlaying);

    // Ensure that we have a selected character
    if (this.selectedCharacter) {
      // Visualize the occupied grids for the selected character

      visualizeOccupiedGrids(
        this.debugGraphics,
        this.selectedCharacter.getOccupiedGrids(),
        16,
        0x00ff00
      ); // Green for selected character

      // Handle input and character movement if no scene action is active
      if (!activeScenePlaying) {
        this.desktopControls.handleInput(delta);
      }

      // The character class handles movement and state updates internally.
      // No need to call an update function here.
      if (this.selectedCharacter.getIsActing()) {
        console.log("Character is currently acting.");
      }
    } else {
      // Handle case where no character is selected
      console.log("No character selected.");
      this.debugGraphics.clear();
    }
  } //  // End of update method

  // Use the transition function with config
  triggerSceneChange() {
    const config: TransitionConfig = {
      targetScene: "NewScene",
      duration: 1500,
      fadeColor: 0xff0000,
      callback: () => console.log("Scene transition completed!"),
    };

    handleTransition(this, config);
  }

  // Update camera bounds when screen moves
  updateCameraBounds(x: number, y: number, width: number, height: number) {
    this.cameras.main.setBounds(x, y, width, height);
    if (this.grid) {
      this.grid.updateGrid();
    }
  }

  // Destroy the story box when the scene shuts down
  shutdown() {
    this.storyBox?.destroy();
    this.storyBox = null;
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
