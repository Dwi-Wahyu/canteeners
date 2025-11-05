"use server";

import { prisma } from "@/lib/prisma";

export async function getCustomerOrders(customer_id: string) {
  return await prisma.order.findMany({
    where: {
      customer_id,
    },
    select: {
      id: true,
      shop: {
        select: {
          name: true,
        },
      },
      total_price: true,
      status: true,
      created_at: true,
    },
  });
}

export async function getCustomerOrderDetail(id: string) {
  return prisma.order.findFirst({
    where: {
      id,
    },
    include: {
      order_items: {
        select: {
          quantity: true,
          price: true,
          note: true,
          product: {
            select: {
              name: true,
              image_url: true,
            },
          },
        },
      },
      shop: {
        select: {
          canteen: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      testimony: true,
      customer: {
        select: {
          name: true,
          avatar: true,
          customer_profile: {
            select: {
              table_number: true,
              floor: true,
            },
          },
        },
      },
    },
  });
}
