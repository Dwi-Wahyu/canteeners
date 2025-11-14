"use server";

import { Prisma } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";
import { OrderSearchParamsType } from "@/validations/search-params/order-search-params";

export async function getShopOrders({
  input,
  shop_id,
}: {
  input: OrderSearchParamsType;
  shop_id: string;
}) {
  type WhereClause = Prisma.OrderWhereInput;
  let whereClause: WhereClause = {
    shop_id,
  };

  if (input.name) {
    whereClause["customer"] = {
      name: {
        contains: input.name,
      },
    };
  }

  const filtered = await prisma.order.count({
    where: whereClause,
  });

  const data = await prisma.order.findMany({
    take: input.perPage,
    skip: (input.page - 1) * input.perPage,
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    include: {
      _count: {
        select: {
          order_items: true,
        },
      },
      customer: {
        select: {
          name: true,
        },
      },
    },
  });

  const pageCount = Math.ceil(filtered / input.perPage);

  return { data, pageCount, filtered };
}
