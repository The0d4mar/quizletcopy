import { afterEach, describe, expect, it, vi } from 'vitest';
import { addNewCard, basicDeckName, connectedDecks, createDeckCopy, createLibraryItems, delCenDeck, delConnectedCardData, delConnectedCards, delFolder, filterLibraryItems, getGroupTitle, getSortDate, groupLibraryItems, isSameDay, isThisWeek, removeDeckFromFolders, resetDeckCardData, updateDeckLastRepeat } from './localFunc';
import { Card, CardData, Deck, Folder, LibraryItem } from '@/types/types.type';

describe('cardFunctions', () => {
  it('создает новую карточку при получении id колоды', () => {
    const id = crypto.randomUUID();

    const newCard = addNewCard(id);

    expect(newCard.deckId).toBe(id);
    expect(newCard.original).toBe('');
    expect(newCard.translation).toBe('');
    expect(newCard.id).toBeDefined();
  });
  it('удаление карточек по id колоды', ()=>{
    const cards: Card[] =[
            {
                id: '10',
                deckId: '1',
                original: '123',
                translation: '321',
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01'
            },
            {
                id: '11',
                deckId: '1',
                original: '123',
                translation: '321',
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01'
            },
            {
                id: '12',
                deckId: '1',
                original: '123',
                translation: '321',
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01'
            },
            {
                id: '13',
                deckId: '2',
                original: '123',
                translation: '321',
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01'
            },
            {
                id: '14',
                deckId: '3',
                original: '123',
                translation: '321',
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01'
            },
            {
                id: '15',
                deckId: '3',
                original: '123',
                translation: '321',
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01'
            },
        ];
    const newCards = delConnectedCards(cards, '1')
    expect(newCards.length).toEqual(3)
    expect(newCards.map(card=>card.deckId)).not.toContain(1)
  });
});

describe('deckFunctions', () => {
    it('удаляет выбранную deck', () => {
        const decks: Deck[] = [
        {
            id: '1',
            title: 'title1',
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
            public: false,
            createdBy: 'User',
            lastRepeat: '2026-01-01',
        },
        {
            id: '2',
            title: 'title2',
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
            public: false,
            createdBy: 'User',
            lastRepeat: '2026-01-01',
        },
        {
            id: '3',
            title: 'title3',
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
            public: false,
            createdBy: 'User',
            lastRepeat: '2026-01-01',
        },
        ];

        const result = delCenDeck(decks, '1');

        expect(result).toHaveLength(2);

        expect(result.map(deck => deck.id)).not.toContain('1');

        expect(result).toEqual([
        expect.objectContaining({ id: '2' }),
        expect.objectContaining({ id: '3' }),
        ]);
    });
    it('изменения даты просмотра колоды', ()=>{
        const decks: Deck[] = [
        {
            id: '1',
            title: 'title1',
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
            public: false,
            createdBy: 'User',
            lastRepeat: '2026-01-01',
        },
        {
            id: '2',
            title: 'title2',
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
            public: false,
            createdBy: 'User',
            lastRepeat: '2026-01-01',
        },
        {
            id: '3',
            title: 'title3',
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
            public: false,
            createdBy: 'User',
            lastRepeat: '2026-01-01',
        },
        ];

        const newDecklastRepeat = updateDeckLastRepeat(decks, '1')[0].lastRepeat
        expect(newDecklastRepeat).not.toBe('2026-01-01')
    })
    it('базовое имя колоды', ()=>{
        const decks: Deck[] = [
        {
            id: '1',
            title: 'Колода 2',
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
            public: false,
            createdBy: 'User',
            lastRepeat: '2026-01-01',
        },
        {
            id: '2',
            title: 'Колода',
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
            public: false,
            createdBy: 'User',
            lastRepeat: '2026-01-01',
        },
        {
            id: '3',
            title: 'Новая коллекция 2',
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
            public: false,
            createdBy: 'User',
            lastRepeat: '2026-01-01',
        },
        ];
        const newDeck = basicDeckName(decks)
        expect(newDeck).toBe('Новая коллекция')
        decks.push({
            id: '1',
            title: newDeck,
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
            public: false,
            createdBy: 'User',
            lastRepeat: '2026-01-01',
        },)
        const secondCheck = basicDeckName(decks)
        expect(secondCheck).toBe('Новая коллекция 1')
    })
    it('объединение колод', ()=>{
        const decks: Deck[] = [
        {
            id: '1',
            title: 'Колода 2',
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
            public: false,
            createdBy: 'User',
            lastRepeat: '2026-01-01',
        },
        {
            id: '2',
            title: 'Колода',
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
            public: false,
            createdBy: 'User',
            lastRepeat: '2026-01-01',
        },
        {
            id: '3',
            title: 'Новая коллекция 2',
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
            public: false,
            createdBy: 'User',
            lastRepeat: '2026-01-01',
        },
        ];

        const cards: Card[] =[
            {
                id: '10',
                deckId: '1',
                original: '123',
                translation: '321',
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01'
            },
            {
                id: '11',
                deckId: '1',
                original: '123',
                translation: '321',
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01'
            },
            {
                id: '12',
                deckId: '2',
                original: '123',
                translation: '321',
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01'
            },
            {
                id: '13',
                deckId: '2',
                original: '123',
                translation: '321',
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01'
            },
            {
                id: '14',
                deckId: '3',
                original: '123',
                translation: '321',
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01'
            },
            {
                id: '15',
                deckId: '3',
                original: '123',
                translation: '321',
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01'
            },
        ];

        const [newCards, newDecks] = connectedDecks("1","2",cards,decks)
        expect(newDecks.length).toEqual(2)

        expect(newCards.filter(card => card.deckId == "1").length).toEqual(4)
        expect(newCards.find(card => card.id == '13')?.deckId).toEqual('1')

    })
    }


);

