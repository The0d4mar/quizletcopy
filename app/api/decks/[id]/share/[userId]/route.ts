import { NextRequest, NextResponse } from "next/server";

import { ApiError, handleApiError } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string; userId: string }> };

export const runtime = "nodejs";

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, userId } = await params;
    const owner = await requireCurrentUser(request);
    const deck = await prisma.deck.findUnique({ where: { id }, select: { ownerId: true } });

    if (!deck) throw new ApiError(404, "Deck not found");
    if (deck.ownerId !== owner.id) throw new ApiError(403, "Only deck owner can manage sharing");

    await prisma.deckShare.delete({ where: { deckId_userId: { deckId: id, userId } } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
