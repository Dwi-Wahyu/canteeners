import { z } from "zod";

export const InputShopSchema = z.object({
  name: z.string().min(1, { message: "Nama toko harus diisi." }),
  description: z.string().optional(),
  image_url: z.string(),
  canteen_id: z
    .number()
    .int("ID Kantin harus berupa bilangan bulat.")
    .positive("ID Kantin harus positif."),
  owner_id: z.string().min(1, { message: "ID Pemilik harus diisi." }),
});

export type InputShopSchemaType = z.infer<typeof InputShopSchema>;
