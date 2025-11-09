"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconExclamationCircle } from "@tabler/icons-react";

export default function OrderUiInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <IconExclamationCircle className="w-5 h-5 cursor-pointer" />
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Jangan Tinggalkan Halaman Ini</DialogTitle>
          <DialogDescription>
            Agar Anda bisa melihat perubahan status secara{" "}
            <strong>realtime</strong>, mohon tetap di halaman ini. Anda akan
            langsung tahu saat pesanan Anda siap atau dikirim tanpa perlu
            me-refresh.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
