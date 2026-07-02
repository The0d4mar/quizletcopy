import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LogoutButton from "@/features/auth/LogoutButton";
import { prisma } from "@/lib/prisma";

const ProfilePage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  const [decksCount, foldersCount, progressCount, recentDecks] = await Promise.all([
    prisma.deck.count({ where: { ownerId: session.user.id } }),
    prisma.folder.count({ where: { ownerId: session.user.id } }),
    prisma.cardProgress.count({ where: { userId: session.user.id } }),
    prisma.deck.findMany({
      where: { ownerId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, updatedAt: true },
    }),
  ]);

  return (
    <section className="mainSection flex flex-col gap-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">Личный кабинет</h1>
          <p className="mt-2 text-[var(--colorTextMuted)]">{session.user.email}</p>
        </div>

        <LogoutButton />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-[var(--colorTextMuted)]">Мои колоды</p>
          <p className="mt-2 text-3xl font-bold">{decksCount}</p>
        </div>
        <div className="card">
          <p className="text-[var(--colorTextMuted)]">Мои папки</p>
          <p className="mt-2 text-3xl font-bold">{foldersCount}</p>
        </div>
        <div className="card">
          <p className="text-[var(--colorTextMuted)]">Изучено карточек</p>
          <p className="mt-2 text-3xl font-bold">{progressCount}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold">Последние обновлённые колоды</h2>
        {recentDecks.length === 0 ? (
          <p className="card text-[var(--colorTextMuted)]">У тебя пока нет колод.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {recentDecks.map((deck) => (
              <div key={deck.id} className="card flex items-center justify-between">
                <span>{deck.title}</span>
                <span className="text-sm text-[var(--colorTextMuted)]">{deck.updatedAt.toLocaleDateString("ru-RU")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfilePage;