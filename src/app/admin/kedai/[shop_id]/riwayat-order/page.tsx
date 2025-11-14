import { OrderSearchParams } from "@/validations/search-params/order-search-params";
import { SearchParams } from "nuqs";
import { getShopOrders } from "./server-queries";
import ShopOrderHistoryTable from "./shop-order-history-table";

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function RiwayatOrderKedaiPage({
  searchParams,
  params,
}: {
  searchParams: Promise<SearchParams>;
  params: Promise<{ shop_id: string }>;
}) {
  const search = await searchParams;
  const parsed = OrderSearchParams.parse(search);

  const { shop_id } = await params;

  return (
    <div>
      <h1 className="font-semibold text-lg">Riwayat Order</h1>

      <ShopOrderHistoryTable shop_id={shop_id} input={parsed} />
    </div>
  );
}
