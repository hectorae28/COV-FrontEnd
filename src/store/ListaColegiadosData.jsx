import { fetchDataUsuario, patchDataUsuario, postDataUsuario } from "@/api/endpoints/colegiado";
import { fetchSolicitudes } from "@/api/endpoints/solicitud";
import { create } from "zustand";
/*
STORE: se almacenan los datos de los colegiados para el modulo administrativo
*/

const useDataListaColegiados = create((set, get) => ({
  colegiados: [],
  colegiadosPagination: {},

  colegiadosPendientes: [],
  colegiadosPendientesPagination: {},

  pendientesRevisando: [],
  pendientesRevisandoPagination: {},

  pendientesPorPagar: [],
  pendientesPorPagarPagination: {},

  recaudosAnulados: [],
  recaudosAnuladosPagination: {},
  
  recaudosRechazados: [],
  recaudosRechazadosPagination: {},

  loading: true,
  error: null,

  async initStore() {
    set({ loading: true });
    try {
      // Fetch colegiados
      await get().fetchColegiados();
      
      // Fetch all status types in parallel
      await Promise.all([
        get().fetchPendientes(1, 10, "", { status: "revisando" }),
        get().fetchPendientes(1, 10, "", { status: "por_pagar" }),
        get().fetchPendientes(1, 10, "", { status: "anulado" }),
        get().fetchPendientes(1, 10, "", { status: "rechazado" }),
        get().fetchPendientes(1, 10, "", { status: "por_pagar,revisando" }),
      ]);

      set({ loading: false });
    } catch (error) {
      console.error("Error al cargar los datos iniciales:", error);
      set({ error: error.message || "Error al cargar los datos", loading: false });
    }
  },

  fetchPendientes: async (
    page = 1,
    pageSize = 10,
    search = "",
    otrosFiltros = {}
  ) => {
    set({ loading: true });
    try {
      let params = `?page=${page}&page_size=${pageSize}`;
      if (search) params += `&search=${encodeURIComponent(search)}`;
      Object.entries(otrosFiltros).forEach(([key, value]) => {
        if (value) params += `&${key}=${key == "status" ? value : encodeURIComponent(value)}`;
      });
      const res = await fetchDataUsuario("register", null, params);
      console.log(otrosFiltros)

      if (otrosFiltros.status === "revisando") {
        set({
          pendientesRevisando: res.data.results,
          pendientesRevisandoPagination: res.data,
          loading: false,
        });
      } else if (otrosFiltros.status === "por_pagar") {
        set({
          pendientesPorPagar: res.data.results,
          pendientesPorPagarPagination: res.data,
          loading: false,
        });
      } else if (otrosFiltros.status === "anulado") {
        set({
          recaudosAnulados: res.data.results,
          recaudosAnuladosPagination: res.data,
          loading: false,
        });
      } else if (otrosFiltros.status === "rechazado") {
        set({
          recaudosRechazados: res.data.results,
          recaudosRechazadosPagination: res.data,
          loading: false,
        });
      } else if (otrosFiltros.status === "por_pagar,revisando") {
        set({
          colegiadosPendientes: res.data.results,
          colegiadosPendientesPagination: res.data,
          loading: false,
        });
      }
    } catch (error) {
      set({
        loading: false,
        error: error.message || "Error al cargar pendientes",
      });
    }
  },

  fetchColegiados: async (
    page = 1,
    pageSize = 10,
    search = "",
    otrosFiltros = {}
  ) => {
    set({ loading: true });
    try {
      let params = `?page=${page}&page_size=${pageSize}`;
      if (search) params += `&search=${encodeURIComponent(search)}`;
      Object.entries(otrosFiltros).forEach(([key, value]) => {
        if (value) params += `&${key}=${encodeURIComponent(value)}`;
      });
      const res = await fetchDataUsuario("colegiado", null, params);
      set({
        colegiados: res.data.results,
        colegiadosPagination: res.data,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.message || "Error al cargar pendientes",
      });
    }
  },

  // Funciones para obtener datos específicos
  getColegiado: async (id) => {
    const res = await fetchDataUsuario(`colegiado/${id}`);
    return res.data;
  },

  getColegiadoPendiente: async (id) => {
    const res = await fetchDataUsuario(`register/${id}`);
    return res.data;
  },

  // Funciones para obtener colecciones específicas de cada colegiado
  getPagos: (colegiadoId) => {
    const colegiado = get().getColegiado(colegiadoId);
    return colegiado ? colegiado.pagos : [];
  },

  getSolicitudes: async (colegiadoId) => {
    const res = await fetchSolicitudes(
      "solicitud_unida",
      `?colegiado=${colegiadoId}`
    );
    //return res.data;
    return [{
      id: "1-1",
      tipo: "Constancia de inscripción",
      fecha: "10/02/2024",
      estado: "Completada",
      descripcion: "Constancia de inscripción al COV",
      urgente: false,
      monto: 20.0,
    }]
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

  updateColegiadoPendiente: async (id, updatedData, docs) => {
    set((state) => ({
      colegiadosPendientes: state.colegiadosPendientes.map((pendiente) =>
        pendiente.id === id ? { ...pendiente, ...updatedData } : pendiente
      ),
    }));

    const res = await patchDataUsuario(
      `register/${id}`,
      updatedData,
      docs
    );

    return res.data;
  },
  updateColegiadoPendienteWithToken: async (id, updatedData, docs) => {
    if (docs) {
      const formData = new FormData();
      formData.append("token", id);
      formData.append("data", {});
      for (const item of updatedData.entries()) {
        formData.append(item[0], item[1]);
      }
      const res = await patchDataUsuario("recaudos-token", formData, true);
      return res.data;
    }
    const res = await patchDataUsuario(
      `recaudos-token`,
      { token: id, data: updatedData },
      docs && docs
    );
    return res.data;
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
          const solicitudId = `${colegiadoId}-${colegiado.solicitudes.length + 1
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
  approveRegistration: async (pendienteId, datosRegistro) => {
    const pendiente = get().getColegiadoPendiente(pendienteId);
    if (!pendiente) {
      console.error("No se encontró el pendiente con ID:", pendienteId);
      return null;
    }

    // Crear un nombre completo con los datos disponibles

    postDataUsuario(`colegiado`, { ...datosRegistro, recaudos_id: pendienteId })
      .then((res) => {
        // Añadir el colegiado y eliminar el pendiente
        get().addColegiado(res.data);
        get().removeColegiadoPendiente(pendienteId);
        return res;
      })
      .catch((error) => {
        console.error("Error al aprobar la solicitud:", error);
        return error;
      });
  },

  // Funciones específicas
  marcarTituloEntregado: async (colegiadoId, entregado = true) => {
    const res = await patchDataUsuario(`colegiado/${colegiadoId}`, {
      titulo: entregado,
    });
    get().updateColegiado(colegiadoId, { titulo: entregado });
    return res.data;
  },
})
);

// Initialize the store immediately
useDataListaColegiados.getState().initStore();

export default useDataListaColegiados;