"use client";

import { PaymentMethod } from "@/app/generated/prisma";
import { create } from "zustand";

export type KeranjangItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  note?: string;
};

export type KedaiState = {
  id: string;
  name: string;
  ownerId: string;
  items: KeranjangItem[];
  totalQuantity: number;
  totalPrice: number;
  paymentMethod?: PaymentMethod;
  availablePaymentMethod: PaymentMethod[];
};

export type KeranjangState = {
  kedai: Record<string, KedaiState>;
  totalQuantity: number;
  totalPrice: number;
  actions: {
    addKedai: (
      id: string,
      name: string,
      availablePaymentMethod: PaymentMethod[],
      ownerId: string
    ) => void;
    removeKedai: (id: string) => void;
    clearKeranjang: () => void;
    addItem: (kedaiId: string, item: KeranjangItem) => void;
    updateItem: (
      kedaiId: string,
      productId: number,
      updates: { quantity?: number; note?: string }
    ) => void;
    setShopPaymentMethod: (
      kedaiId: string,
      paymentMethod?: PaymentMethod
    ) => void; // Action baru
  };
};

// Fungsi helper untuk menghitung total per kedai
const calculateTotals = (
  items: KeranjangItem[]
): { totalQuantity: number; totalPrice: number } => {
  return items.reduce(
    (acc, item) => ({
      totalQuantity: acc.totalQuantity + item.quantity,
      totalPrice: acc.totalPrice + item.price * item.quantity,
    }),
    { totalQuantity: 0, totalPrice: 0 }
  );
};

// Fungsi helper untuk menghitung total keseluruhan keranjang
const calculateCartTotals = (
  kedai: Record<string, KedaiState>
): { totalQuantity: number; totalPrice: number } => {
  return Object.values(kedai).reduce(
    (acc, k) => ({
      totalQuantity: acc.totalQuantity + k.totalQuantity,
      totalPrice: acc.totalPrice + k.totalPrice,
    }),
    { totalQuantity: 0, totalPrice: 0 }
  );
};

export const useKeranjangStore = create<KeranjangState>((set) => ({
  kedai: {},
  totalQuantity: 0,
  totalPrice: 0,
  actions: {
    addKedai(id, name, availablePaymentMethod, ownerId) {
      set((state) => {
        if (state.kedai[id]) return state;
        const newKedai: KedaiState = {
          id,
          name,
          ownerId,
          items: [],
          totalQuantity: 0,
          totalPrice: 0,
          availablePaymentMethod,
        };
        const updatedKedai = { ...state.kedai, [id]: newKedai };
        return {
          kedai: updatedKedai,
          totalQuantity: state.totalQuantity,
          totalPrice: state.totalPrice,
        };
      });
    },
    removeKedai(id) {
      set((state) => {
        const { [id]: _, ...rest } = state.kedai;
        const { totalQuantity, totalPrice } = calculateCartTotals(rest);
        return {
          kedai: rest,
          totalQuantity,
          totalPrice,
        };
      });
    },
    clearKeranjang() {
      set({ kedai: {}, totalQuantity: 0, totalPrice: 0 });
    },
    addItem(kedaiId, newItem) {
      set((state) => {
        const kedai = state.kedai[kedaiId];
        if (!kedai) {
          console.warn(`Kedai dengan ID ${kedaiId} tidak ditemukan`);
          return state;
        }
        const existingItemIndex = kedai.items.findIndex(
          (item) => item.productId === newItem.productId
        );
        let updatedItems: KeranjangItem[];
        if (existingItemIndex !== -1) {
          updatedItems = kedai.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        } else {
          updatedItems = [...kedai.items, newItem];
        }
        const { totalQuantity, totalPrice } = calculateTotals(updatedItems);
        const updatedKedai = {
          ...state.kedai,
          [kedaiId]: {
            ...kedai,
            items: updatedItems,
            totalQuantity,
            totalPrice,
          },
        };
        const cartTotals = calculateCartTotals(updatedKedai);
        return {
          kedai: updatedKedai,
          totalQuantity: cartTotals.totalQuantity,
          totalPrice: cartTotals.totalPrice,
        };
      });
    },
    updateItem(kedaiId, productId, updates) {
      set((state) => {
        const kedai = state.kedai[kedaiId];
        if (!kedai) {
          console.warn(`Kedai dengan ID ${kedaiId} tidak ditemukan`);
          return state;
        }
        const itemIndex = kedai.items.findIndex(
          (item) => item.productId === productId
        );
        if (itemIndex === -1) {
          console.warn(
            `Item dengan productId ${productId} tidak ditemukan di kedai ${kedaiId}`
          );
          return state;
        }
        const updatedItems = kedai.items.map((item, index) =>
          index === itemIndex
            ? {
                ...item,
                quantity:
                  updates.quantity !== undefined
                    ? updates.quantity
                    : item.quantity,
                note: updates.note !== undefined ? updates.note : item.note,
              }
            : item
        );
        const { totalQuantity, totalPrice } = calculateTotals(updatedItems);
        const updatedKedai = {
          ...state.kedai,
          [kedaiId]: {
            ...kedai,
            items: updatedItems,
            totalQuantity,
            totalPrice,
          },
        };
        const cartTotals = calculateCartTotals(updatedKedai);
        return {
          kedai: updatedKedai,
          totalQuantity: cartTotals.totalQuantity,
          totalPrice: cartTotals.totalPrice,
        };
      });
    },
    setShopPaymentMethod(kedaiId, paymentMethod) {
      set((state) => {
        const kedai = state.kedai[kedaiId];
        if (!kedai) {
          console.warn(`Kedai dengan ID ${kedaiId} tidak ditemukan`);
          return state;
        }

        // (Opsional) Validasi bahwa paymentMethod ada di availablePaymentMethod
        if (
          paymentMethod !== undefined &&
          !kedai.availablePaymentMethod.includes(paymentMethod)
        ) {
          console.warn(
            `Metode pembayaran ${paymentMethod} tidak tersedia untuk kedai ${kedaiId}`
          );
          return state;
        }

        const updatedKedai = {
          ...state.kedai,
          [kedaiId]: {
            ...kedai,
            paymentMethod, // Set ke paymentMethod baru atau undefined
          },
        };

        return {
          kedai: updatedKedai,
          totalQuantity: state.totalQuantity, // Tidak berubah
          totalPrice: state.totalPrice, // Tidak berubah
        };
      });
    },
  },
}));

// export const useKeranjang = useKeranjangStore((state) => state.kedai);
// export const useKeranjangActions = useKeranjangStore((state) => state.actions);
// export const useKeranjangTotals = useKeranjangStore((state) => ({
//   totalQuantity: state.totalQuantity,
//   totalPrice: state.totalPrice,
// }));

export function useKeranjang() {
  return useKeranjangStore((state) => state.kedai);
}

export function useKeranjangActions() {
  return useKeranjangStore((state) => state.actions);
}

export function useKeranjangTotalQuantity() {
  return useKeranjangStore((state) => state.totalQuantity);
}

export function useKeranjangTotalPrice() {
  return useKeranjangStore((state) => state.totalPrice);
}
