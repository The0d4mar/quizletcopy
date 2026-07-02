import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const groupInclude = {
  deck: {
    include: {
      owner: { select: { id: true, name: true, email: true } },
      cards: { orderBy: { createdAt: "asc" } },
      _count: { select: { cards: true } },
    },
  },
  members: {
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { updatedAt: "desc" },
  },
} satisfies Prisma.StudyGroupInclude;

export function findOwnedGroups(ownerId: string) {
  return prisma.studyGroup.findMany({
    where: { deck: { ownerId } },
    orderBy: { updatedAt: "desc" },
    include: groupInclude,
  });
}

export function findJoinedGroups(userId: string) {
  return prisma.studyGroup.findMany({
    where: { members: { some: { userId, status: "APPROVED" } } },
    orderBy: { updatedAt: "desc" },
    include: groupInclude,
  });
}

export function findGroupById(groupId: string) {
  return prisma.studyGroup.findUnique({
    where: { id: groupId },
    include: groupInclude,
  });
}

export function findGroupByJoinCode(joinCode: string) {
  return prisma.studyGroup.findUnique({
    where: { joinCode },
    include: groupInclude,
  });
}

export function createGroup(ownerId: string, data: { title: string; description?: string; cards: Array<{ original: string; translation: string }> }) {
  return prisma.studyGroup.create({
    data: {
      deck: {
        create: {
          title: data.title,
          description: data.description || null,
          isPublic: false,
          ownerId,
          cards: {
            create: data.cards.map((card) => ({ original: card.original, translation: card.translation })),
          },
        },
      },
    },
    include: groupInclude,
  });
}

export function upsertPendingMember(groupId: string, userId: string) {
  return prisma.studyGroupMember.upsert({
    where: { groupId_userId: { groupId, userId } },
    create: { groupId, userId, status: "PENDING" },
    update: { status: "PENDING", requestedAt: new Date(), approvedAt: null },
    include: { user: { select: { id: true, name: true, email: true, image: true } }, group: true },
  });
}

export function updateMember(memberId: string, data: Prisma.StudyGroupMemberUpdateInput) {
  return prisma.studyGroupMember.update({
    where: { id: memberId },
    data,
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  });
}

export function deleteMember(memberId: string) {
  return prisma.studyGroupMember.delete({ where: { id: memberId } });
}

export function touchMemberVisit(groupId: string, userId: string) {
  return prisma.studyGroupMember.updateMany({
    where: { groupId, userId, status: "APPROVED" },
    data: { lastVisitedAt: new Date() },
  });
}

export function resetMemberProgress(deckId: string, userId: string) {
  return prisma.cardProgress.deleteMany({
    where: { userId, card: { deckId } },
  });
}
export function findProgressForDeckMembers(deckId: string, userIds: string[]) {
  return prisma.cardProgress.findMany({
    where: { userId: { in: userIds }, card: { deckId } },
    select: { userId: true, cardId: true, numOfRepeats: true, wrongRepeats: true, lastRepeat: true, card: { select: { id: true, original: true, translation: true } } },
  });
}
export function updateGroupDeck(deckId: string, data: { title?: string; description?: string | null }) {
  return prisma.deck.update({
    where: { id: deckId },
    data,
  });
}

export function deleteGroupDeck(deckId: string) {
  return prisma.deck.delete({ where: { id: deckId } });
}

export function deleteMembershipByGroupAndUser(groupId: string, userId: string) {
  return prisma.studyGroupMember.delete({ where: { groupId_userId: { groupId, userId } } });
}
