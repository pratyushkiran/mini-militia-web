import { Server } from "colyseus";
import { createServer } from "http";
import express, { Request, Response } from "express";

const app = express();
const gameServer = new Server({
  server: createServer(app),
});

app.get("/", (req: Request, res: Response) => {
  res.send("Colyseus Server Running");
});

gameServer.listen(2567);
console.log("Server running on http://localhost:2567");
