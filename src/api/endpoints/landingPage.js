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