"use client";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { type DateRange } from "react-day-picker";
import { useMutation } from "@tanstack/react-query";
import { GenerateShopBilling } from "./actions";
import { notificationDialog } from "@/hooks/use-notification-dialog";

export default function GenerateShopBillingDialog({
  shop_id,
}: {
  shop_id: string;
}) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  });

  const [open, setOpen] = useState(false);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async ({
      start_date,
      end_date,
    }: {
      start_date: Date;
      end_date: Date;
    }) => {
      return GenerateShopBilling({ start_date, end_date, shop_id });
    },
  });

  async function handleSubmit() {
    if (!dateRange) {
      return;
    }

    if (!dateRange.from || !dateRange.to) {
      return;
    }

    const result = await mutateAsync({
      start_date: dateRange.from,
      end_date: dateRange.to,
    });

    if (result.success) {
      setOpen(false);
      notificationDialog.success({
        title: "Sukses mencatat tagihan",
        message: "Silakan konfirmasi ke pemilik kedai untuk membayar tagihan",
        actionButtons: <Button onClick={notificationDialog.hide}>Tutup</Button>,
      });
    } else {
      setOpen(false);
      notificationDialog.error({
        title: "Gagal mencatat tagihan",
        message: result.error.message,
        actionButtons: <Button onClick={notificationDialog.hide}>Tutup</Button>,
      });
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size={"sm"}>Buat Tagihan</Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-fit max-w-[90vw] sm:max-w-lg p-4">
        <AlertDialogHeader>
          <AlertDialogTitle>Buat Tagihan Kedai</AlertDialogTitle>
          <AlertDialogDescription className="mb-4">
            Pilih tanggal mulai - selesai untuk menghitung total komisi yang
            harus dibayar untuk kedai dalam rentang waktu tertentu
          </AlertDialogDescription>

          <div className="flex justify-center">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              className="p-0 mb-2"
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <Button
            onClick={handleSubmit}
            disabled={
              isPending || !dateRange || !dateRange.from || !dateRange.to
            }
          >
            Buat Tagihan
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
