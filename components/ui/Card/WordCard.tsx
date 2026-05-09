'use client'

import { useEffect, useState } from 'react';
import './WordCardStyle.css';

type WordCardProps = {
  original: string;
  translation: string;
  flipped?: boolean;
};

export function WordCard({ original, translation, flipped }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(flipped);

  useEffect(()=>{
    setIsFlipped(false)
  },[original, translation])

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