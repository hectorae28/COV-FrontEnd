import { motion } from "framer-motion";
import {
    AlertOctagon, AlertTriangle, CheckCircle, ChevronLeft,
    ChevronRight,
    Upload, X, XCircle
} from "lucide-react";
import { useState } from "react";

// Modal de Aprobación
export function ApprovalModal({
  nombreCompleto,
  datosRegistro,
  setDatosRegistro,
  pasoModal,
  setPasoModal,
  handleAprobarSolicitud,
  documentosCompletos,
  onClose,
  pendiente,
}) {
  const [errores, setErrores] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Verificar si puede continuar al paso 2
  const puedeAvanzar = () => {
    // Validar campos del formulario
    const nuevosErrores = {};
    if (!datosRegistro.libro.trim()) nuevosErrores.libro = "El libro es requerido";
    if (!datosRegistro.pagina.trim()) nuevosErrores.pagina = "La página es requerida";
    if (!datosRegistro.num_cov.trim()) nuevosErrores.num_cov = "El número de COV es requerido";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Avanzar al siguiente paso
  const avanzarPaso = () => {
    if (puedeAvanzar()) {
      setPasoModal(2);
    }
  };

  // Volver al paso anterior
  const retrocederPaso = () => {
    setPasoModal(1);
  };

  // Manejar cambios en los campos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosRegistro((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error al modificar el campo
    if (errores[name]) {
      setErrores((prev) => {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[name];
        return nuevosErrores;
      });
    }
  };

  // Manejar aprobación con estado de carga
  const handleAprobar = async () => {
    setIsProcessing(true);
    try {
      await handleAprobarSolicitud();
    } catch (error) {
      console.error("Error al aprobar:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
      >
        {/* Encabezado */}
        <div className="bg-green-50 p-4 border-b border-green-100">
          <div className="flex items-center justify-center mb-2 text-green-600">
            <CheckCircle size={40} />
          </div>
          <h3 className="text-xl font-semibold text-center text-gray-900">Aprobar solicitud</h3>
        </div>

        {/* Contenido del paso 1 - Datos de registro */}
        {pasoModal === 1 && (
          <div className="p-6">
            {!documentosCompletos && (
              <div className="mb-6 bg-red-50 p-4 rounded-md border border-red-100 flex items-start">
                <XCircle size={20} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-800 font-medium text-sm">Documentación incompleta</h4>
                  <p className="text-red-700 text-xs mt-1">
                    La solicitud no puede ser aprobada porque no todos los documentos han sido aprobados.
                    Por favor revise y apruebe todos los documentos antes de continuar.
                  </p>
                </div>
              </div>
            )}

            {pendiente && pendiente.pagosPendientes && !pendiente.exoneracionPagos?.fecha && (
              <div className="mb-6 bg-red-50 p-4 rounded-md border border-red-100 flex items-start">
                <XCircle size={20} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-800 font-medium text-sm">Pagos pendientes</h4>
                  <p className="text-red-700 text-xs mt-1">
                    La solicitud no puede ser aprobada porque hay pagos pendientes. Complete los pagos o exonere los
                    pagos antes de aprobar.
                  </p>
                </div>
              </div>
            )}

            <p className="text-center text-gray-600 mb-6">
              Está a punto de aprobar la solicitud de{" "}
              <span className="font-medium text-gray-900">{nombreCompleto}</span>. Por favor complete los datos de
              registro.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="libro" className="block text-sm font-medium text-gray-700 mb-1">
                  Libro <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="libro"
                  name="libro"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={datosRegistro.libro}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all ${errores.libro ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                  placeholder="Ej: 001"
                />

                {errores.libro && <p className="text-red-500 text-xs mt-1">{errores.libro}</p>}
              </div>

              <div>
                <label htmlFor="pagina" className="block text-sm font-medium text-gray-700 mb-1">
                  Página <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="pagina"
                  name="pagina"
                  value={datosRegistro.pagina}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all ${errores.pagina ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  placeholder="Ej: 25"
                />
                {errores.pagina && <p className="text-red-500 text-xs mt-1">{errores.pagina}</p>}
              </div>

              <div>
                <label htmlFor="num_cov" className="block text-sm font-medium text-gray-700 mb-1">
                  Número de COV <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="num_cov"
                  name="num_cov"
                  value={datosRegistro.num_cov}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all ${errores.num_cov ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  placeholder="Ej: 12345"
                />
                {errores.num_cov && <p className="text-red-500 text-xs mt-1">{errores.num_cov}</p>}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={onClose}
                className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={avanzarPaso}
                disabled={
                  !documentosCompletos || (pendiente && pendiente.pagosPendientes && !pendiente.exoneracionPagos?.fecha)
                }
                className={`cursor-pointer px-4 py-2 flex items-center ${documentosCompletos && (!pendiente || !pendiente.pagosPendientes || pendiente.exoneracionPagos?.fecha)
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
                  } text-white rounded-md transition-colors`}
              >
                Continuar
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Contenido del paso 2 - Confirmación */}
        {pasoModal === 2 && (
          <div className="p-6">
            <div className="mb-6 bg-green-50 border border-green-100 rounded-md p-4">
              <h4 className="font-medium text-gray-900 mb-3">Resumen de registro</h4>
              <ul className="space-y-2">
                <li className="flex justify-between text-sm">
                  <span className="text-gray-600">Libro:</span>
                  <span className="font-medium text-gray-800">{datosRegistro.libro}</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-600">Página:</span>
                  <span className="font-medium text-gray-800">{datosRegistro.pagina}</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-600">Número de COV:</span>
                  <span className="font-medium text-gray-800">{datosRegistro.num_cov}</span>
                </li>
              </ul>
            </div>

            <p className="text-center text-gray-600 mb-6">
              ¿Está seguro de que desea aprobar la solicitud de{" "}
              <span className="font-medium text-gray-900">{nombreCompleto}</span>? Una vez aprobada, el colegiado será
              registrado oficialmente.
            </p>

            <div className="flex justify-between">
              <button
                onClick={retrocederPaso}
                className="cursor-pointer px-4 py-2 flex items-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isProcessing}
              >
                <ChevronLeft size={16} className="mr-1" />
                Volver
              </button>
              <button
                onClick={handleAprobar}
                disabled={isProcessing}
                className="cursor-pointer px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Aprobando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span>Aprobar solicitud</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Modal de Rechazo/Denegación
export function RejectModal({
  nombreCompleto,
  motivoRechazo,
  setMotivoRechazo,
  handleRechazarSolicitud,
  handleDenegarSolicitud,
  onClose,
  isRechazada,
  documentosRechazados = [],
  institucionesRechazadas = [],
  pagosRechazados = []
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState(null);

  // 🔍 DEBUGGING: Log de las incidencias recibidas
  console.log("🔔 RejectModal - Props recibidas:", {
    documentosRechazados,
    institucionesRechazadas, 
    pagosRechazados,
    totalIncidencias: documentosRechazados.length + institucionesRechazadas.length + pagosRechazados.length
  });

  // Lista de motivos predefinidos para rechazos o denegaciones
  const motivosPredefinidos = [
    "Administración",
    "Documentación incompleta o incorrecta",
    "Información personal inconsistente",
    "Título profesional no válido",
    "Registro del MPPS no verificable",
    "Inconsistencia en la identificación",
    "Error en la documentación académica",
    "Falta de comprobante de pago",
    "No cumple con los requisitos del colegio",
    "Información falsa o adulterada",
    "Sanciones éticas previas"
  ];

  // Estado para controlar si se seleccionó un motivo predefinido
  const [motivoSeleccionado, setMotivoSeleccionado] = useState("");
  const [motivoPersonalizado, setMotivoPersonalizado] = useState("");
  const [usarMotivoPersonalizado, setUsarMotivoPersonalizado] = useState(false);

  // Calcular total de incidencias rechazadas
  const totalIncidenciasRechazadas = documentosRechazados.length + institucionesRechazadas.length + pagosRechazados.length;

  // Actualizar el motivo final cuando cambia la selección o el texto personalizado
  const actualizarMotivoFinal = (tipo, valor) => {
    if (tipo === "predefinido") {
      setMotivoSeleccionado(valor);
      setMotivoRechazo(valor);
      setUsarMotivoPersonalizado(false);
    } else {
      setMotivoPersonalizado(valor);
      setMotivoRechazo(valor);
    }
  };

  // Manejar rechazo con estado de carga
  const handleRechazar = async () => {
    setIsProcessing(true);
    setActionType('rechazar');
    try {
      await handleRechazarSolicitud();
    } catch (error) {
      console.error("Error al rechazar:", error);
      setIsProcessing(false);
    }
  };

  // Manejar denegación con estado de carga
  const handleDenegar = async () => {
    setIsProcessing(true);
    setActionType('denegar');
    try {
      await handleDenegarSolicitud();
    } catch (error) {
      console.error("Error al denegar:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="bg-red-50 p-4 border-b border-red-100">
          <div className="flex items-center justify-center mb-2 text-red-600">
            <XCircle size={40} />
          </div>
          <h3 className="text-xl font-semibold text-center text-gray-900">
            {isRechazada ? "Anular solicitud" : "Rechazar solicitud"}
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-center text-gray-600 mb-4">
            Está a punto de {isRechazada ? "anular" : "rechazar"} la solicitud de{" "}
            <span className="font-medium text-gray-900">{nombreCompleto}</span>.
          </p>

          {!isRechazada && (
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 mb-4">
              <h4 className="text-sm font-medium text-yellow-800 mb-1 flex items-center">
                <AlertOctagon size={16} className="mr-1" /> Diferencia entre rechazar y Anular
              </h4>
              <p className="text-xs text-yellow-700">
                • <strong>Rechazar:</strong> Permite correcciones futuras. El solicitante puede volver a intentarlo.
                <br />• <strong>Anular:</strong> Rechazo definitivo. No se permitirán más acciones sobre esta solicitud.
              </p>
            </div>
          )}

          {/* Resumen de incidencias rechazadas */}
          {totalIncidenciasRechazadas > 0 && (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <AlertTriangle size={20} className="text-red-600 mr-2" />
                <h4 className="text-sm font-medium text-red-700">
                  Incidencias rechazadas encontradas ({totalIncidenciasRechazadas})
                </h4>
              </div>
              
              <div className="bg-red-50 p-4 rounded-md border border-red-100 max-h-64 overflow-y-auto space-y-4">
                {/* Documentos rechazados */}
                {documentosRechazados.length > 0 && (
                  <div>
                    <h5 className="font-medium text-red-800 text-sm mb-2 flex items-center">
                      📄 Documentos rechazados ({documentosRechazados.length})
                    </h5>
                    <div className="space-y-2">
                      {documentosRechazados.map((doc, index) => (
                        <div key={`doc-${index}`} className="bg-white p-2 rounded border border-red-200">
                          <p className="font-medium text-red-800 text-sm">{doc.nombre}</p>
                          <p className="text-xs text-red-700">
                            <strong>Motivo:</strong> {doc.rejectionReason || doc.motivo || "Sin motivo especificado"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instituciones rechazadas */}
                {institucionesRechazadas.length > 0 && (
                  <div>
                    <h5 className="font-medium text-red-800 text-sm mb-2 flex items-center">
                      🏢 Instituciones rechazadas ({institucionesRechazadas.length})
                    </h5>
                    <div className="space-y-2">
                      {institucionesRechazadas.map((inst, index) => (
                        <div key={`inst-${index}`} className="bg-white p-2 rounded border border-red-200">
                          <p className="font-medium text-red-800 text-sm">
                            {inst.nombre || inst.institutionName || "Institución sin nombre"}
                          </p>
                          <p className="text-xs text-red-700">
                            <strong>Motivo:</strong> {inst.motivo_rechazo || inst.rejectionReason || "Sin motivo especificado"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pagos rechazados */}
                {pagosRechazados.length > 0 && (
                  <div>
                    <h5 className="font-medium text-red-800 text-sm mb-2 flex items-center">
                      💳 Comprobantes de pago rechazados ({pagosRechazados.length})
                    </h5>
                    <div className="space-y-2">
                      {pagosRechazados.map((pago, index) => (
                        <div key={`pago-${index}`} className="bg-white p-2 rounded border border-red-200">
                          <p className="font-medium text-red-800 text-sm">
                            {pago.nombre || "Comprobante de pago"}
                          </p>
                          <p className="text-xs text-red-700">
                            <strong>Motivo:</strong> {pago.motivo_rechazo || pago.rejectionReason || "Sin motivo especificado"}
                          </p>
                          {pago.monto && (
                            <p className="text-xs text-gray-600">
                              <strong>Monto:</strong> {pago.metodo_pago_slug === 'bdv' ? 'Bs ' : '$ '}{pago.monto}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-red-600 mt-2 bg-red-100 p-2 rounded">
                <strong>Nota:</strong> Estas incidencias rechazadas serán incluidas automáticamente en el motivo de rechazo enviado al solicitante.
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccione un motivo <span className="text-red-500">*</span>
            </label>
            <select
              value={motivoSeleccionado}
              onChange={(e) => actualizarMotivoFinal("predefinido", e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
              disabled={usarMotivoPersonalizado || isProcessing}
            >
              <option value="">Seleccione un motivo...</option>
              {motivosPredefinidos.map((motivo, index) => (
                <option key={index} value={motivo}>{motivo}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="motivoPersonalizado"
              checked={usarMotivoPersonalizado}
              onChange={() => setUsarMotivoPersonalizado(!usarMotivoPersonalizado)}
              className="h-4 w-4 text-purple-600 rounded border-gray-300"
              disabled={isProcessing}
            />
            <label htmlFor="motivoPersonalizado" className="ml-2 text-sm text-gray-700">
              Agregar Detalles
            </label>
          </div>

          {usarMotivoPersonalizado && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo personalizado
              </label>
              <textarea
                value={motivoPersonalizado}
                onChange={(e) => actualizarMotivoFinal("personalizado", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                placeholder="Ingrese el motivo específico del rechazo o denegación"
                rows="3"
                disabled={isProcessing}
              ></textarea>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-1 mb-4">
            Este motivo será enviado al solicitante por correo electrónico y quedará registrado en el sistema.
            {totalIncidenciasRechazadas > 0 && (
              " Además, se incluirán automáticamente los motivos de rechazo de cada incidencia rechazada."
            )}
          </p>
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            {!isRechazada && (
              <button
                onClick={handleRechazar}
                disabled={!motivoRechazo.trim() || isProcessing}
                className={`cursor-pointer px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-md hover:from-[#C40180] hover:to-[#C40180] transition-all shadow-sm font-medium ${!motivoRechazo.trim() || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing && actionType === 'rechazar' ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Rechazando...
                  </span>
                ) : (
                  'Rechazar solicitud'
                )}
              </button>
            )}
            <button
              onClick={handleDenegar}
              disabled={!motivoRechazo.trim() || isProcessing}
              className={`cursor-pointer px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-600 hover:to-red-600 transition-all shadow-sm font-medium ${!motivoRechazo.trim() || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing && actionType === 'denegar' ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Anulando...
                </span>
              ) : (
                'Anular solicitud'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Modal de Exoneración
export function ExonerationModal({
  nombreCompleto,
  motivoExoneracion,
  setMotivoExoneracion,
  handleExonerarPagos,
  onClose,
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Lista de motivos predefinidos para exoneración
  const motivosExoneracion = [
    "Administración",
    "Convenio institucional",
    "Situación socioeconómica",
    "Méritos académicos excepcionales",
    "Proyecto de investigación aprobado",
    "Participación en programas de servicio",
    "Personal del colegio",
    "Programa especial de reinscripción",
    "Decisión de junta directiva",
    "Caso especial aprobado por el presidente",
    "Condición médica especial"
  ];

  // Estado para controlar si se seleccionó un motivo predefinido
  const [motivoSeleccionado, setMotivoSeleccionado] = useState("");
  const [motivoPersonalizado, setMotivoPersonalizado] = useState("");
  const [usarMotivoPersonalizado, setUsarMotivoPersonalizado] = useState(false);

  // Actualizar el motivo final cuando cambia la selección o el texto personalizado
  const actualizarMotivoFinal = (tipo, valor) => {
    if (tipo === "predefinido") {
      setMotivoSeleccionado(valor);
      setMotivoExoneracion(valor);
      setUsarMotivoPersonalizado(false);
    } else {
      setMotivoPersonalizado(valor);
      setMotivoExoneracion(valor);
    }
  };

  // Manejar exoneración con estado de carga
  const handleExonerar = async () => {
    setIsProcessing(true);
    try {
      await handleExonerarPagos();
    } catch (error) {
      console.error("Error al exonerar:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-xl"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-[#41023B]">Exonerar pagos</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
            disabled={isProcessing}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Está a punto de exonerar los pagos para <strong>{nombreCompleto}</strong>. Esta acción marcará al
              colegiado como solvente sin necesidad de realizar un pago.
            </p>

            <div className="p-4 bg-[#41023B]/20 rounded-xl border border-[#41023B] mb-4">
              <p className="text-md text-gray-800">
                <span className="text-[#41023B] font-bold">Importante:</span> La exoneración de pagos es una acción
                administrativa que debe estar debidamente justificada.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccione motivo de exoneración <span className="text-red-500">*</span>
            </label>
            <select
              value={motivoSeleccionado}
              onChange={(e) => actualizarMotivoFinal("predefinido", e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D7008A] focus:border-[#D7008A] transition-all"
              disabled={usarMotivoPersonalizado || isProcessing}
            >
              <option value="">Seleccione un motivo...</option>
              {motivosExoneracion.map((motivo, index) => (
                <option key={index} value={motivo}>{motivo}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="exoneracionPersonalizada"
              checked={usarMotivoPersonalizado}
              onChange={() => setUsarMotivoPersonalizado(!usarMotivoPersonalizado)}
              className="h-4 w-4 text-purple-600 rounded border-gray-300"
              disabled={isProcessing}
            />
            <label htmlFor="exoneracionPersonalizada" className="ml-2 text-sm text-gray-700">
              Agregar Detalles
            </label>
          </div>

          {usarMotivoPersonalizado && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo personalizado
              </label>
              <textarea
                value={motivoPersonalizado}
                onChange={(e) => actualizarMotivoFinal("personalizado", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:border-[#D7008A]"
                rows={4}
                placeholder="Ingrese el motivo específico por el cual se exoneran los pagos..."
                disabled={isProcessing}
              ></textarea>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            <button
              onClick={handleExonerar}
              disabled={!motivoExoneracion.trim() || isProcessing}
              className={`cursor-pointer px-4 py-2 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-md hover:opacity-90 transition-colors ${!motivoExoneracion.trim() || isProcessing ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Exonerando...
                </span>
              ) : (
                'Confirmar exoneración'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Modal de confirmación de título
export function TitleConfirmationModal({
  nombreColegiado,
  onConfirm,
  onClose
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error al confirmar:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-green-50 p-4 border-b border-green-100">
          <div className="flex items-center justify-center mb-2 text-green-600">
            <CheckCircle size={40} />
          </div>
          <h3 className="text-xl font-semibold text-center text-gray-900">Confirmar entrega de título</h3>
        </div>

        <div className="p-6">
          <p className="text-center text-gray-600 mb-6">
            ¿Confirma que ha entregado el título físico a <span className="font-medium text-gray-900">{nombreColegiado}</span>?
          </p>

          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 mb-6">
            <p className="text-sm text-yellow-700">
              Esta acción no se puede deshacer. Solo marque como entregado cuando el título haya sido físicamente entregado al colegiado.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Confirmando...
                </span>
              ) : (
                'Confirmar entrega'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Modal para reportar irregularidades
export function ReportIllegalityModal({ isOpen, onClose, onSubmit, colegiadoInfo }) {
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportTypes = [
    { id: "fake_credentials", label: "Credenciales falsificadas" },
    { id: "irregular_practice", label: "Ejercicio irregular de la profesión" },
    { id: "fraud", label: "Fraude o estafa a pacientes" },
    { id: "identity_theft", label: "Suplantación de identidad" },
    { id: "other", label: "Otro tipo de irregularidad" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        reportType,
        description,
        evidence,
        colegiado: colegiadoInfo,
        date: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error al enviar reporte:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl">
        <div className="bg-red-50 p-4 border-b border-red-100 flex items-center">
          <AlertTriangle size={24} className="text-red-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Reportar Irregularidad</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Este formulario permite reportar posibles irregularidades relacionadas con
              {colegiadoInfo && (
                <span className="font-medium"> {colegiadoInfo.nombre}</span>
              )}.
              La información proporcionada será tratada con confidencialidad y será investigada por el comité de ética.
            </p>

            <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
              <p className="text-sm text-red-800 font-medium">Importante:</p>
              <p className="text-sm text-red-700 mt-1">
                Proporcionar información falsa o realizar acusaciones sin fundamento puede
                tener consecuencias legales. Asegúrese de contar con evidencia que respalde
                su reporte.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de irregularidad <span className="text-red-500">*</span>
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
                disabled={isSubmitting}
              >
                <option value="">Seleccione el tipo de irregularidad</option>
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción detallada <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Describa en detalle la situación, incluyendo fechas, lugares y personas involucradas..."
                required
                disabled={isSubmitting}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Evidencia (opcional)
              </label>
              <div
                className="w-full p-4 border border-gray-300 rounded-md hover:border-[#C40180] focus-within:ring-2 focus-within:ring-[#C40180] focus-within:border-[#C40180] transition-colors cursor-pointer bg-gray-50"
                onClick={() => !isSubmitting && document.getElementById('evidence-file-input').click()}
              >
                <div className="flex flex-col items-center">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 font-medium mb-1">Haga clic o arrastre un archivo aquí</p>
                  <p className="text-xs text-gray-500">Imágenes, PDF o documentos (máx. 10MB)</p>
                  {evidence && (
                    <div className="mt-3 px-3 py-2 bg-green-50 border border-green-200 rounded-md text-green-700 w-full text-center">
                      <p className="text-sm font-medium">{evidence.name}</p>
                      <p className="text-xs">{Math.round(evidence.size / 1024)} KB</p>
                    </div>
                  )}
                </div>
                <input
                  id="evidence-file-input"
                  type="file"
                  onChange={(e) => setEvidence(e.target.files[0])}
                  className="hidden"
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Puede adjuntar documentos o imágenes que sirvan como evidencia
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!reportType || !description || isSubmitting}
              className={`px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${!reportType || !description || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Enviando...
                </span>
              ) : (
                'Enviar reporte'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}