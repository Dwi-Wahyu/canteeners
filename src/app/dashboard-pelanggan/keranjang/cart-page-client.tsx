"use client";

import { useQuery } from "@tanstack/react-query";

import { getCustomerCart } from "./server-queries";
import LoadingCartSkeleton from "./loading-cart-skeleton";
import EmptyCart from "./empty-cart";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { shopCartStatusMapping } from "@/constant/cart-status-mapping";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import CustomBadge from "@/components/custom-badge";
import { ShopCartStatus } from "@/app/generated/prisma";

export default function CartPageClient({ userId }: { userId: string }) {
  const { data, isFetching, isError } = useQuery({
    queryKey: ["customer-cart", userId],
    queryFn: async () => {
      return await getCustomerCart(userId);
    },
  });

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
            <div className="flex flex-col gap-7">
              {data.shopCarts.map((shopCart, idx) => (
                <Link
                  href={"/dashboard-pelanggan/keranjang/" + shopCart.id}
                  key={idx}
                >
                  <Card className="relative">
                    <div className="absolute -top-3 -right-2">
                      <CustomBadge
                        value={shopCart.status}
                        successValues={[
                          ShopCartStatus.ORDERED,
                          ShopCartStatus.PENDING,
                        ]}
                        destructiveValues={[ShopCartStatus.REMOVED]}
                      >
                        {shopCartStatusMapping[shopCart.status]}
                      </CustomBadge>
                    </div>
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
                        <h1 className="text-muted-foreground">
                          {shopCart._count.items} Produk
                        </h1>
                        <h1 className="text-sm text-muted-foreground ">
                          {formatDateToYYYYMMDD(shopCart.created_at)}{" "}
                          {formatToHour(shopCart.created_at)}
                        </h1>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
