import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const AchievementsPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile/achievements");
  }

  const [decksCount, cardsCount, repeatsCount] = await Promise.all([
    prisma.deck.count({ where: { ownerId: session.user.id } }),
    prisma.card.count({ where: { deck: { ownerId: session.user.id } } }),
    prisma.cardProgress.aggregate({
      where: { userId: session.user.id },
      _sum: { numOfRepeats: true, wrongRepeats: true },
    }),
  ]);

  return (
    <section className="mainSection flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold">Достижения</h1>
        <p className="mt-2 text-[var(--colorTextMuted)]">Короткая сводка твоего прогресса.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-[var(--colorTextMuted)]">Создано колод</p>
          <p className="mt-2 text-3xl font-bold">{decksCount}</p>
        </div>
        <div className="card">
          <p className="text-[var(--colorTextMuted)]">Карточек в колодах</p>
          <p className="mt-2 text-3xl font-bold">{cardsCount}</p>
        </div>
        <div className="card">
          <p className="text-[var(--colorTextMuted)]">Повторений</p>
          <p className="mt-2 text-3xl font-bold">{repeatsCount._sum.numOfRepeats ?? 0}</p>
          <p className="mt-2 text-sm text-[var(--colorTextMuted)]">Ошибок: {repeatsCount._sum.wrongRepeats ?? 0}</p>
        </div>
      </div>
    </section>
  );
};

export default AchievementsPage;