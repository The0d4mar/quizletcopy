import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { removeDeckFromFolderForUser } from "@/services/folderService";

type RouteParams = {
  params: Promise<{ id: string; deckId: string }>;
};

export const runtime = "nodejs";

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, deckId } = await params;
    const user = await requireCurrentUser(request);
    const folder = await removeDeckFromFolderForUser(user.id, id, deckId);

    return NextResponse.json({ folder });
  } catch (error) {
    return handleApiError(error);
  }
}