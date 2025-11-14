import { createStore } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

type CartStoreActions = {
  setCustomerData: ({
    customer_name,
    customer_avatar,
  }: {
    customer_name: string;
    customer_avatar: string;
  }) => void;
  addStore: () => void;
};

type CartStore = {
  customer_name: string;
  customer_avatar: string;

  actions: CartStoreActions;
};

export const useCartStore = createStore<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        customer_name: "",
        customer_avatar: "",
        actions: {
          addStore() {},
          setCustomerData({ customer_name, customer_avatar }) {
            set({ customer_name, customer_avatar });
          },
        },
      }),
      {
        name: "cart-storage",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
