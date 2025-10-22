import { z } from "zod";

export const InputCanteenMapSchema = z.object({
  image_url: z.string(),
  floor: z
    .number()
    .int("Lantai harus berupa bilangan bulat.")
    .positive("Lantai harus positif (misalnya, 1, 2, dst)."),
  canteen_id: z
    .number()
    .int("ID Kantin harus berupa bilangan bulat.")
    .positive("ID Kantin harus positif."),
});

export type InputCanteenMapSchemaType = z.infer<typeof InputCanteenMapSchema>;

export const UpdateCanteenMapSchema = z.object({
  id: z
    .number()
    .int("ID harus berupa bilangan bulat.")
    .positive("ID harus positif."),

  image_url: z.string(),

  floor: z
    .number()
    .int("Lantai harus berupa bilangan bulat.")
    .positive("Lantai harus positif (misalnya, 1, 2, dst).")
    .optional(),
  canteen_id: z
    .number()
    .int("ID Kantin harus berupa bilangan bulat.")
    .positive("ID Kantin harus positif.")
    .optional(),
});

export type UpdateCanteenMapSchemaType = z.infer<typeof UpdateCanteenMapSchema>;

export const InputTableQRCodeSchema = z.object({
  table_number: z
    .number()
    .int("Nomor meja harus berupa bilangan bulat.")
    .positive("Nomor meja harus positif."),

  floor: z
    .number()
    .int("Lantai harus berupa bilangan bulat.")
    .positive("Lantai harus positif (misalnya, 1, 2, dst)."),

  canteen_id: z
    .number()
    .int("ID Kantin harus berupa bilangan bulat.")
    .positive("ID Kantin harus positif."),

  image_url: z.string(),

  map_id: z
    .number()
    .int("ID Peta harus berupa bilangan bulat.")
    .positive("ID Peta harus positif."),
});

export type InputTableQRCodeSchemaType = z.infer<typeof InputTableQRCodeSchema>;

export const UpdateTableQRCodeSchema = z.object({
  id: z.string().min(1, { message: "ID QR Code harus diisi." }),

  table_number: z
    .number()
    .int("Nomor meja harus berupa bilangan bulat.")
    .positive("Nomor meja harus positif.")
    .optional(),

  floor: z
    .number()
    .int("Lantai harus berupa bilangan bulat.")
    .positive("Lantai harus positif (misalnya, 1, 2, dst).")
    .optional(),

  canteen_id: z
    .number()
    .int("ID Kantin harus berupa bilangan bulat.")
    .positive("ID Kantin harus positif.")
    .optional(),

  image_url: z.string(),

  map_id: z
    .number()
    .int("ID Peta harus berupa bilangan bulat.")
    .positive("ID Peta harus positif.")
    .optional(),
});

export type UpdateTableQRCodeSchemaType = z.infer<
  typeof UpdateTableQRCodeSchema
>;
