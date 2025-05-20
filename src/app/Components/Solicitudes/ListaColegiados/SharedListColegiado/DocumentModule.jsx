import { motion } from "framer-motion";
import {
  AlertCircle, CheckCircle, Eye,
  FileText, RefreshCcw,
  Upload, X
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import DocumentVerificationSwitch from "./DocumentVerificationSwitch";

// Componente principal de gestión de documentos
export function DocumentSection({
  documentos = [], // Proporciona un valor predeterminado de array vacío
  onViewDocument,
  onUpdateDocument,
  onDocumentStatusChange,
  title = "Documentos",
  subtitle = "Documentación obligatoria del colegiado",
  icon = <FileText size={20} className="text-[#C40180] mr-2" />,
  filter = doc => !doc.id?.includes('comprobante_pago')
}) {
  // Asegúrate de que documentos sea siempre un array antes de filtrar
  const docs = Array.isArray(documentos) ? documentos : [];

  // Normalizamos los documentos para garantizar una estructura consistente
  const normalizedDocs = docs.map(doc => ({
    id: doc.id || doc.nombre?.toLowerCase().replace(/\s+/g, '_') || `doc-${Math.random()}`,
    nombre: doc.nombre || "Documento",
    descripcion: doc.descripcion || "Sin descripción",
    archivo: typeof doc.archivo === 'string' ? doc.archivo :
      (doc.url ? doc.url.split('/').pop() : "Documento"),
    requerido: !!doc.requerido,
    url: doc.url || null,
    status: doc.status || 'pending',
    isReadOnly: !!doc.isReadOnly,
    rejectionReason: doc.rejectionReason || ''
  }));

  // Ahora es seguro usar filter
  const documentosFiltrados = normalizedDocs.filter(filter);
  const [documentoParaSubir, setDocumentoParaSubir] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Manejadores de eventos
  const handleReemplazarDocumento = useCallback((documento) => {
    setDocumentoParaSubir(documento);
    setSelectedFile(null);
    setError("");
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar archivo
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError("Tipo de archivo no válido. Por favor suba un archivo PDF, JPG o PNG.");
      setSelectedFile(null);
      return;
    }

    if (file.size > maxSize) {
      setError("El archivo es demasiado grande. El tamaño máximo es 5MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];

      // Validar archivo
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setError("Tipo de archivo no válido. Por favor suba un archivo PDF, JPG o PNG.");
        return;
      }

      if (file.size > maxSize) {
        setError("El archivo es demasiado grande. El tamaño máximo es 5MB.");
        return;
      }

      setSelectedFile(file);
      setError("");
    }
  };

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      setError("Por favor seleccione un archivo para subir.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      if (onUpdateDocument && documentoParaSubir) {
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
              onView={() => onViewDocument && onViewDocument(documento)}
              onReplace={() => handleReemplazarDocumento(documento)}
              onStatusChange={onDocumentStatusChange}
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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center">
                <FileText className="text-[#C40180] mr-2" size={20} />
                <h3 className="text-lg font-medium text-gray-900">
                  {documentoParaSubir.archivo ? "Actualizar documento" : "Subir documento"}
                </h3>
              </div>
              <button
                onClick={() => setDocumentoParaSubir(null)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-1">{documentoParaSubir.nombre}</h4>
                <p className="text-sm text-gray-500">{documentoParaSubir.descripcion}</p>
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
                  onChange={(e) => handleFileChange(e)}
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
                  onClick={() => setDocumentoParaSubir(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={isUploading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpload}
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
                      <span>{documentoParaSubir.archivo ? "Actualizar documento" : "Subir documento"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
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

// Función helper para normalizar documentos
export function mapDocumentsForSection(documentos = []) {
  if (!Array.isArray(documentos)) return [];

  return documentos.map(doc => ({
    id: doc.id || doc.nombre?.toLowerCase().replace(/\s+/g, '_') || `doc-${Math.random()}`,
    nombre: doc.nombre || "Documento",
    descripcion: doc.descripcion || "Sin descripción",
    archivo: typeof doc.archivo === 'string' ? doc.archivo :
      (doc.url ? doc.url.split('/').pop() : "Documento"),
    requerido: !!doc.requerido,
    url: doc.url || null,
    status: doc.status || 'pending',
    isReadOnly: !!doc.isReadOnly,
    rejectionReason: doc.rejectionReason || ''
  }));
}

// Modal para visualizar documentos
export function DocumentViewer({ documento, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isExonerado = documento && documento.archivo && documento.archivo.toLowerCase().includes("exonerado");

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

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <FileText className="text-[#C40180] mr-2" size={20} />
            <h3 className="text-lg font-medium text-gray-900">{documento.nombre}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-gray-100 flex items-center justify-center">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <p className="text-xl mb-2">Error</p>
              <p>{error}</p>
            </div>
          ) : isExonerado ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">Documento Exonerado</h3>
              <p className="text-green-700 mb-4">
                Este documento ha sido exonerado administrativamente.
              </p>
            </div>
          ) : documento.url ? (
            <img
              src={documento.url}
              alt={documento.nombre}
              className="max-h-full max-w-full object-contain"
              onError={() => setError("No se pudo cargar el documento")}
            />
          ) : (
            <div className="text-center text-gray-500">
              <p className="text-xl mb-2">No hay vista previa disponible</p>
              <p>No se puede mostrar este documento.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}