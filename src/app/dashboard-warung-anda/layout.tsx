import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import ClientShopOwnerLayout from "./client-shop-owner-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return <ClientShopOwnerLayout>{children}</ClientShopOwnerLayout>;
}
