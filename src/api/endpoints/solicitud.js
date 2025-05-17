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
export const getCostos = async () => {
    try {
        const data = api.get('solicitudes/costo/')
        return data;
    } catch (error) {
        console.error("Error fetching presidentes:", error);
        throw error;
    }
}
export const fetchSolicitudes = async (url, params = "") => {
    try {
        return await api.get(`solicitudes/${url}/${params}`)
    } catch (error) {
        console.error("error", error)
        throw error;
    }
}

export const patchDataSolicitud = async (url, body) => {
    try {

        const data = await api.patch(`solicitudes/${url}/`, body, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
        return data;
    } catch (error) {
        console.error("Error en patchDataUsuario:", error);
        throw error;
    }
}
export const postDataSolicitud = async (url, body) => {
    try {
        const data = await api.post(`solicitudes/${url}/`, body, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
        return data;
    } catch (error) {
        console.error("Error fetching patchDataUsuario:", error);
        throw error;
    }
}

export const pagoSolvencia = async (detallesPagoSolvencia) => {
    try {
        const data = api.post('solicitudes/pago_solvencia/', detallesPagoSolvencia)
        return data;
    } catch (error) {
        console.error("Ha ocurrido un error: ", error);
        throw error;
    }
}

export const solicitarSolvenciaEspecial = async (detallesSolvenciaEspecial) => {
    try {
        const data = api.post('solicitudes/solicitar_costo_solvencia/', detallesSolvenciaEspecial)
        return data;
    } catch (error) {
        console.error("Ha ocurrido un error: ", error);
        throw error;
    }
}