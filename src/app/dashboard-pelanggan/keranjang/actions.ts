"use server";

import {
  PaymentMethod,
  PostOrderType,
  Prisma,
  Product,
} from "@/app/generated/prisma";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { revalidatePath } from "next/cache";

//  Definisikan argumen yang Anda gunakan pada klausa `include`
const ShopCartWithItemsArgs = Prisma.validator<Prisma.ShopCartDefaultArgs>()({
  include: {
    items: {
      where: {
        product_id: "string", // Type harus match dengan product.id
      },
    },
  },
});

//  Gunakan Prisma.ShopCartGetPayload untuk mendapatkan type return
export type UpsertedShopCartType = Prisma.ShopCartGetPayload<
  typeof ShopCartWithItemsArgs
>;

export async function addCartItem({
  product,
  cart_id,
  shop_cart_id,
}: {
  product: Pick<Product, "id" | "shop_id" | "price">;
  cart_id: string;
  shop_cart_id: string | null;
}): Promise<ServerActionReturn<void>> {
  try {
    await prisma.$transaction(async (tx) => {
      // Gunakan findUniqueOrThrow/create (jika ID ada) atau create (jika ID tidak ada)
      let currentShopCart: UpsertedShopCartType;

      // Jika shop_cart_id tidak disediakan, kita perlu mencari ShopCart
      if (!shop_cart_id) {
        // Cari ShopCart berdasarkan cart_id, shop_id, dan status PENDING
        const existingShopCart = await tx.shopCart.findFirst({
          where: {
            cart_id,
            shop_id: product.shop_id,
            status: "PENDING",
          },
          ...ShopCartWithItemsArgs, // Gunakan args untuk mendapatkan items
        });

        if (existingShopCart) {
          currentShopCart = existingShopCart;
        } else {
          // Jika tidak ada, buat ShopCart baru
          currentShopCart = await tx.shopCart.create({
            data: {
              cart_id,
              shop_id: product.shop_id,
              status: "PENDING",
            },
            ...ShopCartWithItemsArgs, // Gunakan args untuk mendapatkan items
          });
        }
      } else {
        // Jika shop_cart_id disediakan, kita cari ShopCart yang sudah ada
        // Menggunakan findUniqueOrThrow untuk memastikan ShopCart ada
        const existingShopCart = await tx.shopCart.findUniqueOrThrow({
          where: {
            id: shop_cart_id,
          },
          ...ShopCartWithItemsArgs, // Gunakan args untuk mendapatkan items
        });
        currentShopCart = existingShopCart;
      }

      // Ambil CartItem yang sudah ada (jika ada, array akan berisi 1 item)
      // Karena Anda menggunakan where: { product_id: product.id } di `include`,
      // array `items` hanya berisi item untuk produk yang sedang ditambahkan.
      const existingCartItem = currentShopCart.items[0];
      const newQuantity = 1; // Quantity default yang ditambahkan

      if (existingCartItem) {
        // Item sudah ada: Lakukan UPDATE
        await tx.cartItem.update({
          where: {
            id: existingCartItem.id,
          },
          data: {
            quantity: existingCartItem.quantity + newQuantity,
            // Perbarui harga agar mencerminkan harga saat ini saat penambahan
            price_at_add: product.price,
          },
        });
      } else {
        // Item belum ada: Lakukan CREATE
        await tx.cartItem.create({
          data: {
            shop_cart_id: currentShopCart.id, // Gunakan ID dari ShopCart yang baru didapat
            product_id: product.id,
            quantity: newQuantity,
            price_at_add: product.price,
          },
        });
      }

      await recalculateShopCartTotal(tx, currentShopCart.id);
    });

    return successResponse(undefined, "Sukses menambahkan ke keranjang");
  } catch (error) {
    // Tangani error, terutama jika findUniqueOrThrow gagal
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      console.error(`ShopCart dengan ID ${shop_cart_id} tidak ditemukan.`);
      return errorResponse("Keranjang belanja (ShopCart) tidak ditemukan.");
    }

    console.error("Kesalahan saat menambahkan item keranjang:", error);
    return errorResponse(
      "Terjadi kesalahan saat menambahkan produk ke keranjang."
    );
  }
}

