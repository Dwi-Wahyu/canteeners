import { PaymentMethod } from "@/app/generated/prisma";

// Item di keranjang
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  shopId: string;
  shopName: string;
  availablePaymentMethod: PaymentMethod[];
  note?: string;
}

// Struktur state utama
export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

// Struktur grup item per toko (Derived State)
export interface ShopGroup {
  shopId: string;
  shopName: string;
  items: CartItem[];
  shopTotalQuantity: number;
  shopTotalPrice: number;
  availablePaymentMethod: PaymentMethod[];
}

// Struktur Actions yang akan ada di store
export interface CartActions {
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, shopId: string) => void;
  updateQuantity: (
    productId: number,
    shopId: string,
    newQuantity: number
  ) => void;
  clearCart: () => void;
  updateItemDetails: (
    productId: number,
    shopId: string,
    details: Partial<
      Omit<
        CartItem,
        "productId" | "shopId" | "name" | "price" | "availablePaymentMethod"
      >
    >
  ) => void;
  // Fungsi untuk mendapatkan data yang sudah dikelompokkan
  getGroupedItems: () => Record<string, ShopGroup>;
}

// Gabungan State dan Actions
export type CartStore = CartState & CartActions;
