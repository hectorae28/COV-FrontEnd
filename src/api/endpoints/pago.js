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