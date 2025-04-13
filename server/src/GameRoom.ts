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
  minClients = 2; // For testing

  onCreate(options: any) {
    console.log("GameRoom created:", options);
    this.setState(new GameState());
    this.autoDispose = true;
    // Lock room when full
    this.onMessage("ready", (client) => {
      if (this.clients.length >= this.minClients) {
        this.lock();
        console.log("Room locked with", this.clients.length, "players");
      }
    });
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
      // Unlock if below minClients
      if (this.clients.length < this.minClients && this.locked) {
        this.unlock();
        console.log("Room unlocked");
      }
    }
  }

  onDispose() {
    console.log("GameRoom disposed");
  }
}
