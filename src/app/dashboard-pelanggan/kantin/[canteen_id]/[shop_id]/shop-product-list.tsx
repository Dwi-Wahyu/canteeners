"use client";

import { getAllShopProducts } from "./queries";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { IconSearch } from "@tabler/icons-react";
import ProductCard from "./product-card";
import { ProductsType } from "./type";
import { getShopDataWithPayment } from "@/app/admin/kedai/queries";

export default function ShopProductList({
  shop,
}: {
  shop: NonNullable<Awaited<ReturnType<typeof getShopDataWithPayment>>>;
}) {
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
      <div className="mb-4">
        <h1 className="font-semibold text-lg">{shop.name}</h1>
        <h1 className="text-muted-foreground">{shop.description}</h1>
      </div>

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
