"use server";

import { auth } from "@/config/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { ChangePasswordSchemaType } from "@/validations/schemas/change-password";
import { ServerActionReturn } from "@/types/server-action";
import { PrismaClientKnownRequestError } from "../../generated/prisma/runtime/library";
import { compare, genSalt, hash } from "bcryptjs";

export async function changePassword(
  payload: ChangePasswordSchemaType
): Promise<ServerActionReturn<void>> {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return errorResponse("User not authenticated", "UNAUTHORIZED");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return errorResponse("User not found", "NOT_FOUND");
    }

    const isPasswordMatch = await compare(
      payload.current_password,
      user.password
    );

    if (!isPasswordMatch) {
      return errorResponse("Kata sandi saat ini salah", "VALIDATION_ERROR");
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(payload.new_password, salt);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return successResponse(undefined, "Kata sandi berhasil diubah");
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return errorResponse("User tidak ditemukan", "NOT_FOUND");
      }
    }
    return errorResponse(
      "Terjadi kesalahan server saat mengubah kata sandi",
      "SERVER_ERROR"
    );
  }
}
