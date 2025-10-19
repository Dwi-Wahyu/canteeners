"use client";

import { QuickChat } from "@/app/generated/prisma";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useState } from "react";
import { deleteQuickChat } from "../actions";
import { IconMessage, IconTrash } from "@tabler/icons-react";
import { Loader } from "lucide-react";

export function QuickChatItem({ chat }: { chat: QuickChat }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(id: number) {
    setDeleting(true);
    await deleteQuickChat(id);
    setDeleting(false);
  }

  return (
    <Item key={chat.id} variant={"outline"} className="mt-4">
      <ItemMedia>
        <IconMessage />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{chat.message}</ItemTitle>
      </ItemContent>
      <ItemActions
        className="cursor-pointer"
        onClick={() => handleDelete(chat.id)}
      >
        {deleting ? (
          <Loader className="animate-spin" />
        ) : (
          <IconTrash className="w-5 h-5" />
        )}
      </ItemActions>
    </Item>
  );
}
