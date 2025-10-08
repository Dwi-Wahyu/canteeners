"use client";

import { NavigationButton } from "@/app/_components/navigation-button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart";

import { IconCheck, IconShoppingCartQuestion } from "@tabler/icons-react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Ellipsis, EllipsisVertical } from "lucide-react";
import BackButton from "@/app/_components/back-button";
import CartItemComponent from "./cart-item";

export default function CartPage() {
  const cartStore = useCartStore();

  const [openConfirmation, setOpenConfirmation] = useState(false);

  const grouped = cartStore.getGroupedItems();

  function processOrder() {}

  return (
    <div>
      <BackButton />

      <h1 className="font-semibold mb-3 mt-2">Keranjang Anda</h1>

      {cartStore.items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col justify-center items-center gap-4">
            <h1 className="font-semibold text-lg">Keranjang masih kosong</h1>

            <IconShoppingCartQuestion />

            <NavigationButton variant="outline" url="/dashboard-pelanggan">
              Tambahkan Produk
            </NavigationButton>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {Object.values(grouped).map((shop, shopIdx) => (
            <Card key={shopIdx}>
              <CardContent>
                <h1 className="font-semibold mb-3">{shop.shopName}</h1>

                <div>
                  {shop.items.map((item) => (
                    <CartItemComponent item={item} key={item.productId} />
                  ))}
                </div>

                <div>
                  <h1 className="mb-2">Metode Pembayaran</h1>

                  <RadioGroup defaultValue="CASH" className="flex gap-4">
                    {shop.availablePaymentMethod.map((method, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={method}
                          id={`${shopIdx}-method`}
                        />
                        <Label htmlFor={`${shopIdx}-method`} className="mt-1">
                          {method}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between">
                  <h1>Total</h1>

                  <h1 className="text-muted-foreground">
                    Rp {shop.shopTotalPrice}
                  </h1>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardContent>
              <h1 className="font-semibold mb-3">Ringkasan</h1>

              <div>
                <h1>Jumlah Pesanan</h1>

                <h1 className="text-muted-foreground">
                  {cartStore.totalQuantity} pesanan dari{" "}
                  {Object.values(grouped).length} Kedai
                </h1>
              </div>

              <div className="my-2">
                <h1>Total Harga Keranjang Anda</h1>

                <h1 className="text-muted-foreground">
                  Rp {cartStore.totalPrice}
                </h1>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                {/* <NavigationButton url="/dashboard-pelanggan" /> */}

                <AlertDialog
                  open={openConfirmation}
                  onOpenChange={setOpenConfirmation}
                >
                  <AlertDialogTrigger asChild>
                    <Button className="">
                      <IconCheck />
                      Checkout
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Proses pesanan sekarang?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Sistem akan langsung meneruskan pesanan ke pemilik kedai
                        dan membuka chat agar Anda bisa langsung konfirmasi
                        detail pesanan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal Dulu</AlertDialogCancel>
                      <AlertDialogAction>Lanjut Ke Chat</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
