import { create } from "zustand";
import { colegiados } from "./SolicitudesData";
import { fetchDataUsuario } from "@/api/endpoints/colegiado";

const useDataListaColegiados = create((set, get) => ({
  colegiados: [],
  colegiadosPendientes: [],
  colegiadosPendientesPagination: {},

  loading: true,
  error: null,

  async initStore() {
    try {
      const colegiadosResponse = await fetchDataUsuario("colegiado");
      set({ colegiados: colegiadosResponse.data });

      const pendientesResponse = await fetchDataUsuario("register");
      set({ colegiadosPendientes: pendientesResponse.data.results });
      set({ colegiadosPendientesPagination: pendientesResponse.data });
    } catch (error) {
      console.error("Error al cargar los datos iniciales:", error);
      set({ error: error.message || "Error al cargar los datos" });
    } finally {
      set({ loading: false });
    }
  },

  fetchPendientes: async (page = 1, pageSize = 10, search = "", otrosFiltros = {}) => {
    set({ loading: true });
    try {
      let params = `?page=${page}&page_size=${pageSize}`;
      if (search) params += `&search=${encodeURIComponent(search)}`;
      Object.entries(otrosFiltros).forEach(([key, value]) => {
        if (value) params += `&${key}=${encodeURIComponent(value)}`;
      });
      const res = await fetchDataUsuario("register", null, params);
      set({
        colegiadosPendientes: res.data.results,
        colegiadosPendientesPagination: res.data,
        loading: false,
      });
    } catch (error) {
      set({ loading: false, error: error.message || "Error al cargar pendientes" });
    }
  },

  // Funciones para obtener datos específicos
  getColegiado: (id) => {
    return get().colegiados.find((col) => col.id === id) || null;
  },

  getColegiadoPendiente: (id) => {
    return get().colegiadosPendientes.find((pend) => pend.id === id) || null;
  },

  // Funciones para obtener colecciones específicas de cada colegiado
  getPagos: (colegiadoId) => {
    const colegiado = get().getColegiado(colegiadoId);
    return colegiado ? colegiado.pagos : [];
  },

  getSolicitudes: (colegiadoId) => {
    const colegiado = get().getColegiado(colegiadoId);
    return colegiado ? colegiado.solicitudes : [];
  },

  getDocumentos: (colegiadoId) => {
    const colegiado = get().getColegiado(colegiadoId);
    return colegiado ? colegiado.documentos : [];
  },

  getDocumentosPendiente: (pendienteId) => {
    const pendiente = get().getColegiadoPendiente(pendienteId);
    return pendiente ? pendiente.documentos : [];
  },

  // Funciones para añadir nuevas entidades
  addColegiado: (nuevoColegiado) => {
    set((state) => ({
      colegiados: [
        ...state.colegiados,
        {
          ...nuevoColegiado,
          pagos: nuevoColegiado.pagos || [],
          solicitudes: nuevoColegiado.solicitudes || [],
          documentos: nuevoColegiado.documentos || [],
        },
      ],
    }));
    return nuevoColegiado;
  },

  addColegiadoPendiente: (nuevoPendiente) => {
    set((state) => ({
      colegiadosPendientes: [...state.colegiadosPendientes, nuevoPendiente],
    }));
    return nuevoPendiente;
  },

  // Funciones para actualizar entidades
  updateColegiado: (id, updatedData) => {
    set((state) => ({
      colegiados: state.colegiados.map((colegiado) =>
        colegiado.id === id ? { ...colegiado, ...updatedData } : colegiado
      ),
    }));

    return get().getColegiado(id);
  },

  updateColegiadoPendiente: (id, updatedData) => {
    set((state) => ({
      colegiadosPendientes: state.colegiadosPendientes.map((pendiente) =>
        pendiente.id === id ? { ...pendiente, ...updatedData } : pendiente
      ),
    }));

    return get().getColegiadoPendiente(id);
  },

  // Funciones para eliminar entidades
  removeColegiadoPendiente: (id) => {
    set((state) => ({
      colegiadosPendientes: state.colegiadosPendientes.filter(
        (pendiente) => pendiente.id !== id
      ),
    }));
  },

  // Funciones para añadir elementos a las colecciones de un colegiado
  addPago: (colegiadoId, nuevoPago) => {
    set((state) => ({
      colegiados: state.colegiados.map((colegiado) => {
        if (colegiado.id === colegiadoId) {
          const pagoId = `${colegiadoId}-${colegiado.pagos.length + 1}`;
          return {
            ...colegiado,
            pagos: [
              ...colegiado.pagos,
              {
                id: pagoId,
                ...nuevoPago,
              },
            ],
          };
        }
        return colegiado;
      }),
    }));

    // Actualizar estado de solvencia si es necesario
    const colegiado = get().getColegiado(colegiadoId);
    if (
      colegiado &&
      !colegiado.solvente &&
      nuevoPago.concepto &&
      nuevoPago.concepto.toLowerCase().includes("cuota") &&
      nuevoPago.estado === "Pagado"
    ) {
      get().updateColegiado(colegiadoId, { solvente: true });
    }

    return get().getPagos(colegiadoId);
  },

  addSolicitud: (colegiadoId, nuevaSolicitud) => {
    set((state) => ({
      colegiados: state.colegiados.map((colegiado) => {
        if (colegiado.id === colegiadoId) {
          const solicitudId = `${colegiadoId}-${
            colegiado.solicitudes.length + 1
          }`;
          return {
            ...colegiado,
            solicitudes: [
              ...colegiado.solicitudes,
              {
                id: solicitudId,
                ...nuevaSolicitud,
              },
            ],
          };
        }
        return colegiado;
      }),
    }));

    return get().getSolicitudes(colegiadoId);
  },

  // Funciones para gestionar el registro de colegiados
  approveRegistration: (pendienteId, datosRegistro) => {
    const pendiente = get().getColegiadoPendiente(pendienteId);
    if (!pendiente) {
      console.error("No se encontró el pendiente con ID:", pendienteId);
      return null;
    }

    // Crear un nombre completo con los datos disponibles
    const nombreCompleto = `${pendiente.persona.nombre} ${
      pendiente.persona.segundo_nombre || ""
    } ${pendiente.persona.primer_apellido} ${
      pendiente.persona.segundo_apellido || ""
    }`.trim();

    // Obtener la sesión actual del store
    const session = get().session;

    // Crear el nuevo colegiado a partir de los datos del pendiente
    const nuevoColegiado = {
      id: `cov-${Date.now()}`,
      nombre: nombreCompleto,
      cedula: `${pendiente.persona.nacionalidad}-${pendiente.persona.identificacion}`,
      numeroRegistro:
        datosRegistro.num_cov ||
        `ODV-${Math.floor(1000 + Math.random() * 9000)}`,
      email: pendiente.persona.correo,
      telefono: pendiente.persona.telefono_movil,
      fechaRegistro: new Date().toLocaleDateString(),
      estado: "Activo",
      solvente: true,
      especialidad: datosRegistro.tipo_profesion || "Odontología General",

      // Datos detallados
      persona: pendiente.persona,
      instituto_bachillerato: pendiente.instituto_bachillerato,
      universidad: pendiente.universidad,
      fecha_egreso_universidad: pendiente.fecha_egreso_universidad,
      num_registro_principal: pendiente.num_registro_principal,
      fecha_registro_principal: pendiente.fecha_registro_principal,
      num_mpps: pendiente.num_mpps,
      fecha_mpps: pendiente.fecha_mpps,
      instituciones: pendiente.instituciones || [],

      // Archivos
      file_ci: pendiente.file_ci,
      file_rif: pendiente.file_rif,
      file_fondo_negro: pendiente.file_fondo_negro,
      file_mpps: pendiente.file_mpps,

      // Valores por defecto
      carnetVigente: true,
      carnetVencimiento: new Date(
        new Date().setFullYear(new Date().getFullYear() + 2)
      ).toLocaleDateString(),
      tituloEntregado: false,

      // Colecciones
      pagos: [],
      solicitudes: [],
      documentos: pendiente.documentos || [],

      // Estadísticas iniciales
      estadisticas: {
        solicitudesMes: 0,
        inscripcionesMes: 0,
        asistenciaEventos: 0,
        pagosPendientes: 0,
        ultimoAcceso: "Hoy",
      },

      // Información del creador original (del registro pendiente)
      creador: pendiente.creador,

      // Información de quien aprobó el registro
      aprobadoPor: session
        ? {
            username: session.user?.username || "admin",
            email: session.user?.email || "admin@cov.com",
            fecha: new Date().toISOString(),
            esAdmin: session.user?.role === "admin" || false,
          }
        : null,
    };

    // Añadir el colegiado y eliminar el pendiente
    get().addColegiado(nuevoColegiado);
    get().removeColegiadoPendiente(pendienteId);

    return nuevoColegiado;
  },

  // Funciones específicas
  marcarTituloEntregado: (colegiadoId, entregado = true) => {
    return get().updateColegiado(colegiadoId, { tituloEntregado: entregado });
  },
}));

export default useDataListaColegiados;
