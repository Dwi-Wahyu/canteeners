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

export async function getCanteenWithAllRelations(id: number) {
  return await prisma.canteen.findFirst({
    where: {
      id,
    },
    include: {
      maps: {
        orderBy: {
          floor: "asc",
        },
        include: {
          qrcodes: true,
        },
      },
      qrcodes: true,
      shops: true,
    },
  });
}

export async function getCanteenMap(id: number) {
  return await prisma.canteenMap.findFirst({
    where: { id },
    include: {
      canteen: {
        select: {
          name: true,
          id: true,
        },
      },
      qrcodes: {
        orderBy: {
          table_number: "asc",
        },
      },
    },
  });
}
