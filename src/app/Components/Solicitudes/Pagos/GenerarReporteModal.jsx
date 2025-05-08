"use client"

import { useState } from "react"
import { 
  X, 
  PieChart, 
  BarChart, 
  LineChart,
  Download,
  FileText,
  Filter,
  Printer
} from "lucide-react"

export default function GenerarReporteModal({ onClose, pagos }) {
  const [tipoReporte, setTipoReporte] = useState("ingresosGenerales")
  const [filtroFecha, setFiltroFecha] = useState("todos")
  const [rangoFechas, setRangoFechas] = useState({ desde: null, hasta: null })
  const [filtroTipoPago, setFiltroTipoPago] = useState("todos")
  const [isGenerating, setIsGenerating] = useState(false)
  const [reporteGenerado, setReporteGenerado] = useState(false)
  
  // Datos calculados para los reportes
  const [datosReporte, setDatosReporte] = useState({
    totalIngresos: 0,
    totalPagosProcesados: 0,
    totalPagosPendientes: 0,
    totalPagosRechazados: 0,
    ingresosPorTipo: {},
    ingresosPorMes: {},
    pagosPorColegiado: {}
  })

  // Opciones de reportes disponibles
  const tiposReporte = [
    { id: "ingresosGenerales", nombre: "Ingresos generales", icono: <BarChart size={20} /> },
    { id: "ingresosPorTipo", nombre: "Ingresos por tipo de pago", icono: <PieChart size={20} /> },
    { id: "ingresosPorMes", nombre: "Ingresos mensuales", icono: <LineChart size={20} /> },
    { id: "pagosPorColegiado", nombre: "Pagos por colegiado", icono: <FileText size={20} /> }
  ]
  
  // Generar datos para el reporte
  const generarDatosReporte = () => {
    setIsGenerating(true)
    
    // Simulamos un tiempo de procesamiento
    setTimeout(() => {
      // Filtrar pagos según los criterios seleccionados
      let pagosFiltrados = [...pagos]
      
      // Filtrar por fecha
      if (filtroFecha !== "todos") {
        const hoy = new Date()
        
        if (filtroFecha === "esteMes") {
          const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
          pagosFiltrados = pagosFiltrados.filter(pago => new Date(pago.fechaCreacion) >= inicioMes)
        } else if (filtroFecha === "ultimosTresMeses") {
          const inicioTresMeses = new Date(hoy)
          inicioTresMeses.setMonth(hoy.getMonth() - 3)
          pagosFiltrados = pagosFiltrados.filter(pago => new Date(pago.fechaCreacion) >= inicioTresMeses)
        } else if (filtroFecha === "esteAnio") {
          const inicioAnio = new Date(hoy.getFullYear(), 0, 1)
          pagosFiltrados = pagosFiltrados.filter(pago => new Date(pago.fechaCreacion) >= inicioAnio)
        } else if (filtroFecha === "personalizado" && rangoFechas.desde && rangoFechas.hasta) {
          const desde = new Date(rangoFechas.desde)
          const hasta = new Date(rangoFechas.hasta)
          hasta.setHours(23, 59, 59, 999)
          pagosFiltrados = pagosFiltrados.filter(pago => {
            const fechaPago = new Date(pago.fechaCreacion)
            return fechaPago >= desde && fechaPago <= hasta
          })
        }
      }
      
      // Filtrar por tipo de pago
      if (filtroTipoPago !== "todos") {
        pagosFiltrados = pagosFiltrados.filter(pago => 
          pago.tipo.toLowerCase() === filtroTipoPago.toLowerCase()
        )
      }
      
      // Calcular estadísticas generales
      const totalIngresos = pagosFiltrados
        .filter(pago => pago.estado === "Procesado")
        .reduce((sum, pago) => sum + pago.monto, 0)
        
      const totalPagosProcesados = pagosFiltrados.filter(pago => pago.estado === "Procesado").length
      const totalPagosPendientes = pagosFiltrados.filter(pago => pago.estado === "Pendiente").length
      const totalPagosRechazados = pagosFiltrados.filter(pago => pago.estado === "Rechazado").length
      
      // Calcular ingresos por tipo de pago
      const ingresosPorTipo = {}
      pagosFiltrados
        .filter(pago => pago.estado === "Procesado")
        .forEach(pago => {
          ingresosPorTipo[pago.tipo] = (ingresosPorTipo[pago.tipo] || 0) + pago.monto
        })

      // Calcular ingresos por mes
      const ingresosPorMes = {}
      pagosFiltrados
        .filter(pago => pago.estado === "Procesado")
        .forEach(pago => {
          const fecha = new Date(pago.fechaCreacion)
          const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
          ingresosPorMes[mes] = (ingresosPorMes[mes] || 0) + pago.monto
        })
        
      // Calcular pagos por colegiado
      const pagosPorColegiado = {}
      pagosFiltrados
        .filter(pago => pago.estado === "Procesado")
        .forEach(pago => {
          if (!pagosPorColegiado[pago.colegiadoId]) {
            pagosPorColegiado[pago.colegiadoId] = {
              nombre: pago.colegiadoNombre,
              numero: pago.colegiadoNumero,
              total: 0,
              pagos: []
            }
          }
          
          pagosPorColegiado[pago.colegiadoId].total += pago.monto
          pagosPorColegiado[pago.colegiadoId].pagos.push({
            fecha: pago.fecha,
            monto: pago.monto,
            tipo: pago.tipo,
            descripcion: pago.descripcion
          })
        })
      
      setDatosReporte({
        totalIngresos,
        totalPagosProcesados,
        totalPagosPendientes,
        totalPagosRechazados,
        ingresosPorTipo,
        ingresosPorMes,
        pagosPorColegiado
      })
      
      setIsGenerating(false)
      setReporteGenerado(true)
    }, 1000)
  }
  
  // Obtener texto de período para el reporte
  const obtenerTextoPeriodo = () => {
    if (filtroFecha === "todos") return "Todo el período"
    if (filtroFecha === "esteMes") return "Este mes"
    if (filtroFecha === "ultimosTresMeses") return "Últimos tres meses"
    if (filtroFecha === "esteAnio") return "Este año"
    if (filtroFecha === "personalizado" && rangoFechas.desde && rangoFechas.hasta) {
      return `Del ${rangoFechas.desde} al ${rangoFechas.hasta}`
    }
    return ""
  }

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Generación de reportes financieros</h2>
          <button 
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Selección de tipo de reporte */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de reporte
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {tiposReporte.map(tipo => (
                <div 
                  key={tipo.id}
                  className={`
                    border rounded-md p-3 cursor-pointer transition-colors
                    ${tipoReporte === tipo.id 
                      ? 'border-[#C40180] bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => setTipoReporte(tipo.id)}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`${tipoReporte === tipo.id ? 'text-[#C40180]' : 'text-gray-500'}`}>
                      {tipo.icono}
                    </div>
                    <span className="font-medium">{tipo.nombre}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Filtros para el reporte */}
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <div className="flex items-center mb-4">
              <Filter size={16} className="mr-2 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-700">Filtros del reporte</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Filtro de período */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Período</label>
                <select
                  className="cursor-pointer w-full border border-gray-300 rounded-md p-2 text-sm"
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                >
                  <option value="todos">Todo el período</option>
                  <option value="esteMes">Este mes</option>
                  <option value="ultimosTresMeses">Últimos 3 meses</option>
                  <option value="esteAnio">Este año</option>
                  <option value="personalizado">Personalizado</option>
                </select>
                
                {filtroFecha === "personalizado" && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <label className=" block text-xs text-gray-500 mb-1">Desde</label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-md p-1 text-sm"
                        value={rangoFechas.desde || ""}
                        onChange={(e) => setRangoFechas(prev => ({...prev, desde: e.target.value}))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Hasta</label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-md p-1 text-sm"
                        value={rangoFechas.hasta || ""}
                        onChange={(e) => setRangoFechas(prev => ({...prev, hasta: e.target.value}))}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Filtro de tipo de pago */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tipo de pago</label>
                <select
                  className="cursor-pointer w-full border border-gray-300 rounded-md p-2 text-sm"
                  value={filtroTipoPago}
                  onChange={(e) => setFiltroTipoPago(e.target.value)}
                >
                  <option value="todos">Todos los tipos</option>
                  <option value="solicitud">Solicitudes</option>
                  <option value="inscripcion">Inscripciones</option>
                  <option value="Solvencia">Solvencia mensual</option>
                  <option value="curso">Cursos</option>
                </select>
              </div>
              
              {/* Botón para generar reporte */}
              <div className="flex items-end">
                <button
                  onClick={generarDatosReporte}
                  disabled={isGenerating || (filtroFecha === "personalizado" && (!rangoFechas.desde || !rangoFechas.hasta))}
                  className={`cursor-pointer w-full bg-[#C40180] text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 ${
                    isGenerating || (filtroFecha === "personalizado" && (!rangoFechas.desde || !rangoFechas.hasta))
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:bg-[#590248] transition-colors'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <FileText size={18} />
                      <span>Generar reporte</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Previsualización del reporte */}
          {reporteGenerado && (
            <div className="border rounded-lg overflow-hidden">
              {/* Encabezado del reporte */}
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">
                    {tiposReporte.find(t => t.id === tipoReporte)?.nombre}
                  </h3>
                  <div className="text-sm text-gray-500">
                    Período: {obtenerTextoPeriodo()}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Generado el: {new Date().toLocaleString()}
                </div>
              </div>
              
              {/* Contenido del reporte */}
              <div className="p-4">
                {/* Estadísticas generales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                    <p className="text-xs text-gray-500">Total ingresos</p>
                    <p className="text-xl font-bold text-gray-800">${datosReporte.totalIngresos.toFixed(2)}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-md border border-green-200">
                    <p className="text-xs text-gray-500">Pagos procesados</p>
                    <p className="text-xl font-bold text-gray-800">{datosReporte.totalPagosProcesados}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                    <p className="text-xs text-gray-500">Pagos pendientes</p>
                    <p className="text-xl font-bold text-gray-800">{datosReporte.totalPagosPendientes}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-md border border-red-200">
                    <p className="text-xs text-gray-500">Pagos rechazados</p>
                    <p className="text-xl font-bold text-gray-800">{datosReporte.totalPagosRechazados}</p>
                  </div>
                </div>
                
                {/* Contenido específico según el tipo de reporte */}
                {tipoReporte === "ingresosGenerales" && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Resumen de ingresos</h4>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Métrica</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Total ingresos
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                            ${datosReporte.totalIngresos.toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Promedio por pago
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                            ${datosReporte.totalPagosProcesados > 0 ? (datosReporte.totalIngresos / datosReporte.totalPagosProcesados).toFixed(2) : "0.00"}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Total pagos procesados
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                            {datosReporte.totalPagosProcesados}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                
                {tipoReporte === "ingresosPorTipo" && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Ingresos por tipo de pago</h4>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de pago</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Porcentaje</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(datosReporte.ingresosPorTipo).map(([tipo, monto]) => (
                          <tr key={tipo}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {tipo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                              ${monto.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                              {((monto / datosReporte.totalIngresos) * 100).toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {/* Aquí podríamos incluir un gráfico de torta para una mejor visualización */}
                    <div className="mt-4 h-64 bg-gray-100 rounded-md flex items-center justify-center">
                      <div className="text-gray-500 text-sm">
                        Visualización gráfica (gráfico circular)
                      </div>
                    </div>
                  </div>
                )}
                
                {tipoReporte === "ingresosPorMes" && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Ingresos mensuales</h4>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mes</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(datosReporte.ingresosPorMes)
                          .sort(([mesA], [mesB]) => mesB.localeCompare(mesA))
                          .map(([mes, monto]) => {
                            const [anio, numMes] = mes.split('-')
                            const nombreMes = new Date(parseInt(anio), parseInt(numMes) - 1, 1).toLocaleString('default', { month: 'long' })
                            return (
                              <tr key={mes}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {nombreMes} {anio}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                                  ${monto.toFixed(2)}
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                    
                    {/* Aquí podríamos incluir un gráfico de líneas para una mejor visualización */}
                    <div className="mt-4 h-64 bg-gray-100 rounded-md flex items-center justify-center">
                      <div className="text-gray-500 text-sm">
                        Visualización gráfica (gráfico de líneas)
                      </div>
                    </div>
                  </div>
                )}
                
                {tipoReporte === "pagosPorColegiado" && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Pagos por colegiado</h4>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Colegiado</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total pagado</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pagos</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(datosReporte.pagosPorColegiado)
                          .sort(([, a], [, b]) => b.total - a.total)
                          .map(([colegiadoId, datos]) => (
                            <tr key={colegiadoId}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {datos.nombre}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {datos.numero}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                                ${datos.total.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                                {datos.pagos.length}
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Botones de acciones */}
        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 mr-3"
          >
            Cancelar
          </button>
          
          {reporteGenerado && (
            <>
              <button className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-3 flex items-center gap-2">
                <Download size={18} />
                <span>Exportar</span>
              </button>
              
              <button className="cursor-pointer px-4 py-2 bg-[#C40180] text-white rounded-md hover:bg-[#590248] flex items-center gap-2">
                <Printer size={18} />
                <span>Imprimir</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}