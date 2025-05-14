// Agregar al archivo src/app/Models/PanelControl/Solicitudes/SolicitudesData.jsx

import { create } from "zustand";
import { fetchSolicitudes } from "@/api/endpoints/solicitud";
import api from "@/api/api";

export const convertJsonToFormData = (solicitudJson, opcionales = {}) => {
  const formData = new FormData();
  
  formData.append("colegiado_id", solicitudJson.colegiadoId);
  formData.append("descripcion", solicitudJson.descripcion || "");
  
  if (opcionales.referencia) formData.append("referencia", solicitudJson.referencia);
  if (opcionales.estado) formData.append("estado", solicitudJson.estado || "Pendiente");
  
  const items = {};
  
  solicitudJson.itemsSolicitud.forEach(item => {
    const tipoBase = item.tipo.toLowerCase();
    
    if (tipoBase === "carnet") {
      items.carnet = {
        costo: item.costo,
        exonerado: item.exonerado || false
      };
    } 
    else if (tipoBase === "especializacion") {
      items.especializacion = {
        costo: item.costo,
        exonerado: item.exonerado || false
      };
    } 
    else if (tipoBase === "solvencia") {
      items.solvencia = {
        costo: item.costo,
        exonerado: item.exonerado || false
      };
    } 
    else if (tipoBase === "constancia") {
      if (!items.constancias) items.constancias = [];
      
      items.constancias.push({
        subtipo: item.subtipo,
        costo: item.costo,
        exonerado: item.exonerado || false,
        codigo: item.codigo
      });
    }
  });
  
  formData.append("items", JSON.stringify(items));
  
  if (solicitudJson.documentosAdjuntos && solicitudJson.documentosAdjuntos.length > 0) {
    solicitudJson.documentosAdjuntos.forEach((doc, index) => {
      if (doc instanceof File || doc instanceof Blob) {
        formData.append(`documentos[${index}]`, doc);
      }
    });
  }
  
  return formData;
};

export const useSolicitudesStore = create((set, get) => ({
  solicitudes: [],
  solicitudesPagination: {},
  loading: false,
  error: null,
  
  fetchSolicitudes: async (page = 1, pageSize = 10, filtros = {}) => {
    set({ loading: true });
    try {
      let params = `?page=${page}&page_size=${pageSize}`;
      
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params += `&${key}=${encodeURIComponent(value)}`;
        }
      });
      
      const res = await fetchSolicitudes("solicitud", params);
      set({
        solicitudes: res.data.results,
        solicitudesPagination: res.data,
        loading: false
      });
      return res.data;
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message || "Error al cargar solicitudes"
      });
      throw error;
    }
  },
  
  addSolicitud: async (solicitudJson, opcionales = {}) => {
    set({ loading: true });
    try {
      const formData = convertJsonToFormData(solicitudJson, opcionales);
      
      const response = await api.post('solicitudes/solicitud/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      set(state => ({
        solicitudes: [response.data, ...state.solicitudes],
        loading: false
      }));
      
      return response.data;
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message || "Error al crear la solicitud"
      });
      throw error;
    }
  },
  
  getSolicitudById: async (id) => {
    try {
      const res = await fetchSolicitudes(`solicitud/${id}`);
      return res.data;
    } catch (error) {
      set({ error: error.message || "Error al obtener detalles de la solicitud" });
      throw error;
    }
  },
  
  updateSolicitudStatus: async (id, nuevoEstado, observaciones = "") => {
    set({ loading: true });
    try {
      const response = await api.patch(`solicitudes/solicitud/${id}/`, {
        estado: nuevoEstado,
        observaciones: observaciones
      });
      
      set(state => ({
        solicitudes: state.solicitudes.map(sol => 
          sol.id === id ? { ...sol, estado: nuevoEstado, observaciones } : sol
        ),
        loading: false
      }));
      
      return response.data;
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message || "Error al actualizar estado de solicitud"
      });
      throw error;
    }
  }
}));