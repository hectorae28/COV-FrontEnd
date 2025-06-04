"use client";
import {
  AlertCircle,
  ArrowRight,
  Ban,
  Calendar,
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
import { fetchSolicitudes, pagoSolvencia, patchDataSolicitud, postDataSolicitud, actualizarEstadoPago } from "@/api/endpoints/solicitud";
import PagosColg from "@/app/Components/PagosModal";
import VerificationSwitch from "@/app/Components/Solicitudes/ListaColegiados/VerificationSwitch";
import { useSolicitudesStore } from "@/store/SolicitudesStore";
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
      // Error al obtener métodos de pago
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

  // Procesamiento de pagos optimizado para la estructura de datos correcta
  const historialPagos = useMemo(() => {
    // Obtener pagos de la estructura correcta: solicitudes_solvencia.lista[0].pagos
    const pagosArray = solvencia?.pagos || [];

    if (!Array.isArray(pagosArray) || pagosArray.length === 0) {
      return [];
    }

    try {
      return pagosArray.map(pago => {
        const montoUSD = pago.moneda === 'bs'
          ? parseFloat(pago.monto) / parseFloat(pago.tasa_bcv_del_dia || 1)
          : parseFloat(pago.monto || 0);

        // Verificar disponibilidad de campos de fecha
        const fechaDisponible = pago.fecha_pago || pago.created_at || pago.fecha_creacion;

        return {
          ...pago,
          montoUSD,
          fechaFormateada: fechaDisponible
            ? formatearFecha(fechaDisponible)
            : "Fecha no disponible",
          metodoPagoNombre: obtenerNombreMetodoPago(pago.metodo_de_pago),
          estadoInfo: ESTADOS_PAGO[pago.status] || {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: Clock,
            texto: pago.status || 'Procesado'
          }
        };
      });
    } catch (err) {
      return [];
    }
  }, [solvencia?.pagos, formatearFecha, obtenerNombreMetodoPago]);

  // Cálculo de resumen de pagos mejorado
  const datosResumen = useMemo(() => {
    if (!solvencia) return { total: 0, pagado: 0, restante: 0, porcentajePagado: 0 };

    // Obtener el costo total desde las propiedades mapeadas del store
    let costoTotal = 0;

    // Priorizar costo especial si existe y no es null
    if (solvencia.costoEspecialSolicitud !== null && solvencia.costoEspecialSolicitud !== undefined) {
      costoTotal = parseFloat(solvencia.costoEspecialSolicitud || 0);
    } else {
      // Usar costo regular como fallback
      costoTotal = parseFloat(solvencia.costoRegularSolicitud || 0);
    }

    // Calcular monto pagado SOLO de pagos aprobados, con conversión correcta a USD
    const montoPagado = historialPagos
      .filter(pago => {
        return pago.status === 'aprobado';
      })
      .reduce((sum, pago) => {
        const montoUSD = pago.montoUSD;
        return sum + montoUSD;
      }, 0);

    // También calcular pagos en revisión para mostrar información adicional
    const montoPendiente = historialPagos
      .filter(pago => pago.status === 'revisando' || pago.status === 'revision')
      .reduce((sum, pago) => sum + pago.montoUSD, 0);

    // Asegurar que el monto restante nunca sea negativo
    const montoRestante = Math.max(0, costoTotal - montoPagado);
    const pagoCompleto = montoRestante <= 0 && costoTotal > 0;

    return {
      total: Math.max(0, costoTotal), // Asegurar que el total nunca sea negativo
      pagado: Math.max(0, montoPagado), // Asegurar que el pagado nunca sea negativo
      restante: montoRestante,
      porcentajePagado: costoTotal > 0 ? Math.min(100, (montoPagado / costoTotal) * 100) : 0, // Limitar a 100%
      pendiente: Math.max(0, montoPendiente), // Asegurar que el pendiente nunca sea negativo
      pagoCompleto,
      tieneCostoAsignado: costoTotal > 0 // Nueva propiedad para verificar si ya tiene costo
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

  // Manejo de actualización de datos mejorado
  const handleRefreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Refrescar datos del store
      await fetchSolicitudesDeSolvencia();

      // Esperar un momento para que se actualice el store y luego buscar la solvencia actualizada
      setTimeout(() => {
        const solicitudesActualizadas = useSolicitudesStore.getState().solicitudesDeSolvencia;
        const solvenciaActualizada = solicitudesActualizadas.find(s => s.idSolicitudSolvencia === solvenciaId);

        if (solvenciaActualizada) {
          setSolvencia(solvenciaActualizada);
          mostrarAlerta("exito", "Datos actualizados correctamente");
        }

        setIsRefreshing(false);
      }, 1000);
    } catch (error) {
      mostrarAlerta("alerta", "Error al actualizar los datos");
      setIsRefreshing(false);
    }
  }, [fetchSolicitudesDeSolvencia, solvenciaId]);

  // Función para mostrar alertas
  const mostrarAlerta = useCallback((tipo, mensaje) => {
    setAlertaExito({ tipo, mensaje });
    // Auto-ocultar la alerta después de 5 segundos
    setTimeout(() => {
      setAlertaExito(null);
    }, 5000);
  }, []);

  // Función para manejar cambios de estado en pagos (aprobar/rechazar)
  const handleCambioEstadoPago = useCallback(async (pagoActualizado, index) => {
    try {
      // Mapear el estado del VerificationSwitch al estado del backend
      let nuevoEstado;
      if (pagoActualizado.status === 'approved') {
        nuevoEstado = 'aprobado';
      } else if (pagoActualizado.status === 'rechazado') {
        nuevoEstado = 'rechazado';
      } else {
        nuevoEstado = 'revisando';
      }

      // Preparar datos para el endpoint de actualización de pago
      const datosActualizacion = {
        pago_id: pagoActualizado.id,
        nuevo_status: nuevoEstado,
        motivo_rechazo: pagoActualizado.rejectionReason || pagoActualizado.motivo_rechazo || ''
      };

      // Llamar al endpoint para actualizar el estado del pago
      const resultado = await actualizarEstadoPago(datosActualizacion);

      // Mostrar mensaje de éxito
      const accion = nuevoEstado === 'aprobado' ? 'aprobado' : 'rechazado';
      mostrarAlerta("exito", `Pago ${accion} correctamente. Actualizando datos...`);

      // Actualizar los datos después de un breve delay
      setTimeout(async () => {
        await handleRefreshData();
      }, 1000);

    } catch (error) {
      let mensajeError = 'Error al actualizar el estado del pago';
      if (error.response?.data?.detail) {
        mensajeError = error.response.data.detail;
      } else if (error.response?.data?.message) {
        mensajeError = error.response.data.message;
      } else if (error.message) {
        mensajeError = error.message;
      }

      mostrarAlerta("alerta", `Error: ${mensajeError}`);
    }
  }, [handleRefreshData, mostrarAlerta]);

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
        fecha_exp: formatDate(fechaVencimiento)
      };

      postDataSolicitud('exonerar_solicitud_solvencia', solvenciaActualizada);
      setMostrarExoneracion(false);
      fetchSolicitudesDeSolvencia();
      mostrarAlerta("exito", "La solvencia ha sido exonerada de pago");
      onVolver();
    } catch (error) {
      mostrarAlerta("alerta", "Ocurrió un error al procesar la exoneración");
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
      // Error al rechazar solvencia
    }
  };

  const handleSeleccionarFecha = (e) => {
    setFechaVencimiento(new Date(e.target.value));
  }

  // Auto-actualización de datos cuando se detectan cambios en el store
  useEffect(() => {
    if (solicitudesDeSolvencia.length > 0 && solvenciaId) {
      const solvenciaActualizada = solicitudesDeSolvencia.find(s => s.idSolicitudSolvencia === solvenciaId);
      if (solvenciaActualizada && JSON.stringify(solvenciaActualizada) !== JSON.stringify(solvencia)) {
        setSolvencia(solvenciaActualizada);
      }
    }
  }, [solicitudesDeSolvencia, solvenciaId, solvencia]);

  // Manejo de pagos mejorado con mejor validación y manejo de errores
  const handlePagoSolvencia = useCallback(async (detallesPagoSolvencia) => {
    try {
      // Validar datos requeridos
      if (!solvenciaId) {
        throw new Error('ID de solicitud de solvencia no disponible');
      }

      if (!solvencia?.idColegiado) {
        throw new Error('ID de colegiado no disponible');
      }

      // Validar que la solvencia esté en estado que permita pagos
      if (!['revisando', 'revision', 'costo_especial'].includes(solvencia.statusSolicitud)) {
        throw new Error(`No se pueden procesar pagos para solvencias en estado: ${solvencia.statusSolicitud}`);
      }

      // Mapear correctamente los datos del componente PagosColg
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

      // Determinar la moneda basada en el método de pago
      let moneda = 'usd'; // Por defecto USD
      let montoFinal = parseFloat(monto);
      let montoParaValidacion = montoFinal;

      if (detallesPagoSolvencia.metodo_de_pago?.datos_adicionales?.slug === 'bdv') {
        moneda = 'bs'; // Bolívares para Banco de Venezuela
        // Para validación, convertir Bs a USD
        const tasaBcv = parseFloat(detallesPagoSolvencia.tasa_bcv_del_dia || 1);
        montoParaValidacion = montoFinal / tasaBcv;
      }

      // Validación del monto antes de enviar
      if (isNaN(montoFinal) || montoFinal <= 0) {
        throw new Error(`Monto inválido: ${montoFinal}`);
      }

      if (isNaN(parseInt(metodoPago))) {
        throw new Error(`Método de pago inválido: ${metodoPago}`);
      }

      // Validar que el monto no exceda lo pendiente (solo si no es asignación de costo)
      if (solvencia.statusSolicitud !== 'costo_especial' && montoParaValidacion > datosResumen.restante) {
        throw new Error(`El monto (${formatearMoneda(montoParaValidacion)}) no puede ser mayor al restante (${formatearMoneda(datosResumen.restante)})`);
      }

      // Preparar datos para el endpoint pagoSolvencia (SIN el campo 'tipo' que causa error)
      const detallesPagoParaBackend = {
        paymentDate: fechaPago || '',
        referenceNumber: referencia,
        paymentFile: detallesPagoSolvencia.paymentFile || null,
        totalAmount: montoFinal.toString(),
        metodo_de_pago: detallesPagoSolvencia.metodo_de_pago,
        tasa_bcv_del_dia: parseFloat(detallesPagoSolvencia.tasa_bcv_del_dia || 1),
        // Agregar datos específicos para admin (SIN incluir 'tipo')
        user_id: solvencia.idColegiado,
        solicitud_solvencia_id: parseInt(solvenciaId)
      };

      const pagoResult = await pagoSolvencia(detallesPagoParaBackend);

      // Cerrar modal inmediatamente
      setShowPagoModal(false);

      // Mostrar mensaje de éxito con el monto correcto
      const montoMensaje = moneda === 'bs'
        ? `${montoFinal.toLocaleString('es-VE')} Bs (${formatearMoneda(montoParaValidacion)})`
        : formatearMoneda(montoFinal);

      mostrarAlerta("exito", `Pago de ${montoMensaje} procesado exitosamente. Actualizando datos...`);

      // Actualizar datos después de un breve tiempo para permitir que el backend procese
      setTimeout(async () => {
        await handleRefreshData();
      }, 1500);

      return [undefined, pagoResult];
    } catch (error) {
      let mensajeError = 'Error desconocido al procesar el pago';
      if (error.response?.data?.detail) {
        mensajeError = error.response.data.detail;
      } else if (error.response?.data?.message) {
        mensajeError = error.response.data.message;
      } else if (error.response?.data?.error) {
        mensajeError = error.response.data.error;
      } else if (error.response?.data) {
        // Si hay datos del error pero no detail/message, mostrar información útil
        if (typeof error.response.data === 'object') {
          const errorKeys = Object.keys(error.response.data);
          if (errorKeys.length > 0) {
            mensajeError = `Error en campos: ${errorKeys.join(', ')}`;
          }
        } else {
          mensajeError = String(error.response.data);
        }
      } else if (error.message) {
        mensajeError = error.message;
      }

      mostrarAlerta("alerta", `Error al procesar el pago: ${mensajeError}`);
      return [error, undefined];
    }
  }, [solvenciaId, solvencia?.idColegiado, solvencia?.statusSolicitud, datosResumen.restante, datosResumen.total, handleRefreshData, formatearMoneda]);

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
  const pagoCompleto = datosResumen.pagoCompleto;

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
          <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${solvencia.statusSolicitud === 'revisando'
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
          <div className={`mt-4 p-4 rounded-xl flex items-center justify-between shadow-md ${alertaExito.tipo === "exito"
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
                    className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-3 text-lg ${datosResumen.restante <= 0
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
                    {datosResumen.pendiente > 0 && (
                      <p className="text-xs text-yellow-300">
                        +{formatearMoneda(datosResumen.pendiente)} pendiente
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm">Restante</p>
                    <p className={`text-xl font-bold ${datosResumen.pagoCompleto ? 'text-green-400' : 'text-red-400'}`}>
                      {formatearMoneda(datosResumen.restante)}
                    </p>
                    {datosResumen.pagoCompleto && (
                      <p className="text-xs text-green-300">¡Pago completo!</p>
                    )}
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
                {solvencia.statusSolicitud === 'costo_especial' && !datosResumen.tieneCostoAsignado && (
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
                          className={`flex-1 inline-flex items-center justify-center px-4 py-2.5 ${!costoNuevo || parseFloat(costoNuevo) <= 0
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

                {/* Acciones administrativas para costo especial con costo asignado */}
                {solvencia.statusSolicitud === 'costo_especial' && datosResumen.tieneCostoAsignado && (
                  <div className="space-y-6">
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                      <h3 className="text-lg font-medium text-green-900 mb-4 flex items-center">
                        <CheckCircle className="mr-2 text-green-600" size={20} />
                        Costo Asignado: {formatearMoneda(datosResumen.total)}
                      </h3>
                      <p className="text-green-700 text-sm mb-4">
                        El costo ha sido asignado correctamente. El colegiado puede proceder con el pago.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  </div>
                )}

                {/* Acciones administrativas para revisión */}
                {(solvencia.statusSolicitud === "revisando" || solvencia.statusSolicitud === "revision") && datosResumen.total > 0 && (
                  <div className="space-y-6 mt-6">
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
                        {fechasDeVencimiento.map(({ trimestre, fecha }) => {
                          return (
                          <option
                            key={trimestre}
                            value={fecha}
                            disabled={fechaActual > fecha || (solvencia.tipo=='anual' && trimestre!==4)}
                          >
                            {formatDate(fecha)}
                          </option>
                        )}
                        )}
                      </select>
                    </div>

                    {/* Botones de acción */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Historial de pagos mejorado */}
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
                    <th className="text-center py-4 px-4 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historialPagos.map((pago, index) => {
                    const IconoEstado = pago.estadoInfo.icon;

                    return (
                      <tr key={pago.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <VerificationSwitch
                              item={{
                                ...pago,
                                status: pago.status === 'aprobado' ? 'approved' :
                                  pago.status === 'rechazado' ? 'rechazado' : 'pending'
                              }}
                              onChange={handleCambioEstadoPago}
                              index={index}
                              type="comprobante"
                              labels={{
                                aprobado: "Aprobado",
                                pendiente: "En Revisión",
                                rechazado: "Rechazado"
                              }}
                              readOnly={pago.status === 'aprobado'}
                            />
                          </div>
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
        {!hayPagos && solvencia.statusSolicitud !== 'costo_especial' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <History className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No hay pagos registrados
            </h3>
            <p className="text-gray-500 mb-4">
              Los pagos realizados para esta solvencia aparecerán aquí
            </p>
            <button
              onClick={() => setShowPagoModal(true)}
              disabled={datosResumen.restante <= 0}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${datosResumen.restante <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white hover:opacity-90'
                }`}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Realizar primer pago
            </button>
          </div>
        )}
      </div>

      {/* Modal de Pago Mejorado */}
      {showPagoModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#41023B]">
                  Procesar Pago de Solvencia
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Colegiado:</span> {solvencia.nombreColegiado}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Total:</span> {formatearMoneda(datosResumen.total)}
                  </p>
                  {datosResumen.pagado > 0 && (
                    <p className="text-sm text-orange-600">
                      <span className="font-medium">Restante:</span> {formatearMoneda(datosResumen.restante)}
                    </p>
                  )}
                </div>

                {/* Mostrar progreso si hay pagos previos */}
                {datosResumen.pagado > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progreso: {datosResumen.porcentajePagado.toFixed(1)}%</span>
                      <span>Pagado: {formatearMoneda(datosResumen.pagado)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
                        style={{ width: `${Math.min(datosResumen.porcentajePagado, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowPagoModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                title="Cerrar modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mostrar información de pagos previos si existen */}
            {historialPagos.length > 0 && (
              <div className="p-4 bg-blue-50 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <History className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">
                      Pagos anteriores: {historialPagos.length}
                    </span>
                  </div>
                  <div className="text-sm text-blue-700">
                    <span className="font-medium">Último pago:</span> {historialPagos[0]?.fechaFormateada}
                  </div>
                </div>
              </div>
            )}

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