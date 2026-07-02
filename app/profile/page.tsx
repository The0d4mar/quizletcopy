import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LogoutButton from "@/features/auth/LogoutButton";
import { prisma } from "@/lib/prisma";

const labels = {
  title: "\u041b\u0438\u0447\u043d\u044b\u0439 \u043a\u0430\u0431\u0438\u043d\u0435\u0442",
  decks: "\u041c\u043e\u0438 \u043a\u043e\u043b\u043e\u0434\u044b",
  folders: "\u041c\u043e\u0438 \u043f\u0430\u043f\u043a\u0438",
  studied: "\u0418\u0437\u0443\u0447\u0435\u043d\u043e \u043a\u0430\u0440\u0442\u043e\u0447\u0435\u043a",
  recent: "\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0435 \u043e\u0431\u043d\u043e\u0432\u043b\u0451\u043d\u043d\u044b\u0435 \u043a\u043e\u043b\u043e\u0434\u044b",
  empty: "\u0423 \u0442\u0435\u0431\u044f \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043a\u043e\u043b\u043e\u0434.",
};

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
    <section className="mainSection pageStack">
      <header className="pageHeader">
        <div className="pageHeaderBody">
          <h1 className="pageTitle">{labels.title}</h1>
          <p className="pageSubtitle">{session.user.email}</p>
        </div>

        <div className="pageHeaderActions">
          <LogoutButton />
        </div>
      </header>

      <div className="statsGrid">
        <div className="card">
          <p className="metaText">{labels.decks}</p>
          <p className="statValue">{decksCount}</p>
        </div>
        <div className="card">
          <p className="metaText">{labels.folders}</p>
          <p className="statValue">{foldersCount}</p>
        </div>
        <div className="card">
          <p className="metaText">{labels.studied}</p>
          <p className="statValue">{progressCount}</p>
        </div>
      </div>

      <section className="sectionBlock">
        <h2 className="sectionTitle">{labels.recent}</h2>
        {recentDecks.length === 0 ? (
          <p className="card mutedText">{labels.empty}</p>
        ) : (
          <div className="cardList">
            {recentDecks.map((deck) => (
              <div key={deck.id} className="card cardRow">
                <span className="font-semibold truncate">{deck.title}</span>
                <span className="metaText">{deck.updatedAt.toLocaleDateString("ru-RU")}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
};

export default ProfilePage;