"use client";

import { create } from "zustand";
import { Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket";

interface SocketStore {
  socket: Socket | null;
  connected: boolean;
  subscribed: boolean;
  joinedConversation: boolean;

  connect: (userId: string) => void;
  disconnect: () => void;
  joinConversation: (conversationId: string) => void;
  subscribeNotifications: (userId: string) => void;
  leaveConversation: (conversationId: string) => void;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  connected: false,
  subscribed: false,
  joinedConversation: false,

  connect: (userId: string) => {
    const { socket: existing, subscribed } = get();
    const socket = existing ?? getSocket();

    if (!socket.connected) {
      socket.connect();

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
        set({ connected: true });

        const { subscribed: currentSubscribed } = get();
        if (!currentSubscribed) {
          socket.emit("subscribe_notifications", userId);
          set({ subscribed: true });
          console.log("📩 subscribe notifikasi untuk", userId);
        }
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
        set({ connected: false, subscribed: false });
      });
    } else {
      if (!subscribed) {
        socket.emit("subscribe_notifications", userId);
        set({ subscribed: true });
        console.log("📩 subscribe notifikasi untuk", userId);
      }
    }

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket && socket.connected) {
      socket.disconnect();
      set({ connected: false });
    }
  },

  joinConversation: (conversationId) => {
    const socket = get().socket;
    if (socket && socket.connected) {
      socket.emit("join_conversation", conversationId, (response: string) => {
        if (response === "joined") {
          set({ joinedConversation: true });
        }
      });
    }
  },

  subscribeNotifications: (userId) => {
    const socket = get().socket;
    if (socket && socket.connected) {
      socket.emit("subscribe_notifications", userId);
      set({ subscribed: true });
      console.log("subscribe notifikasi untuk " + userId);
    }
  },

  leaveConversation: (conversationId) => {
    const socket = get().socket;
    if (socket && socket.connected) {
      socket.emit("leave_conversation", conversationId);
      console.log("keluar dari percakapan ", conversationId);
      set({ joinedConversation: false });
    }
  },
}));

export function useSocketInstance() {
  return useSocketStore((state) => state.socket);
}

export function useIsSocketConnected() {
  return useSocketStore((state) => state.connected);
}

export function useIsSubscribedNotifications() {
  return useSocketStore((state) => state.subscribed);
}

export function useConnectSocket() {
  return useSocketStore((state) => state.connect);
}

export function useDisconnectSocket() {
  return useSocketStore((state) => state.disconnect);
}

export function useJoinConversation() {
  return useSocketStore((state) => state.joinConversation);
}

export function useSubscribeNotifications() {
  return useSocketStore((state) => state.subscribeNotifications);
}

export function useLeaveConversation() {
  return useSocketStore((state) => state.leaveConversation);
}
