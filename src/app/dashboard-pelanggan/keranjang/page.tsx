import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import CartPageClient from "./cart-page-client";

export default async function CartPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Keranjang</h1>

      <CartPageClient userId={session.user.id} />
    </div>
  );
}
