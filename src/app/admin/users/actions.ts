"use server";

import { successResponse, errorResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { LocalStorageService } from "@/services/storage-services";
import { ServerActionReturn } from "@/types/server-action";

import { hashSync } from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { join } from "path";
import { existsSync, unlink } from "fs";
import { revalidatePath } from "next/cache";
import { auth } from "@/config/auth";
import { headers } from "next/headers";

import {
  InputUserSchemaType,
  UpdateUserSchemaType,
} from "@/validations/schemas/user";
import { Role } from "@/app/generated/prisma";

export async function uploadAvatar(file: File) {
  const storageService = new LocalStorageService();

  const avatarUrl = await storageService.uploadImage(file, "avatar");

  return avatarUrl;
}

export async function createUser(
  payload: InputUserSchemaType
): Promise<ServerActionReturn<void>> {
  try {
    const create = await prisma.user.create({
      data: {
        name: payload.name,
        username: payload.username,
        password: hashSync(payload.password, 10),
        role: "SHOP_OWNER",
        avatar: payload.avatar,
      },
    });

    console.log(create);

    return successResponse(undefined, "User Berhasil Ditambahkan");
  } catch (e: any) {
    console.error("Error creating user:", e);

    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        const targetField =
          (e.meta?.target as string[])?.join(", ") || "Unknown field";
        if (targetField.includes("username")) {
          return errorResponse(
            "Username sudah digunakan. Silakan pilih username lain.",
            "DUPLICATE_USERNAME"
          );
        }
        return errorResponse(
          `Nilai unik sudah ada untuk ${targetField}.`,
          "DUPLICATE_ENTRY"
        );
      }
    }

    return errorResponse(
      "Terjadi kesalahan saat menambahkan user: " + e.message,
      "SERVER_ERROR"
    );
  }
}

export async function updateUser(
  payload: UpdateUserSchemaType
): Promise<ServerActionReturn<void>> {
  const { id, password, ...data } = payload;

  try {
    const updated = await prisma.user.update({
      where: {
        id,
      },
      data,
    });

    console.log(updated);

    if (password) {
      await prisma.user.update({
        where: {
          id,
        },
        data: {
          password: hashSync(password, 10),
        },
      });
    }

    return successResponse(undefined, "Data user berhasil diperbarui");
  } catch (e: any) {
    console.error("Error updating employee:", e);

    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        const targetField =
          (e.meta?.target as string[])?.join(", ") || "Unknown field";
        if (targetField.includes("username")) {
          return errorResponse(
            "Username sudah digunakan. Silakan pilih Username lain.",
            "DUPLICATE_USERNAME"
          );
        }
        return errorResponse(
          `Nilai unik sudah ada untuk ${targetField}.`,
          "DUPLICATE_ENTRY"
        );
      } else if (e.code === "P2025") {
        return errorResponse("Workers tidak ditemukan.", "NOT_FOUND");
      }
    }
    return errorResponse(
      "Terjadi kesalahan saat memperbarui employee: " + e.message,
      "SERVER_ERROR"
    );
  }
}

export async function deleteUser(
  id: string
): Promise<ServerActionReturn<void>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        avatar: true,
      },
    });

    if (!user) {
      return errorResponse("User tidak ditemukan.", "NOT_FOUND");
    }

    const update = await prisma.user.delete({
      where: { id },
    });

    if (user.avatar && user.avatar !== "default-avatar.jpg") {
      const avatarAbsolutePath = join(process.cwd(), "public", user.avatar);

      if (existsSync(avatarAbsolutePath)) {
        unlink(avatarAbsolutePath, (err) => {
          if (err) {
            console.error(
              `Gagal menghapus file avatar ${avatarAbsolutePath}:`,
              err
            );
          } else {
            console.log(`File avatar berhasil dihapus: ${avatarAbsolutePath}`);
          }
        });
      } else {
        console.warn(
          `File avatar tidak ditemukan di ${avatarAbsolutePath}, melewati penghapusan.`
        );
      }
    }

    revalidatePath("/admin/users");

    return successResponse(
      undefined,
      "Workers berhasil dihapus (soft delete)."
    );
  } catch (e: any) {
    console.error("Error soft deleting user:", e);

    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return errorResponse("Workers tidak ditemukan.", "NOT_FOUND");
      }
    }
    return errorResponse(
      "Terjadi kesalahan saat menghapus user: " + e.message,
      "SERVER_ERROR"
    );
  }
}

export async function getUserRoleByUsernameAction(
  username: string
): Promise<Role> {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  return user?.role || "CUSTOMER";
}
