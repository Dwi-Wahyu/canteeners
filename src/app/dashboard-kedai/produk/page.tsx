import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import ProductClientPage from "./product-client-page";
import UnauthorizedPage from "@/app/_components/unauthorized-page";

export default async function ProductPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "SHOP_OWNER") {
    return <UnauthorizedPage />;
  }

  return <ProductClientPage owner_id={session.user.id} />;
}
