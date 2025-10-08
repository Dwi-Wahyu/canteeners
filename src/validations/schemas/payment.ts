import z from "zod";

const PaymentMethodEnum = z.enum(["QRIS", "BANK_TRANSFER", "CASH"]);

export const PaymentSchema = z.object({
  method: PaymentMethodEnum,

  qr_url: z.string().optional().nullable(), // Menerima string atau string kosong
  account_number: z
    .string()
    .min(5, { message: "Nomor rekening minimal 5 karakter." })
    .optional()
    .nullable(),
  note: z.string().optional(),
});

export type PaymentSchemaType = z.infer<typeof PaymentSchema>;
