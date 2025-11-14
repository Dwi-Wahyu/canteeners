import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@/app/generated/prisma";

import { config } from "dotenv";

config();

const prisma = new PrismaClient();

export async function seedShops() {
  console.log("Memulai seeding shop...");

  try {
    const owner = await prisma.user.findFirst({
      where: {
        username: "ahmad_subarjo",
      },
    });

    if (!owner) {
      console.error("Gagal melakukan seeding shop");
      return;
    }

    const created = await prisma.shop.create({
      data: {
        owner_id: owner.id,
        name: "Kedai Subarjo",
        canteen_id: 1,
        image_url: "kedai-subarjo.webp",
      },
    });

    console.log("Seeding shop selesai.");
  } catch (error) {
    console.error("Gagal melakukan seeding shop:", error);
  }
}
