export default async function UpdateShopPayments({
  params,
}: {
  params: Promise<{ shop_id: string; payment_id: string }>;
}) {
  const { payment_id, shop_id } = await params;

  return (
    <div>
      <h1></h1>
    </div>
  );
}
