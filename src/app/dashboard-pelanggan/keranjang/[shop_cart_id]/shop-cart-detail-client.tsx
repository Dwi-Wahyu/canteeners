"use client";

import { getCustomerShopCart } from "../server-queries";
import { Button } from "@/components/ui/button";
import CartItemCard from "./cart-item-card";
import { NavigationButton } from "@/app/_components/navigation-button";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  PaymentMethod,
  PostOrderType,
  ShopCartStatus,
} from "@/app/generated/prisma";
import SnkCheckoutDialog from "./snk-checkout-dialog";
import ShopCartPaymentMethod from "./shop-cart-payment-method";
import { useMutation } from "@tanstack/react-query";
import { processShopCart } from "../actions";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getCustomerProfile } from "@/app/admin/users/queries";
import { shopCartStatusMapping } from "@/constant/cart-status-mapping";
import CustomBadge from "@/components/custom-badge";
import PostOrderTypeTab from "./post-order-type-tab";
import { notificationDialog } from "@/hooks/use-notification-dialog";

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
        notificationDialog.success({
          title: "Sukses checkout keranjang",
          message: "Order berhasil dicatat",
          actionButtons: (
            <div className="flex gap-2">
              <NavigationButton
                url={"/dashboard-pelanggan/order/" + data.data?.order_id}
              >
                Lihat Detail Order
              </NavigationButton>
              <NavigationButton
                url={"/dashboard-pelanggan/chat/" + data.data?.conversation_id}
                variant="default"
              >
                Hubungi Pemilik Kedai
              </NavigationButton>
            </div>
          ),
        });
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
    <div className="flex flex-col gap-4">
      <div className="flex  gap-1 items-center justify-between">
        <h1 className="font-semibold text-lg">{shopCart.shop.name}</h1>
        <CustomBadge
          value={shopCart.status}
          outlineValues={[ShopCartStatus.PENDING]}
          successValues={[ShopCartStatus.ORDERED]}
        >
          {shopCartStatusMapping[shopCart.status]}
        </CustomBadge>
      </div>

      <div className="">
        <h1 className="font-semibold mb-2">Daftar Pesanan</h1>

        <div className="flex flex-col gap-2">
          {shopCart.items.map((item, idx) => (
            <CartItemCard
              cartItem={item}
              disabled={shopCart.status === "ORDERED"}
              key={idx}
            />
          ))}
        </div>
      </div>

      {shopCart.status === "PENDING" && (
        <div className="flex justify-between ">
          <div>
            <h1 className="font-semibold">Ada lagi yang mau dibeli?</h1>
            <h1 className="text-muted-foreground text-sm">
              Masih bisa tambah menu lain
            </h1>
          </div>

          <NavigationButton
            url={`/dashboard-pelanggan/kantin/${shopCart.shop.canteen_id}/${shopCart.shop.id}?shop_cart_id=${shopCart.id}`}
            variant={"outline"}
          >
            Tambah
          </NavigationButton>
        </div>
      )}

      <ShopCartPaymentMethod
        shopPayments={shopCart.shop.payments}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        disabled={shopCart.status === "ORDERED"}
      />

      <PostOrderTypeTab
        canteen_id={shopCart.shop.canteen_id}
        canteen_name={shopCart.shop.canteen.name}
        customerProfile={customerProfile}
        postOrderType={postOrderType}
        setPostOrderType={setPostOrderType}
      />

      <div className="flex flex-col gap-1">
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
          className="w-full bg-gradient-to-t from-primary to-primary/80 border border-primary py-6"
          size={"lg"}
          asChild
        >
          <Link href={"/dashboard-pelanggan/order/" + shopCart.order_id}>
            Lihat Detail Order
          </Link>
        </Button>
      )}

      {shopCart.status === "PENDING" && (
        <Button
          className="w-full bg-gradient-to-t from-primary to-primary/80 border border-primary flex justify-between py-6 items-center"
          size={"lg"}
          onClick={handleClickCheckout}
          disabled={customerProfile.suspend_until !== null}
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
