"use client"

import { BarChart, Clock, CreditCard, DollarSign } from "lucide-react"

export default function PagosEstadisticas({ estadisticas, contarPagosPorEstado }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#C40180]">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Total Ingresos Procesados</p>
                        <p className="text-2xl font-bold text-gray-800">
                            ${estadisticas.totalPagos.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                        <p className="text-xs text-white mt-1">
                            {contarPagosPorEstado.aprobados} pagos aprobados
                        </p>
                    </div>
                    <div className="bg-[#C40180] bg-opacity-10 p-3 rounded-full">
                        <DollarSign className="h-6 w-6 text-[#C40180]" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Ingresos Este Mes</p>
                        <p className="text-2xl font-bold text-gray-800">
                            ${estadisticas.ingresosMes.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="bg-green-500 bg-opacity-10 p-3 rounded-full">
                        <BarChart className="h-6 w-6 text-green-500" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Ingresos Hoy</p>
                        <p className="text-2xl font-bold text-gray-800">
                            ${estadisticas.ingresosHoy.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {new Date().toLocaleDateString('es-ES', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'short'
                            })}
                        </p>
                    </div>
                    <div className="bg-blue-500 bg-opacity-10 p-3 rounded-full">
                        <CreditCard className="h-6 w-6 text-blue-500" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Ingresos por Aprobar</p>
                        <p className="text-2xl font-bold text-gray-800">
                            ${(estadisticas.ingresosPendientes || 0).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                        <p className="text-xs text-white mt-1">
                            {estadisticas.pagosPorAprobar} pagos ({estadisticas.pagosPendientes} pendientes + {estadisticas.pagosEnRevision} en revisión)
                        </p>
                    </div>
                    <div className="bg-yellow-500 bg-opacity-10 p-3 rounded-full">
                        <Clock className="h-6 w-6 text-yellow-500" />
                    </div>
                </div>
            </div>
        </div>
    )
}