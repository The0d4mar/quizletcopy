import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const labels = {
  title: "\u0414\u043e\u0441\u0442\u0438\u0436\u0435\u043d\u0438\u044f",
  subtitle: "\u041a\u043e\u0440\u043e\u0442\u043a\u0430\u044f \u0441\u0432\u043e\u0434\u043a\u0430 \u0442\u0432\u043e\u0435\u0433\u043e \u043f\u0440\u043e\u0433\u0440\u0435\u0441\u0441\u0430.",
  decks: "\u0421\u043e\u0437\u0434\u0430\u043d\u043e \u043a\u043e\u043b\u043e\u0434",
  cards: "\u041a\u0430\u0440\u0442\u043e\u0447\u0435\u043a \u0432 \u043a\u043e\u043b\u043e\u0434\u0430\u0445",
  repeats: "\u041f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u0439",
  mistakes: "\u041e\u0448\u0438\u0431\u043e\u043a",
};

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
    <section className="mainSection pageStack">
      <header className="pageHeader">
        <div className="pageHeaderBody">
          <h1 className="pageTitle">{labels.title}</h1>
          <p className="pageSubtitle">{labels.subtitle}</p>
        </div>
      </header>

      <div className="statsGrid">
        <div className="card"><p className="metaText">{labels.decks}</p><p className="statValue">{decksCount}</p></div>
        <div className="card"><p className="metaText">{labels.cards}</p><p className="statValue">{cardsCount}</p></div>
        <div className="card"><p className="metaText">{labels.repeats}</p><p className="statValue">{repeatsCount._sum.numOfRepeats ?? 0}</p><p className="metaText mt-2">{labels.mistakes}: {repeatsCount._sum.wrongRepeats ?? 0}</p></div>
      </div>
    </section>
  );
};

export default AchievementsPage;