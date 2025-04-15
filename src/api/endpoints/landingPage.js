import api from "../api";

export const fetchHistoria = async () => {
    try {
        const data = api.get('landing-cms/aboutus-history/')
        return data;
    } catch (error) {
        console.error("Error fetching historia:", error);
        throw error;
    }
}
export const fetchPresidentes = async () => {
    try {
        const data = api.get('landing-cms/galeria-presidentes/')
        return data;
    } catch (error) {
        console.error("Error fetching presidentes:", error);
        throw error;
    }
}
export const fetchOrganizacion = async () => {
    try {
        const data = api.get('landing-cms/organizaciones/')
        return data;
    } catch (error) {
        console.error("Error fetching organizacion:", error);
        throw error;
    }
}
export const fetchLeyes = async () => {
    try {
        const data = api.get('landing-cms/leyes/')
        return data;
    } catch (error) {
        console.error("Error fetching presidentes:", error);
        throw error;
    }
}
export const fetchNoticias = async (params) => {
    try {
        const data = api.get('landing-cms/noticias/' + params)
        return data;
    } catch (error) {
        console.error("Error fetching noticias:", error);
        throw error;
    }
}
export const fetchCardsHome = async () => {
    try {
        const data = api.get('landing-cms/cards-home/')
        return data;
    } catch (error) {
        console.error("Error fetching cards home:", error);
        throw error;
    }
}
export const fetchSponsors = async () => {
    try {
        const data = api.get('landing-cms/sponsores/')
        return data;
    } catch (error) {
        console.error("Error fetching sponsors:", error);
        throw error;
    }
}
export const fetchContactInfo = async () => {
    try {
        const data = api.get('landing-cms/contact-info/')
        return data;
    } catch (error) {
        console.error("Error fetching contact info:", error);
        throw error;
    }
}
export const fetchFooter = async () => {
    try {
        const data = api.get('landing-cms/footer/')
        return data;
    } catch (error) {
        console.error("Error fetching footer:", error);
        throw error;
    }
}
export const fetchDatosAdicionales = async (params = " ") => {
    try {
        const data = api.get('landing-cms/datos-adicionales/' + params)
        return data;
    } catch (error) {
        console.error("Error fetching footer:", error);
        throw error;
    }
}
export const fetchEventosCursos = async () => {
    try {
        const data = api.get('eventos/eventosCursos/')
        return data;
    } catch (error) {
        console.error("Error fetching footer:", error);
        throw error;
    }
}
export const fetchData = async (url, params = " ") => {
    try {
        const data = api.get(`solicitudes/${url}/${params}`)
        return data;
    } catch (error) {
        console.error("Error fetching footer:", error);
        throw error;
    }
}
export const fetchDataLanding = async (url, params = " ") => {
    try {
        const data = api.get(`landing-cms/${url}/${params}`)
        return data;
    } catch (error) {
        console.error("Error fetching footer:", error);
        throw error;
    }
}