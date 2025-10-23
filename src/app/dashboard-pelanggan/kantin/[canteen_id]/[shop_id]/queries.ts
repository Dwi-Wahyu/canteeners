"use server";

import { Prisma } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";

export async function getAllShopProducts(
  shop_id: string,
  productName: string,
  category_id: number | null
) {
  type ProductWhereClause = Prisma.ProductWhereInput;

  const whereClause: ProductWhereClause = {
    shop_id,
    name: {
      contains: productName,
    },
  };

  if (category_id) {
    whereClause["categories"] = {
      every: {
        category_id,
      },
    };
  }

  return await prisma.product.findMany({
    where: whereClause,
  });
}
