'use client'

import { useState } from 'react';
import './WordCardStyle.css';

type WordCardProps = {
  original: string;
  translation: string;
  flipped?: boolean;
};

export function WordCard({
  original,
  translation,
  flipped = false,
}: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(flipped);

  return (
    <button
      type="button"
      className="flashcard"
      onClick={() => setIsFlipped(prev => !prev)}
    >
      <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
        <div className="flashcard-face flashcard-front">
          <span>{original}</span>
        </div>

        <div className="flashcard-face flashcard-back">
          <span>{translation}</span>
        </div>
      </div>
    </button>
  );
}