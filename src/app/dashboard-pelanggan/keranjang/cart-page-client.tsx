"use client";

import { NavigationButton } from "@/app/_components/navigation-button";
import { Card, CardContent } from "@/components/ui/card";

import {
  IconCheck,
  IconExclamationCircle,
  IconQrcode,
  IconRun,
  IconShoppingCartQuestion,
} from "@tabler/icons-react";

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
import { useKeranjang } from "@/store/use-keranjang-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { processOrder } from "./actions";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";

import { getCustomerCart } from "./server-queries";
import LoadingCartSkeleton from "./loading-cart-skeleton";
import EmptyCart from "./empty-cart";
import ShopCartSummary from "./shop-cart-summary";

export default function CartPageClient({ userId }: { userId: string }) {
  const [openConfirmation, setOpenConfirmation] = useState(false);

  // const router = useRouter();

  const { data, isFetching, isError } = useQuery({
    queryKey: ["get-customer-cart"],
    queryFn: async () => {
      return await getCustomerCart(userId);
    },
  });

  // const mutation = useMutation({
  //   mutationFn: processOrder,
  // });

  // async function handleProcessOrder() {
  //   if (Object.values(keranjang).length === 0) return;

  //   const result = await mutation.mutateAsync({
  //     shopGroupItems: keranjang,
  //     customerId: userId,
  //   });

  //   if (result.success) {
  //     toast.success(result.message);
  //     router.push("/dashboard-pelanggan/chat");
  //   } else {
  //     console.log(result.error);

  //     toast.error(result.error.message);
  //   }

  //   setOpenConfirmation(false);
  // }

  return (
    <div>
      {isFetching && <LoadingCartSkeleton />}

      {!isFetching && isError && (
        <div>
          <h1>Terjadi kesalahan</h1>
        </div>
      )}

      {!isFetching && data && (
        <>
          {data.shopCarts.length === 0 ? (
            <EmptyCart />
          ) : (
            <div>
              {data.shopCarts.map((shopCart, idx) => (
                <ShopCartSummary shopCart={shopCart} key={idx} />
              ))}
            </div>
          )}
        </>
      )}

      {/* {Object.values(keranjang).length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconShoppingCartQuestion />
            </EmptyMedia>
            <EmptyTitle>Keranjang masih kosong nih</EmptyTitle>
            <EmptyDescription>Yuk masukin produk</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <NavigationButton variant="outline" url="/dashboard-pelanggan">
              Cari Produk
            </NavigationButton>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          {Object.values(keranjang).map((shop, shopIdx) => (
            <EachShopCartSummary shop={shop} key={shopIdx} />
          ))}

          <Card>
            <CardContent>
              <div className="flex justify-between mb-4 items-center">
                <h1 className="font-semibold ">Nomor Meja</h1>

                <Button className="p-0" variant={"ghost"}>
                  <IconExclamationCircle />
                </Button>
              </div>

              <div className="flex flex-col justify-center items-center gap-3">
                <h1 className="text-muted-foreground">
                  Belum menentukan nomor meja
                </h1>

                <Button>
                  <IconQrcode />
                  Scan QR Code
                </Button>

                <Button variant={"outline"}>
                  <IconRun /> Takeaway
                </Button>
              </div>
            </CardContent>
          </Card>

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
      )} */}
    </div>
  );
}
