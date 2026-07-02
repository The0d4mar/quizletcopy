import { NextRequest, NextResponse } from "next/server";

import { ApiError, handleApiError } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await requireCurrentUser(request);
    const deckId = request.nextUrl.searchParams.get("deckId");

    if (deckId) {
      const deck = await prisma.deck.findFirst({
        where: {
          id: deckId,
          OR: [{ ownerId: user.id }, { isPublic: true }],
        },
        select: { id: true },
      });

      if (!deck) {
        throw new ApiError(404, "Deck not found");
      }
    }

    const progress = await prisma.cardProgress.findMany({
      where: {
        userId: user.id,
        ...(deckId ? { card: { deckId } } : {}),
      },
      orderBy: { updatedAt: "desc" },
      include: { card: true },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    return handleApiError(error);
  }
}
