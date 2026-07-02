import { NextRequest } from "next/server";

import { auth } from "@/auth";
import { ApiError } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser(request?: NextRequest) {
  const session = await auth();
  const sessionUserId = session?.user?.id;

  if (sessionUserId) {
    return prisma.user.findUnique({ where: { id: sessionUserId } });
  }

  if (process.env.NODE_ENV !== "production" && request) {
    const userId = request.headers.get("x-user-id");

    if (userId) {
      return prisma.user.findUnique({ where: { id: userId } });
    }
  }

  return null;
}

export async function requireCurrentUser(request?: NextRequest) {
  const user = await getCurrentUser(request);

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  return user;
}