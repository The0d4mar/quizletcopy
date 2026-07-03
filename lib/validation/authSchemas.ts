import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    email: z.string().trim().toLowerCase().email().max(255),
    password: z.string().min(8).max(128),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(255),
    password: z.string().min(1).max(128),
  })
  .passthrough();
export const updateAccountSchema = z
  .object({
    name: z.string().trim().min(1).max(80).nullable(),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(128),
    newPassword: z.string().min(8).max(128),
  })
  .strict()
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from current password",
  });

export const deleteAccountSchema = z
  .object({
    currentPassword: z.string().min(1).max(128),
  })
  .strict();
