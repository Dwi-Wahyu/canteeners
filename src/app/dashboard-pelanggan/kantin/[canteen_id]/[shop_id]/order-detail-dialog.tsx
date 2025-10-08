import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderItemType } from "./type";
import { PaymentMethod, Shop } from "@/app/generated/prisma";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { createConversationAndOrder } from "./actions";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function OrderDetailDialog({
  showOrderDetails,
  toggleShowOrderDetails,
  orderItems,
  shopOwnerId,
  shopId,
  customerId,
}: {
  showOrderDetails: boolean;
  toggleShowOrderDetails: (showOrderDetails: boolean) => void;
  orderItems: OrderItemType[];
  shopOwnerId: string;
  shopId: string;
  customerId: string;
}) {
  function calculateTotalPrice(items: OrderItemType[]): number {
    return items.reduce((total, item) => {
      const subtotal = item.quantity * item.price;
      return total + subtotal;
    }, 0);
  }

  const [isLoading, setIsLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");

  const router = useRouter();

  async function handleConfirmOrder() {
    setIsLoading(true);

    try {
      const conversationAndOrder = await createConversationAndOrder(
        customerId,
        shopOwnerId,
        shopId,
        orderItems,
        paymentMethod
      );

      if (conversationAndOrder.success) {
        toast.success(conversationAndOrder.message);

        setTimeout(() => {
          router.push(
            "/dashboard-pelanggan/chat/" +
              conversationAndOrder.data?.conversationId
          );
        }, 2000);
      } else {
        toast.error(conversationAndOrder.error.message);
      }
    } catch (error) {
      console.log(error);

      toast.error("Terjadi kesalahan");
    } finally {
      toggleShowOrderDetails(false);
      setIsLoading(false);
    }

    toggleShowOrderDetails(false);
    setIsLoading(false);
  }

  return (
    <AlertDialog open={showOrderDetails} onOpenChange={toggleShowOrderDetails}>
      <AlertDialogContent className="flex max-h-[min(600px,80vh)] flex-col gap-0 p-0 sm:max-w-md">
        <AlertDialogHeader className="contents space-y-0 text-left">
          <AlertDialogTitle className="border-b px-6 py-4">
            Tambahkan Ke Keranjang
          </AlertDialogTitle>
          <ScrollArea className="flex max-h-full flex-col overflow-hidden">
            <AlertDialogDescription asChild>
              <div className="p-6">
                <div className="[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold">
                  {/* <div className="space-y-1">
                    <p>
                      <strong>Tanggal / Jam</strong>
                    </p>
                    <p>
                      {formatDateToYYYYMMDD(new Date())} /{" "}
                      {formatToHour(new Date())}
                    </p>
                  </div> */}
                  <div className="space-y-1">
                    <p>
                      <strong>Pesanan</strong>
                    </p>
                    <div className="flex flex-col gap-1">
                      {orderItems.map((item, idx) => (
                        <div key={idx}>
                          <h1 className="leading-tight">
                            {item.product_name}{" "}
                            <Badge variant={"outline"}>{item.quantity}</Badge>
                          </h1>

                          <h1 className="text-sm">
                            Rp {item.price * item.quantity}
                          </h1>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p>
                      <strong>Total Harga</strong>
                    </p>
                    <p>Rp {calculateTotalPrice(orderItems)}</p>
                  </div>

                  <div className="space-y-1">
                    <p>
                      <strong>Metode Pembayaran</strong>
                    </p>
                    <RadioGroup defaultValue="option-one">
                      {Object.values(PaymentMethod).map((method, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <RadioGroupItem value={method} id={method} />
                          <Label htmlFor={method}>{method}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter className="px-6 pb-6 sm:justify-end">
              <AlertDialogCancel asChild>
                <Button disabled={isLoading} variant="outline">
                  Batal
                </Button>
              </AlertDialogCancel>
              <Button
                onClick={handleConfirmOrder}
                disabled={isLoading}
                type="button"
              >
                {isLoading ? "Loading . . ." : "Konfirmasi"}
              </Button>
            </AlertDialogFooter>
          </ScrollArea>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
