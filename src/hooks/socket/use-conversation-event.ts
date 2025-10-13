import { useEffect } from "react";
import { useSocketInstance } from "./core";
import { useSocketEvent } from "./use-socket-event";

export function useConversationEvent(conversationId: string) {
  const socket = useSocketInstance();

  useSocketEvent(
    "new_message",
    (message) => {
      console.log("Pesan baru di", conversationId, ":", message);
    },
    [conversationId]
  );

  useEffect(() => {
    if (!socket || !socket.connected) return;
    socket.emit("join_conversation", conversationId);

    return () => {
      socket.emit("leave_conversation", conversationId);
    };
  }, [socket, conversationId]);
}
