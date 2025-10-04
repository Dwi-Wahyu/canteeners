import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import ClientCustomerLayout from "./client-customer-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return <ClientCustomerLayout>{children}</ClientCustomerLayout>;
}
