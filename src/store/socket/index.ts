import { create } from "zustand";
import { MessageData, SocketState } from "./types";

export const socketStore = create<SocketState>((set, get) => ({
  socket: null,
  connected: false,
  messages: [],
  readTriggers: {},
  refreshTriggers: {},

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
      let data: MessageData;
      try {
        data = JSON.parse(event.data);
      } catch (error) {
        console.log(error);
        return;
      }

      if (data.type === "UPDATE_ORDER") {
        const { order_id } = data;

        if (!order_id) {
          return;
        }

        set((state) => ({
          refreshTriggers: { ...state.refreshTriggers, [order_id]: Date.now() },
        }));

        console.log(`Received refresh signal for order ${order_id}`);

        return;
      }

      if (data.type === "ACK_READ") {
        const { conversation_id } = data;

        if (!conversation_id) {
          return;
        }

        set((state) => ({
          readTriggers: {
            ...state.readTriggers,
            [conversation_id]: Date.now(),
          },
        }));

        console.log(`ACK Messages in ${conversation_id} marked as read`);
      }

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
      console.log(`Left room ${conversation_id}`);
    }
  },

  subscribeOrder: (order_id) => {
    const ws = get().socket;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "SUBSCRIBE_ORDER",
          order_id: order_id,
        })
      );
      console.log(`Subscribe ${order_id}`);
    }
  },

  unsubscribeOrder: (order_id) => {
    const ws = get().socket;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "UNSUBSCRIBE_ORDER",
          order_id: order_id,
        })
      );
      console.log(`Unsubscribe ${order_id}`);
    }
  },

  updateOrder: (order_id) => {
    const ws = get().socket;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "UPDATE_ORDER",
          order_id: order_id,
        })
      );
      console.log(`Update order ${order_id}`);
    }
  },

  sendReadAck: (conversation_id: string) => {
    const ws = get().socket;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "ACK_READ",
          conversation_id,
        })
      );
    }
  },

  sendNewOrder: ({
    order_id,
    receiver_id,
  }: {
    order_id: string;
    receiver_id: string;
  }) => {
    const ws = get().socket;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "NEW_ORDER",
          order_id,
          receiver_id,
        })
      );
    }
  },
}));
