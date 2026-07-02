import type { Folder } from "@/types/types.type";

type ApiFolder = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  decks?: Array<{ id: string; title: string }>;
};

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? String(payload.error)
        : "Folder API request failed";

    throw new Error(message);
  }

  return payload as T;
}

function fromApi(folder: ApiFolder): Folder {
  return {
    id: folder.id,
    title: folder.title,
    deckIds: folder.decks?.map((deck) => deck.id) ?? [],
    deckTitles: folder.decks?.map((deck) => deck.title) ?? [],
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
  };
}

function toApi(folder: Folder) {
  return {
    id: folder.id,
    title: folder.title,
    deckIds: folder.deckIds,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
  };
}

function hasChanged(previous: Folder | undefined, current: Folder) {
  return (
    !previous ||
    previous.title !== current.title ||
    previous.deckIds.join("|") !== current.deckIds.join("|")
  );
}

export async function getFolders(): Promise<Folder[]> {
  const response = await fetch("/api/folders", { cache: "no-store" });
  const payload = await readJson<{ folders: ApiFolder[] }>(response);

  return payload.folders.map(fromApi);
}

export async function createFolder(folder: Folder): Promise<Folder> {
  const response = await fetch("/api/folders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApi(folder)),
  });
  const payload = await readJson<{ folder: ApiFolder }>(response);

  return fromApi(payload.folder);
}

export async function updateFolder(folder: Folder): Promise<Folder> {
  const response = await fetch(`/api/folders/${folder.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: folder.title, deckIds: folder.deckIds }),
  });
  const payload = await readJson<{ folder: ApiFolder }>(response);

  return fromApi(payload.folder);
}

export async function deleteFolder(folderId: string): Promise<void> {
  const response = await fetch(`/api/folders/${folderId}`, { method: "DELETE" });
  await readJson<{ ok: boolean }>(response);
}

export async function addDeckToFolder(folderId: string, deckId: string): Promise<Folder> {
  const response = await fetch(`/api/folders/${folderId}/decks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deckId }),
  });
  const payload = await readJson<{ folder: ApiFolder }>(response);

  return fromApi(payload.folder);
}

export async function removeDeckFromFolder(folderId: string, deckId: string): Promise<Folder> {
  const response = await fetch(`/api/folders/${folderId}/decks/${deckId}`, { method: "DELETE" });
  const payload = await readJson<{ folder: ApiFolder }>(response);

  return fromApi(payload.folder);
}

export async function persistFoldersToApi(folders: Folder[], previousFolders: Folder[] = []) {
  const previousById = new Map(previousFolders.map((folder) => [folder.id, folder]));
  const currentIds = new Set(folders.map((folder) => folder.id));

  await Promise.all(
    previousFolders
      .filter((folder) => !currentIds.has(folder.id))
      .map((folder) => deleteFolder(folder.id).catch(() => undefined)),
  );

  await Promise.all(
    folders
      .filter((folder) => hasChanged(previousById.get(folder.id), folder))
      .map(async (folder) => {
        try {
          await updateFolder(folder);
        } catch {
          await createFolder(folder).catch(() => undefined);
        }
      }),
  );
}

export const fetchFoldersFromApi = getFolders;