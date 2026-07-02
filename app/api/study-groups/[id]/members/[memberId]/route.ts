import { NextRequest, NextResponse } from "next/server";

import { handleApiError, parseRequestBody } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { memberActionSchema } from "@/lib/validation/studyGroupSchemas";
import { manageStudyGroupMember } from "@/services/studyGroupService";

type RouteParams = { params: Promise<{ id: string; memberId: string }> };

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, memberId } = await params;
    const user = await requireCurrentUser(request);
    const { action } = await parseRequestBody(request, memberActionSchema);
    const result = await manageStudyGroupMember(user.id, id, memberId, action);
    return NextResponse.json({ result });
  } catch (error) {
    return handleApiError(error);
  }
}