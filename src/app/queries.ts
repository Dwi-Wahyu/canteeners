"server only";

import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const date = new Date();

  const nowYear = date.getFullYear();
  const lastYear = nowYear - 1;

  //   const nowYearProjects = await prisma.regional.findMany({
  //     select: {
  //       _count: {
  //         select: {
  //           projects: {
  //             where: {
  //               year: nowYear.toString(),
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   const regionals = await prisma.regional.findMany();

  // const nowYearProjects = await prisma.project.findMany({
  //     where: {
  //         year: nowYear.toString()
  //     }
  // })

  // const lastYearProjects = await prisma.project.groupBy({
  //     by: "regional_id",
  //     where: {
  //         year: lastYear.toString()
  //     },
  // })
}
