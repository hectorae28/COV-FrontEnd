import { fetchDataUsuario } from '@/api/endpoints/colegiado';

// Función para obtener todos los estados
export const fetchEstados = async () => {
  try {
    const response = await fetchDataUsuario('estado', null,);
    return response.data || [];
  } catch (error) {
    console.error('Error al obtener los estados:', error);
    throw error;
  }
};

// Función para obtener municipios por estado
export const fetchMunicipios = async (estadoId) => {
  try {
    const response = await fetchDataUsuario('municipio', null, `?estado=${estadoId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error al obtener los municipios:', error);
    throw error;
  }
}; 