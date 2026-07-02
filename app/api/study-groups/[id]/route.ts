import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";
import { getStudyGroupForUser } from "@/services/studyGroupService";

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