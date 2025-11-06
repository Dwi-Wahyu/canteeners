"use client";

import { Button } from "@/components/ui/button";
import { formatToHour } from "@/helper/hour-helper";
import { Pencil } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ChangeOrderEstimation } from "../actions";
import { toast } from "sonner";
import { IconLoader } from "@tabler/icons-react";
import OrderEstimationCountDown from "@/app/order/order-estimation-countdown";

export default function OrderEstimationSection({
  prev_estimation,
  processed_at,
  order_id,
}: {
  processed_at: Date | null;
  prev_estimation: number;
  order_id: string;
}) {
  const [open, setOpen] = useState(false);

  const [estimation, setEstimation] = useState<number>(prev_estimation);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async () => {
      return ChangeOrderEstimation({ estimation, order_id });
    },
  });

  const handleEstimationClick = (value: number) => {
    setEstimation(value);
  };

  const estimationOptions = [5, 10, 30, 60];

  async function handleChange() {
    const result = await mutateAsync();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error.message);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center justify-between">
        <div>
          <h1 className="font-semibold">Estimasi</h1>
          <h1>{estimation} Menit</h1>
        </div>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button size={"icon"}>
              <Pencil />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader className="text-start">
              <AlertDialogTitle>Ubah Estimasi Pesanan</AlertDialogTitle>
              <AlertDialogDescription>
                Masukkan estimasi baru
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
            <AlertDialogFooter className="grid grid-cols-2 gap-4">
              <AlertDialogCancel asChild>
                <Button size={"lg"} variant={"outline"}>
                  Batal
                </Button>
              </AlertDialogCancel>
              <Button
                size={"lg"}
                disabled={isPending || estimation <= 0}
                onClick={handleChange}
              >
                {isPending ? (
                  <>
                    <IconLoader className="animate-spin" /> Mengubah
                  </>
                ) : (
                  <>Ubah</>
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div>
        <h1 className="font-semibold">Diproses Pada</h1>
        <h1>{formatToHour(processed_at)}</h1>
      </div>

      <div>
        <h1 className="font-semibold">Sisa Waktu</h1>
        <OrderEstimationCountDown
          estimation={estimation}
          processed_at={processed_at}
        />
      </div>
    </div>
  );
}
