// import { PrismaClient } from "@/app/generated/prisma";
// import { withAccelerate } from "@prisma/extension-accelerate";

// export const prisma = new PrismaClient().$extends(withAccelerate());

import { PrismaClient } from "@/app/generated/prisma";

export const prisma = new PrismaClient();
