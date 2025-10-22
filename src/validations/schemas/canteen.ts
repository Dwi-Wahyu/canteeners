import { z } from "zod";

export const InputProductSchema = z.object({
  floor: z.int(),
  image_url: z.string(),
});
