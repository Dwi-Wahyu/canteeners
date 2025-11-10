"use client";

import { orderStatusMapping } from "@/constant/order-status-mapping";

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
  IconCash,
  IconCashOff,
  IconCopy,
  IconCopyCheck,
  IconEdit,
  IconNote,
  IconShoppingCartExclamation,
} from "@tabler/icons-react";
import Image from "next/image";
import { paymentMethodMapping } from "@/constant/payment-method";
import { postOrderTypeMapping } from "@/constant/post-order-type-mapping";
import CustomerPositionBreadcrumb from "@/app/dashboard-pelanggan/keranjang/[shop_cart_id]/customer-position-breadcrumb";
import { NavigationButton } from "@/app/_components/navigation-button";
import { getCustomerOrderDetail } from "../queries";
import SendPaymentProofForm from "./send-payment-proof-form";
import OrderEstimationCountDown from "@/app/order/order-estimation-countdown";
import CancelOrderDialog from "./cancel-order-dialog";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { ConfirmEstimation } from "../actions";
import { notificationDialog } from "@/hooks/use-notification-dialog";
import { formatToHour } from "@/helper/hour-helper";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import {
  useSocket,
  useSocketSubscribeOrder,
  useSocketUnsubscribeOrder,
  useSocketUpdateOrder,
} from "@/hooks/use-socket";
import RejectEstimationDialog from "./reject-estimation-dialog";

