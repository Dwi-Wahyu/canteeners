import ShopProductList from "./shop-product-list";
import NotFoundResource from "@/app/_components/not-found-resource";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import { getShopDataWithPayment } from "@/app/admin/kedai/queries";
import BackButton from "@/app/_components/back-button";

export default async function ShopDetailsPage({
  params,
}: {
  params: Promise<{ shop_id: string }>;
}) {
  const { shop_id } = await params;

  const session = await auth();

  const shop = await getShopDataWithPayment(shop_id);

  const isLoggedIn =
    (session && new Date(session.expires) > new Date()) || false;

  if (!shop) {
    return <NotFoundResource title="Warung Tidak Ditemukan" />;
  }

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="">
      <div className="mb-2 flex justify-between items-center">
        <BackButton />
      </div>

      <ShopProductList
        shop={shop}
        isLoggedIn={isLoggedIn}
        customerId={session.user.id}
      />
    </div>
  );
}
