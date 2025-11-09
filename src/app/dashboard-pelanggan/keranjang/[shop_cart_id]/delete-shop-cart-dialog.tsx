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
import { IconCheck, IconLoader, IconTrash } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { deleteShopCart } from "../actions";
import { useRouter } from "nextjs-toploader/app";
import { notificationDialog } from "@/hooks/use-notification-dialog";

export default function DeleteShopCartDialog({
  shop_cart_id,
}: {
  shop_cart_id: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async () => {
      return deleteShopCart(shop_cart_id);
    },
  });

  async function handleConfirm() {
    const result = await mutateAsync();

    if (result.success) {
      setOpen(false);
      router.push("/dashboard-pelanggan/keranjang");
    } else {
      notificationDialog.error({
        title: "Gagal Menghapus Keranjang",
        message:
          "Terjadi kesalahan saat menghapus keranjang. Silakan coba lagi.",
      });
      console.log(result.error);
    }
  }

  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild disabled={isPending}>
          <IconTrash className="w-5 h-5 cursor-pointer" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Yakin Menerima Menghapus Keranjang?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Anda harus menambahkan ulang produk ke keranjang jika ingin
              membelinya nanti.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button size={"lg"} variant={"outline"}>
                Batal
              </Button>
            </AlertDialogCancel>
            <Button
              size={"lg"}
              onClick={handleConfirm}
              variant={"destructive"}
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
