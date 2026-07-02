import { NextRequest, NextResponse } from "next/server";

import { handleApiError, parseRequestBody } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { updateStudyGroupSchema } from "@/lib/validation/studyGroupSchemas";
import { deleteStudyGroupForOwner, getStudyGroupForUser, updateStudyGroupForOwner } from "@/services/studyGroupService";

type RouteParams = { params: Promise<{ id: string }> };

export const runtime = "nodejs";

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireCurrentUser(request);
    const group = await getStudyGroupForUser(id, user.id);
    return NextResponse.json({ group });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireCurrentUser(request);
    const data = await parseRequestBody(request, updateStudyGroupSchema);
    const group = await updateStudyGroupForOwner(user.id, id, data);
    return NextResponse.json({ group });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireCurrentUser(request);
    const result = await deleteStudyGroupForOwner(user.id, id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}