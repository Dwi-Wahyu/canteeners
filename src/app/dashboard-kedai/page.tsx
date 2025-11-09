import { auth } from "@/config/auth";
import UnauthorizedPage from "../_components/unauthorized-page";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  DollarSign,
  MessageCircleDashed,
} from "lucide-react";
import ToggleShopStatus from "./toggle-shop-status";
import { getShopDataAndRecentOrder } from "./owner-dashboard-queries";

import HomeRefundSection from "./home-refund-section";
import HomeOrderSection from "./home-order-section";
import HomeShopMetrics from "./home-shop-metrics";

export default async function OwnerDashboard() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const shop = await getShopDataAndRecentOrder(session.user.id);

  if (!shop) {
    return <UnauthorizedPage />;
  }

  return (
    <div>
      <h1 className="mb-4">
        Selamat Datang,{" "}
        <span className="font-semibold text-primary">{session.user.name}</span>
      </h1>

      <ToggleShopStatus
        id={shop.id}
        open_time={shop.open_time}
        close_time={shop.close_time}
        current_status={shop.status}
      />

      <HomeShopMetrics shop_id={shop.id} />

      <HomeOrderSection orders={shop.orders} />

      <HomeRefundSection shop_id={shop.id} />
    </div>
  );
}
