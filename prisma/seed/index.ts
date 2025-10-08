import { prisma } from "@/lib/prisma";
import { seedUsers } from "./seed-users";
import { seedCanteens } from "./seed-canteens";

async function main() {
  // await seedUsers();
  await seedCanteens();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
