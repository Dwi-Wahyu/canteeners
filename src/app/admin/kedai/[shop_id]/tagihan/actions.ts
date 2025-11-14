"use server";

import { OrderStatus, RefundStatus } from "@/app/generated/prisma";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { InputShopBillingType } from "@/validations/schemas/billing";
import { revalidatePath } from "next/cache";

export async function GenerateShopBilling(
  payload: InputShopBillingType
): Promise<ServerActionReturn<void>> {
  try {
    const { start_date, end_date, shop_id } = payload;

    // 1. Sesuaikan end_date agar inklusif (mencakup hingga akhir hari)
    const endDateInclusive = new Date(end_date);
    endDateInclusive.setHours(23, 59, 59, 999);

    // 2. Hitung Subtotal (Komisi)
    // Aturan: 1000 * total quantity dari OrderItem
    // Asumsi: Kita hanya menghitung order yang statusnya 'COMPLETED'
    const commissionData = await prisma.orderItem.aggregate({
      _sum: { quantity: true },
      where: {
        order: {
          shop_id: shop_id,
          created_at: {
            // Filter order berdasarkan tanggal dibuat
            gte: start_date,
            lte: endDateInclusive,
          },
          status: OrderStatus.COMPLETED,
        },
      },
    });

    const totalQuantity = commissionData._sum.quantity ?? 0;
    const subtotal = totalQuantity * 1000;

    // 3. Hitung Total Refund
    // Aturan: Jumlah semua 'amount' dari refund yang telah diproses
    // Asumsi: Kita menghitung refund yang statusnya 'PROCESSED'
    const refundData = await prisma.refund.aggregate({
      _sum: { amount: true },
      where: {
        order: {
          shop_id: shop_id, // Pastikan refund milik toko yang benar
        },
        // Filter berdasarkan tanggal refund diproses
        processed_at: {
          gte: start_date,
          lte: endDateInclusive,
        },
        status: RefundStatus.PROCESSED,
      },
    });

    const totalRefund = refundData._sum.amount ?? 0;

    // 4. Hitung Total Akhir
    const total = subtotal - totalRefund;

    // 5. Buat data ShopBilling baru
    // !! Lihat Peringatan Penting di bawah mengenai `shop_id @unique`
    await prisma.shopBilling.create({
      data: {
        shop_id: shop_id,
        start_date: start_date,
        end_date: endDateInclusive, // Simpan tanggal akhir yang inklusif
        subtotal: subtotal,
        refund: totalRefund,
        total: total,
      },
    });

    revalidatePath(`/admin/kedai/${shop_id}/tagihan`);

    return successResponse(undefined, "Billing berhasil digenerate");
  } catch (error) {
    console.log(error);
    return errorResponse("Terjadi kesalahan saat generate billing");
  }
}
