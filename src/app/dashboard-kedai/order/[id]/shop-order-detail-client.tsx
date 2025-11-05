"use client";

import { orderStatusMapping } from "@/constant/order-status-mapping";
import { getShopOrderDetail } from "../queries";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CustomBadge from "@/components/custom-badge";
import { OrderStatus } from "@/app/generated/prisma";
import { formatDateWithoutYear } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  IconLoader,
  IconMap,
  IconNote,
  IconPencil,
  IconUserDollar,
} from "@tabler/icons-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { paymentMethodMapping } from "@/constant/payment-method";
import { postOrderTypeMapping } from "@/constant/post-order-type-mapping";
import CustomerPositionBreadcrumb from "@/app/dashboard-pelanggan/keranjang/[shop_cart_id]/customer-position-breadcrumb";
import { NavigationButton } from "@/app/_components/navigation-button";
import ConfirmOrderDialog from "./confirm-order-dialog";
import ConfirmPaymentDialog from "./confirm-payment-dialog";
import RejectPaymentDialog from "./reject-payment-dialog";
import OrderEstimationSection from "./order-estimation-section";
import { CompleteOrder, ConfirmPayment } from "../actions";
import { toast } from "sonner";
import { useTransition } from "react";
import { notificationDialog } from "@/hooks/use-notification-dialog";

