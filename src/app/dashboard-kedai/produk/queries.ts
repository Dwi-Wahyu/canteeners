"use server";

import { prisma } from "@/lib/prisma";

export async function getProductsByOwnerId(owner_id: string, name: string) {
  return await prisma.product.findMany({
    where: {
      shop: {
        owner_id,
      },
      name: {
        contains: name,
      },
    },
  });
}

export async function getProductIncludeCategory(id: string) {
  return await prisma.product.findFirst({
    where: {
      id,
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      options: true,
    },
  });
}
