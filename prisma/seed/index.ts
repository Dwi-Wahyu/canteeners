import { prisma } from "@/lib/prisma";
import { seedUsers } from "./seed-users";
import { seedCanteens } from "./seed-canteens";
import { seedAppTestimony } from "./seed-app-testimony";
import { seedCategories } from "./seed-categories";

async function main() {
  // await seedCategories();
  await seedAppTestimony();
  await seedUsers();
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
