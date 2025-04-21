"use client";
import { jwtDecode } from "jwt-decode";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function useAutoLogout() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.access) {
      // Decodificar el token
      const { exp } = jwtDecode(session.user.access);
      const expiresAt = exp * 1000; // milisegundos
      const timeout = expiresAt - Date.now();

      if (timeout <= 0) {
        signOut({ callbackUrl: "/login" });
      } else {
        const timer = setTimeout(
          () => signOut({ callbackUrl: "/login" }),
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
