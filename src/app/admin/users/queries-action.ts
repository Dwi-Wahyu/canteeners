"use server";

import { prisma } from "@/lib/prisma";

export async function getUserProfile(id: string) {
  return await prisma.user.findFirst({
    where: {
      id,
    },
    include: {
      shop_owned: {
        select: {
          id: true,
          image_url: true,
          name: true,
          payments: true,
          description: true,
          canteen: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}
