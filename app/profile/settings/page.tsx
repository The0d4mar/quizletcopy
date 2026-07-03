import { redirect } from "next/navigation";

import { auth } from "@/auth";

const labels = {
  title: "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438",
  subtitle: "\u0411\u0430\u0437\u043e\u0432\u044b\u0435 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430. \u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439 \u0448\u0430\u0433 - \u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0438\u043c\u0435\u043d\u0438, \u0430\u0432\u0430\u0442\u0430\u0440\u043a\u0438 \u0438 \u043f\u0430\u0440\u043e\u043b\u044f.",
  account: "\u0410\u043a\u043a\u0430\u0443\u043d\u0442",
  email: "Email",
  name: "\u0418\u043c\u044f",
  noName: "\u041d\u0435 \u0443\u043a\u0430\u0437\u0430\u043d\u043e",
};

const SettingsPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile/settings");
  }

  return (
    <section className="mainSection pageStack">
      <header className="pageHeader">
        <div className="pageHeaderBody">
          <h1 className="pageTitle">{labels.title}</h1>
          <p className="pageSubtitle">{labels.subtitle}</p>
        </div>
      </header>

      <div className="card sectionBlock">
        <h2 className="sectionTitle">{labels.account}</h2>
        <p className="metaText">{labels.email}: {session.user.email}</p>
        <p className="metaText">{labels.name}: {session.user.name || labels.noName}</p>
      </div>
    </section>
  );
};

export default SettingsPage;