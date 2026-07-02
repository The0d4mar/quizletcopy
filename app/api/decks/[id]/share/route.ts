import { NextRequest, NextResponse } from "next/server";

import { ApiError, handleApiError, parseRequestBody } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { shareDeckSchema } from "@/lib/validation/shareSchemas";

type RouteParams = { params: Promise<{ id: string }> };

export const runtime = "nodejs";

async function assertOwner(deckId: string, userId: string) {
  const deck = await prisma.deck.findUnique({ where: { id: deckId }, select: { ownerId: true } });
  if (!deck) throw new ApiError(404, "Deck not found");
  if (deck.ownerId !== userId) throw new ApiError(403, "Only deck owner can manage sharing");
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireCurrentUser(request);
    await assertOwner(id, user.id);

    const shares = await prisma.deckShare.findMany({
      where: { deckId: id },
      include: { user: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ shares });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const owner = await requireCurrentUser(request);
    const data = await parseRequestBody(request, shareDeckSchema);
    await assertOwner(id, owner.id);

    const targetUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (!targetUser) throw new ApiError(404, "User to share with not found");
    if (targetUser.id === owner.id) throw new ApiError(400, "Owner already has access");

    const share = await prisma.deckShare.upsert({
      where: { deckId_userId: { deckId: id, userId: targetUser.id } },
      update: { role: data.role },
      create: { deckId: id, userId: targetUser.id, role: data.role },
      include: { user: { select: { id: true, email: true, name: true } } },
    });

    return NextResponse.json({ share }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
