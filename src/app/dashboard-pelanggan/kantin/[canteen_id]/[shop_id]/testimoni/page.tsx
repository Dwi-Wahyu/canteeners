import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import ShopTestimonyDisplayClient from "./shop-testimony-display-client";

export default async function ShopTestimonyDisplayPage({
  params,
}: {
  params: Promise<{ shop_id: string }>;
}) {
  const { shop_id } = await params;

  return (
    <div>
      <TopbarWithBackButton title="Testimoni Kedai" />

      <ShopTestimonyDisplayClient shop_id={shop_id} />
    </div>
  );
}
