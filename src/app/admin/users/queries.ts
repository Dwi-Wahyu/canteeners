"use server";

import { Prisma, Role } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";
import { UserSearchParamsType } from "@/validations/search-params/user-search-params";

export default async function getUsersDataByRole(
  searchParams: UserSearchParamsType,
  role: Role
) {
  type WhereClause = Prisma.UserWhereInput;
  let whereClause: WhereClause = {
    role,
  };

  if (searchParams.name) {
    whereClause["name"] = {
      contains: searchParams.name,
    };
  }

  const filtered = await prisma.user.count({
    where: whereClause,
  });

  const data = await prisma.user.findMany({
    take: searchParams.perPage,
    skip: (searchParams.page - 1) * searchParams.perPage,
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    include: {
      shop_owned: {
        select: {
          name: true,
        },
      },
    },
  });

  const pageCount = Math.ceil(filtered / searchParams.perPage);

  return { data, pageCount, filtered };
}

export async function getUserProfile(id: string) {
  return await prisma.user.findFirst({
    where: {
      id,
    },
    include: {
      shop_owned: {
        select: {
          id: true,
          image_url: true,
          name: true,
          payments: true,
          description: true,
          canteen: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}

export async function getUserById(id: string) {
  return await prisma.user.findFirst({
    where: {
      id,
    },
  });
}
