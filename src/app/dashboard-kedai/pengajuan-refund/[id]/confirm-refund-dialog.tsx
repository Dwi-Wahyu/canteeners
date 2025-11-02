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
import { SetujuiRefund } from "../actions";
import { toast } from "sonner";
import { IconLoader } from "@tabler/icons-react";
import { PaymentMethod } from "@/app/generated/prisma";

export default function ConfirmRefundDialog({
  id,
  order_payment_method,
}: {
  id: string;
  order_payment_method: PaymentMethod;
}) {
  const [open, setOpen] = useState(false);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async () => {
      return SetujuiRefund({ id });
    },
  });

  async function handleConfirm() {
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
        <Button size={"lg"}>Konfirmasi Refund</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Setuju Konfirmasi Pengajuan Refund?
          </AlertDialogTitle>

          {order_payment_method === "CASH" ? (
            <AlertDialogDescription>
              Anda akan menyetujui pengajuan refund ini dan memproses
              pengembalian dana. Konfirmasi ini menandakan Anda siap memberikan
              uang tunai kepada pelanggan. Pelanggan akan diinformasikan untuk
              mengambil/menerima pengembalian dana tunai.
            </AlertDialogDescription>
          ) : (
            <AlertDialogDescription>
              Anda akan menyetujui pengajuan refund ini dan memproses
              pengembalian dana. Setelah konfirmasi, Anda bertanggung jawab
              untuk melakukan transfer pengembalian dana. Pastikan dana yang
              dikembalikan sudah benar.
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={"outline"} size={"lg"}>
              Tinjau Ulang
            </Button>
          </AlertDialogCancel>

          <Button onClick={handleConfirm} size={"lg"} disabled={isPending}>
            {isPending ? (
              <IconLoader className="animate-spin" />
            ) : (
              "Ya, Setujui & Proses Refund"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
