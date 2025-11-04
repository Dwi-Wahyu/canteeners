"use client";

import { Button } from "@/components/ui/button";
import { notificationDialog } from "@/hooks/use-notification-dialog";
import { useNotificationDialogStore } from "@/store/use-notification-store";

export default function Page() {
  const { notification, hide, show } = useNotificationDialogStore();

  function handleSuccess() {
    show({
      type: "success",
      title: "Operasi Berhasil",
      message: "Data telah disimpan dengan sukses.",
      actionButtons: (
        <div>
          <Button>Lanjutkan</Button>
          <Button>Lihat Keranjang</Button>
        </div>
      ),
    });
  }
  return (
    <div className="p-5">
      <h1>Demo Notifikasi</h1>

      <Button onClick={handleSuccess}>Tampilkan Notifikasi Sukses</Button>
    </div>
  );
}
