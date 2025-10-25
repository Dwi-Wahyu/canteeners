import { ShopCart } from "@/app/generated/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { getCustomerCart } from "./server-queries";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type CustomerCartType = NonNullable<
  Awaited<ReturnType<typeof getCustomerCart>>
>;

type ShopCartType = CustomerCartType["shopCarts"][number];

export default function ShopCartSummary({
  shopCart,
}: {
  shopCart: ShopCartType;
}) {
  return (
    <Card className="relative">
      <Badge className="absolute -top-2 -right-2">{shopCart.status}</Badge>
      <CardContent className="flex gap-4">
        <Image
          src={"/uploads/shop/" + shopCart.shop.image_url}
          alt="shop image"
          className="rounded-lg"
          width={100}
          height={100}
        />

        <div>
          <h1 className="font-semibold">{shopCart.shop.name}</h1>
          <h1 className="mb-2 text-muted-foreground">
            {shopCart._count.items} Produk
          </h1>

          <Button className="p-0 underline" variant={"link"} asChild>
            <Link href={"/dashboard-pelanggan/keranjang/" + shopCart.id}>
              Lihat Detail
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
