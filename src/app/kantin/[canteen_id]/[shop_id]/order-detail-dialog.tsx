import { ChevronLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderItemType } from "./type";
import { Shop } from "@/app/generated/prisma";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export default function OrderDetailDialog({
  showOrderDetails,
  toggleShowOrderDetails,
  orderItems,
  shop,
}: {
  showOrderDetails: boolean;
  toggleShowOrderDetails: (showOrderDetails: boolean) => void;
  orderItems: OrderItemType[];
  shop: Shop;
}) {
  function calculateTotalPrice(items: OrderItemType[]): number {
    return items.reduce((total, item) => {
      const subtotal = item.quantity * item.price;
      return total + subtotal;
    }, 0);
  }

  return (
    <AlertDialog open={showOrderDetails} onOpenChange={toggleShowOrderDetails}>
      <AlertDialogContent className="flex max-h-[min(600px,80vh)] flex-col gap-0 p-0 sm:max-w-md">
        <AlertDialogHeader className="contents space-y-0 text-left">
          <AlertDialogTitle className="border-b px-6 py-4">
            Ringkasan Pesanan
          </AlertDialogTitle>
          <ScrollArea className="flex max-h-full flex-col overflow-hidden">
            <AlertDialogDescription asChild>
              <div className="p-6">
                <div className="[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold">
                  <div className="space-y-1">
                    <p>
                      <strong>Tanggal / Jam</strong>
                    </p>
                    <p>
                      {formatDateToYYYYMMDD(new Date())} /{" "}
                      {formatToHour(new Date())}
                    </p>
                  </div>
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
                </div>
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter className="px-6 pb-6 sm:justify-end">
              <AlertDialogCancel asChild>
                <Button variant="outline">Batal</Button>
              </AlertDialogCancel>
              <AlertDialogAction type="button">Lanjutkan</AlertDialogAction>
            </AlertDialogFooter>
          </ScrollArea>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
