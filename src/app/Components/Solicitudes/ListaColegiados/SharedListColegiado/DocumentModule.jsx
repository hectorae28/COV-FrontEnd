// SharedListColegiado/DocumentModule.jsx
import { motion } from "framer-motion";
import {
  AlertCircle, CheckCircle, Eye, FileText, RefreshCcw,
  Upload, X, XCircle
} from "lucide-react";
import { useCallback, useState } from "react";

// Componente principal de gestión de documentos
export function DocumentSection({
  documentos = [], // Proporciona un valor predeterminado de array vacío
  onViewDocument,
  onUpdateDocument,
  onStatusChange,
  title = "Documentos",
  subtitle = "Documentación obligatoria del colegiado",
  icon = <FileText size={20} className="text-[#C40180] mr-2" />,
  filter = doc => !doc.id.includes('comprobante_pago')
}) {
  // Asegúrate de que documentos sea siempre un array antes de filtrar
  const docs = Array.isArray(documentos) ? documentos : [];

  // Ahora es seguro usar filter
  const documentosFiltrados = docs.filter(filter);
  const [documentoParaSubir, setDocumentoParaSubir] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  // Manejadores de eventos
  const handleReemplazarDocumento = useCallback((documento) => {
    setDocumentoParaSubir(documento);
    setSelectedFile(null);
    setError("");
  }, []);

  const handleFileChange = useCallback((file) => {
    // Validar archivo
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError("Tipo de archivo no válido. Por favor suba un archivo PDF, JPG o PNG.");
      setSelectedFile(null);
      return false;
    }

    if (file.size > maxSize) {
      setError("El archivo es demasiado grande. El tamaño máximo es 5MB.");
      setSelectedFile(null);
      return false;
    }

    setSelectedFile(file);
    setError("");
    return true;
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      setError("Por favor seleccione un archivo para subir.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      if (onUpdateDocument) {
        const formData = new FormData();
        formData.append(documentoParaSubir.id, selectedFile);
        await onUpdateDocument(formData);
      }

      setDocumentoParaSubir(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error al subir documento:", error);
      setError("Ocurrió un error al subir el documento. Por favor intente nuevamente.");
    } finally {
      setIsUploading(false);
    }
  }, [documentoParaSubir, onUpdateDocument, selectedFile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center mb-5 md:mb-0 border-b md:border-b-0 pb-3 md:pb-0">
          {icon}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentosFiltrados.length > 0 ? (
          documentosFiltrados.map((documento) => (
            <DocumentCard
              key={documento.id}
              documento={documento}
              onView={() => onViewDocument(documento)}
              onReplace={() => handleReemplazarDocumento(documento)}
              onStatusChange={onStatusChange}
            />
          ))
        ) : (
          <div className="col-span-2 bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center">
            <FileText size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-500 text-center">No hay documentos configurados en el sistema</p>
          </div>
        )}
      </div>

      {/* Modal para subir documentos */}
      {documentoParaSubir && (
        <DocumentUploadModal
          documento={documentoParaSubir}
          selectedFile={selectedFile}
          error={error}
          isUploading={isUploading}
          onClose={() => setDocumentoParaSubir(null)}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
        />
      )}
    </motion.div>
  );
}

