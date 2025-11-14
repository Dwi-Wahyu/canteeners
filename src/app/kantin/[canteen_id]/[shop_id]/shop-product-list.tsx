"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Shop } from "@/app/generated/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import { IconSearch } from "@tabler/icons-react";
import ProductCard from "./product-card";
import { useQuery } from "@tanstack/react-query";
import { getAllShopProducts } from "@/app/dashboard-pelanggan/kantin/[canteen_id]/[shop_id]/queries";

export default function ShopProductList({ shop }: { shop: Shop }) {
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["shop-product-list", shop.id],
    queryFn: async () => {
      return await getAllShopProducts({
        category_id: categoryId,
        product_name: productName,
        shop_id: shop.id,
      });
    },
  });

  return (
    <div>
      <div className="mb-4 gap-2">
        <h1 className="font-semibold text-lg">{shop.name}</h1>
        <h1 className="text-muted-foreground">{shop.description}</h1>
      </div>

      <div className="relative">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
          <IconSearch className="size-4" />
          <span className="sr-only">Product Name</span>
        </div>
        <Input
          placeholder="Cari nama produk"
          value={productName}
          onChange={(ev) => setProductName(ev.target.value)}
          className="peer pl-9"
        />
      </div>

      {isFetching && (
        <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="w-full h-52" />
          <Skeleton className="w-full h-52" />
          <Skeleton className="w-full h-52" />
        </div>
      )}

      {!isFetching && data && data.length > 0 && (
        <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-3">
          {data.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      )}
    </div>
  );
}
