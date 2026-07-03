import { NextRequest, NextResponse } from "next/server";

import { ApiError, handleApiError, parseRequestBody } from "@/lib/api/errors";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation/authSchemas";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const data = await parseRequestBody(request, registerSchema);
    const passwordHash = await hashPassword(data.password);
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ApiError(409, "User with this email already exists");
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}