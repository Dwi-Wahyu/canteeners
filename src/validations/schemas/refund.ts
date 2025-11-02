import { RefundReason, RefundStatus } from "@/app/generated/prisma";
import { z } from "zod";

export const InputRefundSchema = z.object({
  reason: z.enum(Object.values(RefundReason)),
  description: z.string().optional().nullable(),
  order_id: z.string(),
  complaint_proof_url: z.string(),
  amount: z.string().min(0, { error: "Tolong masukkan jumlah refund" }),
  status: z.enum(Object.values(RefundStatus)),
});

export type InputRefundSchemaType = z.infer<typeof InputRefundSchema>;
