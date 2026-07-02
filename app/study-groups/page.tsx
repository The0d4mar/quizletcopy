"use client";

import { useRequestStudyGroupJoin, useStudyGroups } from "@/features/studyGroups/useStudyGroups";
import { CheckCircle2, Clock, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

const labels = {
  title: "\u0423\u0447\u0435\u0431\u043d\u044b\u0435 \u0433\u0440\u0443\u043f\u043f\u044b",
  subtitle: "\u0421\u043e\u0437\u0434\u0430\u0432\u0430\u0439\u0442\u0435 \u0443\u0447\u0435\u0431\u043d\u044b\u0435 \u043a\u043e\u043b\u043e\u0434\u044b \u0438\u043b\u0438 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0430\u0439\u0442\u0435\u0441\u044c \u043a \u0433\u0440\u0443\u043f\u043f\u0430\u043c \u043f\u043e \u0441\u0441\u044b\u043b\u043a\u0435.",
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
  loading: "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c...",
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
    <section className="mainSection pageStack">
      <header className="pageHeader">
        <div className="pageHeaderBody">
          <h1 className="pageTitle">{labels.title}</h1>
          <p className="pageSubtitle">{labels.subtitle}</p>
        </div>
      </header>

      <div className="twoColumnGrid">
        <section className="sectionBlock">
          <div className="sectionHeader">
            <h2 className="sectionTitle">{labels.createTitle}</h2>
            <Link className="button" href="/study-groups/create"><Plus size={18} />{labels.create}</Link>
          </div>

          {owned.length === 0 ? <p className="card mutedText">{labels.emptyOwned}</p> : (
            <div className="cardList">
              {owned.map((group) => (
                <article className="card cardRow" key={group.id}>
                  <div className="cardIdentity">
                    <span className="cardIconBox"><Users size={30} /></span>
                    <div className="min-w-0">
                      <h3 className="sectionTitle truncate">{group.deck.title}</h3>
                      <p className="metaText">{group.deck._count.cards} {labels.cards} · {group.members.filter((member) => member.status === "APPROVED").length} {labels.members}</p>
                    </div>
                  </div>
                  <Link className="button" href={`/study-groups/${group.id}`}>{labels.open}</Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="sectionBlock">
          <h2 className="sectionTitle">{labels.joinTitle}</h2>
          <div className="card sectionBlock">
            <input className="input" value={joinValue} onChange={(event) => setJoinValue(event.target.value)} placeholder={labels.input} />
            <button className="button w-fit" type="button" disabled={!canSubmit} onClick={submitJoin}>{joinMutation.isPending ? "..." : labels.request}</button>
            {joinMessage && <p className="mutedText">{joinMessage}</p>}
            {joinMutation.error && <p className="appError">{joinMutation.error.message}</p>}
          </div>

          {joined.length === 0 ? <p className="card mutedText">{labels.emptyJoined}</p> : (
            <div className="cardList">
              {joined.map((group) => (
                <article className="card cardRow" key={group.id}>
                  <div className="cardIdentity">
                    <span className="cardIconBox"><CheckCircle2 size={30} /></span>
                    <div className="min-w-0">
                      <h3 className="sectionTitle truncate">{group.deck.title}</h3>
                      <p className="metaText">{group.deck.owner.name || group.deck.owner.email}</p>
                    </div>
                  </div>
                  <Link className="button" href={`/deck/${group.deckId}`}>{labels.train}</Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

const StudyGroupsPage = () => (
  <Suspense fallback={<section className="mainSection"><p className="card mutedText"><Clock size={18} />{labels.loading}</p></section>}>
    <StudyGroupsContent />
  </Suspense>
);

export default StudyGroupsPage;