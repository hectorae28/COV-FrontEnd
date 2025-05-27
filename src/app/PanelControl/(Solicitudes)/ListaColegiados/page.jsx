"use client";
import DetalleInfo from "@/app/Components/Solicitudes/ListaColegiados/DetalleInfo";
import RegistroColegiados from "@/app/Components/Solicitudes/ListaColegiados/RegistrarColegiadoModal";
import { estados } from "@/Shared/UniversidadData";
import useDataListaColegiados from "@/store/ListaColegiadosData";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// Componentes
import DataTable from "./DataTable";
import HeaderSection from "./HeaderSection";
import MultiSelectFilter from "./MultiSelectFilter";
import Notifications from "./Notifications";
import SearchBar from "./SearchBar";
import TabSelector from "./TabSelector";

export default function ListaColegiadosPage() {
  // Estado del store de Zustand
  const initStore = useDataListaColegiados((state) => state.initStore);
  const colegiados = useDataListaColegiados((state) => state.colegiados);
  const colegiadosPagination = useDataListaColegiados(
    (state) => state.colegiadosPagination
  );
  const colegiadosPendientes = useDataListaColegiados(
    (state) => state.colegiadosPendientes
  );
  const colegiadosPendientesPagination = useDataListaColegiados(
    (state) => state.colegiadosPendientesPagination
  );
  const fetchPendientes = useDataListaColegiados(
    (state) => state.fetchPendientes
  );
  const fetchColegiados = useDataListaColegiados((state) => state.fetchColegiados);
  const loading = useDataListaColegiados((state) => state.loading);
  const getColegiado = useDataListaColegiados((state) => state.getColegiado);
  const getColegiadoPendiente = useDataListaColegiados(
    (state) => state.getColegiadoPendiente
  );
  const recaudosAnulados = useDataListaColegiados((state) => state.recaudosAnulados);
  const recaudosAnuladosPagination = useDataListaColegiados((state) => state.recaudosAnuladosPagination);
  const recaudosRechazados = useDataListaColegiados((state) => state.recaudosRechazados);
  const recaudosRechazadosPagination = useDataListaColegiados((state) => state.recaudosRechazadosPagination);
  const pendientesRevisando = useDataListaColegiados((state) => state.pendientesRevisando);
  const pendientesRevisandoPagination = useDataListaColegiados((state) => state.pendientesRevisandoPagination);
  const pendientesPorPagar = useDataListaColegiados((state) => state.pendientesPorPagar);
  const pendientesPorPagarPagination = useDataListaColegiados((state) => state.pendientesPorPagarPagination);

  // Estado local de UI
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegistro, setShowRegistro] = useState(false);
  const [vistaActual, setVistaActual] = useState("lista"); // lista, detalleColegiado, detallePendiente
  const [params, setParams] = useState({ id: null, type: null });
  const [colegiadoSeleccionadoId, setColegiadoSeleccionadoId] = useState(null);
  const [tabActivo, setTabActivo] = useState("pendientes");
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [aprobacionExitosa, setAprobacionExitosa] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordenFecha, setOrdenFecha] = useState("desc"); // desc = más nuevo primero, asc = más viejo primero
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [edadMin, setEdadMin] = useState("");
  const [edadMax, setEdadMax] = useState("");
  const [edadExacta, setEdadExacta] = useState("");

  // Fechas desde-hasta separadas
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Estado para filtros activos
  const [activeFilters, setActiveFilters] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Definir todos los filtros disponibles
  const allFilters = [
    // Estado de solvencia
    { id: "solventes", group: "Estado de solvencia", label: "Solventes", value: "solventes" },
    { id: "noSolventes", group: "Estado de solvencia", label: "No Solventes", value: "noSolventes" },
    { id: "solicitudes", group: "Estado de solvencia", label: "Con Solicitudes", value: "solicitudes" },

    // Profesiones (cambiado a Profesión/Ocupación)
    { id: "prof-odontologo", group: "Profesión/Ocupación", label: "Odontólogo", value: "odontologo" },
    { id: "prof-tecnico", group: "Profesión/Ocupación", label: "Técnico Dental", value: "tecnico" },
    { id: "prof-higienista", group: "Profesión/Ocupación", label: "Higienista", value: "higienista" },

    // Especialidad
    { id: "especialidad-armonizacion", group: "Especialidades", label: "Armonización facial", value: "Armonización facial" },
    { id: "especialidad-cirugia-bucal", group: "Especialidades", label: "Cirugía bucal", value: "Cirugía bucal" },
    { id: "especialidad-cirugia-bucomaxilofacial", group: "Especialidades", label: "Cirugía bucomaxilofacial", value: "Cirugía bucomaxilofacial" },
    { id: "especialidad-endodoncia", group: "Especialidades", label: "Endodoncia", value: "Endodoncia" },
    { id: "especialidad-ortodoncia", group: "Especialidades", label: "Ortodoncia", value: "Ortodoncia" },

    // Edad
    { id: "edad-rango", group: "Edad", label: "Edad", value: "personalizado" },

    // Estado laboral
    { id: "laborando", group: "Estado laboral", label: "Laborando", value: true },
    { id: "no-laborando", group: "Estado laboral", label: "No laborando", value: false },

    // Género
    { id: "masculino", group: "Género", label: "Masculino", value: "masculino" },
    { id: "femenino", group: "Género", label: "Femenino", value: "femenino" },
    { id: "otros", group: "Género", label: "Otros", value: "otro" },

    // Documentos
    { id: "documentos-incompletos", group: "Documentos", label: "Incompletos", value: "documentosIncompletos" },
    { id: "documentos-rechazados", group: "Documentos", label: "Rechazados", value: "documentosRechazados" },
    { id: "documentos-completos", group: "Documentos", label: "Completos", value: "documentosCompletos" },
    { id: "documentos-pendientes", group: "Documentos", label: "Pendientes por aprobar", value: "documentosPendientes" },

    // Pagos - añadido Rechazado
    { id: "pagos-pendientes", group: "Pagos", label: "Pendientes", value: "pagosPendientes" },
    { id: "pagos-exonerados", group: "Pagos", label: "Exonerados", value: "pagosExonerados" },
    { id: "pagos-rechazados", group: "Pagos", label: "Rechazados", value: "pagosRechazados" },

    // Creado por
    { id: "creado-admin", group: "Creado por", label: "Admin", value: true },
    { id: "creado-colegiado", group: "Creado por", label: "Colegiado", value: false },

    // Institución
    { id: "inst-asp", group: "Institución", label: "Agencias de Salud Pública", value: "ASP" },
    { id: "inst-caa", group: "Institución", label: "Centros de Atención Ambulatoria", value: "CAA" },
    { id: "inst-cc", group: "Institución", label: "Clínicas", value: "CC" },
    { id: "inst-cdp", group: "Institución", label: "Consultorios", value: "CDP" },
    { id: "inst-eo", group: "Institución", label: "Escuelas y Facultades de Odontología", value: "EO" },
    { id: "inst-fap", group: "Institución", label: "Fuerzas Armadas y Servicios Penitenciarios", value: "FAP" },
    { id: "inst-fmd", group: "Institución", label: "Fabricación de Materiales y Equipos Dentales", value: "FMD" },
    { id: "inst-hd", group: "Institución", label: "Hospitales", value: "HD" },
    { id: "inst-ldc", group: "Institución", label: "Laboratorio", value: "LDC" },
    { id: "inst-ot", group: "Institución", label: "Otros", value: "OT" },
    { id: "inst-pmsb", group: "Institución", label: "Programas Móviles de Salud Bucal", value: "PMSB" },
    { id: "inst-ui", group: "Institución", label: "Universidades e Institutos de Investigación", value: "UI" },

    // Universidad - simplemente ubicado antes de Ubicación en la lista
    { id: "universidad-ucv", group: "Universidad", label: "Universidad Central de Venezuela (UCV)", value: "UCV" },
    { id: "universidad-luz", group: "Universidad", label: "Universidad del Zulia (LUZ)", value: "LUZ" },
    { id: "universidad-ula", group: "Universidad", label: "Universidad de Los Andes (ULA)", value: "ULA" },
    { id: "universidad-usb", group: "Universidad", label: "Universidad Simón Bolívar (USB)", value: "USB" },
    { id: "universidad-unimet", group: "Universidad", label: "Universidad Metropolitana (UNIMET)", value: "UNIMET" },

    // Estados -> Ubicación (ahora después de Universidad)
    ...estados.map(estado => ({
      id: estado.id,
      group: "Ubicación",
      label: estado,
      value: estado
    })),
  ];

  const router = useRouter();

  const initStoreAsync = async () => {
    await initStore();
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        await initStore();
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing store:", error);
      }
    };
    initializeData();
  }, [initStore]);

  // Inicialización
  useEffect(() => {
    // Procesar parámetros de URL
    const temporalParams = window.location.search;
    const searchParams = new URLSearchParams(temporalParams);
    const paramsObject = {};
    searchParams.forEach((value, key) => {
      paramsObject[key] = value;
    });

    // Manejar parámetros de la URL para navegación directa
    if (paramsObject.id) {
      setColegiadoSeleccionadoId(paramsObject.id);

      // Determinar el tipo basado en la URL o parámetros
      if (paramsObject.type === "pendiente" || window.location.pathname.includes('/pendiente/')) {
        setVistaActual("detallePendiente");
      } else if (paramsObject.type === "colegiado" || window.location.pathname.includes('/colegiado/')) {
        setVistaActual("detalleColegiado");
      }
    }

    setParams(paramsObject);
    console.log("Parámetros guardados:", paramsObject);
  }, []);

  // Fetch de datos basado en filtros
  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    const filtros = {};

    activeFilters.forEach(filter => {
      switch (filter.group) {
        case "Estado de solvencia":
          if (filter.id === "solventes") filtros.solvencia_status = "true";
          if (filter.id === "noSolventes") filtros.solvencia_status = "false";
          if (filter.id === "solicitudes") filtros.tiene_solicitudes_pendientes = "true";
          break;

        case "Profesión/Ocupación":
          if (!filtros.profesiones) filtros.profesiones = [];
          filtros.profesiones.push(filter.value);
          break;

        case "Especialidades":
          if (!filtros.especialidades) filtros.especialidades = [];
          filtros.especialidades.push(filter.value);
          break;

        case "Edad":
          if (edadExacta) {
            filtros.edad_min = edadExacta;
            filtros.edad_max = edadExacta;
          } else {
            if (edadMin) filtros.edad_min = edadMin;
            if (edadMax) filtros.edad_max = edadMax;
          }
          break;

        case "Estado laboral":
          filtros.laborando = filter.value.toString();
          break;

        case "Género":
          filtros.genero = filter.value;
          break;

        case "Documentos":
          if (filter.id === "documentos-incompletos") filtros.documentos_completos = "false";
          if (filter.id === "documentos-rechazados") filtros.documentos_rechazados = "true";
          if (filter.id === "documentos-completos") filtros.documentos_completos = "true";
          if (filter.id === "documentos-pendientes") filtros.documentos_pendientes = "true";
          break;

        case "Pagos":
          if (filter.id === "pagos-pendientes") filtros.tiene_pago = "false";
          if (filter.id === "pagos-exonerados") filtros.pago_exonerado = "true";
          if (filter.id === "pagos-rechazados") filtros.pago_rechazado = "true";
          break;

        case "Creado por":
          filtros.user_admin_create = filter.value;
          break;

        case "Ubicación":
          if (!filtros.estados) filtros.estados = [];
          filtros.estados.push(filter.value);
          break;

        case "Universidad":
          if (!filtros.universidades) filtros.universidades = [];
          filtros.universidades.push(filter.value);
          break;

        case "Institución":
          if (!filtros.instituciones) filtros.instituciones = [];
          filtros.instituciones.push(filter.value);
          break;
      }
    });

    if (fromDate) filtros.fecha_solicitud_desde = fromDate;
    if (toDate) filtros.fecha_solicitud_hasta = toDate;

    if (filtros.profesiones) filtros.profesiones = filtros.profesiones.join(',');
    if (filtros.especialidades) filtros.especialidades = filtros.especialidades.join(',');
    if (filtros.estados) filtros.estados = filtros.estados.join(',');
    if (filtros.universidades) filtros.universidades = filtros.universidades.join(',');
    if (filtros.instituciones) filtros.instituciones = filtros.instituciones.join(',');

    filtros.ordering = ordenFecha === "desc" ? "-created_at" : "created_at";

    let shouldFetch = true;
    if (tabActivo === "pendientes") {
      filtros.status = "por_pagar,revisando";
    } else if (tabActivo === "rechazados") {
      filtros.status = "rechazado";
    } else if (tabActivo === "anulados") {
      filtros.status = "anulado";
    } else if (tabActivo === "registrados") {
      fetchColegiados(currentPage, recordsPerPage, searchTerm, filtros);
      shouldFetch = false; // Don't fetch pendientes when on the 'registrados' tab
    }

    if (tabActivo !== "registrados" && shouldFetch) {
      fetchPendientes(currentPage, recordsPerPage, searchTerm, filtros);
    }
  }, [
    currentPage,
    recordsPerPage,
    searchTerm,
    ordenFecha,
    activeFilters,
    fromDate,
    toDate,
    edadExacta,
    edadMin,
    edadMax,
    tabActivo,
    fetchColegiados,
    fetchPendientes,
  ]);

  // Funciones de navegación actualizadas
  const verDetalleColegiado = (id) => {
    setColegiadoSeleccionadoId(id);
    setVistaActual("detalleColegiado");
  };

  const verDetallePendiente = (id) => {
    setColegiadoSeleccionadoId(id);
    setVistaActual("detallePendiente");
  };

  const volverALista = (resultado = null) => {
    const temporalParams = window.location.search;
    if (temporalParams) {
      router.push("/PanelControl/ListaColegiados");
    }
    setVistaActual("lista");
    setColegiadoSeleccionadoId(null);

    // Manejar resultados específicos
    if (resultado?.aprobado) {
      setAprobacionExitosa(true);
      setTimeout(() => setAprobacionExitosa(false), 3000);
      setTabActivo("registrados");
    }
  };

  // Alternar orden de fecha para pendientes
  const toggleOrdenFecha = () => {
    setOrdenFecha((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  // Manejador para el registro exitoso de un nuevo colegiado pendiente
  const handleRegistroExitoso = () => {
    setShowRegistro(false);
    setRegistroExitoso(true);
  };

  // Manejador para cambio de tabs que ajusta los filtros
  const handleTabChange = (newTab) => {
    setTabActivo(newTab);
    setCurrentPage(1);

    if (newTab === "registrados") {
      // Eliminar filtros no aplicables a colegiados registrados
      setActiveFilters(prev => prev.filter(filter =>
        filter.group !== "Documentos"
      ));
    } else {
      // Eliminar filtros no aplicables a solicitudes
      setActiveFilters(prev => prev.filter(filter =>
        filter.group !== "Estado de solvencia" &&
        filter.group !== "Especialidades"
      ));
    }
  };

  const TypoPendiente = {
    pendientes: tabActivo === "revisando" ? pendientesRevisando : (tabActivo === "por_pagar" ? pendientesPorPagar : colegiadosPendientes),
    rechazados: recaudosRechazados,
    anulados: recaudosAnulados
  };

  const PaginationType = {
    pendientes: tabActivo === "revisando" ? pendientesRevisandoPagination : (tabActivo === "por_pagar" ? pendientesPorPagarPagination : colegiadosPendientesPagination),
    rechazados: recaudosRechazadosPagination,
    anulados: recaudosAnuladosPagination,
    registrados: colegiadosPagination
  };

  const pendientesFilter = useMemo(() => {
    return TypoPendiente[tabActivo] || [];
  }, [TypoPendiente, tabActivo]);

  const paginationFilter = useMemo(() => {
    return PaginationType[tabActivo] || {};
  }, [PaginationType, tabActivo]);

  // Renderizar vista basada en el estado actual - ACTUALIZADO
  if (vistaActual === "detalleColegiado") {
    return (
      <DetalleInfo
        params={{ id: colegiadoSeleccionadoId }}
        onVolver={volverALista}
        tipo="colegiado"
        isAdmin={true}
      />
    );
  }

  if (vistaActual === "detallePendiente" || params.type === "pendiente") {
    return (
      <DetalleInfo
        params={{ id: colegiadoSeleccionadoId || params.id }}
        onVolver={volverALista}
        tipo="pendiente"
        isAdmin={true}
      />
    );
  }

  // Vista principal de la lista
  return (
    <div className="select-none cursor-default w-full px-4 md:px-10 py-10 md:py-12">
      {/* Header con título */}
      <HeaderSection />

      {/* Notificaciones de éxito */}
      <Notifications
        registroExitoso={registroExitoso}
        setRegistroExitoso={setRegistroExitoso}
        aprobacionExitosa={aprobacionExitosa}
        setAprobacionExitosa={setAprobacionExitosa}
      />

      {/* Barra de acciones: búsqueda y botón de nuevo registro */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex gap-4 w-full md:w-auto">
          <button
            onClick={() => setShowRegistro(true)}
            className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity w-full md:w-auto justify-center"
          >
            <PlusCircle size={20} />
            <span>Registrar nuevo</span>
          </button>
        </div>
      </div>

      {/* Tabs para alternar entre colegiados y pendientes */}
      <TabSelector
        tabActivo={tabActivo}
        setTabActivo={handleTabChange}
        setCurrentPage={setCurrentPage}
        pagination={PaginationType}
      />

      {/* Sección de filtros */}
      <div className="mb-2">
        <MultiSelectFilter
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          allFilters={allFilters.filter(filter => {
            if (tabActivo === "registrados") {
              return filter.group !== "Documentos";
            } else {
              return filter.group !== "Estado de solvencia" &&
                filter.group !== "Especialidades";
            }
          })}
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          edadMin={edadMin}
          setEdadMin={setEdadMin}
          edadMax={edadMax}
          setEdadMax={setEdadMax}
          edadExacta={edadExacta}
          setEdadExacta={setEdadExacta}
        />
      </div>

      {/* Tabla de datos */}
      <DataTable
        tabActivo={tabActivo}
        loading={loading}
        colegiados={colegiados}
        colegiadosPendientes={pendientesFilter}
        verDetalleColegiado={verDetalleColegiado}
        verDetallePendiente={verDetallePendiente}
        ordenFecha={ordenFecha}
        toggleOrdenFecha={toggleOrdenFecha}
        currentPage={currentPage}
        colegiadosPagination={colegiadosPagination}
        colegiadosPendientesPagination={paginationFilter}
        setCurrentPage={setCurrentPage}
        recordsPerPage={recordsPerPage}
      />

      {/* Modal para registrar nuevo colegiado */}
      {showRegistro && (
        <RegistroColegiados
          isAdmin={true}
          onClose={() => setShowRegistro(false)}
          onRegistroExitoso={handleRegistroExitoso}
        />
      )}
    </div>
  );
}