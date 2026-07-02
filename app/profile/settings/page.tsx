import { redirect } from "next/navigation";

import { auth } from "@/auth";

const SettingsPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile/settings");
  }

  return (
    <section className="mainSection flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold">Настройки</h1>
        <p className="mt-2 text-[var(--colorTextMuted)]">Базовые настройки аккаунта. Следующий шаг — редактирование имени, аватарки и пароля.</p>
      </div>

      <div className="card flex flex-col gap-3">
        <h2 className="text-2xl font-bold">Аккаунт</h2>
        <p className="text-[var(--colorTextMuted)]">Email: {session.user.email}</p>
        <p className="text-[var(--colorTextMuted)]">Имя: {session.user.name || "Не указано"}</p>
      </div>
    </section>
  );
};

export default SettingsPage;