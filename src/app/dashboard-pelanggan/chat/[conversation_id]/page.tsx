"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ChatClient from "./chat-client";
import { Prisma } from "@/app/generated/prisma";

// Tipe untuk data pesan
type MessageWithSender = Prisma.MessageGetPayload<{
  include: { sender: { select: { id: true; name: true; avatar: true } } };
}>;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Tipe untuk data percakapan
interface ConversationData {
  id: number;
  otherParticipant: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  messages: MessageWithSender[];
}

export default async function ChatDetailCustomerPage({
  params,
}: {
  params: Promise<{ conversation_id: string }>;
}) {
  const session = await auth();
  const { conversation_id } = await params;

  if (!session || !session.user?.id) {
    return <UnauthorizedPage />;
  }

  // Validasi conversation_id
  const conversationId = parseInt(conversation_id);
  if (isNaN(conversationId)) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Obrolan</h1>
        <p className="text-red-500">ID percakapan tidak valid</p>
      </div>
    );
  }

  // Ambil data percakapan dan pesan
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: {
          user_id: session.user.id,
        },
      },
    },
    include: {
      participants: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { created_at: "asc" },
        take: 20, // Batasi jumlah pesan awal untuk efisiensi
      },
    },
  });

  if (!conversation) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Obrolan</h1>
        <p className="text-red-500">
          Percakapan tidak ditemukan atau Anda bukan peserta
        </p>
      </div>
    );
  }

  // Format data untuk client component
  const otherParticipant = conversation.participants.find(
    (p) => p.user.id !== session.user.id
  )?.user;
  const conversationData: ConversationData = {
    id: conversation.id,
    otherParticipant: {
      id: otherParticipant?.id || "",
      name: otherParticipant?.name || "Pemilik Warung",
      avatar: otherParticipant?.avatar,
    },
    messages: conversation.messages,
  };

  return (
    <div className="container mx-auto">
      <div className="flex mb-4 gap-2 items-center">
        <Avatar>
          <AvatarImage
            src={
              otherParticipant?.avatar ?? "/uploads/avatar/default-avatar.jpg"
            }
          />
          <AvatarFallback>{otherParticipant?.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <h1 className="text-xl font-bold ">
          {otherParticipant?.name || "Pemilik Warung"}
        </h1>
      </div>

      <Suspense fallback={<div className="text-center">Memuat pesan...</div>}>
        <ChatClient
          userId={session.user.id}
          userName={session.user.name || "Pengguna"}
          conversation={conversationData}
        />
      </Suspense>
    </div>
  );
}
