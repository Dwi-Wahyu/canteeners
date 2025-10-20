import { z } from "zod";

export const InputCategorySchema = z.object({
  name: z.string().min(1, { message: "Nama produk harus diisi." }),
  image_url: z.string(),
});

export type InputCategorySchemaType = z.infer<typeof InputCategorySchema>;

export const EditCategorySchema = z.object({
  id: z.int(),
  name: z.string().min(1, { message: "Nama produk harus diisi." }),
  image_url: z.string(),
});

export type EditCategorySchemaType = z.infer<typeof EditCategorySchema>;
