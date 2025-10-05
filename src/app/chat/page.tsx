import { auth } from "@/config/auth";
import UnauthorizedPage from "../_components/unauthorized-page";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { IconFilter } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function ChatPage() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          user_id: session.user.id,
        },
      },
    },
    include: {
      participants: {
        where: {
          user_id: {
            not: session.user.id,
          },
        },
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          created_at: "desc",
        },
        take: 1,
      },
    },
  });

  return (
    <div className="p-5 w-full">
      <div className="mx-auto container">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Pesan Masuk</h1>

          <Button>
            <IconFilter />
          </Button>
        </div>

        <Input className="w-full mb-4" placeholder="Cari Nama . . ." />

        <ScrollArea>
          <Suspense fallback={<div>Memuat pesan . . .</div>}>
            <div className="flex flex-col gap-4">
              {conversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  className="flex mb-4 items-center justify-between px-4 py-3 rounded-xl shadow-xs border border-secondary hover:bg-secondary"
                  href={"/chat/" + conversation.id}
                >
                  <div className="flex gap-2 items-center">
                    <Avatar>
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

                    <div className="">
                      <h1 className="leading-tight">
                        {conversation.participants[0].user.name}
                      </h1>
                      {conversation.messages.length > 0 && (
                        <h1 className="text-sm text-muted-foreground">
                          {conversation.messages[0].content}
                        </h1>
                      )}
                    </div>
                  </div>

                  <Badge>4</Badge>
                </Link>
              ))}
            </div>
          </Suspense>
        </ScrollArea>
      </div>
    </div>
  );
}
