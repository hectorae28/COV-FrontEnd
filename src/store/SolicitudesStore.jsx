// src/app/Models/PanelControl/Solicitudes/SolicitudesData.jsx

import {
  fetchSolicitudes,
  postDataSolicitud,
  postDataSolicitudJSON,
  patchDataSolicitud,
  getCostos,
  pagoSolvencia,
  pagoSolvenciaEspecial,
  solicitarSolvencia,
  solicitarPagosSolvencia,
  obtenerDatosSolvenciaCompletos,
  obtenerHistorialPagosSolvencia,
  actualizarEstadoPago,
} from "@/api/endpoints/solicitud";
import transformBackendData from "@/utils/formatDataSolicitudes";
import { create } from "zustand";

export const TIPOS_SOLICITUD = {
  Carnet: {
    id: "carnet",
    nombre: "Carnet",
    codigo: "CARNET",
    descripcion: "Solicitud de carnet de identificación profesional",
    documentosRequeridos: [
      // Asegúrate que el backend acepta ambos nombres de campo:
      { displayName: "Foto tipo carnet", campo: "file_foto" },
      // { displayName: "Foto tipo carnet", campo: "foto" }, // <-- si tu backend acepta solo uno, comenta el otro.
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
      // { codigo: "inscripcion_cov", nombre: "Inscripción del COV" },
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

  // Procesamiento de items
  const constancias = [];
  let costo_solicitud_carnet = 0;
  let costo_solicitud_especializacion = 0;
  let especializacion = 0;

  if (solicitudJson.itemsSolicitud && Array.isArray(solicitudJson.itemsSolicitud)) {
    solicitudJson.itemsSolicitud.forEach(item => {
      if (item.tipo === "Carnet") {
        costo_solicitud_carnet = item.costo?.id || item.costo || 0;
      } else if (item.tipo === "Especializacion") {
        costo_solicitud_especializacion = item.costo?.id || item.costo || 0;
        especializacion = item.especializacionId || item.id || 0;
      } else if (item.tipo === "Constancia") {
        constancias.push({ code: item.codigo, institucion: item?.institucionId });
      }
    });
  }

  // Descripción opcional
  if (solicitudJson.descripcion) {
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

  // Constancias en formato JSON
  if (constancias.length > 0) {
    form.append("solicitud_constancias", JSON.stringify({ constancias }));
  }

  // Adjuntar archivos
  if (solicitudJson.documentosAdjuntos) {
    Object.entries(solicitudJson.documentosAdjuntos).forEach(([key, value]) => {
      if (value instanceof File || value instanceof Blob) {
        form.append(key, value);
      } else {
        form.append(key, "");
      }
    });
  }

  return form;
};

export const formatSolicitudSolvencia = (solicitud) => {
  return {
          idColegiado: solicitud.id,
          idSolicitudSolvencia: solicitud.solicitudes_solvencia.lista[0].id,
          nombreColegiado: solicitud.nombre,
          statusSolvencia: solicitud.solvencia_status,
          statusSolicitud: solicitud.solicitudes_solvencia.lista[0].status,
          fechaSolicitud: solicitud.solicitudes_solvencia.lista[0].fecha_solicitud,
          costoRegularSolicitud: solicitud.solicitudes_solvencia.lista[0].detalles.costo_regular,
          costoEspecialSolicitud: solicitud.solicitudes_solvencia.lista[0].detalles.costo_especial,
          fechaExpSolicitud: solicitud.solicitudes_solvencia.lista[0].fecha_expiracion,
          fechaExpSolvencia: solicitud.solicitudes_solvencia.lista[0].detalles.fecha_exp_solvencia,
          modeloSolvencia: solicitud.solicitudes_solvencia.lista[0].detalles.modelo_solvencia,
          adminCreador: solicitud.solicitudes_solvencia.lista[0].user_admin_create,
          fechaRechazo: solicitud.solicitudes_solvencia.lista[0].fecha_rechazo,
          adminActualizador: solicitud.solicitudes_solvencia.lista[0].user_admin_update,
          fechaAprobacion: solicitud.solicitudes_solvencia.lista[0].fecha_aprobacion,
          fechaExoneracion: solicitud.solicitudes_solvencia.lista[0].fecha_exoneracion,
          motivoExoneracion: solicitud.solicitudes_solvencia.lista[0].motivo_exoneracion,
          tipo: solicitud.solicitudes_solvencia.lista[0].tipo,
          pagos: solicitud.solicitudes_solvencia.lista[0].pagos || [],
          detalles: {
            costo_regular: solicitud.solicitudes_solvencia.lista[0].detalles.costo_regular,
            costo_especial: solicitud.solicitudes_solvencia.lista[0].detalles.costo_especial,
            fecha_exp_solvencia: solicitud.solicitudes_solvencia.lista[0].detalles.fecha_exp_solvencia,
            modelo_solvencia: solicitud.solicitudes_solvencia.lista[0].detalles.modelo_solvencia,
            creador: {
              nombre_creador: solicitud.solicitudes_solvencia.lista[0].detalles.creador.nombre_creador,
              id_creador: solicitud.solicitudes_solvencia.lista[0].detalles.creador.id_creador,
              is_admin: solicitud.solicitudes_solvencia.lista[0].detalles.creador.is_admin,
            }
          },
          creador: {
            nombreCreador: solicitud.solicitudes_solvencia.lista[0].detalles.creador.nombre_creador,
            idCreador: solicitud.solicitudes_solvencia.lista[0].detalles.creador.id_creador,
            isAdmin: solicitud.solicitudes_solvencia.lista[0].detalles.creador.is_admin,
          }
        }
}
export const useSolicitudesStore = create((set, get) => ({
  solicitudes: [],
  solicitudesPagination: {},
  solicitudesAbiertas: [],
  solicitudesAbiertasPagination: {},
  solicitudesCerradas: [],
  solicitudesCerradasPagination: {},
  solicitudSeleccionada: null,
  pagosSolicitud: [],
  solicitudesDeSolvencia: [],
  solicitudesDeSolvenciaPagination: {},
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
      // Fetch costos
      const responseCostos = await fetchSolicitudes('costo', "?es_vigente=true");
      const costos = responseCostos.data;

      // Fetch especializaciones
      const responseEspecializaciones = await fetchSolicitudes('especializacion');
      const especializaciones = responseEspecializaciones.data;

      const tiposActualizados = { ...TIPOS_SOLICITUD };

      // Asegurar que cada tipo tenga la estructura mínima requerida
      Object.keys(tiposActualizados).forEach(tipoKey => {
        const tipo = tiposActualizados[tipoKey];
        if (!tipo.costo) {
          tipo.costo = { id: 0, monto: 0 };
        }
        if (!tipo.codigo) {
          tipo.codigo = tipoKey.toUpperCase();
        }
        if (!tipo.nombre) {
          tipo.nombre = tipoKey;
        }
      });

      const costoCarnet = costos.find(c => c.tipo_costo_nombre === "Carnet");
      if (costoCarnet) {
        tiposActualizados.Carnet.costo = { id: costoCarnet.id, monto: parseFloat(costoCarnet.monto_usd) };
      }

      const costoEspecializacion = costos.find(c => c.tipo_costo_nombre === "Especialidad");
      if (costoEspecializacion) {
        tiposActualizados.Especializacion.costo = { id: costoEspecializacion.id, monto: parseFloat(costoEspecializacion.monto_usd) };
      }

      // Agregar especializaciones disponibles
      if (especializaciones) {
        tiposActualizados.Especializacion.especializaciones = Object.entries(especializaciones).map(([key, esp]) => ({
          id: esp.id,
          codigo: key,
          nombre: esp.title,
          descripcion: esp.description,
          color: esp.color,
          imagen: esp.image,
          icono: esp.icon
        }));
      }

      // Asegurar que los subtipos de constancia tengan estructura válida
      if (tiposActualizados.Constancia && tiposActualizados.Constancia.subtipos) {
        tiposActualizados.Constancia.subtipos = tiposActualizados.Constancia.subtipos.map(subtipo => {
          // Asegurar estructura mínima
          const subtipoConDefaults = {
            codigo: subtipo.codigo || "constancia",
            nombre: subtipo.nombre || "Constancia",
            costo: { id: 0, monto: 0 },
            ...subtipo
          };

          const costo = costos.find(c => {
            const backendCodigo = c.tipo_costo_nombre.replace('constancia_', '');
            return backendCodigo === subtipo.codigo;
          });

          return {
            ...subtipoConDefaults,
            costo: costo ? { id: costo?.id, monto: parseFloat(costo.monto_usd) } : { id: 0, monto: 0 }
          };
        });
      }

      set({
        tipos_solicitud: tiposActualizados,
        loading: false
      });

      return tiposActualizados;
    } catch (error) {
      console.error("Error cargando tipos de solicitud desde API:", error);
      
      // En caso de error, asegurar que tenemos al menos la estructura básica
      const tiposConDefaults = { ...TIPOS_SOLICITUD };
      Object.keys(tiposConDefaults).forEach(tipoKey => {
        const tipo = tiposConDefaults[tipoKey];
        if (!tipo.costo) {
          tipo.costo = { id: 0, monto: 0 };
        }
        if (!tipo.codigo) {
          tipo.codigo = tipoKey.toUpperCase();
        }
        if (!tipo.nombre) {
          tipo.nombre = tipoKey;
        }
      });

      // Asegurar subtipos de constancia
      if (tiposConDefaults.Constancia && tiposConDefaults.Constancia.subtipos) {
        tiposConDefaults.Constancia.subtipos = tiposConDefaults.Constancia.subtipos.map(subtipo => ({
          codigo: subtipo.codigo || "constancia",
          nombre: subtipo.nombre || "Constancia",
          costo: { id: 0, monto: 0 },
          ...subtipo
        }));
      }

      set({
        tipos_solicitud: tiposConDefaults,
        loading: false,
        error: error.message || "Error al cargar los tipos de solicitud"
      });
      
      // No re-lanzar el error para permitir que la app continúe funcionando
      return tiposConDefaults;
    }
  },

  fetchSolicitudes: async (estado, page = 1, pageSize = 10, filtros = {}) => {
    set({ loading: true });
    try {
      let params = `?page=${page}&page_size=${pageSize}${estado ? `&status=${estado}` : ""}`;

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
      } else if (estado === "abierta") {
        set({
          solicitudesAbiertas: res.data.results,
          solicitudesAbiertasPagination: res.data,
          loading: false
        });
        return res.data;
      } else {
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
      set({ error:res });
      await get().getPagosSolicitud(id);
      set({ solicitudSeleccionada: transformBackendData(res.data) });
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
      
      // Verificar si hay items exonerados y usar el nuevo endpoint de exoneración
      const itemsExonerados = solicitudJson.itemsSolicitud?.filter(item => item.exonerado) || [];
      
      if (itemsExonerados.length > 0) {
        const itemsParaExonerar = itemsExonerados.map(item => {
          let tipo = "";
          if (item.tipo === "Carnet") {
            tipo = "carnet";
          } else if (item.tipo === "Especializacion") {
            tipo = "especializacion"; 
          } else if (item.tipo === "Constancia") {
            tipo = "constancia";
          }
          
          return {
            tipo: tipo,
            motivo: "Exoneración aplicada durante la creación de solicitud"
          };
        });
        
        if (itemsParaExonerar.length > 0) {
          await postDataSolicitudJSON(`solicitud/${response.data.id}/exonerar-items/`, {
            items_exonerados: itemsParaExonerar
          });
        }
      }
      
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

  updateSolicitudStatus: async (id, solicitudActualizada, observaciones = "") => {
    set({ loading: true });
    try {
      const res = await postDataSolicitud(`solicitud/${id}/cambiar-status/`, {solicitudes:solicitudActualizada})

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
      await get().getSolicitudById(id);
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
      const res = await fetchSolicitudes(`pago`, "?solicitud=" + id);
      set({
        pagosSolicitud: res.data,
        loading: false
      });
      return res.data;
    } catch (error) {
      set({
        loading: false,
        error: error.message || "Error al cargar los pagos de la solicitud"
      });
      throw error;
    }
  },

  addPagosSolicitud: async (id, pago) => {
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

      await postDataSolicitud("pagos-solicitud", Form);
      await get().getPagosSolicitud(id);

    } catch (error) {
      set({
        loading: false,
        error: error.message || "Error al crear el pago"
      });
      throw error;
    }
  },

  // SOLICITUDES DE SOLVENCIA (de la versión "Copy", mejora para nuevas features)
  fetchSolicitudesDeSolvencia: async (page = 1, pageSize = 10, filtros = {}) => {
    set({ loading: true });
    try {
      let params = `?page=${page}&page_size=${pageSize}`;
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params += `&${key}=${encodeURIComponent(value)}`;
        }
      });
      const res = await fetchSolicitudes("list_solicitud_solvencias", params);
      const solicitudesOrdenadas = [];
      res.data.results.forEach((solicitud) => {
        solicitudesOrdenadas.push(formatSolicitudSolvencia(solicitud));
      });
      set({
        solicitudesDeSolvencia: solicitudesOrdenadas,
        solicitudesDeSolvenciaPagination: res.data,
        loading: false
      });
    } catch (error) {
      set({
        loading: false,
        error: error.message || "Error al cargar solicitudes de solvencia"
      });
      
      // Si es error 403, configurar una lista vacía pero no fallar
      if (error.response?.status === 403) {
        console.log("Error 403: No se tienen permisos para acceder a las solicitudes de solvencia");
        set({
          solicitudesDeSolvencia: [],
          solicitudesDeSolvenciaPagination: { results: [], count: 0 },
          loading: false,
          error: null // No mostrar error para 403
        });
      } else {
        throw error;
      }
    }
  },

  setSolicitudesDeSolvencia: (solicitudes) => {
    set({ solicitudesDeSolvencia: solicitudes });
  },

  getSolicitudSolvencia: (id) => {
    return get().solicitudesDeSolvencia.find(sol => sol.idSolicitudSolvencia === id);
  },

  // Nueva función específica para exonerar items
  exonerarItems: async (solicitudId, itemsExonerados) => {
    set({ loading: true });
    try {
      const response = await postDataSolicitudJSON(`solicitud/${solicitudId}/exonerar-items/`, {
        items_exonerados: itemsExonerados
      });
      
      // Refrescar la solicitud para obtener el estado actualizado
      await get().getSolicitudById(solicitudId);
      
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({
        loading: false,
        error: error.message || "Error al exonerar items"
      });
      throw error;
    }
  },

  // Función para obtener información de exoneración
  getItemsExonerados: async (solicitudId) => {
    try {
      const solicitud = await get().getSolicitudById(solicitudId);
      return solicitud?.items_exonerados || {};
    } catch (error) {
      console.error("Error al obtener items exonerados:", error);
      return {};
    }
  },
}));

