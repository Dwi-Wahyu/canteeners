import { RefundDisbursementMode } from "@/app/generated/prisma";
import { z } from "zod";

export const PaymentMethodEnum = z.enum(["QRIS", "BANK_TRANSFER", "CASH"]);

export const InputPaymentSchema = z
  .object({
    method: PaymentMethodEnum,

    qr_url: z.string().optional().or(z.literal("")), // Menerima string atau string kosong
    account_number: z
      .string()
      .min(5, { message: "Nomor rekening minimal 5 karakter." })
      .optional()
      .or(z.literal("")),
    note: z.string().optional(),
  })
  .refine(
    (data) => {
      // Hilangkan string kosong jika ada
      const qr_url = data.qr_url === "" ? undefined : data.qr_url;
      const account_number =
        data.account_number === "" ? undefined : data.account_number;

      switch (data.method) {
        case "BANK_TRANSFER":
          // WAJIB: account_number harus ada, qr_url TIDAK BOLEH ada
          return !!account_number && !qr_url;
        case "QRIS":
          // WAJIB: qr_url harus ada, account_number TIDAK BOLEH ada
          return !!qr_url && !account_number;
        case "CASH":
          // WAJIB: Keduanya TIDAK BOLEH ada
          return !qr_url && !account_number;
        default:
          return false; // Jika ada nilai method yang tidak terduga
      }
    },
    {
      message:
        "Validasi Metode Pembayaran Gagal. Pastikan hanya kolom yang relevan (account_number atau qr_url) yang terisi sesuai metode yang dipilih.",
      path: ["method"], // Tampilkan error ini pada field 'method'
    }
  );

export type InputPaymentSchemaType = z.infer<typeof InputPaymentSchema>;

export const InputShopSchema = z.object({
  name: z.string().min(1, { message: "Nama toko harus diisi." }),
  description: z.string().optional(),
  image_url: z.string(),
  canteen_id: z
    .number()
    .int("ID Kantin harus berupa bilangan bulat.")
    .positive("ID Kantin harus positif."),
  owner_id: z.string().min(1, { message: "ID Pemilik harus diisi." }),
  order_mode: z.enum(["PREORDER_ONLY", "READY_ONLY", "BOTH"]),
  payments: z
    .array(InputPaymentSchema)
    .min(1, { error: "Pilih minimal 1 metode pembayaran" }),
});

export type InputShopSchemaType = z.infer<typeof InputShopSchema>;

const timeRegex = /^([01]\d|2[0-3]):?([0-5]\d)$/; // Format HH:MM 24-jam

export const UpdateShopSchema = z.object({
  id: z.string().min(1, { message: "ID shop harus diisi." }),
  name: z.string().min(1, { message: "Nama toko harus diisi." }),
  description: z.string().optional(),
  image_url: z.string(),
  order_mode: z.enum(["PREORDER_ONLY", "READY_ONLY", "BOTH"]),
  open_time: z
    .string()
    .regex(timeRegex, { message: "Format waktu harus HH:MM yang valid." }) // Tambahkan regex
    .optional()
    .nullable(),
  close_time: z
    .string()
    .regex(timeRegex, { message: "Format waktu harus HH:MM yang valid." }) // Tambahkan regex
    .optional()
    .nullable(),
  refund_disbursement_mode: z.enum(Object.values(RefundDisbursementMode)),
});

export type UpdateShopSchemaType = z.infer<typeof UpdateShopSchema>;
