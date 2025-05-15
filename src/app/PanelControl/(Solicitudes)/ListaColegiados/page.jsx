"use client";
import DetalleColegiado from "@/app/Components/Solicitudes/ListaColegiados/DetalleColegiado";
import DetallePendiente from "@/app/Components/Solicitudes/ListaColegiados/DetallePendiente";
import RegistroColegiados from "@/app/Components/Solicitudes/ListaColegiados/RegistrarColegiadoModal";
import useDataListaColegiados from "@/app/Models/PanelControl/Solicitudes/ListaColegiadosData";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Componentes
import DataTable from "./DataTable";
import FilterSection from "./FilterSection";
import HeaderSection from "./HeaderSection";
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

  // Estado local de UI
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegistro, setShowRegistro] = useState(false);
  const [vistaActual, setVistaActual] = useState("lista"); // lista, detalleColegiado, detallePendiente
  const [params, setParams] = useState({ id: null, type: null });
  const [colegiadoSeleccionadoId, setColegiadoSeleccionadoId] = useState(null);
  const [tabActivo, setTabActivo] = useState("pendientes");

  // Filtros adicionales para colegiados registrados - Ahora permiten múltiples selecciones
  const [filtrosEstado, setFiltrosEstado] = useState([]);
  const [filtrosEspecialidad, setFiltrosEspecialidad] = useState([]);

  // Filtros para pendientes
  const [filtroFecha, setFiltroFecha] = useState("todas");
  const [filtroEtiqueta, setFiltroEtiqueta] = useState("todos");
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [aprobacionExitosa, setAprobacionExitosa] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // Nuevos filtros de fecha para pendientes
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  // Estado para ordenamiento - Aseguramos que por defecto sea desc (más reciente primero)
  const [ordenFecha, setOrdenFecha] = useState("desc"); // desc = más nuevo primero, asc = más viejo primero
  // Nuevo estado para ordenamiento de colegiados registrados
  const [ordenFechaRegistrados, setOrdenFechaRegistrados] = useState("desc"); // desc = más nuevo primero, asc = más viejo primero
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const router = useRouter();

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

    if (filtroFecha !== "todas") {
      if (filtroFecha === "semana") {
        const unaSemanAtras = new Date();
        unaSemanAtras.setDate(unaSemanAtras.getDate() - 7);
        filtros.fecha_solicitud_desde = unaSemanAtras
          .toISOString()
          .split("T")[0];
      } else if (filtroFecha === "mes") {
        const unMesAtras = new Date();
        unMesAtras.setMonth(unMesAtras.getMonth() - 1);
        filtros.fecha_solicitud_desde = unMesAtras.toISOString().split("T")[0];
      }
    }

    if (fechaDesde) filtros.fecha_solicitud_desde = fechaDesde;
    if (fechaHasta) filtros.fecha_solicitud_hasta = fechaHasta;

    if (ordenFecha) {
      filtros.ordering = ordenFecha === "desc" ? "-created_at" : "created_at";
    }

    if (filtroEtiqueta !== "todos") {
      if (filtroEtiqueta === "documentosIncompletos") {
        filtros.documentos_completos = "false";
      } else if (filtroEtiqueta === "pagosPendientes") {
        filtros.tiene_pago = "false";
      } else if (filtroEtiqueta === "pagosExonerados") {
        filtros.pago_exonerado = "true";
      }
    }

    // Manejo de estados en base a la pestaña seleccionada
    if (tabActivo === "pendientes") {
      filtros.status = "revisando";
    } else if (tabActivo === "rechazados") {
      filtros.status = "rechazado";
    } else if (tabActivo === "anulados") {
      filtros.status = "denegado";
    }

    // Aplicar filtros múltiples de especialidad
    if (filtrosEspecialidad.length > 0) {
      filtros.especialidades = filtrosEspecialidad.join(',');
    }

    // Aplicar filtros múltiples de estado
    if (filtrosEstado.length > 0) {
      if (filtrosEstado.includes("solventes")) {
        filtros.solvencia_status = "true";
      }
      if (filtrosEstado.includes("noSolventes")) {
        filtros.solvencia_status = "false";
      }
      if (filtrosEstado.includes("solicitudes")) {
        filtros.tiene_solicitudes_pendientes = "true";
      }
    }

    console.log({ filtros, tabActivo });

    if (tabActivo === "registrados") {
      fetchColegiados(currentPage, recordsPerPage, searchTerm, filtros);
    } else {
      fetchPendientes(currentPage, recordsPerPage, searchTerm, filtros);
    }
  }, [
    currentPage,
    recordsPerPage,
    searchTerm,
    filtroFecha,
    fechaDesde,
    fechaHasta,
    ordenFecha,
    ordenFechaRegistrados,
    filtrosEstado,
    filtroEtiqueta,
    filtrosEspecialidad,
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

  // Alternar orden de fecha para colegiados registrados
  const toggleOrdenFechaRegistrados = () => {
    setOrdenFechaRegistrados((prev) => (prev === "desc" ? "asc" : "desc"));
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
        setTabActivo={setTabActivo}
        setCurrentPage={setCurrentPage}
      />

      {/* Sección de filtros */}
      <FilterSection
        tabActivo={tabActivo}
        filtroFecha={filtroFecha}
        setFiltroFecha={setFiltroFecha}
        filtrosEstado={filtrosEstado}
        setFiltrosEstado={setFiltrosEstado}
        filtrosEspecialidad={filtrosEspecialidad}
        setFiltrosEspecialidad={setFiltrosEspecialidad}
        filtroEtiqueta={filtroEtiqueta}
        setFiltroEtiqueta={setFiltroEtiqueta}
        fechaDesde={fechaDesde}
        setFechaDesde={setFechaDesde}
        fechaHasta={fechaHasta}
        setFechaHasta={setFechaHasta}
      />

      {/* Tabla de datos */}
      <DataTable
        tabActivo={tabActivo}
        loading={loading}
        colegiados={colegiados}
        colegiadosPendientes={colegiadosPendientes}
        verDetalleColegiado={verDetalleColegiado}
        verDetallePendiente={verDetallePendiente}
        ordenFecha={ordenFecha}
        ordenFechaRegistrados={ordenFechaRegistrados}
        toggleOrdenFecha={toggleOrdenFecha}
        toggleOrdenFechaRegistrados={toggleOrdenFechaRegistrados}
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