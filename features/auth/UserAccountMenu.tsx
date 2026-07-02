"use client";

import { BarChart3, LogOut, Settings, Sun } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { logoutUser } from "@/lib/api/authApi";

const labels = {
  openMenu: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430",
  accountMenu: "\u041c\u0435\u043d\u044e \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430",
  user: "\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c",
  profileStats: "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f",
  settings: "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438",
  light: "\u0421\u0432\u0435\u0442\u043b\u0430\u044f",
  dark: "\u0422\u0451\u043c\u043d\u0430\u044f",
  logout: "\u0412\u044b\u0439\u0442\u0438",
  loggingOut: "\u0412\u044b\u0445\u043e\u0434\u0438\u043c...",
};

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.split("@")[0] || "User";
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");

  return initials || "U";
}

const UserAccountMenu = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("remfront-theme") === "light";
  });
  const [isLogoutPending, setIsLogoutPending] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const user = session?.user;
  const initials = useMemo(() => getInitials(user?.name, user?.email), [user?.name, user?.email]);

  useEffect(() => {
    const theme = isLightTheme ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("remfront-theme", theme);
  }, [isLightTheme]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const toggleTheme = () => {
    setIsLightTheme((value) => !value);
  };

  const handleLogout = async () => {
    setIsLogoutPending(true);
    await logoutUser();
  };

  return (
    <div className="userAccount" ref={rootRef}>
      <button
        type="button"
        className="userAvatarButton"
        aria-label={labels.openMenu}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        {user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" className="userAvatarImage" />
        ) : (
          <span className="userAvatarInitials">{initials}</span>
        )}
      </button>

      {isOpen && (
        <div className="userMenu" role="dialog" aria-label={labels.accountMenu}>
          <div className="userMenuHeader">
            <div className="userMenuAvatar" aria-hidden="true">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" className="userAvatarImage" />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <div className="userMenuIdentity">
              <strong>{user?.name || labels.user}</strong>
              <span>{user?.email}</span>
            </div>
          </div>

          <div className="userMenuSection">
            <Link className="userMenuItem" href="/profile" onClick={() => setIsOpen(false)}>
              <BarChart3 size={22} />
              <span>{labels.profileStats}</span>
            </Link>

            <Link className="userMenuItem" href="/profile/settings" onClick={() => setIsOpen(false)}>
              <Settings size={22} />
              <span>{labels.settings}</span>
            </Link>

            <button className="userMenuItem" type="button" onClick={toggleTheme}>
              <Sun size={22} />
              <span>{isLightTheme ? labels.dark : labels.light}</span>
            </button>
          </div>

          <div className="userMenuSection userMenuSectionBottom">
            <button className="userMenuLogout" type="button" onClick={handleLogout} disabled={isLogoutPending}>
              <LogOut size={20} />
              <span>{isLogoutPending ? labels.loggingOut : labels.logout}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccountMenu;
