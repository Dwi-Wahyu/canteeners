"use client";
import { IconChecks } from "@tabler/icons-react";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { getConversationMessages } from "./queries";
import { useChatRoom } from "@/hooks/use-chat-room";
import { formatToHour } from "@/helper/hour-helper";
import Link from "next/link";
import { Order } from "../generated/prisma";
import ChatInput from "./chat-input";

export default function ChatClient({
  conversation,
  sender_id,
  receiver_id,
  current_order,
}: {
  conversation: NonNullable<
    Awaited<ReturnType<typeof getConversationMessages>>
  >;
  sender_id: string;
  receiver_id: string;
  current_order?: Order;
}) {
  const {
    messages,
    message,
    setMessage,
    handleSend,
    isLoading,
    messagesEndRef,
  } = useChatRoom({
    conversationId: conversation.id,
    senderId: sender_id,
    initialMessages: conversation.messages,
  });

  return (
    <div className="mt-4">
      <div className="container mb-96 max-w-7xl mx-auto flex flex-col gap-4">
        {messages.map((msg) => {
          const isSender = msg.sender_id === sender_id;

          if (msg.type === "ORDER") {
            return (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 ${
                  isSender ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-3 shadow rounded-xl max-w-[80%] ${
                    isSender
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p className="text-sm break-words">{msg.content}</p>

                  <Link
                    className="flex justify-end text-sm underline underline-offset-2 mt-2"
                    href={"/order/" + msg.order_id}
                  >
                    Lihat Detail
                  </Link>
                </div>

                <div
                  className={`flex gap-1 items-center ${
                    isSender ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <IconChecks
                    className={`w-4 h-4 ${
                      msg.is_read ? "text-blue-500" : "text-muted-foreground"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {formatDateToYYYYMMDD(msg.created_at)}{" "}
                    {formatToHour(msg.created_at)}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 ${
                isSender ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-xl max-w-[80%] ${
                  isSender
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-sm break-words">{msg.content}</p>
              </div>

              <div
                className={`flex gap-1 items-center ${
                  isSender ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <IconChecks
                  className={`w-4 h-4 ${
                    msg.is_read ? "text-blue-500" : "text-muted-foreground"
                  }`}
                />
                <span className="text-xs text-muted-foreground">
                  {formatDateToYYYYMMDD(msg.created_at)}{" "}
                  {formatToHour(msg.created_at)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 w-full">
        <ChatInput conversation={conversation} sender_id={sender_id} />

        {/* <div className="container max-w-7xl mx-auto flex gap-2 items-end py-4 px-5 md:px-0">
          <ImageFilePickerDialog />

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="field-sizing-content max-h-30 min-h-0 resize-none py-1.75"
          />

          <Button
            size="icon"
            onClick={handleSend}
            disabled={isLoading || message.trim() === ""}
          >
            <IconSend />
          </Button>
        </div> */}
      </div>
    </div>
  );
}
