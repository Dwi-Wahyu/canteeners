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
import { Input } from "@/components/ui/input";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";

export default function RejectPaymentDialog() {
  const [rejectPaymentReason, setRejectPaymentReason] = useState("");
  const [open, setOpen] = useState(false);

  function handleReject() {}

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="w-full"
          variant={"destructive"}
          disabled={false}
          size={"lg"}
        >
          <IconX />
          Tolak
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Yakin Menolak Pembayaran Ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Pelanggan akan diminta untuk mengirimkan kembali bukti pembayaran
          </AlertDialogDescription>
          <Input
            value={rejectPaymentReason}
            onChange={(e) => setRejectPaymentReason(e.target.value)}
            placeholder="Alasan"
            className="mt-1"
            disabled={false}
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={"outline"} size={"lg"}>
              Batal
            </Button>
          </AlertDialogCancel>
          <Button
            size={"lg"}
            variant={"destructive"}
            onClick={handleReject}
            disabled={false}
          >
            Tolak
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
