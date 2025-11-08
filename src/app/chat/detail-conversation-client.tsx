"use client";

import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";

import { getConversationMessages } from "@/app/chat/queries";
import { getOrderWaitingPayment } from "../order/queries";

import { IconChecks } from "@tabler/icons-react";
import { useChatRoom } from "@/hooks/use-chat-room";
import ChatInput from "./chat-input";
import OrderChatBubble from "./order-chat-bubble";
import DetailConversationTopbar from "./detail-conversation-topbar";
import { useQuery } from "@tanstack/react-query";
import { getUserQuickChats } from "./server-queries";

export default function DetailConversationClient({
  conversation,
  sender_id,
  role,
  order_waiting_payment,
}: {
  conversation: NonNullable<
    Awaited<ReturnType<typeof getConversationMessages>>
  >;
  sender_id: string;
  role: string;
  order_waiting_payment: Awaited<ReturnType<typeof getOrderWaitingPayment>>;
}) {
  const { messages, messagesEndRef } = useChatRoom({
    conversationId: conversation.id,
    senderId: sender_id,
    initialMessages: conversation.messages,
  });

  const { data, isPending } = useQuery({
    queryKey: ["user-quick-chats", sender_id],
    queryFn: async () => {
      return await getUserQuickChats(sender_id);
    },
  });

  return (
    <div className="relative pt-4">
      <DetailConversationTopbar
        avatar={conversation.participants[0].user.avatar}
        name={conversation.participants[0].user.name}
        last_login={conversation.participants[0].user.last_login}
        role={role}
      />

      <div className="">
        <div className="container mb-96 max-w-7xl mx-auto flex flex-col gap-4">
          {messages.map((msg) => {
            const isSender = msg.sender_id === sender_id;

            const renderMessage = () => {
              if (msg.type === "ORDER") {
                if (msg.order_id) {
                  return (
                    <OrderChatBubble
                      order_id={msg.order_id}
                      isSender={isSender}
                      role={role}
                    />
                  );
                }

                // Todo: handle ketika order id tidak ada
                return (
                  <div>
                    <h1>Order baru</h1>
                  </div>
                );
              }

              if (msg.type === "PAYMENT_PROOF") {
                return (
                  <>
                    <h1 className="text-muted-foreground text-xs">
                      Bukti pembayaran
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
                              src={`/uploads/payment-proof/${media.url}`}
                              alt=""
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.text && (
                      <div
                        className={`px-4 py-3 mt-1 rounded-xl shadow max-w-[80%] ${
                          isSender
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        <p className="text-sm break-words">{msg.text}</p>
                      </div>
                    )}
                  </>
                );
              }

              if (msg.type === "SYSTEM") {
                return (
                  <>
                    <h1 className="text-muted-foreground text-xs">
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
                      <p className="text-sm break-words">{msg.text}</p>
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
                  <p className="text-sm break-words">{msg.text}</p>
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
          <ChatInput
            conversation={conversation}
            sender_id={sender_id}
            order_waiting_payment={order_waiting_payment}
            is_pending_quick_chat={isPending}
            quick_chats={data}
          />
        </div>
      </div>
    </div>
  );
}
