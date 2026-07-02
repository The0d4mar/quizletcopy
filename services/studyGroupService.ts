import { ApiError } from "@/lib/api/errors";
import type { CreateStudyGroupInput } from "@/lib/validation/studyGroupSchemas";
import * as studyGroupRepository from "@/repositories/studyGroupRepository";

function getJoinCode(value: string) {
  const trimmedValue = value.trim();

  try {
    const url = new URL(trimmedValue);
    return url.searchParams.get("code") || url.pathname.split("/").filter(Boolean).at(-1) || trimmedValue;
  } catch {
    return trimmedValue.split("/").filter(Boolean).at(-1) || trimmedValue;
  }
}

function assertGroupOwner(group: Awaited<ReturnType<typeof studyGroupRepository.findGroupById>>, userId: string) {
  if (!group) throw new ApiError(404, "Study group not found");
  if (group.deck.ownerId !== userId) throw new ApiError(403, "Only group owner can manage this study group");
}

function canReadGroup(group: Awaited<ReturnType<typeof studyGroupRepository.findGroupById>>, userId: string) {
  if (!group) return false;
  if (group.deck.ownerId === userId) return true;
  return group.members.some((member) => member.userId === userId && member.status === "APPROVED");
}

export async function listStudyGroups(userId: string) {
  const [owned, joined] = await Promise.all([
    studyGroupRepository.findOwnedGroups(userId),
    studyGroupRepository.findJoinedGroups(userId),
  ]);

  return { owned, joined };
}

export function createStudyGroup(userId: string, data: CreateStudyGroupInput) {
  return studyGroupRepository.createGroup(userId, data);
}

export async function requestStudyGroupJoin(userId: string, value: string) {
  const joinCode = getJoinCode(value);
  const group = await studyGroupRepository.findGroupByJoinCode(joinCode);

  if (!group) throw new ApiError(404, "Study group not found");
  if (group.deck.ownerId === userId) throw new ApiError(400, "You already own this study group");

  const existingMember = group.members.find((member) => member.userId === userId);
  if (existingMember?.status === "APPROVED") return existingMember;

  return studyGroupRepository.upsertPendingMember(group.id, userId);
}

export async function getStudyGroupForUser(groupId: string, userId: string) {
  const group = await studyGroupRepository.findGroupById(groupId);

  if (!canReadGroup(group, userId)) {
    throw new ApiError(404, "Study group not found");
  }

  if (group?.deck.ownerId !== userId) {
    await studyGroupRepository.touchMemberVisit(groupId, userId);
    return group;
  }

  const memberIds = group.members.map((member) => member.userId);
  const progress = await studyGroupRepository.findProgressForDeckMembers(group.deckId, memberIds);
  const statsByUser = new Map<string, { numOfRepeats: number; wrongRepeats: number; lastRepeat: Date | null }>();

  for (const item of progress) {
    const current = statsByUser.get(item.userId) ?? { numOfRepeats: 0, wrongRepeats: 0, lastRepeat: null };
    current.numOfRepeats += item.numOfRepeats;
    current.wrongRepeats += item.wrongRepeats;
    if (item.lastRepeat && (!current.lastRepeat || item.lastRepeat > current.lastRepeat)) current.lastRepeat = item.lastRepeat;
    statsByUser.set(item.userId, current);
  }

  return {
    ...group,
    members: group.members.map((member) => ({
      ...member,
      stats: statsByUser.get(member.userId) ?? { numOfRepeats: 0, wrongRepeats: 0, lastRepeat: null },
    })),
  };
}

export async function manageStudyGroupMember(ownerId: string, groupId: string, memberId: string, action: "approve" | "reject" | "remove" | "resetProgress") {
  const group = await studyGroupRepository.findGroupById(groupId);
  assertGroupOwner(group, ownerId);

  const member = group?.members.find((item) => item.id === memberId);
  if (!group || !member) throw new ApiError(404, "Member not found");

  if (action === "approve") {
    return studyGroupRepository.updateMember(memberId, { status: "APPROVED", approvedAt: new Date() });
  }

  if (action === "resetProgress") {
    const result = await studyGroupRepository.resetMemberProgress(group.deckId, member.userId);
    return { ok: true, deletedCount: result.count };
  }

  await studyGroupRepository.deleteMember(memberId);
  return { ok: true };
}