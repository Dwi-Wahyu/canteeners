"use client";

import { useState, useTransition } from "react";

import {
  confirmOrder,
  rejectOrder,
  confirmPayment,
  rejectPayment,
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";

export default function OrderDetailsClient({
  data,
  user_id,
}: {
  data: NonNullable<Awaited<ReturnType<typeof getOrderDetails>>>;
  user_id: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const userIsShopOwner = data.shop.owner_id === user_id;
  const userIsCustomer = data.customer_id === user_id;

  const [openRejectOrder, setOpenRejectOrder] = useState(false);
  const [openConfirmPayment, setOpenConfirmPayment] = useState(false);
  const [openRejectPayment, setOpenRejectPayment] = useState(false);

  const [rejectOrderReason, setRejectOrderReason] = useState("");
  const [rejectPaymentReason, setRejectPaymentReason] = useState("");
  const [estimation, setEstimation] = useState<number | undefined>();

  const isPaymentMethodCash = data.payment_method === "CASH";

  async function handleConfirmOrder() {
    startTransition(async () => {
      const result = await confirmOrder(data.id, data.payment_method);
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
      const result = await rejectOrder(data.id, rejectOrderReason);
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
      const result = await confirmPayment(data.id, estimation);
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
      const result = await rejectPayment(data.id, rejectPaymentReason);
      if (result.success) {
        toast.success(result.message);
        setOpenRejectPayment(false);
        router.refresh();
      } else {
        toast.error(result.error.message);
      }
    });
  }

  return (
    <div>
      <div className="text-center">
        <h1 className="font-semibold text-lg">Detail Order</h1>
        <h1 className="text-muted-foreground leading-tight mb-4">
          {formatDateToYYYYMMDD(data.created_at)}{" "}
          {formatToHour(data.created_at)}
        </h1>
      </div>

      <h1>ID Order</h1>
      <h1 className="text-sm text-muted-foreground">{data.id}</h1>
      <Separator className="my-2" />
      {userIsCustomer && (
        <>
          <h1>Nama Kedai</h1>
          <h1 className="text-sm text-muted-foreground">{data.shop.name}</h1>
          <Separator className="my-2" />
        </>
      )}
      {userIsShopOwner && (
        <>
          <h1>Pelanggan</h1>
          <h1 className="text-sm text-muted-foreground">
            {data.customer.name}
          </h1>

          <Separator className="my-2" />
        </>
      )}
      <h1>Metode Pembayaran</h1>
      <h1 className="text-sm text-muted-foreground">{data.payment_method}</h1>
      <Separator className="my-2" />
      <h1>Status</h1>
      <Badge variant={"default"}>{orderStatusMapping[data.status]}</Badge>
      <Separator className="mt-3 mb-2" />

      {data.status === "PROCESSING" && (
        <>
          <h1>Pesanan diproses pada</h1>
          <h1 className="text-sm text-muted-foreground">
            {formatToHour(data.processed_at)}
          </h1>
          <Separator className="my-2" />
          <h1>Estimasi Waktu Tunggu</h1>
          <h1 className="text-sm text-muted-foreground">
            {data.estimation} Menit
          </h1>
          <Separator className="my-2" />
        </>
      )}

      <h1>Pesanan</h1>
      <div>
        {data.order_items.map((item, idx) => (
          <Item variant="outline" size="sm" className="mt-2" key={idx}>
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

      {data.status === "COMPLETED" && userIsCustomer && (
        <div>
          <Separator className="mt-3 mb-2" />
          <h1>Pesanan selesai</h1>
          <h1 className="text-sm">
            Pesanan anda telah selesai, silakan hubungi pemilik kedai
          </h1>
        </div>
      )}

      {data.status === "PROCESSING" && userIsShopOwner && (
        <div>
          <Separator className="mt-3 mb-2" />
          <h1>Pesanan selesai</h1>
          <h1 className="text-sm text-muted-foreground">
            Tandai pesanan ini telah selesai
          </h1>

          <div className="flex gap-2 items-center justify-center mt-2">
            <Button size={"sm"} variant={"outline"}>
              Ubah Estimasi
            </Button>

            <Button size={"sm"}>
              <IconCheck />
              Tandai Selesai
            </Button>
          </div>
        </div>
      )}

      {data.status === "PENDING_CONFIRMATION" && userIsShopOwner && (
        <div>
          <Separator className="mt-3 mb-2" />
          <h1 className="font-semibold">Konfirmasi Order</h1>
          <h1 className="italic">
            Pilih terima atau tolak pesanan ini, pastikan stok atau bahan
            tersedia.
          </h1>
          <div className="flex justify-center gap-3 mt-4">
            <AlertDialog
              open={openRejectOrder}
              onOpenChange={setOpenRejectOrder}
            >
              <AlertDialogTrigger asChild>
                <Button
                  size={"sm"}
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
              size={"sm"}
              onClick={handleConfirmOrder}
              disabled={isPending}
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
          <div className="flex justify-center gap-3 mt-4">
            <AlertDialog
              open={openRejectPayment}
              onOpenChange={setOpenRejectPayment}
            >
              <AlertDialogTrigger asChild>
                <Button
                  size={"sm"}
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
                <Button size={"sm"} disabled={isPending}>
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
