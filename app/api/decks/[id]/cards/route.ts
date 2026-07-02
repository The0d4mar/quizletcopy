import { NextRequest, NextResponse } from "next/server";

import { handleApiError, parseRequestBody } from "@/lib/api/errors";
import { getCurrentUser, requireCurrentUser } from "@/lib/api/getCurrentUser";
import { createCardSchema } from "@/lib/validation/cardSchemas";
import { createCardForDeck, listCardsForDeck } from "@/services/cardService";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export const runtime = "nodejs";

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    const cards = await listCardsForDeck(id, user?.id);

    return NextResponse.json({ cards });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireCurrentUser(request);
    const data = await parseRequestBody(request, createCardSchema);
    const card = await createCardForDeck(user.id, id, data);

    return NextResponse.json({ card }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}