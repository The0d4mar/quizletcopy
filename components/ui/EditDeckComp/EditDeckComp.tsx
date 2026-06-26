import React from 'react';

interface EditDeckCompProps {


    original:string;
    updateCardfunc: (cardId: string, value: string) => void;
    id?: string;
    placeholder?: string;
    className?: string;
    spanFlag?: boolean;
}

const EditDeckComp = ({original, updateCardfunc, id = crypto.randomUUID(), placeholder, className, spanFlag = true}: EditDeckCompProps) => {
  return (
    <div>
        <input
        value={original}
        onChange={e => updateCardfunc(id, e.target.value)}
        placeholder={placeholder}
        className={className || ""}
        />
        {spanFlag ? <span className="mt-3 block text-xs font-bold uppercase text-[var(--colorTextMuted)]">
        {placeholder}
        </span> : null}
    </div>
  );
}

export default EditDeckComp;