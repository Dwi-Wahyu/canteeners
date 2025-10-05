"use server";

import { prisma } from "@/lib/prisma";
import { OrderItemType } from "./type";

export async function createConversationAndOrder(
  customer_id: string,
  shop_owner_id: string,
  shop_id: string,
  orderItems: OrderItemType[]
) {
  const createOrder = await prisma.order.create({
    data: {
      customer_id,
      shop_id,
      status: "WAITING_SHOP_CONFIRMATION",
      order_items: {
        createMany: {
          data: orderItems.map((items) => ({
            product_id: items.product_id,
            price: items.quantity * items.price,
            quantity: items.quantity,
          })),
        },
      },
    },
  });

  const findExistConversation = await prisma.conversation.findFirst({
    where: {
      customer_id,
      shop_owner_id,
    },
  });

  let conversationId = findExistConversation?.id;

  if (!findExistConversation) {
    const createConversation = await prisma.conversation.create({
      data: {
        customer_id,
        shop_owner_id,
        messages: {
          create: {
            type: "SYSTEM",
            sender_id: customer_id,
            content: "Pesanan Baru Masuk",
          },
        },
      },
    });
  } else {
    const createOrderMessage = await prisma.message.create({
      data: {
        conversation_id: findExistConversation.id,
        sender_id: customer_id,
        content: "Pesanan Baru Masuk",
        type: "SYSTEM",
      },
    });
  }
}
