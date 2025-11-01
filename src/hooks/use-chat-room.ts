import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { saveMessage } from "@/app/chat/actions";

import {
  Prisma,
  Message,
  MessageMedia,
  MessageType,
  MediaMimeType,
} from "@/app/generated/prisma";

type MessageWithMedia = Prisma.MessageGetPayload<{
  include: { media: true };
}>;

// enum MessageTypeEnum {
//   TEXT = "TEXT",
//   SYSTEM = "SYSTEM",
//   ORDER = "ORDER",
//   PAYMENT_PROOF = "PAYMENT_PROOF",
// }

// enum MediaMimeTypeEnum {
//   IMAGE_JPEG = "image/jpeg",
//   IMAGE_PNG = "image/png",
// }

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
  const [messages, setMessages] = useState<MessageWithMedia[]>(initialMessages);
  const [text, setText] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSend = async (type: MessageType, order_id?: string) => {
    if (!text.trim()) return;
    setIsLoading(true);

    const saved = await saveMessage({
      conversation_id: conversationId,
      sender_id: senderId,
      type,
      content: text,
      media,
      order_id,
    });

    if (!saved.success || !saved.data) {
      toast.error("Gagal menyimpan pesan");
      setIsLoading(false);
      return;
    }

    const newMessage = saved.data;
    setMessages((prev) => [...prev, newMessage]);

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
