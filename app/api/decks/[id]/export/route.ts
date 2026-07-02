import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/errors";
import { getCurrentUser } from "@/lib/api/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { getDeckForRead } from "@/services/deckService";

type RouteParams = { params: Promise<{ id: string }> };

export const runtime = "nodejs";

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    const deck = await getDeckForRead(id, user?.id);
    const cards = await prisma.card.findMany({
      where: { deckId: id },
      orderBy: { createdAt: "asc" },
      select: { original: true, translation: true },
    });

    return NextResponse.json({
      version: 1,
      exportedAt: new Date().toISOString(),
      deck: {
        title: deck.title,
        description: deck.description,
        cards,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}