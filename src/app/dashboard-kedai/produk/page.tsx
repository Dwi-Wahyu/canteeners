"use client";

import LoadingUserSessionPage from "@/app/_components/loading-user-session-page";
import { NavigationButton } from "@/app/_components/navigation-button";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getProductsByOwnerId } from "./queries";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import ProductCard from "./product-card";

type ProductsType = Awaited<ReturnType<typeof getProductsByOwnerId>>;

export default function ProductPage() {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductsType | []>([]);
  const [productName, setProductName] = useState("");

  useEffect(() => {
    if (session.data) {
      setIsLoading(true);
      getProductsByOwnerId(session.data.user.id, productName).then(
        (products) => {
          setProducts(products);
          setIsLoading(false);
        }
      );
    }
  }, [session.data, productName]);

  if (session.status === "loading") {
    return <LoadingUserSessionPage />;
  }

  if (!session.data) {
    return <UnauthorizedPage />;
  }

  return (
    <div>
      <div className="flex justify-between mb-4 items-center">
        <h1 className="font-semibold text-lg">Daftar Produk</h1>

        <NavigationButton
          size={"sm"}
          url="/dashboard-kedai/produk/input"
          label="Input Produk"
          variant="default"
        />
      </div>

      <Input
        placeholder="Cari nama"
        value={productName}
        onChange={(ev) => setProductName(ev.target.value)}
      />

      {isLoading ? (
        <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="w-full h-44" />
          <Skeleton className="w-full h-44" />
          <Skeleton className="w-full h-44" />
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
