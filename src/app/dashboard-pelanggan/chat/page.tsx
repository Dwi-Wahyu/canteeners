"use client";

import { Suspense, useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { IconChecks, IconFilter } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getUserAllConversations } from "@/app/chat/server-queries";
import { useSession } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";
import { Skeleton } from "@/components/ui/skeleton";

type ReturnTypeConversations = Awaited<
  ReturnType<typeof getUserAllConversations>
>;

export default function ChatPage() {
  const session = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<ReturnTypeConversations>(
    []
  );

  useEffect(() => {
    if (session.data) {
      setIsLoading(true);
      getUserAllConversations(session.data.user.id)
        .then((res) => {
          setConversations(res);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [session.data]);

  if (session.status === "loading") {
    return (
      <div>
        <div className="mx-auto container">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Pesan Masuk</h1>

            <Button>
              <IconFilter />
            </Button>
          </div>

          <Input className="w-full mb-4" placeholder="Cari Nama . . ." />
        </div>
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    router.push("/auth/signin");
    return;
  }

  return (
    <div className="mx-auto container">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Pesan Masuk</h1>

        <Button>
          <IconFilter />
        </Button>
      </div>

      <Input className="w-full mb-4" placeholder="Cari Nama . . ." />

      <ScrollArea>
        {isLoading && (
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
          </div>
        )}

        {!isLoading && conversations.length === 0 && (
          <div className="text-center flex-col p-4 border rounded-xl flex justify-center gap-2 items-center text-muted-foreground">
            <h1 className="font-semibold">Percakapan Masih Kosong</h1>

            <h1 className="text-sm">
              Percakapan yang lebih dari satu bulan akan dihapus secara
              otomatis. Silakan buat order untuk memulai percakapan baru.
            </h1>

            <Button className="mt-2" variant={"outline"}>
              <Link href={"/dashboard-pelanggan"}>Buat Order Sekarang</Link>
            </Button>
          </div>
        )}

        {!isLoading && conversations.length > 0 && (
          <div className="flex flex-col">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                // className="flex mb-4 items-center justify-between px-4 py-3 rounded-xl shadow-xs border border-card bg-card"
                className="bg-card hover:bg-secondary border border-secondary rounded-lg px-4 py-3 mb-4 flex items-center justify-between"
                href={"/dashboard-pelanggan/chat/" + conversation.id}
              >
                <div className="flex gap-2 items-center">
                  <Avatar>
                    <AvatarImage
                      src={`/uploads/avatar/${conversation.participants[0].user.avatar}`}
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

                {conversation._count.messages > 0 && (
                  <Badge>{conversation._count.messages}</Badge>
                )}

                {conversation.messages.length > 0 && (
                  <>
                    {conversation.messages[conversation.messages.length - 1]
                      .is_read && (
                      <IconChecks
                        className={`w-4 h-4 ${
                          conversation.messages[
                            conversation.messages.length - 1
                          ].is_read
                            ? "text-blue-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    )}
                  </>
                )}
              </Link>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
