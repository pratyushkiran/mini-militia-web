const Colyseus = require("colyseus.js");
const client = new Colyseus.Client("ws://localhost:2567");

async function joinRoom() {
  const room = await client.joinOrCreate("game");
  console.log("Joined room:", room.sessionId);

  room.onMessage("player_joined", (msg) => {
    console.log("Player joined:", msg.sessionId);
  });
  room.onMessage("player_left", (msg) => {
    console.log("Player left:", msg.sessionId);
  });

  // Simulate ready after 2 seconds
  setTimeout(() => {
    room.send("ready");
  }, 8000);
}

joinRoom().catch(console.error);