// Componente de tarjeta individual de documento
function DocumentCard({ documento, onView, onReplace, onStatusChange }) {
  const tieneArchivo = documento.url !== null;
  const isExonerado = documento.archivo && documento.archivo.toLowerCase().includes("exonerado");
  const isReadOnly = documento.status === 'approved' && documento.isReadOnly;

  const handleStatusChange = (updatedDocument) => {
    if (onStatusChange) {
      onStatusChange(updatedDocument);
    }
  };

  return (
    <div
      className={`border rounded-lg ${isExonerado
        ? "border-green-200 bg-green-50"
        : tieneArchivo
          ? "border-gray-200 hover:border-[#C40180]"
          : "border-red-200 bg-red-50"
        } hover:shadow-md transition-all duration-200`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className={`${isExonerado
                ? "bg-green-100"
                : tieneArchivo
                  ? "bg-[#F9E6F3]"
                  : "bg-red-100"
                } p-2 rounded-md mr-3`}>
                {isExonerado ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <FileText
                    className={tieneArchivo ? "text-[#C40180]" : "text-red-500"}
                    size={20}
                  />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 flex items-center">
                  {documento.nombre}
                  {documento.requerido && <span className="text-red-500 ml-1">*</span>}
                </h3>
                <p className="text-xs text-gray-500">{documento.descripcion}</p>
              </div>
            </div>

            {/* Mensaje cuando no hay archivo */}
            {!tieneArchivo && !isExonerado && (
              <div className="mt-2 flex items-start bg-red-100 p-2 rounded text-xs text-red-600">
                <AlertCircle size={14} className="mr-1 flex-shrink-0 mt-0.5" />
                <span>
                  Falta documento.{" "}
                  {documento.requerido && "Este documento es requerido para completar el registro."}
                </span>
              </div>
            )}

            {/* Mensaje cuando es exonerado */}
            {isExonerado && (
              <div className="mt-2 flex items-start bg-green-100 p-2 rounded text-xs text-green-600">
                <CheckCircle size={14} className="mr-1 flex-shrink-0 mt-0.5" />
                <span>Exonerado por administración</span>
              </div>
            )}

            {/* Switch de verificación si tiene archivo */}
            {tieneArchivo && (
              <div className="mt-3">
                <DocumentVerificationSwitch
                  documento={documento}
                  onChange={handleStatusChange}
                  readOnly={isReadOnly}
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {tieneArchivo || isExonerado ? (
              <button
                onClick={onView}
                className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                title="Ver documento"
              >
                <Eye size={18} />
              </button>
            ) : (
              <span className="text-gray-400 p-2" title="No hay documento para ver">
                <Eye size={18} />
              </span>
            )}

            {/* Botón de reemplazo solo visible si el documento no está aprobado o fue rechazado */}
            {(!isReadOnly && !isExonerado) && (
              <button
                onClick={onReplace}
                className={`${tieneArchivo ? "text-orange-600 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"} p-2 rounded-full transition-colors`}
                title={tieneArchivo ? "Reemplazar documento" : "Subir documento"}
              >
                {tieneArchivo ? <RefreshCcw size={18} /> : <Upload size={18} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Switch para verificación de documentos
export function DocumentVerificationSwitch({
  documento,
  onChange,
  readOnly = false
}) {
  const [isRejectionOpen, setIsRejectionOpen] = useState(false);
  const [rejectionPreset, setRejectionPreset] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [useCustomReason, setUseCustomReason] = useState(false);

  const motivosRechazo = [
    "Documento ilegible",
    "Documento incompleto",
    "Documento caducado",
    "Documento no válido",
    "Formato incorrecto",
    "Faltan firmas o sellos",
    "Información inconsistente",
    "No corresponde con el solicitante",
    "Documento alterado",
    "Documento dañado"
  ];

  const status = documento.status || 'pending';

  const handleStatusChange = (newStatus) => {
    if (readOnly) return;

    if (newStatus === 'rejected') {
      setIsRejectionOpen(true);
    } else {
      onChange({
        ...documento,
        status: newStatus,
        rejectionReason: ''
      });
    }
  };

  const submitRejection = () => {
    const finalReason = useCustomReason
      ? customReason
      : rejectionPreset;

    if (!finalReason.trim()) {
      alert("Por favor seleccione o ingrese un motivo de rechazo");
      return;
    }

    onChange({
      ...documento,
      status: 'rejected',
      rejectionReason: finalReason
    });

    setIsRejectionOpen(false);
  };

  const handleReasonChange = (e) => {
    const value = e.target.value;
    setRejectionPreset(value);

    if (value === "otro") {
      setUseCustomReason(true);
    } else {
      setUseCustomReason(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleStatusChange('approved')}
          disabled={readOnly}
          className={`p-2 rounded-md transition-all ${status === 'approved'
            ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
            : 'bg-gray-100 text-gray-500 hover:bg-green-50'
            } ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          title={readOnly ? "No se puede modificar un documento aprobado" : "Aprobar documento"}
        >
          <CheckCircle size={20} />
        </button>

        <button
          onClick={() => handleStatusChange('rejected')}
          disabled={readOnly}
          className={`p-2 rounded-md transition-all ${status === 'rejected'
            ? 'bg-red-100 text-red-700 ring-2 ring-red-500'
            : 'bg-gray-100 text-gray-500 hover:bg-red-50'
            } ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          title={readOnly ? "No se puede modificar un documento aprobado" : "Rechazar documento"}
        >
          <XCircle size={20} />
        </button>

        <span className="text-sm font-medium">
          {status === 'approved' && 'Aprobado'}
          {status === 'rejected' && 'Rechazado'}
          {status === 'pending' && 'Pendiente'}
        </span>
      </div>

      {/* Modal de razón de rechazo */}
      {isRejectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              Motivo de rechazo
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccione motivo de rechazo <span className="text-red-500">*</span>
              </label>
              <select
                value={rejectionPreset}
                onChange={handleReasonChange}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-300 focus:border-red-500"
              >
                <option value="">Seleccione un motivo...</option>
                {motivosRechazo.map((motivo, index) => (
                  <option key={index} value={motivo}>{motivo}</option>
                ))}
                <option value="otro">Agregar Detalles</option>
              </select>
            </div>

            {useCustomReason && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo personalizado <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:border-red-400"
                  placeholder="Explique por qué rechaza este documento..."
                  rows={3}
                ></textarea>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsRejectionOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={submitRejection}
                disabled={useCustomReason ? !customReason.trim() : !rejectionPreset}
                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${(useCustomReason ? !customReason.trim() : !rejectionPreset)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                  }`}
              >
                Confirmar rechazo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar motivo del rechazo si existe */}
      {status === 'rejected' && documento.rejectionReason && (
        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-md">
          <span className="font-medium">Motivo de rechazo:</span> {documento.rejectionReason}
        </div>
      )}
    </div>
  );
}

// Modal para subir documentos
function DocumentUploadModal({
  documento,
  selectedFile,
  error,
  isUploading,
  onClose,
  onFileChange,
  onUpload
}) {
  const fileInputRef = React.useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileChange(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <FileText className="text-[#C40180] mr-2" size={20} />
            <h3 className="text-lg font-medium text-gray-900">
              {documento.archivo ? "Actualizar documento" : "Subir documento"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-1">{documento.nombre}</h4>
            <p className="text-sm text-gray-500">{documento.descripcion}</p>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 ${error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-[#C40180] bg-gray-50"
              }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && e.target.files[0] && onFileChange(e.target.files[0])}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />

            <Upload className="mx-auto h-12 w-12 text-gray-400" />

            <p className="mt-2 text-sm font-medium text-gray-700">
              {selectedFile ? selectedFile.name : "Haga clic o arrastre un archivo aquí"}
            </p>

            <p className="mt-1 text-xs text-gray-500">PDF, JPG o PNG (máx. 5MB)</p>

            {selectedFile && (
              <div className="mt-2 text-sm text-green-600 font-medium">
                Archivo seleccionado: {selectedFile.name}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 flex items-start bg-red-100 p-3 rounded text-sm text-red-600">
              <AlertCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isUploading}
            >
              Cancelar
            </button>
            <button
              onClick={onUpload}
              disabled={!selectedFile || isUploading}
              className={`px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-md hover:opacity-90 transition-colors flex items-center gap-2 ${!selectedFile || isUploading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Subiendo...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>{documento.archivo ? "Actualizar documento" : "Subir documento"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Componente para la sección de pagos/comprobantes
export function PaymentSection({
  documentos,
  pendiente,
  onViewDocument,
  onUpdateDocument
}) {
  // Filtrar solo comprobantes de pago
  const comprobantes = documentos.filter(doc =>
    doc.id.includes('comprobante_pago') || doc.nombre.toLowerCase().includes('comprobante')
  );

  return (
    <DocumentSection
      documentos={comprobantes}
      onViewDocument={onViewDocument}
      onUpdateDocument={onUpdateDocument}
      title="Comprobantes de Pago"
      subtitle="Comprobantes de inscripción y otros pagos"
      icon={<CreditCard size={20} className="text-[#C40180] mr-2" />}
      filter={() => true} // No filtrar, mostrar todos los comprobantes
    />
  );
}

// Modal para visualizar documentos
export function DocumentViewer({ documento, onClose, pendiente }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determinar si es un documento exonerado
  const isExonerado = documento && documento.archivo && documento.archivo.toLowerCase().includes("exonerado");

  // Determinar si es un comprobante de pago
  const isComprobantePago = documento && (
    documento.id?.includes("comprobante_pago") ||
    documento.nombre?.toLowerCase().includes("comprobante")
  );

  // Obtener el usuario que autorizó la exoneración
  const usuarioExoneracion = pendiente?.exoneracionPagos?.usuario;
  const nombreUsuario = usuarioExoneracion
    ? usuarioExoneracion.username || usuarioExoneracion.name || usuarioExoneracion.email
    : "Administración COV";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isExonerado) {
        setLoading(false);
      } else if (!documento.url) {
        setError("No se pudo cargar el documento. URL no disponible.");
        setLoading(false);
      } else {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [documento, isExonerado]);

  // Determinar el tamaño del modal basado en el contenido
  const getModalSize = () => {
    if (isExonerado) {
      return "max-w-lg h-auto max-h-[90vh]"; // Modal más pequeño para exoneraciones
    } else {
      return "max-w-4xl h-[80vh]"; // Tamaño original para documentos
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-lg shadow-xl w-full flex flex-col ${getModalSize()}`}
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <FileText className="text-[#C40180] mr-2" size={20} />
            <div>
              <h3 className="text-lg font-medium text-gray-900">{documento.nombre}</h3>
              {documento.status && (
                <div className="flex items-center mt-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                    ${documento.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : documento.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {documento.status === 'approved' && <CheckCircle size={12} className="mr-1" />}
                    {documento.status === 'rejected' && <XCircle size={12} className="mr-1" />}
                    {documento.status === 'approved' && 'Aprobado'}
                    {documento.status === 'rejected' && 'Rechazado'}
                    {documento.status === 'pending' && 'Pendiente'}
                  </span>

                  {/* Si está rechazado y tiene motivo de rechazo */}
                  {documento.status === 'rejected' && documento.rejectionReason && (
                    <span className="ml-2 text-xs text-red-600">
                      Motivo: {documento.rejectionReason}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className={`overflow-auto p-4 bg-gray-100 ${isExonerado ? '' : 'flex-1'}`}>
          {loading ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <div className="text-center text-red-500">
                <p className="text-xl mb-2">Error</p>
                <p>{error}</p>
              </div>
            </div>
          ) : isExonerado ? (
            <div className="py-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Pago Exonerado</h3>
                <p className="text-green-700 mb-4">
                  Este pago ha sido exonerado administrativamente y no requiere comprobante.
                </p>
                <div className="text-left bg-white p-4 rounded-md border border-green-100 mt-2">
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Autorizado por:</span> {nombreUsuario}
                  </p>
                  {pendiente?.exoneracionPagos?.fecha && (
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-semibold">Fecha:</span>{" "}
                      {new Date(pendiente.exoneracionPagos.fecha).toLocaleDateString()}
                    </p>
                  )}
                  {pendiente?.exoneracionPagos?.motivo && (
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Motivo:</span> {pendiente.exoneracionPagos.motivo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : documento.url ? (
            <div className="h-full flex items-center justify-center min-h-[400px]">
              {/* Aquí iría el visor de PDF/imágenes, usar un iframe o componente específico */}
              <img
                src={process.env.NEXT_PUBLIC_BACK_HOST + documento.url || "/placeholder.svg"}
                alt={documento.nombre || ""}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <div className="text-center text-gray-500">
                <p className="text-xl mb-2">No hay vista previa disponible</p>
                <p>No se puede mostrar este documento.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t justify-between items-center hidden md:flex">
          <div>
            <p className="text-sm text-gray-500">
              {isExonerado
                ? "Documento exonerado administrativamente"
                : documento.archivo
                  ? `Archivo: ${documento.archivo}`
                  : "No hay archivo disponible"}
            </p>
          </div>
          {documento.url && !isExonerado && (
            <a>
              href={process.env.NEXT_PUBLIC_BACK_HOST + documento.url}
              download={documento.archivo || "documento"}
              className="px-4 py-2 bg-[#C40180] text-white rounded-md hover:bg-[#A00160] transition-colors flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"

              <Download size={16} />
              <span>Descargar</span>
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}