import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { NewMessageData } from "./type";

const PORT = process.env.SOCKET_PORT || 4000;
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

async function start() {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: ["*"], // ubah sesuai domain Next.js kamu
      methods: ["GET", "POST"],
    },
  });

  // 🔹 Buat koneksi Redis untuk adapter
  const pubClient = createClient({ url: REDIS_URL });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  // 🔹 Hubungkan Socket.IO ke Redis
  io.adapter(createAdapter(pubClient, subClient));

  // 🔹 Event connection
  io.on("connection", (socket) => {
    console.log(`Client ${socket.id} terhubung`);

    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`${socket.id} joined conversation ${conversationId}`);
    });

    socket.on("send_message", (data: NewMessageData, callback) => {
      console.log(data);

      socket.to(data.conversationId).emit("new_message", data.content);

      callback({ status: "received" });
    });

    socket.on("leave_conversation", (conversationId) => {
      socket.leave(conversationId);
      console.log(`${socket.id} left conversation ${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Socket.IO + Redis server running on http://localhost:${PORT}`
    );
  });
}

start().catch((err) => {
  console.error("❌ Failed to start server:", err);
});
