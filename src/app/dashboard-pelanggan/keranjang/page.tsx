import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import CartPageClient from "./cart-page-client";

export default async function CartPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return <CartPageClient userId={session.user.id} />;
}
