"use server";

import { Product } from "@/app/generated/prisma";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { KedaiState } from "@/store/use-keranjang-store";
import { ServerActionReturn } from "@/types/server-action";
import { getCustomerShopCart } from "./server-queries";

export async function addCartItem({
  product,
  customer_id,
}: {
  product: Product;
  customer_id: string;
}): Promise<ServerActionReturn<void>> {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Dapatkan atau buat Cart untuk pelanggan
      const upsertCustomerCart = await tx.cart.upsert({
        where: {
          user_id: customer_id,
        },
        create: {
          user_id: customer_id,
          status: "ACTIVE",
        },
        update: {
          status: "ACTIVE",
        },
      });

      // 2. Dapatkan atau buat ShopCart (keranjang toko) yang sesuai
      // Perhatikan penggunaan include untuk memeriksa CartItem yang sudah ada
      const upsertShopCart = await tx.shopCart.upsert({
        where: {
          cart_id_shop_id: {
            cart_id: upsertCustomerCart.id,
            shop_id: product.shop_id,
          },
        },
        create: {
          cart_id: upsertCustomerCart.id,
          shop_id: product.shop_id,
        },
        update: {},
        include: {
          items: {
            where: {
              product_id: product.id,
            },
          },
        },
      });

      const existingCartItem = upsertShopCart.items[0];
      const newQuantity = 1; // Default quantity

      if (existingCartItem) {
        // 3. Jika produk sudah ada, tambahkan quantity-nya
        await tx.cartItem.update({
          where: {
            id: existingCartItem.id,
          },
          data: {
            quantity: existingCartItem.quantity + newQuantity,
            // update juga price_at_add jika harganya berubah
            price_at_add: product.price,
          },
        });
      } else {
        // 4. Jika produk belum ada, buat CartItem baru
        await tx.cartItem.create({
          data: {
            shop_cart_id: upsertShopCart.id,
            product_id: product.id,
            quantity: newQuantity,
            price_at_add: product.price,
          },
        });
      }

      await recalculateShopCartTotal(tx, upsertShopCart.id);
    });

    return successResponse(undefined, "Sukses menambahkan ke keranjang");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}

async function recalculateShopCartTotal(tx: any, shopCartId: string) {
  const cartItems = await tx.cartItem.findMany({
    where: {
      shop_cart_id: shopCartId,
    },
  });

  const newTotalPrice = cartItems.reduce((total: number, item: any) => {
    return total + item.quantity * item.price_at_add;
  }, 0);

  await tx.shopCart.update({
    where: {
      id: shopCartId,
    },
    data: {
      total_price: newTotalPrice,
    },
  });
}

export async function setShopCartPaymentMethod() {}

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

export async function processShopCart({
  shopCart,
}: {
  shopCart: NonNullable<Awaited<ReturnType<typeof getCustomerShopCart>>>;
}): Promise<ServerActionReturn<void>> {
  try {
    const customer_id = shopCart.cart.user_id;
    const { owner_id } = shopCart.shop;

    await prisma.$transaction(async (tx) => {
      await tx.shopCart.update({
        where: {
          id: shopCart.id,
        },
        data: {
          status: "ORDERED",
        },
      });

      const order = await tx.order.create({
        data: {
          shop_id: shopCart.shop.id,
          customer_id,
          payment_method: shopCart.payment_method,
          status: "PENDING_CONFIRMATION",
          total_price: shopCart.total_price,
          order_items: {
            createMany: {
              data: shopCart.items.map((item) => ({
                product_id: item.product.id,
                quantity: item.quantity,
                price: item.price_at_add * item.quantity,
                note: item.notes,
              })),
            },
          },
        },
      });

      const existingConversation = await tx.conversation.findFirst({
        where: {
          participants: {
            every: {
              user_id: { in: [customer_id, owner_id] },
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
                  data: [{ user_id: customer_id }, { user_id: owner_id }],
                },
              },
            },
          })
        ).id;

      await tx.message.create({
        data: {
          conversation_id: conversationId,
          sender_id: customer_id,
          order_id: order.id,
          type: "ORDER",
          content: `Order masuk. Mohon konfirmasi apakah pesanan tersedia`,
        },
      });
    });

    return successResponse(undefined, "Berhasil memproses pesanan");
  } catch (error) {
    console.log(error);

    return errorResponse("Gagal memproses pesanan");
  }
}
