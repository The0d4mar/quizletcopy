import React, { FC } from 'react';
import EditDeckComp from '../EditDeckComp/EditDeckComp';
import { Trash2 } from 'lucide-react';

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

const AddCardField: FC<AddCardFieldProps> = ({
  id,
  original,
  translation,
  updateCardOriginal,
  updateCardTranslation,
  deleteCard,
  index,
  originalError = false,
  translationError = false,
}) => {
  return (
    <div
      key={id}
      className="rounded-2xl bg-[var(--color-hover)] px-6 py-5"
    >
      <div className="mb-6 flex items-center justify-between">
        <span className="font-bold text-slate-200">
          {index + 1}
        </span>

        <button
          onClick={() => deleteCard(id)}
          className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-600 hover:text-white"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <EditDeckComp
            original={original}
            updateCardfunc={updateCardOriginal}
            id={id}
            spanFlag = {false}
            placeholder="Термин"
            className={`
              w-full rounded-lg bg-[var(--color-bg)] px-4 py-4 text-lg font-bold text-white outline-none
              border
              ${originalError ? 'border-red-500' : 'border-transparent'}
            `}
          />

          <span
            className={`
              mt-3 block text-xs font-bold uppercase
              ${originalError ? 'text-red-400' : 'text-slate-300'}
            `}
          >
            {originalError
              ? 'Такой термин уже есть в этой колоде'
              : 'Термин'}
          </span>
        </div>

        <div>
          <EditDeckComp
            original={translation}
            updateCardfunc={updateCardTranslation}
            id={id}
            placeholder="Перевод"
            spanFlag = {false}
            className={`
              w-full rounded-lg bg-[var(--color-bg)] px-4 py-4 text-lg font-bold text-white outline-none
              border
              ${translationError ? 'border-red-500' : 'border-transparent'}
            `}
          />

          <span
            className={`
              mt-3 block text-xs font-bold uppercase 
              ${translationError ? 'text-red-400' : 'text-slate-300'}
            `}
          >
            {translationError
              ? 'Такой перевод уже есть в этой колоде'
              : 'Перевод'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AddCardField;