"use server";

import { prisma } from "@/lib/prisma";

export async function getCanteens() {}

export async function getCanteenById(id: number) {
  return await prisma.canteen.findFirst({
    where: {
      id,
    },
    include: {
      shops: {
        select: {
          name: true,
          id: true,
          image_url: true,
          description: true,
          status: true,
          average_rating: true,
          open_time: true,
          close_time: true,
          owner: {
            select: {
              name: true,
            },
          },
        },
      },
      maps: {
        select: {
          image_url: true,
          floor: true,
        },
      },
    },
  });
}

export async function getCustomerSelectedTable(user_id: string) {
  return await prisma.customerProfile.findFirst({
    where: {
      user_id,
      canteen_id: {
        not: null,
      },
      floor: {
        not: null,
      },
      table_number: {
        not: null,
      },
    },
    select: {
      canteen_id: true,
      floor: true,
      table_number: true,
    },
  });
}
