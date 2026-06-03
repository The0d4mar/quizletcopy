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
      <div className={`flashcardInner ${isFlipped ? 'flipped' : ''}`}>
        <div className="flashcardFace flashcardFront">
          <span>{original}</span>
        </div>

        <div className="flashcardFace flashcardBack">
          <span>{translation}</span>
        </div>
      </div>
    </button>
  );
}