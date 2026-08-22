import express from "express";
import http from "http";
import { attachWebSocketServer } from "./ws/server.js";
import { matchRouter } from "./routes/match.route.js";

const app = express();

const PORT = 8000;
const HOST = 8000;

const server = http.createServer();
// Middleware to parse JSON request bodies
app.use(express.json());

// Root endpoint
app.use("/matches", matchRouter);

const { broadCastMatchCreated } = attachWebSocketServer(server);
app.locals.broadCastMatchCreated = broadCastMatchCreated;

// Start server on port 8000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Websocket is running on port${PORT}/ws `);
});
