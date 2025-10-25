import ShopProductList from "./shop-product-list";
import NotFoundResource from "@/app/_components/not-found-resource";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import { getShopDataWithPayment } from "@/app/admin/kedai/queries";
import { getCategories } from "@/app/admin/kategori/queries";
import UnauthorizedPage from "@/app/_components/unauthorized-page";

export default async function ShopDetailsPage({
  params,
}: {
  params: Promise<{ shop_id: string; canteen_id: string }>;
}) {
  const { shop_id, canteen_id } = await params;

  const session = await auth();

  const shop = await getShopDataWithPayment(shop_id);

  const categories = await getCategories();

  if (isNaN(parseInt(canteen_id))) {
    return <NotFoundResource title="Kantin Tidak Ditemukan" />;
  }

  if (!shop) {
    return <NotFoundResource title="Kedai Tidak Ditemukan" />;
  }

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "CUSTOMER") {
    return <UnauthorizedPage />;
  }

  return (
    <ShopProductList
      shop={shop}
      categories={categories}
      avatar={session.user.avatar}
      canteen_id={parseInt(canteen_id)}
      customer_id={session.user.id}
    />
  );
}
