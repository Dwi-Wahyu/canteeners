import { create } from "zustand";
import {
  CartState,
  CartActions,
  CartStore,
  CartItem,
  ShopGroup,
} from "./types";

// State Awal
const initialCartState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0.0,
};

// Logika Perhitungan (Fungsi Helper)
const calculateTotalsAndGrouping = (items: CartItem[]) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Mengelompokkan item per toko (Record<string, ShopGroup> adalah cara TypeScript untuk objek dengan key string)
  const groupedItems: Record<string, ShopGroup> = items.reduce(
    (groups, item) => {
      const { shopId, shopName, price, quantity } = item;
      const subTotal = price * quantity;

      if (!groups[shopId]) {
        groups[shopId] = {
          shopId,
          shopName,
          items: [],
          shopTotalQuantity: 0,
          shopTotalPrice: 0.0,
        };
      }

      groups[shopId].items.push(item);
      groups[shopId].shopTotalQuantity += quantity;
      groups[shopId].shopTotalPrice += subTotal;

      return groups;
    },
    {} as Record<string, ShopGroup>
  ); // Memberikan tipe awal pada accumulator

  return { totalQuantity, totalPrice, groupedItems };
};

// Buat Store
export const useCartStore = create<CartStore>((set, get) => ({
  ...initialCartState,

  // Derived State / Selector
  getGroupedItems: () => {
    // Menghitung grup item setiap kali dipanggil
    const state = get();
    return calculateTotalsAndGrouping(state.items).groupedItems;
  },

  // A. Menambahkan/Mengupdate Item
  addItem: (newItem: CartItem) =>
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        // Item unik diidentifikasi oleh productId DAN shopId
        (item) =>
          item.productId === newItem.productId && item.shopId === newItem.shopId
      );

      let updatedItems: CartItem[];
      if (existingItemIndex > -1) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, newItem];
      }

      // Perhitungan
      const { totalQuantity, totalPrice } =
        calculateTotalsAndGrouping(updatedItems);

      return {
        items: updatedItems,
        totalQuantity,
        totalPrice,
      };
    }),

  // B. Menghapus Item
  removeItem: (productIdToRemove, shopIdToRemove) =>
    set((state) => {
      const updatedItems = state.items.filter(
        (item) =>
          !(
            item.productId === productIdToRemove &&
            item.shopId === shopIdToRemove
          )
      );

      // Perhitungan
      const { totalQuantity, totalPrice } =
        calculateTotalsAndGrouping(updatedItems);

      return {
        items: updatedItems,
        totalQuantity,
        totalPrice,
      };
    }),

  // C. Mengubah Kuantitas Item
  updateQuantity: (productId, shopId, newQuantity) =>
    set((state) => {
      if (newQuantity <= 0) {
        // Panggil fungsi removeItem dari store
        get().removeItem(productId, shopId);
        // return get().removeItem(productId, shopId);
      }

      const updatedItems = state.items.map((item) => {
        if (item.productId === productId && item.shopId === shopId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      // Perhitungan
      const { totalQuantity, totalPrice } =
        calculateTotalsAndGrouping(updatedItems);

      return {
        items: updatedItems,
        totalQuantity,
        totalPrice,
      };
    }),

  // D. Mengosongkan Keranjang
  clearCart: () => set(initialCartState),
}));
