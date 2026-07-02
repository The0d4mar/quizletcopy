import { z } from "zod";

export const studyGroupCardSchema = z.object({
  id: z.string().trim().min(1).optional(),
  original: z.string().trim().min(1).max(1000),
  translation: z.string().trim().min(1).max(1000),
});

export const createStudyGroupSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).optional(),
  cards: z.array(studyGroupCardSchema).min(1),
}).strict();

export const joinStudyGroupSchema = z.object({
  value: z.string().trim().min(1),
}).strict();

export const memberActionSchema = z.object({
  action: z.enum(["approve", "reject", "remove", "resetProgress"]),
}).strict();

export type CreateStudyGroupInput = z.infer<typeof createStudyGroupSchema>;