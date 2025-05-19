"use client";
import DetalleColegiado from "@/app/Components/Solicitudes/ListaColegiados/DetalleColegiado";
import DetallePendiente from "@/app/Components/Solicitudes/ListaColegiados/DetallePendiente";
import RegistroColegiados from "@/app/Components/Solicitudes/ListaColegiados/RegistrarColegiadoModal";
import { estados } from "@/Shared/UniversidadData";
import useDataListaColegiados from "@/store/ListaColegiadosData";
import { useSolicitudesStore } from "@/store/SolicitudesStore";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Componentes
import DataTable from "./DataTable";
import HeaderSection from "./HeaderSection";
import MultiSelectFilter from "./MultiSelectFilter";
import Notifications from "./Notifications";
import SearchBar from "./SearchBar";
import TabSelector from "./TabSelector";

export default function ListaColegiadosPage() {
  // Estado del store de Zustand
  const initStore = useSolicitudesStore((state) => state.initStore);
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

  // Definir todos los filtros disponibles
  // Definir todos los filtros disponibles - reorganizados
  // Definir todos los filtros disponibles - reorganizados correctamente
const allFilters = [
  // Estado de solvencia
  { id: "solventes", group: "Estado de solvencia", label: "Solventes", value: "solventes" },
  { id: "noSolventes", group: "Estado de solvencia", label: "No Solventes", value: "noSolventes" },
  { id: "solicitudes", group: "Estado de solvencia", label: "Con Solicitudes", value: "solicitudes" },

  // Profesiones
  { id: "prof-odontologo", group: "Profesiones", label: "Odontólogo", value: "Odontólogo" },
  { id: "prof-tecnico", group: "Profesiones", label: "Técnico Dental", value: "Técnico Dental" },
  { id: "prof-higienista", group: "Profesiones", label: "Higienista", value: "Higienista" },
  
  // Especialidad
  { id: "especialidad-armonizacion", group: "Especialidades", label: "Armonización facial", value: "Armonización facial" },
  { id: "especialidad-cirugia-bucal", group: "Especialidades", label: "Cirugía bucal", value: "Cirugía bucal" },
  { id: "especialidad-cirugia-bucomaxilofacial", group: "Especialidades", label: "Cirugía bucomaxilofacial", value: "Cirugía bucomaxilofacial" },
  { id: "especialidad-endodoncia", group: "Especialidades", label: "Endodoncia", value: "Endodoncia" },
  { id: "especialidad-ortodoncia", group: "Especialidades", label: "Ortodoncia", value: "Ortodoncia" },

  // Edad
  { id: "edad-rango", group: "Edad", label: "Edad", value: "personalizado" },

  // Estado laboral
  { id: "laborando", group: "Estado laboral", label: "Laborando", value: "laborando" },
  { id: "no-laborando", group: "Estado laboral", label: "No laborando", value: "no-laborando" },

  // Género
  { id: "masculino", group: "Género", label: "Masculino", value: "M" },
  { id: "femenino", group: "Género", label: "Femenino", value: "F" },
  { id: "otros", group: "Género", label: "Otros", value: "O" },

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
  { id: "creado-admin", group: "Creado por", label: "Admin", value: "admin" },
  { id: "creado-colegiado", group: "Creado por", label: "Colegiado", value: "colegiado" },

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
    id: `ubicacion-${estado.toLowerCase().replace(/\s+/g, '-')}`,
    group: "Ubicación",
    label: estado,
    value: estado
  })),
];

  const router = useRouter();
  const initStoreAsync = async () => {
    await initStore();
  }

  useEffect(() => {
    initStoreAsync();
  }, []);

  // Inicialización
  useEffect(() => {
    // Procesar parámetros de URL
    const temporalParams = window.location.search;
    const searchParams = new URLSearchParams(temporalParams);
    const paramsObject = {};
    searchParams.forEach((value, key) => {
      paramsObject[key] = value;
    });

    setParams(paramsObject);
    setColegiadoSeleccionadoId(paramsObject.id);
    console.log("Parámetros guardados:", paramsObject);
  }, []);

  // Fetch de datos basado en filtros
  useEffect(() => {
    const filtros = {};

    // Procesar los filtros activos
    activeFilters.forEach(filter => {
      switch (filter.group) {
        case "Estado de solvencia":
          if (filter.id === "solventes") filtros.solvencia_status = "true";
          if (filter.id === "noSolventes") filtros.solvencia_status = "false";
          if (filter.id === "solicitudes") filtros.tiene_solicitudes_pendientes = "true";
          break;

        case "Profesiones":
          if (!filtros.profesiones) filtros.profesiones = [];
          filtros.profesiones.push(filter.value);
          break;

        case "Especialidades":
          if (!filtros.especialidades) filtros.especialidades = [];
          filtros.especialidades.push(filter.value);
          break;

        case "Edad":
          const [min, max] = filter.value.split("-");
          if (min) filtros.edad_min = min;
          if (max && max !== "") filtros.edad_max = max;
          break;

        case "Estado laboral":
          filtros.laborando = filter.id === "laborando" ? "true" : "false";
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
          filtros.creado_por = filter.value;
          break;

        case "Ubicación":
          if (!filtros.estados) filtros.estados = [];
          filtros.estados.push(filter.value);
          break;

        case "Municipio":
          if (!filtros.municipios) filtros.municipios = [];
          filtros.municipios.push(filter.value);
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

    // Añadir fechas desde-hasta
    if (fromDate) filtros.fecha_solicitud_desde = fromDate;
    if (toDate) filtros.fecha_solicitud_hasta = toDate;

    // Si hay arrays, convertirlos a strings separados por comas
    if (filtros.profesiones) filtros.profesiones = filtros.profesiones.join(',');
    if (filtros.especialidades) filtros.especialidades = filtros.especialidades.join(',');
    if (filtros.estados) filtros.estados = filtros.estados.join(',');
    if (filtros.municipios) filtros.municipios = filtros.municipios.join(',');
    if (filtros.universidades) filtros.universidades = filtros.universidades.join(',');
    if (filtros.instituciones) filtros.instituciones = filtros.instituciones.join(',');

    // Añadir ordenamiento por fecha
    filtros.ordering = ordenFecha === "desc" ? "-created_at" : "created_at";

    // Filtrar según el tab activo
    if (tabActivo === "pendientes") {
      filtros.status = "revisando";
    } else if (tabActivo === "rechazados") {
      filtros.status = "rechazado";
    } else if (tabActivo === "anulados") {
      filtros.status = "denegado";
    }

    console.log({ filtros, tabActivo });

    // Ejecutar la función fetch adecuada
    if (tabActivo === "registrados") {
      fetchColegiados(currentPage, recordsPerPage, searchTerm, filtros);
    } else {
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
    tabActivo,
  ]);

  // Funciones de navegación
  const verDetalleColegiado = (id) => {
    setColegiadoSeleccionadoId(id);
    setVistaActual("detalleColegiado");
  };

  const verDetallePendiente = (id) => {
    setColegiadoSeleccionadoId(id);
    setVistaActual("detallePendiente");
  };

  const volverALista = () => {
    const temporalParams = window.location.search;
    if (temporalParams) {
      router.push("/PanelControl/ListaColegiados");
    }
    setVistaActual("lista");
    setColegiadoSeleccionadoId(null);
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

  // Manejador para la aprobación de un colegiado pendiente
  const handleAprobarPendiente = (resultado) => {
    // Siempre volver a la lista primero, para evitar problemas de estado
    volverALista();

    // Comprobar si fue una aprobación exitosa
    if (resultado && resultado.aprobado === true) {
      // Solo mostrar notificación si se aprobó
      setAprobacionExitosa(true);
      setTimeout(() => setAprobacionExitosa(false), 3000);

      // Cambiar al tab de registrados
      setTabActivo("registrados");
    }
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

  // Renderizar vista basada en el estado actual
  if (vistaActual === "detalleColegiado") {
    const colegiadoActual = getColegiado(colegiadoSeleccionadoId);
    return (
      <DetalleColegiado
        params={{ id: colegiadoSeleccionadoId }}
        onVolver={volverALista}
        colegiado={colegiadoActual}
      />
    );
  }

  if (vistaActual === "detallePendiente" || params.type === "pendiente") {
    const pendienteActual = getColegiadoPendiente(colegiadoSeleccionadoId);
    return (
      <DetallePendiente
        params={{ id: colegiadoSeleccionadoId }}
        onVolver={handleAprobarPendiente}
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
        colegiadosPendientes={colegiadosPendientes}
        verDetalleColegiado={verDetalleColegiado}
        verDetallePendiente={verDetallePendiente}
        ordenFecha={ordenFecha}
        toggleOrdenFecha={toggleOrdenFecha}
        currentPage={currentPage}
        colegiadosPagination={colegiadosPagination}
        colegiadosPendientesPagination={colegiadosPendientesPagination}
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