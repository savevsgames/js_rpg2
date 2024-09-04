import Phaser from "phaser";
import utils, { withGrid } from "./utils/utils"; // Keep existing utility for grid snapping
import Grid from "./utils/grid"; // Import Grid class
import { withOutGrid_RndDown, withOutGrid_RndUp } from "./utils/utils"; // Import the utility functions

export enum CharacterState {
  IDLE,
  WALKING,
  ATTACKING,
}

export class Character extends Phaser.Physics.Arcade.Sprite {
  private currentState: CharacterState = CharacterState.IDLE;
  private stateData: any = {};
  public occupiedGrids: { x: number; y: number }[] = [];
  public targetGrids: { x: number; y: number }[] = [];
  private grid: Grid;
  private isActing: boolean = false; // Tracks if the character is acting
  private speed: number = 10; // Movement speed in pixels per second
  private movingProgressRemaining: number; // Track how much movement is left

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    grid: Grid // Inject Grid dependency
  ) {
    super(scene, withGrid(x), withGrid(y), texture); // Use withGrid() to snap to grid

    this.grid = grid; // Assign the Grid instance to the player
    this.isActing = false;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 0.5);
    this.updateOccupiedGrids();
    this.movingProgressRemaining;

    this.initializeAnimations();
    this.setupEventListeners();
  }

  // Initialize animations for idle, walk, and attack states
  private initializeAnimations(): void {
    if (!this.scene.anims.exists("idle")) {
      this.scene.anims.create({
        key: "idle",
        frames: this.scene.anims.generateFrameNumbers("Warrior_Blue", {
          frames: [0, 1],
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.scene.anims.exists("walk")) {
      this.scene.anims.create({
        key: "walk",
        frames: this.scene.anims.generateFrameNumbers("Warrior_Blue", {
          frames: [1, 7, 6, 7],
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.scene.anims.exists("attack")) {
      this.scene.anims.create({
        key: "attack",
        frames: this.scene.anims.generateFrameNumbers("Warrior_Blue", {
          frames: [12, 13, 14, 15, 16, 17],
        }),
        frameRate: 10,
        repeat: 0,
      });
    }
  }

  // Setup event listeners for animations
  private setupEventListeners(): void {
    this.on("animationcomplete", (animation: Phaser.Animations.Animation) => {
      this.onAnimationComplete(animation);
    });
  }

  // Set player state and update animation accordingly
  setCharacterState(newState: CharacterState, data: any = {}): void {
    this.currentState = newState;
    this.stateData = data;
    this.updateAnimation();
  }

  // Get the current state of the character
  getCharacterState(): CharacterState {
    return this.currentState;
  }

  // Update animation based on current state
  private updateAnimation(): void {
    switch (this.currentState) {
      case CharacterState.IDLE:
        this.play("idle", true);
        break;
      case CharacterState.WALKING:
        this.play("walk", true);
        break;
      case CharacterState.ATTACKING:
        this.play("attack", true);
        break;
    }
  }

  // Getters and setters for external control
  public getIsActing(): boolean {
    return this.isActing;
  }

  public setIsActing(value: boolean): void {
    this.isActing = value;
  }

  updateOccupiedGrids(): void {
    // reset occupied grids
    this.occupiedGrids = [];
    const grids = [];

    const halfWidth = (this.width * this.scaleX) / 2;
    const halfHeight = (this.height * this.scaleY) / 2;

    // Calculate the top-left corner based on the character's center position minus half its size
    const topLeftGridX = withOutGrid_RndDown(this.x - halfWidth);
    const topLeftGridY = withOutGrid_RndDown(this.y - halfHeight);

    // Calculate the bottom-right corner to know the area the character covers
    const bottomRightGridX = withOutGrid_RndUp(this.x + halfWidth);
    const bottomRightGridY = withOutGrid_RndUp(this.y + halfHeight);

    // Loop through and map all the grids the character occupies
    for (let row = topLeftGridY; row <= bottomRightGridY; row++) {
      for (let col = topLeftGridX; col <= bottomRightGridX; col++) {
        grids.push({ x: col, y: row });
      }
    }

    // Store the occupied grids
    this.occupiedGrids = grids;

    // For debugging purposes, log the occupied grids
    // console.log("Occupied Grids Updated:", this.occupiedGrids);
  }

  // Getter for occupied grids
  getOccupiedGrids(): { x: number; y: number }[] {
    this.updateOccupiedGrids(); // Ensure occupied grids are updated before returning
    return this.occupiedGrids;
  }

  // Setter and getter for target grids
  public setTargetGrids(targetGrids: { x: number; y: number }[]): void {
    this.targetGrids = targetGrids;
  }

  public getTargetGrids(): { x: number; y: number }[] {
    return this.targetGrids;
  }

  update(delta: number): void {
    // If moving progress is left, continue moving
    // console.log("Moving progress remaining:", this.movingProgressRemaining);
    if (this.movingProgressRemaining > 0) {
      this.updatePosition(delta);
    } else {
      // If no movement progress left, set to idle
      this.setCharacterState(CharacterState.IDLE);
    }
  }

  // Move the character to target grids
  moveToGrid(targetGrids: { x: number; y: number }[], delta: number) {
    if (this.isActing) return; // If already acting, don't trigger another movement
    this.setIsActing(true); // Mark character as acting
    // console.log("Moving to grid:", targetGrids);

    // Calculate the target position based on the center of the target grids
    // This will return 4,4 for a character that occupies 8x8 grid space
    const singleGidInCenterOfTargetGrids =
      this.calculateCenterPosition(targetGrids);
    // console.log(
    //   "Choose a single grid in the center of the target grids :",
    //   singleGidInCenterOfTargetGrids
    // );
    // top left grid in target grids
    const topLeftGrid = targetGrids[0];
    // top left x and y
    const topLeftX = withGrid(topLeftGrid.x);
    const topLeftY = withGrid(topLeftGrid.y);

    // calculate size of singleGridInCenterOfTargetGrids in pixels
    const x_offset = withGrid(singleGidInCenterOfTargetGrids.x);
    const y_offset = withGrid(singleGidInCenterOfTargetGrids.y);

    // use x and y offsets to add to top left x and y to get the center of the target grids
    const targetX = topLeftX + x_offset;
    const targetY = topLeftY + y_offset;

    // Debug log to check target calculations
    // console.log(
    //   `Moving character from (${this.x}, ${this.y}) to (${targetX}, ${targetY})`
    // );

    // Now, move the character to the calculated position
    this.moveToPosition(targetX, targetY, delta);
  }

  // Update the character's position as they move towards the target
  private updatePosition(delta: number): void {
    const moveDistance = (this.speed * delta) / 1000; // Calculate the distance to move this frame

    // Get target position once, to avoid duplicate calculations
    const { x: targetX, y: targetY } = this.getTargetPosition();
    // console.log("Target position:", targetX, targetY);

    this.moveToPosition(targetX, targetY, delta); // Move the character

    // After moving, check if the character has reached the target
    if (this.hasReachedTarget()) {
      // Snap to the final position
      this.setPosition(targetX, targetY);
      // console.log(`Character has reached the target: (${targetX}, ${targetY})`);

      this.updateOccupiedGrids(); // Update grids
      this.setCharacterState(CharacterState.IDLE); // Set to idle after movement
      this.setIsActing(false); // Movement complete
    }
  }

  // Trigger movement towards a target position
  moveToPosition(targetX: number, targetY: number, delta: number) {
    // Set the movement progress to the full distance to the target
    this.movingProgressRemaining = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      targetX,
      targetY
    );

    // console.log(
    //   `Starting movement towards (${targetX}, ${targetY}) with progress: ${this.movingProgressRemaining}`
    // );
    // Linear interpolation to move the character towards the target
    const moveDistance = this.speed * (delta / 1000);
    this.x = Phaser.Math.Linear(this.x, targetX, moveDistance);
    this.y = Phaser.Math.Linear(this.y, targetY, moveDistance);
    this.setCharacterState(CharacterState.WALKING); // Set to walking while moving
    this.setIsActing(true); // Mark the character as acting
  }

  // Getter for the target position based on the target grids
  private getTargetPosition(): { x: number; y: number } {
    // This function will be sent target grid coordinates
    // We need to turn those into world coordinates, then account for the character's size by creating a grid offset using calculateCenterPosition
    // ex. For a character that is 8x8 grid size, the center of the grid is 4,4
    // We will convert this 4,4 into world coordinates and use it as the OFFSET to add to the target grid coordinates
    // and then return world coordinates based on that offset + grid coordinates

    // This will return the center of the grid offset neeeded to add to the top left grid
    const { x: offsetX, y: offsetY } = this.calculateCenterPosition(
      this.targetGrids
    );
    // console.log("Target offset:", offsetX, offsetY);

    // top left grid in target grids
    const topLeftGrid = this.targetGrids[0];
    // top left x and y
    const topLeftX = withGrid(topLeftGrid.x);
    const topLeftY = withGrid(topLeftGrid.y);

    // calculate size of singleGridInCenterOfTargetGrids in pixels
    const x_offset = withGrid(offsetX);
    const y_offset = withGrid(offsetY);

    // use x and y offsets to add to top left x and y to get the center of the target grids
    const targetX = topLeftX + x_offset;
    const targetY = topLeftY + y_offset;

    return { x: targetX, y: targetY };
  }

  // Control for player inputs (like arrow keys)
  handleInput(direction: string, delta: number): void {
    if (this.isActing || this.currentState !== CharacterState.IDLE) return; // Prevent movement if acting or not idle

    switch (direction) {
      case "up":
        this.moveUp(delta);
        break;
      case "down":
        this.moveDown(delta);
        break;
      case "left":
        this.moveLeft(delta);
        break;
      case "right":
        this.moveRight(delta);
        break;
    }
  }

  moveUp(delta: number): void {
    this.setCharacterState(CharacterState.WALKING, { direction: "up" });
    const nextGrid = utils.nextPosition(this.getOccupiedGrids(), "up");
    console.log(
      "Occupied Grids: ",
      this.occupiedGrids,
      "Next grid: ",
      nextGrid
    );
    this.moveToGrid(nextGrid, delta);
  }

  moveDown(delta: number): void {
    this.setCharacterState(CharacterState.WALKING, { direction: "down" });
    const nextGrid = utils.nextPosition(this.getOccupiedGrids(), "down");
    console.log(
      "Occupied Grids: ",
      this.occupiedGrids,
      "Next grid: ",
      nextGrid
    );
    this.moveToGrid(nextGrid, delta);
  }

  moveLeft(delta: number): void {
    this.setCharacterState(CharacterState.WALKING, { direction: "left" });
    const nextGrid = utils.nextPosition(this.getOccupiedGrids(), "left");
    // console.log(
    //   "Occupied Grids: ",
    //   this.occupiedGrids,
    //   "Next grid: ",
    //   nextGrid
    // );
    this.moveToGrid(nextGrid, delta);
  }

  moveRight(delta: number): void {
    this.setCharacterState(CharacterState.WALKING, { direction: "right" });
    const nextGrid = utils.nextPosition(this.getOccupiedGrids(), "right");
    // console.log(
    //   "Occupied Grids: ",
    //   this.occupiedGrids,
    //   "Next grid: ",
    //   nextGrid
    // );
    this.moveToGrid(nextGrid, delta);
  }

  stopMoving(): void {
    this.setCharacterState(CharacterState.IDLE);
    this.setIsActing(false);
  }

  attack(): void {
    this.setCharacterState(CharacterState.ATTACKING);
  }

  private onAnimationComplete(animation: Phaser.Animations.Animation): void {
    if (animation.key === "attack") {
      this.setCharacterState(CharacterState.IDLE);
    }
  }

  // Helper function to calculate the center of occupied grids and return world coordinates
  calculateCenterPosition(grids: { x: number; y: number }[]): {
    x: number;
    y: number;
  } {
    if (!grids || grids.length === 0) {
      console.error("Grids array is empty or undefined.");
      return { x: 0, y: 0 };
    }

    const firstGrid = grids[0];
    const topLeftX = withOutGrid_RndDown(firstGrid.x);
    const topLeftY = withOutGrid_RndDown(firstGrid.y);

    // Calculate the center by adding half the character's width and height
    const centerX = topLeftX + (this.width * this.scaleX) / 2;
    const centerY = topLeftY + (this.height * this.scaleY) / 2;

    return {
      x: withOutGrid_RndDown(centerX),
      y: withOutGrid_RndDown(centerY),
    };
  }
  // Check if the character has reached the target position
  hasReachedTarget(): boolean {
    return this.movingProgressRemaining <= 1; // or any small threshold
  }
}
