import { NextRequest, NextResponse } from "next/server";

import { handleApiError, parseRequestBody } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { deckImportSchema } from "@/lib/validation/importExportSchemas";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await requireCurrentUser(request);
    const data = await parseRequestBody(request, deckImportSchema);

    const deck = await prisma.deck.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        isPublic: false,
        ownerId: user.id,
        cards: {
          create: data.cards.map((card) => ({
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