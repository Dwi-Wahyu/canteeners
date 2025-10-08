"use client";

import { useSession } from "next-auth/react";
import { getAllShopProducts } from "./queries";
import { useEffect, useState } from "react";
import LoadingUserSessionPage from "@/app/_components/loading-user-session-page";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { Input } from "@/components/ui/input";
import { Product, Shop } from "@/app/generated/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconSearch,
  IconShoppingCart,
  IconShoppingCartCopy,
  IconShoppingCartOff,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import ProductCard from "./product-card";
import { OrderItemType, ProductsType } from "./type";
import OrderDetailDialog from "./order-detail-dialog";

export default function ShopProductList({
  shop,
  isLoggedIn,
  customerId,
}: {
  shop: Shop;
  isLoggedIn: boolean;
  customerId?: string;
}) {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductsType | []>([]);
  const [productName, setProductName] = useState("");
  const [ordering, toggleOrdering] = useState(false);

  const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);

  const [showOrderDetails, toggleShowOrderDetails] = useState(false);

  const processAddItem = (product: Product, quantity: number) => {
    if (quantity === 0) return;

    const itemExists = orderItems.some(
      (item) => item.product_id === product.id
    );

    if (!itemExists) {
      const newOrderItem = {
        product_id: product.id,
        quantity: quantity,
        price: product.price,
        product_name: product.name,
      };
      setOrderItems((prev) => [...prev, newOrderItem]);
    } else {
      setOrderItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getAllShopProducts(shop.id, productName).then((products) => {
      setProducts(products);
      setIsLoading(false);
    });
  }, [session.data, productName]);

  if (session.status === "loading") {
    return <LoadingUserSessionPage />;
  }

  function clickToggleOrdering() {
    if (ordering) {
      toast.warning("Membatalkan pesanan");
    } else {
      toast.info("Silakan pilih produk");
    }

    toggleOrdering((prev) => !prev);
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-2 items-center">
        <div>
          <h1 className="font-semibold text-lg">{shop.name}</h1>
          <h1 className="text-muted-foreground">{shop.description}</h1>
        </div>

        <div className="flex w-full gap-2 flex-col md:flex-row items-center">
          <Button
            onClick={clickToggleOrdering}
            variant={ordering ? "destructive" : "default"}
            className="w-full md:w-fit"
            size="lg"
            disabled={!isLoggedIn}
          >
            {ordering ? (
              <>
                <IconShoppingCartOff /> Batalkan
              </>
            ) : (
              <>
                <IconShoppingCart /> Buat Pesanan
              </>
            )}
          </Button>

          {ordering && (
            <Button
              onClick={() => toggleShowOrderDetails(true)}
              disabled={orderItems.length === 0}
              size="lg"
              className="w-full md:w-fit"
            >
              <IconShoppingCartCopy />
              Checkout
            </Button>
          )}
        </div>
      </div>

      <OrderDetailDialog
        showOrderDetails={showOrderDetails}
        toggleShowOrderDetails={toggleShowOrderDetails}
        orderItems={orderItems}
        shopOwnerId={shop.owner_id}
        shopId={shop.id}
        customerId={customerId ?? ""} // fix ini cari cara pastikan customer id non nullable
      />

      {ordering && orderItems.length === 0 && (
        <Alert className="mb-4">
          <CircleAlertIcon />
          <AlertTitle>Pilih Minimal 1 Produk</AlertTitle>
        </Alert>
      )}

      {!isLoggedIn && (
        <Alert className="mb-4">
          <CircleAlertIcon />
          <AlertTitle>Anda Belum Bisa Membuat Pesanan</AlertTitle>
          <AlertDescription className="underline underline-offset-2">
            <Link href={"/auth/signin"}>
              Silahkan login atau mendaftar terlebih dahulu
            </Link>
          </AlertDescription>
        </Alert>
      )}

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
              ordering={ordering}
              onAddItem={processAddItem}
              key={product.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
