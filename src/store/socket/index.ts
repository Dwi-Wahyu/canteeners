import { create } from "zustand";
import { SocketState } from "./types";

export const socketStore = create<SocketState>((set, get) => ({
  socket: null,
  connected: false,
  messages: [],

  connect: (user_id) => {
    // hindari koneksi ulang
    if (get().socket) return;

    const NEXT_PUBLIC_SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

    const ws = new WebSocket(`${NEXT_PUBLIC_SOCKET_URL}?user_id=${user_id}`);

    ws.onopen = () => {
      console.log("✅ Connected to Bun server");
      set({ socket: ws, connected: true });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      set((state) => ({ messages: [...state.messages, data] }));
    };

    ws.onclose = () => {
      console.log("❌ Disconnected from server");
      set({ connected: false, socket: null });
    };

    ws.onerror = (err) => {
      console.log(err);
      set({ connected: false });
    };
  },

  disconnect: () => {
    const ws = get().socket;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close(1000, "Client disconnected");
      console.log("🔌 Socket closed by client");
    }
    set({ socket: null, connected: false });
  },

  sendMessage: (msg) => {
    const ws = get().socket;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  },

  joinRoom: (conversation_id) => {
    const ws = get().socket;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "JOIN_CONVERSATION",
          conversation_id: conversation_id,
        })
      );
      console.log(`👥 Joined room ${conversation_id}`);
    }
  },

  leaveRoom: (conversation_id) => {
    const ws = get().socket;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "LEAVE_CONVERSATION",
          conversation_id: conversation_id,
        })
      );
      console.log(`🚪 Left room ${conversation_id}`);
    }
  },
}));
