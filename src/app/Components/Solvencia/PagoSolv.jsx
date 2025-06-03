"use client";

import { fetchMe } from "@/api/endpoints/colegiado";
import { pagoSolvencia, pagoSolvenciaEspecial } from "@/api/endpoints/solicitud";
import PagosColg from "@/app/Components/PagosModal";
import useColegiadoUserStore from "@/store/colegiadoUserStore";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Crown,
  DollarSign,
  FileText,
  History,
  Info,
  RefreshCw,
  ShoppingCart,
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

// Hook personalizado para manejo de datos de solvencia
const useSolvenciaData = (solvenciaData) => {
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

  const obtenerNombreMetodoPago = useCallback((metodoId) => {
    return METODOS_PAGO[metodoId] || 'Método no especificado';
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
          metodoPagoNombre: obtenerNombreMetodoPago(pago.metodo_de_pago),
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
  }, [formatearFecha, obtenerNombreMetodoPago]);

  // Memoizar los datos de entrada para evitar procesamiento innecesario
  const pagosData = useMemo(() => {
    return solvenciaData?.pagos_solicitud_solvencia || [];
  }, [solvenciaData?.pagos_solicitud_solvencia]);

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
    obtenerNombreMetodoPago
  }), [historialPagos, error, formatearFecha, formatearMoneda, obtenerNombreMetodoPago]);
};

