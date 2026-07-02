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
  pageTitle: "\u041d\u043e\u0432\u0430\u044f \u0443\u0447\u0435\u0431\u043d\u0430\u044f \u0433\u0440\u0443\u043f\u043f\u0430",
  pageSubtitle: "\u0421\u043e\u0437\u0434\u0430\u0439\u0442\u0435 \u043a\u043e\u043b\u043e\u0434\u0443 \u0434\u043b\u044f \u0433\u0440\u0443\u043f\u043f\u044b. \u041f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044f \u0437\u0434\u0435\u0441\u044c \u043d\u0435 \u043d\u0443\u0436\u043d\u0430: \u0434\u043e\u0441\u0442\u0443\u043f \u0431\u0443\u0434\u0435\u0442 \u043f\u043e \u0441\u0441\u044b\u043b\u043a\u0435 \u0438 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u044e.",
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
    <section className="mainSection pageStack">
      <header className="pageHeader">
        <div className="pageHeaderBody">
          <Link href="/study-groups" className="button buttonGhost w-fit"><ChevronLeft size={18} />{labels.back}</Link>
          <h1 className="pageTitle mt-4">{labels.pageTitle}</h1>
          <p className="pageSubtitle">{labels.pageSubtitle}</p>
        </div>
        <div className="pageHeaderActions">
          <button className="button" type="button" onClick={save} disabled={createMutation.isPending}>{createMutation.isPending ? labels.saving : labels.save}</button>
        </div>
      </header>

      <div className="card sectionBlock">
        <label>
          <span className="metaText mb-2 block font-bold uppercase">{labels.title}</span>
          <EditDeckComp original={title} updateCardfunc={(_id, value) => setTitle(value)} placeholder={labels.titlePlaceholder} className="input" spanFlag={false} />
        </label>

        <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder={labels.descriptionPlaceholder} className="input textarea" />
      </div>

      <div className="cardList">
        {cards.map((card, index) => <AddCardField key={card.id} id={card.id} original={card.original} translation={card.translation} updateCardOriginal={updateOriginal} updateCardTranslation={updateTranslation} deleteCard={deleteCard} index={index} />)}
      </div>

      <div className="actionRow justify-center">
        <button type="button" onClick={() => setCards((current) => [...current, createCard()])} className="button"><Plus size={18} />{labels.addCard}</button>
      </div>
    </section>
  );
};

export default CreateStudyGroupPage;