"use client";

import Link from "next/link";
import { getCanteenById } from "../queries";
import { useQuery } from "@tanstack/react-query";
import BackButton from "@/app/_components/back-button";
import { IconMap, IconStar } from "@tabler/icons-react";
import NotFoundResource from "@/app/_components/not-found-resource";
import { Skeleton } from "@/components/ui/skeleton";
import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import { NavigationButton } from "@/app/_components/navigation-button";

export default function CanteenPageClient({ id }: { id: number }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["canteen", id],
    queryFn: async function () {
      return await getCanteenById(id);
    },
  });

  return (
    <div className="">
      <TopbarWithBackButton
        title={!isLoading && data ? data.name : "Kantin"}
        backUrl={"/dashboard-pelanggan"}
        actionButton={
          <Link href={`/dashboard-pelanggan/kantin/${id}/denah`}>
            <IconMap className="w-5 h-5 text-muted-foreground" />
          </Link>
        }
      />

      {isLoading && (
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-48" />

          <Skeleton className="w-full h-48" />

          <Skeleton className="w-full h-48" />
        </div>
      )}

      {!isLoading && isError && <div>error</div>}

      {!isLoading && !isError && !data && <NotFoundResource />}

      {!isLoading && !isError && data && (
        <>
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
                    <h1 className="font-semibold">{shop.average_rating}</h1>
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
