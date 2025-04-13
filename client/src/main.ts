import Phaser from "phaser";
import { GameScene } from "./GameScene";

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
new Phaser.Game(config);