describe('folderFunc', ()=>{
    it('удаление папки по id', ()=>{
        const folders:Folder[] = [
            {
                id: '1',
                title: 'заголовок 1',
                deckTitles: ['колода 1', 'колода 2'],
                deckIds: ['1','2'],
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01',
            },
             {
                id: '2',
                title: 'заголовок 2',
                deckTitles: ['колода 3', 'колода 4'],
                deckIds: ['4','5'],
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01',
            }
        ]
        const newFolders = delFolder(folders, '1')
        expect(newFolders.map(folder=>folder.id)).not.toContain('1')
        expect(newFolders.length).toEqual(1)
    })
    it('очитска папок от удаленной колоды', ()=>{
        const folders:Folder[] = [
            {
                id: '1',
                title: 'заголовок 1',
                deckTitles: ['колода 1', 'колода 2'],
                deckIds: ['1','2'],
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01',
            },
             {
                id: '2',
                title: 'заголовок 2',
                deckTitles: ['колода 3', 'колода 4'],
                deckIds: ['1','5'],
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01',
            }
        ]
        const newFolders = removeDeckFromFolders(folders, '1')
        expect(newFolders[0].deckIds).not.toContain('1')
        expect(newFolders[1].deckIds).not.toContain('1')
        expect(newFolders.map(folders=> folders.deckIds)).not.toContain('1')
        expect(newFolders.map(folders=> folders.deckIds).length).toEqual(2)
        expect(newFolders.length).toEqual(2)
    })
})

describe('isSameDay', ()=>{
    it('сравнение дат ', ()=>{
        const dataA: Date =  new Date('2026-01-01')
        const dataB: Date =  new Date('2026-01-01')
        expect(isSameDay(dataA, dataB)).toBe(true)
        expect(isSameDay(dataA, new Date('2026-03-03'))).toBe(false)
        expect(isSameDay(new Date('2020-01-01'), dataB)).toBe(false)
    })
})