export default function ShopOrderDetailClient({
  order,
}: {
  order: NonNullable<Awaited<ReturnType<typeof getShopOrderDetail>>>;
}) {
  const [isPending, startTransition] = useTransition();

  async function handleCompleteOrder() {
    startTransition(async () => {
      const result = await CompleteOrder({
        conversation_id: order.conversation_id,
        order_id: order.id,
        owner_id: order.shop.owner_id,
      });

      if (result.success) {
        notificationDialog.success({
          title: "Order Telah Selesai !",
          message: "Terima kasih sudah bekerja sama dengan canteeners 😊🙏",
        });
      } else {
        notificationDialog.error({
          title: "Gagal Mengubah Status",
          message: "Silakan hubungi CS",
        });
      }
    });
  }

  async function handleConfirmPayment() {
    startTransition(async () => {
      const result = await ConfirmPayment({
        conversation_id: order.conversation_id,
        order_id: order.id,
        owner_id: order.shop.owner_id,
      });

      if (result.success) {
        notificationDialog.success({
          title: "Pembayaran Berhasil Dikonfirmasi",
          message: "Mohon kerjakan pesanan sekarang juga",
        });
      } else {
        notificationDialog.error({
          title: "Pembayaran Gagal Dikonfirmasi",
          message: "Silakan hubungi CS",
        });
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h1 className="font-semibold mb-1">Pelanggan</h1>
        <div className="flex gap-2 items-center">
          <Avatar className="size-10">
            <AvatarImage
              src={`/uploads/avatar/` + order.customer.avatar}
              alt="Hallie Richards"
            />
            <AvatarFallback className="text-xs">HR</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold">{order.customer.name}</h1>
            <h1 className="">
              {formatDateWithoutYear(order.created_at)}{" "}
              {formatToHour(order.created_at)}
            </h1>
          </div>
        </div>
      </div>

      <div>
        <h1 className="font-semibold">Status</h1>

        <CustomBadge
          value={order.status}
          outlineValues={[
            OrderStatus.WAITING_SHOP_CONFIRMATION,
            OrderStatus.WAITING_PAYMENT,
            OrderStatus.PENDING_CONFIRMATION,
          ]}
          successValues={[OrderStatus.COMPLETED]}
          destructiveValues={[OrderStatus.CANCELLED]}
        >
          {orderStatusMapping[order.status]}
        </CustomBadge>
      </div>

      <div>
        <h1 className="font-semibold mb-1">Pesanan</h1>

        <div className="flex flex-col gap-2">
          {order.order_items.map((item, idx) => (
            <Item key={idx} variant={"outline"}>
              <ItemMedia variant={"image"}>
                <Image
                  src={"/uploads/product/" + item.product.image_url}
                  width={100}
                  height={100}
                  alt="product image"
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{item.product.name}</ItemTitle>
                <ItemDescription>
                  {item.price} + {item.quantity * 1000}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <h1 className="text-lg font-semibold mr-1">{item.quantity}x</h1>
              </ItemActions>
              {item.note && (
                <ItemFooter className="flex gap-2 justify-start">
                  <IconNote className="w-4 h-4" />
                  <h1>{item.note}</h1>
                </ItemFooter>
              )}
            </Item>
          ))}
        </div>
      </div>

      <div>
        <h1 className="font-semibold">Total Harga</h1>
        <h1>{order.total_price}</h1>
      </div>

      <div>
        <h1 className="font-semibold">Metode Pembayaran</h1>
        <h1>{paymentMethodMapping[order.payment_method]}</h1>
      </div>

      {order.payment_method !== "CASH" && (
        <div>
          <h1 className="font-semibold mb-1">Bukti Pembayaran</h1>

          {!order.payment_proof_url ? (
            <div className="text-muted-foreground">
              Belum ada bukti pembayaran
            </div>
          ) : (
            <div>
              <Image
                src={"/uploads/payment-proof/" + order.payment_proof_url}
                width={400}
                height={300}
                alt="payment proof"
              />

              {order.status === "WAITING_SHOP_CONFIRMATION" && (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <RejectPaymentDialog />
                  <ConfirmPaymentDialog
                    conversation_id={order.conversation_id}
                    order_id={order.id}
                    owner_id={order.shop.owner_id}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {order.estimation && (
        <OrderEstimationSection
          prev_estimation={order.estimation}
          processed_at={order.processed_at}
          order_id={order.id}
        />
      )}

      <div>
        <h1 className="font-semibold">Jenis Order</h1>
        <div className="p-4 flex flex-col gap-1 rounded-lg border mt-1">
          <h1>{postOrderTypeMapping[order.post_order_type]}</h1>
          {order.post_order_type === "DELIVERY_TO_TABLE" &&
            order.customer.customer_profile &&
            order.customer.customer_profile.floor &&
            order.customer.customer_profile.table_number && (
              <>
                <CustomerPositionBreadcrumb
                  canteen_name={order.shop.canteen.name}
                  floor={order.customer.customer_profile.floor}
                  table_number={order.customer.customer_profile.table_number}
                />
                <div className="mt-1">
                  <NavigationButton
                    url={`/kantin/${order.shop.canteen.id}/denah`}
                    size="sm"
                  >
                    <IconMap />
                    Lihat Denah
                  </NavigationButton>
                </div>
              </>
            )}
        </div>
      </div>

      {order.status === "PENDING_CONFIRMATION" && (
        <div>
          <h1 className="font-semibold">Konfirmasi Order</h1>
          <h1 className="text-muted-foreground">
            Pilih terima atau tolak pesanan ini, pastikan stok atau bahan
            tersedia.
          </h1>

          <div className="grid grid-cols-2 mt-2 gap-4">
            <Button size={"lg"} variant={"destructive"}>
              Tolak
            </Button>
            <ConfirmOrderDialog
              conversation_id={order.conversation_id}
              order_id={order.id}
              owner_id={order.shop.owner_id}
              payment_method={order.payment_method}
              shop_id={order.shop_id}
            />
          </div>
        </div>
      )}

      {order.status === "WAITING_SHOP_CONFIRMATION" && (
        <div className="mt-2 flex flex-col gap-4">
          <Button
            size={"lg"}
            onClick={handleConfirmPayment}
            disabled={isPending}
          >
            {isPending ? (
              <IconLoader className="animate-spin" />
            ) : (
              <>
                <IconUserDollar />
                Konfirmasi Pembayaran
              </>
            )}
          </Button>

          <Button variant={"destructive"} size={"lg"}>
            Batalkan Order
          </Button>
        </div>
      )}

      {order.status === "PROCESSING" && (
        <div className="mt-2 grid grid-cols-2 gap-4">
          <Button variant={"destructive"} size={"lg"}>
            Batalkan Order
          </Button>

          <Button
            size={"lg"}
            onClick={handleCompleteOrder}
            disabled={isPending}
          >
            {isPending ? (
              <IconLoader className="animate-spin" />
            ) : (
              "Pesanan Selesai"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
