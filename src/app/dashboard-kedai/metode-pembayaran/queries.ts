"use server";

import { prisma } from "@/lib/prisma";

export async function getShopPayments(owner_id: string) {
  return await prisma.payment.findMany({
    where: {
      shop: {
        owner_id,
      },
    },
  });
}
