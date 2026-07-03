import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AccountSettingsForm from "@/features/account/AccountSettingsForm";

const labels = {
  title: "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438",
  subtitle: "\u0423\u043f\u0440\u0430\u0432\u043b\u044f\u0439\u0442\u0435 \u0438\u043c\u0435\u043d\u0435\u043c, \u043f\u0430\u0440\u043e\u043b\u0435\u043c \u0438 \u0434\u0430\u043d\u043d\u044b\u043c\u0438 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430.",
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

      <AccountSettingsForm initialName={session.user.name ?? ""} email={session.user.email ?? ""} />
    </section>
  );
};

export default SettingsPage;