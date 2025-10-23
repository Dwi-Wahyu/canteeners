"use client";

import { getAllShopProducts } from "./queries";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconCoin,
  IconFilterX,
  IconSearch,
  IconStar,
  IconStarFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from "@tabler/icons-react";
import ProductCard from "./product-card";
import { ProductsType } from "./type";
import { getShopDataWithPayment } from "@/app/admin/kedai/queries";
import BackButton from "@/app/_components/back-button";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { getCategories } from "@/app/admin/kategori/queries";
import { Button } from "@/components/ui/button";

export default function ShopProductList({
  shop,
  categories,
  avatar,
  canteen_id,
}: {
  shop: NonNullable<Awaited<ReturnType<typeof getShopDataWithPayment>>>;
  categories: Awaited<ReturnType<typeof getCategories>>;
  avatar: string;
  canteen_id: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductsType | []>([]);
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getAllShopProducts(shop.id, productName, categoryId).then((products) => {
      setProducts(products);
      setIsLoading(false);
    });
  }, [productName, categoryId]);

  function clearFilter() {
    setProductName("");
    setCategoryId(null);
  }

  return (
    <div>
      <div className="mb-5 flex justify-between items-center">
        <BackButton url={"/dashboard-pelanggan/kantin/" + canteen_id} />

        <div>
          <Avatar className="size-9">
            <AvatarImage src={"/uploads/avatar/" + avatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

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
            </div>
          </div>

          <div className="flex gap-5 text-accent-foreground mt-4">
            <div className="flex gap-1 items-center">
              <IconStarFilled className="w-[15px] h-[14px]" />
              <h1 className="">{shop.average_rating}</h1>
            </div>
            <div className="flex gap-1 items-center">
              <IconThumbUpFilled className="w-5 h-5" />
              <h1 className="">{shop.total_ratings} Rating</h1>
            </div>
            <div className="flex gap-1 items-center">
              <IconCoin className="w-5 h-5" />
              <h1 className="">
                {shop.minimum_price?.toLocaleString()}rb -{" "}
                {shop.maximum_price?.toLocaleString()}
                rb
              </h1>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-5 mb-2 flex justify-between items-center">
        <h1 className="font-semibold">Kategori</h1>

        <Button onClick={clearFilter} variant={"outline"} size={"icon"}>
          <IconFilterX />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-3">
        {categories.map((category) => (
          <div
            onClick={() => {
              setCategoryId(category.id);
            }}
            className="flex cursor-pointer flex-col gap-2 items-center"
            key={category.id}
          >
            <Image
              src={"/uploads/category/" + category.image_url}
              alt="category image"
              width={120}
              height={120}
              className={`rounded-full p-1 shadow ${
                category.id === categoryId && "outline-4"
              }`}
            />
            <h1 className="text-sm text-muted-foreground">{category.name}</h1>
          </div>
        ))}
      </div>

      {/* <div className="relative">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
          <IconSearch className="size-4" />
          <span className="sr-only">User</span>
        </div>
        <Input
          placeholder="Cari nama produk"
          value={productName}
          onChange={(ev) => setProductName(ev.target.value)}
          className="peer pl-9"
        />
      </div> */}

      {isLoading ? (
        <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="w-full h-52" />
          <Skeleton className="w-full h-52" />
          <Skeleton className="w-full h-52" />
        </div>
      ) : (
        <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              product={product}
              shopId={shop.id}
              ownerId={shop.owner_id}
              shopName={shop.name}
              key={product.id}
              availablePaymentMethod={shop.payments.map(
                (payment) => payment.method
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
