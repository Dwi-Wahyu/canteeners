"use client";

import { useState, useTransition } from "react";

import {
  ConfirmOrder,
  RejectOrder,
  ConfirmPayment,
  RejectPayment,
  CompleteOrder,
} from "../actions";
import { getOrderDetails } from "../queries";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { IconCheck, IconNote, IconX } from "@tabler/icons-react";

import { orderStatusMapping } from "@/constant/order-status-mapping";
import { formatToHour } from "@/helper/hour-helper";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { paymentMethodMapping } from "@/constant/payment-method";
import { postOrderTypeMapping } from "@/constant/post-order-type-mapping";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";

export default function OrderDetailsClient({
  data,
  user_id,
  userIsShopOwner,
  userIsCustomer,
}: {
  data: NonNullable<Awaited<ReturnType<typeof getOrderDetails>>>;
  user_id: string;
  userIsShopOwner: boolean;
  userIsCustomer: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [openRejectOrder, setOpenRejectOrder] = useState(false);
  const [openConfirmPayment, setOpenConfirmPayment] = useState(false);
  const [openRejectPayment, setOpenRejectPayment] = useState(false);

  const [rejectOrderReason, setRejectOrderReason] = useState("");
  const [rejectPaymentReason, setRejectPaymentReason] = useState("");
  const [estimation, setEstimation] = useState<number | undefined>();

  const isPaymentMethodCash = data.payment_method === "CASH";

  async function handleConfirmOrder() {
    startTransition(async () => {
      const result = await ConfirmOrder({
        order_id: data.id,
        payment_method: data.payment_method,
        owner_id: user_id,
        conversation_id: data.conversation_id,
        shop_id: data.shop_id,
      });
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error.message);
      }
    });
  }

  async function handleRejectOrder() {
    startTransition(async () => {
      const result = await RejectOrder(data.id, rejectOrderReason);
      if (result.success) {
        toast.success(result.message);
        setOpenRejectOrder(false);
        router.refresh();
      } else {
        toast.error(result.error.message);
      }
    });
  }

  async function handleConfirmPayment() {
    if (!estimation || estimation <= 0) {
      toast.error("Estimasi waktu harus diisi dan lebih dari 0.");
      return;
    }

    startTransition(async () => {
      const result = await ConfirmPayment({
        order_id: data.id,
        estimation,
        conversation_id: data.conversation_id,
        owner_id: user_id,
      });
      if (result.success) {
        toast.success(result.message);
        setOpenConfirmPayment(false);
        router.refresh();
      } else {
        toast.error(result.error.message);
      }
    });
  }

  async function handleRejectPayment() {
    startTransition(async () => {
      const result = await RejectOrder(data.id, rejectPaymentReason);
      if (result.success) {
        toast.success(result.message);
        setOpenRejectPayment(false);
        router.refresh();
      } else {
        toast.error(result.error.message);
      }
    });
  }

  async function handleOrderCompleted() {
    startTransition(async () => {
      const result = await CompleteOrder({
        order_id: data.id,
        conversation_id: data.conversation_id,
        owner_id: user_id,
      });
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error.message);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h1 className="font-semibold">ID Order</h1>
        <h1 className="text-muted-foreground">{data.id}</h1>
      </div>

      <div>
        <h1 className="font-semibold">Dibuat Pada</h1>
        <h1 className="text-muted-foreground">
          {formatDateToYYYYMMDD(data.created_at)}{" "}
          {formatToHour(data.created_at)}
        </h1>
      </div>

      {userIsCustomer && (
        <div>
          <h1 className="font-semibold">Nama Kedai</h1>
          <h1 className="text-muted-foreground">{data.shop.name}</h1>
        </div>
      )}

      {userIsShopOwner && (
        <div>
          <h1 className="font-semibold">Pelanggan</h1>
          <h1 className="text-muted-foreground">{data.customer.name}</h1>
        </div>
      )}

      <div>
        <h1 className="font-semibold">Metode Pembayaran</h1>
        <h1 className="text-muted-foreground">
          {paymentMethodMapping[data.payment_method]}
        </h1>
      </div>

      <div>
        <h1 className="font-semibold">Status</h1>
        <Badge variant={"default"}>{orderStatusMapping[data.status]}</Badge>
      </div>

      {data.status === "PROCESSING" && (
        <>
          <div>
            <h1 className="font-semibold">Pesanan diproses pada</h1>
            <h1 className="text-muted-foreground">
              {formatToHour(data.processed_at)}
            </h1>
          </div>

          <div>
            <h1 className="font-semibold">Estimasi Waktu Tunggu</h1>
            <h1 className="text-muted-foreground">{data.estimation} Menit</h1>
          </div>
        </>
      )}

      <div>
        <h1 className="font-semibold">Pesanan</h1>
        {data.order_items.map((item, idx) => (
          <Item variant="outline" size="sm" className="mt-1" key={idx}>
            <ItemContent>
              <ItemTitle>{item.product.name}</ItemTitle>
              <ItemDescription>{item.quantity}x</ItemDescription>

              {item.note && (
                <div className="text-muted-foreground flex gap-1 items-center">
                  <IconNote className="w-4 h-4" />

                  {item.note}
                </div>
              )}
            </ItemContent>
          </Item>
        ))}
      </div>

      <div>
        <h1 className="font-semibold mt-1">
          {postOrderTypeMapping[data.post_order_type]}
        </h1>
        <div className="border p-4 rounded mt-1">
          <h1>Lantai {data.floor} </h1>
          <h1>Meja Nomor {data.table_number}</h1>
        </div>
      </div>

      {data.status === "PROCESSING" && userIsShopOwner && (
        <div className="mt-3 flex gap-3 flex-col">
          <Button className="w-full py-6" variant={"outline"}>
            Ubah Estimasi
          </Button>

          <Button
            className="w-full py-6"
            onClick={handleOrderCompleted}
            disabled={isPending}
          >
            <IconCheck />
            Order Selesai
          </Button>
        </div>
      )}

      {data.status === "PENDING_CONFIRMATION" && userIsShopOwner && (
        <div>
          <Separator className="mt-3 mb-2" />
          <h1 className="font-semibold">Konfirmasi Order</h1>
          <h1 className="text-muted-foreground">
            Pilih terima atau tolak pesanan ini, pastikan stok atau bahan
            tersedia.
          </h1>
          <div className="flex flex-col gap-3 mt-4">
            <AlertDialog
              open={openRejectOrder}
              onOpenChange={setOpenRejectOrder}
            >
              <AlertDialogTrigger asChild>
                <Button
                  size={"lg"}
                  variant={"destructive"}
                  disabled={isPending}
                  className="w-full "
                >
                  <IconX />
                  Tolak
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Anda Yakin Menolak Pesanan Ini?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Berikan alasan untuk menolak pesanan (Opsional).
                  </AlertDialogDescription>
                  <Input
                    value={rejectOrderReason}
                    onChange={(e) => setRejectOrderReason(e.target.value)}
                    placeholder="Contoh: Maaf, stok kami belum tersedia."
                    disabled={isPending}
                  />
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <Button
                    size={"sm"}
                    variant={"destructive"}
                    onClick={handleRejectOrder}
                    disabled={isPending}
                  >
                    Tolak Pesanan
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              size={"lg"}
              onClick={handleConfirmOrder}
              disabled={isPending}
              className="w-full "
            >
              <IconCheck />
              Konfirmasi
            </Button>
          </div>
        </div>
      )}

      {data.status === "WAITING_PAYMENT" &&
        !isPaymentMethodCash &&
        userIsCustomer && (
          <div>
            <Separator className="mt-3 mb-2" />
            <h1 className="font-semibold">Pembayaran</h1>
            <h1 className="text-sm">Silakan kirim bukti pembayaran</h1>

            {/* Todo: Bikin input gambar */}
          </div>
        )}

      {data.status === "WAITING_SHOP_CONFIRMATION" && userIsShopOwner && (
        <div>
          <Separator className="mt-3 mb-2" />
          <h1 className="font-semibold">Konfirmasi Pembayaran</h1>

          <h1 className="text-sm">
            {!isPaymentMethodCash
              ? "Pelanggan telah mengunggah bukti pembayaran. Silakan periksa dan konfirmasi atau tolak."
              : "Konfirmasi pelanggan telah melakukan pembayaran"}
          </h1>

          {data.payment_proof_url && (
            <img
              src={"/uploads/payment-proof/" + data.payment_proof_url}
              alt=""
            />
          )}

          <div className="flex flex-col gap-3 mt-4">
            <AlertDialog
              open={openRejectPayment}
              onOpenChange={setOpenRejectPayment}
            >
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full py-6"
                  variant={"destructive"}
                  disabled={isPending}
                >
                  <IconX />
                  Tolak
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Yakin Menolak Pembayaran Ini?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Pelanggan akan diminta untuk mengirimkan kembali bukti
                    pembayaran
                  </AlertDialogDescription>
                  <Input
                    value={rejectPaymentReason}
                    onChange={(e) => setRejectPaymentReason(e.target.value)}
                    placeholder="Alasan"
                    className="mt-1"
                    disabled={isPending}
                  />
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <Button
                    size={"sm"}
                    variant={"destructive"}
                    onClick={handleRejectPayment}
                    disabled={isPending}
                  >
                    Tolak
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog
              open={openConfirmPayment}
              onOpenChange={setOpenConfirmPayment}
            >
              <AlertDialogTrigger asChild>
                <Button className="w-full py-6" disabled={isPending}>
                  <IconCheck />
                  Konfirmasi
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Pembayaran</AlertDialogTitle>
                  <AlertDialogDescription>
                    Masukkan estimasi waktu penyiapan pesanan dalam menit.
                  </AlertDialogDescription>
                  <div className="grid gap-2 pt-2">
                    <Label htmlFor="estimation">Estimasi Waktu (menit)</Label>
                    <Input
                      id="estimation"
                      type="number"
                      placeholder="Contoh: 15"
                      value={estimation ?? ""}
                      onChange={(e) => setEstimation(parseInt(e.target.value))}
                      disabled={isPending}
                    />
                  </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <Button
                    size={"sm"}
                    onClick={handleConfirmPayment}
                    disabled={isPending}
                  >
                    Konfirmasi Pembayaran
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  );
}
