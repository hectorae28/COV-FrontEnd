"use client"

import { motion } from "framer-motion"
import {
  BarChart,
  Clock,
  CreditCard,
  DollarSign,
  Search
} from "lucide-react"
import { useEffect, useState } from "react"
import DetallePago from "../../../Components/Solicitudes/Pagos/DetallePago"

export default function ListaPagos() {
  // Estados para manejar los datos
  const [pagos, setPagos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Estados para la navegación interna
  const [vistaActual, setVistaActual] = useState("lista") // lista, detallePago
  const [pagoSeleccionadoId, setPagoSeleccionadoId] = useState(null)
  
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
          tipo: "Solicitud",
          descripcion: "Constancia de inscripción",
          fecha: "15/04/2025",
          fechaCreacion: "2025-04-15T10:30:00",
          monto: 20,
          metodoPago: "Transferencia",
          estado: "Procesado",
          comprobante: "comprobante_001.pdf",
          fechaProcesamiento: "15/04/2025",
          procesadoPor: "Admin",
          notaAdmin: "Pago verificado correctamente"
        },
        {
          id: "2",
          tipo: "Inscripción",
          descripcion: "Inscripción anual",
          fecha: "14/04/2025",
          fechaCreacion: "2025-04-14T14:20:00",
          monto: 100,
          metodoPago: "Depósito Bancario",
          estado: "Procesado",
          comprobante: "comprobante_002.pdf",
          fechaProcesamiento: "14/04/2025",
          procesadoPor: "Admin",
          notaAdmin: "Pago verificado correctamente"
        },
        {
          id: "3",
          tipo: "Solvencia",
          descripcion: "Solvencia mensual abril 2025",
          fecha: "13/04/2025",
          fechaCreacion: "2025-04-13T09:15:00",
          monto: 30,
          metodoPago: "Zelle",
          estado: "Pendiente",
          comprobante: "comprobante_003.pdf",
          notaAdmin: "Pendiente de verificación"
        },
        {
          id: "4",
          tipo: "Curso",
          descripcion: "Curso de actualización en endodoncia",
          fecha: "10/04/2025",
          fechaCreacion: "2025-04-10T16:45:00",
          monto: 150,
          metodoPago: "Transferencia",
          estado: "Procesado",
          comprobante: "comprobante_004.pdf",
          fechaProcesamiento: "11/04/2025",
          procesadoPor: "Admin",
          notaAdmin: "Pago verificado correctamente"
        },
        {
          id: "5",
          tipo: "Solicitud",
          descripcion: "Registro de especialidad",
          fecha: "09/04/2025",
          fechaCreacion: "2025-04-09T11:30:00",
          monto: 50,
          metodoPago: "Pago móvil",
          estado: "Rechazado",
          comprobante: "comprobante_005.pdf",
          fechaRechazo: "10/04/2025",
          rechazadoPor: "Admin",
          motivoRechazo: "Comprobante ilegible"
        },
        {
          id: "6",
          tipo: "Inscripción",
          descripcion: "Inscripción anual",
          fecha: "07/04/2025",
          fechaCreacion: "2025-04-07T10:00:00",
          monto: 100,
          metodoPago: "Transferencia",
          estado: "Procesado",
          comprobante: "comprobante_006.pdf",
          fechaProcesamiento: "08/04/2025",
          procesadoPor: "Admin",
          notaAdmin: "Pago verificado correctamente"
        },
        {
          id: "7",
          tipo: "Solvencia",
          descripcion: "Solvencia mensual abril 2025",
          fecha: "06/04/2025",
          fechaCreacion: "2025-04-06T15:20:00",
          monto: 30,
          metodoPago: "Transferencia",
          estado: "Procesado",
          comprobante: "comprobante_007.pdf",
          fechaProcesamiento: "07/04/2025",
          procesadoPor: "Admin",
          notaAdmin: "Pago verificado correctamente"
        },
        {
          id: "8",
          tipo: "Curso",
          descripcion: "Taller de odontopediatría",
          fecha: "05/04/2025",
          fechaCreacion: "2025-04-05T09:45:00",
          monto: 120,
          metodoPago: "Depósito Bancario",
          estado: "Pendiente",
          comprobante: "comprobante_008.pdf",
          notaAdmin: "Pendiente de verificación"
        },
        {
          id: "9",
          tipo: "Solicitud",
          descripcion: "Certificado de solvencia",
          fecha: "04/04/2025",
          fechaCreacion: "2025-04-04T14:10:00",
          monto: 15,
          metodoPago: "Transferencia",
          estado: "Procesado",
          comprobante: "comprobante_009.pdf",
          fechaProcesamiento: "05/04/2025",
          procesadoPor: "Admin",
          notaAdmin: "Pago verificado correctamente"
        },
        {
          id: "10",
          tipo: "Solvencia",
          descripcion: "Solvencia mensual abril 2025",
          fecha: "03/04/2025",
          fechaCreacion: "2025-04-03T11:25:00",
          monto: 30,
          metodoPago: "Zelle",
          estado: "Procesado",
          comprobante: "comprobante_010.pdf",
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

  // Filtrar pagos basados en búsqueda
  const pagosFiltrados = pagos.filter(pago => {
    // Filtro de búsqueda
    const matchesSearch = 
      pago.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.metodoPago.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

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

      {/* Barra de búsqueda */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por tipo, descripción o método de pago..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#C40180]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pagosFiltrados.map((pago) => (
                    <tr 
                      key={pago.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => verDetallePago(pago.id)}
                    >
                                             <td className="px-6 py-4 whitespace-nowrap text-center">
                         <div className="flex items-center justify-center">
                           <span className={`inline-flex mr-2 w-2 h-2 rounded-full ${
                             pago.tipo === 'Solicitud' 
                               ? 'bg-blue-500' 
                               : pago.tipo === 'Inscripción'
                                 ? 'bg-green-500'
                                 : pago.tipo === 'Solvencia'
                                   ? 'bg-amber-500'
                                   : 'bg-indigo-500'
                           }`}></span>
                           <div className="text-sm font-medium text-gray-900">{pago.tipo}</div>
                         </div>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell text-center">
                        <div className="text-sm text-gray-500">{pago.fecha}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">${pago.monto.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          pago.estado === 'Procesado' 
                            ? 'bg-green-100 text-green-800' 
                            : pago.estado === 'Pendiente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {pago.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}