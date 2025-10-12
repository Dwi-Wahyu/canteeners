"use client";

import { getAllShopProducts } from "./queries";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Shop } from "@/app/generated/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import ProductCard from "./product-card";
import { ProductsType } from "./type";
import { useRouter } from "nextjs-toploader/app";

export default function ShopProductList({ shop }: { shop: Shop }) {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductsType | []>([]);
  const [productName, setProductName] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getAllShopProducts(shop.id, productName).then((products) => {
      setProducts(products);
      setIsLoading(false);
    });
  }, [productName]);

  return (
    <div>
      <div className="mb-4 gap-2">
        <h1 className="font-semibold text-lg">{shop.name}</h1>
        <h1 className="text-muted-foreground">{shop.description}</h1>
      </div>

      <Alert className="mb-4">
        <CircleAlertIcon />
        <AlertTitle>Anda Belum Bisa Membuat Pesanan</AlertTitle>
        <AlertDescription className="underline underline-offset-2">
          <Link href={"/auth/signin"}>
            Silahkan login atau mendaftar terlebih dahulu
          </Link>
        </AlertDescription>
      </Alert>

      <div className="relative">
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
      </div>

      {isLoading ? (
        <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="w-full h-52" />
          <Skeleton className="w-full h-52" />
          <Skeleton className="w-full h-52" />
        </div>
      ) : (
        <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      )}
    </div>
  );
}
