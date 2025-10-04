import { getAllShopProducts } from "./queries";

export type OrderItemType = {
  product_id: number;
  quantity: number;
  product_name: string;
  price: number;
};

export type ProductsType = Awaited<ReturnType<typeof getAllShopProducts>>;
