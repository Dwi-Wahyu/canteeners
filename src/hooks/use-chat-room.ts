// use-chat-room.tsx
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { saveMessage } from "@/app/chat/actions";
import { Prisma, MessageType } from "@/app/generated/prisma";
import {
  useIsSocketConnected,
  useSocketJoinRoom,
  useSocketLeaveRoom,
  useSocketSendMessage,
} from "./use-socket";
import { socketStore } from "@/store/socket";

type MessageWithMedia = Prisma.MessageGetPayload<{
  include: { media: true };
}>;

interface UseChatRoomProps {
  conversationId: string;
  senderId: string;
  initialMessages: MessageWithMedia[];
}

export function useChatRoom({
  conversationId,
  senderId,
  initialMessages,
}: UseChatRoomProps) {
  const messages = socketStore((s) => s.messages);
  const connected = useIsSocketConnected();
  const sendMessage = useSocketSendMessage();
  const joinRoom = useSocketJoinRoom();
  const leaveRoom = useSocketLeaveRoom();

  const [text, setText] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketStore.setState({ messages: initialMessages });
  }, [initialMessages]);

  // cek kenapa ini bekerja kalo di watch pi
  useEffect(() => {
    console.log(messages.length);
  }, [messages]);

  useEffect(() => {
    if (!connected) return;

    joinRoom(conversationId);

    return () => {
      leaveRoom(conversationId);
    };
  }, [connected, joinRoom, leaveRoom, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (type: MessageType, order_id?: string) => {
    if (!text.trim() && media.length === 0) return;
    setIsLoading(true);

    const saved = await saveMessage({
      conversation_id: conversationId,
      sender_id: senderId,
      type,
      text,
      media,
      order_id,
    });

    if (!saved.success || !saved.data) {
      toast.error("Gagal menyimpan pesan");
      setIsLoading(false);
      return;
    }

    const newMessage = saved.data;

    // OPTIMISTIC UPDATE: Tambahkan ke store SEKETIKA
    socketStore.setState((state) => {
      // Cegah duplikat
      if (state.messages.some((m) => m.id === newMessage.id)) {
        return state;
      }
      return {
        messages: [...state.messages, newMessage],
      };
    });

    // Kirim ke server via WebSocket
    if (connected) {
      sendMessage(JSON.stringify(newMessage));
    }

    setText("");
    setMedia([]);
    setIsLoading(false);
  };

  return {
    text,
    setText,
    media,
    setMedia,
    messages, // ← dari store
    handleSend,
    isLoading,
    messagesEndRef,
  };
}
