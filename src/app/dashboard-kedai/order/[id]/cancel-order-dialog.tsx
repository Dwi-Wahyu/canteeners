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

import { CancelOrder } from "../actions";
import Link from "next/link";
import { notificationDialog } from "@/hooks/use-notification-dialog";
import { useSocketUpdateOrder } from "@/hooks/use-socket";

export default function CancelOrderDialog({
  order_id,
  user_id,
  order_status,
}: {
  order_id: string;
  user_id: string;
  order_status: OrderStatus;
}) {
  const [open, setOpen] = useState(false);

  const [reason, setReason] = useState("");

  const socketOrderUpdate = useSocketUpdateOrder();

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
      socketOrderUpdate(order_id);

      notificationDialog.success({
        title: "Aksi Berhasil",
        message: result.message,
      });
    } else {
      notificationDialog.error({
        title: "Terjadi Kesalahan",
        message: result.error.message,
      });
    }
  }

  const CUSTOMER_ALREADY_PAY = order_status === "PROCESSING";

  function CancelOrderDialogTitle() {
    if (CUSTOMER_ALREADY_PAY) {
      return "Peringatan!";
    }
    return "Yakin Membatalkan Order?";
  }

  function CancelOrderDialogDescription() {
    if (CUSTOMER_ALREADY_PAY) {
      return "Anda wajib untuk melakukan pengembalian dana. Berikan alasan pembatalan";
    }

    return "Berikan alasan pembatalan";
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size={"lg"} variant={"destructive"} className="w-full ">
          Batalkan Order
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle>{CancelOrderDialogTitle()}</AlertDialogTitle>
          <AlertDialogDescription>
            {CancelOrderDialogDescription()}
          </AlertDialogDescription>

          <Textarea
            disabled={isPending}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder=""
            className="h-40"
          />

          {CUSTOMER_ALREADY_PAY && (
            <div>
              <Link
                className="text-blue-500 underline underline-offset-2"
                href={"/syarat-dan-ketentuan"}
              >
                Baca syarat dan ketentuan
              </Link>
            </div>
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
  );
}
