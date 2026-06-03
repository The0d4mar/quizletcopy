import React from 'react';
import {FC} from 'react';
import EditDeckComp from '../EditDeckComp/EditDeckComp';
import { Trash2 } from 'lucide-react';

interface AddCardFieldProps {
    id:string;
    original:string;
    translation:string;
    updateCardOriginal: (cardId: string, value: string) => void;
    updateCardTranslation: (cardId: string, value: string) => void;
    deleteCard: (cardId: string) => void;
    index:number;
}

const AddCardField: FC<AddCardFieldProps> = ({id, original, translation, updateCardOriginal, updateCardTranslation, deleteCard, index}) => {
  return (
    <div
        key={id}
        className="rounded-2xl bg-slate-700 px-6 py-5"
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

        <EditDeckComp
            original={original}
            updateCardfunc={updateCardOriginal}
            id={id}
            placeholder="Термин"
            className="w-full rounded-lg bg-[#0b092b] px-4 py-4 text-lg font-bold text-white outline-none"
        />


        <EditDeckComp
            original={translation}
            updateCardfunc={updateCardTranslation}
            id={id}
            placeholder="Перевод"
            className="w-full rounded-lg bg-[#0b092b] px-4 py-4 text-lg font-bold text-white outline-none"
        />

        
        </div>
    </div>
  );
};

export default AddCardField;