"use client";
import { jwtDecode } from "jwt-decode";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function useAutoLogout() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.access) {
      const { exp } = jwtDecode(session.user.access);
      const expiresAt = exp * 1000;
      const timeout = expiresAt - Date.now();

      if (timeout <= 0) {
        signOut({ callbackUrl: "/Login" });
      } else {
        const timer = setTimeout(
          () => signOut(session, { callbackUrl: "/Login" }),
          timeout
        );
        return () => clearTimeout(timer);
      }
    }
  }, [session]);
}
export default function AutoLog({ children }) {
  useAutoLogout();
  return <>{children}</>;
}
