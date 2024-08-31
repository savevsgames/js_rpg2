var e=Object.defineProperty,t=(t,s,a)=>((t,s,a)=>s in t?e(t,s,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[s]=a)(t,"symbol"!=typeof s?s+"":s,a);import{P as s}from"./phaser-CmFXOKba.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const s of e)if("childList"===s.type)for(const e of s.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();class a{constructor(e){t(this,"gameObject"),t(this,"target","GAME_OBJECT"),t(this,"targetName",""),this.gameObject=e,e.__ActionTargetComp=this}static getComponent(e){return e.__ActionTargetComp}static getTargetGameObject(e,t){const s=a.getComponent(e);if(s)switch(s.target){case"GAME_OBJECT":return e.gameObject;case"ARG_1":return t[0];case"ARG_2":return t[1];case"ARG_3":return t[2];case"ARG_4":return t[3];case"ARG_5":return t[4];case"ARG_6":return t[5];case"ARG_7":return t[6];case"ARG_8":return t[7]}return e.gameObject}}class i{constructor(e){t(this,"_scene"),t(this,"_gameObject"),t(this,"_parent"),t(this,"_children"),this._parent=e,e instanceof i?(this._scene=e.scene,this._gameObject=e.gameObject,e.add(this)):e instanceof s.GameObjects.GameObject?(this._scene=e.scene,this._gameObject=e):this._scene=e;const a=this.awake!==i.prototype.awake,o=this.start!==i.prototype.start,n=this.update!==i.prototype.update,r=this.destroy!==i.prototype.destroy;if(a&&this.scene.events.once("scene-awake",this.awake,this),o&&this.scene.events.once(s.Scenes.Events.UPDATE,this.start,this),n&&this.scene.events.on(s.Scenes.Events.UPDATE,this.update,this),a||o||n||r){const e=()=>{this.scene.events.off("scene-awake",this.awake,this),this.scene.events.off(s.Scenes.Events.UPDATE,this.start,this),this.scene.events.off(s.Scenes.Events.UPDATE,this.update,this),r&&this.destroy()};this.gameObject?this.gameObject.on(s.GameObjects.Events.DESTROY,e):this.scene.events.on(s.Scenes.Events.SHUTDOWN,e)}}getActionTargetObject(e){return a.getTargetGameObject(this,e)}get scene(){return this._scene}get gameObject(){return this._gameObject}get parent(){return this._parent}get children(){return this._children||(this._children=[]),this._children}add(e){this.children.push(e)}executeChildren(...e){if(this._children)for(const t of this._children)t.execute(...e)}execute(...e){}awake(){}start(){}update(){}destroy(){}}class o extends i{constructor(e){super(e),this.scene.events.once("scene-awake",(()=>{this.executeChildren()}))}}class n extends i{constructor(e){super(e),t(this,"eventName",""),t(this,"eventEmitter","gameObject"),t(this,"once",!1)}awake(){let e;switch(this.eventEmitter){case"game.events":e=this.scene.game.events;break;case"scene.events":e=this.scene.events;break;case"scene.loader":e=this.scene.load;break;case"scene.input":e=this.scene.input;break;case"scene.input.keyboard":e=this.scene.input.keyboard;break;case"scene.anims":e=this.scene.anims;break;case"scene.physics.world":e=this.scene.physics.world;break;case"gameObject":e=this.gameObject}if(e){switch(this.once?e.once(this.eventName,this.executeChildren,this):e.on(this.eventName,this.executeChildren,this),this.eventEmitter){case"scene.anims":case"scene.events":case"scene.input":case"scene.input.keyboard":case"scene.loader":case"scene.physics.world":this.scene.events.on(s.Scenes.Events.SHUTDOWN,(()=>{null==e||e.off(this.eventName,this.executeChildren,this)}))}this.gameObject&&"gameObject"!==this.eventEmitter&&this.gameObject.once(s.GameObjects.Events.DESTROY,(()=>{null==e||e.off(this.eventName,this.executeChildren,this)}))}}}class r extends n{constructor(e){super(e),this.eventName="pointerdown"}awake(){this.gameObject&&(this.gameObject.input||this.gameObject.setInteractive(),super.awake())}}class c{constructor(e){t(this,"gameObject"),t(this,"delay",0),this.gameObject=e,e.__DelayConfigComp=this}static getComponent(e){return e.__DelayConfigComp}static getDelay(e,t){const s=c.getComponent(e);return s?s.delay:t}}class l{constructor(e){t(this,"gameObject"),t(this,"duration",250),this.gameObject=e,e.__DurationConfigComp=this}static getComponent(e){return e.__DurationConfigComp}static getDuration(e,t){const s=l.getComponent(e);return s?s.duration:t}}class d{constructor(e){t(this,"gameObject"),t(this,"ease","Linear"),this.gameObject=e,e.__EaseConfigComp=this}static getComponent(e){return e.__EaseConfigComp}static getEase(e,t){const s=d.getComponent(e);return s?s.ease:t}}class h extends i{constructor(e){super(e),t(this,"from","NONE")}execute(...e){const t=this.getActionTargetObject(e),s=l.getDuration(this,250),a=c.getDelay(this,0),i=d.getEase(this,"Expo"),{x:o,y:n}=t;let r=o,h=n;switch(this.from){case"LEFT":r=-t.displayWidth;break;case"RIGHT":r=this.scene.scale.width+t.displayWidth;break;case"TOP":h=-t.displayHeight;break;case"BOTTOM":h=this.scene.scale.height+t.displayHeight}t.setPosition(r,h),this.scene.add.tween({targets:t,x:o,y:n,duration:s,delay:a,ease:i,onComplete:()=>{this.executeChildren()}})}}class m extends i{constructor(e){super(e),t(this,"_executing",!1)}execute(e){if(this._executing)return;this._executing=!0;const t=l.getDuration(this,80),s=this.getActionTargetObject(e),{scaleX:a,scaleY:i}=s;this.scene.add.tween({targets:s,scaleX:.8*a,scaleY:.8*i,duration:t,yoyo:!0,onComplete:()=>{this._executing=!1,this.executeChildren(e)}})}}class g extends s.Scene{constructor(){super("Level")}editorCreate(){const e=this.add.image(640,257,"FufuSuperDino"),t=new r(e);new m(t);const s=new o(e),a=new h(s),i=this.add.text(640,458,"",{});i.setOrigin(.5,.5),i.text="Phaser 3 + Phaser Editor v4\nVite + TypeScript",i.setStyle({align:"center",fontFamily:"Arial",fontSize:"3em"});const n=new o(i),c=new h(n);a.from="TOP",c.from="BOTTOM",this.events.emit("scene-awake")}create(){this.editorCreate()}}class u extends i{constructor(e){super(e)}get gameObject(){return super.gameObject}awake(){const e=this.gameObject.width;this.scene.load.on(s.Loader.Events.PROGRESS,(t=>{this.gameObject.width=e*t}))}}class p extends s.Scene{constructor(){super("Preload")}editorCreate(){const e=this.add.image(505.0120544433594,360,"guapen");e.scaleX=.32715486817515643,e.scaleY=.32715486817515643;const t=this.add.rectangle(553.0120849609375,361,256,20);t.setOrigin(0,0),t.isFilled=!0,t.fillColor=14737632,new u(t);const s=this.add.rectangle(553.0120849609375,361,256,20);s.setOrigin(0,0),s.fillColor=14737632,s.isStroked=!0;const a=this.add.text(552.0120849609375,329,"",{});a.text="Loading...",a.setStyle({color:"#e0e0e0",fontFamily:"arial",fontSize:"20px"}),this.events.emit("scene-awake")}preload(){this.editorCreate(),this.load.pack("asset-pack","assets/asset-pack.json")}create(){this.scene.start("Level")}}var T=(e=>(e[e.IDLE=0]="IDLE",e[e.WALKING=1]="WALKING",e[e.ATTACKING=2]="ATTACKING",e))(T||{});class y extends s.Physics.Arcade.Sprite{constructor(e,s,a,i){super(e,s,a,i),t(this,"currentState",0),t(this,"stateData",{}),e.add.existing(this),e.physics.add.existing(this),this.initializeAnimations(),this.setupEventListeners()}initializeAnimations(){this.scene.anims.create({key:"idle",frames:this.scene.anims.generateFrameNumbers("Warrior_Blue",{frames:[0,1]}),frameRate:10,repeat:-1}),this.scene.anims.create({key:"walk",frames:this.scene.anims.generateFrameNumbers("Warrior_Blue",{frames:[1,7,6,7]}),frameRate:10,repeat:-1}),this.scene.anims.create({key:"attack",frames:this.scene.anims.generateFrameNumbers("Warrior_Blue",{frames:[12,13,14,15,16,17]}),frameRate:10,repeat:0})}setupEventListeners(){this.on("animationcomplete",(e=>{this.onAnimationComplete(e)}))}setPlayerState(e,t={}){this.currentState=e,this.stateData=t,this.updateAnimation()}getCurrentState(){return this.currentState}updateAnimation(){switch(this.currentState){case 0:this.play("idle",!0);break;case 1:this.play("walk",!0);break;case 2:this.play("attack",!0)}}update(e,t){switch(this.currentState){case 0:break;case 1:const{velocityX:e,velocityY:t}=this.stateData;this.setVelocity(e,t);break;case 2:this.setVelocity(0,0)}}onAnimationComplete(e){"attack"===e.key&&this.setPlayerState(0)}moveUp(e){this.setPlayerState(1,{velocityX:0,velocityY:-e})}moveDown(e){this.setPlayerState(1,{velocityX:0,velocityY:e})}moveLeft(e){this.setPlayerState(1,{velocityX:-e,velocityY:0}),this.setFlipX(!0)}moveRight(e){this.setPlayerState(1,{velocityX:e,velocityY:0}),this.setFlipX(!1)}stopMoving(){this.setPlayerState(0),this.setVelocity(0,0)}attack(){this.setPlayerState(2),console.log("Player is attacking!")}}class _ extends s.Scene{constructor(){super("MainGameScene"),t(this,"rocks_1"),t(this,"buildings_1"),t(this,"player"),t(this,"cursors"),t(this,"controls"),t(this,"wasdKeys"),t(this,"grass_town_1_16"),t(this,"grass_town"),t(this,"grass_town_1"),t(this,"grass_town_2"),t(this,"grass_town_3")}preload(){this.load.pack("preload-asset-pack","assets/preload-asset-pack.json")}editorCreate(){const e=this.add.tilemap("grass_town_1_16");e.addTilesetImage("Tilemap_Flat","Tilemap_Flat"),e.addTilesetImage("Tilemap_Elevation","Tilemap_Elevation"),e.addTilesetImage("Shadows","Shadows"),e.addTilesetImage("Bridge_All","Bridge_All"),e.addTilesetImage("Water","Water"),e.addTilesetImage("Rocks_02","Rocks_02"),e.addTilesetImage("Rocks_01","Rocks_01"),e.addTilesetImage("Foam","Foam"),e.addTilesetImage("Tree","Tree"),e.addTilesetImage("house 1","house 1"),e.addTilesetImage("house 2","house 2"),e.addTilesetImage("house 8","house 8"),e.addTilesetImage("town hall","town hall"),e.addTilesetImage("Trees 2","Trees");const t=this.add.tilemap("grass_town_1_16");t.addTilesetImage("Tilemap_Flat","Tilemap_Flat"),t.addTilesetImage("Tilemap_Elevation","Tilemap_Elevation"),t.addTilesetImage("Shadows","Shadows"),t.addTilesetImage("Bridge_All","Bridge_All"),t.addTilesetImage("Water","Water"),t.addTilesetImage("Rocks_02","Rocks_02"),t.addTilesetImage("Rocks_01","Rocks_01"),t.addTilesetImage("Foam","Foam"),t.addTilesetImage("Tree","Tree"),t.addTilesetImage("house 1","house 1"),t.addTilesetImage("house 2","house 2"),t.addTilesetImage("house 8","house 8"),t.addTilesetImage("town hall","town hall"),t.addTilesetImage("Trees 2","Trees");const a=this.add.tilemap("grass_town_1_16");a.addTilesetImage("Tilemap_Flat","Tilemap_Flat"),a.addTilesetImage("Tilemap_Elevation","Tilemap_Elevation"),a.addTilesetImage("Shadows","Shadows"),a.addTilesetImage("Bridge_All","Bridge_All"),a.addTilesetImage("Water","Water"),a.addTilesetImage("Rocks_02","Rocks_02"),a.addTilesetImage("Rocks_01","Rocks_01"),a.addTilesetImage("Foam","Foam"),a.addTilesetImage("Tree","Tree"),a.addTilesetImage("house 1","house 1"),a.addTilesetImage("house 2","house 2"),a.addTilesetImage("house 8","house 8"),a.addTilesetImage("town hall","town hall"),a.addTilesetImage("Trees 2","Trees");const i=this.add.tilemap("grass_town_1_16");i.addTilesetImage("Tilemap_Flat","Tilemap_Flat"),i.addTilesetImage("Tilemap_Elevation","Tilemap_Elevation"),i.addTilesetImage("Shadows","Shadows"),i.addTilesetImage("Bridge_All","Bridge_All"),i.addTilesetImage("Water","Water"),i.addTilesetImage("Rocks_02","Rocks_02"),i.addTilesetImage("Rocks_01","Rocks_01"),i.addTilesetImage("Foam","Foam"),i.addTilesetImage("Tree","Tree"),i.addTilesetImage("house 1","house 1"),i.addTilesetImage("house 2","house 2"),i.addTilesetImage("house 8","house 8"),i.addTilesetImage("town hall","town hall"),i.addTilesetImage("Trees 2","Trees");const o=this.add.tilemap("grass_town_1_16");o.addTilesetImage("Tilemap_Flat","Tilemap_Flat"),o.addTilesetImage("Tilemap_Elevation","Tilemap_Elevation"),o.addTilesetImage("Shadows","Shadows"),o.addTilesetImage("Bridge_All","Bridge_All"),o.addTilesetImage("Water","Water"),o.addTilesetImage("Rocks_02","Rocks_02"),o.addTilesetImage("Rocks_01","Rocks_01"),o.addTilesetImage("Foam","Foam"),o.addTilesetImage("Tree","Tree"),o.addTilesetImage("house 1","house 1"),o.addTilesetImage("house 2","house 2"),o.addTilesetImage("house 8","house 8"),o.addTilesetImage("town hall","town hall"),o.addTilesetImage("Trees 2","Trees"),e.createLayer("Grass",["Tilemap_Flat"],0,0),t.createLayer("Water",["Tilemap_Flat","Water"],0,0);const n=a.createLayer("Rocks",["Tilemap_Elevation","Tilemap_Flat","Bridge_All","Rocks_01","Rocks_02"],0,0);n.setInteractive(new s.Geom.Polygon("0.797408475657424 156.09978128521334 153.3738001415179 153.88852923208492 156.3221362123558 126.6164205768345 285.3118393115132 122.93100048828714 288.99725940006056 95.65889183303672 398.8227780387718 91.2363877267799 404.71945018044755 61.753027018401056 510.8595487306114 61.753027018401056 521.178724978544 51.43385077046846 543.2912455098281 47.011346664211636 546.239581580666 12.368397831866499 570.5633541650785 13.105481849575972 577.1971103244638 1.3121375662244354 750.4118544861894 3.5233896193528484 754.0972745747368 28.58424622147486 876.3296268040887 31.590262254214547 880.7438910147168 59.547268921526125 960.2006468060234 62.49011172861155 1036.7145597902445 65.43295453569698 1047.0145096150436 90.44711839592313 1129.4141082134356 99.27564681717942 1136.7712152311492 118.40412506323472 1280.9705127783352 125.76123208094829 1279.8144338964146 -3.3226159573590612 -0.2932203623749966 -5.98396243190956"),s.Geom.Polygon.Contains);const r=i.createLayer("Buildings",["Tree","town hall","house 8","house 1"],0,0);o.createLayer("Roofs",["Tree","town hall","house 8","house 1"],0,0);const c=this.add.rectangle(640,720,128,128);c.scaleX=10.3,c.scaleY=.4,c.isFilled=!0,c.fillColor=3024410;const l=this.add.text(928,560,"",{});l.text="SHADOWTIDE\nISLAND",l.setStyle({align:"right",color:"#ceba96ff",fontSize:"54px",fontStyle:"bold",stroke:"#000000ff",strokeThickness:5,"shadow.offsetX":13,"shadow.offsetY":8,"shadow.blur":5,"shadow.fill":!0}),this.player=new y(this,400,300,"Warrior_Blue"),this.input&&this.input.keyboard&&(this.input.keyboard.on("keydown-W",(()=>this.player.moveUp(100))),this.input.keyboard.on("keydown-S",(()=>this.player.moveDown(100))),this.input.keyboard.on("keydown-A",(()=>this.player.moveLeft(100))),this.input.keyboard.on("keydown-D",(()=>this.player.moveRight(100))),this.input.keyboard.on("keyup-W",(()=>this.player.stopMoving())),this.input.keyboard.on("keyup-S",(()=>this.player.stopMoving())),this.input.keyboard.on("keyup-A",(()=>this.player.stopMoving())),this.input.keyboard.on("keyup-D",(()=>this.player.stopMoving())),this.input.on("pointerdown",(()=>this.player.attack()))),this.rocks_1=n,this.buildings_1=r,this.grass_town_1_16=e,this.grass_town=t,this.grass_town_1=a,this.grass_town_2=i,this.grass_town_3=o,this.events.emit("scene-awake")}create(){this.editorCreate(),this.rocks_1.setCollisionByProperty({collides:!0}),this.physics.add.collider(this.player,this.rocks_1);const e=this.add.graphics();if(this.rocks_1.renderDebug(e,{tileColor:null,collidingTileColor:new s.Display.Color(243,134,48,200),faceColor:new s.Display.Color(40,39,37,255)}),this.cameras.main.setBounds(0,0,3840,2160),this.cameras.main.startFollow(this.player),this.input.keyboard){this.cursors=this.input.keyboard.createCursorKeys();const e={camera:this.cameras.main,left:this.cursors.left,right:this.cursors.right,up:this.cursors.up,down:this.cursors.down,acceleration:.06,drag:5e-4,maxSpeed:1.5};this.controls=new s.Cameras.Controls.SmoothedKeyControl(e),this.wasdKeys=this.input.keyboard.addKeys({W:s.Input.Keyboard.KeyCodes.W,A:s.Input.Keyboard.KeyCodes.A,S:s.Input.Keyboard.KeyCodes.S,D:s.Input.Keyboard.KeyCodes.D})}else console.error("Keyboard input system not initialized.")}update(e,t){if(this.controls&&this.controls.update(t),this.player.update(e,t),this.player.getCurrentState()!==T.ATTACKING){let e=0,t=0;const s=100;this.wasdKeys.W.isDown?t=-1:this.wasdKeys.S.isDown&&(t=1),this.wasdKeys.A.isDown?(e=-1,this.player.setFlipX(!0)):this.wasdKeys.D.isDown&&(e=1,this.player.setFlipX(!1)),0!==e&&0!==t&&(e*=Math.SQRT1_2,t*=Math.SQRT1_2),0!==e||0!==t?this.player.setPlayerState(T.WALKING,{velocityX:e*s,velocityY:t*s}):this.player.stopMoving()}}}class w extends s.Scene{constructor(){super("Boot")}preload(){this.load.pack("pack","assets/preload-asset-pack.json")}create(){this.scene.start("MainGameScene")}}window.addEventListener("load",(function(){new s.Game({width:1920,height:1080,backgroundColor:"#2f2f2f",parent:"game-container",scale:{mode:s.Scale.ScaleModes.FIT,autoCenter:s.Scale.Center.CENTER_BOTH},scene:[w,p,g,_],physics:{default:"arcade",arcade:{gravity:{x:0,y:0}}}}).scene.start("Boot")}));
