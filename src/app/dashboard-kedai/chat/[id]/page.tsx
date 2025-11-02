import LoadingUserSessionPage from "@/app/_components/loading-user-session-page";
import NotFoundResource from "@/app/_components/not-found-resource";
import { auth } from "@/config/auth";
import { getConversationMessages } from "@/app/chat/queries";
import DetailConversationClient from "@/app/chat/detail-conversation-client";
import { getOrderWaitingPayment } from "@/app/order/queries";

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

  const order_waiting_payment = await getOrderWaitingPayment(id);

  return (
    <DetailConversationClient
      conversation={conversation}
      sender_id={session.user.id}
      role={session.user.role}
      order_waiting_payment={order_waiting_payment}
    />
  );
}
