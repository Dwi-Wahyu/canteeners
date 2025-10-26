import { ToggleDarkMode } from "@/components/toggle-darkmode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getConversationMessages } from "@/app/chat/queries";
import ChatClient from "./chat-client";

export default function DetailConversationClient({
  conversation,
  sender_id,
  role,
}: {
  conversation: NonNullable<
    Awaited<ReturnType<typeof getConversationMessages>>
  >;
  sender_id: string;
  role: string;
}) {
  const backUrl =
    role === "CUSTOMER" ? "/dashboard-pelanggan/chat" : "/dashboard-kedai/chat";

  return (
    <div className="relative pt-14">
      <div className="w-full fixed z-30 left-0 top-0 bg-secondary shadow text-secondary-foreground">
        <div className="py-4 px-5 md:px-0 container max-w-7xl mx-auto flex justify-between items-center">
          <Button
            asChild
            className="rounded-full"
            size={"icon"}
            variant={"secondary"}
          >
            <Link href={backUrl}>
              <ChevronLeft />
            </Link>
          </Button>

          <div className="flex gap-2 items-center">
            <Avatar className="hidden md:block">
              <AvatarImage
                src={
                  conversation.participants[0].user.avatar ??
                  "default-avatar.jpg"
                }
              />
              <AvatarFallback>
                {conversation.participants[0].user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center">
              <h1 className="leading-tight font-semibold">
                {conversation.participants[0].user.name}
              </h1>
              <h1 className="text-xs leading-tight text-muted-foreground">
                {formatDateToYYYYMMDD(
                  conversation.participants[0].user.last_login
                )}{" "}
                {formatToHour(conversation.participants[0].user.last_login)}
              </h1>
            </div>
          </div>

          <div>
            <ToggleDarkMode />
          </div>
        </div>
      </div>

      <ChatClient conversation={conversation} sender_id={sender_id} />
    </div>
  );
}
