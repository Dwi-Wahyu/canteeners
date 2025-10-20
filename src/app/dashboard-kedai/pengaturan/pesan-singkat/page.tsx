import { prisma } from "@/lib/prisma";
import QuickChatForm from "./quick-chat-form";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";

import { IconMessageQuestion } from "@tabler/icons-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { QuickChatItem } from "./quick-chat-item";
import BackButton from "@/app/_components/back-button";

export default async function QuickChatPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const quickChats = await prisma.quickChat.findMany({
    where: {
      user_id: session.user.id,
    },
  });

  return (
    <div>
      <BackButton url="/dashboard-kedai/pengaturan" />

      <div className="flex justify-between items-center mt-4">
        <h1 className="font-semibold text-lg">Pesan Singkat</h1>

        <QuickChatForm user_id={session.user.id} />
      </div>

      {quickChats.length === 0 && (
        <Empty className="border mt-5">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconMessageQuestion />
            </EmptyMedia>
            <EmptyTitle>Belum ada data</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}

      {quickChats.map((chat) => (
        <QuickChatItem chat={chat} key={chat.id} />
      ))}
    </div>
  );
}
