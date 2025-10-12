"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { getCanteenById } from "../queries";
import { useQuery } from "@tanstack/react-query";
import BackButton from "@/app/_components/back-button";

export default function CanteenPageClient({ id }: { id: number }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["canteen", id],
    queryFn: async function () {
      return await getCanteenById(id);
    },
  });

  return (
    <div className="container mx-auto max-w-5xl w-full">
      <div className="mb-4 flex justify-between items-center">
        <BackButton />

        <Button size="icon">
          <Link href={"/dashboard-pelanggan/keranjang"}>
            <ShoppingBasket />
          </Link>
        </Button>
      </div>

      {isLoading && <div>loading . . .</div>}

      {!isLoading && isError && <div>error</div>}

      {!isLoading && !isError && !data && <div>kantin tidak ditemukan</div>}

      {!isLoading && !isError && data && (
        <>
          <div className="text-center w-full">
            <h1 className="font-semibold text-xl">{data.name}</h1>
            <h1 className="text-muted-foreground text-lg">
              Pilih kedai yang tersedia
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
            {data.shops.map((shop) => (
              <Link
                className="group"
                href={`/dashboard-pelanggan/kantin/${data.id}/${shop.id}`}
                key={shop.id}
              >
                <Card>
                  <CardContent>
                    <h1 className="font-semibold text-lg">{shop.name}</h1>
                    <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                      {shop.description}
                    </p>

                    <div className="w-full rounded-lg overflow-hidden">
                      <img
                        src={shop.image_url}
                        alt=""
                        className="w-full rounded-lg group-hover:scale-105 ease-in-out transition-all duration-300"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
