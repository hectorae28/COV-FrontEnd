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
        // Evitar barras dobles - solo agregar barra si no termina en una acción específica
        const finalUrl = url.endsWith('/') ? `solicitudes/${url}` : `solicitudes/${url}/`;

        const data = await api.patch(finalUrl, body, {
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
export const postDataSolicitudJSON = async (url, body) => {
    try {
        // Evitar barras dobles - solo agregar barra si no termina en una acción específica
        const finalUrl = url.endsWith('/') ? `solicitudes/${url}` : `solicitudes/${url}/`;
        
        const data = await api.post(finalUrl, body, {
            headers: {
              'Content-Type': 'application/json',
            }
          });
        return data;
    } catch (error) {
        console.error("Error en postDataSolicitudJSON:", error);
        throw error;
    }
}

export const postDataSolicitud = async (url, body) => {
    try {
        // Evitar barras dobles - solo agregar barra si no termina en una acción específica
        const finalUrl = url.endsWith('/') ? `solicitudes/${url}` : `solicitudes/${url}/`;
        
        const data = await api.post(finalUrl, body, {
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
        // Determinar headers basado en el tipo de datos
        const headers = {};
        
        // Si es FormData (contiene archivos), no establecer Content-Type para que el navegador lo haga automáticamente
        if (detallesPagoSolvencia instanceof FormData) {
            // No establecer Content-Type, el navegador lo hará automáticamente con boundary
            console.log('📤 Enviando FormData al backend...');
        } else {
            // Para objetos JSON normales
            headers['Content-Type'] = 'application/json';
        }

        const data = await api.post('solicitudes/pago_solvencia/', detallesPagoSolvencia, {
            headers
        });
        return data;
    } catch (error) {
        console.error("Ha ocurrido un error: ", error);
        throw error;
    }
}

export const pagoSolvenciaEspecial = async (detallesPagoSolvencia) => {
    try {
        const data = api.post('solicitudes/pago_solvencia_especial/', detallesPagoSolvencia)
        return data;
    } catch (error) {
        console.error("Ha ocurrido un error: ", error);
        throw error;
    }
}

export const solicitarSolvencia = async (detallesSolvenciaEspecial) => {
    try {
        const data = api.post('solicitudes/solicitar_solvencia/', detallesSolvenciaEspecial)
        return data;
    } catch (error) {
        console.error("Ha ocurrido un error: ", error);
        throw error;
    }
}

export const solicitarPagosSolvencia = async (detallesSolvenciaEspecial) => {
    try {
        const data = api.get('solicitudes/solicitar_pagos_solvencia/')
        return data;
    } catch (error) {
        console.error("Ha ocurrido un error: ", error);
        throw error;
    }
}

// Nueva función optimizada para obtener datos de solvencia con historial de pagos
export const obtenerDatosSolvenciaCompletos = async (userId) => {
    try {
        const data = await api.get(`solicitudes/solvencia_completa/${userId}/`);
        return data;
    } catch (error) {
        console.error("Error al obtener datos completos de solvencia: ", error);
        throw error;
    }
}

// Función para obtener el historial de pagos de solvencia específicamente
export const obtenerHistorialPagosSolvencia = async (solicitudId) => {
    try {
        const data = await api.get(`solicitudes/historial_pagos_solvencia/${solicitudId}/`);
        return data;
    } catch (error) {
        console.error("Error al obtener historial de pagos: ", error);
        throw error;
    }
}

// Función para actualizar el estado de un pago específico (aprobar/rechazar)
export const actualizarEstadoPago = async (datosPago) => {
    try {
        const data = await api.patch(`solicitudes/actualizar_estado_pago/`, datosPago, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return data;
    } catch (error) {
        console.error("Error al actualizar estado del pago: ", error);
        throw error;
    }
}