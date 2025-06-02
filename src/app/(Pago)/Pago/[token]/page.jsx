import { fetchDataSolicitudes } from "@/api/endpoints/landingPage";
import PagoPageComponent from "./PagoPageComponent";

const Page = async ({ params }) => {
    try {
        const { token } = await params;
        
        // Validar que el token existe
        if (!token) {
            return (
                <PagoPageComponent props={{
                    data: null,
                    token: "No disponible",
                    error: "Token de pago requerido"
                }} />
            );
        }

        // Validar formato básico del token
        if (typeof token !== 'string' || token.length < 10) {
            return (
                <PagoPageComponent props={{
                    data: null,
                    token: token,
                    error: "Formato de token inválido"
                }} />
            );
        }

        let res;
        try {
            res = await fetchDataSolicitudes('pagos-token', `${token}/`);
        } catch (apiError) {
            console.error("Error en la petición API:", apiError);
            
            // Manejar errores específicos de la API
            if (apiError.response) {
                const status = apiError.response.status;
                const responseData = apiError.response.data;
                
                switch (status) {
                    case 400:
                        return (
                            <PagoPageComponent props={{
                                data: null,
                                token: token,
                                error: responseData?.message || "Token inválido o mal formateado"
                            }} />
                        );
                    case 404:
                        return (
                            <PagoPageComponent props={{
                                data: null,
                                token: token,
                                error: responseData?.message || "Token no encontrado o expirado"
                            }} />
                        );
                    case 403:
                        return (
                            <PagoPageComponent props={{
                                data: null,
                                token: token,
                                error: responseData?.message || "Acceso denegado al token"
                            }} />
                        );
                    case 401:
                        return (
                            <PagoPageComponent props={{
                                data: null,
                                token: token,
                                error: responseData?.message || "Token expirado o no válido"
                            }} />
                        );
                    case 500:
                    case 502:
                    case 503:
                    case 504:
                        return (
                            <PagoPageComponent props={{
                                data: null,
                                token: token,
                                error: responseData?.message || `Error del servidor (${status})`
                            }} />
                        );
                    default:
                        return (
                            <PagoPageComponent props={{
                                data: null,
                                token: token,
                                error: responseData?.message || `Error HTTP ${status}`
                            }} />
                        );
                }
            } else if (apiError.request) {
                // Error de red - no se recibió respuesta
                return (
                    <PagoPageComponent props={{
                        data: null,
                        token: token,
                        error: "Error de conexión. No se pudo conectar con el servidor."
                    }} />
                );
            } else {
                // Error en la configuración de la petición
                return (
                    <PagoPageComponent props={{
                        data: null,
                        token: token,
                        error: apiError.message || "Error en la configuración de la petición"
                    }} />
                );
            }
        }
        
        // Validar respuesta de la API
        if (!res) {
            return (
                <PagoPageComponent props={{
                    data: null,
                    token: token,
                    error: "No se recibió respuesta del servidor"
                }} />
            );
        }

        if (!res.data) {
            return (
                <PagoPageComponent props={{
                    data: null,
                    token: token,
                    error: "No se encontraron datos para este token de pago"
                }} />
            );
        }

        // Validar estructura básica de los datos
        if (!res.data.objeto_info) {
            return (
                <PagoPageComponent props={{
                    data: null,
                    token: token,
                    error: "Datos de pago incompletos o corruptos"
                }} />
            );
        }

        // Todo está bien, pasar datos sin errores
        return (
            <PagoPageComponent props={{
                data: res.data,
                token: token,
                error: null
            }} />
        );
        
    } catch (error) {
        console.error("Error general al cargar la página de pago:", error);
        
        const { token } = await params;
        
        return (
            <PagoPageComponent props={{
                data: null,
                token: token || "No disponible",
                error: error.message || "Error desconocido al cargar los datos de pago"
            }} />
        );
    }
}

export default Page;
