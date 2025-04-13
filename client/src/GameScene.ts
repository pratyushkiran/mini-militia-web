import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceBar!: Phaser.Input.Keyboard.Key;

  constructor() {
    super("GameScene");
  }

  preload() {
    // No assets yet
  }

  create() {
    // Background and physics bounds
    this.cameras.main.setBackgroundColor("#ffffff");
    this.physics.world.setBounds(0, 0, 800, 600);

    // Platforms
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 600, "null").setDisplaySize(800, 50).refreshBody();
    platforms.create(200, 400, "null").setDisplaySize(200, 20).refreshBody();
    platforms.create(600, 300, "null").setDisplaySize(200, 20).refreshBody();

    // Player (blue rectangle)
    this.player = this.physics.add
      .sprite(100, 500, "null")
      .setDisplaySize(50, 50)
      .setTint(0x0000ff); // Blue color
    this.player.setBounce(0.2); // Slight bounce on landing
    this.player.setCollideWorldBounds(true); // Stays within canvas

    // Collisions between player and platforms
    this.physics.add.collider(this.player, platforms);

    // Keyboard controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.spaceBar = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    console.log("Player and platforms created");
  }

  update() {
    // Horizontal movement
    if (
      this.cursors.left.isDown ||
      this.input.keyboard!.checkDown(this.input.keyboard!.addKey("A"))
    ) {
      this.player.setVelocityX(-160); // Move left
    } else if (
      this.cursors.right.isDown ||
      this.input.keyboard!.checkDown(this.input.keyboard!.addKey("D"))
    ) {
      this.player.setVelocityX(160); // Move right
    } else {
      this.player.setVelocityX(0); // Stop
    }

    // Jump (only when on ground)
    if (this.spaceBar.isDown && this.player.body!.touching.down) {
      this.player.setVelocityY(-330); // Jump upward
    }
  }
}
