"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const labels = {
  addDeck: "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043a\u043e\u043b\u043e\u0434\u0443",
};

const AddDeckBtn = () => {
  const router = useRouter();

  const addDeck = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const id = crypto.randomUUID();
    router.push(`/deck/${id}/deckEdit/state=createNewDeck`);
  };

  return (
    <button onClick={addDeck} className="button">
      <Plus size={18} />
      {labels.addDeck}
    </button>
  );
};

export default AddDeckBtn;