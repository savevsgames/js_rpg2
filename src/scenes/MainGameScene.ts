// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class MainGameScene extends Phaser.Scene {
  // Declare the controls property
  private controls!: Phaser.Cameras.Controls.SmoothedKeyControl;

  constructor() {
    super("MainGameScene");

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  preload(): void {
    this.load.pack("preload-asset-pack", "assets/preload-asset-pack.json");
  }

  editorCreate(): void {
    // grass_town_1_16
    const grass_town_1_16 = this.add.tilemap("grass_town_1_16");
    grass_town_1_16.addTilesetImage("Tilemap_Flat", "Tilemap_Flat");
    grass_town_1_16.addTilesetImage("Tilemap_Elevation", "Tilemap_Elevation");
    grass_town_1_16.addTilesetImage("Shadows", "Shadows");
    grass_town_1_16.addTilesetImage("Bridge_All", "Bridge_All");
    grass_town_1_16.addTilesetImage("Water", "Water");
    grass_town_1_16.addTilesetImage("Rocks_02", "Rocks_02");
    grass_town_1_16.addTilesetImage("Rocks_01", "Rocks_01");
    grass_town_1_16.addTilesetImage("Foam", "Foam");
    grass_town_1_16.addTilesetImage("Tree", "Tree");
    grass_town_1_16.addTilesetImage("house 1", "house 1");
    grass_town_1_16.addTilesetImage("house 2", "house 2");
    grass_town_1_16.addTilesetImage("house 8", "house 8");
    grass_town_1_16.addTilesetImage("town hall", "town hall");
    grass_town_1_16.addTilesetImage("Trees 2", "Trees");

    // grass_town
    const grass_town = this.add.tilemap("grass_town_1_16");
    grass_town.addTilesetImage("Tilemap_Flat", "Tilemap_Flat");
    grass_town.addTilesetImage("Tilemap_Elevation", "Tilemap_Elevation");
    grass_town.addTilesetImage("Shadows", "Shadows");
    grass_town.addTilesetImage("Bridge_All", "Bridge_All");
    grass_town.addTilesetImage("Water", "Water");
    grass_town.addTilesetImage("Rocks_02", "Rocks_02");
    grass_town.addTilesetImage("Rocks_01", "Rocks_01");
    grass_town.addTilesetImage("Foam", "Foam");
    grass_town.addTilesetImage("Tree", "Tree");
    grass_town.addTilesetImage("house 1", "house 1");
    grass_town.addTilesetImage("house 2", "house 2");
    grass_town.addTilesetImage("house 8", "house 8");
    grass_town.addTilesetImage("town hall", "town hall");
    grass_town.addTilesetImage("Trees 2", "Trees");

    // grass_town_1
    const grass_town_1 = this.add.tilemap("grass_town_1_16");
    grass_town_1.addTilesetImage("Tilemap_Flat", "Tilemap_Flat");
    grass_town_1.addTilesetImage("Tilemap_Elevation", "Tilemap_Elevation");
    grass_town_1.addTilesetImage("Shadows", "Shadows");
    grass_town_1.addTilesetImage("Bridge_All", "Bridge_All");
    grass_town_1.addTilesetImage("Water", "Water");
    grass_town_1.addTilesetImage("Rocks_02", "Rocks_02");
    grass_town_1.addTilesetImage("Rocks_01", "Rocks_01");
    grass_town_1.addTilesetImage("Foam", "Foam");
    grass_town_1.addTilesetImage("Tree", "Tree");
    grass_town_1.addTilesetImage("house 1", "house 1");
    grass_town_1.addTilesetImage("house 2", "house 2");
    grass_town_1.addTilesetImage("house 8", "house 8");
    grass_town_1.addTilesetImage("town hall", "town hall");
    grass_town_1.addTilesetImage("Trees 2", "Trees");

    // grass_town_2
    const grass_town_2 = this.add.tilemap("grass_town_1_16");
    grass_town_2.addTilesetImage("Tilemap_Flat", "Tilemap_Flat");
    grass_town_2.addTilesetImage("Tilemap_Elevation", "Tilemap_Elevation");
    grass_town_2.addTilesetImage("Shadows", "Shadows");
    grass_town_2.addTilesetImage("Bridge_All", "Bridge_All");
    grass_town_2.addTilesetImage("Water", "Water");
    grass_town_2.addTilesetImage("Rocks_02", "Rocks_02");
    grass_town_2.addTilesetImage("Rocks_01", "Rocks_01");
    grass_town_2.addTilesetImage("Foam", "Foam");
    grass_town_2.addTilesetImage("Tree", "Tree");
    grass_town_2.addTilesetImage("house 1", "house 1");
    grass_town_2.addTilesetImage("house 2", "house 2");
    grass_town_2.addTilesetImage("house 8", "house 8");
    grass_town_2.addTilesetImage("town hall", "town hall");
    grass_town_2.addTilesetImage("Trees 2", "Trees");

    // grass_town_3
    const grass_town_3 = this.add.tilemap("grass_town_1_16");
    grass_town_3.addTilesetImage("Tilemap_Flat", "Tilemap_Flat");
    grass_town_3.addTilesetImage("Tilemap_Elevation", "Tilemap_Elevation");
    grass_town_3.addTilesetImage("Shadows", "Shadows");
    grass_town_3.addTilesetImage("Bridge_All", "Bridge_All");
    grass_town_3.addTilesetImage("Water", "Water");
    grass_town_3.addTilesetImage("Rocks_02", "Rocks_02");
    grass_town_3.addTilesetImage("Rocks_01", "Rocks_01");
    grass_town_3.addTilesetImage("Foam", "Foam");
    grass_town_3.addTilesetImage("Tree", "Tree");
    grass_town_3.addTilesetImage("house 1", "house 1");
    grass_town_3.addTilesetImage("house 2", "house 2");
    grass_town_3.addTilesetImage("house 8", "house 8");
    grass_town_3.addTilesetImage("town hall", "town hall");
    grass_town_3.addTilesetImage("Trees 2", "Trees");

    // grass_1
    grass_town_1_16.createLayer("Grass", ["Tilemap_Flat"], 0, 0);

    // water_1
    grass_town.createLayer("Water", ["Tilemap_Flat", "Water"], 0, 0);

    // rocks_1
    const rocks_1 = grass_town_1.createLayer(
      "Rocks",
      [
        "Tilemap_Elevation",
        "Tilemap_Flat",
        "Bridge_All",
        "Rocks_01",
        "Rocks_02",
      ],
      0,
      0
    )!;
    rocks_1.setInteractive(
      new Phaser.Geom.Polygon(
        "0.797408475657424 156.09978128521334 153.3738001415179 153.88852923208492 156.3221362123558 126.6164205768345 285.3118393115132 122.93100048828714 288.99725940006056 95.65889183303672 398.8227780387718 91.2363877267799 404.71945018044755 61.753027018401056 510.8595487306114 61.753027018401056 521.178724978544 51.43385077046846 543.2912455098281 47.011346664211636 546.239581580666 12.368397831866499 570.5633541650785 13.105481849575972 577.1971103244638 1.3121375662244354 750.4118544861894 3.5233896193528484 754.0972745747368 28.58424622147486 876.3296268040887 31.590262254214547 880.7438910147168 59.547268921526125 960.2006468060234 62.49011172861155 1036.7145597902445 65.43295453569698 1047.0145096150436 90.44711839592313 1129.4141082134356 99.27564681717942 1136.7712152311492 118.40412506323472 1280.9705127783352 125.76123208094829 1279.8144338964146 -3.3226159573590612 -0.2932203623749966 -5.98396243190956"
      ),
      Phaser.Geom.Polygon.Contains
    );

    // buildings_1
    const buildings_1 = grass_town_2.createLayer(
      "Buildings",
      ["Tree", "town hall", "house 8", "house 1"],
      0,
      0
    )!;

    // roofs_1
    grass_town_3.createLayer(
      "Roofs",
      ["Tree", "town hall", "house 8", "house 1"],
      0,
      0
    );

    // rectangle_1
    const rectangle_1 = this.add.rectangle(640, 720, 128, 128);
    rectangle_1.scaleX = 10.3;
    rectangle_1.scaleY = 0.4;
    rectangle_1.isFilled = true;
    rectangle_1.fillColor = 3024410;

    // text_1
    const text_1 = this.add.text(928, 560, "", {});
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

    this.rocks_1 = rocks_1;
    this.buildings_1 = buildings_1;
    this.grass_town_1_16 = grass_town_1_16;
    this.grass_town = grass_town;
    this.grass_town_1 = grass_town_1;
    this.grass_town_2 = grass_town_2;
    this.grass_town_3 = grass_town_3;

    this.events.emit("scene-awake");
  }

  private rocks_1!: Phaser.Tilemaps.TilemapLayer;
  private buildings_1!: Phaser.Tilemaps.TilemapLayer;
  private grass_town_1_16!: Phaser.Tilemaps.Tilemap;
  private grass_town!: Phaser.Tilemaps.Tilemap;
  private grass_town_1!: Phaser.Tilemaps.Tilemap;
  private grass_town_2!: Phaser.Tilemaps.Tilemap;
  private grass_town_3!: Phaser.Tilemaps.Tilemap;

  /* START-USER-CODE */

  // Write your code here

  create() {
    this.editorCreate();

    this.cameras.main.setBounds(0, 0, 1920, 1080);
    // Using chaining - qualify that the keyboard input has been initialized first before assinging it to "cursors"
    if (!this.input.keyboard) {
      console.error("Keyboard input system not initialized.");
      return;
    }
    //  Camera controls
    const cursors = this.input.keyboard.createCursorKeys();

    const controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      acceleration: 0.06,
      drag: 0.0005,
      maxSpeed: 1.0,
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(
      controlConfig
    );
  }

  /* END-USER-CODE */
  update(time: number, delta: number) {
    this.controls.update(delta);
  }

  /* END OF COMPILED CODE */
}
// You can write more code here
