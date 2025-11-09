"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BanknoteArrowDown, BanknoteArrowUp, DollarSign } from "lucide-react";
import { ReactNode } from "react";
import { getHomeShopMetrics } from "./server-queries";
import { Skeleton } from "@/components/ui/skeleton";

// nanti pakai startdate dan enddate untuk hitung profit

export default function HomeShopMetrics({ shop_id }: { shop_id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["get-home-shop-metrics", shop_id],
    queryFn: async () => {
      return await getHomeShopMetrics(shop_id);
    },
  });

  return (
    <div className="my-4 grid md:grid-cols-4 grid-cols-1 gap-4">
      {isLoading && (
        <>
          <Skeleton className="w-full h-40" />
          <Skeleton className="w-full h-40" />
          <Skeleton className="w-full h-40" />
        </>
      )}

      {!isLoading && data && (
        <>
          <DashboardCard
            icon={<DollarSign />}
            title="Laba Bersih"
            value={`Rp ` + data.profit.profit}
          />

          <DashboardCard
            icon={<DollarSign />}
            title="Laba Kotor"
            value={`Rp ` + data.profit.totalRevenue}
          />

          <DashboardCard
            icon={<BanknoteArrowUp />}
            title="Transaksi Selesai"
            value={data.orderCompleted.toString()}
          />

          <DashboardCard
            icon={<BanknoteArrowDown />}
            title="Transaksi Belum Selesai"
            value={data.orderNotCompleted.toString()}
          />
        </>
      )}
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
