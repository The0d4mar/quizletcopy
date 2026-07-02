"use client";

import { useRequestStudyGroupJoin, useStudyGroups } from "@/features/studyGroups/useStudyGroups";
import { CheckCircle2, Clock, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

const labels = {
  title: "\u0423\u0447\u0435\u0431\u043d\u044b\u0435 \u0433\u0440\u0443\u043f\u043f\u044b",
  createTitle: "\u0421\u0432\u043e\u0438 \u0433\u0440\u0443\u043f\u043f\u044b",
  joinTitle: "\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0451\u043d\u043d\u044b\u0435 \u043a\u043e\u043b\u043e\u0434\u044b",
  create: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0443\u0447\u0435\u0431\u043d\u0443\u044e \u0433\u0440\u0443\u043f\u043f\u0443",
  input: "\u0412\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u0441\u0441\u044b\u043b\u043a\u0443 \u0438\u043b\u0438 \u043a\u043e\u0434 \u0433\u0440\u0443\u043f\u043f\u044b",
  request: "\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443",
  pending: "\u0417\u0430\u044f\u0432\u043a\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0430. \u0416\u0434\u0438\u0442\u0435 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u044f.",
  emptyOwned: "\u0412\u044b \u0435\u0449\u0451 \u043d\u0435 \u0441\u043e\u0437\u0434\u0430\u0432\u0430\u043b\u0438 \u0443\u0447\u0435\u0431\u043d\u044b\u0435 \u0433\u0440\u0443\u043f\u043f\u044b.",
  emptyJoined: "\u041f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0451\u043d\u043d\u044b\u0445 \u043a\u043e\u043b\u043e\u0434.",
  cards: "\u043a\u0430\u0440\u0442.",
  members: "\u0443\u0447\u0430\u0441\u0442\u043d.",
  open: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c",
  train: "\u0422\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
};

const StudyGroupsContent = () => {
  const searchParams = useSearchParams();
  const initialValue = searchParams.get("code") ?? "";
  const [joinValue, setJoinValue] = useState(initialValue);
  const [joinMessage, setJoinMessage] = useState("");
  const groupsQuery = useStudyGroups();
  const joinMutation = useRequestStudyGroupJoin();
  const owned = groupsQuery.data?.owned ?? [];
  const joined = groupsQuery.data?.joined ?? [];

  const canSubmit = useMemo(() => joinValue.trim().length > 0 && !joinMutation.isPending, [joinMutation.isPending, joinValue]);

  const submitJoin = async () => {
    if (!canSubmit) return;
    await joinMutation.mutateAsync(joinValue.trim());
    setJoinMessage(labels.pending);
  };

  return (
    <section className="mainSection flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold">{labels.title}</h1>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">{labels.createTitle}</h2>
            <Link className="button" href="/study-groups/create"><Plus size={18} />{labels.create}</Link>
          </div>

          {owned.length === 0 ? <p className="card text-[var(--colorTextMuted)]">{labels.emptyOwned}</p> : owned.map((group) => (
            <article className="card flex items-center justify-between gap-4" key={group.id}>
              <div className="flex items-center gap-4">
                <Users size={32} />
                <div>
                  <h3 className="text-xl font-bold">{group.deck.title}</h3>
                  <p className="text-[var(--colorTextMuted)]">{group.deck._count.cards} {labels.cards} В· {group.members.filter((member) => member.status === "APPROVED").length} {labels.members}</p>
                </div>
              </div>
              <Link className="button" href={`/study-groups/${group.id}`}>{labels.open}</Link>
            </article>
          ))}
        </section>

        <section className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold">{labels.joinTitle}</h2>
          <div className="card flex flex-col gap-3">
            <input className="input" value={joinValue} onChange={(event) => setJoinValue(event.target.value)} placeholder={labels.input} />
            <button className="button w-fit" type="button" disabled={!canSubmit} onClick={submitJoin}>{joinMutation.isPending ? "..." : labels.request}</button>
            {joinMessage && <p className="text-[var(--colorTextMuted)]">{joinMessage}</p>}
            {joinMutation.error && <p className="text-red-400">{joinMutation.error.message}</p>}
          </div>

          {joined.length === 0 ? <p className="card text-[var(--colorTextMuted)]">{labels.emptyJoined}</p> : joined.map((group) => (
            <article className="card flex items-center justify-between gap-4" key={group.id}>
              <div className="flex items-center gap-4">
                <CheckCircle2 size={32} />
                <div>
                  <h3 className="text-xl font-bold">{group.deck.title}</h3>
                  <p className="text-[var(--colorTextMuted)]">{group.deck.owner.name || group.deck.owner.email}</p>
                </div>
              </div>
              <Link className="button" href={`/deck/${group.deckId}`}>{labels.train}</Link>
            </article>
          ))}
        </section>
      </div>
    </section>
  );
};

const StudyGroupsPage = () => (
  <Suspense fallback={<section className="mainSection"><p className="card text-[var(--colorTextMuted)]"><Clock size={18} />...</p></section>}>
    <StudyGroupsContent />
  </Suspense>
);

export default StudyGroupsPage;