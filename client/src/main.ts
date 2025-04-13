import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#ffffff"); // White background
    this.add
      .text(400, 300, "Hello, Mini Militia!", {
        color: "#000000",
        fontSize: "32px",
      })
      .setOrigin(0.5);
    console.log("GameScene created");
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "app",
  scene: [GameScene],
};

console.log("Initializing Phaser");
new Phaser.Game(config);
