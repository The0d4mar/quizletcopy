import { NextRequest, NextResponse } from "next/server";

import { handleApiError, parseRequestBody } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { createDeckSchema } from "@/lib/validation/deckSchemas";
import { createDeckForUser, listDecksForUser } from "@/services/deckService";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await requireCurrentUser(request);
    const scope = request.nextUrl.searchParams.get("scope");
    const decks = await listDecksForUser(user.id, scope);

    return NextResponse.json({ decks });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireCurrentUser(request);
    const data = await parseRequestBody(request, createDeckSchema);
    const deck = await createDeckForUser(user.id, data);

    return NextResponse.json({ deck }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
