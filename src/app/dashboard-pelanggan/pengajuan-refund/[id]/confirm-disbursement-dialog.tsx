"use client";

import { useState } from "react";
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
import { useMutation } from "@tanstack/react-query";
import { ConfirmRefundDisbursement } from "../actions";
import { toast } from "sonner";
import { IconLoader } from "@tabler/icons-react";

export default function ConfirmDisbursementDialog({
  refund_id,
}: {
  refund_id: string;
}) {
  const [open, setOpen] = useState(false);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async () => {
      return await ConfirmRefundDisbursement(refund_id);
    },
  });

  async function handleConfirm() {
    const result = await mutateAsync();

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result.error.message);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size={"lg"} variant={"success"}>
          Saya Sudah Menerima Dana
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Konfirmasi Penerimaan Dana Refund?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Dengan mengklik "Ya, Sudah Diterima", Anda menyatakan bahwa Anda
            telah berhasil menerima dana pengembalian dan menyetujui penutupan
            refund ini. Setelah dikonfirmasi, proses refund ini dianggap selesai
            sepenuhnya.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={"outline"} size={"lg"}>
              Belum Diterima
            </Button>
          </AlertDialogCancel>

          <Button
            onClick={handleConfirm}
            disabled={isPending}
            variant={"success"}
            size={"lg"}
          >
            {isPending ? (
              <IconLoader className="animate-spin" />
            ) : (
              "Ya, Sudah Diterima"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