export default function CustomerOrderDetailClient({
  order,
}: {
  order: NonNullable<Awaited<ReturnType<typeof getCustomerOrderDetail>>>;
}) {
  const router = useRouter();
  const socket = useSocket();

  const subscribeOrder = useSocketSubscribeOrder();
  const unsubscribeOrder = useSocketUnsubscribeOrder();
  const socketOrderUpdate = useSocketUpdateOrder();

  const [copied, setCopied] = useState(false);

  const confirmEstimationMutation = useMutation({
    mutationFn: async () => {
      return await ConfirmEstimation({
        order_id: order.id,
        payment_method: order.payment_method,
        conversation_id: order.conversation_id,
        owner_id: order.shop.owner_id,
        shop_id: order.shop_id,
      });
    },
    onSuccess(data) {
      if (data.success) {
        socketOrderUpdate(order.id);
        notificationDialog.success({
          title: "Berhasil konfirmasi estimasi",
          message: data.message,
          actionButtons: (
            <Button onClick={notificationDialog.hide} size={"lg"}>
              Tutup
            </Button>
          ),
        });
      } else {
        notificationDialog.error({
          title: "Terjadi Kesalahan",
          message: data.error.message,
        });
      }
    },
  });

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
            OrderStatus.WAITING_CUSTOMER_ESTIMATION_CONFIRMATION,
          ]}
          successValues={[OrderStatus.COMPLETED]}
          destructiveValues={[OrderStatus.CANCELLED, OrderStatus.REJECTED]}
        >
          {orderStatusMapping[order.status]}
        </CustomBadge>
      </div>

      {order.status === "REJECTED" && (
        <Alert variant={"destructive"}>
          <IconShoppingCartExclamation />
          <AlertTitle>Pesanan Ditolak</AlertTitle>
          <AlertDescription>{order.rejected_reason}</AlertDescription>
        </Alert>
      )}

      {order.status === "CANCELLED" &&
        order.cancelled_by_id === order.shop.owner_id && (
          <Alert variant={"destructive"}>
            <IconShoppingCartExclamation />
            <AlertTitle>Pesanan Dibatalkan Oleh Pemilik Kedai</AlertTitle>
            <AlertDescription>{order.cancelled_reason}</AlertDescription>
          </Alert>
        )}

      {order.status === "PAYMENT_REJECTED" && (
        <Alert variant={"destructive"}>
          <IconCashOff />
          <AlertTitle>Bukti Pembayaran Ditolak</AlertTitle>
          <AlertDescription>{order.rejected_reason}</AlertDescription>
        </Alert>
      )}

      {order.status === "WAITING_SHOP_CONFIRMATION" &&
        order.payment_method === "CASH" && (
          <Alert variant="default">
            <IconCash />
            <AlertTitle>Silakan lakukan pembayaran di kedai</AlertTitle>
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
                <ItemDescription>{item.price}</ItemDescription>
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

      {order.estimation && (
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="font-semibold">Estimasi</h1>
            <h1>{order.estimation} Menit</h1>
          </div>

          {order.status === "PROCESSING" && (
            <>
              <div>
                <h1 className="font-semibold">Diproses Pada</h1>
                <h1>{formatToHour(order.processed_at)}</h1>
              </div>

              <div>
                <h1 className="font-semibold">Sisa Waktu</h1>
                <OrderEstimationCountDown
                  estimation={order.estimation}
                  processed_at={order.processed_at}
                />
              </div>
            </>
          )}
        </div>
      )}

      <div>
        <h1 className="font-semibold">Metode Pembayaran</h1>
        <h1>{paymentMethodMapping[order.payment_method]}</h1>
      </div>

      {order.status === "WAITING_PAYMENT" &&
        order.payment_method === "BANK_TRANSFER" && (
          <div>
            <h1 className="font-semibold">Nomor Rekening</h1>

            <div className="flex gap-2 items-center">
              <h1>
                {
                  order.shop.payments.filter(
                    (payment) => payment.method === "BANK_TRANSFER"
                  )[0].account_number
                }
              </h1>

              <button
                onClick={() => {
                  const bankTransferPayment = order.shop.payments.filter(
                    (payment) => payment.method === "BANK_TRANSFER"
                  )[0]; // Ambil elemen pertama, bisa jadi undefined

                  const accountNumber =
                    bankTransferPayment?.account_number?.toString();

                  if (accountNumber) {
                    navigator.clipboard.writeText(accountNumber);
                    setCopied(true);
                  } else {
                    console.error("Nomor akun BANK_TRANSFER tidak ditemukan.");
                  }
                }}
              >
                {copied ? (
                  <IconCopyCheck className="w-4 h-4" />
                ) : (
                  <IconCopy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}

      {order.status === "WAITING_PAYMENT" &&
        order.payment_method === "QRIS" && (
          <div>
            <h1 className="font-semibold">QRCode QRIS</h1>
            <div>
              {order.shop.payments
                .filter((p) => p.method === "QRIS")
                .map((payment, idx) => (
                  <img
                    key={idx}
                    src={"/uploads/shop-qrcode/" + payment.qr_url}
                  />
                ))}
            </div>
          </div>
        )}

      {order.payment_method !== "CASH" &&
        ["WAITING_PAYMENT", "WAITING_SHOP_CONFIRMATION"].includes(
          order.status
        ) && (
          <div>
            <h1 className="font-semibold mb-1">Bukti Pembayaran</h1>

            {!order.payment_proof_url ? (
              <SendPaymentProofForm
                order_id={order.id}
                conversation_id={order.conversation_id}
                customer_id={order.customer_id}
              />
            ) : (
              <img
                src={"/uploads/payment-proof/" + order.payment_proof_url}
                width={400}
                height={300}
                alt="payment proof"
              />
            )}
          </div>
        )}

      {order.status === "PAYMENT_REJECTED" && (
        <div>
          <h1 className="font-semibold mb-1">Kirim Ulang Bukti Pembayaran</h1>

          <SendPaymentProofForm
            order_id={order.id}
            conversation_id={order.conversation_id}
            customer_id={order.customer_id}
          />
        </div>
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
                  url={`/dashboard-pelanggan/kantin/${order.shop.canteen.id}/pilih-meja`}
                  size="sm"
                >
                  <IconEdit />
                  Pilih Ulang
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

      {order.status === "WAITING_CUSTOMER_ESTIMATION_CONFIRMATION" && (
        <div className="mt-2">
          <h1 className="font-semibold">Konfirmasi Estimasi</h1>
          <h1 className="text-muted-foreground">Cek estimasi yang diberikan</h1>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <RejectEstimationDialog order_id={order.id} />

            <Button
              size={"lg"}
              onClick={() => confirmEstimationMutation.mutateAsync()}
              disabled={confirmEstimationMutation.isPending}
            >
              Konfirmasi
            </Button>
          </div>
        </div>
      )}

      {![
        "COMPLETED",
        "CANCELLED",
        "REJECTED",
        "WAITING_CUSTOMER_ESTIMATION_CONFIRMATION",
      ].includes(order.status) && (
        <CancelOrderDialog
          conversation_id={order.conversation_id}
          order_id={order.id}
          payment_method={order.payment_method}
          user_id={order.customer_id}
          order_status={order.status}
        />
      )}

      {/* {order.status !== "COMPLETED" && (
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
            
          </div>
        </div>
      )} */}
    </div>
  );
}
