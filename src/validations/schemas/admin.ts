import { z } from "zod";

export const InputAdminSchema = z.object({
  username: z.string().min(1, "Tolong isi username"),
  password: z.string().min(5, "Password minimal 5 karakter"),
  name: z.string().min(1, {
    message: "Tolong isi nama.",
  }),

  avatar: z.string().nullable().optional(),
});

export type InputAdminSchemaType = z.infer<typeof InputAdminSchema>;

export const UpdateAdminSchema = z.object({
  id: z.string(),
  username: z.string().min(1, "Tolong isi username"),
  password: z.string().optional(),
  name: z.string().min(1, {
    message: "Tolong isi nama.",
  }),
  email: z.string().optional(),
  phone_number: z.string().optional(),

  avatar: z.string().nullable().optional(),
});

export type UpdateAdminSchemaType = z.infer<typeof UpdateAdminSchema>;
