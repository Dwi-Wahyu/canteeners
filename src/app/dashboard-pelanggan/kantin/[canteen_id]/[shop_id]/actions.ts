"use server";

import { prisma } from "@/lib/prisma";
import { OrderItemType } from "./type";
import { ServerActionReturn } from "@/types/server-action";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { Order, PaymentMethod } from "@/app/generated/prisma";

// Definisikan tipe untuk hasil kembalian
interface CreateOrderResult {
  order: Order;
  conversationId: string;
}

export async function createConversationAndOrder(
  customer_id: string,
  shop_owner_id: string,
  shop_id: string,
  orderItems: OrderItemType[],
  payment_method: PaymentMethod
): Promise<ServerActionReturn<CreateOrderResult>> {
  // Validasi input di awal
  if (!customer_id || !shop_owner_id || !shop_id || !orderItems.length) {
    return errorResponse(
      "Input tidak valid: customer_id, shop_owner_id, shop_id, atau orderItems tidak boleh kosong",
      "INVALID_INPUT"
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Verifikasi customer dan shop
      const customer = await tx.user.findUnique({ where: { id: customer_id } });
      const shop = await tx.shop.findUnique({
        where: { id: shop_id },
        select: { id: true, owner_id: true },
      });
      if (!customer) {
        throw new Error("Customer tidak ditemukan");
      }
      if (!shop) {
        throw new Error("Warung tidak ditemukan");
      }
      if (shop.owner_id !== shop_owner_id) {
        throw new Error("ID pemilik warung tidak cocok dengan warung");
      }

      // Validasi produk dan harga
      const productIds = orderItems.map((item) => item.product_id);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, price: true },
      });
      const productMap = new Map(products.map((p) => [p.id, p.price]));
      const orderItemsData = orderItems.map((item) => {
        const productPrice = productMap.get(item.product_id);
        if (!productPrice) {
          throw new Error(
            `Produk dengan ID ${item.product_id} tidak ditemukan`
          );
        }
        if (item.quantity <= 0) {
          throw new Error("Kuantitas harus lebih dari 0");
        }
        return {
          product_id: item.product_id,
          price: item.quantity * productPrice,
          quantity: item.quantity,
        };
      });

      // Buat pesanan
      const createOrder = await tx.order.create({
        data: {
          customer_id,
          shop_id,
          status: "WAITING_SHOP_CONFIRMATION",
          order_items: {
            createMany: { data: orderItemsData },
          },
          payment_method,
        },
      });

      // Cari percakapan yang sudah ada
      const findExistConversation = await tx.conversation.findFirst({
        where: {
          AND: [
            { participants: { some: { user_id: customer_id } } },
            { participants: { some: { user_id: shop_owner_id } } },
            {
              participants: {
                every: { user_id: { in: [customer_id, shop_owner_id] } },
              },
            },
          ],
        },
      });

      let conversationId: string;
      if (!findExistConversation) {
        // Buat percakapan baru dengan peserta dan pesan
        const createConversation = await tx.conversation.create({
          data: {
            participants: {
              create: [{ user_id: customer_id }, { user_id: shop_owner_id }],
            },
            messages: {
              create: {
                type: "SYSTEM",
                sender_id: customer_id,
                content: `Pesanan baru dibuat (Order ID: ${createOrder.id})`,
                order_id: createOrder.id,
              },
            },
          },
        });
        conversationId = createConversation.id;
      } else {
        // Buat pesan di percakapan yang sudah ada
        await tx.message.create({
          data: {
            conversation_id: findExistConversation.id,
            sender_id: customer_id,
            content: `Pesanan baru ditambahkan (Order ID: ${createOrder.id})`,
            type: "SYSTEM",
            order_id: createOrder.id,
          },
        });
        conversationId = findExistConversation.id;
      }

      return { order: createOrder, conversationId };
    });

    return successResponse(
      result,
      "Sukses mencatat order, mengarahkan anda ke percakapan dengan pemilik warung"
    );
  } catch (error) {
    console.error("Error in createConversationAndOrder:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Terjadi kesalahan pada server";
    return errorResponse(errorMessage, "SERVER_ERROR", {
      errorDetails: error instanceof Error ? error.stack : undefined,
    });
  }
}
