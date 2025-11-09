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

      <div className="my-4 grid md:grid-cols-4 grid-cols-1 gap-4">
        <DashboardCard
          icon={<DollarSign />}
          title="Keuntungan"
          value="24.000"
        />

        <DashboardCard
          icon={<BanknoteArrowDown />}
          title="Transaksi Belum Selesai"
          value="3"
        />

        <DashboardCard
          icon={<BanknoteArrowUp />}
          title="Transaksi Selesai"
          value="10"
        />

        <DashboardCard
          icon={<MessageCircleDashed />}
          title="Pesan Belum Dibaca"
          value="23"
        />
      </div>

      <HomeOrderSection orders={shop.orders} />

      <HomeRefundSection shop_id={shop.id} />
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <Card className="bg-gradient-to-t from-card to-card/10">
      <CardContent className="flex justify-between items-center">
        <div>
          <CardTitle>{title}</CardTitle>

          <h1 className="mt-2 text-lg font-semibold">{value}</h1>
        </div>

        {icon}
      </CardContent>
    </Card>
  );
}
