import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

class Player extends Schema {
  @type("number") x: number = 100;
  @type("number") y: number = 500;
  @type("string") sessionId: string | undefined;
}

class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

export class GameRoom extends Room<GameState> {
  maxClients = 4;

  onCreate(options: any) {
    console.log("GameRoom created:", options);
    this.setState(new GameState());
    this.autoDispose = true;
  }

  async onAuth(client: Client, options: any) {
    return true; // Open for now; Firebase on Day 7
  }

  onJoin(client: Client, options: any) {
    const player = new Player();
    player.sessionId = client.sessionId;
    player.x = 100 + this.state.players.size * 50; // Stagger spawns
    this.state.players.set(client.sessionId, player);
    console.log(
      `${client.sessionId} joined. Players: ${this.state.players.size}`
    );
  }

  onLeave(client: Client, consented: boolean) {
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId);
      console.log(
        `${client.sessionId} left. Players: ${this.state.players.size}`
      );
    }
  }

  onDispose() {
    console.log("GameRoom disposed");
  }
}
