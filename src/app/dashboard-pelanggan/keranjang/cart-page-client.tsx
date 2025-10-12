"use client";

import { NavigationButton } from "@/app/_components/navigation-button";
import { Card, CardContent } from "@/components/ui/card";

import { IconCheck, IconShoppingCartQuestion } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

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
import { useState } from "react";
import BackButton from "@/app/_components/back-button";
import EachShopCartSummary from "./each-shop-cart-summary";
import {
  useKeranjang,
  useKeranjangTotalPrice,
  useKeranjangTotalQuantity,
} from "@/store/use-keranjang-store";
import { useMutation } from "@tanstack/react-query";
import { processOrder } from "./actions";
import { toast } from "sonner";

export default function CartPageClient({ userId }: { userId: string }) {
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const keranjangTotalPrice = useKeranjangTotalPrice();
  const keranjangTotalQuantity = useKeranjangTotalQuantity();

  const keranjang = useKeranjang();

  const mutation = useMutation({
    mutationFn: processOrder,
  });

  async function handleProcessOrder() {
    if (Object.values(keranjang).length === 0) return;

    const result = await mutation.mutateAsync({
      shopGroupItems: keranjang,
      customerId: userId,
    });

    if (result.success) {
      toast.success(result.message);
    } else {
      console.log(result.error);

      toast.error(result.error.message);
    }

    setOpenConfirmation(false);
  }

  return (
    <div>
      <BackButton />

      <h1 className="font-semibold mb-3 mt-2">Keranjang Anda</h1>

      {Object.values(keranjang).length === 0 ? (
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
          {Object.values(keranjang).map((shop, shopIdx) => (
            <EachShopCartSummary shop={shop} key={shopIdx} />
          ))}

          <Card>
            <CardContent>
              <h1 className="font-semibold mb-3">Ringkasan</h1>

              <div>
                <h1>Jumlah Pesanan</h1>

                <h1 className="text-muted-foreground">
                  {keranjangTotalQuantity} pesanan dari{" "}
                  {Object.values(keranjang).length} Kedai
                </h1>
              </div>

              <div className="my-2">
                <h1>Total Harga Keranjang Anda</h1>

                <h1 className="text-muted-foreground">
                  Rp {keranjangTotalPrice.toLocaleString("id-ID")}
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
                      <Button
                        onClick={handleProcessOrder}
                        disabled={mutation.isPending}
                      >
                        Lanjut Ke Chat
                      </Button>
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
