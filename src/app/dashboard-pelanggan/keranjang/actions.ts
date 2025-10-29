"use server";

import { PaymentMethod, PostOrderType, Product } from "@/app/generated/prisma";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { KedaiState } from "@/store/use-keranjang-store";
import { ServerActionReturn } from "@/types/server-action";
import { getCustomerShopCart } from "./server-queries";
import { revalidatePath } from "next/cache";

export async function addCartItem({
  product,
  cart_id,
}: {
  product: Product;
  cart_id: string;
}): Promise<ServerActionReturn<void>> {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Dapatkan atau buat Cart untuk pelanggan
      // const upsertCustomerCart = await tx.cart.upsert({
      //   where: {
      //     user_id: customer_id,
      //   },
      //   create: {
      //     user_id: customer_id,
      //     status: "ACTIVE",
      //   },
      //   update: {
      //     status: "ACTIVE",
      //   },
      // });

      // 2. Dapatkan atau buat ShopCart (keranjang toko) yang sesuai
      // Perhatikan penggunaan include untuk memeriksa CartItem yang sudah ada
      const upsertShopCart = await tx.shopCart.upsert({
        where: {
          cart_id_shop_id: {
            cart_id,
            shop_id: product.shop_id,
          },
        },
        create: {
          cart_id,
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

export async function changeCartItemDetails({
  id,
  quantity,
  notes,
}: {
  id: string;
  quantity: number;
  notes: string | null;
}): Promise<ServerActionReturn<void>> {
  try {
    if (quantity < 1) {
      return errorResponse("Jumlah harus lebih besar dari 0");
    }

    // Ambil cartItem untuk mendapatkan shop_cart_id dan price_at_add
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      select: { shop_cart_id: true, price_at_add: true },
    });

    if (!cartItem) {
      throw new Error("Item keranjang tidak ditemukan");
    }

    // Lakukan transaksi untuk memastikan konsistensi data
    const result = await prisma.$transaction(async (tx) => {
      // Perbarui cartItem
      await tx.cartItem.update({
        where: { id },
        data: {
          quantity,
          notes,
        },
      });

      // Ambil semua item di shop_cart yang sama
      const cartItems = await tx.cartItem.findMany({
        where: { shop_cart_id: cartItem.shop_cart_id },
        select: { quantity: true, price_at_add: true },
      });

      // Hitung total harga dengan biaya tambahan 1000 per kuantitas produk
      const totalPrice = cartItems.reduce(
        (sum, item) => sum + (item.price_at_add + 1000) * item.quantity,
        0
      );

      await tx.shopCart.update({
        where: { id: cartItem.shop_cart_id },
        data: { total_price: totalPrice },
      });

      return undefined;
    });

    // Revalidasi path untuk memperbarui cache
    revalidatePath("/dashboard-pelanggan/keranjang/" + cartItem.shop_cart_id);

    return successResponse(result, "Sukses mengubah detail dan total harga");
  } catch (error) {
    console.error("Error in changeCartItemDetails:", error);
    return errorResponse("Gagal mengubah detail dan total harga");
  }
}

export async function setShopCartPaymentMethod() {}

export async function processOrder({
  shopGroupItems,
  customerId,
  conversation_id,
}: {
  shopGroupItems: Record<string, KedaiState>;
  customerId: string;
  conversation_id: string;
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
            conversation_id,
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
  shopCartId,
  paymentMethod,
  postOrderType,
  floor,
  table_number,
}: {
  shopCartId: string;
  paymentMethod: PaymentMethod;
  postOrderType: PostOrderType;
  floor: number | null;
  table_number: number | null;
}): Promise<ServerActionReturn<void>> {
  try {
    await prisma.$transaction(async (tx) => {
      const shopCart = await prisma.shopCart.findFirst({
        where: {
          id: shopCartId,
        },
        select: {
          id: true,
          cart: {
            select: {
              user_id: true,
            },
          },
          post_order_type: true,
          total_price: true,
          notes: true,
          payment_method: true,
          order_id: true,
          status: true,
          shop: {
            select: {
              id: true,
              name: true,
              canteen_id: true,
              canteen: {
                select: {
                  name: true,
                },
              },
              owner_id: true,
              payments: {
                select: {
                  method: true,
                },
              },
            },
          },
          items: {
            select: {
              product: {
                select: {
                  id: true,
                  name: true,
                  image_url: true,
                },
              },
              id: true,
              notes: true,
              price_at_add: true,
              quantity: true,
            },
          },
        },
      });

      if (!shopCart) {
        return errorResponse("Keranjang kedai tidak ditemukan");
      }

      const customer_id = shopCart.cart.user_id;
      const { owner_id } = shopCart.shop;

      const existingConversation = await tx.conversation.findFirst({
        where: {
          participants: {
            every: {
              user_id: { in: [customer_id, owner_id] },
            },
          },
        },
      });

      const conversation_id =
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

      const order = await tx.order.create({
        data: {
          shop_id: shopCart.shop.id,
          customer_id,
          payment_method: paymentMethod,
          status: "PENDING_CONFIRMATION",
          total_price: shopCart.total_price,
          post_order_type: postOrderType,
          floor: postOrderType === "DELIVERY_TO_TABLE" ? floor : null,
          table_number:
            postOrderType === "DELIVERY_TO_TABLE" ? table_number : null,
          conversation_id,
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

      await tx.shopCart.update({
        where: {
          id: shopCart.id,
        },
        data: {
          status: "ORDERED",
          order_id: order.id,
        },
      });

      await tx.message.create({
        data: {
          conversation_id,
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

export async function getOrCreateCustomerCart(user_id: string) {
  const cart = await prisma.cart.findFirst({
    where: {
      user_id,
    },
  });

  if (!cart) {
    const created = await prisma.cart.create({
      data: {
        user_id,
      },
      select: {
        id: true,
      },
    });

    return created.id;
  }

  return cart.id;
}