export default function SolvenciaPago({ props, solvenciaData, onRefreshData }) {
  // Estados principales
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Store - Selectores separados para evitar bucle infinito
  const colegiadoUser = useColegiadoUserStore((state) => state.colegiadoUser);
  const setColegiadoUser = useColegiadoUserStore((state) => state.setColegiadoUser);

  const { setActiveTab } = props || {};

  // Hook personalizado para datos de solvencia
  const {
    historialPagos,
    error: solvenciaError,
    formatearFecha,
    formatearMoneda,
    obtenerNombreMetodoPago
  } = useSolvenciaData(solvenciaData);

  // Configurar tipo de solvencia basado en el backend o valor por defecto
  const tipoSolvenciaConfigurado = useMemo(() => {
    // Si hay datos de solvencia y tiene un tipo definido, usar ese
    if (solvenciaData?.tipo) {
      return solvenciaData.tipo;
    }
    // Si no, usar trimestral como valor por defecto
    return 'trimestral';
  }, [solvenciaData?.tipo]);

  // Estado para el tipo seleccionado, inicializado con el valor del backend
  const [tipoSolvenciaSeleccionada, setTipoSolvenciaSeleccionada] = useState(tipoSolvenciaConfigurado);

  // Determinar si el tipo puede ser cambiado (solo si no hay tipo definido en el backend)
  const puedecambiarTipo = useMemo(() => {
    // Si ya hay un tipo definido en el backend, no se puede cambiar
    return !solvenciaData?.tipo && historialPagos.length == 0 && solvenciaData?.status !== 'costo_especial';
  }, [solvenciaData?.tipo]);

  // Actualizar el tipo seleccionado cuando cambien los datos del backend
  useEffect(() => {
    if (solvenciaData?.tipo) {
      setTipoSolvenciaSeleccionada(solvenciaData.tipo);
    }
  }, [solvenciaData?.tipo]);

  // Información del trimestre actual optimizada
  const infoTrimestre = useMemo(() => {
    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1;
    const anoActual = ahora.getFullYear();

    let trimestreActual;
    let esUltimoTrimestre = false;

    if (mesActual >= 1 && mesActual <= 3) {
      trimestreActual = 1;
    } else if (mesActual >= 4 && mesActual <= 6) {
      trimestreActual = 2;
    } else if (mesActual >= 7 && mesActual <= 9) {
      trimestreActual = 3;
    } else {
      trimestreActual = 4;
      esUltimoTrimestre = true;
    }

    return {
      trimestre: trimestreActual,
      ano: anoActual,
      esUltimoTrimestre,
      nombreTrimestre: `${trimestreActual}° Trimestre ${anoActual}`
    };
  }, []);

  // Cálculo de costos optimizado
  const calcularCosto = useCallback((tipo) => {
    if (!colegiadoUser) return 0;

    if (tipo === 'trimestral') {
      return colegiadoUser.costo_de_solvencia || 0;
    } else if (tipo === 'anual') {
      return colegiadoUser.costo_de_solvencia_anual || (colegiadoUser.costo_de_solvencia * 4) || 0;
    }
    return 0;
  }, [colegiadoUser?.costo_de_solvencia, colegiadoUser?.costo_de_solvencia_anual]);

  // Obtener datos de resumen optimizado
  const datosResumen = useMemo(() => {
    const costoTotal = calcularCosto(tipoSolvenciaSeleccionada);
    const montoPagadoBackend = parseFloat(solvenciaData?.monto_pagado || 0);
    const montoRestante = Math.max(0, costoTotal - montoPagadoBackend);

    return {
      total: costoTotal,
      pagado: montoPagadoBackend,
      restante: montoRestante,
      porcentajePagado: costoTotal > 0 ? (montoPagadoBackend / costoTotal) * 100 : 0
    };
  }, [calcularCosto, tipoSolvenciaSeleccionada, solvenciaData?.monto_pagado]);

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

  // Manejo de pagos optimizado
  const handlePagoSolvencia = useCallback(async (detallesPagoSolvencia) => {
    try {
      // Agregar el tipo de solvencia a los detalles del pago
      const detallesPagoConTipo = {
        ...detallesPagoSolvencia,
        tipo: tipoSolvenciaSeleccionada
      };

      const pagoFunction = colegiadoUser?.requiere_solvencia_esp
        ? pagoSolvenciaEspecial
        : pagoSolvencia;

      const pagoResult = await pagoFunction(detallesPagoConTipo);

      // Actualizar datos del colegiado
      const colegiadoResult = await fetchMe();
      setColegiadoUser(colegiadoResult.data);

      setShowPagoModal(false);
      setIsSuccess(true);

      // Actualizar datos después de un tiempo
      setTimeout(async () => {
        if (onRefreshData && typeof onRefreshData === 'function') {
          await onRefreshData();
        }
        setIsSuccess(false);
      }, 2000);

      return [undefined, pagoResult];
    } catch (error) {
      console.error('Error al procesar pago:', error);
      return [error, undefined];
    }
  }, [colegiadoUser?.requiere_solvencia_esp, setColegiadoUser, onRefreshData, tipoSolvenciaSeleccionada]);

  // Validaciones
  const hayPagos = historialPagos.length > 0;
  const mostrarOpcionAnual = !infoTrimestre.esUltimoTrimestre;
  return (
    <div className="space-y-8 pb-8" id="solvencia-pagos">
      {/* Mensaje de éxito */}
      {isSuccess && (
        <div className="bg-white rounded-xl shadow-lg border border-green-200">
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-600">
              ¡Pago Procesado Exitosamente!
            </h3>
            <p className="text-gray-600 text-center mt-2">
              Su pago ha sido recibido y está siendo procesado. Actualizando información...
            </p>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {solvenciaError && (
        <div className="bg-white rounded-xl shadow-lg border border-red-200">
          <div className="flex items-center p-4 text-red-800 bg-red-50 rounded-lg">
            <X className="w-5 h-5 mr-3" />
            <div>
              <h4 className="font-medium">Error al cargar datos</h4>
              <p className="text-sm">{solvenciaError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Información de estado de datos */}
      {!solvenciaData && !solvenciaError && (
        <div className="bg-white rounded-xl shadow-lg border border-blue-200">
          <div className="flex items-center p-4 text-blue-800 bg-blue-50 rounded-lg">
            <Info className="w-5 h-5 mr-3" />
            <div>
              <h4 className="font-medium">Información de Solvencia</h4>
              <p className="text-sm">No hay datos de solvencia disponibles. Los datos se cargarán al realizar la primera solicitud de pago.</p>
            </div>
          </div>
        </div>
      )}

      {!isSuccess && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Opciones de pago */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#41023B] to-[#D7008A] flex items-center justify-center mr-3">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#41023B]">Opciones de Pago</h3>
                  <p className="text-xs text-gray-600">Seleccione el período</p>
                </div>
              </div>

              <div className="space-y-3 flex-grow">
                {/* Opción Trimestral */}
                <div
                  className={`relative border-2 rounded-lg p-3 transition-all duration-300 ${!puedecambiarTipo && ((tipoSolvenciaSeleccionada !== 'trimestral' && hayPagos) || solvenciaData?.status == 'costo_especial')
                    ? 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                    : (tipoSolvenciaSeleccionada !== 'trimestral' && hayPagos)
                      ? 'border-blue-500 bg-blue-50 shadow-md cursor-pointer'
                      : puedecambiarTipo
                        ? 'border-gray-200 hover:border-blue-300 cursor-pointer hover:shadow-md'
                        : 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                    }`}
                  onClick={() => {
                    if (puedecambiarTipo) {
                      setTipoSolvenciaSeleccionada('trimestral');
                    }
                  }}
                >
                  {tipoSolvenciaSeleccionada === 'trimestral' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}


                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Pago Trimestral</h4>
                      <p className="text-xs text-gray-600 mb-2">{infoTrimestre.nombreTrimestre}</p>
                      <div className="text-lg font-bold text-blue-700">
                        {formatearMoneda(calcularCosto('trimestral'))}
                      </div>
                      {!puedecambiarTipo && tipoSolvenciaSeleccionada === 'trimestral' && (
                        <p className="text-xs text-orange-600 mt-1 font-medium">Configurado</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Opción Anual */}
                {mostrarOpcionAnual && (
                  <div
                    className={`relative border-2 rounded-lg p-3 transition-all duration-300 ${!puedecambiarTipo && ((tipoSolvenciaSeleccionada !== 'anual' && hayPagos) || solvenciaData?.status == 'costo_especial')
                      ? 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                      : (tipoSolvenciaSeleccionada !== 'anual' && hayPagos)
                        ? 'border-green-500 bg-green-50 shadow-md cursor-pointer'
                        : puedecambiarTipo
                          ? 'border-gray-200 hover:border-green-300 cursor-pointer hover:shadow-md'
                          : 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                      }`}
                    onClick={() => {
                      if (puedecambiarTipo) {
                        setTipoSolvenciaSeleccionada('anual');
                      }
                    }}
                  >
                    {tipoSolvenciaSeleccionada === 'anual' && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}


                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <Crown className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-900 mb-1">Pago Anual</h4>
                        <p className="text-xs text-gray-600 mb-2">Todo el año {infoTrimestre.ano}</p>
                        <div className="text-lg font-bold text-green-700">
                          {formatearMoneda(calcularCosto('anual'))}
                        </div>
                        {!puedecambiarTipo && tipoSolvenciaSeleccionada === 'anual' && (
                          <p className="text-xs text-orange-600 mt-1 font-medium">Configurado</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Información sobre configuración */}
                {!puedecambiarTipo && (
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center">
                      <DollarSign size={14} className="text-orange-600 mr-2 flex-shrink-0" />
                      <p className="text-xs text-orange-700">
                        <strong>Tipo configurado:</strong> El tipo de pago ya está establecido y no puede ser modificado.
                      </p>
                    </div>
                  </div>
                )}

                {/* Información sobre último trimestre */}
                {infoTrimestre.esUltimoTrimestre && (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center">
                      <Info size={14} className="text-yellow-600 mr-2 flex-shrink-0" />
                      <p className="text-xs text-yellow-700">
                        <strong>Último trimestre:</strong> Solo pago trimestral disponible.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resumen de pago */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#41023B] to-[#D7008A] flex items-center justify-center mr-3">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#41023B]">Resumen de Pago</h3>
                </div>
              </div>

              <div className="space-y-4 flex-grow">
                {/* Resumen financiero */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <ShoppingCart className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-sm font-medium text-gray-700">
                        Monto Total ({tipoSolvenciaSeleccionada}):
                      </span>
                    </div>
                    <span className="text-xl font-bold text-blue-700">
                      {formatearMoneda(datosResumen.total)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-sm font-medium text-gray-700">Monto Pagado:</span>
                    </div>
                    <span className="text-lg font-semibold text-green-600">
                      {formatearMoneda(datosResumen.pagado)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-red-600 mr-3" />
                      <span className="text-sm font-medium text-gray-700">Monto Restante:</span>
                    </div>
                    <span className="text-xl font-bold text-red-700">
                      {formatearMoneda(datosResumen.restante)}
                    </span>
                  </div>
                </div>

                {/* Barra de progreso */}
                {datosResumen.pagado > 0 && (
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progreso de pago</span>
                      <span>{datosResumen.porcentajePagado.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-green-400 to-green-600"
                        style={{ width: `${Math.min(datosResumen.porcentajePagado, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de pago */}
              <div className="mt-auto">
                <hr className="border-gray-200 mb-4" />
                <button
                  onClick={() => setShowPagoModal(true)}
                  disabled={datosResumen.restante <= 0}
                  className="w-full bg-gradient-to-r from-[#41023B] to-[#D7008A] text-white py-4 px-6 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>
                    {datosResumen.restante <= 0
                      ? 'Pago Completo'
                      : datosResumen.pagado > 0
                        ? 'Continuar Pago'
                        : 'Proceder al Pago'
                    }
                  </span>
                  {datosResumen.restante > 0 && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historial de Pagos Optimizado */}
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
                  Registro completo de pagos realizados para esta solicitud de solvencia
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <strong className="text-sm text-gray-800">Total de pagos {historialPagos.length}</strong>
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
                          {pago.num_referencia || 'N/A'}
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

      {/* Modal de Pago Optimizado */}
      {showPagoModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#41023B]">
                  Pago de Solvencia
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {tipoSolvenciaSeleccionada === 'anual' ? 'Anual' : 'Trimestral'} - {formatearMoneda(datosResumen.total)}
                  {datosResumen.pagado > 0 && (
                    <span className="ml-2 text-orange-600">
                      (Restante: {formatearMoneda(datosResumen.restante)})
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => setShowPagoModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Cerrar modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-0">
              <PagosColg
                props={{
                  costo: datosResumen.restante.toFixed(2),
                  allowMultiplePayments: true,
                  handlePago: handlePagoSolvencia
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}