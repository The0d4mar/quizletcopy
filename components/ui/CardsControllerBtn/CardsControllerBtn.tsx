import React from 'react';
import {FC} from 'react';

interface CardsControllerBtnProps {
    onClick: () => void;
    disabled: boolean;
    icon: React.ReactNode;
}

const CardsControllerBtn: FC<CardsControllerBtnProps> = ({ onClick, disabled, icon }) => {
  return (
     <button
        onClick={onClick}
        disabled={disabled}
        className='border-1 border-[var(--color-border)] rounded-[50%] w-8 h-8 flex items-center justify-center'
        >
        {icon}
    </button>
  );
};

export default CardsControllerBtn;
