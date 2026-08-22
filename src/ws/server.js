import { WebSocketServer } from "ws";

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify(payload));
}

function broadCast(wss, payload) {
  for (client of wss.clients) {
    if (socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(payload));
  }
}

export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024,
  });

  wss.on("connection", (socket) => {
    sendJson(socket, { type: "Welcome" });
    socket.on("error", console.error);
  });

  function broadCastMatchCreated(match) {
    broadCast(wss, { message: "Broascast", data: match });
  }

  return { broadCastMatchCreated };
}
