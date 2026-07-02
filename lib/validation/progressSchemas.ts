import { z } from "zod";

export const updateProgressSchema = z
  .object({
    isCorrect: z.boolean().optional(),
    numOfRepeats: z.number().int().min(0).optional(),
    wrongRepeats: z.number().int().min(0).optional(),
    lastRepeat: z.coerce.date().nullable().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");
