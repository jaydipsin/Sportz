import express from "express";
import http from "http";
import { attachWebSocketServer } from "./ws/server.js";
import { matchRouter } from "./routes/match.route.js";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*" }));

const PORT = 8000;
const HOST = '0.0.0.0';

const server = http.createServer(app);
// Middleware to parse JSON request bodies
app.use(express.json());

// Root endpoint
app.use("/matches", matchRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

// Start server on port 8000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Websocket is running on port${PORT}/ws `);
});
