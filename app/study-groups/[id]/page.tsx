"use client";

import { useDeleteStudyGroup, useManageStudyGroupMember, useStudyGroup, useUpdateStudyGroup } from "@/features/studyGroups/useStudyGroups";
import { Check, Copy, MoreHorizontal, RotateCcw, Trash2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const labels = {
  loading: "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u0433\u0440\u0443\u043f\u043f\u0443...",
  copyLink: "\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0441\u0441\u044b\u043b\u043a\u0443",
  train: "\u0422\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043a\u043e\u043b\u043e\u0434\u0443",
  cards: "\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0438",
  requests: "\u0417\u0430\u044f\u0432\u043a\u0438 \u043d\u0430 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435",
  members: "\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0451\u043d\u043d\u044b\u0435 \u0443\u0447\u0430\u0441\u0442\u043d\u0438\u043a\u0438",
  emptyRequests: "\u041d\u043e\u0432\u044b\u0445 \u0437\u0430\u044f\u0432\u043e\u043a \u043d\u0435\u0442.",
  emptyMembers: "\u041f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0451\u043d\u043d\u044b\u0445 \u0443\u0447\u0430\u0441\u0442\u043d\u0438\u043a\u043e\u0432.",
  success: "\u0423\u0441\u043f\u0435\u0448\u043d\u043e",
  mistakes: "\u041e\u0448\u0438\u0431\u043e\u043a",
  lastVisit: "\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0439 \u0432\u0445\u043e\u0434",
  lastRepeat: "\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0435\u0435 \u043f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u0435",
  details: "\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u043e",
  summary: "\u041a\u0440\u0430\u0442\u043a\u043e",
  joinedView: "\u0412\u044b \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u044b \u043a \u044d\u0442\u043e\u0439 \u0443\u0447\u0435\u0431\u043d\u043e\u0439 \u043a\u043e\u043b\u043e\u0434\u0435. \u0412\u0430\u043c \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430 \u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043a\u0430 \u0438 \u0432\u0430\u0448\u0430 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430.",
  manage: "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435",
  edit: "\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c",
  delete: "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0433\u0440\u0443\u043f\u043f\u0443",
  cancel: "\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c",
  titlePlaceholder: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435",
  descriptionPlaceholder: "\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435",
};

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleString() : "-";
}

const StudyGroupPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const groupQuery = useStudyGroup(params.id);
  const manageMember = useManageStudyGroupMember(params.id);
  const updateGroup = useUpdateStudyGroup(params.id);
  const deleteGroup = useDeleteStudyGroup();
  const [detailsByMember, setDetailsByMember] = useState<Record<string, boolean>>({});
  const [isManageOpen, setIsManageOpen] = useState(false);
  const group = groupQuery.data;
  const currentUserId = session?.user?.id;
  const isOwner = Boolean(group && currentUserId && group.deck.ownerId === currentUserId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const joinLink = useMemo(() => {
    if (!group || typeof window === "undefined") return "";
    return `${window.location.origin}/study-groups?code=${group.joinCode}`;
  }, [group]);

  if (groupQuery.isLoading || !group) {
    return <section className="mainSection"><p className="card text-[var(--colorTextMuted)]">{labels.loading}</p></section>;
  }

  const openManage = () => {
    setTitle(group.deck.title);
    setDescription(group.deck.description ?? "");
    setIsManageOpen(true);
  };

  const pendingMembers = group.members.filter((member) => member.status === "PENDING");
  const approvedMembers = group.members.filter((member) => member.status === "APPROVED");

  return (
    <section className="mainSection flex flex-col gap-8">
      {isManageOpen && (
        <div className="modalOverlay">
          <div className="modal flex flex-col gap-4">
            <h2 className="text-2xl font-bold">{labels.manage}</h2>
            <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder={labels.titlePlaceholder} />
            <textarea className="input min-h-[110px]" value={description} onChange={(event) => setDescription(event.target.value)} placeholder={labels.descriptionPlaceholder} />
            <div className="flex flex-wrap gap-3">
              <button className="button" onClick={async () => { await updateGroup.mutateAsync({ title: title.trim(), description: description.trim() || null }); setIsManageOpen(false); }}>{labels.edit}</button>
              <button className="button border-[var(--colorDanger)] text-[var(--colorDanger)]" onClick={async () => { await deleteGroup.mutateAsync(group.id); router.push("/study-groups"); }}>{labels.delete}</button>
              <button className="button" onClick={() => setIsManageOpen(false)}>{labels.cancel}</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">{group.deck.title}</h1>
          {group.deck.description && <p className="mt-2 text-[var(--colorTextMuted)]">{group.deck.description}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          {isOwner && <button className="button" onClick={openManage}><MoreHorizontal size={18} />{labels.manage}</button>}
          <Link className="button" href={`/deck/${group.deckId}`}>{labels.train}</Link>
        </div>
      </div>

      {isOwner ? (
        <>
          <div className="card flex flex-col gap-3">
            <p className="font-bold">{joinLink}</p>
            <button className="button w-fit" type="button" onClick={() => navigator.clipboard.writeText(joinLink)}><Copy size={18} />{labels.copyLink}</button>
          </div>

          <section>
            <h2 className="mb-4 text-2xl font-bold">{labels.cards}</h2>
            <div className="flex flex-col gap-3">{group.deck.cards.map((card) => <div className="card grid gap-4 md:grid-cols-2" key={card.id}><strong>{card.original}</strong><strong>{card.translation}</strong></div>)}</div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">{labels.requests}</h2>
            {pendingMembers.length === 0 ? <p className="card text-[var(--colorTextMuted)]">{labels.emptyRequests}</p> : pendingMembers.map((member) => (
              <div className="card mb-3 flex items-center justify-between gap-4" key={member.id}>
                <div><strong>{member.user.name || member.user.email}</strong><p className="text-[var(--colorTextMuted)]">{member.user.email}</p></div>
                <div className="flex gap-3"><button className="button" onClick={() => manageMember.mutate({ memberId: member.id, action: "approve" })}><Check size={18} /></button><button className="button border-[var(--colorDanger)] text-[var(--colorDanger)]" onClick={() => manageMember.mutate({ memberId: member.id, action: "reject" })}><X size={18} /></button></div>
              </div>
            ))}
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">{labels.members}</h2>
            {approvedMembers.length === 0 ? <p className="card text-[var(--colorTextMuted)]">{labels.emptyMembers}</p> : approvedMembers.map((member) => {
              const isDetailed = detailsByMember[member.id] ?? false;
              return (
                <div className="card mb-3 flex flex-col gap-4" key={member.id}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div><strong>{member.user.name || member.user.email}</strong><p className="text-[var(--colorTextMuted)]">{member.user.email}</p></div>
                    <div className="text-[var(--colorTextMuted)]"><p>{labels.success}: {member.stats?.numOfRepeats ?? 0}</p><p>{labels.mistakes}: {member.stats?.wrongRepeats ?? 0}</p><p>{labels.lastVisit}: {formatDate(member.lastVisitedAt)}</p><p>{labels.lastRepeat}: {formatDate(member.stats?.lastRepeat)}</p></div>
                    <div className="flex gap-3"><button className="button" onClick={() => setDetailsByMember((current) => ({ ...current, [member.id]: !isDetailed }))}>{isDetailed ? labels.summary : labels.details}</button><button className="button" onClick={() => manageMember.mutate({ memberId: member.id, action: "resetProgress" })}><RotateCcw size={18} /></button><button className="button border-[var(--colorDanger)] text-[var(--colorDanger)]" onClick={() => manageMember.mutate({ memberId: member.id, action: "remove" })}><Trash2 size={18} /></button></div>
                  </div>
                  {isDetailed && <div className="grid gap-3">{member.stats?.cards.length ? member.stats.cards.map((card) => <div key={card.cardId} className="rounded-[var(--radiusCard)] border border-[var(--colorBorder)] p-4"><p className="font-bold">{card.original} - {card.translation}</p><p className="text-[var(--colorTextMuted)]">{labels.success}: {card.numOfRepeats} · {labels.mistakes}: {card.wrongRepeats} · {labels.lastRepeat}: {formatDate(card.lastRepeat)}</p></div>) : <p className="text-[var(--colorTextMuted)]">-</p>}</div>}
                </div>
              );
            })}
          </section>
        </>
      ) : (
        <div className="card"><p className="text-[var(--colorTextMuted)]">{labels.joinedView}</p></div>
      )}
    </section>
  );
};

export default StudyGroupPage;