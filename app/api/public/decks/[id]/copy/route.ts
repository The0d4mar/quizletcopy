import { NextRequest, NextResponse } from "next/server";

import { ApiError, handleApiError } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireCurrentUser(request);

    const sourceDeck = await prisma.deck.findFirst({
      where: { id, isPublic: true },
      include: { cards: { orderBy: { createdAt: "asc" } } },
    });

    if (!sourceDeck) {
      throw new ApiError(404, "Public deck not found");
    }

    const deck = await prisma.deck.create({
      data: {
        title: `Copy: ${sourceDeck.title}`,
        description: sourceDeck.description,
        isPublic: false,
        ownerId: user.id,
        cards: {
          create: sourceDeck.cards.map((card) => ({
            original: card.original,
            translation: card.translation,
          })),
        },
      },
      include: { _count: { select: { cards: true } } },
    });

    return NextResponse.json({ deck }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}