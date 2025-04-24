import api from "../api";

export const postPago = async (session, postData) => {
    try {
        const data = api.post('solicitudes/pago/', postData, {
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
export const getMetodosPago = async () => {
    try {
        const data = api.get('solicitudes/metodo-de-pago/')
        return data;
    } catch (error) {
        console.error("Error fetching presidentes:", error);
        throw error;
    }
}
export const getBcvDay = async () => {
    try {
        const data = api.get('solicitudes/tasa-bcv/')
        return data;
    } catch (error) {
        console.error("Error fetching presidentes:", error);
        throw error;
    }
}
export const getCostos = async (pa) => {
    try {
        const data = api.get('solicitudes/costo/')
        return data;
    } catch (error) {
        console.error("Error fetching presidentes:", error);
        throw error;
    }
}