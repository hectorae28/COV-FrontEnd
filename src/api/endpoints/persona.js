import api from "../api";

export const fetchExistencePersona = async (url, params = " ") => {
    try {
        const response = await api.get(`usuario/personas/${url}/?${params}`,{})
        return response.data; 
    } catch (error) {
        console.error("Error fetching footer:", error);
        throw error;
    }
}