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
import {
  SendDisbursementProof,
  SetujuiRefund,
  uploadDisbursementProofImage,
} from "../actions";
import { toast } from "sonner";
import { IconLoader } from "@tabler/icons-react";
import { AlertDescription } from "@/components/ui/alert";
import { FileUploadImage } from "@/app/_components/file-upload-image";

export default function SendDisbursementDialog({
  refund_id,
}: {
  refund_id: string;
}) {
  const [open, setOpen] = useState(false);

  const [files, setFiles] = useState<File[]>([]);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (disbursement_proof_url: string) => {
      return SendDisbursementProof({ id: refund_id, disbursement_proof_url });
    },
  });

  async function handleConfirm() {
    const proofUrl = await uploadDisbursementProofImage(files[0]);

    if (!proofUrl) {
      toast.error("Tolong pilih file bukti pengembalian dana");
      return;
    }

    const result = await mutateAsync(proofUrl);

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
        <Button size={"lg"}>Kirim Bukti Pengembalian Dana</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Kirim Bukti Pengembalian Dana</AlertDialogTitle>
          <AlertDialogDescription>
            Mohon unggah satu (1) file bukti transfer atau pembayaran. Pastikan
            bukti yang diunggah harus jelas dan lengkap, mencantumkan tanggal,
            jumlah, dan detail referensi transaksi yang valid. Bukti ini akan
            diteruskan kepada pelanggan untuk memverifikasi bahwa dana refund
            telah berhasil dibayarkan.
          </AlertDialogDescription>

          <div className="w-full">
            <FileUploadImage
              multiple={false}
              onFilesChange={(newFiles) => {
                setFiles(newFiles);
              }}
            />
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={"outline"} size={"lg"}>
              Batal
            </Button>
          </AlertDialogCancel>

          <Button onClick={handleConfirm} size={"lg"} disabled={isPending}>
            {isPending ? (
              <IconLoader className="animate-spin" />
            ) : (
              "Kirim Bukti"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
