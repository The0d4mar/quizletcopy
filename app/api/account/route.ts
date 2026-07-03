import { NextRequest, NextResponse } from "next/server";

import { ApiError, handleApiError, parseRequestBody } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { deleteAccountSchema, updateAccountSchema } from "@/lib/validation/authSchemas";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireCurrentUser(request);
    const data = await parseRequestBody(request, updateAccountSchema);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireCurrentUser(request);
    const data = await parseRequestBody(request, deleteAccountSchema);

    if (!user.passwordHash) {
      throw new ApiError(400, "Password login is not configured for this account");
    }

    const isValidPassword = await verifyPassword(data.currentPassword, user.passwordHash);

    if (!isValidPassword) {
      throw new ApiError(403, "Invalid password");
    }

    await prisma.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}