describe('isThisWeek', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('возвращает true, если дата находится на этой неделе, но не сегодня', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00'));

    const date = new Date('2026-06-09T10:00:00');

    expect(isThisWeek(date)).toBe(true);
  });

  it('возвращает false для сегодняшней даты', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00'));

    const date = new Date('2026-06-11T08:00:00');

    expect(isThisWeek(date)).toBe(false);
  });

  it('возвращает false для даты из прошлой недели', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00'));

    const date = new Date('2026-06-03T10:00:00');

    expect(isThisWeek(date)).toBe(false);
  });

  it('возвращает true для воскресенья текущей недели', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00'));

    const date = new Date('2026-06-14T20:00:00');

    expect(isThisWeek(date)).toBe(true);
  });
});


const deckItem: LibraryItem = {
  type: 'deck',
  id: 'deck-1',
  title: 'English words',
  createdAt: '2026-06-01T10:00:00.000Z',
  updatedAt: '2026-06-05T10:00:00.000Z',
  viewedAt: '2026-06-07T10:00:00.000Z',
  cardsCount: 3,
  href: '/deck/deck-1',
};

const folderItem: LibraryItem = {
  type: 'folder',
  id: 'folder-1',
  title: 'Languages',
  createdAt: '2026-05-01T10:00:00.000Z',
  updatedAt: '2026-06-03T10:00:00.000Z',
  viewedAt: '2026-06-03T10:00:00.000Z',
  modulesCount: 2,
  href: '/folders/folder-1',
};

describe('getSortDate', () => {
  it('возвращает createdAt для сортировки по created', () => {
    expect(getSortDate(deckItem, 'created')).toBe(deckItem.createdAt);
  });

  it('возвращает updatedAt для сортировки по updated', () => {
    expect(getSortDate(deckItem, 'updated')).toBe(deckItem.updatedAt);
  });

  it('возвращает viewedAt для сортировки по viewed', () => {
    expect(getSortDate(deckItem, 'viewed')).toBe(deckItem.viewedAt);
  });

  it('если viewedAt нет, возвращает updatedAt', () => {
    const itemWithoutViewedAt: LibraryItem = {
      ...deckItem,
      viewedAt: undefined,
    };

    expect(getSortDate(itemWithoutViewedAt, 'viewed')).toBe(
      itemWithoutViewedAt.updatedAt
    );
  });
});

describe('getGroupTitle', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('возвращает "Сегодня", если дата совпадает с текущим днём', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00.000Z'));

    const item: LibraryItem = {
      ...deckItem,
      updatedAt: '2026-06-11T08:00:00.000Z',
    };

    expect(getGroupTitle(item, 'updated')).toBe('Сегодня');
  });

  it('возвращает "На этой неделе", если дата находится на текущей неделе, но не сегодня', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00.000Z'));

    const item: LibraryItem = {
      ...deckItem,
      updatedAt: '2026-06-09T08:00:00.000Z',
    };

    expect(getGroupTitle(item, 'updated')).toBe('На этой неделе');
  });

  it('возвращает "Месяц год", если дата не сегодня и не на этой неделе', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00.000Z'));

    const item: LibraryItem = {
      ...deckItem,
      updatedAt: '2026-05-20T08:00:00.000Z',
    };

    expect(getGroupTitle(item, 'updated')).toBe('Май 2026');
  });
});

