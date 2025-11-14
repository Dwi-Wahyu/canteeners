import { useCartStore } from "@/store/cart";

export const useCartActions = useCartStore.getState().actions;

export const setCustomerData = useCartActions.setCustomerData;
