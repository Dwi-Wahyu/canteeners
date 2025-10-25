"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getCustomerShopCart } from "../server-queries";
import { Button } from "@/components/ui/button";
import {
  IconCash,
  IconCheck,
  IconDesk,
  IconExclamationCircle,
  IconMoped,
  IconRun,
  IconTable,
  IconTrash,
} from "@tabler/icons-react";
import CartItemCard from "./cart-item-card";
import { paymentMethodMapping } from "@/constant/payment-method";
import { Checkbox } from "@/components/ui/checkbox";
import { NavigationButton } from "@/app/_components/navigation-button";
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
import BackButton from "@/app/_components/back-button";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export default function ShopCartDetailClient({
  shopCart,
}: {
  shopCart: NonNullable<Awaited<ReturnType<typeof getCustomerShopCart>>>;
}) {
  const [showSnk, setShowSnk] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleClickCheckout() {
    setShowSnk(true);
  }

  return (
    <div className="">
      <div className="mb-4 flex gap-4 items-center">
        <BackButton url="/dashboard-pelanggan/keranjang" />
        <h1 className="font-semibold text-lg">{shopCart.shop.name}</h1>
      </div>

      <div className="mb-5">
        <h1 className="font-semibold mb-3">Daftar Pesanan</h1>

        {shopCart.items.map((item, idx) => (
          <CartItemCard cartItem={item} key={idx} />
        ))}
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

      <div className="mb-5">
        <h1 className="font-semibold mb-3">Pilih Metode Pembayaran</h1>

        {shopCart.shop.payments.map((payment, idx) => (
          <Item key={idx} variant={"outline"}>
            <ItemMedia>
              <IconCash />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{paymentMethodMapping[payment.method]}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Checkbox />
            </ItemActions>
          </Item>
        ))}

        {/* <Card>
          <CardContent>
            {shopCart.shop.payments.map((payment, idx) => (
              <Item key={idx} variant={"outline"}>
                <ItemMedia>
                  <IconCash />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{paymentMethodMapping[payment.method]}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Checkbox />
                </ItemActions>
              </Item>          
            ))}
          </CardContent>
        </Card> */}
      </div>

      <div>
        <div className="flex justify-between items-center">
          <h1 className="font-semibold mb-3">Pilih Jenis Order</h1>

          <IconExclamationCircle className="w-5 h-5" />
        </div>

        <Tabs defaultValue="1" className="">
          <TabsList>
            <TabsTrigger value="1">Makan Di Meja</TabsTrigger>
            <TabsTrigger value="2">Take Away</TabsTrigger>
            <TabsTrigger value="3">Diantarkan</TabsTrigger>
          </TabsList>
          <TabsContent value="1">
            <Card>
              <CardContent>
                <h1 className="font-semibold mb-1">
                  Pesanan diantarkan ke meja kamu
                </h1>
                <h1 className="text-sm text-muted-foreground">
                  Belum memilih nomor meja, scan QR Code di meja anda
                </h1>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="2">
            <Card>
              <CardContent>
                <h1 className="font-semibold mb-1">Ambil pesanan di kedai</h1>
                <h1 className="text-sm text-muted-foreground">
                  Opsi jika kedai sedang sibuk dan tidak sempat mengantarkan
                  pesanan
                </h1>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="3">
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
          </TabsContent>
        </Tabs>

        {/* <div className="flex flex-col gap-4">
          <Item variant={"outline"}>
            <ItemMedia>
              <IconDesk />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Makan Ditempat</ItemTitle>
              <ItemDescription>Makan diantarin ke meja kamu</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Checkbox />
            </ItemActions>
          </Item>

          <Item variant={"outline"}>
            <ItemMedia>
              <IconRun />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Take Away</ItemTitle>
              <ItemDescription>
                Ambil pesanan di kedai baru pergi
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Checkbox />
            </ItemActions>
          </Item>

          <Item variant={"outline"}>
            <ItemMedia>
              <IconMoped />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Diantarin</ItemTitle>
              <ItemDescription>
                Diantarin ke lokasi kamu (+biaya ongkir)
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Checkbox />
            </ItemActions>
          </Item>
        </div> */}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button
          variant={"destructive"}
          size={"lg"}
          onClick={() => setConfirmDelete(true)}
        >
          <IconTrash />
          Hapus
        </Button>

        <Button size={"lg"} onClick={handleClickCheckout}>
          <IconCheck />
          Checkout
        </Button>
      </div>

      <AlertDialog open={showSnk} onOpenChange={setShowSnk}>
        <AlertDialogContent>
          <AlertDialogHeader className="text-start">
            <AlertDialogTitle>Persetujuan Syarat & Ketentuan</AlertDialogTitle>
            <AlertDialogDescription>
              Sebelum melanjutkan ke pembayaran, mohon baca dan setujui Syarat
              dan Ketentuan layanan kami. Persetujuan ini memastikan Anda
              memahami hak dan kewajiban saat bertransaksi di platform ini.
              Dengan menyetujui, Anda siap untuk menyelesaikan pembelian dan
              kami dapat segera memproses pesanan Anda dengan lancar.
            </AlertDialogDescription>

            <div className="flex gap-2 my-2">
              <Checkbox />
              <h1 className="text-sm text-muted-foreground">
                Saya menyetujui syaran dan ketentuan
              </h1>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-4">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction disabled>Lanjut</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
