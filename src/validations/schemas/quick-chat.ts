import { z } from "zod";

export const QuickChatSchema = z.object({
  message: z.string().min(1, "Tolong isi pesan"),
  user_id: z.uuidv4(),
});

export type QuickChatSchemaType = z.infer<typeof QuickChatSchema>;
