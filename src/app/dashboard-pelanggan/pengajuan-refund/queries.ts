"use server";

import { prisma } from "@/lib/prisma";

export async function getCustomerRefunds(customer_id: string) {
  return;
}

export async function getCustomerRefund(id: string) {
  return await prisma.refund.findFirst({
    where: {
      id,
    },
    include: {
      order: {
        select: {
          id: true,
          conversation_id: true,
          payment_method: true,
          customer_id: true,
          shop: {
            select: {
              name: true,
              owner: {
                select: {
                  name: true,
                  avatar: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
