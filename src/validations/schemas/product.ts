import { z } from "zod";

export const ProductOptionSchema = z.object({
  option: z.string().min(1, { message: "Nama opsi harus diisi." }),
  additional_price: z.string().nullable().optional(),
  grouped_by: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
});

export const InputProductSchema = z.object({
  name: z.string().min(1, { message: "Nama produk harus diisi." }),
  description: z.string().optional(),
  image_url: z.string(),
  price: z.string().min(1, { message: "Harga produk harus diisi." }),
  cost: z.string().optional().nullable(),
  shop_id: z.string().min(1, { message: "ID kedai harus diisi." }),
  categories: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  options: z.array(ProductOptionSchema),
});

export type InputProductSchemaType = z.infer<typeof InputProductSchema>;

export const EditProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Nama produk harus diisi." }),
  description: z.string().optional(),
  image_url: z.string(),
  price: z.string().min(1, { message: "Harga produk harus diisi." }),
  cost: z.string().optional().nullable(),
  shop_id: z.string().min(1, { message: "ID kedai harus diisi." }),
  categories: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  options: z.array(ProductOptionSchema),
});

export type EditProductSchemaType = z.infer<typeof EditProductSchema>;
