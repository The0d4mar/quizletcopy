"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createStudyGroup, getStudyGroup, getStudyGroups, manageStudyGroupMember, requestStudyGroupJoin, type CreateStudyGroupInput, type MemberAction } from "@/lib/api/studyGroupsApi";
import { queryKeys } from "@/lib/query/queryKeys";

export function useStudyGroups() {
  return useQuery({ queryKey: queryKeys.studyGroups, queryFn: getStudyGroups });
}

export function useStudyGroup(groupId: string) {
  return useQuery({ queryKey: queryKeys.studyGroup(groupId), queryFn: () => getStudyGroup(groupId), enabled: Boolean(groupId) });
}

export function useCreateStudyGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStudyGroupInput) => createStudyGroup(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.studyGroups }),
  });
}

export function useRequestStudyGroupJoin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestStudyGroupJoin,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.studyGroups }),
  });
}

export function useManageStudyGroupMember(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, action }: { memberId: string; action: MemberAction }) => manageStudyGroupMember(groupId, memberId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.studyGroups });
      queryClient.invalidateQueries({ queryKey: queryKeys.studyGroup(groupId) });
    },
  });
}