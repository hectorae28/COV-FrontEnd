"use client"

import { AlertCircle, CheckCircle, ChevronLeft, CreditCard, Download, FileText, Search } from "lucide-react"
import { useEffect, useState } from "react"
import ListaColegiadosData from "@/app/Models/PanelControl/Solicitudes/ListaColegiadosData"

export default function TablaPagos({ colegiadoId, onVolver }) {
  // Get data from ListaColegiadosData store
  const getPagos = ListaColegiadosData(state => state.getPagos)
  const addPago = ListaColegiadosData(state => state.addPago)
  const colegiado = ListaColegiadosData(state => state.getColegiado(colegiadoId))

  // Local state
  const [pagos, setPagos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showRegistroPago, setShowRegistroPago] = useState(false)
  const [nuevoPago, setNuevoPago] = useState({
    concepto: "",
    referencia: "",
    monto: "",
    metodoPago: "Transferencia bancaria"
  })

  // Load payments from the centralized store
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        // Simulating a bit of loading time
        await new Promise(resolve => setTimeout(resolve, 500))

        // Get payments for this colegiado from ListaColegiadosData
        const pagosColegiado = getPagos(colegiadoId)
        setPagos(pagosColegiado)

        setIsLoading(false)
      } catch (error) {
        console.error("Error al cargar los pagos:", error)
        setIsLoading(false)
      }
    }

    fetchPagos()
  }, [colegiadoId, getPagos])

  // Function to register a new payment
  const handleRegistrarPago = () => {
    if (!nuevoPago.concepto || !nuevoPago.referencia || !nuevoPago.monto) {
      alert("Por favor complete todos los campos requeridos")
      return
    }

    const pagoParaRegistrar = {
      ...nuevoPago,
      fecha: new Date().toLocaleDateString(),
      estado: "Pagado",
      monto: parseFloat(nuevoPago.monto),
      comprobante: false
    }

    // Add payment to the centralized store
    addPago(colegiadoId, pagoParaRegistrar)

    // Update local state
    setPagos([...pagos, {
      id: `${colegiadoId}-${pagos.length + 1}`,
      ...pagoParaRegistrar
    }])

    // Reset form
    setNuevoPago({
      concepto: "",
      referencia: "",
      monto: "",
      metodoPago: "Transferencia bancaria"
    })

    // Close form
    setShowRegistroPago(false)
  }

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

          <button
            onClick={() => setShowRegistroPago(true)}
            className="bg-[#C40180] text-white px-4 py-2 rounded-md hover:bg-[#590248] transition-colors flex items-center justify-center gap-2"
          >
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pago.estado === 'Pagado'
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

      {/* Modal para registrar nuevo pago */}
      {showRegistroPago && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Registrar nuevo pago</h2>
              <button
                onClick={() => setShowRegistroPago(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Colegiado</label>
                <p className="text-gray-700 font-medium">{colegiado?.nombre}</p>
                <p className="text-sm text-gray-500">{colegiado?.numeroRegistro} · {colegiado?.cedula}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Concepto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nuevoPago.concepto}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, concepto: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Ej: Cuota anual 2024"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referencia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nuevoPago.referencia}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, referencia: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Ej: REF-12345"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={nuevoPago.monto}
                    onChange={(e) => setNuevoPago({ ...nuevoPago, monto: e.target.value })}
                    className="w-full pl-8 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de pago
                </label>
                <select
                  value={nuevoPago.metodoPago}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, metodoPago: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Transferencia bancaria">Transferencia bancaria</option>
                  <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                  <option value="Zelle">Zelle</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Pago móvil">Pago móvil</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end p-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={() => setShowRegistroPago(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 mr-3"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleRegistrarPago}
                className="px-6 py-2 bg-[#C40180] text-white rounded-md hover:bg-[#590248] transition-colors"
              >
                Registrar pago
              </button>
            </div>
          </div>
        </div>
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