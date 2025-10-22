import ConversationListClient from "@/app/chat/conversation-list-client";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await auth();

  if (!session) redirect("/auth/signin");

  return <ConversationListClient user_id={session.user.id} />;
}
