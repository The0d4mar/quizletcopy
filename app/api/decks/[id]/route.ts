import { NextRequest, NextResponse } from "next/server";

import { handleApiError, parseRequestBody } from "@/lib/api/errors";
import { getCurrentUser, requireCurrentUser } from "@/lib/api/getCurrentUser";
import { updateDeckSchema } from "@/lib/validation/deckSchemas";
import { deleteDeckForUser, getDeckForRead, updateDeckForUser } from "@/services/deckService";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export const runtime = "nodejs";

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    const deck = await getDeckForRead(id, user?.id);

    return NextResponse.json({ deck });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireCurrentUser(request);
    const data = await parseRequestBody(request, updateDeckSchema);
    const deck = await updateDeckForUser(user.id, id, data);

    return NextResponse.json({ deck });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireCurrentUser(request);

    await deleteDeckForUser(user.id, id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
