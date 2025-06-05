"use client";

import api from "@/api/api";
import VerificationSwitch from "@/Components/Solicitudes/ListaColegiados/VerificationSwitch";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  Info,
  Printer,
  Receipt,
  RefreshCw,
  User,
  X,
  XCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DocumentViewer } from "../ListaColegiados/SharedListColegiado/DocumentModule";

// Modal de confirmación para acciones
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "success",
  loading = false,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-600" size={40} />;
      case "danger":
        return <XCircle className="text-red-600" size={40} />;
      case "warning":
        return <AlertTriangle className="text-yellow-600" size={40} />;
      default:
        return <Info className="text-blue-600" size={40} />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "bg-green-600 hover:bg-green-700";
      case "danger":
        return "bg-red-600 hover:bg-red-700";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            {getIcon()}
          </div>
          <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-center text-gray-600 mb-6">{message}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 text-white rounded-md ${getButtonColor()} disabled:opacity-50 flex items-center gap-2`}
            >
              {loading && <RefreshCw size={16} className="animate-spin" />}
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal para rechazar
const RejectModal = ({
  isOpen,
  onClose,
  onConfirm,
  motivoRechazo,
  setMotivoRechazo,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4 text-red-600">
            <XCircle size={40} />
          </div>
          <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
            Rechazar pago
          </h3>
          <p className="text-center text-gray-600 mb-4">
            Ingrese el motivo del rechazo del pago.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo del rechazo <span className="text-red-500">*</span>
            </label>
            <textarea
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Describa el motivo del rechazo..."
              rows="4"
              disabled={loading}
            ></textarea>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading || !motivoRechazo.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <RefreshCw size={16} className="animate-spin" />}
              Rechazar pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal
export default function DetallePago({
  pagoId,
  pagoData,
  onVolver,
  isAdmin = true,
}) {
  // Estados principales
  const [pago, setPago] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Estados para modales
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarRechazo, setMostrarRechazo] = useState(false);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);

  // Estados para formularios
  const [motivoRechazo, setMotivoRechazo] = useState("");

  // Estados para alertas
  const [alertaExito, setAlertaExito] = useState(null);

  // Router para navegación
  const router = useRouter();

  // Función para mostrar alertas temporales
  const mostrarAlerta = useCallback((tipo, mensaje) => {
    setAlertaExito({ tipo, mensaje });
    setTimeout(() => setAlertaExito(null), 5000);
  }, []);

  // Cargar datos del pago
  const loadPagoData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("=== CARGANDO PAGO ===");
      console.log("pagoId:", pagoId);
      console.log("pagoData:", pagoData);

      if (pagoData) {
        // Usar datos pasados por props (desde la lista)
        console.log("Usando datos pasados por props");
        setPago(pagoData);
      } else if (pagoId) {
        // Llamada real a la API usando el ID
        console.log("Cargando pago con ID:", pagoId);

        try {
          const response = await api.get(`/solicitudes/pago/${pagoId}/`);
          console.log("Pago cargado desde API:", response.data);
          setPago(response.data);
        } catch (apiError) {
          console.error("Error específico al cargar pago:", apiError);

          // Si falla la llamada individual, intentar buscar en la lista completa
          try {
            console.log("Intentando buscar en la lista completa de pagos...");
            const responseList = await api.get(`/solicitudes/pago/`);
            const pagos = responseList.data || [];
            console.log("Pagos encontrados:", pagos.length);

            const pagoEncontrado = pagos.find(
              (p) => p.id.toString() === pagoId.toString()
            );

            if (pagoEncontrado) {
              console.log("Pago encontrado en la lista:", pagoEncontrado);
              setPago(pagoEncontrado);
            } else {
              console.log(
                "Pago no encontrado en la lista. IDs disponibles:",
                pagos.map((p) => p.id)
              );
              mostrarAlerta("error", "No se pudo encontrar el pago solicitado");
            }
          } catch (listError) {
            console.error("Error al cargar lista de pagos:", listError);
            mostrarAlerta("error", "Error al cargar la información del pago");
          }
        }
      } else {
        console.log("No hay ID de pago ni datos disponibles");
        mostrarAlerta("error", "No se pudo identificar el pago solicitado");
      }
    } catch (error) {
      console.error("Error general cargando pago:", error);
      mostrarAlerta("error", "Error al cargar la información del pago");
    } finally {
      setIsLoading(false);
    }
  }, [pagoId, pagoData, mostrarAlerta]);

  // Cargar datos al montar
  useEffect(() => {
    if (pagoId) {
      loadPagoData();
    }
  }, [pagoId, loadPagoData]);

  // Función para aprobar el pago
  const handleAprobarPago = async () => {
    try {
      setIsUpdating(true);

      // Aquí harías la llamada real a la API
      // await api.patch(`/solicitudes/pago/${pagoId}/`, {
      //   status: 'aprobado'
      // });

      // Simular respuesta
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const pagoActualizado = {
        ...pago,
        status: "aprobado",
        procesamiento_info: {
          ...pago.procesamiento_info,
          fecha_aprobacion: new Date().toISOString(),
          aprobado_por: "Admin Usuario",
        },
      };

      setPago(pagoActualizado);
      setMostrarConfirmacion(false);
      mostrarAlerta("success", "El pago ha sido aprobado correctamente");
    } catch (error) {
      console.error("Error al aprobar pago:", error);
      mostrarAlerta("error", "Error al aprobar el pago");
    } finally {
      setIsUpdating(false);
    }
  };

  // Función para rechazar el pago
  const handleRechazarPago = async () => {
    try {
      if (!motivoRechazo.trim()) {
        mostrarAlerta("warning", "Debe ingresar un motivo de rechazo");
        return;
      }

      setIsUpdating(true);

      // Aquí harías la llamada real a la API
      // await api.patch(`/solicitudes/pago/${pagoId}/`, {
      //   status: 'rechazado',
      //   motivo_rechazo: motivoRechazo
      // });

      // Simular respuesta
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const pagoActualizado = {
        ...pago,
        status: "rechazado",
        procesamiento_info: {
          ...pago.procesamiento_info,
          fecha_rechazo: new Date().toISOString(),
          rechazado_por: "Admin Usuario",
          motivo_rechazo: motivoRechazo,
        },
      };

      setPago(pagoActualizado);
      setMostrarRechazo(false);
      setMotivoRechazo("");
      mostrarAlerta("warning", "El pago ha sido rechazado");
    } catch (error) {
      console.error("Error al rechazar pago:", error);
      mostrarAlerta("error", "Error al rechazar el pago");
    } finally {
      setIsUpdating(false);
    }
  };

  // Función para ver comprobante
  const handleVerComprobante = () => {
    if (pago?.comprobante_url) {
      setDocumentoSeleccionado({
        nombre: pago.comprobante || "Comprobante de pago",
        url: pago.comprobante_url,
      });
    }
  };

  // Función para obtener el estado de validación del comprobante
  const getComprobanteValidateStatus = () => {
    if (pago?.comprobante_validate === undefined || pago?.comprobante_validate === null) {
      return null; // Pendiente
    }
    return pago.comprobante_validate;
  };

  // Función para manejar la validación del comprobante
  const handleComprobanteValidationChange = (updatedComprobante) => {
    // Actualizar el estado del pago con la nueva validación del comprobante
    setPago(prevPago => ({
      ...prevPago,
      comprobante_validate: updatedComprobante.validate,
      comprobante_motivo_rechazo: updatedComprobante.motivo_rechazo || updatedComprobante.rejectionReason || ''
    }));
  };

  // Función para calcular monto en bolívares
  const calcularMontoBolivares = () => {
    if (pago?.moneda === "bs") {
      return parseFloat(pago.monto || 0);
    }
    return (
      parseFloat(pago?.monto || 0) * parseFloat(pago?.tasa_bcv_del_dia || 1)
    );
  };

  // Obtener color y texto del estado
  const getEstadoInfo = (estado) => {
    switch (estado) {
      case "aprobado":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle size={16} />,
          texto: "Aprobado",
        };
      case "rechazado":
        return {
          color: "bg-red-100 text-red-800",
          icon: <XCircle size={16} />,
          texto: "Rechazado",
        };
      case "pendiente":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock size={16} />,
          texto: "Pendiente",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <Clock size={16} />,
          texto: "Pendiente",
        };
    }
  };

  // Renderizar estado de carga
  if (isLoading) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
      </div>
    );
  }

  // Renderizar mensaje de error si no se encuentra el pago
  if (!pago) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-28">
        <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-start">
          <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium">Pago no encontrado</h3>
            <p className="mt-1">
              No se pudo encontrar la información del pago solicitado.
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            onVolver ? onVolver() : router.push("/PanelControl/Pagos")
          }
          className="cursor-pointer mt-4 inline-flex items-center text-[#C40180] hover:underline transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          Volver a la lista de pagos
        </button>
      </div>
    );
  }

  const estadoInfo = getEstadoInfo(pago.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-24">
      <div className="w-full px-4 md:px-10 py-6">
        {/* Botón de regreso */}
        <div className="mb-6">
          <button
            onClick={() =>
              onVolver ? onVolver() : router.push("/PanelControl/Pagos")
            }
            className="cursor-pointer text-sm text-[#590248] hover:text-[#C40180] flex items-center transition-colors duration-200"
          >
            <ChevronLeft size={20} className="mr-1" />
            Volver a la lista de pagos
          </button>
        </div>

        {/* Alertas de éxito o información */}
        {alertaExito && (
          <div
            className={`mb-6 p-4 rounded-xl border-l-4 shadow-md ${alertaExito.tipo === "success"
              ? "bg-green-50 border-green-400 text-green-800"
              : alertaExito.tipo === "error"
                ? "bg-red-50 border-red-400 text-red-800"
                : alertaExito.tipo === "warning"
                  ? "bg-yellow-50 border-yellow-400 text-yellow-800"
                  : "bg-blue-50 border-blue-400 text-blue-800"
              }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {alertaExito.tipo === "success" ? (
                  <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                ) : alertaExito.tipo === "error" ? (
                  <XCircle size={20} className="mr-3 flex-shrink-0" />
                ) : (
                  <AlertCircle size={20} className="mr-3 flex-shrink-0" />
                )}
                <span className="font-medium">{alertaExito.mensaje}</span>
              </div>
              <button
                onClick={() => setAlertaExito(null)}
                className="ml-2 hover:bg-black/10 p-1 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-[#C40180] to-[#590248] rounded-2xl shadow-xl text-white p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {pago.solicitud
                  ? "Solicitud"
                  : pago.inscripcion
                    ? "Inscripción"
                    : pago.solicitud_solvencia
                      ? "Solvencia"
                      : "Servicio"}
              </h1>
              <p className="text-white/80">
                Referencia: {pago.num_referencia || "No especificada"}
              </p>
            </div>
            <div>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${pago.status === "aprobado"
                  ? "bg-green-500 text-white"
                  : pago.status === "rechazado"
                    ? "bg-red-500 text-white"
                    : "bg-yellow-500 text-white"
                  } shadow-lg`}
              >
                {estadoInfo.icon}
                {estadoInfo.texto}
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
              <div className="bg-white/20 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-white text-xs uppercase tracking-wide">
                  Monto
                </p>
                <p className="text-xl font-bold text-green-500">
                  {pago.moneda === "bs" ? (
                    <>
                      $
                      {(
                        parseFloat(pago.monto || 0) /
                        parseFloat(pago.tasa_bcv_del_dia || 1)
                      ).toFixed(2)}
                    </>
                  ) : (
                    <>${parseFloat(pago.monto || 0).toFixed(2)}</>
                  )}
                </p>
                <p className="text-white text-xs">
                  {pago.moneda === "bs"
                    ? `Bs. ${parseFloat(pago.monto || 0).toFixed(2)} (Tasa: ${pago.tasa_bcv_del_dia
                    })`
                    : pago.tasa_bcv_del_dia
                      ? `≈ Bs. ${calcularMontoBolivares().toFixed(2)}`
                      : "USD"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Columna izquierda*/}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <User className="mr-3 text-[#C40180]" size={24} />
                  Colegiado
                </h2>
                <button className="text-white  text-sm font-medium transition-colors rounded-xl bg-gradient-to-r from-[#D7008A] to-[#41023B] py-1 px-4 cursor-pointer">
                  Ver perfil
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-[#C40180] pl-4">
                  <p className="text-sm text-gray-500 mb-1">Nombre completo</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {pago?.colegiado?.nombre_completo || "No especificado"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Número COV
                    </p>
                    <p className="text-sm font-medium">
                      {pago?.colegiado?.numero_colegiado || "No especificado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Cédula
                    </p>
                    <p className="text-sm font-medium">
                      {pago?.colegiado?.cedula || "No especificado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Correo
                    </p>
                    <p className="text-sm font-medium">
                      {pago?.colegiado?.email || "No especificado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Teléfono móvil
                    </p>
                    <p className="text-sm font-medium">
                      {pago?.colegiado?.telefono_movil ||
                        pago?.colegiado?.telefono ||
                        "No especificado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Teléfono habitación
                    </p>
                    <p className="text-sm font-medium">
                      {pago?.colegiado?.telefono_habitacion ||
                        "No especificado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-1">
            <div className="space-y-6 h-full">

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  Información del Pago
                </h2>

                <div className="space-y-3">
                  {/* Fecha de pago */}
                  <div className="flex items-center">
                    <Calendar className="text-blue-600 h-4 w-4 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Fecha de pago:</span>
                    <span className="ml-2 text-sm font-bold text-blue-900">
                      {new Date(pago.fecha_pago).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Método de pago */}
                  <div className="flex items-center">
                    <CreditCard className="text-purple-600 h-4 w-4 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Método de pago:</span>
                    <span className="ml-2 text-sm font-bold text-purple-900">
                      {pago.metodo_de_pago_nombre || "No especificado"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comprobante de pago */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  Validación del pago
                </h2>

                <div
                  onClick={handleVerComprobante}
                  className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-4 cursor-pointer hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 group mb-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-emerald-500 p-2 rounded-full group-hover:bg-emerald-600 transition-colors">
                      <Receipt className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-emerald-900 group-hover:text-emerald-800">
                        {pago.comprobante || "comprobante.pdf"}
                      </h3>
                      <p className="text-emerald-700 text-xs">Clic para ver</p>
                    </div>
                    <div className="text-emerald-600 group-hover:text-emerald-700">
                      <Eye className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Verificación del comprobante */}
                {isAdmin && pago?.comprobante_url && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Validación del Pago</h3>
                    <VerificationSwitch
                      item={{
                        id: 'comprobante_pago',
                        nombre: 'Comprobante de pago',
                        validate: getComprobanteValidateStatus(),
                        rejectionReason: pago.comprobante_motivo_rechazo || '',
                        motivo_rechazo: pago.comprobante_motivo_rechazo || '',
                        url: pago.comprobante_url
                      }}
                      onChange={handleComprobanteValidationChange}
                      type="comprobante"
                      readOnly={false}
                      labels={{
                        aprobado: "Aprobado",
                        pendiente: "Pendiente",
                        rechazado: "Rechazado"
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Información de procesamiento */}
              {pago.status === "aprobado" && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-start">
                    <div className="bg-green-500 p-2 rounded-full mr-3">
                      <CheckCircle className="text-white h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-green-800 mb-1">
                        Pago aprobado
                      </h4>
                      <p className="text-green-700 text-xs">
                        {new Date(
                          pago.procesamiento_info?.fecha_aprobacion ||
                          Date.now()
                        ).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {pago.status === "rechazado" && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-start">
                    <div className="bg-red-500 p-2 rounded-full mr-3">
                      <XCircle className="text-white h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-red-800 mb-1">
                        Pago rechazado
                      </h4>
                      <p className="text-red-700 text-xs">
                        {new Date(
                          pago.procesamiento_info?.fecha_rechazo || Date.now()
                        ).toLocaleDateString("es-ES")}
                      </p>
                      {pago.procesamiento_info?.motivo_rechazo && (
                        <div className="bg-red-100 rounded-lg p-2 mt-2">
                          <p className="text-red-800 text-xs font-medium">
                            <strong>Motivo:</strong>{" "}
                            {pago.procesamiento_info.motivo_rechazo}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              {isAdmin && pago.status === "pendiente" && (
                <div className="bg-white rounded-2xl shadow-lg p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    Acciones
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setMostrarConfirmacion(true)}
                      disabled={isUpdating}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 text-sm"
                    >
                      <CheckCircle size={16} />
                      <span>Aprobar</span>
                    </button>

                    <button
                      onClick={() => setMostrarRechazo(true)}
                      disabled={isUpdating}
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:from-red-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 text-sm"
                    >
                      <XCircle size={16} />
                      <span>Rechazar</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Acciones adicionales */}
              {pago.status === "aprobado" && (
                <div className="bg-white rounded-2xl shadow-lg p-4">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm">
                    <Printer size={16} />
                    <span>Generar recibo</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modales */}
        <ConfirmationModal
          isOpen={mostrarConfirmacion}
          onClose={() => setMostrarConfirmacion(false)}
          onConfirm={handleAprobarPago}
          title="Confirmar aprobación"
          message="¿Está seguro que desea aprobar este pago? Esta acción no se puede deshacer."
          type="success"
          loading={isUpdating}
        />

        <RejectModal
          isOpen={mostrarRechazo}
          onClose={() => setMostrarRechazo(false)}
          onConfirm={handleRechazarPago}
          motivoRechazo={motivoRechazo}
          setMotivoRechazo={setMotivoRechazo}
          loading={isUpdating}
        />

        {documentoSeleccionado && (
          <DocumentViewer
            documento={documentoSeleccionado}
            onClose={() => setDocumentoSeleccionado(null)}
          />
        )}
      </div>
    </div>
  );
}
