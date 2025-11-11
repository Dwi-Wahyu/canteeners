"use client";

import { orderStatusMapping } from "@/constant/order-status-mapping";
import { getShopOrderDetail } from "../queries";

import CustomBadge from "@/components/custom-badge";
import { OrderStatus } from "@/app/generated/prisma";

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
  IconShoppingCartExclamation,
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
import { useEffect, useTransition } from "react";
import { notificationDialog } from "@/hooks/use-notification-dialog";
import {
  useSocket,
  useSocketSubscribeOrder,
  useSocketUnsubscribeOrder,
  useSocketUpdateOrder,
} from "@/hooks/use-socket";
import RejectOrderDialog from "./reject-order-dialog";
import { useRouter } from "nextjs-toploader/app";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CancelOrderDialog from "./cancel-order-dialog";

export default function ShopOrderDetailClient({
  order,
}: {
  order: NonNullable<Awaited<ReturnType<typeof getShopOrderDetail>>>;
}) {
  const [isPending, startTransition] = useTransition();
  const subscribeOrder = useSocketSubscribeOrder();
  const unsubscribeOrder = useSocketUnsubscribeOrder();
  const socket = useSocket();
  const router = useRouter();
  const socketOrderUpdate = useSocketUpdateOrder();

  async function handleCompleteOrder() {
    startTransition(async () => {
      const result = await CompleteOrder({
        conversation_id: order.conversation_id,
        order_id: order.id,
        owner_id: order.shop.owner_id,
      });

      if (result.success) {
        socketOrderUpdate(order.id);
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

  useEffect(() => {
    subscribeOrder(order.id);

    if (socket) {
      socket.onmessage = (event) => {
        let data: any;
        try {
          data = JSON.parse(event.data);
        } catch (error) {
          console.log(error);
          return;
        }
        if (data.type === "UPDATE_ORDER") {
          // toast.info("Status order diperbarui");
          router.refresh();
        }
      };
    }

    return () => {
      unsubscribeOrder(order.id);
    };
  }, [order.id, socket, subscribeOrder, unsubscribeOrder]);

  return (
    <div className="flex flex-col gap-2">
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
          destructiveValues={[OrderStatus.CANCELLED, OrderStatus.REJECTED]}
        >
          {orderStatusMapping[order.status]}
        </CustomBadge>
      </div>

      {order.status === "CANCELLED" &&
        order.cancelled_by_id === order.customer_id && (
          <Alert variant={"destructive"}>
            <IconShoppingCartExclamation />
            <AlertTitle>Pesanan Dibatalkan Oleh Pelanggan</AlertTitle>
            <AlertDescription>{order.rejected_reason}</AlertDescription>
          </Alert>
        )}

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

      {order.payment_method === "CASH" &&
        order.status === "WAITING_SHOP_CONFIRMATION" && (
          <div>
            <h1 className="font-semibold mb-1">Konfirmasi Pembayaran Tunai</h1>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <CancelOrderDialog
                order_id={order.id}
                order_status={order.status}
                user_id={order.shop.owner_id}
              />

              <ConfirmPaymentDialog
                conversation_id={order.conversation_id}
                order_id={order.id}
                owner_id={order.shop.owner_id}
              />
            </div>
          </div>
        )}

      {order.payment_method !== "CASH" && (
        <div>
          <h1 className="font-semibold mb-1">Bukti Pembayaran</h1>

          {!order.payment_proof_url ? (
            <div className="text-muted-foreground">
              Belum ada bukti pembayaran
            </div>
          ) : (
            <div>
              <img
                src={"/uploads/payment-proof/" + order.payment_proof_url}
                width={400}
                height={300}
                alt="payment proof"
              />

              {order.status === "WAITING_SHOP_CONFIRMATION" && (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <RejectPaymentDialog order_id={order.id} />
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
          status={order.status}
          prev_estimation={order.estimation}
          processed_at={order.processed_at}
          order_id={order.id}
        />
      )}

      <div>
        <h1 className="font-semibold">Jenis Order</h1>
        <div className="p-4 flex flex-col gap-1 rounded-lg border mt-1">
          {order.post_order_type === "DELIVERY_TO_TABLE" &&
          order.customer.customer_profile &&
          order.customer.customer_profile.floor &&
          order.customer.customer_profile.table_number ? (
            <div>
              <h1 className="font-medium">
                {postOrderTypeMapping[order.post_order_type]}
              </h1>

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
            </div>
          ) : (
            <div>
              <h1 className="font-medium">
                {postOrderTypeMapping[order.post_order_type]}
              </h1>

              <h1 className="text-sm text-muted-foreground">
                Pesanan diambil di kedai
              </h1>
            </div>
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
            <RejectOrderDialog order_id={order.id} />
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

      {order.status === "PROCESSING" && (
        <div className="mt-2 grid grid-cols-2 gap-4">
          <CancelOrderDialog
            order_id={order.id}
            order_status={order.status}
            user_id={order.shop.owner_id}
          />

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
