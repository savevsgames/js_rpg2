import { Character, CharacterState } from "../character";
import Phaser from "phaser";
import utils from "../utils/utils";
import { CollisionChecker } from "./CollisionChecker";

export class DesktopControls {
  private scene: Phaser.Scene;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private controls: Phaser.Cameras.Controls.SmoothedKeyControl | undefined;
  private directionInput: any; // Assuming you have a `DirectionInput` class
  private selectedCharacter: Character | null = null; // Default null, can be selected later
  private collisionChecker: CollisionChecker; // You might want to type this as your `CollisionChecker`

  constructor(
    scene: Phaser.Scene,
    directionInput: any,
    collisionChecker: CollisionChecker
  ) {
    this.scene = scene;
    this.directionInput = directionInput;
    this.collisionChecker = collisionChecker;
  }

  setupInputs(
    characters: Character[],
    grid: any,
    cameraBounds: { width: number; height: number },
    onCharacterSelected: (character: Character | null) => void
  ) {
    // Setup keyboard and mouse inputs
    this.setupKeyboardInputs(grid);
    this.setupMouseInputs(characters, onCharacterSelected, cameraBounds);
  }

  private setupKeyboardInputs(grid: any) {
    // Set up arrow keys and WASD
    this.cursors = this.scene.input.keyboard!.createCursorKeys();
    const controlConfig = {
      camera: this.scene.cameras.main,
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

    // Toggle grid
    this.scene.input.keyboard?.on("keydown-G", () => {
      grid?.toggle();
    });

    // Melee attack with "M" only if a character is selected
    this.scene.input.keyboard?.on("keydown-M", () => {
      if (this.selectedCharacter) {
        console.log("Melee attack!");
        this.selectedCharacter.attack();
      } else {
        console.log("No character selected for attack.");
      }
    });
  }

  private setupMouseInputs(
    characters: Character[],
    onCharacterSelected: (character: Character | null) => void,
    cameraBounds: { width: number; height: number }
  ) {
    // Select character on pointer down
    this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.handlePointerDown(
        pointer,
        this.scene.cameras.main,
        characters,
        onCharacterSelected
      );
    });

    // Zoom controls with the mouse wheel
    this.scene.input.on(
      "wheel",
      (
        pointer: Phaser.Input.Pointer,
        gameObjects: any,
        deltaX: number,
        deltaY: number,
        deltaZ: number
      ) => {
        this.handleZoom(pointer, deltaY, cameraBounds);
      }
    );

    // Pan controls with middle mouse button
    this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.middleButtonDown()) {
        this.isDragging = true;
        this.dragStartX = pointer.x;
        this.dragStartY = pointer.y;
      }
    });

    this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      if (pointer.middleButtonReleased()) {
        this.isDragging = false;
      }
    });

    this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging) {
        this.handlePan(pointer, cameraBounds);
        this.dragStartX = pointer.x;
        this.dragStartY = pointer.y;
      }
    });
  }

  private handlePointerDown(
    pointer: Phaser.Input.Pointer,
    camera: Phaser.Cameras.Scene2D.Camera,
    characters: Character[],
    onCharacterSelected: (character: Character | null) => void
  ) {
    const worldPoint = pointer.positionToCamera(camera) as Phaser.Math.Vector2;

    const clickedCharacter = characters.find((character) => {
      const bounds = character.getBounds();
      return bounds.contains(worldPoint.x, worldPoint.y);
    });

    if (clickedCharacter) {
      onCharacterSelected(clickedCharacter);
      this.selectedCharacter = clickedCharacter;

      // Make sure the newly selected character's grids are updated
      this.selectedCharacter.updateOccupiedGrids();

      console.log("Character selected:", this.selectedCharacter.texture.key);

      // Check if collision checker is properly set up
      if (!this.collisionChecker) {
        console.error("CollisionChecker is not initialized.");
      } else {
        // Debugging: check if the selected character has valid target grids
        if (
          !this.selectedCharacter.targetGrids ||
          this.selectedCharacter.targetGrids.length === 0
        ) {
          console.warn(
            "Selected character has no target grids or target grids are invalid."
          );
        }
      }
    } else {
      // If no character is clicked, clear selection
      onCharacterSelected(null);
      this.selectedCharacter = null;
      console.log("No character selected.");
    }
  }

  private handleZoom(
    pointer: Phaser.Input.Pointer,
    deltaY: number,
    cameraBounds: { width: number; height: number }
  ) {
    const zoomFactor = 0.0005;
    const newZoom = Phaser.Math.Clamp(
      this.scene.cameras.main.zoom - deltaY * zoomFactor,
      0.5,
      1
    );

    const worldPoint = this.scene.cameras.main.getWorldPoint(
      pointer.x,
      pointer.y
    );
    const zoomX =
      (worldPoint.x - this.scene.cameras.main.scrollX) /
      this.scene.cameras.main.zoom;
    const zoomY =
      (worldPoint.y - this.scene.cameras.main.scrollY) /
      this.scene.cameras.main.zoom;

    this.scene.cameras.main.setZoom(newZoom);
    this.scene.cameras.main.scrollX = worldPoint.x - zoomX * newZoom;
    this.scene.cameras.main.scrollY = worldPoint.y - zoomY * newZoom;

    const maxScrollX =
      cameraBounds.width - this.scene.cameras.main.width / newZoom;
    const maxScrollY =
      cameraBounds.height - this.scene.cameras.main.height / newZoom;

    this.scene.cameras.main.scrollX = Phaser.Math.Clamp(
      this.scene.cameras.main.scrollX,
      0,
      maxScrollX
    );
    this.scene.cameras.main.scrollY = Phaser.Math.Clamp(
      this.scene.cameras.main.scrollY,
      0,
      maxScrollY
    );
  }

  private handlePan(
    pointer: Phaser.Input.Pointer,
    cameraBounds: { width: number; height: number }
  ) {
    const dragX = pointer.x - this.dragStartX;
    const dragY = pointer.y - this.dragStartY;

    this.scene.cameras.main.scrollX -= dragX;
    this.scene.cameras.main.scrollY -= dragY;

    const maxScrollX =
      cameraBounds.width -
      this.scene.cameras.main.width / this.scene.cameras.main.zoom;
    const maxScrollY =
      cameraBounds.height -
      this.scene.cameras.main.height / this.scene.cameras.main.zoom;

    this.scene.cameras.main.scrollX = Phaser.Math.Clamp(
      this.scene.cameras.main.scrollX,
      0,
      maxScrollX
    );
    this.scene.cameras.main.scrollY = Phaser.Math.Clamp(
      this.scene.cameras.main.scrollY,
      0,
      maxScrollY
    );
  }

  // Move the character based on input direction
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

        if (this.collisionChecker && this.selectedCharacter) {
          const canMove =
            this.collisionChecker.isPositionFree(nextOccupiedGrids);
          console.log("Can move: ", canMove);

          if (canMove) {
            // Set the selected character's target grid for movement
            this.selectedCharacter.setTargetGrids(nextOccupiedGrids);
            console.log(
              "Selected Character Target Grids: ",
              this.selectedCharacter.targetGrids
            );
            this.selectedCharacter.setIsActing(true);
          } else {
            console.log("Movement blocked.");
            this.selectedCharacter.stopMoving();
          }
        } else {
          console.warn(
            "CollisionChecker or selectedCharacter is not initialized"
          );
        }
      }
    }
  }

  update(delta: number) {
    if (this.controls) {
      this.controls.update(delta);
    }
  }
}
