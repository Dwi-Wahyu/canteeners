"use client";

import { getShopPayments } from "./queries";

export default function ShopPaymentMethodClient({
  data,
}: {
  data: Awaited<ReturnType<typeof getShopPayments>>;
}) {
  return <div className="flex flex-col gap-4"></div>;
}
