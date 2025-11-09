"use client";

import Image from "next/image";
import { getShopConversations, getShopOwner } from "../../server-queries";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { NavigationButton } from "@/app/_components/navigation-button";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";

export default function ShopConversationList({
  shop_id,
  shopOwner,
  conversations,
}: {
  shop_id: string;
  shopOwner: NonNullable<Awaited<ReturnType<typeof getShopOwner>>>;
  conversations: Awaited<ReturnType<typeof getShopConversations>>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {conversations.map((conversation, idx) => {
        const otherParticipant = conversation.participants[0].user;

        return (
          <Link
            key={idx}
            href={`/admin/kedai/${shop_id}/percakapan/${conversation.id}`}
          >
            <Item variant={"outline"}>
              <ItemMedia variant={"image"}>
                <Image
                  src={"/uploads/avatar/" + otherParticipant.avatar}
                  alt="customer avatar"
                  width={50}
                  height={50}
                />
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
                {conversation.messages.length > 0 && (
                  <ItemDescription>
                    {formatDateToYYYYMMDD(conversation.messages[0].created_at)}{" "}
                    {formatToHour(conversation.messages[0].created_at)}
                  </ItemDescription>
                )}
              </ItemActions>
            </Item>
          </Link>
        );
      })}
    </div>
  );
}
