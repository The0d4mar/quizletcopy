import { StudyGroupMemberStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { ApiError, handleApiError } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ deckId: string }>;
};

export const runtime = "nodejs";

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { deckId } = await params;
    const user = await requireCurrentUser(request);

    const deck = await prisma.deck.findFirst({
      where: {
        id: deckId,
        OR: [{ ownerId: user.id }, { isPublic: true }, { studyGroup: { members: { some: { userId: user.id, status: StudyGroupMemberStatus.APPROVED } } } }],
      },
      select: { id: true },
    });

    if (!deck) {
      throw new ApiError(404, "Deck not found");
    }

    const result = await prisma.cardProgress.deleteMany({
      where: {
        userId: user.id,
        card: { deckId },
      },
    });

    return NextResponse.json({ ok: true, deletedCount: result.count });
  } catch (error) {
    return handleApiError(error);
  }
}
