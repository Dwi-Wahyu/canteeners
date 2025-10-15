import { getOrderDetails } from "../queries";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { orderStatusMapping } from "@/constant/order-status-mapping";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { IconCheck, IconNote, IconX } from "@tabler/icons-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default async function OrderDetailsClient({
  data,
  user_id,
}: {
  data: NonNullable<Awaited<ReturnType<typeof getOrderDetails>>>;
  user_id: string;
}) {
  const userIsShopOwner = data.shop.owner_id === user_id;

  async function handleConfirmPembayaran() {}

  return (
    <div>
      <div className="text-center">
        <h1 className="font-semibold text-lg">Detail Order</h1>
        <h1 className="text-muted-foreground leading-tight mb-4">
          {formatDateToYYYYMMDD(data.created_at)}{" "}
          {formatToHour(data.created_at)}
        </h1>
      </div>

      <h1 className="font-semibold">Nama Kedai</h1>
      <h1>{data.shop.name}</h1>

      <Separator className="my-2" />

      <h1 className="font-semibold">Pelanggan</h1>
      <h1>{data.customer.name}</h1>

      <Separator className="my-2" />

      <h1 className="font-semibold">Metode Pembayaran</h1>
      <h1>{data.payment_method}</h1>

      <Separator className="my-2" />

      <h1 className="font-semibold">Status</h1>
      <Badge variant={"secondary"}>{orderStatusMapping[data.status]}</Badge>

      <Separator className="mt-3 mb-2" />

      <h1 className="font-semibold">Pesanan</h1>
      <div>
        {data.order_items.map((item, idx) => (
          <Item variant="muted" size="sm" className="mt-2" key={idx}>
            <ItemContent>
              <ItemTitle>{item.product.name}</ItemTitle>
              <ItemDescription>{item.quantity}x</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <IconNote />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.note ? item.note : "Tidak Ada Catatan"}</p>
                </TooltipContent>
              </Tooltip>
            </ItemActions>
          </Item>
        ))}
      </div>

      {data.status === "WAITING_SHOP_CONFIRMATION" && userIsShopOwner && (
        <div>
          <Separator className="mt-3 mb-2" />

          <h1 className="font-semibold">Pembayaran</h1>
          <h1 className="italic">
            Menunggu pemilik kedai konfirmasi pembayaran
          </h1>

          <div className="flex justify-center gap-3 mt-4">
            <Button variant={"destructive"}>
              <IconX />
              Tolak
            </Button>
            <Button>
              <IconCheck />
              Konfirmasi
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
