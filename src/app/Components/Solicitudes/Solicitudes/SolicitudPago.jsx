"use client";

import {useSolicitudesStore} from "@/store/SolicitudesStore";
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  History,
  Info,
  RefreshCw,
  X
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

// Constantes
const METODOS_PAGO = {
  1: 'Transferencia Bancaria',
  2: 'Pago Móvil',
  3: 'Efectivo',
  4: 'Tarjeta de Crédito',
  5: 'Zelle'
};

const ESTADOS_PAGO = {
  'aprobado': {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    texto: 'Aprobado'
  },
  'revisando': {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    texto: 'En Revisión'
  },
  'rechazado': {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: X,
    texto: 'Rechazado'
  }
};

// Hook personalizado para manejo de datos de solicitud
const useSolicitudData = (solicitudData) => {
  const [historialPagos, setHistorialPagos] = useState([]);
  const [error, setError] = useState(null);

  const formatearFecha = useCallback((fechaISO) => {
    if (!fechaISO) return "No especificada";
    try {
      return new Date(fechaISO).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (err) {
      console.error('Error al formatear fecha:', err);
      return "Fecha inválida";
    }
  }, []);

  const formatearMoneda = useCallback((monto) => {
    try {
      const valor = parseFloat(monto || 0);
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(valor);
    } catch (err) {
      console.error('Error al formatear moneda:', err);
      return '$0.00';
    }
  }, []);

  const procesarPagosHistorial = useCallback((pagos) => {
    if (!Array.isArray(pagos)) return [];

    try {
      return pagos.map(pago => {
        const montoUSD = pago.moneda === 'bs'
          ? parseFloat(pago.monto) / parseFloat(pago.tasa_bcv_del_dia || 1)
          : parseFloat(pago.monto || 0);

        // Verificar disponibilidad de campos de fecha
        const fechaDisponible = pago.fecha_pago || pago.created_at;

        return {
          ...pago,
          montoUSD,
          // Usar fecha_pago si está disponible, sino created_at, sino mostrar mensaje
          fechaFormateada: fechaDisponible
            ? formatearFecha(fechaDisponible)
            : "Fecha no disponible",
          metodoPagoNombre: pago.metodo_de_pago_nombre,
          estadoInfo: ESTADOS_PAGO[pago.status] || {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: FileText,
            texto: pago.status || 'Procesado'
          }
        };
      });
    } catch (err) {
      console.error('Error al procesar pagos:', err);
      setError('Error al procesar el historial de pagos');
      return [];
    }
  }, [formatearFecha]);

  // Memoizar los datos de entrada para evitar procesamiento innecesario
  const pagosData = useMemo(() => {
    return solicitudData?.pagos || [];
  }, [solicitudData?.pagos]);

  useEffect(() => {
    if (pagosData.length > 0) {
      const pagosProcesados = procesarPagosHistorial(pagosData);
      setHistorialPagos(pagosProcesados);
      setError(null);
    } else {
      setHistorialPagos([]);
    }
  }, [pagosData, procesarPagosHistorial]);

  return useMemo(() => ({
    historialPagos,
    error,
    formatearFecha,
    formatearMoneda,
  }), [historialPagos, error, formatearFecha, formatearMoneda]);
};

export default function SolicitudPago({ solicitudData, onRefreshData }) {
  // Estados principales
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Hook personalizado para datos de solicitud
  const {
    historialPagos,
    error: solicitudError,
    formatearFecha,
    formatearMoneda,
    obtenerNombreMetodoPago
  } = useSolicitudData(solicitudData);

  // Manejo de actualización de datos
  const handleRefreshData = useCallback(async () => {
    if (onRefreshData && typeof onRefreshData === 'function') {
      setIsRefreshing(true);
      try {
        await onRefreshData();
      } catch (error) {
        console.error('Error al refrescar datos:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [onRefreshData]);

  // Validaciones
  const hayPagos = historialPagos.length > 0;

  return (
    <div className="space-y-8 pb-8" id="solicitud-pagos">
      {/* Mensaje de error */}
      {solicitudError && (
        <div className="bg-white rounded-xl shadow-lg border border-red-200">
          <div className="flex items-center p-4 text-red-800 bg-red-50 rounded-lg">
            <X className="w-5 h-5 mr-3" />
            <div>
              <h4 className="font-medium">Error al cargar datos</h4>
              <p className="text-sm">{solicitudError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Información de estado de datos */}
      {!solicitudData && !solicitudError && (
        <div className="bg-white rounded-xl shadow-lg border border-blue-200">
          <div className="flex items-center p-4 text-blue-800 bg-blue-50 rounded-lg">
            <Info className="w-5 h-5 mr-3" />
            <div>
              <h4 className="font-medium">Información de Solicitud</h4>
              <p className="text-sm">No hay datos de solicitud disponibles.</p>
            </div>
          </div>
        </div>
      )}

      {/* Historial de Pagos */}
      {hayPagos && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#41023B] to-[#D7008A] flex items-center justify-center mr-4">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#41023B]">Historial de Pagos</h3>
                <p className="text-sm text-gray-600">
                  Registro completo de pagos realizados para esta solicitud
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <strong className="text-sm text-gray-800">Total de pagos: {historialPagos.length}</strong>
              </div>
              <button
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-[#D7008A] transition-colors disabled:opacity-50"
                title="Actualizar historial"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">Fecha</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">Método</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">Referencia</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">Monto</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {historialPagos.map((pago) => {
                  const IconoEstado = pago.estadoInfo.icon;

                  return (
                    <tr
                      key={pago.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4 text-sm text-gray-900 text-center">
                        <div className="flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className={pago.fechaFormateada === "Fecha no disponible"
                            ? "text-gray-400 italic text-xs"
                            : ""
                          }>
                            {pago.fechaFormateada}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 text-center">
                        <div className="flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                          {pago.metodoPagoNombre}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 text-center">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {pago.num_referencia && pago.num_referencia !== 'null' ? pago.num_referencia : 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="text-sm font-semibold text-green-600">
                          {formatearMoneda(pago.montoUSD)}
                        </div>
                        {pago.moneda === 'bs' && (
                          <div className="text-xs text-gray-500">
                            {parseFloat(pago.monto).toLocaleString('es-VE')} Bs
                            <div className="text-xs text-gray-400">
                              Tasa: {parseFloat(pago.tasa_bcv_del_dia).toFixed(2)}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${pago.estadoInfo.color}`}
                        >
                          <IconoEstado className="w-3 h-3 mr-1" />
                          {pago.estadoInfo.texto}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay pagos */}
      {!hayPagos && !solicitudError && solicitudData && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center py-8 text-gray-500">
            <History size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pagos registrados</h3>
            <p className="text-sm">Aún no se han registrado pagos para esta solicitud.</p>
          </div>
        </div>
      )}
    </div>
  );
} 