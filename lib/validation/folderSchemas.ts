import { z } from "zod";

export const createFolderSchema = z
  .object({
    id: z.string().trim().min(1).optional(),
    title: z.string().trim().min(1).max(120),
    deckIds: z.array(z.string().min(1)).optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .strict();

export const updateFolderSchema = createFolderSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");

export const addDeckToFolderSchema = z
  .object({
    deckId: z.string().min(1),
  })
  .strict();

export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type UpdateFolderInput = z.infer<typeof updateFolderSchema>;
export type AddDeckToFolderInput = z.infer<typeof addDeckToFolderSchema>;
