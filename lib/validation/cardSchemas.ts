import { z } from "zod";

export const createCardSchema = z
  .object({
    id: z.string().trim().min(1).optional(),
    original: z.string().trim().min(1).max(1000),
    translation: z.string().trim().min(1).max(1000),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export const updateCardSchema = z
  .object({
    original: z.string().trim().min(1).max(1000).optional(),
    translation: z.string().trim().min(1).max(1000).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
