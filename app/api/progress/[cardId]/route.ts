import { Prisma, StudyGroupMemberStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { ApiError, handleApiError, parseRequestBody } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { updateProgressSchema } from "@/lib/validation/progressSchemas";

type RouteParams = {
  params: Promise<{ cardId: string }>;
};

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { cardId } = await params;
    const user = await requireCurrentUser(request);
    const data = await parseRequestBody(request, updateProgressSchema);

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        deck: { select: { ownerId: true, isPublic: true, studyGroup: { select: { members: { where: { userId: user.id, status: StudyGroupMemberStatus.APPROVED }, select: { id: true } } } } } },
      },
    });

    if (!card || (!card.deck.isPublic && card.deck.ownerId !== user.id && (card.deck.studyGroup?.members.length ?? 0) === 0)) {
      throw new ApiError(404, "Card not found");
    }

    const fallbackLastRepeat = data.lastRepeat ?? new Date();
    const updateData: Prisma.CardProgressUpdateInput =
      data.isCorrect === undefined
        ? {
            numOfRepeats: data.numOfRepeats,
            wrongRepeats: data.wrongRepeats,
            lastRepeat: data.lastRepeat,
          }
        : {
            numOfRepeats: { increment: 1 },
            wrongRepeats: { increment: data.isCorrect ? 0 : 1 },
            lastRepeat: fallbackLastRepeat,
          };

    const progress = await prisma.cardProgress.upsert({
      where: {
        userId_cardId: {
          userId: user.id,
          cardId,
        },
      },
      update: updateData,
      create: {
        userId: user.id,
        cardId,
        numOfRepeats: data.numOfRepeats ?? (data.isCorrect === undefined ? 0 : 1),
        wrongRepeats: data.wrongRepeats ?? (data.isCorrect === false ? 1 : 0),
        lastRepeat: fallbackLastRepeat,
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    return handleApiError(error);
  }
}
