"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { getCanteenById } from "../queries";
import { useQuery } from "@tanstack/react-query";
import BackButton from "@/app/_components/back-button";
import { IconMap, IconStar } from "@tabler/icons-react";
import NotFoundResource from "@/app/_components/not-found-resource";
import { Skeleton } from "@/components/ui/skeleton";

export default function CanteenPageClient({ id }: { id: number }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["canteen", id],
    queryFn: async function () {
      return await getCanteenById(id);
    },
  });

  return (
    <div className="container mx-auto max-w-5xl w-full">
      <div className="mb-4 flex justify-between items-center">
        <BackButton url={"/dashboard-pelanggan"} />

        <Button variant={"outline"} size="icon">
          <Link href={`/dashboard-pelanggan/kantin/${id}/denah`}>
            <IconMap />
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-center flex-col items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>

          <Skeleton className="w-full h-48" />

          <Skeleton className="w-full h-48" />

          <Skeleton className="w-full h-48" />
        </div>
      )}

      {!isLoading && isError && <div>error</div>}

      {!isLoading && !isError && !data && <NotFoundResource />}

      {!isLoading && !isError && data && (
        <>
          <div className="text-center w-full mb-5">
            <h1 className="font-semibold text-xl">{data.name}</h1>
            <h1 className="text-muted-foreground text-lg">
              Pilih kedai yang tersedia
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.shops.map((shop) => (
              <Link
                className="flex shadow rounded-lg bg-card"
                href={`/dashboard-pelanggan/kantin/${data.id}/${shop.id}`}
                key={shop.id}
              >
                <img
                  src={"/uploads/shop/" + shop.image_url}
                  alt=""
                  className="rounded-l-lg w-2/5"
                />

                <div className="w-3/5 p-4">
                  <h1 className="font-semibold">{shop.name}</h1>
                  <p className="text-muted-foreground mb-6 line-clamp-2 text-sm">
                    {shop.description}
                  </p>

                  <div className="flex gap-1 items-center">
                    <IconStar className="w-[15px] h-[14px]" />
                    <h1 className="font-semibold">4.4</h1>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
