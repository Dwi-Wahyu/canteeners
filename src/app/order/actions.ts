"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { revalidatePath } from "next/cache";
import { PaymentMethod, ShopTestimony } from "../generated/prisma";
import { LocalStorageService } from "@/services/storage-services";
import { ShopComplaintSchemaType } from "@/validations/schemas/complaint";

export async function uploadShopComplaintImage(file: File) {
  const storageService = new LocalStorageService();

  const complaintProofImageUrl = await storageService.uploadImage(
    file,
    "complaint-proof"
  );

  return complaintProofImageUrl;
}

export async function ConfirmPayment({
  conversation_id,
  estimation,
  order_id,
  owner_id,
}: {
  order_id: string;
  estimation: number;
  conversation_id: string;
  owner_id: string;
}): Promise<ServerActionReturn<void>> {
  try {
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "PROCESSING",
        processed_at: new Date(),
        estimation,
      },
    });

    await prisma.message.create({
      data: {
        conversation_id,
        sender_id: owner_id,
        order_id: order_id,
        type: "SYSTEM",
        text: `Pembayaran telah dikonfirmasi, pesanan anda sedang diproses`,
      },
    });

    revalidatePath(`/order/${order_id}`);

    return successResponse(undefined, "Berhasil konfirmasi pembayaran");
  } catch (error) {
    console.error("confirmPayment Error:", error);
    return errorResponse("Terjadi kesalahan saat konfirmasi pembayaran");
  }
}

export async function RejectPayment(
  order_id: string,
  reason?: string
): Promise<ServerActionReturn<void>> {
  try {
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "PAYMENT_REJECTED",
        rejected_reason:
          reason?.trim() ||
          "Pembayaran anda ditolak oleh pemilik kedai, silakan konfirmasi lebih lanjut.",
      },
    });

    revalidatePath(`/order/${order_id}`);

    return successResponse(undefined, "Berhasil menolak pembayaran");
  } catch (error) {
    console.error("rejectPayment Error:", error);
    return errorResponse("Terjadi kesalahan saat menolak pembayaran");
  }
}

export async function ConfirmOrder({
  conversation_id,
  order_id,
  owner_id,
  payment_method,
  shop_id,
}: {
  order_id: string;
  payment_method: PaymentMethod;
  owner_id: string;
  conversation_id: string;
  shop_id: string;
}): Promise<ServerActionReturn<void>> {
  try {
    if (payment_method === "CASH") {
      await prisma.order.update({
        where: {
          id: order_id,
        },
        data: {
          status: "WAITING_SHOP_CONFIRMATION",
        },
      });

      revalidatePath(`/order/${order_id}`);

      await prisma.message.create({
        data: {
          conversation_id,
          sender_id: owner_id,
          order_id: order_id,
          type: "SYSTEM",
          text: `Pesanan diterima, silakan lakukan pembayaran di kedai`,
        },
      });

      return successResponse(undefined, "Berhasil mengonfirmasi pesanan");
    }

    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "WAITING_PAYMENT",
      },
    });

    const shopPaymentExcludeCash = await prisma.payment.findFirst({
      where: {
        shop_id,
        method: {
          not: "CASH",
        },
      },
    });

    if (!shopPaymentExcludeCash) {
      console.error("kedai belum menerima pembayaran non tunai");
      return errorResponse("kedai belum menerima pembayaran non tunai");
    }

    if (payment_method === "QRIS") {
      if (!shopPaymentExcludeCash.qr_url) {
        console.error("kedai belum menerima pembayaran qris");
        return errorResponse("kedai belum menerima pembayaran qris");
      }

      await prisma.message.create({
        data: {
          conversation_id,
          sender_id: owner_id,
          order_id: order_id,
          type: "SYSTEM",
          text: `Pesanan diterima, silakan kirim bukti pembayaran`,
          media: {
            create: {
              url: shopPaymentExcludeCash.qr_url,
              mime_type: "IMAGE",
            },
          },
        },
      });

      revalidatePath(`/order/${order_id}`);

      return successResponse(undefined, "Berhasil mengonfirmasi pesanan");
    }

    if (payment_method === "BANK_TRANSFER") {
      if (!shopPaymentExcludeCash.account_number) {
        console.error("kedai belum menerima pembayaran transfer bank");
        return errorResponse("kedai belum menerima pembayaran transfer bank");
      }

      await prisma.message.create({
        data: {
          conversation_id,
          sender_id: owner_id,
          order_id: order_id,
          type: "SYSTEM",
          text: `Pesanan diterima, silakan transfer pada nomor rekening ${shopPaymentExcludeCash.account_number} ${shopPaymentExcludeCash.note}`,
        },
      });

      revalidatePath(`/order/${order_id}`);

      return successResponse(undefined, "Berhasil mengonfirmasi pesanan");
    }

    return errorResponse("Metode pembayaran tidak valid");
  } catch (error) {
    console.error("confirmOrder Error:", error);
    return errorResponse("Terjadi kesalahan saat mengonfirmasi pesanan");
  }
}

