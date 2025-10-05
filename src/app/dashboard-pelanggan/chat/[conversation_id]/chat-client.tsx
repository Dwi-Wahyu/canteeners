"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { sendMessageAction } from "../actions";

// Tipe untuk data percakapan
interface ConversationData {
  id: number;
  otherParticipant: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  messages: {
    id: number;
    content: string | null;
    image_url: string | null;
    type: "PAYMENT_PROOF" | "SYSTEM" | "TEXT";
    created_at: string;
    sender: {
      id: string;
      name: string;
      avatar?: string | null;
    };
  }[];
}

interface ChatClientProps {
  userId: string;
  userName: string;
  conversation: ConversationData;
}

export default function ChatClient({
  userId,
  userName,
  conversation,
}: ChatClientProps) {
  const [messages, setMessages] = useState(conversation.messages);
  const [newMessage, setNewMessage] = useState("");

  async function handleSendMessage() {
    if (!newMessage.trim()) return;

    try {
      const result = await sendMessageAction({
        conversationId: conversation.id,
        senderId: userId,
        content: newMessage,
        type: "TEXT",
      });

      if (result.success) {
        setMessages((prev) => [...prev, result.data]);
        setNewMessage("");
      } else {
        alert(result.error.message);
      }
    } catch (error) {
      alert("Gagal mengirim pesan");
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Area Pesan */}
      <ScrollArea className="flex-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500">Belum ada pesan</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender.id === userId ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`flex items-start gap-2 max-w-[80%] ${
                  msg.sender.id === userId ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`p-3 rounded-lg border-2 ${
                    msg.sender.id === userId
                      ? "bg-secondary border-secondary text-secondary-foreground"
                      : "bg-transparent text-foreground"
                  }`}
                >
                  {msg.type === "SYSTEM" ? (
                    <p className="text-sm italic">{msg.content}</p>
                  ) : msg.type === "PAYMENT_PROOF" && msg.image_url ? (
                    <img
                      src={msg.image_url}
                      alt="Bukti pembayaran"
                      className="max-w-[150px] rounded"
                    />
                  ) : (
                    <p>{msg.content}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(msg.created_at), "PPPp", { locale: id })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ketik pesan..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <Button onClick={handleSendMessage} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
