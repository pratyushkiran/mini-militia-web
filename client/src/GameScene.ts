import Phaser from "phaser";
import { HudScene } from "./HudScene";

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceBar!: Phaser.Input.Keyboard.Key;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private bullets!: Phaser.Physics.Arcade.Group;

  constructor() {
    super("GameScene");
  }

  preload() {
    // No assets yet (rectangles for now)
    this.load.image("player", "assets/player.png");
  }

  create() {
    // Background and physics bounds
    this.cameras.main.setBackgroundColor("#aaddff");
    this.physics.world.setBounds(0, 0, 800, 600);

    // Platforms
    this.platforms = this.physics.add.staticGroup();
    this.platforms
      .create(400, 600, "null")
      .setDisplaySize(800, 50)
      .refreshBody();
    this.platforms
      .create(200, 400, "null")
      .setDisplaySize(200, 20)
      .refreshBody();
    this.platforms
      .create(600, 500, "null")
      .setDisplaySize(200, 20)
      .refreshBody();

    // Player (blue rectangle)
    // this.player = this.physics.add
    //   .sprite(100, 500, "null")
    //   .setDisplaySize(50, 50)
    //   .setTint(0x0000ff);
    this.player = this.physics.add.sprite(100, 500, "player").setScale(0.1); // Adjust size if needed

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Player-platform collisions
    this.physics.add.collider(this.player, this.platforms);

    // Bullets group (dynamic, max 10 bullets)
    this.bullets = this.physics.add.group({
      maxSize: 10,
      classType: Phaser.Physics.Arcade.Sprite,
      runChildUpdate: true,
    });

    // Bullet-platform collisions
    this.physics.add.collider(this.bullets, this.platforms, (bullet) => {
      bullet.destroy();
    });

    // Mouse click to shoot
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        this.shootBullet(pointer.worldX, pointer.worldY);
      }
    });

    // Keyboard controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.spaceBar = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    console.log("Game scene initialized with shooting");
  }

  update() {
    // Player movement
    if (
      this.cursors.left.isDown ||
      this.input.keyboard!.checkDown(this.input.keyboard!.addKey("A"))
    ) {
      this.player.setVelocityX(-300);
    } else if (
      this.cursors.right.isDown ||
      this.input.keyboard!.checkDown(this.input.keyboard!.addKey("D"))
    ) {
      this.player.setVelocityX(300);
    } else {
      this.player.setVelocityX(0);
    }

    // Jump
    if (this.spaceBar.isDown && this.player.body!.touching.down) {
      this.player.setVelocityY(-400);
    }

    // Destroy bullets off-screen
    this.bullets.children.iterate((bullet: any) => {
      if (
        bullet &&
        (bullet.x < 0 || bullet.x > 800 || bullet.y < 0 || bullet.y > 600)
      ) {
        bullet.destroy();
      }
      return true;
    });
  }

  private shootBullet(targetX: number, targetY: number) {
    // Get available bullet or create new
    const bullet = this.bullets.get(
      this.player.x,
      this.player.y
    ) as Phaser.Physics.Arcade.Sprite;
    if (!bullet) return;

    // Set bullet properties
    bullet.setActive(true).setVisible(true);
    bullet.setDisplaySize(10, 5).setTint(0xff0000); // Red rectangle
    bullet.body!.allowGravity = false; // Bullets fly straight

    // Calculate direction
    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      targetX,
      targetY
    );
    const speed = 1000; // Pixels per second
    bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    console.log("Bullet fired toward", targetX, targetY);
  }
}
