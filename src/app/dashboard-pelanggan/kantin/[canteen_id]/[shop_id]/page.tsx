import ShopProductList from "./shop-product-list";
import NotFoundResource from "@/app/_components/not-found-resource";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import { getShopDataWithPayment } from "@/app/admin/kedai/queries";
import { getCategories } from "@/app/admin/kategori/queries";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { getOrCreateCustomerCart } from "@/app/dashboard-pelanggan/keranjang/actions";
import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import { NavigationButton } from "@/app/_components/navigation-button";
import { IconMessageCircleUser } from "@tabler/icons-react";

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

  const customerCartId = await getOrCreateCustomerCart(session.user.id);

  return (
    <div>
      <TopbarWithBackButton
        title="Detail Kedai"
        backUrl={"/dashboard-pelanggan/kantin/" + canteen_id}
      />

      <ShopProductList
        shop={shop}
        categories={categories}
        cart_id={customerCartId}
      />
    </div>
  );
}
