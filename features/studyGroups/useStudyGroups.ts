"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createStudyGroup, deleteStudyGroup, getStudyGroup, getStudyGroups, leaveStudyGroup, manageStudyGroupMember, requestStudyGroupJoin, updateStudyGroup, type CreateStudyGroupInput, type MemberAction, type UpdateStudyGroupInput } from "@/lib/api/studyGroupsApi";
import { queryKeys } from "@/lib/query/queryKeys";

export function useStudyGroups(enabled = true) {
  return useQuery({ queryKey: queryKeys.studyGroups, queryFn: getStudyGroups, enabled });
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
export function useUpdateStudyGroup(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateStudyGroupInput) => updateStudyGroup(groupId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.studyGroups });
      queryClient.invalidateQueries({ queryKey: queryKeys.studyGroup(groupId) });
    },
  });
}

export function useDeleteStudyGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudyGroup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.studyGroups }),
  });
}

export function useLeaveStudyGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leaveStudyGroup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.studyGroups }),
  });
}
