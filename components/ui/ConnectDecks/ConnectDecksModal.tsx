import { connectedDecks } from '@/api/localFunc';
import { loadDecks } from '@/storage';
import { setUpdatedCards } from '@/store/cardStore';
import { setDecks } from '@/store/deckStore';
import { modalState } from '@/store/modalStore';
import { RootState } from '@/store/store';
import { Cross, X } from 'lucide-react';
import React from 'react';
import {FC} from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface ConnectDecksModalProps {
  sendedDeckId: string;
  onConnected: () => void;
}

const ConnectDecksModal: FC<ConnectDecksModalProps> = ({
  sendedDeckId,
  onConnected,
}) => {
  const decks = useSelector((state: RootState) => state.deckStore.decks);
  const hideFlag = useSelector((state: RootState) => state.modal.state);
  const dispatch = useDispatch();

  const connectFunc = (joinedDeckId: string) => {
    const [updatedCards, newDecks] = connectedDecks(sendedDeckId, joinedDeckId);
    dispatch(setDecks(newDecks))
    dispatch(setUpdatedCards(updatedCards))
    onConnected();
    dispatch(modalState(false));
  };

  return (
    <div
      className={`
        ${!hideFlag ? 'hidden' : 'flex'}
        fixed inset-0 z-50 items-center justify-center bg-black/50
      `}
    >
      <div className="w-full max-w-lg rounded-2xl border border-white bg-black p-6">
        <div className="relative mb-6 flex items-center justify-between">
          <h2 className="text-xl">
            Выберите колоду для объединения
          </h2>

          <button
            className="text-white hover:text-gray-300"
            onClick={() => dispatch(modalState(false))}
          >
            <X size={24}/>
          </button>

        </div>

        <ul className="flex flex-col gap-2">
          {decks.map(deck => {
            if (deck.id !== sendedDeckId) {
              return (
                <li key={deck.id}>
                  <button
                    className="w-full rounded-xl border p-3 text-left"
                    onClick={() => connectFunc(deck.id)}
                  >
                    {deck.title}
                  </button>
                </li>
              );
            }

            return null;
          })}
        </ul>
      </div>
    </div>
  );
};

export default ConnectDecksModal;