import { NextRequest, NextResponse } from "next/server";

import { handleApiError, parseRequestBody } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { updateFolderSchema } from "@/lib/validation/folderSchemas";
import { deleteFolderForUser, updateFolderForUser } from "@/services/folderService";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireCurrentUser(request);
    const data = await parseRequestBody(request, updateFolderSchema);
    const folder = await updateFolderForUser(user.id, id, data);

    return NextResponse.json({ folder });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireCurrentUser(request);

    await deleteFolderForUser(user.id, id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}