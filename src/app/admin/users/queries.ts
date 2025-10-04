"server only";

import { Prisma, Role } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";
import { UserSearchParamsType } from "@/validations/search-params/user-search-params";

export async function getUserData(input: UserSearchParamsType) {
  type WhereClause = Prisma.UserWhereInput;
  let whereClause: WhereClause = {
    role: input.role as Role,
  };

  if (input.nama) {
    whereClause["name"] = {
      contains: input.nama,
    };
  }

  const filtered = await prisma.user.count({
    where: whereClause,
  });

  const data = await prisma.user.findMany({
    take: input.perPage,
    skip: (input.page - 1) * input.perPage,
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
  });

  const pageCount = Math.ceil(filtered / input.perPage);

  return { data, pageCount, filtered };
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
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

export async function getUserSum() {
  return await prisma.user.count();
}
