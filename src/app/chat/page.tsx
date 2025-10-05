import { auth } from "@/config/auth";
import UnauthorizedPage from "../_components/unauthorized-page";

export default async function ChatPage() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  return (
    <div className="container w-full min-h-screen">
      <div className="mx-auto max-w-7xl">
        <h1>Chat Masuk</h1>
      </div>
    </div>
  );
}
