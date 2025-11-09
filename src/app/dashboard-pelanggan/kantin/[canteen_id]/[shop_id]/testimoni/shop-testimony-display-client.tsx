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
import { IconMessageCircleUser, IconStar } from "@tabler/icons-react";
import { getShopTestimonies } from "./queries";
import { Card, CardContent } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ShopTestimonyDisplayClient({
  shop_id,
}: {
  shop_id: string;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["shop-testimony-display", shop_id],
    queryFn: async () => {
      return await getShopTestimonies(shop_id);
    },
  });

  return (
    <div>
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
        <div>
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
        <EmptyTitle>Belum Ada Testimoni</EmptyTitle>
        <EmptyDescription>
          Belum ada testimoni dari pelanggan. Jadilah yang pertama memberikan
          pengalamanmu!
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
