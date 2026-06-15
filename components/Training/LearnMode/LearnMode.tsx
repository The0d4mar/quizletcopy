'use client'

import { setCardData } from '@/store/cardDataStore';
import { RootState } from '@/store/store';
import { AnswerStatus, Card, QuestionSide } from '@/types/type';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TrainingResult, { TrainingMistake } from '../TrainingResult/TrainingResult';
import {
  createLearnQuestions,
  updateCardDataCorrect,
  updateCardDataWrong,
} from '../trainingUtils';
import LearnQuestion from './LearnQuestion';
import LearnSetupModal from './LearnSetupModal';

interface LearnModeProps {
  deckTitle: string;
  deckCards: Card[];
  onExit: () => void;
}

const LearnMode = ({ deckTitle, deckCards, onExit }: LearnModeProps) => {
  const dispatch = useDispatch();

  const cardData = useSelector(
    (state: RootState) => state.cardDataStore.cardData
  );

  const [questionSide, setQuestionSide] = useState<QuestionSide | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('idle');

  const [isFinished, setIsFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [mistakes, setMistakes] = useState<TrainingMistake[]>([]);

  const questions = useMemo(() => {
    if (!questionSide) return [];
    return createLearnQuestions(deckCards, questionSide);
  }, [deckCards, questionSide]);

  const currentQuestion = questions[currentIndex];

  const resetTraining = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswerStatus('idle');
    setIsFinished(false);
    setCorrectCount(0);
    setWrongCount(0);
    setMistakes([]);
  };

  const selectAnswer = (answer: string) => {
    if (!currentQuestion || answerStatus !== 'idle') return;

    setSelectedAnswer(answer);

    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      const updatedCardData = updateCardDataCorrect(
        cardData,
        currentQuestion.card.id
      );

      dispatch(setCardData(updatedCardData));
      setCorrectCount(prev => prev + 1);
      setAnswerStatus('correct');
    } else {
      const updatedCardData = updateCardDataWrong(
        cardData,
        currentQuestion.card.id
      );

      dispatch(setCardData(updatedCardData));

      setWrongCount(prev => prev + 1);
      setMistakes(prev => [
        ...prev,
        {
          card: currentQuestion.card,
          selectedAnswer: answer,
          correctAnswer: currentQuestion.correctAnswer,
        },
      ]);

      setAnswerStatus('wrong');
    }
  };

  const nextQuestion = () => {
    if (currentIndex === questions.length - 1) {
      setIsFinished(true);
      return;
    }

    setSelectedAnswer(null);
    setAnswerStatus('idle');
    setCurrentIndex(prev => prev + 1);
  };

  if (!questionSide) {
    return (
      <LearnSetupModal
        deckTitle={deckTitle}
        onSelectSide={setQuestionSide}
        onClose={onExit}
      />
    );
  }

  if (isFinished) {
    return (
      <TrainingResult
        deckTitle={deckTitle}
        correctCount={correctCount}
        wrongCount={wrongCount}
        mistakes={mistakes}
        onRestart={resetTraining}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="flex justify-center">
      {currentQuestion && (
        <LearnQuestion
          question={currentQuestion}
          index={currentIndex}
          total={questions.length}
          selectedAnswer={selectedAnswer}
          answerStatus={answerStatus}
          onSelectAnswer={selectAnswer}
          onNext={nextQuestion}
        />
      )}
    </div>
  );
};

export default LearnMode;