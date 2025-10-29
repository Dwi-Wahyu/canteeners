"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getCustomerShopCart } from "../server-queries";
import { Button } from "@/components/ui/button";
import { IconExclamationCircle, IconRun, IconTrash } from "@tabler/icons-react";
import CartItemCard from "./cart-item-card";
import { NavigationButton } from "@/app/_components/navigation-button";
import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import BackButton from "@/app/_components/back-button";

import { PaymentMethod, PostOrderType } from "@/app/generated/prisma";
import SnkCheckoutDialog from "./snk-checkout-dialog";
import ShopCartPaymentMethod from "./shop-cart-payment-method";
import { useMutation } from "@tanstack/react-query";
import { processShopCart } from "../actions";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { HandPlatter } from "lucide-react";
import { getCustomerProfile } from "@/app/admin/users/queries";

export default function ShopCartDetailClient({
  shopCart,
  customerProfile,
}: {
  shopCart: NonNullable<Awaited<ReturnType<typeof getCustomerShopCart>>>;
  customerProfile: NonNullable<Awaited<ReturnType<typeof getCustomerProfile>>>;
}) {
  const [showSnk, setShowSnk] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    shopCart.payment_method
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [checkouted, setCheckouted] = useState(false);

  const router = useRouter();

  const [postOrderType, setPostOrderType] = useState<PostOrderType>(
    shopCart.post_order_type
  );

  function handleClickCheckout() {
    setShowSnk(true);
  }

  const mutations = useMutation({
    mutationKey: ["process-shop-cart"],
    mutationFn: async () => {
      return await processShopCart({
        shopCartId: shopCart.id,
        paymentMethod,
        postOrderType,
        floor: customerProfile.floor,
        table_number: customerProfile.table_number,
      });
    },
    onSuccess(data) {
      if (data.success) {
        setShowSnk(false);
        toast.success("Sukses checkout keranjang");
        router.push("/dashboard-pelanggan/chat");
      } else {
        toast.error(data.error.message);
      }
    },
  });

  useEffect(() => {
    if (checkouted) {
      mutations.mutateAsync();
    }
  }, [checkouted]);

  return (
    <div className="">
      <div className="mb-4 flex gap-4 items-center">
        <BackButton url="/dashboard-pelanggan/keranjang" />
        <h1 className="font-semibold text-lg">{shopCart.shop.name}</h1>
      </div>

      <div className="mb-5">
        <h1 className="font-semibold mb-2">Daftar Pesanan</h1>

        <div className="flex flex-col gap-3">
          {shopCart.items.map((item, idx) => (
            <CartItemCard
              cartItem={item}
              disabled={shopCart.status === "ORDERED"}
              key={idx}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between mb-5">
        <div>
          <h1 className="font-semibold">Ada lagi yang mau dibeli?</h1>
          <h1 className="text-muted-foreground text-sm">
            Masih bisa tambah menu lain
          </h1>
        </div>

        <NavigationButton
          url={`/dashboard-pelanggan/kantin/${shopCart.shop.canteen_id}/${shopCart.shop.id}`}
          variant={"outline"}
        >
          Tambah
        </NavigationButton>
      </div>

      <ShopCartPaymentMethod
        shopPayments={shopCart.shop.payments}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        disabled={shopCart.status === "ORDERED"}
      />

      <div>
        <div className="flex justify-between items-center">
          <h1 className="font-semibold mb-2">Pilih Jenis Order</h1>

          <IconExclamationCircle className="w-4 h-4 text-muted-foreground" />
        </div>

        <Tabs
          defaultValue={postOrderType}
          value={postOrderType}
          onValueChange={(value) => setPostOrderType(value as PostOrderType)}
          className=""
        >
          <TabsList>
            <TabsTrigger value="DELIVERY_TO_TABLE">
              <HandPlatter />
              Makan Di Meja
            </TabsTrigger>
            <TabsTrigger value="TAKEAWAY">
              <IconRun />
              Take Away
            </TabsTrigger>
          </TabsList>
          <TabsContent value="DELIVERY_TO_TABLE">
            <Card>
              <CardContent>
                {customerProfile.table_number ? (
                  <div className="flex flex-col">
                    <h1 className="font-semibold mb-2">
                      {shopCart.shop.canteen.name}
                    </h1>
                    <h1 className="mb-1 text-muted-foreground">
                      Lantai {customerProfile.floor}
                    </h1>
                    <h1 className="mb-1 text-muted-foreground">
                      Meja {customerProfile.table_number}
                    </h1>

                    <Button asChild className="mt-2">
                      <Link
                        href={`/dashboard-pelanggan/kantin/${shopCart.shop.canteen_id}/pilih-meja`}
                      >
                        Pilih Ulang
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <h1 className="font-semibold mb-2">
                      Pesanan diantarkan ke meja kamu
                    </h1>
                    <h1 className="text-sm text-muted-foreground">
                      Belum memilih nomor meja, scan QR Code di meja anda atau{" "}
                      <Link
                        href={`/dashboard-pelanggan/kantin/${shopCart.shop.canteen_id}/pilih-meja`}
                        className="underline text-blue-600"
                      >
                        Klik disini untuk pilih meja
                      </Link>
                    </h1>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="TAKEAWAY">
            <Card>
              <CardContent>
                <h1 className="font-semibold mb-2">Ambil pesanan di kedai</h1>
                <h1 className="text-sm text-muted-foreground">
                  Opsi jika kedai sedang sibuk dan tidak sempat mengantarkan
                  pesanan
                </h1>
              </CardContent>
            </Card>
          </TabsContent>
          {/* <TabsContent value="3">
            <Card>
              <CardContent>
                <h1 className="font-semibold mb-1">
                  Pesanan diantarkan ke lokasi kamu
                </h1>
                <h1 className="text-sm text-muted-foreground">
                  Setelah pesanan selesai, anda perlu membayar biaya tambahan
                  untuk pengantaran oleh kurir
                </h1>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>

      <div className="my-6 flex flex-col gap-1">
        <div className="flex justify-between items-center text-muted-foreground">
          <h1>Biaya Tambahan</h1>

          <h1>1000</h1>
        </div>

        <div className="flex justify-between items-center text-muted-foreground">
          <h1>Total Biaya Tambahan</h1>

          <h1>
            {shopCart.items.reduce((sum, item) => sum + item.quantity, 0) *
              1000}
          </h1>
        </div>

        <div className="flex font-semibold justify-between items-center text-muted-foreground">
          <h1>
            Subtotal{" "}
            {shopCart.items.reduce((sum, item) => sum + item.quantity, 0)} Item
          </h1>

          <h1>{shopCart.total_price}</h1>
        </div>
      </div>

      {shopCart.status === "ORDERED" && (
        <Button
          className="w-full bg-gradient-to-t from-primary to-primary/80 border border-primary mb-6 py-6"
          size={"lg"}
          asChild
        >
          <Link href={"/order/" + shopCart.order_id}>Lihat Detail Order</Link>
        </Button>
      )}

      {shopCart.status === "PENDING" && (
        <Button
          className="w-full bg-gradient-to-t from-primary to-primary/80 border border-primary mb-6 flex justify-between py-6 items-center"
          size={"lg"}
          onClick={handleClickCheckout}
        >
          <h1>{shopCart.items.length} Item</h1>

          <div className="flex gap-2 h-4">
            <h1>Rp {shopCart.total_price}</h1>

            <Separator orientation="vertical" />

            <h1 className="font-semibold">Checkout</h1>
          </div>
        </Button>
      )}

      <SnkCheckoutDialog
        showSnk={showSnk}
        setShowSnk={setShowSnk}
        setCheckouted={setCheckouted}
        isCheckoutPending={mutations.isPending}
      />

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader className="text-start">
            <AlertDialogTitle>Hapus Kedai dari Keranjang?</AlertDialogTitle>
            <AlertDialogDescription>
              Semua produk dari kedai ini akan dihapus dari keranjang belanja
              Anda. Jika Anda ingin membelinya lagi, Anda harus menambahkannya
              kembali secara manual. Lanjutkan penghapusan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-4">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <Button variant={"destructive"}>Hapus</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
