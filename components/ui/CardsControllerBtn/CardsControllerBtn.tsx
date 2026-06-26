import React from 'react';

interface CardsControllerBtnProps {
    onClick: () => void;
    disabled: boolean;
    icon: React.ReactNode;
}

const CardsControllerBtn = ({ onClick, disabled, icon }: CardsControllerBtnProps) => {
  return (
     <button
        onClick={onClick}
        disabled={disabled}
        className='border-1 border-[var(--colorBorder)] rounded-[50%] w-8 h-8 flex items-center justify-center'
        >
        {icon}
    </button>
  );
};

export default CardsControllerBtn;
