import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { saveMessage } from "@/app/chat/actions";
import { useSocketStore } from "@/store/socket";
import type { Message } from "@/app/generated/prisma";

interface UseChatRoomProps {
  conversationId: string;
  senderId: string;
  receiverId: string;
  initialMessages: Message[];
}

export function useChatRoom({
  conversationId,
  senderId,
  receiverId,
  initialMessages,
}: UseChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const socket = useSocketStore((s) => s.socket);
  const connected = useSocketStore((s) => s.connected);
  const joinConversation = useSocketStore((s) => s.joinConversation);
  const leaveConversation = useSocketStore((s) => s.leaveConversation);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Join / Leave Room otomatis
  useEffect(() => {
    joinConversation(conversationId);
    return () => leaveConversation(conversationId);
  }, [conversationId, joinConversation, leaveConversation]);

  // Listener socket
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

  // Otomatis scroll ke bawah
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Fungsi kirim pesan
  const handleSend = async () => {
    if (!message.trim()) return;
    setIsLoading(true);

    const saved = await saveMessage({
      conversation_id: conversationId,
      sender_id: senderId,
      type: "TEXT",
      content: message,
      image_url: "",
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

    setMessage("");
    setIsLoading(false);
  };

  return {
    message,
    setMessage,
    messages,
    handleSend,
    isLoading,
    messagesEndRef,
  };
}
