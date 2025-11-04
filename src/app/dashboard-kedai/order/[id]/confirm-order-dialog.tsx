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
import { IconCheck, IconLoader } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ConfirmOrder } from "../actions";
import { PaymentMethod } from "@/app/generated/prisma";

export default function ConfirmOrderDialog({
  conversation_id,
  order_id,
  owner_id,
  payment_method,
  shop_id,
}: {
  order_id: string;
  payment_method: PaymentMethod;
  owner_id: string;
  conversation_id: string;
  shop_id: string;
}) {
  const [open, setOpen] = useState(false);
  const [estimation, setEstimation] = useState<number>(5);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async () => {
      return await ConfirmOrder({
        conversation_id,
        estimation,
        order_id,
        owner_id,
        payment_method,
        shop_id,
      });
    },
  });

  async function handleConfirm() {
    const result = await mutateAsync();

    if (result.success) {
      setOpen(false);
    } else {
      console.log(result.error);
    }
  }

  const handleEstimationClick = (value: number) => {
    setEstimation(value);
  };

  const estimationOptions = [5, 10, 30, 60];

  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button size={"lg"} variant={"destructive"} className="w-full ">
            <IconCheck />
            Konfirmasi
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Anda Yakin Menerima Pesanan Ini?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Berikan estimasi waktu pesanan selesai
            </AlertDialogDescription>

            <div className="relative mt-2">
              <Input
                type="number"
                value={estimation}
                onChange={(e) => setEstimation(parseInt(e.target.value) || 0)}
                disabled={isPending}
                className="peer pr-13"
              />
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 text-sm peer-disabled:opacity-50">
                Menit
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {estimationOptions.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={estimation === value ? "default" : "outline"}
                  onClick={() => handleEstimationClick(value)}
                  disabled={isPending}
                >
                  {value}
                </Button>
              ))}
            </div>
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
              disabled={isPending || estimation <= 0}
            >
              {isPending ? <IconLoader className="animate-spin" /> : "Yakin"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
