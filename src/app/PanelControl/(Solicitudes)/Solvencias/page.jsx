"use client"

import DateRangePicker from "@/app/Components/SolicitudesSolvencia/DateRangePicker"
import DetalleSolvencia from "@/app/Components/SolicitudesSolvencia/DetalleSolvencia"
import { useSolicitudesStore } from "@/store/SolicitudesStore"
import { motion } from "framer-motion"
import {
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  CreditCard,
  Filter,
  Search,
  Shield,
  X,
  XCircle
} from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export default function ListaSolvencias() {
  // Estados para manejar los datos
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroCreador, setFiltroCreador] = useState("todos");
  
  // Estados para la navegación interna
  const [vistaActual, setVistaActual] = useState("lista");
  const [solvenciaSeleccionadaId, setSolvenciaSeleccionadaId] = useState(null);
  const [tabActual, setTabActual] = useState("pendiente");
  const [filtroCosto, setFiltroCosto] = useState("todas");
  
  // Nuevo estado para filtros por estado específico
  const [filtrosEstado, setFiltrosEstado] = useState([]);
  const [showEstadoFilter, setShowEstadoFilter] = useState(false);
  const dropdownRef = useRef(null);
  
  // Estados para filtros de fecha
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ordenFecha, setOrdenFecha] = useState("desc");
  const fetchSolicitudesDeSolvencia = useSolicitudesStore((state) => state.fetchSolicitudesDeSolvencia);
  const solicitudesDeSolvencia = useSolicitudesStore((state) => state.solicitudesDeSolvencia);

  // Definir todos los estados posibles con sus características
  const estadosDisponibles = [
    { 
      key: "pendiente", 
      label: "Pendiente", 
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock 
    },
    { 
      key: "aprobacion_pendiente", 
      label: "Aprobación Pendiente", 
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Clock 
    },
    { 
      key: "solicitado", 
      label: "Solicitado", 
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: CreditCard 
    },
    { 
      key: "asignado", 
      label: "Asignado", 
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      icon: CreditCard 
    },
    { 
      key: "pago_pendiente", 
      label: "Pago Pendiente", 
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: Clock 
    },
    { 
      key: "aprobado", 
      label: "Aprobado", 
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle 
    },
    { 
      key: "exonerado", 
      label: "Exonerado", 
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle 
    },
    { 
      key: "rechazado", 
      label: "Rechazado", 
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle 
    }
  ];

  // Cargar datos iniciales
  useEffect(() =>  {
    fetchSolicitudesDeSolvencia();
    setIsLoading(false);    
  }, [fetchSolicitudesDeSolvencia]);

  // Función para calcular el estado de la solvencia basado en pagos
  const calcularEstadoSolvencia = useCallback((solvencia) => {
    // Obtener el costo total
    let costoTotal = 0;
    if (solvencia.costoEspecialSolicitud !== null && solvencia.costoEspecialSolicitud !== undefined) {
      costoTotal = parseFloat(solvencia.costoEspecialSolicitud || 0);
    } else {
      costoTotal = parseFloat(solvencia.costoRegularSolicitud || 0);
    }

    // Calcular monto pagado SOLO de pagos aprobados
    const montoPagado = (solvencia.pagos || [])
      .filter(pago => pago.status === 'aprobado')
      .reduce((sum, pago) => {
        const montoUSD = pago.moneda === 'bs'
          ? parseFloat(pago.monto) / parseFloat(pago.tasa_bcv_del_dia || 1)
          : parseFloat(pago.monto || 0);
        return sum + montoUSD;
      }, 0);

    // Calcular si hay pagos realizados (incluye aprobados y en revisión)
    const hayPagosRealizados = (solvencia.pagos || []).length > 0;
    
    // Determinar si el pago está completo
    const pagoCompleto = costoTotal > 0 && montoPagado >= costoTotal;

    return {
      costoTotal,
      montoPagado,
      hayPagosRealizados,
      pagoCompleto,
      tieneCostoAsignado: costoTotal > 0
    };
  }, []);

  // Función para obtener la clave del estado para filtrado
  const obtenerClaveEstado = useCallback((solvencia) => {
    const datos = calcularEstadoSolvencia(solvencia);

    // Para el tab de Pendiente (antes revisión)
    if (solvencia.statusSolicitud === "revision") {
      if (datos.pagoCompleto) {
        return "aprobacion_pendiente";
      } else {
        return "pendiente";
      }
    }

    // Para el tab de Solicitud de Costo
    if (solvencia.statusSolicitud === "costo_especial") {
      if (!datos.tieneCostoAsignado) {
        return "solicitado";
      } else if (!datos.hayPagosRealizados) {
        return "asignado";
      } else if (!datos.pagoCompleto) {
        return "pago_pendiente";
      } else {
        return "aprobacion_pendiente";
      }
    }

    // Estados por defecto para otros casos
    if (solvencia.statusSolicitud === 'aprobado') {
      return "aprobado";
    }
    
    if (solvencia.statusSolicitud === 'exonerado') {
      return "exonerado";
    }
    
    if (solvencia.statusSolicitud === 'rechazado') {
      return "rechazado";
    }

    return "pendiente";
  }, [calcularEstadoSolvencia]);

  // Función para obtener el estado visual de una solvencia
  const obtenerEstadoVisual = (solvencia) => {
    const claveEstado = obtenerClaveEstado(solvencia);
    const estadoConfig = estadosDisponibles.find(e => e.key === claveEstado);
    
    if (!estadoConfig) {
      return {
        texto: "Pendiente",
        color: "bg-gray-100 text-gray-800",
        icon: Clock
      };
    }

    return {
      texto: estadoConfig.label,
      color: estadoConfig.color.replace('border-', '').replace('-200', ''),
      icon: estadoConfig.icon
    };
  };

  // Función para manejar cambios en los filtros de estado
  const toggleFiltroEstado = (estadoKey) => {
    setFiltrosEstado(prev => {
      if (prev.includes(estadoKey)) {
        return prev.filter(e => e !== estadoKey);
      } else {
        return [...prev, estadoKey];
      }
    });
  };

  // Función para limpiar filtros de estado
  const limpiarFiltrosEstado = () => {
    setFiltrosEstado([]);
    setShowEstadoFilter(false);
  };

  // Función para obtener estados disponibles según el tab activo
  const getEstadosDisponiblesPorTab = useCallback(() => {
    switch (tabActual) {
      case "pendiente":
        return estadosDisponibles.filter(estado => 
          ["pendiente", "aprobacion_pendiente"].includes(estado.key)
        );
      case "costo_especial":
        return estadosDisponibles.filter(estado => 
          ["solicitado", "asignado", "pago_pendiente", "aprobacion_pendiente"].includes(estado.key)
        );
      case "todas":
        // Para "todas" incluir TODOS los estados posibles
        return estadosDisponibles;
      default:
        return estadosDisponibles;
    }
  }, [tabActual, estadosDisponibles]);

  // Limpiar filtros de estado que no corresponden al tab actual
  useEffect(() => {
    const estadosDisponiblesEnTab = getEstadosDisponiblesPorTab();
    const estadosValidosIds = estadosDisponiblesEnTab.map(e => e.key);
    
    setFiltrosEstado(prev => prev.filter(estadoId => estadosValidosIds.includes(estadoId)));
  }, [tabActual, getEstadosDisponiblesPorTab]);

  // Determinar si mostrar por defecto aprobadas cuando no hay en revisión
  useEffect(() => {
    if (!isLoading) {
      const existenPendiente = solicitudesDeSolvencia.some(s => s.statusSolicitud === "revision");
      const existenEspecial = solicitudesDeSolvencia.some(s => s.statusSolicitud === "costo_especial");
      if (tabActual === "pendiente" && !existenPendiente) {
        if(!existenEspecial){
          setTabActual("todas");
        }else{
          setTabActual("costo_especial");
        }
      }
    }
  },[solicitudesDeSolvencia]);

  // Conteo de solvencias por estado para los tabs - CORREGIDO
  const conteoSolvencias = useMemo(() => {
    // Función auxiliar para contar según los estados calculados
    const contarPorEstadosCalculados = (estadosPermitidos) => {
      return solicitudesDeSolvencia.filter(solvencia => {
        const estadoCalculado = obtenerClaveEstado(solvencia);
        return estadosPermitidos.includes(estadoCalculado);
      }).length;
    };

    return {
      // En "todas" contar TODAS las solvencias
      todas: solicitudesDeSolvencia.length,
      // En "pendiente" contar solvencias en revisión
      pendiente: solicitudesDeSolvencia.filter(s => s.statusSolicitud === "revision").length,
      // En "costo_especial" contar todas las que están en costo especial
      solicitudCosto: solicitudesDeSolvencia.filter(s => s.statusSolicitud === "costo_especial").length,
    };
  }, [solicitudesDeSolvencia, obtenerClaveEstado]);

  // Convertir string de fecha (formato DD/MM/YYYY) a objeto Date
  const parseStringToDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
  }

  // Filtrar solvencias basado en búsqueda, tab actual y rango de fechas
  const solvenciasFiltradas = useMemo(() => {
    return solicitudesDeSolvencia
      .filter(solvencia => {
        // Filtro de búsqueda
        const matchesSearch =
          searchTerm === "" ||
          solvencia.nombreColegiado.toLowerCase().includes(searchTerm.toLowerCase())

        // Filtro por tab/estado principal
        let matchesTab = true;

        if (tabActual === "pendiente") {
          // En "pendiente" mostrar solo las que estén en revisión
          matchesTab = solvencia.statusSolicitud === "revision";

        } else if (tabActual === "costo_especial") {
          // En "costo_especial" mostrar solo las que tengan costo especial
          matchesTab = solvencia.statusSolicitud === 'costo_especial';

        } else if (tabActual === "todas") {
          // En "todas" mostrar TODAS las solvencias
          matchesTab = true;
        }

        // Filtro por estado específico
        let matchesEstado = true;
        if (filtrosEstado.length > 0) {
          const claveEstado = obtenerClaveEstado(solvencia);
          matchesEstado = filtrosEstado.includes(claveEstado);
        }

        return matchesSearch && matchesTab && matchesEstado;
      })
      .sort((a, b) => {
        const [yearA, monthA, dayA] = a.fechaSolicitud.split('-');
        const [yearB, monthB, dayB] = b.fechaSolicitud.split('-');

        const fechaA = new Date(yearA, monthA - 1, dayA);
        const fechaB = new Date(yearB, monthB - 1, dayB);

        return ordenFecha === "desc" ? fechaB - fechaA : fechaA - fechaB;
      });
}, [solicitudesDeSolvencia, searchTerm, tabActual, filtroEstado, filtroCreador, fechaInicio, ordenFecha, filtrosEstado, obtenerClaveEstado]);

  // Función para ver detalle de una solvencia
  const verDetalleSolvencia = (id) => {
    setSolvenciaSeleccionadaId(id)
    setVistaActual("detalleSolvencia")
  }

  // Función para volver a la lista
  const volverALista = () => {
    setVistaActual("lista")
    setSolvenciaSeleccionadaId(null)
  }

  // Actualizar una solvencia existente
  const actualizarSolvencia = (solvenciaActualizada) => {
    setSolvencias(prev => prev.map(s =>
      s.idSolicitudSolvencia === solvenciaActualizada.idSolicitudSolvencia ? solvenciaActualizada : s
    ))
  }

  // Toggle del orden de fecha
  const toggleOrdenFecha = () => {
    setOrdenFecha(prev => prev === "desc" ? "asc" : "desc");
  }

  // Limpiar filtros de fecha
  const limpiarFiltrosFecha = () => {
    setFechaInicio("");
    setFechaFin("");
    setShowDateFilter(false);
  }

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowEstadoFilter(false);
      }
    }
    
    if (showEstadoFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEstadoFilter]);

  // Renderizado condicional basado en la vista actual
  if (vistaActual === "detalleSolvencia") {
    return (
      <DetalleSolvencia
        solvenciaId={solvenciaSeleccionadaId}
        onVolver={volverALista}
        solvencias={solicitudesDeSolvencia}
        actualizarSolvencia={actualizarSolvencia}
      />
    )
  }

  // Vista principal de lista
  return (
    <div className="select-none cursor-default w-full px-4 md:px-10 py-10 md:py-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-8 md:mb-10 mt-16 md:mt-22"
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2
          bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
        >
          Gestión de solvencias
        </motion.h1>
        <motion.p
          className="mt-4 max-w-full mx-auto text-gray-600 text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Administre las solvencias de los colegiados
        </motion.p>
      </motion.div>

      {/* Barra de acciones: Filtros, fechas, búsqueda */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Filtros */}
        <div className="flex gap-4 w-full md:w-auto">
          {/* Botón de filtros por estado */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setShowEstadoFilter(!showEstadoFilter);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              <Filter size={18} />
              <span>Estados</span>
              <ChevronDown size={16} className={`transition-transform ${showEstadoFilter ? "rotate-180" : ""}`} />
            </button>

            {showEstadoFilter && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-full min-w-[500px] max-h-[400px] overflow-auto">
                <div className="p-4">
                  <h3 className="font-medium mb-3 text-gray-800">
                    Estados disponibles en: {
                      tabActual === "pendiente" ? "Pendiente" :
                      tabActual === "costo_especial" ? "Solicitud de Costo" :
                      tabActual === "todas" ? "Todas" : "Todas"
                    }
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {getEstadosDisponiblesPorTab().map((estado) => {
                      const isSelected = filtrosEstado.includes(estado.key);
                      
                      return (
                        <div
                          key={estado.key}
                          onClick={() => toggleFiltroEstado(estado.key)}
                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm transition-all ${
                            isSelected 
                              ? "bg-gradient-to-r from-[#C40180] to-[#590248] text-white" 
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className={`h-3.5 w-3.5 border rounded flex-shrink-0 ${
                            isSelected ? "border-white bg-white" : "border-gray-300 bg-white"
                          }`}>
                            {isSelected && <Check size={10} className="text-[#C40180]" />}
                          </div>
                          <span className="truncate">{estado.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className="cursor-pointer border border-gray-300 bg-white text-gray-700
            px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50
            transition-colors w-full md:w-auto justify-center"
          >
            <Calendar size={20} />
            <span>Filtrar por fecha</span>
          </button>
        </div>

        {/* Buscador */}
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por colegiado..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full
              focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filtro de fecha emergente */}
      {showDateFilter && (
        <div className="mb-6 p-4 border rounded-lg bg-white shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-800">Filtrar por rango de fechas</h3>
            <button 
              onClick={limpiarFiltrosFecha}
              className="text-sm text-[#C40180] hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <DateRangePicker 
                fechaInicio={fechaInicio}
                fechaFin={fechaFin}
                setFechaInicio={setFechaInicio}
                setFechaFin={setFechaFin}
              />
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={toggleOrdenFecha}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <span>Orden: {ordenFecha === "desc" ? "Más recientes primero" : "Más antiguos primero"}</span>
                <ChevronDown className={`transition-transform ${ordenFecha === "asc" ? "rotate-180" : ""}`} size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chips de filtros activos */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {/* Chip de fechas */}
          {(fechaInicio || fechaFin) && (
            <div className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {fechaInicio && fechaFin
                ? `${fechaInicio} - ${fechaFin}`
                : fechaInicio
                  ? `Desde ${fechaInicio}`
                  : `Hasta ${fechaFin}`}
              <button 
                onClick={() => {
                  setFechaInicio("");
                  setFechaFin("");
                }} 
                className="ml-1"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Chips de estados */}
          {filtrosEstado.map((estadoKey) => {
            const estado = estadosDisponibles.find(e => e.key === estadoKey);
            return estado ? (
              <div
                key={estadoKey}
                className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {estado.label}
                <button onClick={() => toggleFiltroEstado(estadoKey)} className="ml-1">
                  <X size={16} />
                </button>
              </div>
            ) : null;
          })}

          {/* Chip de búsqueda */}
          {searchTerm && (
            <div className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
              Búsqueda: "{searchTerm}"
              <button onClick={() => setSearchTerm("")} className="ml-1">
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs para filtrar por estado */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap">
            <button
              onClick={() => setTabActual("pendiente")}
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${
                tabActual === "pendiente"
                  ? "border-[#C40180] text-[#C40180]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pendiente
              {conteoSolvencias.pendiente > 0 && (
                <span className="ml-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {conteoSolvencias.pendiente}
                </span>
              )}
            </button>
            <button
              onClick={() => setTabActual("costo_especial")}
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${
                tabActual === "costo_especial"
                  ? "border-[#C40180] text-[#C40180]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <span>Solicitud de Costo</span>
                {conteoSolvencias.solicitudCosto > 0 && (
                  <span className="ml-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white text-xs px-2 py-0.5 rounded-full">
                    {conteoSolvencias.solicitudCosto}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setTabActual("todas")}
              className={`cursor-pointer whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 ${
                tabActual === "todas"
                  ? "border-[#C40180] text-[#C40180]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Todas
              {conteoSolvencias.todas > 0 && (
                <span className="ml-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {conteoSolvencias.todas}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
      
      {/* Mensaje informativo para solicitudes de costo */}
      {tabActual === "costo_especial" && (
        <div className="mb-6 flex items-center bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <div className="mr-2 bg-indigo-100 rounded-full p-1">
            <CreditCard size={20} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-indigo-800 font-medium">Solicitudes pendientes de asignación de costo</p>
            <p className="text-xs text-indigo-700">Estas solicitudes requieren que
              se les asigne un costo o se exoneren de pago.</p>
          </div>
        </div>
      )}

      {/* Estado de carga */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
        </div>
      ) : (
        <>
          {/* Lista de solvencias */}
          {solvenciasFiltradas.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                {tabActual === "pendiente" && <Clock className="h-8 w-8 text-yellow-500" />}
                {tabActual === "costo_especial" && <CreditCard className="h-8 w-8 text-indigo-500" />}
                {tabActual === "todas" && <Search className="h-8 w-8 text-gray-400" />}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {tabActual === "pendiente" && "No hay solvencias pendientes por revisión"}
                {tabActual === "costo_especial" && "No hay solicitudes pendientes de costo"}
                {tabActual === "todas" && "No se encontraron solvencias"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || fechaInicio || fechaFin
                  ? "Intenta cambiar los criterios de búsqueda o filtros de fecha"
                  : "Las solicitudes de solvencia aparecerán aquí cuando los colegiados las generen"}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Colegiado
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium
                      text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Fecha de Vencimiento
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {solvenciasFiltradas.map((solvencia) => {
                    const estadoVisual = obtenerEstadoVisual(solvencia);
                    const IconoEstado = estadoVisual.icon;
                    return (
                      <tr
                        key={solvencia.idSolicitudSolvencia}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => verDetalleSolvencia(solvencia.idSolicitudSolvencia)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-sm text-gray-900">{solvencia.nombreColegiado}</div>
                              {solvencia.creador.isAdmin && (
                                <div className="flex items-center">
                                  <Shield size={14} className="text-purple-500" />
                                  <span className="ml-1 text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                                    Admin
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell">
                          <div className="text-sm text-gray-500">{solvencia.fechaExpSolvencia || "-"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-col items-center">
                            <span className={`inline-flex items-center justify-center gap-1 px-2.5 py-0.5
                              rounded-full text-xs font-medium ${estadoVisual.color}`}>
                              <IconoEstado size={12} />
                              {estadoVisual.texto}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}