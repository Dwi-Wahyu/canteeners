"use server";

import { prisma } from "@/lib/prisma";

export async function getShops() {
  return await prisma.shop.findMany();
}
