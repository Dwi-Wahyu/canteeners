import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import ClientAdminLayout from "./client-admin-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }
  return (
    <div className="relative">
      <ClientAdminLayout>{children}</ClientAdminLayout>
    </div>
  );
}
