import { NextRequest, NextResponse } from "next/server";

import { handleApiError, parseRequestBody } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { joinStudyGroupSchema } from "@/lib/validation/studyGroupSchemas";
import { requestStudyGroupJoin } from "@/services/studyGroupService";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await requireCurrentUser(request);
    const data = await parseRequestBody(request, joinStudyGroupSchema);
    const member = await requestStudyGroupJoin(user.id, data.value);
    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}