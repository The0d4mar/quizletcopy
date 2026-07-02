import { NextRequest, NextResponse } from "next/server";

import { handleApiError, parseRequestBody } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { updateCardSchema } from "@/lib/validation/cardSchemas";
import { deleteCardForUser, updateCardForUser } from "@/services/cardService";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireCurrentUser(request);
    const data = await parseRequestBody(request, updateCardSchema);
    const updatedCard = await updateCardForUser(user.id, id, data);

    return NextResponse.json({ card: updatedCard });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireCurrentUser(request);

    await deleteCardForUser(user.id, id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}