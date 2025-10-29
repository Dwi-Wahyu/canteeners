import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@/app/generated/prisma";

import { config } from "dotenv";

config();

const prisma = new PrismaClient();

const DEFAULT_AVATAR = "default-avatar.jpg";

export async function seedCustomers() {
  console.log("Memulai seeding customer...");

  const customerPassword = process.env.CUSTOMER_PASSWORD;

  if (!customerPassword) {
    console.error(
      "Variabel lingkungan tidak ditemukan. Seeding admin dibatalkan."
    );
    await prisma.$disconnect();
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(customerPassword, 10);

    const usersToSeed = [];

    usersToSeed.push({
      name: "Dwi Wahyu Ilahi Angka",
      username: "wahyu",
      password: hashedPassword,
      role: Role.CUSTOMER,
      avatar: DEFAULT_AVATAR,
    });

    const userCreationPromises = usersToSeed.map(async (userData) => {
      const user = await prisma.user.upsert({
        where: { username: userData.username },
        update: {
          name: userData.name,
          password: userData.password,
          role: userData.role,
        },
        create: {
          name: userData.name,
          username: userData.username,
          password: userData.password,
          role: userData.role,
          avatar: userData.avatar,
        },
      });

      await prisma.cart.upsert({
        where: {
          user_id: user.id,
        },
        create: {
          status: "ACTIVE",
          user_id: user.id,
        },
        update: {},
      });

      await prisma.customerProfile.upsert({
        where: {
          user_id: user.id,
        },
        create: {
          user_id: user.id,
        },
        update: {},
      });

      console.log(`Customer '${userData.username}' berhasil di-seed.`);
    });

    await Promise.all(userCreationPromises);

    console.log("Seeding customer selesai.");
  } catch (error) {
    console.error("Gagal melakukan seeding customer:", error);
  }
}
