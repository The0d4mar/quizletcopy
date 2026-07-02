import type { CardData } from "@/types/types.type";

type ApiProgress = {
  id: string;
  cardId: string;
  numOfRepeats: number;
  wrongRepeats: number;
  lastRepeat: string | null;
};

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? String(payload.error)
        : "Progress API request failed";

    throw new Error(message);
  }

  return payload as T;
}

function fromApi(progress: ApiProgress): CardData {
  return {
    id: progress.id,
    cardId: progress.cardId,
    numOfRepeats: progress.numOfRepeats,
    wrongRepeats: progress.wrongRepeats,
    lastRepeat: progress.lastRepeat ? [progress.lastRepeat] : [],
  };
}

function latestRepeat(data: CardData) {
  return data.lastRepeat.at(-1) ?? null;
}

function hasChanged(previous: CardData | undefined, current: CardData) {
  return (
    !previous ||
    previous.numOfRepeats !== current.numOfRepeats ||
    previous.wrongRepeats !== current.wrongRepeats ||
    latestRepeat(previous) !== latestRepeat(current)
  );
}

export async function getProgress(): Promise<CardData[]> {
  const response = await fetch("/api/progress", { cache: "no-store" });
  const payload = await readJson<{ progress: ApiProgress[] }>(response);

  return payload.progress.map(fromApi);
}

export async function updateProgress(data: CardData): Promise<CardData> {
  const response = await fetch(`/api/progress/${data.cardId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      numOfRepeats: data.numOfRepeats,
      wrongRepeats: data.wrongRepeats,
      lastRepeat: latestRepeat(data),
    }),
  });
  const payload = await readJson<{ progress: ApiProgress }>(response);

  return fromApi(payload.progress);
}

export async function deleteProgress(cardId: string): Promise<void> {
  const response = await fetch(`/api/progress/${cardId}`, { method: "DELETE" });
  await readJson<{ ok: boolean }>(response);
}

export async function resetDeckProgress(deckId: string): Promise<void> {
  const response = await fetch(`/api/progress/deck/${deckId}`, { method: "DELETE" });
  await readJson<{ ok: boolean }>(response);
}

export async function persistProgressToApi(progress: CardData[], previousProgress: CardData[] = []) {
  const previousByCardId = new Map(previousProgress.map((data) => [data.cardId, data]));
  const currentCardIds = new Set(progress.map((data) => data.cardId));

  await Promise.all(
    previousProgress
      .filter((data) => !currentCardIds.has(data.cardId))
      .map((data) => deleteProgress(data.cardId).catch(() => undefined)),
  );

  await Promise.all(
    progress
      .filter((data) => hasChanged(previousByCardId.get(data.cardId), data))
      .map((data) => updateProgress(data).catch(() => undefined)),
  );
}

export const fetchProgressFromApi = getProgress;