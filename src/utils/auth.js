import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { fetchMe } from "@/api/endpoints/colegiado";


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "user0" },
                password: { label: "Password", type: "password", placeholder: "password" }
            },
            async authorize(credentials, req) {
                try {
                    const res = await fetch(process.env.AUTH_API_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                        credentials: 'include',
                    });
                    const data = await res.json();
                    if (res.ok && data?.access) {
                        return {
                            username: credentials.username,
                            access: data.access,
                            access_expires_in: data.access_expires_in,
                        };
                    }
                    return data;
                } catch (error) {
                    throw new Error(error.message || "Error de autenticación");
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signOut({ token }) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}/api/v1/usuario/logout/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token.access}`,
                    },
                });
                console.log("Sesión cerrada en el backend");
            } catch (error) {
                console.error("Error al cerrar sesión en el backend:", error);
            }
        },
        async signIn({ user, account, profile, email, credentials }) {
            if (user?.error) {
                return `${process.env.NEXTAUTH_URL}/Login?error=${encodeURIComponent(user.error)}`;
            }
            return true;
          },
        async jwt({ token, user }) {
            if (user) {
                const userData = await fetchMe({
                    user: {
                        access: user.access,
                    },
                });
                token.access = user.access;
                token.username = user.username;
                token.accessTokenExpires = Date.now() + user.access_expires_in * 1000;
                token.role = userData?.data?.groups[0];
                token.solvente = userData?.data?.solvente;
                token.solvenciaStatus = userData?.data?.solvencia_status
                return token;
            }
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }
            return token
        },
        async session({ session, token }) {
            session.user = session.user || {};
            session.user.access = token.access;
            session.user.username = token.username;
            session.user.role = token.role;
            session.user.solvente = token.solvente;
            session.user.solvenciaStatus = token.solvenciaStatus;
            return session;
        },

        async redirect({ url, baseUrl }) {
            return url.startsWith("/") ? `${baseUrl}${url}` : baseUrl;
        },
    },
    pages: {
        signIn: "/Login",
        error: "/Login",
        signOut: "/Login",
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export const handler = NextAuth(authOptions);
