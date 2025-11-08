"use client";

import { getAllShopProducts } from "./queries";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconCoin,
  IconFilterX,
  IconMessageCircleUser,
  IconSearch,
  IconShoppingCart,
  IconStarFilled,
  IconThumbUpFilled,
  IconUserExclamation,
} from "@tabler/icons-react";
import { getShopDataWithPayment } from "@/app/admin/kedai/queries";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { getCategories } from "@/app/admin/kategori/queries";

import ShopCategoryScroller from "./shop-category-scroller";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import NoProductFound from "./no-product-found";
import ProductCard from "./product-card";
import Link from "next/link";
import { CustomerProfile } from "@/app/generated/prisma";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ShopProductList({
  shop,
  categories,
  cart_id,
  customer_profile,
}: {
  shop: NonNullable<Awaited<ReturnType<typeof getShopDataWithPayment>>>;
  categories: Awaited<ReturnType<typeof getCategories>>;
  cart_id: string;
  customer_profile: CustomerProfile;
}) {
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["shop-product-list", shop.id, productName, categoryId],
    queryFn: async () => {
      return await getAllShopProducts(shop.id, productName, categoryId);
    },
  });

  function clearFilter() {
    setProductName("");
    setCategoryId(null);
  }

  return (
    <div className="relative">
      <Link
        href={"/dashboard-pelanggan/keranjang/"}
        className="p-4 bg-primary w-fit fixed bottom-5 right-7 text-primary-foreground rounded-full hover:scale-105 transition-all ease-in-out shadow"
      >
        <IconShoppingCart />
      </Link>

      {customer_profile.suspend_until !== null && (
        <Alert variant="destructive" className="mb-4">
          <IconUserExclamation />
          <AlertTitle>Anda Sedang Disuspend</AlertTitle>
          <AlertDescription>
            <Link
              href={"/dashboard-pelanggan/pelanggaran"}
              className="underline"
            >
              lihat pelanggaran
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent>
          <div className="flex gap-4">
            <Image
              className="w-40 rounded-lg"
              src={"/uploads/shop/" + shop.image_url}
              alt="shop image"
              width={80}
              height={60}
            />

            <div>
              <h1 className="font-semibold">{shop.name}</h1>
              <h1 className="text-muted-foreground">{shop.description}</h1>

              <Button asChild variant={"outline"} size={"sm"} className="mt-2">
                <Link
                  href={`/dashboard-pelanggan/kantin/${shop.canteen_id}/${shop.id}/testimoni`}
                >
                  <IconMessageCircleUser />
                  Lihat testimoni
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex gap-5 text-accent-foreground mt-4">
            <div className="flex gap-1 items-center">
              <IconStarFilled className="w-[15px] h-[14px]" />
              <h1 className="">{shop.average_rating}</h1>
            </div>
            <div className="flex gap-1 items-center">
              <IconThumbUpFilled className="w-5 h-5" />
              <h1 className="">{shop.total_ratings}</h1>
            </div>

            {shop.minimum_price && shop.maximum_price && (
              <div className="flex gap-1 items-center">
                <IconCoin className="w-5 h-5" />
                <h1 className="">
                  Rp {shop.minimum_price} - Rp {shop.maximum_price}
                </h1>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex mt-5 gap-4 items-center">
        <div className="relative">
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
            <IconSearch className="size-4" />
            <span className="sr-only">Product</span>
          </div>
          <Input
            placeholder="Cari nama produk"
            value={productName}
            onChange={(ev) => setProductName(ev.target.value)}
            className="peer pl-9"
          />
        </div>

        <Button size={"lg"} onClick={clearFilter}>
          <IconFilterX />
        </Button>
      </div>

      <ShopCategoryScroller
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        categories={categories}
      />

      {isLoading && (
        <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="w-full h-52" />
          <Skeleton className="w-full h-52" />
          <Skeleton className="w-full h-52" />
        </div>
      )}

      {!isLoading && !data && (
        <NoProductFound
          clearFilterButton={
            <Button onClick={clearFilter}>
              <IconFilterX />
              Bersihkan filter
            </Button>
          }
        />
      )}

      {!isLoading && data && data.length === 0 && (
        <NoProductFound
          clearFilterButton={
            <Button onClick={clearFilter}>
              <IconFilterX />
              Bersihkan filter
            </Button>
          }
        />
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-3">
          {data.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cart_id={cart_id}
              add_to_cart_disabled={customer_profile.suspend_until !== null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
