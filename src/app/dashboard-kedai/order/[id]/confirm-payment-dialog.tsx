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
import { toast } from "sonner";

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

  async function handleConfirm() {
    const result = await mutateAsync();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error.message);
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
