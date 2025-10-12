import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import ClientOwnerLayout from "./client-owner-layout";

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
    <ClientOwnerLayout userId={session.user.id} role={session.user.role}>
      {children}
    </ClientOwnerLayout>
  );
}
