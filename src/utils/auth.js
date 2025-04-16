import axios from "axios";

export async function refreshAccessToken(token) {
    try {
        // Llama a tu endpoint de refresh (la URL debe estar definida en tus variables de entorno)
        const response = await axios.post(process.env.AUTH_API_URL_REFRESH, {
            refresh: token.refresh,
        });

        const refreshedTokens = response.data;
        return {
            ...token,
            access: refreshedTokens.access,
            refresh: refreshedTokens.refresh ?? token.refresh,
            // Actualizamos la expiración según el nuevo access_expires_in (si se devuelve), o usamos un valor por defecto
            accessTokenExpires: Date.now() + (refreshedTokens.access_expires_in || 300) * 1000,
        };
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}