describe('createLibraryItems', () => {
  it('создаёт LibraryItem[] из decks и folders', () => {
    const decks: Deck[] = [
      {
        id: 'deck-1',
        title: 'English words',
        createdAt: '2026-06-01T10:00:00.000Z',
        updatedAt: '2026-06-05T10:00:00.000Z',
        public: false,
        createdBy: 'User',
        lastRepeat: '2026-06-07T10:00:00.000Z',
      },
    ];

    const cards: Card[] = [
      {
        id: 'card-1',
        deckId: 'deck-1',
        original: 'cat',
        translation: 'кот',
        createdAt: '2026-06-01T10:00:00.000Z',
        updatedAt: '2026-06-01T10:00:00.000Z',
      },
      {
        id: 'card-2',
        deckId: 'deck-1',
        original: 'dog',
        translation: 'собака',
        createdAt: '2026-06-01T10:00:00.000Z',
        updatedAt: '2026-06-01T10:00:00.000Z',
      },
      {
        id: 'card-3',
        deckId: 'another-deck',
        original: 'bird',
        translation: 'птица',
        createdAt: '2026-06-01T10:00:00.000Z',
        updatedAt: '2026-06-01T10:00:00.000Z',
      },
    ];

    const folders: Folder[] = [
      {
        id: 'folder-1',
        title: 'Languages',
        deckIds: ['deck-1', 'deck-2'],
        deckTitles: ['deck1', 'deck2'],
        createdAt: '2026-05-01T10:00:00.000Z',
        updatedAt: '2026-06-03T10:00:00.000Z',

      },
    ];

    const result = createLibraryItems(decks, cards, folders);

    expect(result).toHaveLength(2);

    expect(result[0]).toMatchObject({
      type: 'deck',
      id: 'deck-1',
      title: 'English words',
      viewedAt: '2026-06-07T10:00:00.000Z',
      cardsCount: 2,
      href: '/deck/deck-1',
    });

    expect(result[1]).toMatchObject({
      type: 'folder',
      id: 'folder-1',
      title: 'Languages',
      modulesCount: 2,
      href: '/folders/folder-1',
    });
  });
});

describe('filterLibraryItems', () => {
  const items: LibraryItem[] = [
    {
      ...deckItem,
      id: 'deck-1',
      title: 'English words',
      updatedAt: '2026-06-10T10:00:00.000Z',
    },
    {
      ...deckItem,
      id: 'deck-2',
      title: 'Hebrew words',
      updatedAt: '2026-06-12T10:00:00.000Z',
    },
    {
      ...folderItem,
      id: 'folder-1',
      title: 'Languages folder',
      updatedAt: '2026-06-11T10:00:00.000Z',
    },
  ];

  it('возвращает все элементы при entityFilter = all', () => {
    const result = filterLibraryItems(items, 'all', '', 'updated');

    expect(result).toHaveLength(3);
  });

  it('возвращает только deck при entityFilter = decks', () => {
    const result = filterLibraryItems(items, 'decks', '', 'updated');

    expect(result).toHaveLength(2);
    expect(result.every(item => item.type === 'deck')).toBe(true);
  });

  it('возвращает только folder при entityFilter = folders', () => {
    const result = filterLibraryItems(items, 'folders', '', 'updated');

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('folder');
  });

  it('фильтрует по поисковой строке без учёта регистра', () => {
    const result = filterLibraryItems(items, 'all', 'hebrew', 'updated');

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Hebrew words');
  });

  it('сортирует по дате от новых к старым', () => {
    const result = filterLibraryItems(items, 'all', '', 'updated');

    expect(result.map(item => item.id)).toEqual([
      'deck-2',
      'folder-1',
      'deck-1',
    ]);
  });
});

describe('groupLibraryItems', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('группирует элементы по Сегодня / На этой неделе / Месяц год', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00.000Z'));

    const items: LibraryItem[] = [
      {
        ...deckItem,
        id: 'today-item',
        updatedAt: '2026-06-11T08:00:00.000Z',
      },
      {
        ...deckItem,
        id: 'week-item',
        updatedAt: '2026-06-09T08:00:00.000Z',
      },
      {
        ...deckItem,
        id: 'month-item',
        updatedAt: '2026-05-20T08:00:00.000Z',
      },
    ];

    const result = groupLibraryItems(items, 'updated');

    expect(Object.keys(result)).toEqual([
      'Сегодня',
      'На этой неделе',
      'Май 2026',
    ]);

    expect(result['Сегодня']).toHaveLength(1);
    expect(result['Сегодня'][0].id).toBe('today-item');

    expect(result['На этой неделе']).toHaveLength(1);
    expect(result['На этой неделе'][0].id).toBe('week-item');

    expect(result['Май 2026']).toHaveLength(1);
    expect(result['Май 2026'][0].id).toBe('month-item');
  });
});

