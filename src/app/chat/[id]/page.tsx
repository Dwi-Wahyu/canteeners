import LoadingUserSessionPage from "@/app/_components/loading-user-session-page";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { useSession } from "next-auth/react";

export default function ConversationPage() {
  const session = useSession();

  if (session.status === "loading") {
    return <LoadingUserSessionPage />;
  }

  if (!session.data) {
    return <UnauthorizedPage />;
  }

  return (
    <div>
      <h1>ini chat anda</h1>
    </div>
  );
}
