import { describe, expect, it, afterEach, vi } from 'vitest';
import deckReducer, { changeDeck, delDecks, pushDeck, setDecks } from './deckStore';
import cardReducer, { addCard, changeCard, delCard, setUpdatedCards } from './cardStore';
import folderReducer, { addFolder, createFolderCopy, deleteFolder, setFolders } from './folderStore';
import cardDataReducer, { setCardData } from './cardDataStore';
import modalReducer, { modalState } from './modalStore';
import { Card, CardData, Deck, Folder } from '@/types/types.type';

const deckA: Deck = {
  id: 'deck-1',
  title: 'Deck A',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
  createdBy: 'User',
  public: false,
  lastRepeat: '2026-01-01',
};

const deckB: Deck = {
  ...deckA,
  id: 'deck-2',
  title: 'Deck B',
};

const cardA: Card = {
  id: 'card-1',
  deckId: 'deck-1',
  original: 'cat',
  translation: 'kot',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

const cardB: Card = {
  ...cardA,
  id: 'card-2',
  original: 'dog',
};

const folderA: Folder = {
  id: 'folder-1',
  title: 'Folder A',
  deckIds: ['deck-1'],
  deckTitles: ['Deck A'],
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

const cardDataA: CardData = {
  id: 'data-1',
  cardId: 'card-1',
  numOfRepeats: 2,
  wrongRepeats: 1,
  lastRepeat: ['2026-01-01'],
};

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('deckStore reducer', () => {
  it('sets decks in memory', () => {
    const state = deckReducer({ decks: [] }, setDecks([deckA, deckB]));

    expect(state.decks).toEqual([deckA, deckB]);
  });

  it('adds, changes and deletes decks', () => {
    const added = deckReducer({ decks: [deckA] }, pushDeck(deckB));
    const changedDeck = { ...deckB, title: 'Updated Deck' };
    const changed = deckReducer(added, changeDeck(changedDeck));
    const deleted = deckReducer(changed, delDecks('deck-1'));

    expect(added.decks).toHaveLength(2);
    expect(changed.decks.find(deck => deck.id === 'deck-2')?.title).toBe('Updated Deck');
    expect(deleted.decks).toEqual([changedDeck]);
  });
});

describe('cardStore reducer', () => {
  it('sets cards in memory', () => {
    const state = cardReducer({ cards: [] }, setUpdatedCards([cardA]));

    expect(state.cards).toEqual([cardA]);
  });

  it('adds, changes and deletes cards', () => {
    const added = cardReducer({ cards: [cardA] }, addCard(cardB));
    const changedCard = { ...cardB, translation: 'pes' };
    const changed = cardReducer(added, changeCard(changedCard));
    const deleted = cardReducer(changed, delCard(cardA));

    expect(added.cards).toHaveLength(2);
    expect(changed.cards.find(card => card.id === 'card-2')?.translation).toBe('pes');
    expect(deleted.cards).toEqual([changedCard]);
  });
});

describe('folderStore reducer', () => {
  it('sets, adds and deletes folders in memory', () => {
    const folderB: Folder = { ...folderA, id: 'folder-2', title: 'Folder B' };

    const set = folderReducer({ folders: [] }, setFolders([folderA]));
    const added = folderReducer(set, addFolder(folderB));
    const deleted = folderReducer(added, deleteFolder('folder-1'));

    expect(set.folders).toEqual([folderA]);
    expect(added.folders).toEqual([folderA, folderB]);
    expect(deleted.folders).toEqual([folderB]);
  });

  it('creates a uniquely named folder copy', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('folder-copy-id');

    const state = folderReducer(
      {
        folders: [
          folderA,
          { ...folderA, id: 'folder-copy-1', title: 'Copy: Folder A' },
        ],
      },
      createFolderCopy({ folderId: 'folder-1' })
    );

    expect(state.folders[2]).toMatchObject({
      id: 'folder-copy-id',
      title: 'Copy (2): Folder A',
      deckIds: ['deck-1'],
    });
  });
});

describe('cardDataStore reducer', () => {
  it('sets card data in memory', () => {
    const state = cardDataReducer({ cardData: [] }, setCardData([cardDataA]));

    expect(state.cardData).toEqual([cardDataA]);
  });
});

describe('modalStore reducer', () => {
  it('toggles modal state', () => {
    expect(modalReducer(undefined, modalState(true)).state).toBe(true);
    expect(modalReducer({ state: true }, modalState(false)).state).toBe(false);
  });
});
