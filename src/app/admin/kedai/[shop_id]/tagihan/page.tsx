import AdminShopBillingClient from "./admin-shop-billing-client";

export default async function TagihanPage({
  params,
}: {
  params: Promise<{ shop_id: string }>;
}) {
  const { shop_id } = await params;

  return <AdminShopBillingClient shop_id={shop_id} />;
}
