import LoadingUserSessionPage from "@/app/_components/loading-user-session-page";
import NotFoundResource from "@/app/_components/not-found-resource";
import { auth } from "@/config/auth";
import { getConversationMessages } from "@/app/chat/queries";
import DetailConversationClient from "@/app/chat/detail-conversation-client";

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
    <DetailConversationClient
      conversation={conversation}
      sender_id={session.user.id}
    />
  );
}
