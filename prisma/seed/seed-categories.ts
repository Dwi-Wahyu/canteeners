import { PrismaClient } from "@/app/generated/prisma";
import { generateCategorySlug } from "@/helper/generate-category-slug";

const prisma = new PrismaClient();

export async function seedCategories() {
  console.log("Memulai seeding kategori...");
  try {
    const categories = await prisma.category.findMany();

    for (const category of categories) {
      await prisma.category.update({
        where: {
          id: category.id,
        },
        data: {
          slug: generateCategorySlug(category.name),
        },
      });
    }
  } catch (error) {
    console.error("Gagal melakukan seeding kantin:", error);
  }
}
