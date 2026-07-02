import { z } from "zod";

export const deckImportSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().max(2000).nullable().optional(),
    cards: z
      .array(
        z
          .object({
            original: z.string().trim().min(1).max(1000),
            translation: z.string().trim().min(1).max(1000),
          })
          .strict(),
      )
      .min(1)
      .max(1000),
  })
  .strict();

export type DeckImportInput = z.infer<typeof deckImportSchema>;