"server only";

import { prisma } from "@/lib/prisma";

export async function getShopDataWithPayment(id: string) {
  return await prisma.shop.findFirst({
    where: {
      id,
    },
    include: {
      payments: true,
    },
  });
}
