import { Server } from "colyseus";
import { createServer } from "http";
import express, { Request, Response } from "express";
import { GameRoom } from "./GameRoom";

const app = express();
const httpServer = createServer(app);
const gameServer = new Server({
  server: httpServer,
});

// Register GameRoom
gameServer.define("game", GameRoom);

// HTTP endpoint for health check
app.get("/", (req: Request, res: Response) => {
  res.send("Colyseus Server Running");
});

// Start server
const PORT = 2567;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
