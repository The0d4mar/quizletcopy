import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { leaveStudyGroup } from "@/services/studyGroupService";

type RouteParams = { params: Promise<{ id: string }> };

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireCurrentUser(request);
    const result = await leaveStudyGroup(user.id, id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}