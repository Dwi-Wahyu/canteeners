import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import CartPageClient from "./cart-page-client";
import BackButton from "@/app/_components/back-button";
import CustomerTopbar from "../customer-topbar";

export default async function CartPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="pt-14">
      <CustomerTopbar connected={false} subscribed={false} />

      {/* <h1 className="text-xl font-semibold mb-3">Keranjang Anda</h1> */}

      <CartPageClient userId={session.user.id} />
    </div>
  );
}
