import z from "zod";

const ShopBillingStatus = z.enum(["PAID", "UNPAID"]);

export const InputShopBilling = z.object({
  start_date: z.date(),
  end_date: z.date(),
  shop_id: z.string(),
});

export type InputShopBillingType = z.infer<typeof InputShopBilling>;