describe('createDeckCopy', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('returns null when target deck does not exist', () => {
    expect(createDeckCopy([], [], 'missing-deck')).toBeNull();
  });

  it('copies target deck and only its cards with new ids and timestamps', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-20T10:00:00.000Z'));

    const randomUUID = vi
      .spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('new-deck-id')
      .mockReturnValueOnce('new-card-id-1')
      .mockReturnValueOnce('new-card-id-2');

    const decks: Deck[] = [
      {
        id: 'deck-1',
        title: 'English',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
        createdBy: 'User',
        public: false,
        lastRepeat: '2026-01-03T00:00:00.000Z',
      },
    ];

    const cards: Card[] = [
      {
        id: 'card-1',
        deckId: 'deck-1',
        original: 'cat',
        translation: '���',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'card-2',
        deckId: 'deck-2',
        original: 'dog',
        translation: '���',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'card-3',
        deckId: 'deck-1',
        original: 'bird',
        translation: '�����',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ];

    const result = createDeckCopy(decks, cards, 'deck-1');

    expect(result?.newDeckId).toBe('new-deck-id');
    expect(result?.decks).toHaveLength(2);
    expect(result?.decks[1]).toMatchObject({
      id: 'new-deck-id',
      title: 'Copy: English',
      createdAt: '2026-06-20T10:00:00.000Z',
      updatedAt: '2026-06-20T10:00:00.000Z',
      lastRepeat: '2026-06-20T10:00:00.000Z',
    });

    const copiedCards = result?.cards.filter(card => card.deckId === 'new-deck-id');

    expect(copiedCards).toEqual([
      expect.objectContaining({
        id: 'new-card-id-1',
        original: 'cat',
        deckId: 'new-deck-id',
        createdAt: '2026-06-20T10:00:00.000Z',
        updatedAt: '2026-06-20T10:00:00.000Z',
      }),
      expect.objectContaining({
        id: 'new-card-id-2',
        original: 'bird',
        deckId: 'new-deck-id',
        createdAt: '2026-06-20T10:00:00.000Z',
        updatedAt: '2026-06-20T10:00:00.000Z',
      }),
    ]);
    expect(randomUUID).toHaveBeenCalledTimes(3);
  });
});

describe('cardDataFunctions', () => {
  const cards: Card[] = [
    {
      id: 'card-1',
      deckId: 'deck-1',
      original: 'cat',
      translation: '���',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: 'card-2',
      deckId: 'deck-2',
      original: 'dog',
      translation: '���',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
  ];

  const cardData: CardData[] = [
    {
      id: 'data-1',
      cardId: 'card-1',
      numOfRepeats: 3,
      wrongRepeats: 1,
      lastRepeat: ['2026-01-01'],
    },
    {
      id: 'data-2',
      cardId: 'card-2',
      numOfRepeats: 5,
      wrongRepeats: 2,
      lastRepeat: ['2026-02-01'],
    },
  ];

  it('removes card data connected to deleted deck cards', () => {
    const result = delConnectedCardData(cards, cardData, 'deck-1');

    expect(result).toEqual([cardData[1]]);
  });

  it('resets stats only for provided card ids', () => {
    const result = resetDeckCardData(cardData, ['card-1']);

    expect(result[0]).toMatchObject({
      id: 'data-1',
      cardId: 'card-1',
      numOfRepeats: 0,
      wrongRepeats: 0,
      lastRepeat: [],
    });
    expect(result[1]).toEqual(cardData[1]);
  });
});

