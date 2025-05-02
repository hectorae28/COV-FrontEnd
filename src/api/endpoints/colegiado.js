import api from "../api";

export const fetchMe = async (session) => {
    try {
        const data = api.get('usuario/me/', {
            headers: {
                Authorization: `Bearer ${session?.user?.access}`,
            },
        })
        return data;
    } catch (error) {
        console.error("Error fetching presidentes:", error);
        throw error;
    }
}
export const fetchDataUsuario = async (url,session=null, params = " ") => {
    try {
        const data = api.get(`usuario/${url}/${params}`,session&&{
            headers: {
                Authorization: `Bearer ${session?.user?.access}`,
            },
        })
        return data;
    } catch (error) {
        console.error("Error fetching footer:", error);
        throw error;
    }
}