export async function RejectOrder(
  order_id: string,
  reason?: string
): Promise<ServerActionReturn<void>> {
  try {
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "REJECTED",
        rejected_reason: reason?.trim() || "Pesanan ditolak oleh kedai.",
      },
    });

    revalidatePath(`/order/${order_id}`);

    return successResponse(undefined, "Berhasil menolak pesanan");
  } catch (error) {
    console.error("rejectOrder Error:", error);
    return errorResponse("Terjadi kesalahan saat menolak pesanan");
  }
}

export async function CompleteOrder({
  conversation_id,
  order_id,
  owner_id,
}: {
  order_id: string;
  conversation_id: string;
  owner_id: string;
}): Promise<ServerActionReturn<void>> {
  try {
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "COMPLETED",
      },
    });

    await prisma.message.create({
      data: {
        conversation_id,
        sender_id: owner_id,
        order_id: order_id,
        type: "SYSTEM",
        text: `Pesanan telah selesai silakan berikan ulasan atau rating untuk kami kak 🙏`,
      },
    });

    revalidatePath(`/order/${order_id}`);

    return successResponse(undefined, "Berhasil mengubah status");
  } catch (error) {
    console.error("rejectOrder Error:", error);
    return errorResponse("Terjadi kesalahan saat mengubah status");
  }
}

export async function AddShopTestimony({
  message,
  rating,
  order_id,
}: {
  message: string;
  rating: number;
  order_id: string;
}): Promise<ServerActionReturn<ShopTestimony>> {
  try {
    // Gunakan transaksi untuk memastikan pembuatan ulasan DAN pembaruan rating
    // terjadi bersamaan atau tidak sama sekali (atomik).
    const createdTestimony = await prisma.$transaction(async (tx) => {
      // 1. Buat ulasan baru dan ambil shop_id dari order terkait
      const created = await tx.shopTestimony.create({
        data: {
          message,
          rating,
          order_id,
        },
        include: {
          order: {
            select: {
              shop_id: true,
            },
          },
        },
      });

      const shop_id = created.order.shop_id;

      // 2. Hitung ulang rata-rata dan total rating untuk toko tersebut
      const shopAggregates = await tx.shopTestimony.aggregate({
        where: {
          // Filter ulasan berdasarkan shop_id dari order
          order: {
            shop_id: shop_id,
          },
        },
        _avg: {
          rating: true, // Hitung rata-rata
        },
        _count: {
          rating: true, // Hitung jumlah total
        },
      });

      const newAverageRating = shopAggregates._avg.rating ?? 0;
      const newTotalRatings = shopAggregates._count.rating ?? 0;

      // 3. Perbarui data di model Shop
      await tx.shop.update({
        where: {
          id: shop_id,
        },
        data: {
          average_rating: newAverageRating,
          total_ratings: newTotalRatings,
        },
      });

      // Kembalikan ulasan yang baru dibuat
      return created;
    });

    return successResponse(createdTestimony, "Sukses menambahkan ulasan");
  } catch (error) {
    console.error(error); // Tambahkan log untuk debugging
    return errorResponse("Terjadi kesalahan saat menambahkan ulasan");
  }
}

export async function AddShopComplaint(payload: ShopComplaintSchemaType) {
  try {
    const created = await prisma.shopComplaint.create({
      data: {
        cause: payload.cause,
        proof_url: payload.proof_url,
        order_id: payload.order_id,
      },
    });

    return successResponse(created, "Sukses menambahkan komplain");
  } catch (error) {
    return errorResponse("Terjadi kesalahan saat menambahkan komplain");
  }
}
