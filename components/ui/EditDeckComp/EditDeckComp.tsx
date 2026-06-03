import React from 'react';
import {FC} from 'react';

interface EditDeckCompProps {


    original:string;
    updateCardfunc: (cardId: string, value: string) => void;
    id?: string;
    placeholder?: string;
    className?: string;
    spanFlag?: boolean;
}

const EditDeckComp: FC<EditDeckCompProps> = ({original, updateCardfunc, id = crypto.randomUUID(), placeholder, className, spanFlag = true}) => {
  return (
    <div>
        <input
        value={original}
        onChange={e => updateCardfunc(id, e.target.value)}
        placeholder={placeholder}
        className={className || ""}
        />
        {spanFlag ? <span className="mt-3 block text-xs font-bold uppercase text-slate-300">
        {placeholder}
        </span> : null}
    </div>
  );
}

export default EditDeckComp;