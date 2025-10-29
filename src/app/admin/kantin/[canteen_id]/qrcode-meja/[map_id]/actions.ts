"use server";

import { join } from "path";
import { v4 as uuidv4 } from "uuid";

import QRCode from "qrcode";
import { ServerActionReturn } from "@/types/server-action";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createNewTableQRCode({
  previousTableNumber,
  canteen_id,
  map_id,
  floor,
  baseUrl,
}: {
  previousTableNumber: number;
  canteen_id: number;
  map_id: number;
  floor: number;
  baseUrl: string;
}): Promise<ServerActionReturn<void>> {
  try {
    const id = uuidv4();
    const savePath = join(
      process.cwd(),
      "public/uploads/table-qrcode",
      `${id}.png`
    );

    const params = new URLSearchParams();

    const nextTableNumber = previousTableNumber + 1;

    params.set("floor", floor.toString());
    params.set("table_number", nextTableNumber.toString());

    const fullUrl = `${baseUrl}/dashboard-pelanggan/kantin/${canteen_id}/pilih-meja?${params.toString()}`;

    const created = await prisma.tableQRCode.create({
      data: {
        id,
        floor,
        image_url: `${id}.png`,
        table_number: nextTableNumber,
        canteen_id,
        map_id,
      },
      select: {
        id: true,
        floor: true,
        table_number: true,
      },
    });

    await QRCode.toFile(savePath, fullUrl, {
      errorCorrectionLevel: "M",
      type: "png",
      margin: 1,
      color: {
        dark: "#fff",
        light: "#000",
      },
    });

    revalidatePath(`/admin/kantin/${canteen_id}/qrcode-meja/${map_id}`);

    return successResponse(undefined, "Berhasil generate QR Code");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}

export async function chooseCustomerTable({
  user_id,
  canteen_id,
  floor,
  table_number,
}: {
  user_id: string;
  floor: number;
  table_number: number;
  canteen_id: number;
}): Promise<ServerActionReturn<void>> {
  try {
    await prisma.customerProfile.update({
      where: {
        user_id,
      },
      data: {
        canteen_id,
        floor,
        table_number,
      },
    });

    return successResponse(undefined, "Sukses mencatat meja");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}
