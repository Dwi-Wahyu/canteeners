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
import { IconLoader } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { PaymentMethod } from "@/app/generated/prisma";
import { Textarea } from "@/components/ui/textarea";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CancelOrder } from "../actions";
import { CheckedState } from "@radix-ui/react-checkbox";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";

export default function CancelOrderDialog({
  conversation_id,
  order_id,
  user_id,
  payment_method,
}: {
  order_id: string;
  payment_method: PaymentMethod;
  user_id: string;
  conversation_id: string;
}) {
  const [open, setOpen] = useState(false);

  const [reason, setReason] = useState("");
  const [createRefund, setCreateRefund] = useState<CheckedState>(false);
  const router = useRouter();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async () => {
      return await CancelOrder({
        order_id,
        cancelled_by_id: user_id,
        cancelled_reason: reason,
      });
    },
  });

  async function handleConfirm() {
    const result = await mutateAsync();

    if (result.success) {
      toast.success(result.message);

      if (createRefund) {
        router.push(`/dashboard-pelanggan/order/${order_id}/refund`);
      }
    } else {
      toast.error(result.error.message);
    }
  }

  return (
    <div className="mt-2">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button size={"lg"} variant={"destructive"} className="w-full ">
            Batalkan Order
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader className="text-start">
            <AlertDialogTitle>Yakin Batalin Order?</AlertDialogTitle>
            <AlertDialogDescription>Beri alasan jelas</AlertDialogDescription>

            <Textarea
              disabled={isPending}
              placeholder="Contoh : Lewat estimasi"
            />

            <Label className="mt-2 flex items-center gap-2">
              <Checkbox
                onCheckedChange={(checked) => setCreateRefund(checked)}
              />
              <p className="text-sm leading-none font-medium">
                Bikin pengajuan refund
              </p>
            </Label>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-4">
            <AlertDialogCancel asChild>
              <Button size={"lg"} variant={"outline"}>
                Ga Jadi Deh
              </Button>
            </AlertDialogCancel>
            <Button
              size={"lg"}
              variant={"destructive"}
              onClick={handleConfirm}
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
