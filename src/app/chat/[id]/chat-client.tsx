import { Button } from "@/components/ui/button";
import { getConversationMessages } from "../queries";
import { Image } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { IconSend } from "@tabler/icons-react";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "../actions";
import { toast } from "sonner";

export default function ChatClient({
  conversation,
  sender_id,
}: {
  conversation: NonNullable<
    Awaited<ReturnType<typeof getConversationMessages>>
  >;
  sender_id: string;
}) {
  useEffect(() => {
    socket.connect();

    socket.emit("join_conversation", conversation.id);

    socket.on("refresh_messages", (convId) => {
      if (convId === conversation.id) {
        console.log("🔁 Pesan baru! Fetch ulang data...");
      }
    });

    return () => {
      socket.off("refresh_messages");
      socket.disconnect();
    };
  }, [conversation.id]);

  const [message, setMessage] = useState("");

  const mutation = useMutation({
    mutationFn: sendMessage,
  });

  async function handleSend() {
    if (message === "") {
      return;
    }

    const sent = await mutation.mutateAsync({
      conversation_id: conversation.id,
      sender_id,
      content: message,
    });

    if (sent.success) {
      toast.success("Berhasil mengirim pesan");
    } else {
      toast.error("Terjadi kesalahan");
    }
  }

  return (
    <div>
      <div className="container h-full max-w-7xl mx-auto flex flex-col gap-4 relative">
        {conversation.messages.map((message) => {
          const isSender = message.sender_id === sender_id;

          return (
            <div
              key={message.id}
              className={`flex flex-col gap-1 ${
                isSender ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`p-4 relative max-w-[80%] rounded-xl ${
                  isSender
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-sm w-full break-words">{message.content}</p>
              </div>

              <h1 className="text-xs ml-1 text-muted-foreground">
                {formatDateToYYYYMMDD(message.created_at)}{" "}
                {formatToHour(message.created_at)}
              </h1>
            </div>
          );
        })}
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
            disabled={mutation.isPending}
          />
          <Button size="lg" onClick={handleSend} disabled={mutation.isPending}>
            <IconSend />
          </Button>
        </div>
      </div>
    </div>
  );
}
