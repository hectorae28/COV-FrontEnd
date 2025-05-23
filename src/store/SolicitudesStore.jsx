// Agregar al archivo src/app/Models/PanelControl/Solicitudes/SolicitudesData.jsx

import { create } from "zustand";
import { fetchSolicitudes } from "@/api/endpoints/solicitud";
import { postDataSolicitud, patchDataSolicitud } from "@/api/endpoints/solicitud";

export const TIPOS_SOLICITUD = {
    Carnet: {
        id: "carnet",
        nombre: "Carnet",
        codigo: "CARNET",
        descripcion: "Solicitud de carnet de identificación profesional",
        documentosRequeridos: [
            { displayName: "Foto tipo carnet", campo: "foto" },
        ]
    },
    Especializacion: {
        id: "especializacion",
        nombre: "Especialización",
        codigo: "ESPEC",
        descripcion: "Registro de título de especialización odontológica",
        documentosRequeridos: [
            { displayName: "Título de Especialización", campo: "file_titulo_especializacion" },
            { displayName: "Título de Especialización (Fondo Negro)", campo: "file_fondo_negro_titulo_especializacion" },
            { displayName: "Título de Odontólogo", campo: "file_titulo_odontologo" },
            { displayName: "Título de Odontólogo (Fondo Negro)", campo: "file_fondo_negro_titulo_odontologo" },
            { displayName: "Cédula de Identidad Ampliada", campo: "file_cedula_ampliada" },
            { displayName: "Fotos tipo Carnet", campo: "file_fotos_carnet" },
            { displayName: "Comprobante de Solvencia", campo: "file_solvencia" },
            { displayName: "Carta de Solicitud", campo: "file_carta_solicitud" }
        ]
    },
    Constancia: {
        id: "constancia",
        nombre: "Constancia",
        codigo: "CONST",
        descripcion: "Constancia profesional (requiere seleccionar tipo específico)",
        documentosRequeridos: [
            { displayName: "Cédula de Identidad", campo: "file_cedula" },
        ],
        subtipos: [
            { codigo: "inscripcion_cov", nombre: "Inscripción del COV" },
            { codigo: "solvencia", nombre: "Solvencia" },
            { codigo: "libre_ejercicio", nombre: "Libre ejercicio" },
            { codigo: "declaracion_habilitacion", nombre: "Declaración de habilitación" },
            { codigo: "continuidad_laboral", nombre: "Continuidad laboral" },
            { codigo: "deontologia_odontologica", nombre: "Deontología odontológica" }
        ]
    }
};

export const convertJsonToFormData = (solicitudJson, opcionales = {}) => {
  const form = new FormData();
  
  // Basic fields
  form.append("colegiado", solicitudJson.colegiadoId);
  solicitudJson.creador?.id && form.append("user", solicitudJson.creador.id);

  // Process items and their costs
  const constancias = [];
  let costo_solicitud_carnet = 0;
  let costo_solicitud_especializacion = 0;
  let especializacion = 0;

  solicitudJson.itemsSolicitud.forEach(item => {
    if (item.tipo === "Carnet") {
      costo_solicitud_carnet = item.costo.id;
    } else if (item.tipo === "Especializacion") {
      costo_solicitud_especializacion = item.costo.id;
      especializacion = 1;
    } else if (item.tipo === "Constancia") {
      constancias.push(item.codigo);
    }
  });

  // Add processed costs
  if(solicitudJson.descripcion){
    form.append("descripcion", solicitudJson.descripcion);
  }
  if (costo_solicitud_carnet !== 0) { 
    form.append("costo_solicitud_carnet", costo_solicitud_carnet);
  }
  if (costo_solicitud_especializacion !== 0) {
    form.append("costo_solicitud_especializacion", costo_solicitud_especializacion);
  }
  if (especializacion !== 0) {
    form.append("especializacion", especializacion);
  }

  // Add constancias as JSON string
  if (constancias.length > 0) {
    form.append("solicitud_constancias", JSON.stringify({ constancias }));
  }

  // Add files
  if (solicitudJson.documentosAdjuntos) {
    Object.entries(solicitudJson.documentosAdjuntos).forEach(([key, value]) => {
      if (value instanceof File || value instanceof Blob) {
        form.append(key, value);
      } else {
        // If no file is provided, append an empty string
        form.append(key, "");
      }
    });
  }

  return form;
};