async function recalculateShopCartTotal(tx: any, shopCartId: string) {
  const cartItems = await tx.cartItem.findMany({
    where: {
      shop_cart_id: shopCartId,
    },
  });

  const newTotalPrice = cartItems.reduce((total: number, item: any) => {
    return total + (item.price_at_add + 1000) * item.quantity;
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

// export async function processOrder({
//   shopGroupItems,
//   customerId,
//   conversation_id,
// }: {
//   shopGroupItems: Record<string, KedaiState>;
//   customerId: string;
//   conversation_id: string;
// }): Promise<ServerActionReturn<void>> {
//   try {
//     await prisma.$transaction(async (tx) => {
//       const customer = await tx.user.findFirst({
//         where: { id: customerId },
//       });

//       if (!customer) {
//         throw new Error("Customer tidak ditemukan");
//       }

//       for (const shop of Object.values(shopGroupItems)) {
//         const order = await tx.order.create({
//           data: {
//             shop_id: shop.id,
//             customer_id: customerId,
//             customer_name: "",
//             payment_method: shop.paymentMethod ?? "CASH",
//             status: "PENDING_CONFIRMATION",
//             total_price: shop.totalPrice,
//             conversation_id,
//             order_items: {
//               createMany: {
//                 data: shop.items.map((item) => ({
//                   product_id: item.productId,
//                   quantity: item.quantity,
//                   price: item.price * item.quantity,
//                   note: item.note,
//                 })),
//               },
//             },
//           },
//         });

//         const existingConversation = await tx.conversation.findFirst({
//           where: {
//             participants: {
//               every: {
//                 user_id: { in: [customerId, shop.ownerId] },
//               },
//             },
//           },
//         });

//         const conversationId =
//           existingConversation?.id ??
//           (
//             await tx.conversation.create({
//               data: {
//                 participants: {
//                   createMany: {
//                     data: [{ user_id: customerId }, { user_id: shop.ownerId }],
//                   },
//                 },
//               },
//             })
//           ).id;

//         await tx.message.create({
//           data: {
//             conversation_id: conversationId,
//             sender_id: customerId,
//             order_id: order.id,
//             type: "ORDER",
//             text: `Order masuk. Mohon konfirmasi apakah pesanan tersedia`,
//           },
//         });
//       }
//     });

//     return successResponse(undefined, "Berhasil memproses pesanan");
//   } catch (error) {
//     console.log(error);

//     return errorResponse("Gagal memproses pesanan");
//   }
// }

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
}): Promise<
  ServerActionReturn<{ conversation_id?: string; order_id?: string }>
> {
  let conversation_id;
  let order_id;

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

      conversation_id =
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
          customer_name: "",
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

      order_id = order.id;

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
          text: `Order masuk. Mohon konfirmasi apakah pesanan tersedia`,
        },
      });
    });

    return successResponse(
      { conversation_id, order_id },
      "Berhasil memproses pesanan"
    );
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

export async function deleteShopCart(
  shop_cart_id: string
): Promise<ServerActionReturn<void>> {
  try {
    await prisma.$transaction(async (tx) => {
      // Hapus semua item dalam shop cart terlebih dahulu
      await tx.cartItem.deleteMany({
        where: {
          shop_cart_id,
        },
      });
      // Hapus shop cart
      await tx.shopCart.delete({
        where: {
          id: shop_cart_id,
        },
      });
    });
    return successResponse(undefined, "Berhasil menghapus keranjang");
  } catch (error) {
    console.error("Error deleting shop cart:", error);
    return errorResponse("Gagal menghapus keranjang");
  }
}

export async function deleteCartItem(
  cart_item_id: string
): Promise<ServerActionReturn<void>> {
  try {
    await prisma.$transaction(async (tx) => {
      const cartItem = await tx.cartItem.findFirst({
        where: { id: cart_item_id },
        select: { shop_cart_id: true },
      });

      if (!cartItem) {
        throw new Error("Item keranjang tidak ditemukan");
      }

      await tx.cartItem.delete({
        where: { id: cart_item_id },
      });

      revalidatePath("/dashboard-pelanggan/keranjang/" + cartItem.shop_cart_id);

      await recalculateShopCartTotal(tx, cartItem.shop_cart_id);
    });

    return successResponse(undefined, "Berhasil menghapus item");
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return errorResponse("Gagal menghapus item");
  }
}
