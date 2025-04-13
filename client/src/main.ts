import Phaser from "phaser";
import { GameScene } from "./GameScene";
import { HudScene } from "./HudScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "app",
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 800,
        x: 0,
      },
      debug: true, // Shows collision boxes in green
    },
  },
  scene: [GameScene],
};

console.log("Initializing Phaser");
const game = new Phaser.Game(config);
console.log("GameScene loaded");

// proper way to add new scene !!
game.scene.add("HudScene", HudScene, true); // Add and start the HUD scene
