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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import {
  IconChevronRight,
  IconInvoice,
  IconMessage,
  IconReceipt,
} from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { orderStatusMapping } from "@/constant/order-status-mapping";
import { Button } from "@/components/ui/button";

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
        currentStatus={shop.status}
        open_time={shop.open_time}
        close_time={shop.close_time}
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

      {/* <Card>
        <CardContent>
          <h1 className="text-lg font-semibold">Order Masuk</h1>
        </CardContent>
      </Card> */}

      <div className="mt-5">
        <h1 className="text-lg font-semibold mb-3">Order Masuk</h1>

        {shop.orders.map((order, idx) => {
          return (
            <Item
              key={idx}
              variant="outline"
              className="mt-2 relative shadow rounded-lg"
            >
              <Badge
                className="-top-3 -right-2 absolute"
                variant={
                  ["REJECTED", "PAYMENT_REJECTED"].includes(order.status)
                    ? "destructive"
                    : "default"
                }
              >
                {orderStatusMapping[order.status]}
              </Badge>

              <ItemContent>
                <ItemTitle>{order.customer.name}</ItemTitle>
                <ItemDescription>
                  {formatDateToYYYYMMDD(order.created_at)}{" "}
                  {formatToHour(order.created_at)}
                </ItemDescription>
              </ItemContent>
              <ItemActions className="mt-2">
                <Button asChild variant={"outline"} size={"icon"}>
                  <Link href={"/order/" + order.id}>
                    <IconReceipt />
                  </Link>
                </Button>
              </ItemActions>
            </Item>
          );
        })}
      </div>
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
