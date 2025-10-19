"server only";

import { prisma } from "@/lib/prisma";

export async function getShopById(owner_id: string) {
  return await prisma.shop.findFirst({
    where: {
      owner_id,
    },
  });
}
