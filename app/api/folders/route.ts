import { NextRequest, NextResponse } from "next/server";

import { handleApiError, parseRequestBody } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { createFolderSchema } from "@/lib/validation/folderSchemas";
import { createFolderForUser, listFoldersForUser } from "@/services/folderService";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await requireCurrentUser(request);
    const folders = await listFoldersForUser(user.id);

    return NextResponse.json({ folders });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireCurrentUser(request);
    const data = await parseRequestBody(request, createFolderSchema);
    const folder = await createFolderForUser(user.id, data);

    return NextResponse.json({ folder }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}