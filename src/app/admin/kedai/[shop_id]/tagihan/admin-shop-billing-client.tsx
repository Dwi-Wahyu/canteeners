"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getShopBillings } from "./server-queries";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import {
  IconFileDollar,
  IconFileDollarFilled,
  IconReceipt,
} from "@tabler/icons-react";
import BackButton from "@/app/_components/back-button";
import GenerateShopBillingDialog from "./generate-shop-billing-dialog";

import { NavigationButton } from "@/app/_components/navigation-button";
import BillingItem from "./billing-item";

export default function AdminShopBillingClient({
  shop_id,
}: {
  shop_id: string;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-shop-billings", shop_id],
    queryFn: async () => {
      return await getShopBillings(shop_id);
    },
  });

  return (
    <div>
      {isLoading && <ShopBillingSkeleton />}

      {!isLoading && data && data.shopDataIncludeBillings && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <BackButton />

              <h1 className="font-semibold text-lg">
                Tagihan {data.shopDataIncludeBillings.name}
              </h1>
            </div>

            <div className="flex gap-2">
              <NavigationButton
                size="sm"
                url={`/admin/kedai/${shop_id}/riwayat-order`}
              >
                Lihat Riwayat Order
              </NavigationButton>
              <GenerateShopBillingDialog shop_id={shop_id} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <BillingCard
              title="Jumlah Order"
              amount={data.totalOrders.toString() || "0"}
              icon={<IconReceipt className="w-6 h-6" />}
              color="primary"
            />

            <BillingCard
              title="Transaksi Selesai"
              amount={data.completedOrders.toString() || "0"}
              icon={<IconReceipt className="w-6 h-6" />}
              color="accent"
            />

            <BillingCard
              title="Tagihan Telah Dibayar"
              amount="Rp 100000"
              icon={<IconFileDollarFilled className="w-6 h-6" />}
              color="success"
            />

            <BillingCard
              title="Tagihan Belum Dibayar"
              amount="Rp 2000000"
              icon={<IconFileDollar className="w-6 h-6" />}
              color="destructive"
            />
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {data.shopDataIncludeBillings.billings.map((billing, idx) => (
              <BillingItem shop_id={shop_id} billing={billing} key={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BillingCard({
  title,
  amount,
  icon,
  color,
}: {
  title: string;
  amount: string;
  icon: ReactNode;
  color: "primary" | "destructive" | "accent" | "success";
}) {
  return (
    <Card>
      <CardContent className="flex gap-4 justify-between items-center">
        <div>
          <h1 className="text-muted-foreground text-sm">{title}</h1>

          <h1 className="font-semibold">{amount}</h1>
        </div>

        <div
          className={`bg-${color} p-4 rounded-full text-${color}-foreground`}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function ShopBillingSkeleton() {
  return (
    <div>
      <div className="w-full mb-4 flex justify-between items-center">
        <Skeleton className="w-80 h-7" />
        <Skeleton className="w-40 h-7" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    </div>
  );
}
