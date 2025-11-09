"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  IconMessageCircleUser,
  IconStar,
  IconThumbUp,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { getShopRatings, getShopTestimonies } from "../server-queries";

export default function ShopDashboardTestimonyClient({
  shopRatings,
  owner_id,
}: {
  shopRatings: NonNullable<Awaited<ReturnType<typeof getShopRatings>>>;
  owner_id: string;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["shop-testimony-display", owner_id],
    queryFn: async () => {
      return await getShopTestimonies(owner_id);
    },
  });

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center gap-1">
            <h1 className="font-semibold text-lg">Rating Toko</h1>
            <div className="flex gap-1 items-center">
              <IconStar className="w-5 h-5" />
              <h1 className="font-semibold text-lg">
                {shopRatings.average_rating.toFixed(1)}{" "}
              </h1>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center gap-1">
            <h1 className="font-semibold text-lg">Jumlah Ulasan</h1>
            <div className="flex gap-1 items-center">
              <IconThumbUp className="w-5 h-5" />
              <h1 className="font-semibold text-lg">
                {shopRatings.total_ratings}{" "}
              </h1>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading && (
        <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="w-full h-52" />
          <Skeleton className="w-full h-52" />
          <Skeleton className="w-full h-52" />
        </div>
      )}

      {!isLoading && !data && <EmptyTestimony />}

      {!isLoading && data && data.length === 0 && <EmptyTestimony />}

      {!isLoading && data && data.length > 0 && (
        <div className="flex flex-col gap-4">
          {data.map((testimony, idx) => (
            <Card key={idx}>
              <CardContent className="flex gap-3 items-start">
                <Avatar>
                  <AvatarImage
                    src={"/uploads/avatar/" + testimony.order.customer.avatar}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="w-full">
                  <div className="flex gap-1 items-center justify-between">
                    <h1 className="font-semibold">
                      {testimony.order.customer.name}
                    </h1>

                    <div className="flex gap-1 items-center">
                      <IconStar className="w-4 h-4" />
                      <h1 className="font-semibold">{testimony.rating}</h1>
                    </div>
                  </div>
                  <h1>{testimony.message}</h1>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyTestimony() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconMessageCircleUser />
        </EmptyMedia>
        <EmptyTitle>Belum Ada Ulasan</EmptyTitle>
        <EmptyDescription>
          Berikan pelayanan terbaik agar pelanggan memberikan ulasan positif
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
