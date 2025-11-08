"use client";

import { getUserAllConversations } from "./server-queries";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { IconChevronRight, IconFilter } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import LoadingConversationList from "./loading-conversation-list";
import EmptyConversationList from "./empty-conversation-list";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export default function ConversationListClient({
  user_id,
  role,
}: {
  user_id: string;
  role: "CUSTOMER" | "SHOP_OWNER";
}) {
  const { data, isLoading, isLoadingError, error } = useQuery({
    queryKey: ["conversation-list"],
    queryFn: async () => {
      return await getUserAllConversations(user_id);
    },
  });

  const conversationDetailLink =
    role === "CUSTOMER"
      ? "/dashboard-pelanggan/chat/"
      : "/dashboard-kedai/chat/";

  return (
    <div>
      <div className="mx-auto container">
        <h1 className="text-lg font-semibold mb-4">Pesan Masuk</h1>

        <Input className="w-full mb-4" placeholder="Cari Nama . . ." />

        {isLoading && <LoadingConversationList />}

        {!isLoading && isLoadingError && (
          <div>
            <h1>error</h1>
            {error.message}
          </div>
        )}

        {!isLoading && !isLoadingError && data && data.length === 0 && (
          <EmptyConversationList />
        )}

        {!isLoading && !isLoadingError && data && (
          <ScrollArea>
            <div className="flex flex-col gap-4">
              {data.map((conversation) => {
                const otherParticipant = conversation.participants[0].user;

                return (
                  <Link
                    key={conversation.id}
                    href={conversationDetailLink + conversation.id}
                  >
                    <Item variant={"outline"}>
                      <ItemMedia>
                        <Avatar className="size-10">
                          <AvatarImage
                            src={`/uploads/avatar/${otherParticipant.avatar}`}
                          />
                          <AvatarFallback>
                            {otherParticipant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{otherParticipant.name}</ItemTitle>
                        {conversation.messages.length > 0 && (
                          <ItemDescription>
                            {conversation.messages[0].text}
                          </ItemDescription>
                        )}
                      </ItemContent>
                      <ItemActions>
                        <div className="px-2 py-1 bg-primary text-primary-foreground rounded">
                          {conversation._count.messages}
                        </div>
                      </ItemActions>
                    </Item>
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
