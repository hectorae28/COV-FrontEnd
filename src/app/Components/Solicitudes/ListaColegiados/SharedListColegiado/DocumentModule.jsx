import DocsRequirements from "@/app/(Registro)/DocsRequirements";
import Modal from "@/app/Components/Solicitudes/ListaColegiados/Modal";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  FileText,
  Pencil,
  RefreshCcw,
  Upload, X
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import DocumentVerificationSwitch from "./DocumentVerificationSwitch";

// Componente principal de gestión de documentos
export function DocumentSection({
  documentos = [],
  onViewDocument,
  updateDocumento,
  onDocumentStatusChange,
  readonly = false,
  filter = doc => !doc.id?.includes('comprobante_pago'),
  isColegiado = false,
  pendienteData = null // Nuevo prop para recibir datos del pendiente
}) {
  // Estados para el modal de edición de documentos
  const [showModal, setShowModal] = useState(false);
  const [localFormData, setLocalFormData] = useState(null);
  const [documentoParaSubir, setDocumentoParaSubir] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedDocumentName, setUploadedDocumentName] = useState("");

  // Función para cargar documentos de pendientes DENTRO de DocumentModule
  const loadPendienteDocuments = useCallback((pendienteData) => {
    if (!pendienteData) return [];

    const documentosMetadata = {
      file_ci: { nombre: "Cédula de identidad", descripcion: "Copia escaneada por ambos lados", requerido: true },
      file_rif: { nombre: "RIF", descripcion: "Registro de Información Fiscal", requerido: true },
      file_fondo_negro: { nombre: "Título universitario fondo negro", descripcion: "Título de Odontólogo con fondo negro", requerido: true },
      file_mpps: { nombre: "Registro MPPS", descripcion: "Registro del Ministerio del Poder Popular para la Salud", requerido: true },
      fondo_negro_credencial: { nombre: "Credencial fondo negro", descripcion: "Credencial profesional con fondo negro", requerido: (tipo) => tipo !== "odontologo" },
      notas_curso: { nombre: "Notas del curso", descripcion: "Certificado de notas académicas", requerido: (tipo) => tipo !== "odontologo" },
      fondo_negro_titulo_bachiller: { nombre: "Título bachiller fondo negro", descripcion: "Título de bachiller con fondo negro", requerido: (tipo) => tipo !== "odontologo" }
    };

    const obtenerNombreArchivo = (url) => {
      if (!url) return "";
      const partes = url.split('/');
      return partes[partes.length - 1];
    };

    // Obtener el tipo de profesión
    const tipoProfesion = pendienteData.tipo_profesion || 'odontologo';
    console.log("Tipo de profesión detectado:", tipoProfesion);

    // Definir qué documentos mostrar según el tipo de profesión
    const documentosParaMostrar = tipoProfesion === 'odontologo'
      ? ['file_ci', 'file_rif', 'file_fondo_negro', 'file_mpps']
      : ['file_ci', 'file_rif', 'file_fondo_negro', 'file_mpps', 'fondo_negro_credencial', 'notas_curso', 'fondo_negro_titulo_bachiller'];

    console.log("Documentos para mostrar:", documentosParaMostrar);

    const todosLosDocumentos = [
      {
        id: "file_ci",
        nombre: documentosMetadata.file_ci.nombre,
        descripcion: documentosMetadata.file_ci.descripcion,
        archivo: obtenerNombreArchivo(pendienteData.file_ci_url),
        requerido: documentosMetadata.file_ci.requerido,
        url: pendienteData.file_ci_url,
        status: pendienteData.file_ci_validate === null ? 'pending' : pendienteData.file_ci_validate ? 'approved' : 'rechazado',
        isReadOnly: pendienteData.file_ci_status === 'approved' && pendienteData.status === 'rechazado',
        rejectionReason: pendienteData.file_ci_motivo_rechazo || ''
      },
      {
        id: "file_rif",
        nombre: documentosMetadata.file_rif.nombre,
        descripcion: documentosMetadata.file_rif.descripcion,
        archivo: obtenerNombreArchivo(pendienteData.file_rif_url),
        requerido: documentosMetadata.file_rif.requerido,
        url: pendienteData.file_rif_url,
        status: pendienteData.file_rif_validate === null ? 'pending' : pendienteData.file_rif_validate ? 'approved' : 'rechazado',
        isReadOnly: pendienteData.file_rif_status === 'approved' && pendienteData.status === 'rechazado',
        rejectionReason: pendienteData.file_rif_motivo_rechazo || ''
      },
      {
        id: "file_fondo_negro",
        nombre: documentosMetadata.file_fondo_negro.nombre,
        descripcion: documentosMetadata.file_fondo_negro.descripcion,
        archivo: obtenerNombreArchivo(pendienteData.file_fondo_negro_url),
        requerido: documentosMetadata.file_fondo_negro.requerido,
        url: pendienteData.file_fondo_negro_url,
        status: pendienteData.file_fondo_negro_validate === null ? 'pending' : pendienteData.file_fondo_negro_validate ? 'approved' : 'rechazado',
        isReadOnly: pendienteData.file_fondo_negro_status === 'approved' && pendienteData.status === 'rechazado',
        rejectionReason: pendienteData.file_fondo_negro_motivo_rechazo || ''
      },
      {
        id: "file_mpps",
        nombre: documentosMetadata.file_mpps.nombre,
        descripcion: documentosMetadata.file_mpps.descripcion,
        archivo: obtenerNombreArchivo(pendienteData.file_mpps_url),
        requerido: documentosMetadata.file_mpps.requerido,
        url: pendienteData.file_mpps_url,
        status: pendienteData.file_mpps_validate === null ? 'pending' : pendienteData.file_mpps_validate ? 'approved' : 'rechazado',
        isReadOnly: pendienteData.file_mpps_status === 'approved' && pendienteData.status === 'rechazado',
        rejectionReason: pendienteData.file_mpps_motivo_rechazo || ''
      },
      // Documentos adicionales para técnicos e higienistas
      {
        id: "fondo_negro_credencial",
        nombre: documentosMetadata.fondo_negro_credencial.nombre,
        descripcion: documentosMetadata.fondo_negro_credencial.descripcion,
        archivo: obtenerNombreArchivo(pendienteData.fondo_negro_credencial_url),
        requerido: documentosMetadata.fondo_negro_credencial.requerido(tipoProfesion),
        url: pendienteData.fondo_negro_credencial_url,
        status: pendienteData.fondo_negro_credencial_validate === null ? 'pending' : pendienteData.fondo_negro_credencial_validate ? 'approved' : 'rechazado',
        isReadOnly: pendienteData.fondo_negro_credencial_status === 'approved' && pendienteData.status === 'rechazado',
        rejectionReason: pendienteData.fondo_negro_credencial_motivo_rechazo || ''
      },
      {
        id: "notas_curso",
        nombre: documentosMetadata.notas_curso.nombre,
        descripcion: documentosMetadata.notas_curso.descripcion,
        archivo: obtenerNombreArchivo(pendienteData.notas_curso_url),
        requerido: documentosMetadata.notas_curso.requerido(tipoProfesion),
        url: pendienteData.notas_curso_url,
        status: pendienteData.notas_curso_validate === null ? 'pending' : pendienteData.notas_curso_validate ? 'approved' : 'rechazado',
        isReadOnly: pendienteData.notas_curso_status === 'approved' && pendienteData.status === 'rechazado',
        rejectionReason: pendienteData.notas_curso_motivo_rechazo || ''
      },
      {
        id: "fondo_negro_titulo_bachiller",
        nombre: documentosMetadata.fondo_negro_titulo_bachiller.nombre,
        descripcion: documentosMetadata.fondo_negro_titulo_bachiller.descripcion,
        archivo: obtenerNombreArchivo(pendienteData.fondo_negro_titulo_bachiller_url),
        requerido: documentosMetadata.fondo_negro_titulo_bachiller.requerido(tipoProfesion),
        url: pendienteData.fondo_negro_titulo_bachiller_url,
        status: pendienteData.fondo_negro_titulo_bachiller_validate === null ? 'pending' : pendienteData.fondo_negro_titulo_bachiller_validate ? 'approved' : 'rechazado',
        isReadOnly: pendienteData.fondo_negro_titulo_bachiller_status === 'approved' && pendienteData.status === 'rechazado',
        rejectionReason: pendienteData.fondo_negro_titulo_bachiller_motivo_rechazo || ''
      }
    ];

    // Filtrar solo los documentos que deben mostrarse para este tipo de profesión
    const documentosFiltrados = todosLosDocumentos.filter(doc =>
      documentosParaMostrar.includes(doc.id) && (doc.url || doc.requerido)
    );

    console.log("Documentos filtrados:", documentosFiltrados);
    return documentosFiltrados;
  }, []);

  // Determinar qué documentos usar
  const documentosToUse = pendienteData
    ? loadPendienteDocuments(pendienteData).filter(filter)
    : (Array.isArray(documentos) ? documentos : []).filter(filter);

  // Normalizar documentos para garantizar una estructura consistente
  const normalizedDocs = documentosToUse.map(doc => ({
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

  // Manejadores de eventos
  const handleReemplazarDocumento = useCallback((documento) => {
    setDocumentoParaSubir(documento);
    setSelectedFile(null);
    setError("");
  }, []);

  // Función para adaptar documentos al formato que espera DocsRequirements
  const mapDocumentosToDocsRequirements = useCallback(() => {
    const mappedFiles = {};

    normalizedDocs.forEach(doc => {
      let fileKey;

      switch (doc.id) {
        case 'cedula':
        case 'ci':
        case 'file_ci':
          fileKey = 'ci';
          break;
        case 'rif':
        case 'file_rif':
          fileKey = 'rif';
          break;
        case 'titulo':
        case 'fondo_negro':
        case 'file_fondo_negro':
          fileKey = 'titulo';
          break;
        case 'mpps':
        case 'file_mpps':
          fileKey = 'mpps';
          break;
        case 'fondo_negro_credencial':
          fileKey = 'fondo_negro_credencial';
          break;
        case 'notas_curso':
          fileKey = 'notas_curso';
          break;
        case 'fondo_negro_titulo_bachiller':
          fileKey = 'fondo_negro_titulo_bachiller';
          break;
        default:
          fileKey = doc.id;
      }

      if (doc.url) {
        mappedFiles[fileKey] = {
          name: doc.archivo || "Archivo existente",
          size: 0,
          type: doc.url.endsWith('pdf') ? 'application/pdf' : 'image/jpeg',
          lastModified: Date.now(),
          isExisting: true,
          url: doc.url
        };
      }
    });

    return {
      ...mappedFiles,
      tipo_profesion: pendienteData?.tipo_profesion || "odontologo",
      documentos_aprobados: false
    };
  }, [normalizedDocs, pendienteData]);

  const handleOpenModal = () => {
    const docsData = mapDocumentosToDocsRequirements();
    setLocalFormData(docsData);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Por favor seleccione un archivo para subir.")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      if (updateDocumento) {
        const Form = new FormData();
        Form.append(`${documentoParaSubir.id}`, selectedFile)

        updateDocumento(Form)
      }

      setDocumentoParaSubir(null)
      setSelectedFile(null)

      setUploadSuccess(true);
      setUploadedDocumentName(documentoParaSubir.nombre);

      setTimeout(() => {
        setUploadSuccess(false);
      }, 5000);

    } catch (error) {
      console.error("Error al subir documento:", error)
      setError("Ocurrió un error al subir el documento. Por favor intente nuevamente.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveChanges = (updates) => {
    if (!updates) return;

    setShowModal(false);
    setLocalFormData(null);

    Object.entries(updates).forEach(([key, file]) => {
      if (file && (file instanceof File || (typeof file === 'object' && file.name && !file.isExisting))) {
        const docId = key;
        if (docId) {
          const Form = new FormData();
          Form.append(docId, file);

          if (updateDocumento) {
            updateDocumento(Form);
          }
        }
      }
    });
  };

  const handleDocsInputChange = (changes) => {
    setLocalFormData(prev => ({
      ...prev,
      ...changes
    }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLocalFormData(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
    >

      <div className="flex items-center justify-between mb-5 border-b pb-3">
        <div className="flex items-center">
          <Briefcase size={20} className="text-[#C40180] mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            Documentos
          </h2>
        </div>

        {!readonly && (
          <button
            onClick={handleOpenModal}
            className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:opacity-90 transition-colors"
          >
            <Pencil size={16} className="mr-1" />
            Editar
          </button>
        )}
      </div>

      {/* Notificación de éxito */}
      {uploadSuccess && (
        <div className="mb-4 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start justify-between">
          <div className="flex items-start">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Documento subido exitosamente</p>
              <p className="text-sm">{uploadedDocumentName} ha sido cargado al sistema.</p>
            </div>
          </div>
          <button
            onClick={() => setUploadSuccess(false)}
            className="text-green-700 hover:bg-green-200 p-1 rounded-full"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {normalizedDocs.length > 0 ? (
          normalizedDocs.map((documento) => (
            <DocumentCard
              key={documento.id}
              documento={documento}
              onView={() => onViewDocument(documento)}
              onReplace={() => handleReemplazarDocumento(documento)}
              onStatusChange={onDocumentStatusChange}
              isColegiado={isColegiado}
            />
          ))
        ) : (
          <div className="col-span-2 bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center">
            <FileText size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-500 text-center">No hay documentos configurados en el sistema</p>
          </div>
        )}
      </div>

      {/* Modal para subir documentos individuales */}
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

      {/* Modal para gestionar documentos usando DocsRequirements */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Editar documentos"
        maxWidth="max-w-4xl"
      >
        {localFormData && (
          <DocsRequirements
            formData={localFormData}
            onInputChange={handleDocsInputChange}
            validationErrors={{}}
            attemptedNext={false}
            isEditMode={true}
            onSave={handleSaveChanges}
          />
        )}
      </Modal>
    </motion.div>
  );
}

// Componente de tarjeta individual de documento (sin cambios)
function DocumentCard({ documento, onView, onReplace, onStatusChange, isColegiado = false }) {
  const tieneArchivo = documento.url !== null;
  const isExonerado = documento.archivo && documento.archivo.toLowerCase().includes("exonerado");
  const isReadOnly = documento.status === 'approved' && documento.isReadOnly;

  const handleStatusChange = (updatedDocument) => {
    if (onStatusChange) {
      onStatusChange(updatedDocument);
    }
  };

  const handleCardClick = (e) => {
    const isActionButton = e.target.closest('.action-button') ||
      e.target.closest('.document-verification-switch');

    if (!isActionButton && (tieneArchivo || isExonerado)) {
      onView();
    }
  };

  return (
    <div
      className={`border rounded-lg transition-all duration-200 ${isExonerado
        ? "border-green-200 bg-green-50"
        : tieneArchivo
          ? "border-gray-200 hover:border-[#C40180] hover:shadow-md cursor-pointer"
          : "border-red-200 bg-red-50"
        }`}
      onClick={handleCardClick}
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

            {!tieneArchivo && !isExonerado && (
              <div className="mt-2 flex items-start bg-red-100 p-2 rounded text-xs text-red-600">
                <AlertCircle size={14} className="mr-1 flex-shrink-0 mt-0.5" />
                <span>
                  Falta documento.{" "}
                  {documento.requerido && "Este documento es requerido para completar el registro."}
                </span>
              </div>
            )}

            {isExonerado && (
              <div className="mt-2 flex items-start bg-green-100 p-2 rounded text-xs text-green-600">
                <CheckCircle size={14} className="mr-1 flex-shrink-0 mt-0.5" />
                <span>Exonerado por administración</span>
              </div>
            )}

            {tieneArchivo && (
              <div className="document-verification-switch">
                <DocumentVerificationSwitch
                  documento={documento}
                  onChange={handleStatusChange}
                  readOnly={isReadOnly}
                  isColegiado={isColegiado}
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 action-button text-[10px] text-gray-400">
            {(!isReadOnly && !isExonerado && documento.status !== 'approved') && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReplace();
                }}
                className={`${tieneArchivo
                  ? "text-orange-600 hover:bg-orange-50"
                  : "text-green-600 hover:bg-green-50"
                  } p-2 rounded-full transition-colors`}
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

// Resto de las funciones helper sin cambios...
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

// Modal para visualizar documentos (sin cambios)
export function DocumentViewer({ documento, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const isExonerado = documento && documento.archivo && documento.archivo.toLowerCase().includes("exonerado");
  const isImage = documento?.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(documento.url);
  const isPDF = documento?.url && /\.pdf$/i.test(documento.url);

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

  // Funciones de zoom
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.25, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.25, 0.25));
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleFitToScreen = () => {
    if (containerRef.current && imageRef.current) {
      const container = containerRef.current;
      const image = imageRef.current;

      const containerWidth = container.clientWidth - 40; // padding
      const containerHeight = container.clientHeight - 40;
      const imageWidth = image.naturalWidth;
      const imageHeight = image.naturalHeight;

      const scaleX = containerWidth / imageWidth;
      const scaleY = containerHeight / imageHeight;
      const newScale = Math.min(scaleX, scaleY, 1);

      setScale(newScale);
      setPosition({ x: 0, y: 0 });
    }
  };

  // Funciones de arrastre
  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom con rueda del mouse
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.25, Math.min(5, prev * delta)));
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Efectos de eventos globales
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          } else {
            onClose();
          }
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          handleResetZoom();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          handleFitToScreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, position, isFullscreen]);

  // Listener para cambios de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-lg shadow-xl flex flex-col ${isFullscreen
          ? 'w-full h-full rounded-none'
          : 'w-[95vw] h-[90vh] max-w-6xl'
          }`}
        ref={containerRef}
      >
        {/* Header con controles */}
        <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10 rounded-t-lg">
          <div className="flex items-center">
            <FileText className="text-[#C40180] mr-2" size={20} />
            <h3 className="text-lg font-medium text-gray-900 truncate max-w-md">
              {documento.nombre}
            </h3>
          </div>

          {/* Controles de zoom */}
          {isImage && (
            <div className="flex items-center gap-2 mx-4">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title="Alejar (-)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>

              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>

              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title="Acercar (+)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>

              <button
                onClick={handleResetZoom}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title="Restablecer (0)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3l18 18" />
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>

              <button
                onClick={handleFitToScreen}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title="Ajustar a pantalla (F)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Botón fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Pantalla completa">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isFullscreen ? (
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                ) : (
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                )}
              </svg>
            </button>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Contenido del documento */}
        <div
          className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center relative"
          onWheel={handleWheel}
        >
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
          ) : isPDF ? (
            // Para PDFs, usar iframe
            <iframe
              src={`${process.env.NEXT_PUBLIC_BACK_HOST}${documento.url}`}
              className="w-full h-full border-0"
              title={documento.nombre}
            />
          ) : isImage ? (
            // Para imágenes, implementar zoom y pan
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden cursor-move"
              style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <img
                ref={imageRef}
                src={`${process.env.NEXT_PUBLIC_BACK_HOST}${documento.url}`}
                alt={documento.nombre}
                className="max-w-none transition-transform duration-200 ease-out select-none"
                style={{
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                  transformOrigin: 'center center'
                }}
                onMouseDown={handleMouseDown}
                onError={() => setError("No se pudo cargar el documento")}
                onLoad={() => {
                  // Auto-fit en la carga inicial
                  setTimeout(handleFitToScreen, 100);
                }}
                draggable={false}
              />
            </div>
          ) : documento.url ? (
            // Para otros tipos de archivo
            <div className="text-center">
              <FileText size={64} className="text-gray-400 mx-auto mb-4" />
              <p className="text-lg mb-2">Vista previa no disponible</p>


              <a href={`${process.env.NEXT_PUBLIC_BACK_HOST}${documento.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-[#C40180] text-white rounded-md hover:bg-[#A0016A] transition-colors"
              >
                <svg width="16" height="16" className="mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Descargar archivo
              </a>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p className="text-xl mb-2">No hay vista previa disponible</p>
              <p>No se puede mostrar este documento.</p>
            </div>
          )}
        </div>

        {/* Footer con atajos de teclado */}
        {isImage && (
          <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 border-t">
            <div className="flex flex-wrap gap-4 justify-center">
              <span><kbd className="bg-gray-200 px-1 rounded">+</kbd> Acercar</span>
              <span><kbd className="bg-gray-200 px-1 rounded">-</kbd> Alejar</span>
              <span><kbd className="bg-gray-200 px-1 rounded">0</kbd> Restablecer</span>
              <span><kbd className="bg-gray-200 px-1 rounded">F</kbd> Ajustar</span>
              <span><kbd className="bg-gray-200 px-1 rounded">Esc</kbd> Cerrar</span>
              <span>Rueda del mouse: Zoom</span>
              <span>Arrastrar: Mover imagen</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}