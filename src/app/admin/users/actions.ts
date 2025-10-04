"use server";

import { successResponse, errorResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { LocalStorageService } from "@/services/storage_services";
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

export async function uploadAvatar(file: File, username: string) {
  const storageService = new LocalStorageService();

  const avatarUrl = await storageService.uploadImage(file, username, "avatar");

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
        role: "workers",
        avatar: payload.avatar,
      },
    });

    console.log(create);

    return successResponse(undefined, "Karyawan Berhasil Ditambahkan");
  } catch (e: any) {
    console.error("Error creating employee:", e);

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
      "Terjadi kesalahan saat menambahkan employee: " + e.message,
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

    return successResponse(undefined, "Data Karyawan berhasil diperbarui");
  } catch (e: any) {
    console.error("Error updating employee:", e);

    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        const targetField =
          (e.meta?.target as string[])?.join(", ") || "Unknown field";
        if (targetField.includes("username")) {
          return errorResponse(
            "NRP sudah digunakan. Silakan pilih NRP lain.",
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
  const session = await auth();

  if (!session) {
    return errorResponse(
      "Sesi Login Tidak Terbaca, Silahkan Login Ulang",
      "SERVER_ERROR"
    );
  }

  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const userIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

  try {
    const employee = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        avatar: true,
      },
    });

    if (!employee) {
      return errorResponse("Workers tidak ditemukan.", "NOT_FOUND");
    }

    const update = await prisma.user.update({
      where: { id: id },
      data: {
        deleted_at: new Date(),
      },
    });

    if (
      employee.avatar &&
      employee.avatar !== "/uploads/avatar/default-avatar.jpg"
    ) {
      const avatarAbsolutePath = join(process.cwd(), "public", employee.avatar);

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

    revalidatePath("/admin/employee");

    return successResponse(
      undefined,
      "Workers berhasil dihapus (soft delete)."
    );
  } catch (e: any) {
    console.error("Error soft deleting employee:", e);

    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return errorResponse("Workers tidak ditemukan.", "NOT_FOUND");
      }
    }
    return errorResponse(
      "Terjadi kesalahan saat menghapus employee: " + e.message,
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
