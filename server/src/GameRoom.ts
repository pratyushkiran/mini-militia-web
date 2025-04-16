import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

class Player extends Schema {
  @type("number") x: number = 100;
  @type("number") y: number = 500;
  @type("string") sessionId: string | undefined;
  @type("number") velocityX: number = 0;
  @type("number") velocityY: number = 0;
}

class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

export class GameRoom extends Room<GameState> {
  maxClients = 4;
  minClients = 2; // For testing

  onCreate(options: any) {
    console.log("GameRoom created:", options);
    this.setState(new GameState());
    this.autoDispose = false;
    console.log("Starting lock timeout");
    setTimeout(() => {
      console.log(
        "Lock timeout fired, clients:",
        this.clients.length,
        "locked:",
        this.locked
      );
      if (
        this.clients.length >= this.minClients &&
        this.clients.length <= this.maxClients &&
        !this.locked
      ) {
        this.lock();
        console.log("Room locked with", this.clients.length, "players");
      } else {
        console.log(
          "Lock skipped: clients=",
          this.clients.length,
          "min=",
          this.minClients,
          "max=",
          this.maxClients,
          "locked=",
          this.locked
        );
      }
    }, 10000);

    this.onMessage(
      "move",
      (client: Client, data: { velocityX: number; velocityY: number }) => {
        const player = this.state.players.get(client.sessionId);
        if (player) {
          player.velocityX = data.velocityX;
          player.velocityY = data.velocityY;
          console.log(
            `${client.sessionId} moved: vx=${data.velocityX}, vy=${data.velocityY}`
          );
        }
      }
    );

    this.setSimulationInterval((delta) => {
      this.state.players.forEach((player) => {
        player.x += player.velocityX * (delta / 1000);
        player.y += player.velocityY * (delta / 1000);
        player.x = Math.max(0, Math.min(800, player.x));
        player.y = Math.max(0, Math.min(600, player.y));
      });
    }, 1000 / 60);
  }

  async onAuth(client: Client, options: any) {
    return true;
  }

  onJoin(client: Client, options: any) {
    const player = new Player();
    player.sessionId = client.sessionId;
    player.x = 100 + this.state.players.size * 50;
    this.state.players.set(client.sessionId, player);
    console.log(
      `${client.sessionId} joined. Players: ${this.state.players.size}`
    );
    // Broadcast join
    this.broadcast(
      "player_joined",
      { sessionId: client.sessionId },
      { except: client }
    );
  }

  onLeave(client: Client, consented: boolean) {
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId);
      console.log(
        `${client.sessionId} left. Players: ${this.state.players.size}`
      );
      this.broadcast("player_left", { sessionId: client.sessionId });
      if (this.clients.length === 0) {
        setTimeout(() => {
          if (this.clients.length === 0) {
            this.disconnect();
            console.log("GameRoom disposed after delay");
          }
        }, 5000);
      }
    }
  }

  onDispose() {
    console.log("GameRoom disposed");
  }
}
