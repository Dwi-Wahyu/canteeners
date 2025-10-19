import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { saveMessage } from "@/app/chat/actions";
import { useSocketStore } from "@/store/socket";

import {
  Prisma,
  Message,
  MessageMedia,
  MessageType,
  MediaMimeType,
} from "@/app/generated/prisma";

// Definisikan tipe untuk Message dengan include media
type MessageWithMedia = Prisma.MessageGetPayload<{
  include: { media: true };
}>;

enum MessageTypeEnum {
  TEXT = "TEXT",
  SYSTEM = "SYSTEM",
  ORDER = "ORDER",
  PAYMENT_PROOF = "PAYMENT_PROOF",
}

enum MediaMimeTypeEnum {
  IMAGE_JPEG = "image/jpeg",
  IMAGE_PNG = "image/png",
  // Tambahkan mime type lain sesuai kebutuhan, misalnya video/mp4
}

// Interface untuk UseChatRoomProps
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
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const socket = useSocketStore((s) => s.socket);
  const connected = useSocketStore((s) => s.connected);
  const joinConversation = useSocketStore((s) => s.joinConversation);
  const leaveConversation = useSocketStore((s) => s.leaveConversation);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    joinConversation(conversationId);
    return () => leaveConversation(conversationId);
  }, [conversationId, joinConversation, leaveConversation]);

  useEffect(() => {
    if (!socket || !connected) return;

    const onSendMessage = (data: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });

      socket.emit("receive_message", conversationId, data.id);
    };

    const onReceiveMessage = (messageId: string) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, is_read: true } : m))
      );
    };

    socket.on("send_message", onSendMessage);
    socket.on("receive_message", onReceiveMessage);

    return () => {
      socket.off("send_message", onSendMessage);
      socket.off("receive_message", onReceiveMessage);
    };
  }, [socket, connected, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;
    setIsLoading(true);

    const saved = await saveMessage({
      conversation_id: conversationId,
      sender_id: senderId,
      type: "TEXT",
      content: text,
      media,
    });

    if (!saved.success || !saved.data) {
      toast.error("Gagal menyimpan pesan");
      setIsLoading(false);
      return;
    }

    const newMessage = saved.data;
    setMessages((prev) => [...prev, newMessage]);

    if (socket && connected) {
      socket.emit("send_message", newMessage);
    }

    setText("");
    setIsLoading(false);
  };

  return {
    text,
    setText,
    media,
    setMedia,
    messages,
    handleSend,
    isLoading,
    messagesEndRef,
  };
}
