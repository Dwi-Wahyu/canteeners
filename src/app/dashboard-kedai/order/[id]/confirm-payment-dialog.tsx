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
import { IconCheck } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ConfirmPayment } from "../actions";
import { useSocketUpdateOrder } from "@/hooks/use-socket";
import { notificationDialog } from "@/hooks/use-notification-dialog";

export default function ConfirmPaymentDialog({
  conversation_id,
  order_id,
  owner_id,
}: {
  order_id: string;
  conversation_id: string;
  owner_id: string;
}) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async () => {
      return await ConfirmPayment({
        conversation_id,
        order_id,
        owner_id,
      });
    },
  });
  const [open, setOpen] = useState(false);
  const socketOrderUpdate = useSocketUpdateOrder();

  async function handleConfirm() {
    const result = await mutateAsync();
    if (result.success) {
      socketOrderUpdate(order_id);
      notificationDialog.success({
        title: "Berhasil Konfirmasi Pembayaran",
        message: "Silakan mulai menyiapkan pesanan ini.",
        actionButtons: (
          <Button size={"lg"} onClick={notificationDialog.hide}>
            Tutup
          </Button>
        ),
      });
    } else {
      notificationDialog.error({
        title: "Gagal Konfirmasi Pembayaran",
        message: result.error.message || "Silakan coba lagi",
        actionButtons: (
          <Button size={"lg"} onClick={notificationDialog.hide}>
            Tutup
          </Button>
        ),
      });
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full" size={"lg"} disabled={false}>
          <IconCheck />
          Konfirmasi
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Pembayaran</AlertDialogTitle>
          <AlertDialogDescription>
            Pastikan anda mulai menyiapkan pesanan ini.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={"outline"} size={"lg"}>
              Batal
            </Button>
          </AlertDialogCancel>
          <Button size={"lg"} onClick={handleConfirm} disabled={isPending}>
            Konfirmasi Pembayaran
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
