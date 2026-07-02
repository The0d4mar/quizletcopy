"use client";

import { logoutUser } from "@/lib/api/authApi";
import { useState } from "react";

const LogoutButton = () => {
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    await logoutUser();
  };

  return (
    <button className="button" type="button" onClick={handleLogout} disabled={isPending}>
      {isPending ? "Выходим..." : "Выйти"}
    </button>
  );
};

export default LogoutButton;