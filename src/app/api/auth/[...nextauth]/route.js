import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { refreshAccessToken } from "@/utils/auth";

const handler = NextAuth({
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
                    if (res.ok && data?.access && data?.refresh) {
                        return {
                            username: credentials.username,
                            access: data.access,
                            refresh: data.refresh,
                            access_expires_in: data.access_expires_in,
                        };
                    }
                    return null;
                } catch (error) {
                    console.error("Error en authorize:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.access = user.access;
                token.refresh = user.refresh;
                token.username = user.username;
                token.accessTokenExpires = Date.now() + user.access_expires_in * 1000;
                return token;
            }
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            // Si el token ha expirado, intentamos refrescarlo:
            return await refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.user = session.user || {};
            session.user.access = token.access;
            session.user.refresh = token.refresh;
            session.user.username = token.username;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };