import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { refreshAccessToken } from "@/utils/auth";
import { fetchMe } from "@/api/endpoints/colegiado";
import { sign } from "crypto";
import { se } from "date-fns/locale";


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
                const userData = await fetchMe({
                    user: {
                        access: user.access,
                    },
                });
                token.access = user.access;
                token.username = user.username;
                token.accessTokenExpires = Date.now() + user.access_expires_in * 1000;
                token.role = userData?.data?.groups[0];
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
            return session;
        },

        async redirect({ url, baseUrl }) {
            return url.startsWith("/") ? `${baseUrl}${url}` : baseUrl;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };