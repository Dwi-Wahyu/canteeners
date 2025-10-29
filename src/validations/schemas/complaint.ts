import { z } from "zod";

export const ShopComplaintSchema = z.object({
  cause: z.string().min(1, { message: "Nama produk harus diisi." }),
  proof_url: z.string(),
  order_id: z.string(),
});

export type ShopComplaintSchemaType = z.infer<typeof ShopComplaintSchema>;
