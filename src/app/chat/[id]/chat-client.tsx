import { getConversationMessages } from "../queries";

export default function ChatClient({
  conversations,
}: {
  conversations: NonNullable<
    Awaited<ReturnType<typeof getConversationMessages>>
  >;
}) {
  return (
    <div>
      <h1>ini chat client</h1>
    </div>
  );
}
