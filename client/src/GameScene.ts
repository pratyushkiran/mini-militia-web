import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    // No assets yet (will add sprites later)
  }

  create() {
    // Set white background for visibility
    this.cameras.main.setBackgroundColor("#ffffff");

    // Enable Arcade Physics world bounds
    this.physics.world.setBounds(0, 0, 800, 600);

    // Create static platforms group
    const platforms = this.physics.add.staticGroup();

    // Ground (bottom of canvas)
    platforms.create(400, 600, "null").setDisplaySize(800, 50).refreshBody();

    // Two floating platforms
    platforms.create(200, 400, "null").setDisplaySize(200, 20).refreshBody();
    platforms.create(600, 300, "null").setDisplaySize(200, 20).refreshBody();

    console.log("Platforms created");
  }

  update() {
    // Empty for now
  }
}
