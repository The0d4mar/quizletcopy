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
        className='cardsControllerButton'
        >
        {icon}
    </button>
  );
};

export default CardsControllerBtn;
