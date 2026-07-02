export type StudyGroupMemberStatus = "PENDING" | "APPROVED";

export type StudyGroupMember = {
  id: string;
  status: StudyGroupMemberStatus;
  requestedAt: string;
  approvedAt: string | null;
  lastVisitedAt: string | null;
  userId: string;
  user: { id: string; name: string | null; email: string; image?: string | null };
  stats?: { numOfRepeats: number; wrongRepeats: number; lastRepeat: string | null; cards: Array<{ cardId: string; original: string; translation: string; numOfRepeats: number; wrongRepeats: number; lastRepeat: string | null }> };
};

export type StudyGroupCard = {
  id: string;
  original: string;
  translation: string;
  createdAt: string;
  updatedAt: string;
  deckId: string;
};

export type StudyGroup = {
  id: string;
  joinCode: string;
  deckId: string;
  createdAt: string;
  updatedAt: string;
  deck: {
    id: string;
    title: string;
    description: string | null;
    ownerId: string;
    owner: { id: string; name: string | null; email: string };
    cards: StudyGroupCard[];
    _count: { cards: number };
  };
  members: StudyGroupMember[];
};

export type StudyGroupsResponse = { owned: StudyGroup[]; joined: StudyGroup[] };
export type CreateStudyGroupInput = { title: string; description?: string; cards: Array<{ original: string; translation: string }> };
export type UpdateStudyGroupInput = { title?: string; description?: string | null };
export type MemberAction = "approve" | "reject" | "remove" | "resetProgress";

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload && typeof payload === "object" && "error" in payload ? String(payload.error) : "Study groups request failed";
    throw new Error(message);
  }

  return payload as T;
}

export async function getStudyGroups() {
  const response = await fetch("/api/study-groups", { cache: "no-store" });
  return readJson<StudyGroupsResponse>(response);
}

export async function getStudyGroup(groupId: string) {
  const response = await fetch(`/api/study-groups/${groupId}`, { cache: "no-store" });
  const payload = await readJson<{ group: StudyGroup }>(response);
  return payload.group;
}

export async function createStudyGroup(input: CreateStudyGroupInput) {
  const response = await fetch("/api/study-groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = await readJson<{ group: StudyGroup }>(response);
  return payload.group;
}

export async function requestStudyGroupJoin(value: string) {
  const response = await fetch("/api/study-groups/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  return readJson<{ member: StudyGroupMember }>(response);
}

export async function manageStudyGroupMember(groupId: string, memberId: string, action: MemberAction) {
  const response = await fetch(`/api/study-groups/${groupId}/members/${memberId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  return readJson<{ result: unknown }>(response);
}
export async function updateStudyGroup(groupId: string, input: UpdateStudyGroupInput) {
  const response = await fetch(`/api/study-groups/${groupId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = await readJson<{ group: StudyGroup }>(response);
  return payload.group;
}

export async function deleteStudyGroup(groupId: string) {
  const response = await fetch(`/api/study-groups/${groupId}`, { method: "DELETE" });
  return readJson<{ ok: boolean }>(response);
}

export async function leaveStudyGroup(groupId: string) {
  const response = await fetch(`/api/study-groups/${groupId}/leave`, { method: "POST" });
  return readJson<{ ok: boolean }>(response);
}
