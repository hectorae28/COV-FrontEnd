import api from "../api";

export const fetchMe = async (session = null) => {
    try {
        const data = api.get('usuario/me/', session&&{
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
export const patchDataUsuario = async (url, body, docs=false) => {
    try {
        const fullUrl = `usuario/${url}/`;
        console.log("🌐 API patchDataUsuario - Entrada:", {
            url: fullUrl,
            hasFiles: docs || body instanceof FormData,
            dataType: docs || body instanceof FormData ? "multipart/form-data" : "application/json",
            bodyType: body instanceof FormData ? "FormData" : typeof body
        });

        // Log específico para FormData (para ver las instituciones)
        if (body instanceof FormData) {
            console.log("📦 FormData content:");
            for (let [key, value] of body.entries()) {
                if (key === 'instituciones') {
                    try {
                        const parsed = JSON.parse(value);
                        console.log(`  ${key}:`, {
                            parsedContent: parsed,
                            cantidadInstituciones: Array.isArray(parsed) ? parsed.length : "No es array"
                        });
                    } catch (e) {
                        console.log(`  ${key}:`, value);
                    }
                } else {
                    console.log(`  ${key}:`, typeof value === 'object' ? value.constructor.name : value);
                }
            }
        } else {
            console.log("📦 JSON body COMPLETO:", JSON.stringify(body, null, 2));
            if (body.instituciones) {
                console.log("📋 Instituciones en body:", {
                    instituciones: body.instituciones,
                    cantidad: Array.isArray(body.instituciones) ? body.instituciones.length : "No es array",
                    primerInstitucion: Array.isArray(body.instituciones) && body.instituciones.length > 0 
                        ? body.instituciones[0] 
                        : "Sin instituciones"
                });
            }
        }

        let headers = {};
        
        if (docs || body instanceof FormData) {
            headers = {
                "Content-Type": "multipart/form-data",
            };
        } else {
            headers = {
                "Content-Type": "application/json",
            };
        }

        console.log("🚀 Haciendo PATCH request a:", fullUrl);
        const data = api.patch(fullUrl, body, { headers });
        
        // Log del response
        data.then(response => {
            console.log("🌐 API patchDataUsuario - Response:", {
                url: fullUrl,
                status: response?.status,
                // Buscar instituciones en diferentes ubicaciones (corregido)
                hasInstituciones_root: !!response?.data?.instituciones,
                hasInstituciones_recaudos: !!response?.data?.recaudos?.instituciones,
                // Conteo de instituciones (corregido)
                institucionesCount_root: Array.isArray(response?.data?.instituciones) 
                    ? response.data.instituciones.length 
                    : "No es array o no existe en raíz",
                institucionesCount_recaudos: Array.isArray(response?.data?.recaudos?.instituciones) 
                    ? response.data.recaudos.instituciones.length 
                    : "No es array o no existe en recaudos",
                // Claves del response (corregido)
                responseKeys: response?.data ? Object.keys(response.data) : "Sin data",
                recaudosKeys: response?.data?.recaudos ? Object.keys(response.data.recaudos) : "Sin recaudos",
                // Datos de instituciones si existen (corregido)
                instituciones_root: response?.data?.instituciones || "No encontradas en raíz",
                instituciones_recaudos: response?.data?.recaudos?.instituciones || "No encontradas en recaudos",
                // Response completo para debug (corregido)
                fullResponseData: response?.data
            });
        }).catch(error => {
            console.error("🌐 API patchDataUsuario - Error:", {
                url: fullUrl,
                message: error.message,
                status: error.response?.status,
                responseData: error.response?.data,
                errorDetails: error.response
            });
        });

        return data;
    } catch (error) {
        console.error("Error en patchDataUsuario:", error);
        throw error;
    }
}
export const postDataUsuario = async (url, body) => {
    try {
        const data = api.post(`usuario/${url}/`,body)
        return data;
    } catch (error) {
        console.error("Error fetching patchDataUsuario:", error);
        throw error;
    }
}