import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/errors";
import { requireCurrentUser } from "@/lib/api/getCurrentUser";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await requireCurrentUser(request);
    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
