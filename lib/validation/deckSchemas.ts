import { z } from "zod";

const deckWriteFields = {
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).nullable().optional(),
  isPublic: z.boolean().optional(),
  lastRepeat: z.coerce.date().nullable().optional(),
};

export const createDeckSchema = z
  .object({
    id: z.string().trim().min(1).optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    ...deckWriteFields,
  })
  .strict();

export const updateDeckSchema = z
  .object(deckWriteFields)
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");

export type CreateDeckInput = z.infer<typeof createDeckSchema>;
export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;
