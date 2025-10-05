import LoadingUserSessionPage from "@/app/_components/loading-user-session-page";
import NotFoundResource from "@/app/_components/not-found-resource";
import { ToggleDarkMode } from "@/components/toggle-darkmode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/config/auth";
import {
  formatDateToYYYYMMDD,
  formatDateWithoutYear,
} from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import { prisma } from "@/lib/prisma";
import { IconSend } from "@tabler/icons-react";
import { ChevronLeft, Image } from "lucide-react";
import { getConversationMessages } from "../queries";
import Link from "next/link";

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

  if (isNaN(parseInt(id))) {
    return <NotFoundResource />;
  }

  const conversation = await getConversationMessages(
    session.user.id,
    parseInt(id)
  );

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

      <div className="container h-full max-w-7xl mx-auto flex flex-col gap-4 relative">
        {conversation.messages.map((message) => {
          const isSender = message.sender_id === session.user.id;

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
          <Textarea className="bg-secondary grow rounded-xl min-h-10 max-h-40" />
          <Button size="lg">
            <IconSend />
          </Button>
        </div>
      </div>
    </div>
  );
}
