"use client";

import { IconChecks } from "@tabler/icons-react";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { getConversationMessages } from "./queries";
import { useChatRoom } from "@/hooks/use-chat-room";
import { formatToHour } from "@/helper/hour-helper";
import Link from "next/link";
import ChatInput from "./chat-input";

export default function ChatClient({
  conversation,
  sender_id,
}: {
  conversation: NonNullable<
    Awaited<ReturnType<typeof getConversationMessages>>
  >;
  sender_id: string;
}) {
  const { messages, handleSend, isLoading, messagesEndRef } = useChatRoom({
    conversationId: conversation.id,
    senderId: sender_id,
    initialMessages: conversation.messages,
  });

  return (
    <div className="">
      <div className="container mb-96 max-w-7xl mx-auto flex flex-col gap-4">
        {messages.map((msg) => {
          const isSender = msg.sender_id === sender_id;

          const renderMessage = () => {
            if (msg.type === "ORDER") {
              return (
                <div
                  className={`px-4 py-3 shadow rounded-xl max-w-[80%] ${
                    isSender
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p className="text-sm break-words">{msg.content}</p>
                  <Link
                    href={`/order/${msg.order_id}`}
                    className="flex justify-end text-sm underline underline-offset-2 mt-2"
                  >
                    Lihat Detail
                  </Link>
                </div>
              );
            }

            if (msg.type === "SYSTEM") {
              return (
                <>
                  <h1 className="mb-1 text-muted-foreground text-xs">
                    Dikirim oleh sistem
                  </h1>

                  {msg.media.length > 0 && (
                    <div
                      className={`max-w-[80%] flex ${
                        isSender ? "justify-end" : "justify-start"
                      } `}
                    >
                      {msg.media.map((media, idx) => (
                        <div key={`${msg.id}-${idx}`}>
                          <img
                            src={`/uploads/shop-qrcode/${media.url}`}
                            alt=""
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={`px-4 py-3 mt-1 rounded-xl shadow max-w-[80%] ${
                      isSender
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="text-sm break-words">{msg.content}</p>
                  </div>
                </>
              );
            }

            return (
              <div
                className={`px-4 py-3 rounded-xl shadow max-w-[80%] ${
                  isSender
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-sm break-words">{msg.content}</p>
              </div>
            );
          };

          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 ${
                isSender ? "items-end" : "items-start"
              }`}
            >
              {renderMessage()}

              <div
                className={`flex gap-1 mt-1 items-center text-xs text-muted-foreground ${
                  isSender ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <IconChecks
                  className={`w-4 h-4 ${
                    msg.is_read ? "text-blue-500" : "text-muted-foreground"
                  }`}
                />
                <span>
                  {formatDateToYYYYMMDD(msg.created_at)}{" "}
                  {formatToHour(msg.created_at)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Scroll Anchor */}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 w-full">
        <ChatInput conversation={conversation} sender_id={sender_id} />
      </div>
    </div>
  );
}
