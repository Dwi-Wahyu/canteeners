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
          owner: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}
