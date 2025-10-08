import LoadingUserSessionPage from "@/app/_components/loading-user-session-page";
import NotFoundResource from "@/app/_components/not-found-resource";
import { ToggleDarkMode } from "@/components/toggle-darkmode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { auth } from "@/config/auth";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import { ChevronLeft, Image } from "lucide-react";
import { getConversationMessages } from "../queries";
import Link from "next/link";
import ChatClient from "./chat-client";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    return <LoadingUserSessionPage />;
  }

  const { id } = await params;

  const conversation = await getConversationMessages(session.user.id, id);

  if (!conversation) {
    return <NotFoundResource />;
  }

  return (
    <div className="relative min-h-screen pt-24 px-5">
      <div className="w-full fixed left-0 top-0 bg-secondary shadow text-secondary-foreground">
        <div className="py-4 px-5 md:px-0 container max-w-7xl mx-auto flex justify-between items-center">
          <Button
            asChild
            className="rounded-full"
            size={"icon"}
            variant={"outline"}
          >
            <Link href={"/chat"}>
              <ChevronLeft />
            </Link>
          </Button>

          <div className="flex gap-2 items-center">
            <Avatar className="hidden md:block">
              <AvatarImage
                src={
                  conversation.participants[0].user.avatar ??
                  "/uploads/avatar/default-avatar.jpg"
                }
              />
              <AvatarFallback>
                {conversation.participants[0].user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
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

      <ChatClient conversation={conversation} sender_id={session.user.id} />
    </div>
  );
}
