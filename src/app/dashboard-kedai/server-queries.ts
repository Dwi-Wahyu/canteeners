"use server";

import { prisma } from "@/lib/prisma";
import { OrderStatus, Prisma, RefundStatus } from "../generated/prisma";

export async function getShopStatus({
  id,
  open_time,
  close_time,
}: {
  id: string;
  open_time: Date | null;
  close_time: Date | null;
}) {
  const shop = await prisma.shop.findFirst({
    where: {
      id,
    },
  });

  if (!shop) {
    return "INACTIVE";
  }

  if (shop.status === "SUSPENDED") {
    return "SUSPENDED";
  }

  if (!open_time || !close_time) {
    return shop.status;
  }

  const now = new Date();

  //   if (now >= open_time && now <= close_time) {
  //     return "ACTIVE";
  //   } else {
  //     return "INACTIVE";
  //   }

  return shop.status;
}

export async function getShopTestimonies(owner_id: string) {
  return await prisma.shopTestimony.findMany({
    where: {
      order: {
        shop: {
          owner_id,
        },
      },
    },
    include: {
      order: {
        select: {
          id: true,
          customer: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
}

export async function getShopRatings(owner_id: string) {
  return await prisma.shop.findFirst({
    where: {
      owner_id,
    },
    select: {
      average_rating: true,
      total_ratings: true,
    },
  });
}

export async function calculateShopNetProfit(
  shopId: string,
  startDate?: Date,
  endDate?: Date
): Promise<{
  profit: number;
  totalRevenue: number;
  totalCost: number;
  totalRefund: number;
}> {
  const revenueResult = await prisma.order.aggregate({
    where: {
      shop_id: shopId,
      status: OrderStatus.COMPLETED,
      ...(startDate && { created_at: { gte: startDate } }),
      ...(endDate && { created_at: { lte: endDate } }),
    },
    _sum: { total_price: true },
  });

  const costRaw = await prisma.$queryRaw<Array<{ total_cost: number }>>`
  SELECT COALESCE(SUM(oi.quantity * p.cost), 0) AS total_cost
  FROM \`order_items\` AS oi
  JOIN \`orders\` AS o ON oi.order_id = o.id
  JOIN \`products\` AS p ON oi.product_id = p.id
  WHERE o.shop_id = ${shopId}
    AND o.status = 'COMPLETED'
    ${startDate ? Prisma.sql` AND o.created_at >= ${startDate}` : Prisma.sql``}
    ${endDate ? Prisma.sql` AND o.created_at <= ${endDate}` : Prisma.sql``}
`;

  const refundResult = await prisma.refund.aggregate({
    where: {
      order: {
        shop_id: shopId,
        status: OrderStatus.COMPLETED,
        ...(startDate && { created_at: { gte: startDate } }),
        ...(endDate && { created_at: { lte: endDate } }),
      },
      status: RefundStatus.PROCESSED,
    },
    _sum: { amount: true },
  });

  const totalRevenue = revenueResult._sum.total_price ?? 0;
  const totalCost = Number(costRaw[0]?.total_cost ?? 0);
  const totalRefund = refundResult._sum.amount ?? 0;

  const profit = totalRevenue - totalCost - totalRefund;

  return { profit, totalRevenue, totalCost, totalRefund };
}

export async function getHomeShopMetrics(shop_id: string) {
  const profit = await calculateShopNetProfit(shop_id);

  const orderCompleted = await prisma.order.count({
    where: {
      shop_id,
      status: "COMPLETED",
    },
  });

  const orderNotCompleted = await prisma.order.count({
    where: {
      shop_id,
      status: {
        notIn: ["COMPLETED", "CANCELLED", "REJECTED"],
      },
    },
  });

  return { profit, orderCompleted, orderNotCompleted };
}
