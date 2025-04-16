import Phaser from "phaser";
import * as Colyseus from "colyseus.js";

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceBar!: Phaser.Input.Keyboard.Key;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private bullets!: Phaser.Physics.Arcade.Group;
  private room: Colyseus.Room | null = null;
  private client: Colyseus.Client | null = null;
  private remotePlayers: Map<string, Phaser.Physics.Arcade.Sprite> = new Map();

  constructor() {
    super("GameScene");
  }

  async init() {
    this.client = new Colyseus.Client("ws://localhost:2567");
    try {
      this.room = await this.client.joinOrCreate("game");
      console.log("Joined room:", this.room.sessionId);
    } catch (error) {
      console.error("Failed to join room:", error);
      this.room = null;
    }
  }

  preload() {
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
    this.player = this.physics.add
      .sprite(100, 500, "null")
      .setDisplaySize(50, 50)
      .setTint(0x0000ff);
    // this.player = this.physics.add.sprite(100, 500, "player").setScale(0.1); // Adjust size if needed

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

    if (this.room) {
      this.room.state.players.onAdd((player: any, sessionId: string) => {
        if (sessionId !== this.room!.sessionId) {
          const sprite = this.physics.add
            .sprite(player.x, player.y, "null")
            .setDisplaySize(50, 50)
            .setTint(0xff0000);
          this.remotePlayers.set(sessionId, sprite);
          this.physics.add.collider(sprite, this.platforms);
          console.log(
            `Remote player ${sessionId} added at x:${player.x}, y:${player.y}`
          );
        }
      });

      this.room.state.players.onRemove((player: any, sessionId: string) => {
        const sprite = this.remotePlayers.get(sessionId);
        if (sprite) {
          sprite.destroy();
          this.remotePlayers.delete(sessionId);
          console.log(`Remote player ${sessionId} removed`);
        }
      });

      this.room.state.players.onChange((player: any, sessionId: string) => {
        if (sessionId !== this.room!.sessionId) {
          const sprite = this.remotePlayers.get(sessionId);
          if (sprite) {
            sprite.setPosition(player.x, player.y);
          }
        }
      });

      console.log("Multiplayer initialized");
    } else {
      console.warn("Running in single-player mode");
    }
  }

  update() {
    if (!this.player) {
      console.error("Player not initialized");
      return;
    }

    let velocityX = 0;
    let velocityY = this.player.body!.velocity.y;

    if (
      this.cursors.left.isDown ||
      this.input.keyboard!.checkDown(this.input.keyboard!.addKey("A"))
    ) {
      velocityX = -160;
    } else if (
      this.cursors.right.isDown ||
      this.input.keyboard!.checkDown(this.input.keyboard!.addKey("D"))
    ) {
      velocityX = 160;
    }

    if (this.spaceBar.isDown && this.player.body!.touching.down) {
      velocityY = -330;
    }

    this.player.setVelocityX(velocityX);
    this.player.setVelocityY(velocityY);

    if (this.room) {
      this.room.send("move", { velocityX, velocityY });
    }

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

    (bullet.body as Phaser.Physics.Arcade.Body).allowGravity = false;

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
