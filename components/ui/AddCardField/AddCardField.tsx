import React from "react";
import { Trash2 } from "lucide-react";

import EditDeckComp from "../EditDeckComp/EditDeckComp";

interface AddCardFieldProps {
  id: string;
  original: string;
  translation: string;
  updateCardOriginal: (cardId: string, value: string) => void;
  updateCardTranslation: (cardId: string, value: string) => void;
  deleteCard: (cardId: string) => void;
  index: number;
  originalError?: boolean;
  translationError?: boolean;
}

const labels = {
  term: "\u0422\u0435\u0440\u043c\u0438\u043d",
  translation: "\u041f\u0435\u0440\u0435\u0432\u043e\u0434",
  duplicateTerm: "\u0422\u0430\u043a\u043e\u0439 \u0442\u0435\u0440\u043c\u0438\u043d \u0443\u0436\u0435 \u0435\u0441\u0442\u044c \u0432 \u044d\u0442\u043e\u0439 \u043a\u043e\u043b\u043e\u0434\u0435",
  duplicateTranslation: "\u0422\u0430\u043a\u043e\u0439 \u043f\u0435\u0440\u0435\u0432\u043e\u0434 \u0443\u0436\u0435 \u0435\u0441\u0442\u044c \u0432 \u044d\u0442\u043e\u0439 \u043a\u043e\u043b\u043e\u0434\u0435",
  delete: "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0443",
};

const AddCardField = ({
  id,
  original,
  translation,
  updateCardOriginal,
  updateCardTranslation,
  deleteCard,
  index,
  originalError = false,
  translationError = false,
}: AddCardFieldProps) => {
  return (
    <div key={id} className="card sectionBlock">
      <div className="addCardFieldHeader">
        <button
          type="button"
          aria-label={labels.delete}
          onClick={() => deleteCard(id)}
          className="button buttonDanger iconButton"
        >
          <Trash2 size={18} />
        </button>

        <span className="cardIndexText">{index + 1}</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <EditDeckComp
            original={original}
            updateCardfunc={updateCardOriginal}
            id={id}
            spanFlag={false}
            placeholder={labels.term}
            className={`input ${originalError ? "inputError" : ""}`}
          />

          <span className={`mt-3 block text-xs font-bold uppercase ${originalError ? "text-[var(--colorDanger)]" : "text-[var(--colorTextMuted)]"}`}>
            {originalError ? labels.duplicateTerm : labels.term}
          </span>
        </div>

        <div>
          <EditDeckComp
            original={translation}
            updateCardfunc={updateCardTranslation}
            id={id}
            placeholder={labels.translation}
            spanFlag={false}
            className={`input ${translationError ? "inputError" : ""}`}
          />

          <span className={`mt-3 block text-xs font-bold uppercase ${translationError ? "text-[var(--colorDanger)]" : "text-[var(--colorTextMuted)]"}`}>
            {translationError ? labels.duplicateTranslation : labels.translation}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AddCardField;