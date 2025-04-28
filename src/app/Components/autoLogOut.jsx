"use client";
import { jwtDecode } from "jwt-decode";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function useAutoLogout() {
  const { data: session, status } = useSession();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'; // Reemplaza con tu URL real

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.access) {
      // Decodificar el token
      const { exp, username } = jwtDecode(session.user.access);
      console.log("Token decodificado:", { exp, username });
      const expiresAt = exp * 1000; // milisegundos
      const timeout = expiresAt - Date.now();

      if (timeout <= 0) {
        signOut({ callbackUrl: "/login" });
      } else {
        const timer = setTimeout(
          () => signOut(session,{ callbackUrl: "/login" }),
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
