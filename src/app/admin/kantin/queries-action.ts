"use server";

import { prisma } from "@/lib/prisma";

export async function getShopPayments(shop_id: string) {
  return await prisma.payment.findMany({
    where: {
      shop_id,
    },
  });
}

export async function getShopPayment(payment_id: number) {
  return await prisma.payment.findFirst({
    where: {
      id: payment_id,
    },
  });
}
