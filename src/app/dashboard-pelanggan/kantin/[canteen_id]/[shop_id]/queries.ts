"use server";

import { Prisma } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";

export async function getAllShopProducts({
  product_name,
  category_id,
  shop_id,
}: {
  shop_id: string;
  product_name: string;
  category_id: number | null;
}) {
  type ProductWhereClause = Prisma.ProductWhereInput;

  const whereClause: ProductWhereClause = {
    shop_id,
    name: {
      contains: product_name,
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
