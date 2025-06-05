"use client"

import api from "@/api/api"
import DateRangeFilter from "@/app/PanelControl/(Solicitudes)/ListaColegiados/DateRangeFilter"
import PagosEstadisticas from "@/Components/Solicitudes/Pagos/PagosEstadisticas"
import PagosNavegacion from "@/Components/Solicitudes/Pagos/PagosNavegacion"
import PagosTabla from "@/Components/Solicitudes/Pagos/PagosTabla"
import { motion } from "framer-motion"
import {
  ChevronDown,
  Filter,
  Search,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

// Componente de filtros múltiples para pagos
function PagosMultiSelectFilter({
  activeFilters,
  setActiveFilters,
  tabActivo
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState("Tipo");
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef(null);

  // Filtros disponibles para pagos - dinámico según el tab
  const getAllFilterGroups = useCallback(() => {
    const baseGroups = {
      "Tipo": [
        { id: "tipo-solicitud", group: "Tipo", label: "Solicitud", value: "solicitud" },
        { id: "tipo-inscripcion", group: "Tipo", label: "Inscripción Colegiados", value: "inscripcion" },
        { id: "tipo-cursos", group: "Tipo", label: "Cursos y Eventos", value: "cursos" },
        { id: "tipo-solvencia", group: "Tipo", label: "Solvencia", value: "solvencia" }
      ],
      "Método de Pago": [
        { id: "metodo-transferencia", group: "Método de Pago", label: "Transferencia", value: "transferencia" },
        { id: "metodo-pago-movil", group: "Método de Pago", label: "Pago Móvil", value: "pago_movil" },
        { id: "metodo-efectivo", group: "Método de Pago", label: "Efectivo", value: "efectivo" },
        { id: "metodo-paypal", group: "Método de Pago", label: "PayPal", value: "paypal" },
        { id: "metodo-punto-venta", group: "Método de Pago", label: "Punto de Venta", value: "punto_venta" }
      ],
      "Moneda": [
        { id: "moneda-usd", group: "Moneda", label: "Dólares ($)", value: "usd" },
        { id: "moneda-bs", group: "Moneda", label: "Bolívares (Bs)", value: "bs" }
      ]
    };

    // Solo agregar filtro de Estado si estamos en el tab "todas"
    if (tabActivo === "todas") {
      baseGroups["Estado"] = [
        { id: "estado-pendiente", group: "Estado", label: "Pendiente", value: "pendiente" },
        { id: "estado-aprobado", group: "Estado", label: "Aprobado", value: "aprobado" },
        { id: "estado-rechazado", group: "Estado", label: "Rechazado", value: "rechazado" }
      ];
    }

    return baseGroups;
  }, [tabActivo]);

  const filterGroups = useMemo(() => getAllFilterGroups(), [getAllFilterGroups]);

  // Actualizar activeGroup cuando cambie el tab
  useEffect(() => {
    const availableGroups = Object.keys(filterGroups);
    if (availableGroups.length > 0 && !availableGroups.includes(activeGroup)) {
      setActiveGroup(availableGroups[0]);
    }
  }, [tabActivo, filterGroups, activeGroup]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manejar selección/deselección de filtro
  const toggleFilter = useCallback((filter) => {
    const exists = activeFilters.some((f) => f.id === filter.id);
    
    if (exists) {
      setActiveFilters(prev => prev.filter((f) => f.id !== filter.id));
    } else {
      // Para Moneda y Estado: selección única (eliminar otros del mismo grupo)
      if (filter.group === "Moneda" || filter.group === "Estado") {
        setActiveFilters(prev => [
          ...prev.filter((f) => f.group !== filter.group),
          filter
        ]);
      } else {
        // Para Tipo y Método de Pago: selección múltiple
        setActiveFilters(prev => [...prev, filter]);
      }
    }
  }, [activeFilters, setActiveFilters]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm"
      >
        <Filter size={18} />
        <span>Filtros</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-full min-w-[600px] max-h-[400px] overflow-auto">
          <div className="sticky top-0 bg-white p-3 border-b border-gray-100 z-10">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar filtros..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180]"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          <div className="p-4">
            {/* Tabs de categorías */}
            <div className="mb-3 flex flex-wrap gap-1">
              {Object.keys(filterGroups).map(group => (
                <button
                  key={group}
                  className={`px-3 py-1 rounded-full text-sm ${activeGroup === group
                    ? "bg-gradient-to-r from-[#C40180] to-[#590248] text-white"
                    : "bg-gray-100 text-gray-700"
                    }`}
                  onClick={() => setActiveGroup(group)}
                >
                  {group}
                </button>
              ))}
            </div>

            {/* Filtros de la categoría activa */}
            {activeGroup && (
              <div className="rounded-lg bg-white shadow-md p-4 border">
                <h3 className="font-medium mb-2">{activeGroup}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {filterGroups[activeGroup]?.filter(filter =>
                    !searchText || filter.label.toLowerCase().includes(searchText.toLowerCase())
                  ).map(filter => {
                    const isSelected = activeFilters.some(f => f.id === filter.id);
                    return (
                      <div
                        key={filter.id}
                        onClick={() => toggleFilter(filter)}
                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm ${isSelected
                          ? "bg-gradient-to-r from-[#C40180] to-[#590248] text-white"
                          : "bg-gray-50 hover:bg-gray-100"
                          }`}
                      >
                        <div className={`h-3.5 w-3.5 border rounded flex-shrink-0 ${isSelected ? "border-white bg-white" : "border-gray-300 bg-white"
                          }`}>
                          {isSelected && <X size={10} className="text-[#C40180]" />}
                        </div>
                        <span>{filter.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ListaPagos() {
  // Estados para manejar los datos
  const [pagos, setPagos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Router para navegación
  const router = useRouter()
  
  // Estados para tabs
  const [tabActivo, setTabActivo] = useState("") // se establecerá dinámicamente
  
  // Estados para filtros
  const [activeFilters, setActiveFilters] = useState([])
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  
  // Estadísticas resumidas
  const [estadisticas, setEstadisticas] = useState({
    totalPagos: 0,
    ingresosMes: 0,
    ingresosHoy: 0,
    pagosPendientes: 0,
    pagosEnRevision: 0,
    pagosPorAprobar: 0,
    ingresosPendientes: 0
  })

  // Funciones helper para normalizar estados
  const normalizarEstado = useCallback((status) => {
    const estadosMap = {
      'aprobado': 'Aprobado',
      'pendiente': 'Pendiente', 
      'rechazado': 'Rechazado',
      'en_revision': 'Pendiente', // Mostrar como "Pendiente"
      'revisando': 'Pendiente',   // Mostrar como "Pendiente"
      'exonerado': 'Exonerado'
    }
    
    return estadosMap[status] || status.charAt(0).toUpperCase() + status.slice(1)
  }, [])

  const obtenerClaseEstado = useCallback((status) => {
    const clasesMap = {
      'aprobado': 'bg-green-100 text-green-800',
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'rechazado': 'bg-red-100 text-red-800',
      'en_revision': 'bg-yellow-100 text-yellow-800', // Usar estilo de pendiente
      'revisando': 'bg-yellow-100 text-yellow-800',   // Usar estilo de pendiente
      'exonerado': 'bg-purple-100 text-purple-800'
    }
    
    return clasesMap[status] || 'bg-gray-100 text-gray-800'
  }, [])

  // Función para normalizar estados: "en revisión" = "pendiente"
  const esEstadoEnRevision = useCallback((status) => {
    return ["en_revision", "revisando"].includes(status)
  }, [])

  // Función para establecer el tab por defecto
  const establecerTabPorDefecto = useCallback((pagosData) => {
    // Incluir tanto pendientes como en revisión para determinar el tab por defecto
    const pagosPendientes = pagosData.filter(p => p.status === "pendiente" || esEstadoEnRevision(p.status))
    console.log('Pagos pendientes (incluyendo en revisión) encontrados:', pagosPendientes.length)
    
    if (pagosPendientes.length > 0) {
      setTabActivo("pendientes")
      console.log('Tab establecido: pendientes')
    } else {
      setTabActivo("todas")
      console.log('Tab establecido: todas (no hay pendientes)')
    }
  }, [esEstadoEnRevision])

  // Calcular estadísticas basadas en los datos
  const calcularEstadisticas = useCallback((pagosData) => {
    console.log('=== INICIANDO CÁLCULO DE ESTADÍSTICAS ===')
    console.log('Datos recibidos:', pagosData?.length || 0, 'pagos')
    
    if (!pagosData || pagosData.length === 0) {
      console.log('No hay datos, estableciendo estadísticas en 0')
      setEstadisticas({
        totalPagos: 0,
        ingresosMes: 0,
        ingresosHoy: 0,
        pagosPendientes: 0,
        pagosEnRevision: 0,
        pagosPorAprobar: 0,
        ingresosPendientes: 0
      })
      return
    }

    // Mostrar muestra de datos recibidos para debugging
    console.log('Muestra de datos recibidos:', pagosData.slice(0, 3).map(p => ({
      id: p.id,
      monto: p.monto,
      moneda: p.moneda,
      status: p.status,
      fecha_pago: p.fecha_pago,
      tasa_bcv_del_dia: p.tasa_bcv_del_dia
    })))

    const ahora = new Date()
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
    const inicioDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
    
    console.log('Fechas de referencia:', {
      ahora: ahora.toISOString(),
      inicioMes: inicioMes.toISOString(),
      inicioDia: inicioDia.toISOString()
    })

    // Función helper para convertir a USD
    const convertirAUSD = (pago) => {
      const montoOriginal = parseFloat(pago.monto) || 0
      
      if (pago.moneda === "usd") {
        return montoOriginal
      } else if (pago.moneda === "bs") {
        const tasa = parseFloat(pago.tasa_bcv_del_dia) || 1
        if (tasa > 0) {
          const montoUSD = montoOriginal / tasa
          console.log(`Conversión BS a USD: ${montoOriginal} Bs ÷ ${tasa} = $${montoUSD.toFixed(2)}`)
          return montoUSD
        } else {
          console.warn(`Tasa inválida para pago ${pago.id}:`, tasa)
          return 0
        }
      } else {
        console.warn(`Moneda desconocida para pago ${pago.id}:`, pago.moneda)
        return montoOriginal // Asumir USD por defecto
      }
    }

    // Procesar cada pago para normalizar datos y calcular montos en USD
    const pagosProcessados = pagosData.map(pago => {
      const montoOriginal = parseFloat(pago.monto) || 0
      const montoUSD = convertirAUSD(pago)
      
      // Parsear fecha
      let fechaPago
      try {
        fechaPago = new Date(pago.fecha_pago)
        if (isNaN(fechaPago.getTime())) {
          console.warn(`Fecha inválida para pago ${pago.id}:`, pago.fecha_pago)
          fechaPago = new Date() // Usar fecha actual como fallback
        }
      } catch (error) {
        console.warn(`Error parseando fecha para pago ${pago.id}:`, pago.fecha_pago, error)
        fechaPago = new Date()
      }

      return {
        ...pago,
        montoOriginal,
        montoUSD,
        fechaPago,
        estadoNormalizado: pago.status?.toLowerCase() || 'desconocido'
      }
    })

    console.log(`Procesados ${pagosProcessados.length} pagos`)

    // Debug: mostrar distribución por estado
    const estadosCount = {}
    pagosProcessados.forEach(pago => {
      const estado = pago.estadoNormalizado
      estadosCount[estado] = (estadosCount[estado] || 0) + 1
    })
    console.log('Distribución por estados:', estadosCount)

    // 1. Total de pagos aprobados (en USD)
    const pagosAprobados = pagosProcessados.filter(pago => 
      pago.estadoNormalizado === "aprobado"
    )
    
    console.log(`Pagos aprobados encontrados: ${pagosAprobados.length}`)
    pagosAprobados.forEach(pago => {
      console.log(`  - Pago ${pago.id}: $${pago.montoUSD.toFixed(2)} (original: ${pago.montoOriginal} ${pago.moneda})`)
    })
    
    const totalPagos = pagosAprobados.reduce((sum, pago) => {
      const suma = sum + pago.montoUSD
      console.log(`    Acumulando: $${sum.toFixed(2)} + $${pago.montoUSD.toFixed(2)} = $${suma.toFixed(2)}`)
      return suma
    }, 0)
    
    console.log(`TOTAL PAGOS APROBADOS: $${totalPagos.toFixed(2)}`)

    // 2. Ingresos del mes actual (pagos aprobados del mes)
    const pagosDelMes = pagosAprobados.filter(pago => {
      const esDeMes = pago.fechaPago >= inicioMes && pago.fechaPago <= ahora
      if (esDeMes) {
        console.log(`Pago del mes: ${pago.id} - ${pago.fechaPago.toISOString()} - $${pago.montoUSD.toFixed(2)}`)
      }
      return esDeMes
    })
    
    const ingresosMes = pagosDelMes.reduce((sum, pago) => sum + pago.montoUSD, 0)
    console.log(`INGRESOS DEL MES: ${pagosDelMes.length} pagos = $${ingresosMes.toFixed(2)}`)

    // 3. Ingresos de hoy (pagos aprobados de hoy)
    const pagosDeHoy = pagosAprobados.filter(pago => {
      const esDeHoy = pago.fechaPago >= inicioDia && pago.fechaPago <= ahora
      if (esDeHoy) {
        console.log(`Pago de hoy: ${pago.id} - ${pago.fechaPago.toISOString()} - $${pago.montoUSD.toFixed(2)}`)
      }
      return esDeHoy
    })
    
    const ingresosHoy = pagosDeHoy.reduce((sum, pago) => sum + pago.montoUSD, 0)
    console.log(`INGRESOS DE HOY: ${pagosDeHoy.length} pagos = $${ingresosHoy.toFixed(2)}`)

    // 4. Calcular ingresos por aprobar (pendientes + en revisión = todos por aprobar)
    const pagosPendientesList = pagosProcessados.filter(pago => 
      pago.estadoNormalizado === "pendiente"
    )
    
    const pagosEnRevisionList = pagosProcessados.filter(pago => 
      esEstadoEnRevision(pago.status)
    )
    
    // Combinar pendientes y en revisión como "por aprobar"
    const pagosPorAprobar = [...pagosPendientesList, ...pagosEnRevisionList]
    
    console.log(`Pagos pendientes encontrados: ${pagosPendientesList.length}`)
    pagosPendientesList.forEach(pago => {
      console.log(`  - Pago pendiente ${pago.id}: $${pago.montoUSD.toFixed(2)} (original: ${pago.montoOriginal} ${pago.moneda})`)
    })
    
    console.log(`Pagos en revisión encontrados: ${pagosEnRevisionList.length}`)
    pagosEnRevisionList.forEach(pago => {
      console.log(`  - Pago en revisión ${pago.id}: $${pago.montoUSD.toFixed(2)} (original: ${pago.montoOriginal} ${pago.moneda})`)
    })
    
    const ingresosPendientes = pagosPorAprobar.reduce((sum, pago) => {
      const suma = sum + pago.montoUSD
      console.log(`    Acumulando por aprobar: $${sum.toFixed(2)} + $${pago.montoUSD.toFixed(2)} = $${suma.toFixed(2)}`)
      return suma
    }, 0)
    
    console.log(`INGRESOS POR APROBAR: ${pagosPorAprobar.length} pagos (${pagosPendientesList.length} pendientes + ${pagosEnRevisionList.length} en revisión) = $${ingresosPendientes.toFixed(2)}`)

    const estadisticasFinales = {
      totalPagos: Math.round(totalPagos * 100) / 100,
      ingresosMes: Math.round(ingresosMes * 100) / 100,
      ingresosHoy: Math.round(ingresosHoy * 100) / 100,
      pagosPendientes: pagosPendientesList.length,
      pagosEnRevision: pagosEnRevisionList.length,
      pagosPorAprobar: pagosPorAprobar.length,
      ingresosPendientes: Math.round(ingresosPendientes * 100) / 100
    }

    console.log('=== ESTADÍSTICAS FINALES ===')
    console.log('Total Pagos (USD):', estadisticasFinales.totalPagos)
    console.log('Ingresos Mes (USD):', estadisticasFinales.ingresosMes)
    console.log('Ingresos Hoy (USD):', estadisticasFinales.ingresosHoy)
    console.log('Pagos Pendientes (cantidad):', estadisticasFinales.pagosPendientes)
    console.log('Pagos En Revisión (cantidad):', estadisticasFinales.pagosEnRevision)
    console.log('Total Por Aprobar (cantidad):', estadisticasFinales.pagosPorAprobar)
    console.log('Ingresos Por Aprobar (USD):', estadisticasFinales.ingresosPendientes)
    console.log('================================')
    
    setEstadisticas(estadisticasFinales)
  }, [])

  // Función para obtener pagos del API
  const fetchPagos = useCallback(async () => {
    try {
      setIsLoading(true)
      console.log('=== FETCHING PAGOS FROM API ===')
      const response = await api.get('/solicitudes/pago/')
      console.log('API Response recibida, datos:', response.data?.length || 0, 'pagos')
      
      const pagosData = response.data || []
      
      // Mostrar estructura de datos recibidos
      if (pagosData.length > 0) {
        console.log('Estructura del primer pago:', Object.keys(pagosData[0]))
        console.log('Primer pago completo:', pagosData[0])
      }
      
      setPagos(pagosData)
      
      // Recalcular estadísticas con los nuevos datos
      setTimeout(() => {
        calcularEstadisticas(pagosData)
      }, 100) // Pequeño delay para asegurar que el estado se actualice
      
      // Establecer tab por defecto
      establecerTabPorDefecto(pagosData)
    } catch (error) {
      console.error('Error fetching pagos:', error)
      setPagos([])
      calcularEstadisticas([])
      establecerTabPorDefecto([])
    } finally {
      setIsLoading(false)
    }
  }, [calcularEstadisticas, establecerTabPorDefecto])

  // Obtener tipo de pago
  const getTipoPago = useCallback((pago) => {
    if (pago.solicitud) return "Solicitud"
    if (pago.inscripcion) return "Inscripción Colegiados"
    if (pago.solicitud_solvencia) return "Solvencia"
    if (pago.curso || pago.evento) return "Cursos y Eventos"
    return "Otro"
  }, [])

  // Formatear monto con moneda (misma lógica que calcularEstadisticas)
  const formatearMonto = useCallback((pago) => {
    const amount = parseFloat(pago.monto) || 0
    
    if (pago.moneda === "usd") {
      return `$${amount.toFixed(2)}`
    } else if (pago.moneda === "bs") {
      const tasaBcv = parseFloat(pago.tasa_bcv_del_dia) || 1
      if (tasaBcv <= 0) {
        console.warn(`Tasa inválida en formatearMonto para pago ${pago.id}:`, tasaBcv)
        return `${amount.toFixed(2)} Bs (Sin tasa)`
      }
      
      const montoUsd = amount / tasaBcv
      return {
        montoUsd: `$${montoUsd.toFixed(2)}`,
        montoBs: `${amount.toFixed(2)} Bs`,
        tasa: `Tasa: ${tasaBcv.toFixed(2)} Bs/$`
      }
    } else {
      console.warn(`Moneda desconocida en formatearMonto para pago ${pago.id}:`, pago.moneda)
      return `${amount.toFixed(2)} (${pago.moneda || 'N/A'})`
    }
  }, [])

  // Contar pagos por estado (normalizado)
  const contarPagosPorEstado = useMemo(() => {
    return {
      todas: pagos.length,
      // En el tab "pendientes" se muestran tanto pendientes como en revisión
      pendientes: pagos.filter(p => p.status === "pendiente" || esEstadoEnRevision(p.status)).length,
      aprobados: pagos.filter(p => p.status === "aprobado").length,
      rechazados: pagos.filter(p => p.status === "rechazado").length
    }
  }, [pagos, esEstadoEnRevision])

  // Filtrar pagos basados en tab activo, búsqueda y filtros
  const pagosFiltrados = useMemo(() => {
    return pagos.filter(pago => {
      // Filtro por tab - "pendientes" incluye tanto pendientes como en revisión
      if (tabActivo === "pendientes" && !(pago.status === "pendiente" || esEstadoEnRevision(pago.status))) return false
      if (tabActivo === "aprobados" && pago.status !== "aprobado") return false
      if (tabActivo === "rechazados" && pago.status !== "rechazado") return false

      // Filtro de búsqueda
      const tipo = getTipoPago(pago)
      const searchMatch = 
        tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pago.metodo_de_pago_nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pago.num_referencia || "").toLowerCase().includes(searchTerm.toLowerCase())

      if (!searchMatch) return false

      // Filtros múltiples - Agrupar por tipo de filtro
      const filtrosPorGrupo = {}
      activeFilters.forEach(filter => {
        if (!filtrosPorGrupo[filter.group]) {
          filtrosPorGrupo[filter.group] = []
        }
        filtrosPorGrupo[filter.group].push(filter)
      })

      // Verificar cada grupo de filtros (OR dentro del grupo, AND entre grupos)
      for (const [grupo, filtros] of Object.entries(filtrosPorGrupo)) {
        let cumpleGrupo = false

        if (grupo === "Estado") {
          // Para Estado (selección única): debe coincidir exactamente
          cumpleGrupo = filtros.some(filter => pago.status === filter.value)
        }
        
        else if (grupo === "Tipo") {
          // Para Tipo (selección múltiple): OR - cualquier tipo seleccionado
          cumpleGrupo = filtros.some(filter => {
            const tipoValue = getTipoPago(pago).toLowerCase().replace(/\s+/g, '_')
            const filterValue = filter.value.toLowerCase()
            
            // Mapear valores para comparación
            const tipoMapping = {
              'solicitud': 'solicitud',
              'inscripción_colegiados': 'inscripcion',
              'cursos_y_eventos': 'cursos',
              'solvencia': 'solvencia'
            }
            
            return tipoMapping[tipoValue] === filterValue
          })
        }
        
        else if (grupo === "Método de Pago") {
          // Para Método de Pago (selección múltiple): OR - cualquier método seleccionado
          cumpleGrupo = filtros.some(filter => {
            const metodoPago = (pago.metodo_de_pago_nombre || "").toLowerCase()
            const filterValue = filter.value.toLowerCase()
            
            // Mapear métodos de pago para comparación flexible
            const metodoMapping = {
              'transferencia': ['transferencia', 'transfer'],
              'pago_movil': ['pago móvil', 'pago movil', 'móvil'],
              'efectivo': ['efectivo', 'cash'],
              'paypal': ['paypal'],
              'punto_venta': ['punto de venta', 'pos', 'tarjeta']
            }
            
            const metodosValidos = metodoMapping[filterValue] || [filterValue]
            return metodosValidos.some(metodo => metodoPago.includes(metodo))
          })
        }
        
        else if (grupo === "Moneda") {
          // Para Moneda (selección única): debe coincidir exactamente
          cumpleGrupo = filtros.some(filter => pago.moneda === filter.value)
        }

        // Si no cumple con este grupo, excluir el pago
        if (!cumpleGrupo) return false
      }

      // Filtro de fechas
      if (fromDate || toDate) {
        const fechaPago = new Date(pago.fecha_pago)
        if (fromDate && fechaPago < new Date(fromDate)) return false
        if (toDate && fechaPago > new Date(toDate)) return false
      }

      return true
    })
  }, [pagos, tabActivo, searchTerm, activeFilters, fromDate, toDate, getTipoPago, esEstadoEnRevision])

  // Función para ver detalle de un pago
  const verDetallePago = useCallback((id) => {
    router.push(`/PanelControl/Pagos/${id}`)
  }, [router])
  
  // Función para actualizar un pago
  const actualizarPago = useCallback((pagoActualizado) => {
    setPagos(prev => prev.map(p => 
      p.id === pagoActualizado.id ? pagoActualizado : p
    ))
  }, [])

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchPagos()
  }, [fetchPagos])

  // Recalcular estadísticas cuando cambien los pagos
  useEffect(() => {
    if (pagos.length > 0) {
      console.log('Recalculando estadísticas debido a cambio en pagos')
      calcularEstadisticas(pagos)
    }
  }, [pagos, calcularEstadisticas])

  // Limpiar filtros de estado cuando se cambie de tab
  useEffect(() => {
    if (tabActivo !== "todas") {
      setActiveFilters(prev => prev.filter(filter => filter.group !== "Estado"))
    }
  }, [tabActivo])

  // Vista principal de lista
  return (
    <div className="w-full px-4 md:px-10 py-10 md:py-12 select-none cursor-default">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-8 md:mb-10 mt-16 md:mt-22"
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text p-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
        >
          Gestión de pagos
        </motion.h1>
        <motion.p
          className="mt-4 max-w-full mx-auto text-gray-600 text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Administre los pagos del sistema
        </motion.p>
      </motion.div>

      {/* Estadísticas resumidas */}
      <PagosEstadisticas 
        estadisticas={estadisticas}
        contarPagosPorEstado={contarPagosPorEstado}
      />

      {/* Tabs y Búsqueda */}
      <PagosNavegacion 
        tabActivo={tabActivo}
        setTabActivo={setTabActivo}
        contarPagosPorEstado={contarPagosPorEstado}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Filtros */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <PagosMultiSelectFilter
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            tabActivo={tabActivo}
          />
          
          {/* Filtro de fechas usando DateRangeFilter */}
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />

          {/* Filtros activos */}
          {activeFilters.map((filter) => (
            <div
              key={filter.id}
              className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {filter.label}
              <button onClick={() => setActiveFilters(prev => prev.filter((f) => f.id !== filter.id))} className="ml-1">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Estado de carga */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
        </div>
      ) : (
        <>
          {/* Lista de pagos */}
          <PagosTabla 
            pagosFiltrados={pagosFiltrados}
            getTipoPago={getTipoPago}
            formatearMonto={formatearMonto}
            normalizarEstado={normalizarEstado}
            obtenerClaseEstado={obtenerClaseEstado}
            verDetallePago={verDetallePago}
          />
        </>
      )}
    </div>
  )
}