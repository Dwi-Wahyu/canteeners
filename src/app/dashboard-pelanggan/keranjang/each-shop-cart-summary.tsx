"use client";

import { Card, CardContent } from "@/components/ui/card";
import CartItemComponent from "./cart-item";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PaymentMethod } from "@/app/generated/prisma";
import { KedaiState, useKeranjangActions } from "@/store/use-keranjang-store";

export default function EachShopCartSummary({ shop }: { shop: KedaiState }) {
  const { setShopPaymentMethod } = useKeranjangActions();

  return (
    <Card>
      <CardContent>
        <h1 className="font-semibold mb-3">{shop.name}</h1>

        <div>
          {shop.items.map((item) => (
            <CartItemComponent
              item={item}
              key={item.productId}
              shopId={shop.id}
            />
          ))}
        </div>

        <div>
          <h1 className="mb-2">Metode Pembayaran</h1>

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

        <Separator className="my-2" />

        <div className="flex justify-between">
          <h1>Total</h1>

          <h1 className="text-muted-foreground">Rp {shop.totalPrice}</h1>
        </div>
      </CardContent>
    </Card>
  );
}
