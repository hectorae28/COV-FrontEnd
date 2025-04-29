"use client"

import { AlertCircle, CheckCircle, ChevronLeft, CreditCard, Download, FileText, Search } from "lucide-react"
import { useEffect, useState } from "react"

export default function TablaPagos({ colegiadoId, onVolver }) {
  const [pagos, setPagos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Simulación de carga de datos
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        // Simulamos la carga con un setTimeout
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Datos de ejemplo
        setPagos([
          {
            id: "1",
            concepto: "Cuota anual 2024",
            referencia: "REF-AN-2024",
            fecha: "15/01/2024",
            monto: 120.00,
            estado: "Pagado",
            metodoPago: "Tarjeta de crédito",
            comprobante: true
          },
          {
            id: "2",
            concepto: "Inscripción curso de ortodoncia",
            referencia: "REF-CURSO-052",
            fecha: "05/02/2024",
            monto: 85.00,
            estado: "Pagado",
            metodoPago: "Transferencia bancaria",
            comprobante: true
          },
          {
            id: "3",
            concepto: "Renovación de carnet",
            referencia: "REF-CARNET-2024",
            fecha: "27/02/2024",
            monto: 30.00,
            estado: "Pagado",
            metodoPago: "Zelle",
            comprobante: true
          },
          {
            id: "4",
            concepto: "Constancia de solvencia",
            referencia: "REF-CONST-2024",
            fecha: "10/03/2024",
            monto: 20.00,
            estado: "Pagado",
            metodoPago: "Transferencia bancaria",
            comprobante: true
          },
          {
            id: "5",
            concepto: "Cuota extraordinaria 2024",
            referencia: "REF-EXTRA-2024",
            fecha: "01/04/2024",
            monto: 50.00,
            estado: "Pendiente",
            metodoPago: "-",
            comprobante: false
          }
        ])
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error al cargar los pagos:", error)
        setIsLoading(false)
      }
    }
    
    fetchPagos()
  }, [colegiadoId])

  // Filtrar pagos según el término de búsqueda
  const pagosFiltrados = pagos.filter(pago => 
    pago.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pago.referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pago.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pago.estado.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calcular el total pagado y pendiente
  const totalPagado = pagos
    .filter(pago => pago.estado === "Pagado")
    .reduce((suma, pago) => suma + pago.monto, 0)
    
  const totalPendiente = pagos
    .filter(pago => pago.estado === "Pendiente")
    .reduce((suma, pago) => suma + pago.monto, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Pagos y cuotas</h3>
          <p className="text-sm text-gray-500 mt-1">Historial de pagos y estado de cuotas</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar pago..."
              className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          <button className="bg-[#C40180] text-white px-4 py-2 rounded-md hover:bg-[#590248] transition-colors flex items-center justify-center gap-2">
            <CreditCard size={18} />
            <span>Registrar pago</span>
          </button>
        </div>
      </div>
      
      {/* Resumen de pagos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total pagado</p>
          <p className="text-xl font-semibold text-green-600">${totalPagado.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Pendiente por pagar</p>
          <p className="text-xl font-semibold text-red-600">${totalPendiente.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Estado general</p>
          <p className={`text-lg font-semibold flex items-center ${totalPendiente > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
            {totalPendiente > 0 ? (
              <>
                <AlertCircle size={18} className="mr-1" />
                Pagos pendientes
              </>
            ) : (
              <>
                <CheckCircle size={18} className="mr-1" />
                Al día
              </>
            )}
          </p>
        </div>
      </div>
      
      {/* Tabla de pagos */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
        </div>
      ) : (
        <>
          {pagosFiltrados.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="flex justify-center mb-4">
                <CreditCard size={48} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-500">No se encontraron pagos</h3>
              <p className="text-gray-400 mt-1">No hay registros de pago que coincidan con tu búsqueda</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Concepto
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referencia
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pagosFiltrados.map((pago) => (
                      <tr key={pago.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="font-medium text-gray-900">{pago.concepto}</div>
                          <div className="text-sm text-gray-500">{pago.metodoPago}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                          {pago.referencia}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                          {pago.fecha}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm font-medium text-gray-900">
                            ${pago.monto.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            pago.estado === 'Pagado' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {pago.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center space-x-2">
                            {pago.comprobante && (
                              <button className="text-blue-600 hover:text-blue-800">
                                <Download size={18} />
                              </button>
                            )}
                            <button className="text-purple-600 hover:text-purple-800">
                              <FileText size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Botón para volver */}
      {onVolver && (
        <div className="mt-6">
          <button
            onClick={onVolver}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            <span>Volver a la lista</span>
          </button>
        </div>
      )}
    </div>
  )
}