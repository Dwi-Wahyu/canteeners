"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
  const cartStore = useCartStore();

  return (
    <div>
      <h1>Cart Page</h1>

      {cartStore.items.map((item, idx) => (
        <Card key={idx}>
          <CardContent>
            <h1 className="font-semibold text-lg">{item.shopName}</h1>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
