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
import { IconCash, IconEdit, IconNote, IconPencil } from "@tabler/icons-react";
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

export default function CustomerOrderDetailClient({
  order,
}: {
  order: NonNullable<Awaited<ReturnType<typeof getCustomerOrderDetail>>>;
}) {
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
          destructiveValues={[OrderStatus.CANCELLED]}
        >
          {orderStatusMapping[order.status]}
        </CustomBadge>
      </div>

      {order.status === "WAITING_SHOP_CONFIRMATION" &&
        order.payment_method === "CASH" && (
          <Alert variant="default">
            <IconCash />
            <AlertTitle>Order Diterima</AlertTitle>
            <AlertDescription>
              Silakan lakukan pembayaran di kedai
            </AlertDescription>
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

      <div>
        <h1 className="font-semibold">Metode Pembayaran</h1>
        <h1>{paymentMethodMapping[order.payment_method]}</h1>
      </div>

      {order.estimation && (
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="font-semibold">Estimasi</h1>
            <h1>{order.estimation} Menit</h1>
          </div>

          <OrderEstimationCountDown
            estimation={order.estimation}
            processed_at={order.processed_at}
          />
        </div>
      )}

      {order.payment_method !== "CASH" && (
        <div>
          <h1 className="font-semibold mb-1">Bukti Pembayaran</h1>

          {!order.payment_proof_url ? (
            <SendPaymentProofForm
              order_id={order.id}
              conversation_id={order.conversation_id}
              customer_id={order.customer_id}
            />
          ) : (
            <Image
              src={"/uploads/payment-proof/" + order.payment_proof_url}
              width={400}
              height={300}
              alt="payment proof"
            />
          )}
        </div>
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
                    url={`/dashboard-pelanggan/kantin/${order.shop.canteen.id}/pilih-meja`}
                    size="sm"
                  >
                    <IconEdit />
                    Pilih Ulang
                  </NavigationButton>
                </div>
              </>
            )}
        </div>
      </div>

      {!["COMPLETED", "CANCELLED"].includes(order.status) && (
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
