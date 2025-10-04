import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@/app/generated/prisma";

import { config } from "dotenv";

config();

const prisma = new PrismaClient();

const DEFAULT_AVATAR = "/uploads/avatar/default-avatar.jpg";

export async function seedUsers() {
  console.log("Memulai seeding users...");

  const adminPassword = process.env.ADMIN_PASSWORD;
  const ownerPassword = process.env.OWNER_PASSWORD;

  if (!adminPassword || !ownerPassword) {
    console.error(
      "Variabel lingkungan tidak ditemukan. Seeding admin dibatalkan."
    );
    await prisma.$disconnect();
    return;
  }

  try {
    const hashedPasswordAdmin = await bcrypt.hash(adminPassword, 10);
    const hashedPasswordOwner = await bcrypt.hash(ownerPassword, 10);

    const usersToSeed = [];

    usersToSeed.push({
      name: "Administrator",
      username: "admin",
      password: hashedPasswordAdmin,
      role: Role.ADMIN,
      avatar: DEFAULT_AVATAR,
    });

    usersToSeed.push({
      name: "Ahmad Subarjo",
      username: "ahmad_subarjo",
      password: hashedPasswordOwner,
      role: Role.SHOP_OWNER,
      avatar: DEFAULT_AVATAR,
    });

    const userCreationPromises = usersToSeed.map(async (userData) => {
      await prisma.user.upsert({
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
      console.log(`Pengguna '${userData.username}' berhasil di-seed.`);
    });

    await Promise.all(userCreationPromises);

    console.log("Seeding users selesai.");
  } catch (error) {
    console.error("Gagal melakukan seeding users:", error);
  }
}
