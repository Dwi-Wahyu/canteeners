"use server";

import { prisma } from "@/lib/prisma";

export async function getCustomerViolation(customer_id: string) {
  return await prisma.user.findFirst({
    where: {
      id: customer_id,
    },
    include: {
      customer_violations: true,
      customer_profile: {
        select: {
          suspend_reason: true,
          suspend_until: true,
        },
      },
    },
  });
}
