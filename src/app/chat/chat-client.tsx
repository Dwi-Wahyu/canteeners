"use client";

import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { IconChecks, IconSend } from "@tabler/icons-react";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { getConversationMessages } from "@/app/chat/queries";
import { saveMessage } from "@/app/chat/actions";
import {
  useIsSocketConnected,
  useJoinConversation,
  useLeaveConversation,
  useSocketInstance,
} from "@/store/use-socket-store";
import { Message } from "@/app/generated/prisma";

export default function ChatClient({
  conversation,
  sender_id,
  receiver_id,
}: {
  conversation: NonNullable<
    Awaited<ReturnType<typeof getConversationMessages>>
  >;
  sender_id: string;
  receiver_id: string;
}) {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>(conversation.messages);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const joinConversation = useJoinConversation();
  const leaveConversation = useLeaveConversation();
  const socketInstance = useSocketInstance();
  const isSocketConnected = useIsSocketConnected();

  const [isLoading, setIsLoading] = useState(false);

  async function handleSend() {
    setIsLoading(true);

    if (message.trim() === "") {
      setIsLoading(false);
      return;
    }

    const savedMessage = await saveMessage({
      conversation_id: conversation.id,
      sender_id,
      type: "TEXT",
      content: message,
      image_url: "",
    });

    if (!savedMessage.success) {
      toast.error(savedMessage.error.message);
      return;
    }

    if (!savedMessage.data) {
      toast.error(
        "Terjadi kesalahan saat menyimpan pesan, data pesan tidak dibuat di database"
      );
      return;
    }

    const messageData = savedMessage.data;

    // Ini memastikan pengirim melihat pesan segera tanpa menunggu server broadcast.
    setMessages((prev) => [...prev, messageData]);

    if (socketInstance && isSocketConnected && savedMessage.data) {
      socketInstance.emit(
        "send_message",
        {
          id: savedMessage.data.id,
          conversation_id: conversation.id,
          sender_id,
          receiver_id,
          content: savedMessage.data.content,
          image_url: savedMessage.data.image_url,
          type: savedMessage.data.type,
          created_at: savedMessage.data.created_at,
          is_read: savedMessage.data.is_read,
        },
        (response: any) => {
          console.log(response);
        }
      );
    }

    console.log("berhasil mengirim");
    setMessage("");

    setIsLoading(false);
  }

  // Effect untuk Join/Leave Room
  useEffect(() => {
    joinConversation(conversation.id);

    return () => {
      leaveConversation(conversation.id);
    };
  }, [conversation.id, joinConversation, leaveConversation]); // Tambahkan dependensi

  // Effect untuk Event Socket Listener
  useEffect(() => {
    if (!socketInstance || !isSocketConnected) {
      console.log("Socket instance belum tersedia, listener dilewati.");
      return; // Hentikan eksekusi jika socket belum siap
    }

    console.log("Socket instance tersedia, listener dijalankan.");

    const sendMessageHandler = (data: Message) => {
      console.log("Pesan diterima melalui socket");

      setMessages((prev) => {
        // Cek jika pesan dengan ID yang sama sudah ada (misalnya dari Optimistic Update)
        if (prev.some((msg) => msg.id === data.id)) {
          return prev;
        }

        // Tambahkan pesan jika ini adalah pesan baru dari klien lain
        return [...prev, data];
      });

      socketInstance?.emit("receive_message", conversation.id, data.id);
    };

    const receiveMessageHandler = (message_id: string) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message_id ? { ...msg, is_read: true } : msg
        )
      );
    };

    socketInstance?.on("receive_message", receiveMessageHandler);
    socketInstance?.on("send_message", sendMessageHandler);

    return () => {
      socketInstance?.off("receive_message", receiveMessageHandler);
      socketInstance?.off("send_message", sendMessageHandler);
    };
  }, [socketInstance, isSocketConnected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="mt-4">
      <div className="container mb-96 h-full max-w-7xl mx-auto flex flex-col gap-4 relative">
        {messages.map((message) => {
          const isSender = message.sender_id === sender_id;

          return (
            <div
              key={message.id}
              className={`flex flex-col gap-1 ${
                isSender ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-3 relative shadow max-w-[80%] rounded-xl ${
                  isSender
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-sm w-full break-words">{message.content}</p>
              </div>

              <div
                className={`flex gap-1 items-center ${
                  isSender ? `flex-row-reverse` : `flex-row`
                }`}
              >
                {message.is_read ? (
                  <div>
                    <IconChecks className={`w-4 h-4 text-blue-500`} />
                  </div>
                ) : (
                  <div>
                    <IconChecks className={`w-4 h-4`} />
                  </div>
                )}

                <h1 className="text-xs ml-1 text-muted-foreground">
                  {formatDateToYYYYMMDD(message.created_at)}{" "}
                  {formatToHour(message.created_at)}
                </h1>
              </div>
            </div>
          );
        })}
        {/* 6. Tambahkan elemen kosong sebagai target scroll */}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 w-full ">
        <div className="container max-w-7xl mx-auto flex gap-2 items-end py-4 px-5 md:px-0">
          <Button size="lg">
            <Image />
          </Button>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-secondary grow rounded-xl min-h-10 max-h-40"
          />
          <Button
            size="lg"
            onClick={() => handleSend()}
            disabled={isLoading || message.trim() === ""}
          >
            <IconSend />
          </Button>
        </div>
      </div>
    </div>
  );
}
