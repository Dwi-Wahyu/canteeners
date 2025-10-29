"use client";

import { NavigationButton } from "@/app/_components/navigation-button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { getProductsByOwnerId } from "./queries";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import ProductCard from "./product-card";
import { IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

type ProductsType = Awaited<ReturnType<typeof getProductsByOwnerId>>;

export default function ProductClientPage({ owner_id }: { owner_id: string }) {
  const [productName, setProductName] = useState("");

  const { data, isPending } = useQuery({
    queryKey: ["owner-shop-product-list", productName],
    queryFn: async () => {
      return await getProductsByOwnerId(owner_id, productName);
    },
  });

  return (
    <div>
      <div className="flex justify-between mb-4 items-center">
        <h1 className="font-semibold text-lg">Daftar Produk</h1>

        {data && data.length > 0 && (
          <NavigationButton
            size={"sm"}
            url="/dashboard-kedai/produk/input"
            label="Input Produk"
            variant="default"
          />
        )}
      </div>

      <Input
        placeholder="Cari nama"
        value={productName}
        onChange={(ev) => setProductName(ev.target.value)}
      />

      {isPending && (
        <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="w-full h-44" />
          <Skeleton className="w-full h-44" />
          <Skeleton className="w-full h-44" />
        </div>
      )}

      {!isPending && data && (
        <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-3">
          {data.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      )}

      {!isPending && data && data.length === 0 && (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconTrash />
            </EmptyMedia>
            <EmptyTitle>Belum Ada Produk</EmptyTitle>
            <EmptyDescription>Mulai menambahkan produk</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <NavigationButton
              url={"/dashboard-kedai/produk/input"}
              label="Input Produk"
            />
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
