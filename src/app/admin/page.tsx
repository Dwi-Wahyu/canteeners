import { auth } from "@/config/auth";
import UnauthorizedPage from "../_components/unauthorized-page";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  return (
    <div>
      <h1 className="mb-4 font-semibold text-xl">
        Selamat Datang, {session.user.name}
      </h1>
    </div>
  );
}
