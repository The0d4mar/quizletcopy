import { signIn, signOut } from "next-auth/react";

import type { User } from "@/types/auth.type";

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? String(payload.error)
        : "Auth request failed";

    throw new Error(message);
  }

  return payload as T;
}

export async function registerUser(input: { name?: string; email: string; password: string }) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return readJson<{ user: User }>(response);
}

export async function loginUser(input: { email: string; password: string; callbackUrl?: string }) {
  const result = await signIn("credentials", {
    email: input.email.trim().toLowerCase(),
    password: input.password,
    redirect: false,
    callbackUrl: input.callbackUrl ?? "/",
  });

  if (!result || result.error) {
    throw new Error("Неверный email или пароль");
  }

  return result.url ?? input.callbackUrl ?? "/";
}

export async function logoutUser() {
  await signOut({ callbackUrl: "/login" });
}