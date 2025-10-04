"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { SignUpSchemaType } from "@/validations/schemas/auth";
import bcrypt from "bcryptjs";

export async function SignUpCustomer(
  payload: SignUpSchemaType
): Promise<ServerActionReturn<void>> {
  try {
    const { password, ...data } = payload;

    const hashedPassword = await bcrypt.hash(password, 10);

    const created = await prisma.user.create({
      data: { ...data, password: hashedPassword, role: "CUSTOMER" },
    });

    console.log(created);

    return successResponse(
      undefined,
      "Berhasil melakukan pendaftaran, silakan login"
    );
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}
