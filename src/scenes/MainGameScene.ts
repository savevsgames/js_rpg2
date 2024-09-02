// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
/* START-USER-IMPORTS */
import { Player, PlayerState } from "../game_scripts/player";
import Grid from "../game_scripts/utils/grid";
import utils from "../game_scripts/utils/utils";
import StoryBox from "../game_scripts/StoryBox";
import { StoryBoxConfig } from "../game_scripts/interfaces/StoryBoxConfig";
import { DirectionInput } from "../game_scripts/utils/DirectionInput";
import { CollisionChecker } from "../game_scripts/utils/CollisionChecker";
import * as inkjs from "inkjs";
/* END-USER-IMPORTS */

export default class MainGameScene extends Phaser.Scene {
  constructor() {
    super("MainGameScene");

    /* START-USER-CTR-CODE */
    this.grid = null;
    this.cellSize = 16;

    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  preload(): void {
    this.load.pack("preload-asset-pack", "assets/preload-asset-pack.json");

    // // Load the Ink story JSON
    this.load.pack("chapter_1", "assets/chapter_1.ink.json");
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

    // text_1
    const text_1 = this.add.text(3453, 1984, "", {});
    text_1.text = "SHADOWTIDE\nISLAND";
    text_1.setStyle({
      align: "right",
      color: "#ceba96ff",
      fontSize: "54px",
      fontStyle: "bold",
      stroke: "#000000ff",
      strokeThickness: 5,
      "shadow.offsetX": 13,
      "shadow.offsetY": 8,
      "shadow.blur": 5,
      "shadow.fill": true,
    });

    // tile_Layer
    const tile_Layer = test_castle.createLayer(
      "Tile Layer 1",
      ["ShadowtideKeepEntranceMap_test_1"],
      0,
      0
    )!;

    this.tile_Layer = tile_Layer;
    this.test_castle = test_castle;

    this.events.emit("scene-awake");
  }

  private tile_Layer!: Phaser.Tilemaps.TilemapLayer;
  private test_castle!: Phaser.Tilemaps.Tilemap;

  /* START-USER-CODE */
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private grid: Grid | null;
  private cellSize: number;
  private storyBox: StoryBox | null = null;
  private directionInput = new DirectionInput();
  private collisionChecker!: CollisionChecker;
  private debugGraphics!: Phaser.GameObjects.Graphics;
  private jsonData: any;

  create() {
    this.editorCreate();

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
    this.player = new Player(this, 5, 5, "Warrior_Blue", 128, this.grid);
    // this.player.scale = 0.5;

    // Set up DirectionInput for WASD
    this.directionInput.init();

    // Enable collision for tiles with the 'collides' property
    this.test_castle.setCollisionByProperty({ collides: true });

    // CAMERA SETTINGS
    this.cameras.main.setBounds(0, 0, 3840, 2160);
    this.cameras.main.startFollow(this.player);

    // INPUT HANDLING
    this.input.keyboard?.on("keydown-G", () => {
      this.grid?.toggle();
    });

    this.input.on("pointerdown", () => this.player.attack());

    let cache = this.cache.json;
    var jsonData = cache.get("chapter_1");
    console.log("Loading JSON:");
    const inkStoryData = jsonData;
    if (inkStoryData) {
      console.log("Data successfully moved from cache.");
    }
    const inkStory = new inkjs.Story(inkStoryData);

    //-------------------------------------------
    // STORY BOX CONFIGURATION
    // const storyConfig: StoryBoxConfig = {
    //   texts: [
    //     "Welcome to Shadowtide Island!",
    //     "Your adventure begins here...",
    //     "Explore the mysteries that await you.",
    //   ],
    //   style: {
    //     fontSize: "40px",
    //     backgroundColor: "rgba(0, 0, 0, 0.8)",
    //     textColor: "yellow",
    //     padding: "30px",
    //     borderRadius: "15px",
    //     fontFamily: "Georgia, serif",
    //   },
    //   revealSpeed: 50,
    //   onComplete: () => {
    //     console.log("Story completed!");
    //     // Add any logic you want to run after the story is complete
    //   },
    // };
    // this.storyBox = new StoryBox(this, storyConfig);
    // this.storyBox.create();

    // STORY BOX CONFIGURATION using Ink content

    this.displayInkContent(inkStory);

    // Initialize Collision Checker
    this.collisionChecker = new CollisionChecker(
      this,
      this.tile_Layer,
      this.grid
    );
    this.player.updateOccupiedGrids();
    this.visualizeOccupiedGrids(this.player.getOccupiedGrids(), 0x00ff00); // Current position in green
    console.log("Occupied Grids:", this.player.getOccupiedGrids());
  } // End of create method

  /**
   *
   * @param inkStory
   *
   */
  // Add the displayInkContent method inside your MainGameScene class
  displayInkContent(inkStory: inkjs.Story): void {
    let storyContent: (string | null)[] = [];

    // Continue the story until there's no more content or a choice is reached
    while (inkStory.canContinue) {
      storyContent.push(inkStory.Continue());
    }

    // Handle choices if any
    if (inkStory.currentChoices.length > 0) {
      inkStory.currentChoices.forEach((choice, index) => {
        storyContent.push(`${index + 1}: ${choice.text}`);
      });
    }

    // Filter out any null values
    const filteredStoryContent = storyContent.filter(
      (text): text is string => text !== null
    );

    console.log("Story Content:", filteredStoryContent);

    // STORY BOX CONFIGURATION
    const storyConfig: StoryBoxConfig = {
      texts: filteredStoryContent, // Now this is guaranteed to be a string[]
      style: {
        fontSize: "40px",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        textColor: "yellow",
        padding: "30px",
        borderRadius: "15px",
        fontFamily: "Georgia, serif",
      },
      revealSpeed: 50,
      onComplete: () => {
        console.log("Story completed!");
      },
    };

    this.storyBox = new StoryBox(this, storyConfig);
    this.storyBox.create();
  }

  update(time: number, delta: number): void {
    // Update story box if present
    this.storyBox?.update();

    // Get the current direction from DirectionInput
    const direction = this.directionInput.direction;

    if (direction && this.player.getCurrentState() === PlayerState.IDLE) {
      // Start movement based on the direction input
      switch (direction) {
        case "up":
          this.player.moveUp();
          break;
        case "down":
          this.player.moveDown();
          break;
        case "left":
          this.player.moveLeft();
          break;
        case "right":
          this.player.moveRight();
          break;
      }

      // Get the player's current occupied grids
      const playerLocation = this.player.getOccupiedGrids();
      if (this.grid) {
        // Calculate the next position based on direction
        const nextOccupiedGrids = utils.nextPosition(playerLocation, direction);
        // console.log("Next Grid Position before move:", nextOccupiedGrids);

        // Check if any of the next occupied grids are blocked
        const canMove = this.collisionChecker.isPositionFree(nextOccupiedGrids);
        console.log("Can Move:", canMove);

        // Visualize current and next positions for debugging
        this.debugGraphics.clear();
        this.visualizeOccupiedGrids(this.player.getOccupiedGrids(), 0x00ff00); // Current position in green
        this.visualizeOccupiedGrids(nextOccupiedGrids, 0xff0000); // Next position in red

        if (canMove) {
          // Calculate the central position of the next occupied grids
          const centerGrid = this.calculateCenterPosition(nextOccupiedGrids);
          // console.log("Center Grid:", centerGrid);

          // Convert the grid coordinates to world coordinates in grid size
          const worldX = centerGrid.x;
          const worldY = centerGrid.y;

          // Set the player's position to this central position
          this.player.setPosition(worldX, worldY);
          // console.log("Player moved to:", utils.asGridCoord(worldX, worldY));

          // Update the player's occupied grids after moving
          this.player.updateOccupiedGrids();
          this.player.setPlayerState(PlayerState.IDLE); // Set player state to IDLE
        } else {
          console.log("Movement blocked.");
          this.player.stopMoving();
        }
      }
    }
  }

  // Helper function to calculate the center of occupied grids and return world coordinates
  calculateCenterPosition(grids: { x: number; y: number }[]): {
    x: number;
    y: number;
  } {
    if (grids.length === 0) {
      console.error("Grids array is empty.");
      return { x: 0, y: 0 };
    }

    // Assume grids are all in the same size, and we already know the player's grid is centered
    const firstGrid = grids[0];

    // Calculate the top-left corner of the grid in world coordinates
    const topLeftX = firstGrid.x * this.cellSize;
    const topLeftY = firstGrid.y * this.cellSize;

    // Calculate the center by adding half the player's width and height
    const centerX = topLeftX + (this.player.width * this.player.scaleX) / 2;
    const centerY = topLeftY + (this.player.height * this.player.scaleY) / 2;

    console.log(`Grid Center World Coords: (${centerX}, ${centerY})`);

    return {
      x: centerX,
      y: centerY,
    };
  }

  private visualizeOccupiedGrids(
    grids: { x: number; y: number }[],
    color: number
  ) {
    this.debugGraphics.fillStyle(color, 0.3);
    grids.forEach((grid) => {
      this.debugGraphics.fillRect(
        grid.x * this.cellSize,
        grid.y * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    });
  }

  shutdown() {
    this.storyBox?.destroy();
    this.storyBox = null;
  }
}
/* END-USER-CODE */

/* END OF COMPILED CODE */

// You can write more code here
