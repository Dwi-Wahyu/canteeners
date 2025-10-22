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
      maps: true,
      qrcodes: true,
      shops: true,
    },
  });
}
