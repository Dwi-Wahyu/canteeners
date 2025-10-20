import { z } from "zod";

export const ProductOptionSchema = z.object({
  option: z.string().min(1, { message: "Nama pilihan produk harus diisi." }),
  additional_price: z.number().default(0),
});

export type ProductOptionSchemaType = z.infer<typeof ProductOptionSchema>;

export const InputProductSchema = z.object({
  name: z.string().min(1, { message: "Nama produk harus diisi." }),
  description: z.string().optional(),
  image_url: z.string(),
  price: z.string().min(1, { message: "Harga produk harus diisi." }),
  shop_id: z.string().min(1, { message: "ID Pemilik harus diisi." }),
  options: z.array(ProductOptionSchema),
  category: z
    .object({
      product_id: z.int(),
      category_id: z.int(),
    })
    .optional()
    .nullable(),
});

export type InputProductSchemaType = z.infer<typeof InputProductSchema>;

export const EditProductSchema = z.object({
  id: z.int(),
  name: z.string().min(1, { message: "Nama produk harus diisi." }),
  description: z.string().optional(),
  image_url: z.string(),
  price: z.string().min(1, { message: "Harga produk harus diisi." }),
  options: z.array(ProductOptionSchema),
  category: z
    .object({
      product_id: z.int(),
      category_id: z.int(),
    })
    .optional()
    .nullable(),
});

export type EditProductSchemaType = z.infer<typeof EditProductSchema>;
