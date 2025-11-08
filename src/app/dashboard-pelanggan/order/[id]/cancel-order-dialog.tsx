"use client";

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
import { Button } from "@/components/ui/button";
import { IconLoader } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { OrderStatus, PaymentMethod } from "@/app/generated/prisma";
import { Textarea } from "@/components/ui/textarea";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CancelOrder } from "../actions";
import { CheckedState } from "@radix-ui/react-checkbox";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import Link from "next/link";
import { notificationDialog } from "@/hooks/use-notification-dialog";

export default function CancelOrderDialog({
  conversation_id,
  order_id,
  user_id,
  payment_method,
  order_status,
}: {
  order_id: string;
  payment_method: PaymentMethod;
  user_id: string;
  conversation_id: string;
  order_status: OrderStatus;
}) {
  const [open, setOpen] = useState(false);

  const [reason, setReason] = useState("");
  const [createRefund, setCreateRefund] = useState<CheckedState>(false);
  const router = useRouter();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async () => {
      return await CancelOrder({
        order_id,
        cancelled_by_id: user_id,
        cancelled_reason: reason,
        order_status,
      });
    },
  });

  async function handleConfirm() {
    const result = await mutateAsync();

    if (result.success) {
      if (result.data?.suspended) {
        notificationDialog.error({
          title: "Anda telah disuspend",
          message:
            "Pembatalan order beruntun dalam sehari menyebabkan anda tidak dapat membuat pesanan sampai masa hukuman selesai",
          actionButtons: (
            <Button
              onClick={() => {
                notificationDialog.hide();
                router.push("/syarat-dan-ketentuan");
              }}
              variant={"outline"}
              size={"lg"}
            >
              Pelajari Selengkapnya
            </Button>
          ),
        });
      } else {
        notificationDialog.success({
          title: "Aksi Berhasil",
          message: result.message,
        });
      }

      if (createRefund) {
        router.push(`/dashboard-pelanggan/order/${order_id}/refund`);
      }
    } else {
      notificationDialog.error({
        title: "Terjadi Kesalahan",
        message: result.error.message,
      });
    }
  }

  const ORDER_CANCEL_WITHOUT_PAY =
    order_status === "WAITING_SHOP_CONFIRMATION" ||
    order_status === "WAITING_PAYMENT";

  function CancelOrderDialogTitle() {
    if (ORDER_CANCEL_WITHOUT_PAY) {
      return "Peringatan !";
    }
    return "Yakin Membatalkan Order?";
  }

  function CancelOrderDialogDescription() {
    if (ORDER_CANCEL_WITHOUT_PAY) {
      return "Pemilik kedai sedang menunggu pembayaran, pembatalan order akan dihitung sebagai pelanggaran.";
    }

    return "Berikan alasan pembatalan";
  }

  return (
    <div className="mt-2">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button size={"lg"} variant={"destructive"} className="w-full ">
            Batalkan Order
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{CancelOrderDialogTitle()}</AlertDialogTitle>
            <AlertDialogDescription>
              {CancelOrderDialogDescription()}
            </AlertDialogDescription>

            {ORDER_CANCEL_WITHOUT_PAY ? (
              <div>
                <Link
                  className="text-blue-500 underline underline-offset-2"
                  href={"/syarat-dan-ketentuan"}
                >
                  Baca syarat dan ketentuan
                </Link>
              </div>
            ) : (
              <div>
                <Textarea
                  disabled={isPending}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Contoh : Lewat estimasi"
                  className="h-40"
                />
              </div>
            )}

            {order_status !== "PENDING_CONFIRMATION" &&
              !ORDER_CANCEL_WITHOUT_PAY && (
                <Label className="mt-2 flex items-center gap-2">
                  <Checkbox
                    onCheckedChange={(checked) => setCreateRefund(checked)}
                  />
                  <p className="text-sm leading-none font-medium">
                    Bikin pengajuan refund
                  </p>
                </Label>
              )}
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-4">
            <AlertDialogCancel asChild>
              <Button size={"lg"} variant={"outline"}>
                Ga Jadi Deh
              </Button>
            </AlertDialogCancel>
            <Button
              size={"lg"}
              variant={"destructive"}
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending ? <IconLoader className="animate-spin" /> : "Yakin"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
