import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("q")?.trim();
    const sort = searchParams.get("sort") ?? "recent";

    const decks = await prisma.deck.findMany({
      where: {
        isPublic: true,
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy:
        sort === "popular"
          ? [{ cards: { _count: "desc" } }, { updatedAt: "desc" }]
          : sort === "created"
            ? { createdAt: "desc" }
            : { updatedAt: "desc" },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { cards: true } },
      },
    });

    return NextResponse.json({ decks });
  } catch (error) {
    return handleApiError(error);
  }
}