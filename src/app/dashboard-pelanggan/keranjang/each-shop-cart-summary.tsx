"use client";

import CartItemComponent from "./cart-item";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PaymentMethod } from "@/app/generated/prisma";
import { KedaiState, useKeranjangActions } from "@/store/use-keranjang-store";
import { NavigationButton } from "@/app/_components/navigation-button";

export default function EachShopCartSummary({ shop }: { shop: KedaiState }) {
  const { setShopPaymentMethod } = useKeranjangActions();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-semibold text-xl">{shop.name}</h1>

      <div>
        {shop.items.map((item) => (
          <CartItemComponent
            item={item}
            key={item.productId}
            shopId={shop.id}
          />
        ))}
      </div>

      <div className="flex justify-between">
        <div>
          <h1 className="font-semibold">Ada lagi yang mau dibeli?</h1>
          <h1 className="text-muted-foreground text-sm">
            Masih bisa tambah menu lain
          </h1>
        </div>

        {/* Todo: Ini nanti ganti id kantin na jadi dinamis */}
        <NavigationButton
          url={`/dashboard-pelanggan/kantin/1/${shop.id}`}
          variant={"outline"}
        >
          Tambah
        </NavigationButton>
      </div>

      <div>
        <h1 className="mb-2 font-semibold">Pilih Metode Pembayaran</h1>

        <RadioGroup
          defaultValue="CASH"
          className="flex gap-4"
          onValueChange={(method) =>
            setShopPaymentMethod(shop.id, method as PaymentMethod)
          }
        >
          {shop.availablePaymentMethod.map((method, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <RadioGroupItem value={method} id={`method-${shop.id}`} />
              <Label htmlFor={`method-${shop.id}`} className="mt-1">
                {method}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-between">
        <h1>Total</h1>

        <h1 className="text-muted-foreground">Rp {shop.totalPrice}</h1>
      </div>

      <Separator className="my-2" />
    </div>
  );
}
