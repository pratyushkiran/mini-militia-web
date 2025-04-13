import Phaser from "phaser";

export class HudScene extends Phaser.Scene {
  private healthText!: Phaser.GameObjects.Text;
  private health: number = 100;

  constructor() {
    super("HudScene");
  }

  create() {
    // Add health text with bold styling
    this.healthText = this.add
      .text(20, 20, `Health: ${this.health}`, {
        fontSize: "24px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 10 },
      })
      .setDepth(100); // Ensure top layer

    console.log("Health HUD rendered at x:20, y:20");
  }

  // Method to update health (for later use)
  updateHealth(newHealth: number) {
    this.health = newHealth;
    this.healthText.setText(`Health: ${this.health}`);
  }
}