export const useSolicitudesStore = create((set, get) => ({
  solicitudes: [],
  solicitudesPagination: {},
  solicitudesAbiertas: [],
  solicitudesAbiertasPagination: {},
  solicitudesCerradas: [],
  solicitudesCerradasPagination: {},
  pagosSolicitud:[],
  tipos_solicitud: TIPOS_SOLICITUD,
  loading: false,
  error: null,

  initStore: async () => {
    await get().fetchTiposSolicitud();
    await get().fetchSolicitudes("cerrada");
    await get().fetchSolicitudes("abierta");
    await get().fetchSolicitudes(null);
  },
  
  fetchTiposSolicitud: async () => {
    set({ loading: true });
    try {
      const response = await fetchSolicitudes('costo',"?es_vigente=true");
      const costos = response.data;
      
      const tiposActualizados = { ...TIPOS_SOLICITUD };
      
      const costoCarnet = costos.find(c => c.tipo_costo_nombre === "Carnet");
      if (costoCarnet) {
        tiposActualizados.Carnet.costo = {id: costoCarnet.id, monto:parseFloat(costoCarnet.monto_usd)};
      }
      
      const costoEspecializacion = costos.find(c => c.tipo_costo_nombre === "Especialidad");
      if (costoEspecializacion) {
        tiposActualizados.Especializacion.costo = {id: costoCarnet.id, monto:parseFloat(costoEspecializacion.monto_usd)};
      }
      
      tiposActualizados.Constancia.subtipos = tiposActualizados.Constancia.subtipos.map(subtipo => {
        const costo = costos.find(c => {
          const backendCodigo = c.tipo_costo_nombre.replace('constancia_', '');
          return backendCodigo === subtipo.codigo;
        });
        
        return {
          ...subtipo,
          costo: costo ? {id: costoCarnet.id, monto:parseFloat(costo.monto_usd)} : {id: 0, monto:0}
        };
      });
      
      set({ 
        tipos_solicitud: tiposActualizados,
        loading: false 
      });
      
      return tiposActualizados;
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message || "Error al cargar los tipos de solicitud"
      });
      throw error;
    }
  },
  
  fetchSolicitudes: async (estado,page = 1, pageSize = 10, filtros = {}) => {
    set({ loading: true });
    try {
      let params = `?page=${page}&page_size=${pageSize}${estado && `&status=${estado}`}`;
      
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params += `&${key}=${encodeURIComponent(value)}`;
        }
      });
      
      const res = await fetchSolicitudes("solicitud_unida", params);
      if (estado === "cerrada") {
        set({
          solicitudesCerradas: res.data.results,
          solicitudesCerradasPagination: res.data,
          loading: false
        });
        return res.data;
      }else if(estado === "abierta"){
        set({
          solicitudesAbiertas: res.data.results,
          solicitudesAbiertasPagination: res.data,
          loading: false
        });
        return res.data;
      }else{
        set({
          solicitudes: res.data.results,
          solicitudesPagination: res.data,
          loading: false
        });
        return res.data;
      }
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message || "Error al cargar solicitudes"
      });
      throw error;
    }
  },

  getSolicitudById: async (id) => {
    try {
      const res = await fetchSolicitudes(`solicitud_unida/${id}`);
      get().getPagosSolicitud(id);
      return res.data;
    } catch (error) {
      set({ error: error.message || "Error al obtener detalles de la solicitud" });
      throw error;
    }
  },
  
  addSolicitud: async (solicitudJson, opcionales = {}) => {
    set({ loading: true });
    try {
      const formData = convertJsonToFormData(solicitudJson, opcionales);
      
      const response = await postDataSolicitud('solicitud', formData);
      const solicitud = await get().getSolicitudById(response.data.id);
      
      set(state => ({
        solicitudes: [solicitud, ...state.solicitudes],
        loading: false
      }));
      
      return solicitud;
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message || "Error al crear la solicitud"
      });
      throw error;
    }
  },
  
  updateSolicitudStatus: async (id, nuevoEstado, observaciones = "") => {
    set({ loading: true });
    try {
      const response = await patchDataSolicitud(`solicitud/${id}`, {
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
  },
  updateDocumentoSolicitud: async (id, updatedData) => {
    set({ loading: true });
    try {
      const res = await patchDataSolicitud(
        `solicitud/${id}`,
        updatedData,
      );
  
      return res.data;
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message || "Error al actualizar estado de documento de solicitud"
      });
      throw error;
    }
  },
  // PAGOS
  getPagosSolicitud: async (id) => {
    set({ loading: true });
    try {
      const res = await fetchSolicitudes(`pago`,"?solicitud="+id);

      set({
        pagosSolicitud: res.data,
        loading: false
      })
      return res.data;
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message || "Error al cargar los pagos de la solicitud"
      });
      throw error;
    }
  },

  addPagosSolicitud : async(id, pago) => {
    set({ loading: true });
    try {
      const Form = new FormData();
      Form.append("solicitud", Number(id));
      Form.append("monto", pago.monto);
      Form.append("moneda", pago.moneda);
      Form.append("num_referencia", pago.num_referencia);
      Form.append("metodo_de_pago", pago.metodo_de_pago);
      Form.append("tasa_bcv_del_dia", pago.tasa_bcv_del_dia);
      
      if (pago.comprobante) {
        Form.append("comprobante", pago.comprobante);
      }
      
      if (pago.fecha_pago) {
        Form.append("fecha_pago", pago.fecha_pago);
      }
  
      const res = await postDataSolicitud("pagos-solicitud", Form);
      get().getPagosSolicitud(id);
      
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message || "Error al crear el pago"
      });
      throw error;
    }
  }
}));