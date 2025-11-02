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
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { TolakRefund } from "../actions";
import { toast } from "sonner";
import { IconLoader } from "@tabler/icons-react";

export default function TolakRefundDialog({ id }: { id: string }) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [open, setOpen] = useState(false);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async () => {
      return TolakRefund({ id, rejected_reason: rejectionReason });
    },
  });

  async function handleTolak() {
    const result = await mutateAsync();

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result.error.message);
      setOpen(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"lg"}>
          Tolak
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tolak Pengajuan Pengembalian Dana?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Tindakan ini akan menolak pengajuan refund. Pastikan Anda telah
            memeriksa semua bukti pendukung. Penolakan ini tidak dapat
            dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          <Textarea
            id="rejectionReason"
            placeholder="Masukkan alasan penolakan di sini"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
            required
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={"outline"} size={"lg"}>
              Batalkan
            </Button>
          </AlertDialogCancel>

          <Button
            onClick={handleTolak}
            disabled={rejectionReason.trim().length === 0 || isPending}
            variant={"destructive"}
            size={"lg"}
          >
            {isPending ? (
              <IconLoader className="animate-spin" />
            ) : (
              "Ya, Tolak Refund"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
