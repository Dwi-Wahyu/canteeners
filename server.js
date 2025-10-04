import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);
  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("message", (msg) => {
      console.log(`Message received: ${msg}`);
      socket.broadcast.emit("message", msg);
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
  httpServer.listen(3000, "0.0.0.0", () => {
    console.log("> Ready on http://localhost:3000");
  });
});
