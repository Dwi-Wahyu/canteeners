import { z } from "zod";

export const InputProductSchema = z.object({
  name: z.string().min(1, { message: "Nama produk harus diisi." }),
  description: z.string().optional(),
  image_url: z.string(),
  price: z.string().min(1, { message: "Harga produk harus diisi." }),
  shop_id: z.string().min(1, { message: "ID Pemilik harus diisi." }),
});

export type InputProductSchemaType = z.infer<typeof InputProductSchema>;
