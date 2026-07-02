"use client";

import AddCardField from "@/components/ui/AddCardField/AddCardField";
import EditDeckComp from "@/components/ui/EditDeckComp/EditDeckComp";
import { useCreateStudyGroup } from "@/features/studyGroups/useStudyGroups";
import { Card } from "@/types/types.type";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const labels = {
  back: "\u041d\u0430\u0437\u0430\u0434 \u043a \u0443\u0447\u0435\u0431\u043d\u044b\u043c \u0433\u0440\u0443\u043f\u043f\u0430\u043c",
  save: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0433\u0440\u0443\u043f\u043f\u0443",
  saving: "\u0421\u043e\u0437\u0434\u0430\u0451\u043c...",
  title: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435",
  titlePlaceholder: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0443\u0447\u0435\u0431\u043d\u043e\u0439 \u0433\u0440\u0443\u043f\u043f\u044b",
  descriptionPlaceholder: "\u0414\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435...",
  addCard: "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0443",
};

function createCard(): Card {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), deckId: "draft", original: "", translation: "", createdAt: now, updatedAt: now };
}

const CreateStudyGroupPage = () => {
  const router = useRouter();
  const createMutation = useCreateStudyGroup();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cards, setCards] = useState<Card[]>([createCard(), createCard()]);

  const updateOriginal = (cardId: string, value: string) => setCards((current) => current.map((card) => card.id === cardId ? { ...card, original: value } : card));
  const updateTranslation = (cardId: string, value: string) => setCards((current) => current.map((card) => card.id === cardId ? { ...card, translation: value } : card));
  const deleteCard = (cardId: string) => setCards((current) => current.filter((card) => card.id !== cardId));

  const save = async () => {
    const cleanCards = cards.map((card) => ({ original: card.original.trim(), translation: card.translation.trim() })).filter((card) => card.original && card.translation);
    if (!title.trim() || cleanCards.length === 0 || createMutation.isPending) return;

    const group = await createMutation.mutateAsync({ title: title.trim(), description: description.trim() || undefined, cards: cleanCards });
    router.push(`/study-groups/${group.id}`);
  };

  return (
    <section className="min-h-screen w-full px-10 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/study-groups" className="flex items-center gap-2 text-sm font-semibold text-indigo-200 hover:text-white"><ChevronLeft size={20} />{labels.back}</Link>
          <button className="button" type="button" onClick={save} disabled={createMutation.isPending}>{createMutation.isPending ? labels.saving : labels.save}</button>
        </div>

        <div className="mb-8 space-y-3">
          <label className="block rounded-[var(--radiusLg)] bg-[var(--colorSurfaceMuted)] px-[var(--paddingCardX)] py-[var(--paddingCardY)] border border-[var(--colorBorder)]">
            <span className="mb-1 block text-xs font-bold text-[var(--colorTextMuted)]">{labels.title}</span>
            <EditDeckComp original={title} updateCardfunc={(_id, value) => setTitle(value)} placeholder={labels.titlePlaceholder} className="w-full bg-transparent text-lg font-bold text-white outline-none" spanFlag={false} />
          </label>

          <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder={labels.descriptionPlaceholder} className="min-h-[70px] w-full resize-none rounded-[var(--radiusLg)] bg-[var(--colorSurfaceMuted)] border border-[var(--colorBorder)] px-[var(--paddingCardX)] py-[var(--paddingCardY)] font-semibold text-white outline-none placeholder:text-[var(--colorTextMuted)]" />
        </div>

        <div className="space-y-6">
          {cards.map((card, index) => <AddCardField key={card.id} id={card.id} original={card.original} translation={card.translation} updateCardOriginal={updateOriginal} updateCardTranslation={updateTranslation} deleteCard={deleteCard} index={index} />)}
        </div>

        <div className="mt-6 flex items-center gap-4 justify-center">
          <button type="button" onClick={() => setCards((current) => [...current, createCard()])} className="button"><Plus size={18} />{labels.addCard}</button>
        </div>
      </div>
    </section>
  );
};

export default CreateStudyGroupPage;