"use client";
import {
  AlertCircle,
  ArrowRight,
  Ban,
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  Clock,
  CreditCard,
  DollarSign,
  History,
  Link,
  RefreshCw,
  Shield,
  User,
  X
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

// Componentes importados
import { fetchSolicitudes, pagoSolvencia, patchDataSolicitud, postDataSolicitud } from "@/api/endpoints/solicitud";
import PagosColg from "@/app/Components/PagosModal";
import { useSolicitudesStore } from "@/store/SolicitudesStore";
import ConfirmacionModal from "./ConfirmacionModal";
import ExoneracionModal from "./ExoneracionModal";
import RechazoModal from "./RechazoModal";

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

export default function DetalleSolvencia({ solvenciaId, onVolver, solvencias, actualizarSolvencia }) {
  // Estados principales
  const [solvencia, setSolvencia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alertaExito, setAlertaExito] = useState(null);

  // Estados de modales
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarRechazo, setMostrarRechazo] = useState(false);
  const [mostrarExoneracion, setMostrarExoneracion] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);

  // Estados para formularios
  const [costoNuevo, setCostoNuevo] = useState("");
  const [metodosDePago, setMetodoDePago] = useState([]);
  const [fechaVencimiento, setFechaVencimiento] = useState(getEndOfTrimester(getTrimester()));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getMetodosDePago = async () => {
    try {
      const metodos = await fetchSolicitudes("metodo-de-pago");
      setMetodoDePago(metodos.data);
    } catch (error) {
      console.log(`Ha ocurrido un error: ${error}`)
    }
  }

  const fechaActual = new Date();
  const fetchSolicitudesDeSolvencia = useSolicitudesStore((state) => state.fetchSolicitudesDeSolvencia);
  const solicitudesDeSolvencia = useSolicitudesStore((state) => state.solicitudesDeSolvencia);

  function getTrimester() {
    const today = new Date();
    const month = today.getMonth();
    return Math.floor(month / 3) + 1;
  }

  function getEndOfTrimester(trimester) {
    const year = new Date().getFullYear();
    let nextMonth;

    switch (trimester) {
      case 1: nextMonth = 3; break;
      case 2: nextMonth = 6; break;
      case 3: nextMonth = 9; break;
      case 4: nextMonth = 12; break;
      default: throw new Error('Invalid trimester (must be 1-4)');
    }

    const endDate = new Date(year, nextMonth, 1);
    endDate.setDate(0);
    return endDate;
  }

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

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

  const obtenerNombreMetodoPago = useCallback((metodoId) => {
    return METODOS_PAGO[metodoId] || 'Método no especificado';
  }, []);

  const fechasDeVencimiento = [
    { trimestre: 1, fecha: getEndOfTrimester(1) },
    { trimestre: 2, fecha: getEndOfTrimester(2) },
    { trimestre: 3, fecha: getEndOfTrimester(3) },
    { trimestre: 4, fecha: getEndOfTrimester(4) },
  ];

  // Procesamiento de pagos similar a PagoSolv
  const historialPagos = useMemo(() => {
    if (!solvencia?.pagos_solicitud_solvencia || !Array.isArray(solvencia.pagos_solicitud_solvencia)) {
      return [];
    }

    try {
      return solvencia.pagos_solicitud_solvencia.map(pago => {
        const montoUSD = pago.moneda === 'bs'
          ? parseFloat(pago.monto) / parseFloat(pago.tasa_bcv_del_dia || 1)
          : parseFloat(pago.monto || 0);

        const fechaDisponible = pago.fecha_pago || pago.created_at;

        return {
          ...pago,
          montoUSD,
          fechaFormateada: fechaDisponible ? formatearFecha(fechaDisponible) : "Fecha no disponible",
          metodoPagoNombre: obtenerNombreMetodoPago(pago.metodo_de_pago),
          estadoInfo: ESTADOS_PAGO[pago.status] || {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: Clock,
            texto: pago.status || 'Procesado'
          }
        };
      });
    } catch (err) {
      console.error('Error al procesar pagos:', err);
      return [];
    }
  }, [solvencia?.pagos_solicitud_solvencia, formatearFecha, obtenerNombreMetodoPago]);

  // Cálculo de resumen de pagos
  const datosResumen = useMemo(() => {
    if (!solvencia) return { total: 0, pagado: 0, restante: 0, porcentajePagado: 0 };

    const costoTotal = parseFloat(solvencia.costoRegularSolicitud || 0);
    const montoPagado = historialPagos
      .filter(pago => pago.status === 'aprobado')
      .reduce((sum, pago) => sum + pago.montoUSD, 0);
    const montoRestante = Math.max(0, costoTotal - montoPagado);

    return {
      total: costoTotal,
      pagado: montoPagado,
      restante: montoRestante,
      porcentajePagado: costoTotal > 0 ? (montoPagado / costoTotal) * 100 : 0
    };
  }, [solvencia, historialPagos]);

  // Obtener datos de la solvencia
  useEffect(() => {
    if (solvencias && solvenciaId) {
      const solvenciaEncontrada = solvencias.find(s => s.idSolicitudSolvencia === solvenciaId);
      if (solvenciaEncontrada) {
        setSolvencia(solvenciaEncontrada);
        getMetodosDePago();
      }
      setIsLoading(false);
    }
  }, [solvenciaId, solvencias]);

  // Manejo de actualización de datos
  const handleRefreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Refrescar datos del store
      await fetchSolicitudesDeSolvencia();
      
      // Esperar un momento para que se actualice el store
      setTimeout(() => {
        // Buscar la solvencia actualizada en el store actualizado
        const solicitudesActualizadas = useSolicitudesStore.getState().solicitudesDeSolvencia;
        const solvenciaActualizada = solicitudesActualizadas.find(s => s.idSolicitudSolvencia === solvenciaId);
        if (solvenciaActualizada) {
          setSolvencia(solvenciaActualizada);
        }
        setIsRefreshing(false);
      }, 500);
    } catch (error) {
      console.error('Error al refrescar datos:', error);
      setIsRefreshing(false);
    }
  }, [fetchSolicitudesDeSolvencia, solvenciaId]);

  // Manejo de pagos (con mapeo correcto de datos de PagosColg)
  const handlePagoSolvencia = useCallback(async (detallesPagoSolvencia) => {
    try {
      console.log('Datos recibidos de PagosColg:', detallesPagoSolvencia);
      console.log('Datos de solvencia:', { solvenciaId, colegiadoId: solvencia?.idColegiado });
      
      // Validar datos requeridos
      if (!solvenciaId) {
        throw new Error('ID de solicitud de solvencia no disponible');
      }
      
      if (!solvencia?.idColegiado) {
        throw new Error('ID de colegiado no disponible');
      }

      // Mapear correctamente los datos del componente PagosColg
      // El componente puede enviar diferentes estructuras (totalAmount vs monto, etc.)
      const monto = detallesPagoSolvencia.totalAmount || detallesPagoSolvencia.monto;
      const metodoPago = detallesPagoSolvencia.metodo_de_pago?.id || detallesPagoSolvencia.metodo_de_pago;
      const referencia = detallesPagoSolvencia.referenceNumber || detallesPagoSolvencia.num_referencia || '';
      const fechaPago = detallesPagoSolvencia.paymentDate || detallesPagoSolvencia.fecha_pago;

      // Validar que los datos críticos no sean null/undefined
      if (!monto || monto === null || monto === undefined) {
        throw new Error('Monto no proporcionado o es inválido');
      }

      if (!metodoPago || metodoPago === null || metodoPago === undefined) {
        throw new Error('Método de pago no proporcionado o es inválido');
      }

      // Preparar datos en formato correcto para el backend
      const datosPago = {
        monto: parseFloat(monto),
        moneda: detallesPagoSolvencia.moneda || 'usd',
        metodo_de_pago: parseInt(metodoPago),
        num_referencia: referencia,
        tasa_bcv_del_dia: parseFloat(detallesPagoSolvencia.tasa_bcv_del_dia) || 1,
        // Campos para el contexto administrativo
        user_id: solvencia.idColegiado,
        solicitud_solvencia_id: parseInt(solvenciaId)
      };

      // Agregar fecha de pago si existe
      if (fechaPago) {
        datosPago.fecha_pago = fechaPago;
      }

      console.log('Datos mapeados y validados:', datosPago);

      // Validación final antes de enviar
      if (isNaN(datosPago.monto) || datosPago.monto <= 0) {
        throw new Error(`Monto inválido: ${datosPago.monto}`);
      }

      if (isNaN(datosPago.metodo_de_pago)) {
        throw new Error(`Método de pago inválido: ${datosPago.metodo_de_pago}`);
      }

      console.log('Enviando al backend:', datosPago);
      const pagoResult = await pagoSolvencia(datosPago);
      
      console.log('Resultado del pago:', pagoResult);
      
      setShowPagoModal(false);
      mostrarAlerta("exito", "Pago procesado exitosamente en el servidor");
      
      // Actualizar datos del store después del pago exitoso
      setTimeout(async () => {
        await handleRefreshData();
      }, 1000);

      return [undefined, pagoResult];
    } catch (error) {
      console.error('Error completo al procesar pago:', error);
      console.error('Response del error:', error.response?.data);
      console.error('Status del error:', error.response?.status);
      
      let mensajeError = 'Error desconocido';
      if (error.response?.data?.detail) {
        mensajeError = error.response.data.detail;
      } else if (error.response?.data?.message) {
        mensajeError = error.response.data.message;
      } else if (error.response?.data?.error) {
        mensajeError = error.response.data.error;
      } else if (error.response?.data) {
        // Si hay datos del error pero no detail/message, mostrar todo
        mensajeError = JSON.stringify(error.response.data);
      } else if (error.message) {
        mensajeError = error.message;
      }
      
      mostrarAlerta("alerta", `Error al procesar el pago: ${mensajeError}`);
      return [error, undefined];
    }
  }, [solvenciaId, solvencia?.idColegiado, handleRefreshData]);

  // Función para actualizar el costo asignado
  const handleAsignarCosto = () => {
    if (!costoNuevo || parseFloat(costoNuevo) <= 0) {
      alert("Por favor ingrese un monto válido mayor a cero");
      return;
    }

    try {
      const solvenciaActualizada = {
        costo: parseFloat(costoNuevo),
        solicitud_solvencia_id: solvenciaId
      };

      patchDataSolicitud('asignar_costo_solicitud_solvencia', solvenciaActualizada);
      fetchSolicitudesDeSolvencia();
      mostrarAlerta("exito", "Se ha asignado el costo correctamente");
      onVolver();
    } catch (error) {
      console.error("Error al asignar costo:", error);
      mostrarAlerta("alerta", "Ocurrió un error al procesar la solicitud");
    }
  };

  // Función para exonerar el pago
  const handleExonerarPago = (motivo) => {
    try {
      const solvenciaActualizada = {
        solicitud_solvencia_id: solvencia.idSolicitudSolvencia,
        motivo_exoneracion: motivo,
        colegiado_id: solvencia.idColegiado,
        fecha_exp: fechaVencimiento
      };

      postDataSolicitud('exonerar_solicitud_solvencia', solvenciaActualizada);
      setMostrarExoneracion(false);
      fetchSolicitudesDeSolvencia();
      mostrarAlerta("exito", "La solvencia ha sido exonerada de pago");
      onVolver();
    } catch (error) {
      console.error("Error al exonerar pago:", error);
      mostrarAlerta("alerta", "Ocurrió un error al procesar la exoneración");
    }
  };

  // Función para aprobar la solvencia
  const handleAprobarSolvencia = async () => {
    try {
      const solvenciaActualizada = {
        solicitud_solvencia_id: solvencia.idSolicitudSolvencia,
        colegiado_id: solvencia.idColegiado,
        costo: solvencia.costoRegularSolicitud,
        fecha_exp: formatDate(fechaVencimiento)
      };

      postDataSolicitud('aprobar_solicitud_solvencia', solvenciaActualizada);
      setMostrarConfirmacion(false);
      fetchSolicitudesDeSolvencia();
      mostrarAlerta("exito", "La solvencia ha sido aprobada correctamente");
      onVolver();
    } catch (error) {
      console.error("Error al aprobar solvencia:", error);
    }
  };

  // Función para rechazar la solvencia
  const handleRechazarSolvencia = async (motivo) => {
    try {
      if (!motivo) {
        alert("Debe ingresar un motivo de rechazo");
        return;
      }

      const solvenciaActualizada = {
        solicitud_solvencia_id: solvencia.idSolicitudSolvencia,
        motivo_rechazo: motivo,
        colegiado_id: solvencia.idColegiado
      };

      patchDataSolicitud('rechazar_solicitud_solvencia', solvenciaActualizada);
      setMostrarRechazo(false);
      fetchSolicitudesDeSolvencia();
      mostrarAlerta("alerta", "La solvencia ha sido rechazada");
      onVolver();
    } catch (error) {
      console.error("Error al rechazar solvencia:", error);
    }
  };

  // Función para mostrar alertas temporales
  const mostrarAlerta = (tipo, mensaje) => {
    setAlertaExito({
      tipo: tipo,
      mensaje: mensaje
    });

    setTimeout(() => {
      setAlertaExito(null);
    }, 5000);
  };

  const handleSeleccionarFecha = (e) => {
    setFechaVencimiento(new Date(e.target.value));
  }

  // Renderizado principal
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
      </div>
    );
  }

  if (!solvencia) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Solvencia no encontrada</h2>
        <button
          onClick={onVolver}
          className="inline-flex items-center text-[#C40180] hover:text-[#590248] transition-colors"
        >
          <ChevronLeft className="mr-2" size={20} />
          Volver a la lista
        </button>
      </div>
    );
  }

  const hayPagos = historialPagos.length > 0;
  const pagoCompleto = datosResumen.restante <= 0 && datosResumen.total > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 mt-28">
      {/* Header con botón de volver */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={onVolver}
            className="inline-flex items-center text-gray-600 hover:text-[#C40180]"
          >
            <ChevronLeft className="mr-2" size={20} />
            <span>Volver a la lista</span>
          </button>
          <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
            solvencia.statusSolicitud === 'revisando'
              ? 'bg-yellow-100 text-yellow-800'
              : solvencia.statusSolicitud === 'aprobado'
                ? 'bg-green-100 text-green-800'
                : solvencia.statusSolicitud === 'rechazado'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-indigo-100 text-indigo-800'
          }`}>
            {solvencia.statusSolicitud === 'revisando' && <Clock size={16} />}
            {solvencia.statusSolicitud === 'aprobado' && <CheckCircle size={16} />}
            {solvencia.statusSolicitud === 'rechazado' && <X size={16} />}
            {solvencia.statusSolicitud === 'costo_especial' && <CreditCard size={16} />}
            {solvencia.statusSolicitud === 'revisando' && 'En Revisión'}
            {solvencia.statusSolicitud === 'aprobado' && 'Aprobado'}
            {solvencia.statusSolicitud === 'rechazado' && 'Rechazado'}
            {solvencia.statusSolicitud === 'costo_especial' && 'Costo Especial'}
          </div>
        </div>

        {/* Alertas */}
        {alertaExito && (
          <div className={`mt-4 p-4 rounded-xl flex items-center justify-between shadow-md ${
            alertaExito.tipo === "exito" 
              ? "bg-green-50 text-green-800 border border-green-200" 
              : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            <div className="flex items-center">
              {alertaExito.tipo === "exito" ? (
                <CheckCircle className="mr-2" size={20} />
              ) : (
                <AlertCircle className="mr-2" size={20} />
              )}
              <span className="font-medium">{alertaExito.mensaje}</span>
            </div>
            <button
              onClick={() => setAlertaExito(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Información básica con datos del colegiado */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#590248] mb-2">
                Solicitud de Solvencia
              </h1>
              <div className="space-y-2">
                <p className="text-gray-600 flex items-center">
                  <Calendar size={16} className="mr-2" />
                  Solicitada el: {solvencia.fechaSolicitud}
                </p>
                <div className="flex items-center gap-4">
                  <p className="text-gray-600 flex items-center">
                    <User size={16} className="mr-2" />
                    Colegiado: <span className="font-medium text-gray-900 ml-1">{solvencia.nombreColegiado}</span>
                  </p>
                  {solvencia.creador.isAdmin && (
                    <div className="flex items-center">
                      <Shield size={14} className="text-purple-500 mr-1" />
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Creada por Admin
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gestión de pago - misma altura que resumen de pagos */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                Gestión de Pago
              </h3>
              
              <div className="flex-grow flex flex-col justify-between">
                {/* Descripción de funcionalidades */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Opciones de Pago Disponibles:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Link className="w-4 h-4 mr-2 text-blue-500" />
                      <span>Enviar link de pago al colegiado</span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-green-500" />
                      <span>Procesar pago directo con tarjeta</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-purple-500" />
                      <span>Registrar transferencia bancaria</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-orange-500" />
                      <span>Otros métodos de pago disponibles</span>
                    </div>
                  </div>
                </div>

                {/* Botón principal */}
                <div className="mt-auto">
                  <button
                    onClick={() => setShowPagoModal(true)}
                    disabled={datosResumen.restante <= 0}
                    className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-3 text-lg ${
                      datosResumen.restante <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-t from-[#41023B] to-[#D7008A] hover:opacity-90 text-white shadow-lg'
                    }`}
                  >
                    <CreditCard size={24} />
                    <span>
                      {datosResumen.restante <= 0
                        ? 'Pago Completado'
                        : 'Realizar Pago'
                      }
                    </span>
                    {datosResumen.restante > 0 && <ArrowRight size={24} />}
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center mt-3">
                    {datosResumen.restante <= 0 
                      ? 'El pago ha sido completado exitosamente'
                      : 'Acceda a todas las opciones de pago disponibles'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de pagos y acciones administrativas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resumen de pagos */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
              <div className="bg-gradient-to-b from-[#D7008A] to-[#41023B] p-6 text-white">
                <h2 className="text-xl font-semibold mb-2 flex items-center">
                  Resumen de Pagos
                  {isRefreshing && (
                    <RefreshCw className="ml-3 w-5 h-5 animate-spin" />
                  )}
                </h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-white text-sm">Total</p>
                    <p className="text-xl font-bold">{formatearMoneda(datosResumen.total)}</p>
                  </div>
                  <div>
                    <p className="text-white text-sm">Pagado</p>
                    <p className="text-xl font-bold text-green-500">{formatearMoneda(datosResumen.pagado)}</p>
                  </div>
                  <div>
                    <p className="text-white text-sm">Restante</p>
                    <p className="text-xl font-bold text-red-500">{formatearMoneda(datosResumen.restante)}</p>
                  </div>
                </div>

                {/* Barra de progreso */}
                {datosResumen.pagado > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-white/80 mb-2">
                      <span>Progreso de pago</span>
                      <span>{datosResumen.porcentajePagado.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-white transition-all duration-500"
                        style={{ width: `${Math.min(datosResumen.porcentajePagado, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Asignación de costo si es necesario */}
                {solvencia.statusSolicitud === 'costo_especial' && (
                  <div className="space-y-6">
                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Asignación de Costo
                      </h3>
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monto a cobrar ($)
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-4 py-2.5 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-lg">
                            $
                          </span>
                          <input
                            type="text"
                            value={costoNuevo}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9.]/g, '');
                              setCostoNuevo(value);
                            }}
                            className="flex-1 rounded-r-md px-4 py-2.5 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-lg"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleAsignarCosto}
                          disabled={!costoNuevo || parseFloat(costoNuevo) <= 0}
                          className={`flex-1 inline-flex items-center justify-center px-4 py-2.5 ${
                            !costoNuevo || parseFloat(costoNuevo) <= 0
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-gradient-to-r from-[#D7008A] to-[#41023B] hover:opacity-90'
                          } text-white rounded-lg transition-colors text-base font-medium`}
                        >
                          <DollarSign className="mr-2" size={20} />
                          Asignar Costo
                        </button>

                        <button
                          onClick={() => setMostrarExoneracion(true)}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg transition-colors text-base font-medium"
                        >
                          <Ban className="mr-2" size={20} />
                          Exonerar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Acciones administrativas para revisión */}
                {solvencia.statusSolicitud === "revisando" && solvencia.costoRegularSolicitud >= 0 && (
                  <div className="space-y-6">
                    {/* Selector de fecha de vencimiento */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Calendar className="mr-2 text-orange-600" size={20} />
                        Fecha de vencimiento
                      </h3>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#C40180] focus:border-[#C40180]"
                        onChange={handleSeleccionarFecha}
                      >
                        <option value="" disabled>Seleccione una fecha</option>
                        {fechasDeVencimiento.map(({trimestre, fecha}) => (
                          <option 
                            key={trimestre} 
                            value={fecha} 
                            disabled={fechaActual > fecha || (solvencia.fechaExpSolicitud && new Date(solvencia.fechaExpSolicitud) > fecha)}
                          >
                            {formatDate(fecha)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Botones de acción */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        onClick={() => setMostrarConfirmacion(true)}
                        disabled={!pagoCompleto}
                        className={`inline-flex items-center justify-center px-4 py-3 rounded-lg transition-colors font-medium text-base ${
                          pagoCompleto
                            ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        title={!pagoCompleto ? "Debe completarse el pago para aprobar" : ""}
                      >
                        <Check className="mr-2" size={20} />
                        Aprobar
                      </button>

                      <button
                        onClick={() => setMostrarExoneracion(true)}
                        className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg transition-colors font-medium text-base"
                      >
                        <Ban className="mr-2" size={20} />
                        Exonerar
                      </button>

                      <button
                        onClick={() => setMostrarRechazo(true)}
                        className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-colors font-medium text-base"
                      >
                        <X className="mr-2" size={20} />
                        Rechazar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Historial de pagos */}
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
                  <span className="text-sm text-gray-800 font-medium">
                    Total de pagos: {historialPagos.length}
                  </span>
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
                      <tr key={pago.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm text-gray-900 text-center">
                          <div className="flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            <span className={pago.fechaFormateada === "Fecha no disponible" ? "text-gray-400 italic text-xs" : ""}>
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
                                Tasa: {parseFloat(pago.tasa_bcv_del_dia || 0).toFixed(2)}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${pago.estadoInfo.color}`}>
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

            {/* Resumen del historial */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Total de Pagos</p>
                  <p className="text-lg font-bold text-blue-600">{historialPagos.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Monto Total Pagado</p>
                  <p className="text-lg font-bold text-green-600">{formatearMoneda(datosResumen.pagado)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Pagos Aprobados</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {historialPagos.filter(p => p.status === 'aprobado').length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Estado de Pago</p>
                  <p className="text-sm font-semibold text-purple-600">
                    {pagoCompleto ? 'Completo' : 'Pendiente'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Pago */}
      {showPagoModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#41023B]">
                  Procesar Pago de Solvencia
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Total: {formatearMoneda(datosResumen.total)}
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

      {/* Modales */}
      {mostrarConfirmacion && (
        <ConfirmacionModal
          onCancel={() => setMostrarConfirmacion(false)}
          onConfirm={handleAprobarSolvencia}
          titulo="Confirmar Aprobación"
          mensaje="¿Está seguro que desea aprobar esta solvencia? Una vez aprobada, no podrá revertir esta acción."
        />
      )}

      {mostrarRechazo && (
        <RechazoModal
          onCancel={() => setMostrarRechazo(false)}
          onConfirm={handleRechazarSolvencia}
        />
      )}

      {mostrarExoneracion && (
        <ExoneracionModal
          onCancel={() => setMostrarExoneracion(false)}
          onConfirm={handleExonerarPago}
        />
      )}
    </div>
  );
}