import { useState, useEffect } from 'react';
import api from '@/api/api';

export const useEspecializaciones = () => {
  const [especializaciones, setEspecializaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEspecializaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('solicitudes/especializacion/');
      
      // El backend devuelve un objeto con claves que son los nombres de las especializaciones
      // Lo convertimos a un array para facilitar su manejo
      const especializacionesArray = Object.entries(response.data).map(([key, data]) => ({
        id: data.id,
        title: data.title,
        description: data.description,
        color: data.color,
        image: data.image,
        icon: data.icon,
        key: key
      }));
      
      setEspecializaciones(especializacionesArray);
    } catch (err) {
      console.error('Error al cargar especializaciones:', err);
      setError(err.message || 'Error al cargar las especializaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEspecializaciones();
  }, []);

  const refetch = () => {
    fetchEspecializaciones();
  };

  return {
    especializaciones,
    loading,
    error,
    refetch
  };
}; 