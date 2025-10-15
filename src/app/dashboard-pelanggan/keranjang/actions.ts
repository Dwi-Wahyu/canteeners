"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { KedaiState } from "@/store/use-keranjang-store";
import { ServerActionReturn } from "@/types/server-action";

export async function processOrder({
  shopGroupItems,
  customerId,
}: {
  shopGroupItems: Record<string, KedaiState>;
  customerId: string;
}): Promise<ServerActionReturn<void>> {
  try {
    await prisma.$transaction(async (tx) => {
      const customer = await tx.user.findFirst({
        where: { id: customerId },
      });

      if (!customer) {
        throw new Error("Customer tidak ditemukan");
      }

      for (const shop of Object.values(shopGroupItems)) {
        const order = await tx.order.create({
          data: {
            shop_id: shop.id,
            customer_id: customerId,
            payment_method: shop.paymentMethod ?? "CASH",
            status: "PENDING_CONFIRMATION",
            total_price: shop.totalPrice,
            order_items: {
              createMany: {
                data: shop.items.map((item) => ({
                  product_id: item.productId,
                  quantity: item.quantity,
                  price: item.price * item.quantity,
                  note: item.note,
                })),
              },
            },
          },
        });

        const existingConversation = await tx.conversation.findFirst({
          where: {
            participants: {
              every: {
                user_id: { in: [customerId, shop.ownerId] },
              },
            },
          },
        });

        const conversationId =
          existingConversation?.id ??
          (
            await tx.conversation.create({
              data: {
                participants: {
                  createMany: {
                    data: [{ user_id: customerId }, { user_id: shop.ownerId }],
                  },
                },
              },
            })
          ).id;

        await tx.message.create({
          data: {
            conversation_id: conversationId,
            sender_id: customerId,
            order_id: order.id,
            type: "ORDER",
            content: `Order masuk. Mohon konfirmasi apakah pesanan tersedia`,
          },
        });
      }
    });

    return successResponse(undefined, "Berhasil memproses pesanan");
  } catch (error) {
    console.log(error);

    return errorResponse("Gagal memproses pesanan");
  }
}
