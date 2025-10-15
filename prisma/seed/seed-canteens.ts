import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function seedCanteens() {
  console.log("Memulai seeding kantin...");
  try {
    await prisma.canteen.createMany({
      data: [
        {
          name: "Kantin Kudapan",
          image_url: "kudapan.webp",
        },
        {
          name: "Kantin Sastra",
          image_url: "kansas.jpeg",
        },
      ],
    });
    // await prisma.canteen.createMany({
    //   data: [
    //     {
    //       name: "Kantin Sosiologi",
    //       image_url: "kansos.webp",
    //     },
    //   ],
    // });
  } catch (error) {
    console.error("Gagal melakukan seeding kantin:", error);
  }
}
