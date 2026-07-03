"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import UserAccountMenu from "@/features/auth/UserAccountMenu";
import HeaderBarBtn from "./HeaderBarBtn";
import HeaderSearch from "./HeaderSearch";

const labels = {
  account: "\u0410\u043a\u043a\u0430\u0443\u043d\u0442",
  checkingSession: "\u041f\u0440\u043e\u0432\u0435\u0440\u044f\u0435\u043c \u0441\u0435\u0441\u0441\u0438\u044e...",
  login: "\u0412\u043e\u0439\u0442\u0438",
  register: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c\u0441\u044f",
};

interface HeaderProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const Header = ({ isSidebarCollapsed, onToggleSidebar }: HeaderProps) => {
  const { data: session, status } = useSession();
  const isAuthenticated = Boolean(session?.user);

  return (
    <header className="appHeader">
      <div className="flex items-center justify-between shrink-0">
        <HeaderBarBtn isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={onToggleSidebar} />
      </div>

      {isAuthenticated ? <HeaderSearch /> : <div className="hidden flex-1 md:block" aria-hidden="true" />}

      <nav className="headerAccountNav" aria-label={labels.account}>
        {status === "loading" ? (
          <span className="text-sm text-[var(--colorTextMuted)]">{labels.checkingSession}</span>
        ) : isAuthenticated ? (
          <UserAccountMenu />
        ) : (
          <>
            <Link className="button" href="/login">
              {labels.login}
            </Link>
            <Link className="button" href="/register">
              {labels.register}
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;