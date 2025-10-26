"use client";

import { useQuery } from "@tanstack/react-query";

import { getCustomerCart } from "./server-queries";
import LoadingCartSkeleton from "./loading-cart-skeleton";
import EmptyCart from "./empty-cart";
import ShopCartSummary from "./shop-cart-summary";

export default function CartPageClient({ userId }: { userId: string }) {
  const { data, isFetching, isError } = useQuery({
    queryKey: ["get-customer-cart"],
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
            <div>
              {data.shopCarts.map((shopCart, idx) => (
                <ShopCartSummary shopCart={shopCart} key={idx} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
