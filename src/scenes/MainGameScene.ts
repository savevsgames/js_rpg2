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
/* END-USER-IMPORTS */

export default class MainGameScene extends Phaser.Scene {
  constructor() {
    super("MainGameScene");

    /* START-USER-CTR-CODE */
    this.grid = null;
    this.cellSize = 16;
    this.characters;

    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  preload(): void {
    this.load.pack("preload-asset-pack", "assets/preload-asset-pack.json");
  }

  editorCreate(): void {
    // test_castle
    const test_castle = this.add.tilemap("test_castle");
    test_castle.addTilesetImage(
      "ShadowtideKeepEntranceMap_test_1",
      "ShadowtideKeepEntranceMap_test_1"
    );

    // shadowtideKeepEntranceMap_test_1
    this.add.image(1920, 1080, "ShadowtideKeepEntranceMap_test_1");

    // tile_Layer
    const tile_Layer = test_castle.createLayer(
      "Tile Layer 1",
      ["ShadowtideKeepEntranceMap_test_1"],
      0,
      0
    )!;

    // mapgrass1
    const mapgrass1 = this.add.image(1920, 1080, "mapgrass1");
    mapgrass1.scaleX = 2;
    mapgrass1.scaleY = 2;

    // fantasy_ship
    this.add.image(1920, 1080, "fantasy_ship");

    // text_1
    const text_1 = this.add.text(64, 64, "", {});
    text_1.text = "SHADOWTIDE\nISLAND";
    text_1.setStyle({
      color: "#ceba96ff",
      fontSize: "185px",
      fontStyle: "bold",
      stroke: "#000000ff",
      strokeThickness: 10,
      "shadow.offsetX": 13,
      "shadow.offsetY": 8,
      "shadow.blur": 5,
      "shadow.fill": true,
    });

    // rectangle_1
    const rectangle_1 = this.add.rectangle(528, 1296, 128, 128);
    rectangle_1.scaleX = 6.9;
    rectangle_1.scaleY = 12.1;
    rectangle_1.isFilled = true;
    rectangle_1.fillAlpha = 0.38;
    rectangle_1.isStroked = true;
    rectangle_1.strokeColor = 0;
    rectangle_1.strokeAlpha = 0.42;
    rectangle_1.lineWidth = 6.65;

    // shadowFx
    rectangle_1.postFX!.addShadow(0, 0, 0.1, 1, 0, 6, 1);

    // text_2
    const text_2 = this.add.text(144, 640, "", {});
    text_2.text =
      'Use the arrow keys to move the camera. \n\nSelect a token then:\n- move with W,A,S,D\n- melee attack with "m"\n\n- remove grid with "g"\n\nClick the story window or hit Enter to "turn the page" and make choices...\n\nKavan will not enjoy this journey at all, so I hope you can enjoy living in his shoes.';
    text_2.setStyle({
      color: "#000000ff",
      fontSize: "62px",
      fontStyle: "bold",
      maxLines: 61,
    });
    text_2.setWordWrapWidth(749);

    this.tile_Layer = tile_Layer;
    this.rectangle_1 = rectangle_1;
    this.test_castle = test_castle;

    this.events.emit("scene-awake");
  }

  private tile_Layer!: Phaser.Tilemaps.TilemapLayer;
  private rectangle_1!: Phaser.GameObjects.Rectangle;
  private test_castle!: Phaser.Tilemaps.Tilemap;

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


  create() {
    this.editorCreate();

    let delta = this.game.loop.delta;

    // Initialize debug graphics for visualizing occupied grids
    this.debugGraphics = this.add.graphics({
      lineStyle: { width: 1, color: 0xff0000, alpha: 0.8 },
      fillStyle: { color: 0xff0000, alpha: 0.3 },
    });

    // Set the world bounds
    this.physics.world.setBounds(0, 0, 3840, 2160);

    // Create the grid
    this.grid = new Grid(this, this.cellSize);

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
    this.test_castle.setCollisionByProperty({ collides: true });

    // CAMERA SETTINGS
    this.cameras.main.setBounds(0, 0, 3840, 2160);
    // this.cameras.main.startFollow(this.player);
    // Set up camera controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    const controlConfig = {
      camera: this.cameras.main,
      left: this.cursors.left,
      right: this.cursors.right,
      up: this.cursors.up,
      down: this.cursors.down,
      acceleration: 0.06,
      drag: 0.0005,
      maxSpeed: 0.5,
    };
    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(
      controlConfig
    );

    // INPUT HANDLING
    this.input.keyboard?.on("keydown-G", () => {
      this.grid?.toggle();
    });

    // Map the "M" key for melee attacks
    this.input.keyboard?.on("keydown-M", () => {
      if (this.selectedCharacter) {
        console.log("Melee attack!");
        this.selectedCharacter.attack(); // Call attack on the selected character
      }
    });

    // Add a click handler to select the player character
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.handlePointerDown(pointer);
    });

    // Add zoom controls using the mouse wheel
    this.input.on(
      "wheel",
      (
        pointer: Phaser.Input.Pointer,
        gameObjects: any,
        deltaX: number,
        deltaY: number,
        deltaZ: number
      ) => {
        // Check if an action is currently playing
        if (!this.actionManager.isActionPlaying()) {
          const zoomFactor = 0.01; // Adjust zoom sensitivity as needed
          const newZoom = Phaser.Math.Clamp(
            this.cameras.main.zoom - deltaY * zoomFactor,
            0.5,
            2
          );

          // Use the action manager to queue the zoom action
          const zoomAction = new SceneAction("zoomCamera", { zoom: newZoom });

          this.actionManager.queueAction(zoomAction);
        }
      }
    ); // End of zoom controls

    // Add pan controls with the middle mouse button
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.middleButtonDown()) {
        this.isDragging = true; // Start dragging
        this.dragStartX = pointer.x;
        this.dragStartY = pointer.y;
      }
    });

    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      if (pointer.middleButtonReleased()) {
        this.isDragging = false; // Stop dragging
      }
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging) {
        // Calculate the difference in movement
        const dragX = pointer.x - this.dragStartX;
        const dragY = pointer.y - this.dragStartY;

        // Move the camera by the inverse of the drag
        this.cameras.main.scrollX -= dragX;
        this.cameras.main.scrollY -= dragY;

        // Clamp the camera within the world bounds (set by setBounds)
        this.cameras.main.scrollX = Phaser.Math.Clamp(
          this.cameras.main.scrollX,
          0,
          3840 - this.cameras.main.width
        );
        this.cameras.main.scrollY = Phaser.Math.Clamp(
          this.cameras.main.scrollY,
          0,
          2160 - this.cameras.main.height
        );

        // Update drag start positions
        this.dragStartX = pointer.x;
        this.dragStartY = pointer.y;
      }
    });

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

    // Initialize Collision Checker
    this.collisionChecker = new CollisionChecker(
      this,
      this.tile_Layer,
      this.grid
    );
    this.character.updateOccupiedGrids();
    this.visualizeOccupiedGrids(this.character.getOccupiedGrids(), 0x00ff00); // Current position in green
    console.log("Occupied Grids:", this.character.getOccupiedGrids());

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
  // Add the displayInkContent method inside your MainGameScene class
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

    // Update camera controls
    if (this.controls) {
      this.controls.update(delta);
    }

    // Update the grid, if present
    if (this.grid) {
      this.grid.updateGrid();
    }

    // Update the story box, if present
    this.storyBox?.update();

    let activeScenePlaying = this.actionManager.isActionPlaying();
    console.log("Active Scene Playing:", activeScenePlaying);

    // Ensure that we have a selected character
    if (this.selectedCharacter) {
      // Visualize the occupied grids for the selected character

      this.visualizeOccupiedGrids(
        this.selectedCharacter.getOccupiedGrids(),
        0x00ff00
      ); // Green for selected character

      // Handle input and character movement if no scene action is active
      if (!activeScenePlaying) {
        this.handleInput(delta);
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
  }

  // Handle input for character movement
  handleInput(delta: number): void {
    // Get the current direction from DirectionInput
    const direction = this.directionInput.direction;
    if (this.selectedCharacter) {
      // Only allow movement if the selected character is idle
      if (
        direction &&
        this.selectedCharacter.getCharacterState() === CharacterState.IDLE
      ) {
        switch (direction) {
          case "up":
            this.selectedCharacter.moveUp(delta);
            break;
          case "down":
            this.selectedCharacter.moveDown(delta);
            break;
          case "left":
            this.selectedCharacter.moveLeft(delta);
            break;
          case "right":
            this.selectedCharacter.moveRight(delta);
            break;
        }

        // Calculate the next occupied grids for the character
        const characterLocation = this.selectedCharacter.getOccupiedGrids();
        let nextOccupiedGrids = utils.nextPosition(
          characterLocation,
          direction
        );

        console.log("Next Occupied Grids:", nextOccupiedGrids);

        // Check if any of the next occupied grids are blocked
        const canMove = this.collisionChecker.isPositionFree(nextOccupiedGrids);
        console.log("Can Move:", canMove);

        if (canMove) {
          // Set the selected character's target grid for movement
          this.selectedCharacter.setTargetGrids(nextOccupiedGrids);
          this.selectedCharacter.setIsActing(true);
        } else {
          console.log("Movement blocked.");
          this.selectedCharacter.stopMoving();
        }
      }
    } else {
      console.log("No character selected.");
    }
  }

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

  // Handle pointer down event
  handlePointerDown(pointer: Phaser.Input.Pointer) {
    // Get the world coordinates of the pointer click
    const worldPoint = pointer.positionToCamera(
      this.cameras.main
    ) as Phaser.Math.Vector2;

    // Check if any character was clicked
    const clickedCharacter = this.characters.find((character) => {
      const bounds = character.getBounds();
      return bounds.contains(worldPoint.x, worldPoint.y);
    });

    if (clickedCharacter) {
      this.selectCharacter(clickedCharacter);
    } else {
      this.selectCharacter(null); // Deselect character
    }
  }

  // Select a character
  selectCharacter(character: Character | null) {
    this.selectedCharacter = character;
    if (character) {
      console.log("Character selected:", character.texture.key);
    } else {
      console.log("No character selected.");
    }
  }

  // Helper function to visualize occupied grids
  visualizeOccupiedGrids(grids: { x: number; y: number }[], color: number) {
    this.debugGraphics.fillStyle(color, 0.3);

    grids.forEach((grid) => {
      // console.log("Visualizing grid:", grid); // Log each grid being visualized
      this.debugGraphics.fillRect(
        grid.x * this.cellSize, // Ensure this is the correct coordinate
        grid.y * this.cellSize, // Ensure this is the correct coordinate
        this.cellSize,
        this.cellSize
      );
    });
  }

  shutdown() {
    this.storyBox?.destroy();
    this.storyBox = null;
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
