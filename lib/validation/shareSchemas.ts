import { z } from "zod";

export const shareDeckSchema = z
  .object({
    email: z.string().trim().email(),
    role: z.enum(["VIEWER", "EDITOR"]).default("VIEWER"),
  })
  .strict();
