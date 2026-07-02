import { NextRequest, NextResponse } from "next/server";

import { handleApiError, parseRequestBody } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { createStudyGroupSchema } from "@/lib/validation/studyGroupSchemas";
import { createStudyGroup, listStudyGroups } from "@/services/studyGroupService";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await requireCurrentUser(request);
    const groups = await listStudyGroups(user.id);
    return NextResponse.json(groups);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireCurrentUser(request);
    const data = await parseRequestBody(request, createStudyGroupSchema);
    const group = await createStudyGroup(user.id, data);
    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}