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
import { OrderStatus } from "@/app/generated/prisma";
import { Textarea } from "@/components/ui/textarea";

import { RejectEstimation } from "../actions";
import { notificationDialog } from "@/hooks/use-notification-dialog";
import { useSocketUpdateOrder } from "@/hooks/use-socket";

export default function RejectEstimationDialog({
  order_id,
}: {
  order_id: string;
}) {
  const [open, setOpen] = useState(false);

  const [reason, setReason] = useState("");

  const socketOrderUpdate = useSocketUpdateOrder();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async () => {
      return await RejectEstimation({
        order_id,
        rejected_reason: reason,
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

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size={"lg"} variant={"destructive"} className="w-full ">
          Tolak Estimasi
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Yakin Menolak Estimasi ?</AlertDialogTitle>
          <AlertDialogDescription>
            Berikan alasan penolakan agar pemilik kedai akan menyesuaikan
            estimasi.
          </AlertDialogDescription>

          <Textarea
            disabled={isPending}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder=""
            className="h-40"
          />
        </AlertDialogHeader>
        <AlertDialogFooter className="grid grid-cols-2 gap-4">
          <AlertDialogCancel asChild>
            <Button size={"lg"} variant={"outline"}>
              Batal
            </Button>
          </AlertDialogCancel>
          <Button
            size={"lg"}
            variant={"destructive"}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? <IconLoader className="animate-spin" /> : "Tolak"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
