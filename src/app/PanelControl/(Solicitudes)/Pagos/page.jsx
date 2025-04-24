"use client"

import { motion } from "framer-motion"
import {
  BarChart,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Filter,
  PieChart,
  Printer,
  Search
} from "lucide-react"
import { useEffect, useState } from "react"
import DetallePago from "../../../Components/Solicitudes/Pagos/DetallePago"
import GenerarReporteModal from "../../../Components/Solicitudes/Pagos/GenerarReporteModal"

export default function ListaPagos() {
  // Estados para manejar los datos
  const [pagos, setPagos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showReporteModal, setShowReporteModal] = useState(false)
  
  // Estados para la navegación interna
  const [vistaActual, setVistaActual] = useState("lista") // lista, detallePago, reportes
  const [pagoSeleccionadoId, setPagoSeleccionadoId] = useState(null)
  const [filtroTipoPago, setFiltroTipoPago] = useState("todos") // todos, solicitud, inscripcion, Solvencia, curso
  const [filtroEstado, setFiltroEstado] = useState("todos") // todos, procesado, pendiente, rechazado
  const [filtroFecha, setFiltroFecha] = useState("todos") // todos, hoy, estaSemana, esteMes, personalizado
  const [rangoFechas, setRangoFechas] = useState({ desde: null, hasta: null })
  const [ordenPor, setOrdenPor] = useState("fechaDesc") // fechaDesc, fechaAsc, montoDesc, montoAsc
  
  // Estadísticas resumidas
  const [estadisticas, setEstadisticas] = useState({
    totalPagos: 0,
    ingresosMes: 0,
    ingresosHoy: 0,
    pagosPendientes: 0
  })

  // Simular carga de datos
  useEffect(() => {
    setTimeout(() => {
      // Datos de ejemplo para la tabla de pagos
      const pagosDePrueba = [
        {
          id: "1",
          referencia: "PAG-20250415-001",
          tipo: "Solicitud",
          descripcion: "Constancia de inscripción",
          colegiadoId: "1",
          colegiadoNombre: "María González",
          colegiadoNumero: "ODV-1234",
          fecha: "15/04/2025",
          fechaCreacion: "2025-04-15T10:30:00",
          monto: 20,
          metodoPago: "Transferencia",
          estado: "Procesado",
          comprobante: "comprobante_001.pdf",
          facturaGenerada: true,
          facturaId: "FACT-001-2025",
          fechaProcesamiento: "15/04/2025",
          procesadoPor: "Admin",
          notaAdmin: "Pago verificado correctamente"
        },
        {
          id: "2",
          referencia: "PAG-20250414-002",
          tipo: "Inscripción",
          descripcion: "Inscripción anual",
          colegiadoId: "2",
          colegiadoNombre: "Juan Pérez",
          colegiadoNumero: "ODV-2345",
          fecha: "14/04/2025",
          fechaCreacion: "2025-04-14T14:20:00",
          monto: 100,
          metodoPago: "Depósito Bancario",
          estado: "Procesado",
          comprobante: "comprobante_002.pdf",
          facturaGenerada: true,
          facturaId: "FACT-002-2025",
          fechaProcesamiento: "14/04/2025",
          procesadoPor: "Admin",
          notaAdmin: "Pago verificado correctamente"
        },
        {
          id: "3",
          referencia: "PAG-20250413-003",
          tipo: "Solvencia",
          descripcion: "Solvencia mensual abril 2025",
          colegiadoId: "3",
          colegiadoNombre: "Carlos Ramírez",
          colegiadoNumero: "ODV-3456",
          fecha: "13/04/2025",
          fechaCreacion: "2025-04-13T09:15:00",
          monto: 30,
          metodoPago: "Zelle",
          estado: "Pendiente",
          comprobante: "comprobante_003.pdf",
          facturaGenerada: false,
          notaAdmin: "Pendiente de verificación"
        },
        {
          id: "4",
          referencia: "PAG-20250410-004",
          tipo: "Curso",
          descripcion: "Curso de actualización en endodoncia",
          colegiadoId: "1",
          colegiadoNombre: "María González",
          colegiadoNumero: "ODV-1234",
          fecha: "10/04/2025",
          fechaCreacion: "2025-04-10T16:45:00",
          monto: 150,
          metodoPago: "Transferencia",
          estado: "Procesado",
          comprobante: "comprobante_004.pdf",
          facturaGenerada: true,
          facturaId: "FACT-003-2025",
          fechaProcesamiento: "11/04/2025",
          procesadoPor: "Admin",
          notaAdmin: "Pago verificado correctamente"
        },
        {
          id: "5",
          referencia: "PAG-20250409-005",
          tipo: "Solicitud",
          descripcion: "Registro de especialidad",
          colegiadoId: "2",
          colegiadoNombre: "Juan Pérez",
          colegiadoNumero: "ODV-2345",
          fecha: "09/04/2025",
          fechaCreacion: "2025-04-09T11:30:00",
          monto: 50,
          metodoPago: "Pago móvil",
          estado: "Rechazado",
          comprobante: "comprobante_005.pdf",
          facturaGenerada: false,
          fechaRechazo: "10/04/2025",
          rechazadoPor: "Admin",
          motivoRechazo: "Comprobante ilegible"
        },
        {
          id: "6",
          referencia: "PAG-20250407-006",
          tipo: "Inscripción",
          descripcion: "Inscripción anual",
          colegiadoId: "3",
          colegiadoNombre: "Carlos Ramírez",
          colegiadoNumero: "ODV-3456",
          fecha: "07/04/2025",
          fechaCreacion: "2025-04-07T10:00:00",
          monto: 100,
          metodoPago: "Transferencia",
          estado: "Procesado",
          comprobante: "comprobante_006.pdf",
          facturaGenerada: true,
          facturaId: "FACT-004-2025",
          fechaProcesamiento: "08/04/2025",
          procesadoPor: "Admin",
          notaAdmin: "Pago verificado correctamente"
        },
        {
          id: "7",
          referencia: "PAG-20250406-007",
          tipo: "Solvencia",
          descripcion: "Solvencia mensual abril 2025",
          colegiadoId: "1",
          colegiadoNombre: "María González",
          colegiadoNumero: "ODV-1234",
          fecha: "06/04/2025",
          fechaCreacion: "2025-04-06T15:20:00",
          monto: 30,
          metodoPago: "Transferencia",
          estado: "Procesado",
          comprobante: "comprobante_007.pdf",
          facturaGenerada: true,
          facturaId: "FACT-005-2025",
          fechaProcesamiento: "07/04/2025",
          procesadoPor: "Admin",
          notaAdmin: "Pago verificado correctamente"
        },
        {
          id: "8",
          referencia: "PAG-20250405-008",
          tipo: "Curso",
          descripcion: "Taller de odontopediatría",
          colegiadoId: "2",
          colegiadoNombre: "Juan Pérez",
          colegiadoNumero: "ODV-2345",
          fecha: "05/04/2025",
          fechaCreacion: "2025-04-05T09:45:00",
          monto: 120,
          metodoPago: "Depósito Bancario",
          estado: "Pendiente",
          comprobante: "comprobante_008.pdf",
          facturaGenerada: false,
          notaAdmin: "Pendiente de verificación"
        },
        {
          id: "9",
          referencia: "PAG-20250404-009",
          tipo: "Solicitud",
          descripcion: "Certificado de solvencia",
          colegiadoId: "3",
          colegiadoNombre: "Carlos Ramírez",
          colegiadoNumero: "ODV-3456",
          fecha: "04/04/2025",
          fechaCreacion: "2025-04-04T14:10:00",
          monto: 15,
          metodoPago: "Transferencia",
          estado: "Procesado",
          comprobante: "comprobante_009.pdf",
          facturaGenerada: true,
          facturaId: "FACT-006-2025",
          fechaProcesamiento: "05/04/2025",
          procesadoPor: "Admin",
          notaAdmin: "Pago verificado correctamente"
        },
        {
          id: "10",
          referencia: "PAG-20250403-010",
          tipo: "Solvencia",
          descripcion: "Solvencia mensual abril 2025",
          colegiadoId: "2",
          colegiadoNombre: "Juan Pérez",
          colegiadoNumero: "ODV-2345",
          fecha: "03/04/2025",
          fechaCreacion: "2025-04-03T11:25:00",
          monto: 30,
          metodoPago: "Zelle",
          estado: "Procesado",
          comprobante: "comprobante_010.pdf",
          facturaGenerada: true,
          facturaId: "FACT-007-2025",
          fechaProcesamiento: "04/04/2025",
          procesadoPor: "Admin",
          notaAdmin: "Pago verificado correctamente"
        }
      ]
      
      setPagos(pagosDePrueba)
      
      // Calcular estadísticas resumidas
      const totalPagos = pagosDePrueba.reduce((sum, pago) => pago.estado === "Procesado" ? sum + pago.monto : sum, 0)
      
      // Filtrar pagos del mes actual
      const hoy = new Date()
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      const pagosMes = pagosDePrueba.filter(pago => {
        const fechaPago = new Date(pago.fechaCreacion)
        return fechaPago >= inicioMes && pago.estado === "Procesado"
      })
      
      // Filtrar pagos de hoy
      const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
      const pagosHoy = pagosDePrueba.filter(pago => {
        const fechaPago = new Date(pago.fechaCreacion)
        return fechaPago >= inicioDia && pago.estado === "Procesado"
      })
      
      // Contar pagos pendientes
      const pagosPendientes = pagosDePrueba.filter(pago => pago.estado === "Pendiente").length
      
      setEstadisticas({
        totalPagos: totalPagos,
        ingresosMes: pagosMes.reduce((sum, pago) => sum + pago.monto, 0),
        ingresosHoy: pagosHoy.reduce((sum, pago) => sum + pago.monto, 0),
        pagosPendientes: pagosPendientes
      })
      
      setIsLoading(false)
    }, 1000)
  }, [])

  // Ordenar pagos
  const ordenarPagos = (pagos) => {
    return [...pagos].sort((a, b) => {
      if (ordenPor === "fechaDesc") {
        return new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
      } else if (ordenPor === "fechaAsc") {
        return new Date(a.fechaCreacion) - new Date(b.fechaCreacion)
      } else if (ordenPor === "montoDesc") {
        return b.monto - a.monto
      } else if (ordenPor === "montoAsc") {
        return a.monto - b.monto
      }
      return 0
    })
  }

  // Filtrar pagos basados en búsqueda y filtros
  const pagosFiltrados = ordenarPagos(pagos.filter(pago => {
    // Filtro de búsqueda
    const matchesSearch = 
      pago.referencia.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pago.colegiadoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.colegiadoNumero.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filtro por tipo de pago
    const matchesTipo = 
      filtroTipoPago === "todos" || 
      pago.tipo.toLowerCase() === filtroTipoPago.toLowerCase()
    
    // Filtro por estado
    const matchesEstado = 
      filtroEstado === "todos" || 
      pago.estado.toLowerCase() === filtroEstado.toLowerCase()
    
    // Filtro por fecha
    let matchesFecha = true
    const fechaPago = new Date(pago.fechaCreacion)
    const hoy = new Date()
    
    if (filtroFecha === "hoy") {
      const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
      matchesFecha = fechaPago >= inicioDia
    } else if (filtroFecha === "estaSemana") {
      const inicioSemana = new Date(hoy)
      inicioSemana.setDate(hoy.getDate() - hoy.getDay()) // Domingo como inicio de semana
      matchesFecha = fechaPago >= inicioSemana
    } else if (filtroFecha === "esteMes") {
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      matchesFecha = fechaPago >= inicioMes
    } else if (filtroFecha === "personalizado" && rangoFechas.desde && rangoFechas.hasta) {
      const desde = new Date(rangoFechas.desde)
      const hasta = new Date(rangoFechas.hasta)
      hasta.setHours(23, 59, 59, 999) // Incluir todo el día de fin
      matchesFecha = fechaPago >= desde && fechaPago <= hasta
    }
    
    return matchesSearch && matchesTipo && matchesEstado && matchesFecha
  }))

  // Función para ver detalle de un pago
  const verDetallePago = (id) => {
    setPagoSeleccionadoId(id)
    setVistaActual("detallePago")
  }

  // Función para volver a la lista
  const volverALista = () => {
    setVistaActual("lista")
    setPagoSeleccionadoId(null)
  }
  
  // Función para actualizar un pago
  const actualizarPago = (pagoActualizado) => {
    setPagos(prev => prev.map(p => 
      p.id === pagoActualizado.id ? pagoActualizado : p
    ))
  }
  
  // Función para cambiar el filtro de fecha
  const cambiarFiltroFecha = (filtro) => {
    setFiltroFecha(filtro)
    // Reiniciar rango de fechas si no es personalizado
    if (filtro !== "personalizado") {
      setRangoFechas({ desde: null, hasta: null })
    }
  }

  // Renderizado condicional basado en la vista actual
  if (vistaActual === "detallePago") {
    return (
      <DetallePago 
        pagoId={pagoSeleccionadoId} 
        onVolver={volverALista}
        pagos={pagos}
        actualizarPago={actualizarPago}
      />
    )
  }

  // Vista principal de lista
  return (
    <div className="w-full px-4 md:px-10 py-10 md:py-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-8 md:mb-10 mt-16 md:mt-22"
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
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
          Administre los pagos del sistema y genere reportes financieros
        </motion.p>
      </motion.div>

      {/* Estadísticas resumidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#C40180]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total pagos procesados</p>
              <p className="text-2xl font-bold text-gray-800">${estadisticas.totalPagos.toFixed(2)}</p>
            </div>
            <div className="bg-[#C40180] bg-opacity-10 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-[#C40180]" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Ingresos este mes</p>
              <p className="text-2xl font-bold text-gray-800">${estadisticas.ingresosMes.toFixed(2)}</p>
            </div>
            <div className="bg-green-500 bg-opacity-10 p-3 rounded-full">
              <BarChart className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Ingresos hoy</p>
              <p className="text-2xl font-bold text-gray-800">${estadisticas.ingresosHoy.toFixed(2)}</p>
            </div>
            <div className="bg-blue-500 bg-opacity-10 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Pagos pendientes</p>
              <p className="text-2xl font-bold text-gray-800">{estadisticas.pagosPendientes}</p>
            </div>
            <div className="bg-yellow-500 bg-opacity-10 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Barra de acciones: Búsqueda, filtros y botones de acción */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por referencia, colegiado o descripción..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowReporteModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-opacity w-full md:w-auto justify-center"
          >
            <PieChart size={18} />
            <span>Generar reportes</span>
          </button>
          
          <button 
            className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity w-full md:w-auto justify-center"
          >
            <Download size={18} />
            <span>Exportar datos</span>
          </button>
        </div>
      </div>

      {/* Filtros adicionales */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Filter size={16} className="mr-2 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtros</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por tipo de pago */}
          <div>
            <span className="text-xs text-gray-500 block mb-1">Tipo de pago</span>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroTipoPago === "todos" 
                    ? "bg-purple-100 text-purple-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroTipoPago("todos")}
              >
                Todos
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroTipoPago === "solicitud" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroTipoPago("solicitud")}
              >
                Solicitud
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroTipoPago === "inscripcion" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroTipoPago("inscripcion")}
              >
                Inscripción
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroTipoPago === "Solvencia" 
                    ? "bg-amber-100 text-amber-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroTipoPago("Solvencia")}
              >
                Solvencia
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroTipoPago === "curso" 
                    ? "bg-indigo-100 text-indigo-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroTipoPago("curso")}
              >
                Curso
              </button>
            </div>
          </div>
          
          {/* Filtro por estado */}
          <div>
            <span className="text-xs text-gray-500 block mb-1">Estado</span>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroEstado === "todos" 
                    ? "bg-purple-100 text-purple-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroEstado("todos")}
              >
                Todos
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroEstado === "procesado" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroEstado("procesado")}
              >
                Procesados
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroEstado === "pendiente" 
                    ? "bg-yellow-100 text-yellow-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroEstado("pendiente")}
              >
                Pendientes
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroEstado === "rechazado" 
                    ? "bg-red-100 text-red-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setFiltroEstado("rechazado")}
              >
                Rechazados
              </button>
            </div>
          </div>
          
          {/* Filtro por fecha */}
          <div>
            <span className="text-xs text-gray-500 block mb-1">Fecha</span>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroFecha === "todos" 
                    ? "bg-purple-100 text-purple-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => cambiarFiltroFecha("todos")}
              >
                Todos
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroFecha === "hoy" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => cambiarFiltroFecha("hoy")}
              >
                Hoy
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroFecha === "estaSemana" 
                    ? "bg-indigo-100 text-indigo-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => cambiarFiltroFecha("estaSemana")}
              >
                Esta semana
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroFecha === "esteMes" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => cambiarFiltroFecha("esteMes")}
              >
                Este mes
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroFecha === "personalizado" 
                    ? "bg-amber-100 text-amber-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => cambiarFiltroFecha("personalizado")}
              >
                Personalizado
              </button>
            </div>
            
            {/* Selector de rango de fechas personalizado */}
            {filtroFecha === "personalizado" && (
              <div className="mt-3 flex flex-wrap gap-2">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Desde</span>
                  <input
                    type="date"
                    className="border rounded-md px-2 py-1 text-sm"
                    value={rangoFechas.desde || ""}
                    onChange={(e) => setRangoFechas(prev => ({...prev, desde: e.target.value}))}
                  />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Hasta</span>
                  <input
                    type="date"
                    className="border rounded-md px-2 py-1 text-sm"
                    value={rangoFechas.hasta || ""}
                    onChange={(e) => setRangoFechas(prev => ({...prev, hasta: e.target.value}))}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Ordenamiento */}
          <div>
            <span className="text-xs text-gray-500 block mb-1">Ordenar por</span>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  ordenPor === "fechaDesc" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setOrdenPor("fechaDesc")}
              >
                Más recientes
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  ordenPor === "fechaAsc" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setOrdenPor("fechaAsc")}
              >
                Más antiguos
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  ordenPor === "montoDesc" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setOrdenPor("montoDesc")}
              >
                Mayor monto
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  ordenPor === "montoAsc" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setOrdenPor("montoAsc")}
              >
                Menor monto
              </button>
            </div>
          </div>
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
          {pagosFiltrados.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No se encontraron pagos con los criterios seleccionados
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo / Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Colegiado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pagosFiltrados.map((pago) => (
                    <tr key={pago.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{pago.referencia}</div>
                        <div className="text-xs text-gray-500">
                          {pago.metodoPago}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex mr-2 w-2 h-2 rounded-full ${
                            pago.tipo === 'Solicitud' 
                              ? 'bg-blue-500' 
                              : pago.tipo === 'Inscripción'
                                ? 'bg-green-500'
                                : pago.tipo === 'Solvencia'
                                  ? 'bg-amber-500'
                                  : 'bg-indigo-500'
                          }`}></span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{pago.tipo}</div>
                            <div className="text-xs text-gray-500">{pago.descripcion}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{pago.colegiadoNombre}</div>
                        <div className="text-xs text-gray-500">{pago.colegiadoNumero}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-500">{pago.fecha}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">${pago.monto.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          pago.estado === 'Procesado' 
                            ? 'bg-green-100 text-green-800' 
                            : pago.estado === 'Pendiente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {pago.estado}
                        </span>
                        
                        {pago.facturaGenerada && (
                          <div className="text-xs text-gray-500 mt-1">
                            Factura: {pago.facturaId}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {(pago.estado === 'Procesado' && pago.facturaGenerada) && (
                            <button className="text-blue-600 hover:text-blue-800">
                              <Printer size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => verDetallePago(pago.id)}
                            className="text-[#C40180] hover:text-[#590248] flex items-center justify-end gap-1"
                          >
                            {pago.estado === 'Pendiente' ? 'Revisar' : 'Ver'}
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      
      {/* Modal para generar reportes */}
      {showReporteModal && (
        <GenerarReporteModal 
          onClose={() => setShowReporteModal(false)}
          pagos={pagos}
        />
      )}
    </div>
  )
}