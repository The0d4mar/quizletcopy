import React from 'react';
import {FC} from 'react';

interface ProgressBarProps {
    progressPercent: number;
    currentIndex: number;
    deckCardsLength: number;
}

const ProgressBar: FC<ProgressBarProps> = ({ progressPercent, currentIndex, deckCardsLength }) => {
  return (
    <div>
        <div
            style={{
            width: '100%',
            height: '8px',
            background: '#ddd',
            borderRadius: '999px',
            overflow: 'hidden',
            marginTop: '16px',
            }}
        >
            <div
            style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: '#4f46e5',
                transition: 'width 0.3s ease',
            }}
            />
        </div>
        <p>
            Просмотрено: {currentIndex + 1} из {deckCardsLength}
        </p>
    </div>
  );
};

export default ProgressBar;