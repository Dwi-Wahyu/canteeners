"use server";

import { prisma } from "@/lib/prisma";

export async function getCustomerCart(user_id: string) {
  return await prisma.cart.findFirst({
    where: {
      user_id,
    },
    include: {
      shopCarts: {
        select: {
          id: true,
          status: true,
          created_at: true,
          shop: {
            select: {
              id: true,
              image_url: true,
              name: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
      },
    },
  });
}

export async function getCustomerShopCart(shop_cart_id: string) {
  return await prisma.shopCart.findFirst({
    where: {
      id: shop_cart_id,
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
}

export async function getExistingPendingCustomerShopCart({
  cart_id,
  shop_id,
}: {
  cart_id: string;
  shop_id: string;
}) {
  return await prisma.shopCart.findMany({
    where: {
      cart_id,
      shop_id,
    },
    select: {
      created_at: true,
      _count: {
        select: {
          items: true,
        },
      },
    },
  });
}
