"use client";

import { Button } from "@/components/ui/button";
import { notificationDialog } from "@/hooks/use-notification-dialog";

export default function Page() {
  function handleSuccess() {
    notificationDialog.success({
      title: "Operasi Berhasil",
      message: "Data telah disimpan dengan sukses.",
      actionButtons: (
        <div className="flex justify-center">
          <Button onClick={notificationDialog.hide} variant={"outline"}>
            Tutup
          </Button>
        </div>
      ),
    });
  }

  function handleError() {
    notificationDialog.error({
      title: "Operasi Gagal",
      message:
        "Terjadi kesalahan yang tidak diketahui, silakan hubungi customer service",
      actionButtons: (
        <div className="flex justify-center">
          <Button onClick={notificationDialog.hide}>Tutup</Button>
        </div>
      ),
    });
  }

  function handleInfo() {
    notificationDialog.info({
      title: "Info",
      message: "Ini info",
      actionButtons: (
        <div className="flex justify-center">
          <Button onClick={notificationDialog.hide}>Tutup</Button>
        </div>
      ),
    });
  }

  return (
    <div className="p-5">
      <h1>Demo Notifikasi</h1>

      <div className="flex flex-col gap-4 mt-4">
        <Button onClick={handleSuccess} size={"lg"}>
          Notifikasi Sukses
        </Button>

        <Button onClick={handleError} size={"lg"}>
          Notifikasi Error
        </Button>

        <Button onClick={handleInfo} size={"lg"}>
          Notifikasi Info
        </Button>
      </div>
    </div>
  );
}
