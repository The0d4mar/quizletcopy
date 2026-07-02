import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export function jsonError(message: string, status = 500, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return jsonError(error.message, error.status, error.details);
  }

  if (error instanceof ZodError) {
    return jsonError("Invalid request body", 400, error.flatten());
  }

  console.error(error);
  return jsonError("Internal server error", 500);
}

export async function parseRequestBody<T>(request: Request, schema: ZodSchema<T>) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new ApiError(400, "Request body must be valid JSON");
  }

  return schema.parse(body);
}
