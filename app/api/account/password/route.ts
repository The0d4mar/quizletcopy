import { NextRequest, NextResponse } from "next/server";

import { ApiError, handleApiError, parseRequestBody } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema } from "@/lib/validation/authSchemas";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireCurrentUser(request);
    const data = await parseRequestBody(request, changePasswordSchema);

    if (!user.passwordHash) {
      throw new ApiError(400, "Password login is not configured for this account");
    }

    const isValidPassword = await verifyPassword(data.currentPassword, user.passwordHash);

    if (!isValidPassword) {
      throw new ApiError(403, "Invalid password");
    }

    const passwordHash = await hashPassword(data.newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
      select: { id: true },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}