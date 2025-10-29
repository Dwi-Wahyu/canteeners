import ShopProductList from "./shop-product-list";
import NotFoundResource from "@/app/_components/not-found-resource";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import { getShopDataWithPayment } from "@/app/admin/kedai/queries";
import { getCategories } from "@/app/admin/kategori/queries";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BackButton from "@/app/_components/back-button";
import { getOrCreateCustomerCart } from "@/app/dashboard-pelanggan/keranjang/actions";

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
      <div className="mb-5 flex justify-between items-center">
        <BackButton url={"/dashboard-pelanggan/kantin/" + canteen_id} />

        <div>
          <Avatar className="size-9">
            <AvatarImage src={"/uploads/avatar/default-avatar.jpg"} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <ShopProductList
        shop={shop}
        categories={categories}
        customer_id={session.user.id}
        cart_id={customerCartId}
      />
    </div>
  );
}
