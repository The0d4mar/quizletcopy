import { NextRequest, NextResponse } from "next/server";

import { handleApiError, parseRequestBody } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { addDeckToFolderSchema } from "@/lib/validation/folderSchemas";
import { addDeckToFolderForUser } from "@/services/folderService";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireCurrentUser(request);
    const { deckId } = await parseRequestBody(request, addDeckToFolderSchema);
    const folder = await addDeckToFolderForUser(user.id, id, deckId);

    return NextResponse.json({ folder });
  } catch (error) {
    return handleApiError(error);
  }
}