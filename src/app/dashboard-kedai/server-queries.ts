"use server";

import { prisma } from "@/lib/prisma";

export async function getShopStatus({
  id,
  open_time,
  close_time,
}: {
  id: string;
  open_time: Date | null;
  close_time: Date | null;
}) {
  const shop = await prisma.shop.findFirst({
    where: {
      id,
    },
  });

  if (!shop) {
    return "INACTIVE";
  }

  if (shop.status === "SUSPENDED") {
    return "SUSPENDED";
  }

  if (!open_time || !close_time) {
    return shop.status;
  }

  const now = new Date();

  //   if (now >= open_time && now <= close_time) {
  //     return "ACTIVE";
  //   } else {
  //     return "INACTIVE";
  //   }

  return shop.status;
}

export async function getShopTestimonies(owner_id: string) {
  return await prisma.shopTestimony.findMany({
    where: {
      order: {
        shop: {
          owner_id,
        },
      },
    },
    include: {
      order: {
        select: {
          id: true,
          customer: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
}

export async function getShopRatings(owner_id: string) {
  return await prisma.shop.findFirst({
    where: {
      owner_id,
    },
    select: {
      average_rating: true,
      total_ratings: true,
    },
  });
}
