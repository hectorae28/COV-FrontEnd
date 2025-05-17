"use client";

import { fetchDataSolicitudes } from "@/api/endpoints/landingPage";
import useDataListaColegiados from "@/store/ListaColegiadosData.jsx";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";


// Import components
import PagosColg from "@/app/Components/PagosModal";
import {
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import AcademicInfoSection from "./DetallePendiente/AcademicInfoSection ";
import {
  ApprovalModal,
  ExonerationModal,
  RejectModal,
} from "./DetallePendiente/ActionsModals";
import DocumentsSection from "./DetallePendiente/DocumentsSection";
import DocumentViewerModal from "./DetallePendiente/DocumentViewerModal";
import InstitutionsSection from "./DetallePendiente/InstitutionsSection ";
import PersonalInfoSection from "./DetallePendiente/PersonalInfoSection ";
import ProfileCard from "./DetallePendiente/ProfileCard";
import StatusAlerts from "./DetallePendiente/StatusAlerts";

// Componente de reporte de ilegalidades
function ReportIllegalityModal({ isOpen, onClose, onSubmit, colegiadoInfo }) {
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState(null);

  const reportTypes = [
    { id: "fake_credentials", label: "Credenciales falsificadas" },
    { id: "illegal_practice", label: "Ejercicio ilegal de la profesión" },
    { id: "fraud", label: "Fraude o estafa a pacientes" },
    { id: "identity_theft", label: "Suplantación de identidad" },
    { id: "other", label: "Otro tipo de ilegalidad" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      reportType,
      description,
      evidence,
      colegiado: colegiadoInfo,
      date: new Date().toISOString()
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl">
        <div className="bg-red-50 p-4 border-b border-red-100 flex items-center">
          <AlertTriangle size={24} className="text-red-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Reportar Ilegalidad</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Este formulario permite reportar posibles ilegalidades relacionadas con
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
                Tipo de ilegalidad <span className="text-red-500">*</span>
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Seleccione el tipo de ilegalidad</option>
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
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Evidencia (opcional)
              </label>
              <input
                type="file"
                onChange={(e) => setEvidence(e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Puede adjuntar documentos, imágenes u otros archivos que sirvan como evidencia (máx. 10MB)
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!reportType || !description}
              className={`px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${!reportType || !description ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              Enviar reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente para verificar documentos individualmente
function DocumentVerificationSwitch({
  documento,
  onChange,
  readOnly = false
}) {
  const [isRejectionOpen, setIsRejectionOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState(documento.rejectionReason || '');
  const [rejectionPreset, setRejectionPreset] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [useCustomReason, setUseCustomReason] = useState(false);

  // Motivos predefinidos de rechazo
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

  // El estado actual del documento (approved, rejected, pending)
  const status = documento.status || 'pending';

  const handleStatusChange = (newStatus) => {
    if (readOnly) return;

    // Si se rechaza, abrir modal para motivo
    if (newStatus === 'rejected') {
      setIsRejectionOpen(true);
    } else {
      // Si se aprueba, actualizar inmediatamente
      onChange({
        ...documento,
        status: newStatus,
        rejectionReason: ''
      });
    }
  };

  const submitRejection = () => {
    // Determinar la razón de rechazo final
    const finalReason = useCustomReason
      ? customReason
      : rejectionPreset;

    if (!finalReason.trim()) {
      alert("Por favor seleccione o ingrese un motivo de rechazo");
      return;
    }

    // Actualizar documento con estado rechazado y motivo
    onChange({
      ...documento,
      status: 'rejected',
      rejectionReason: finalReason
    });

    setIsRejectionOpen(false);
  };

  // Actualizar la razón al cambiar la selección
  const handleReasonChange = (e) => {
    const value = e.target.value;
    setRejectionPreset(value);

    // Si selecciona "Otro", habilitar campo personalizado
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
              <AlertTriangle className="text-red-500 mr-2" size={20} />
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
                <option value="otro">Otro motivo...</option>
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

export default function DetallePendiente({ params, onVolver, isAdmin = false, recaudos = null, handleForward = null }) {
  const [metodoPago, setMetodoPago] = useState([]);
  const [tasaBcv, setTasaBcv] = useState(0);
  const [costoInscripcion, setCostoInscripcion] = useState(0);
  const pendienteId = params?.id || "p1";

  // Obtenemos funciones del store centralizado
  const getColegiadoPendiente = useDataListaColegiados(
    (state) => state.getColegiadoPendiente
  );
  const updateColegiadoPendiente = useDataListaColegiados(
    (state) => state.updateColegiadoPendiente
  );
  const approveRegistration = useDataListaColegiados(
    (state) => state.approveRegistration
  );
  const rejectRegistration = useDataListaColegiados(
    (state) => state.rejectRegistration
  );
  const denyRegistration = useDataListaColegiados(
    (state) => state.denyRegistration
  );
  const initSession = useDataListaColegiados((state) => state.initSession);
  const updateColegiadoPendienteWithToken = useDataListaColegiados((state) => state.updateColegiadoPendienteWithToken)

  // Estados locales
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendiente, setPendiente] = useState(null);
  const [cambiosPendientes, setCambiosPendientes] = useState(false);

  // Estados para modales
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarRechazo, setMostrarRechazo] = useState(false);
  const [mostrarExoneracion, setMostrarExoneracion] = useState(false);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Estados para datos
  const [pagosPendientes, setPagosPendientes] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [motivoExoneracion, setMotivoExoneracion] = useState("");
  const [documentosCompletos, setDocumentosCompletos] = useState(false);
  const [documentosRequeridos, setDocumentosRequeridos] = useState([]);
  const [documentosStatus, setDocumentosStatus] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Estados para notificaciones
  const [confirmacionExitosa, setConfirmacionExitosa] = useState(false);
  const [rechazoExitoso, setRechazoExitoso] = useState(false);
  const [denegacionExitosa, setDenegacionExitosa] = useState(false);
  const [exoneracionExitosa, setExoneracionExitosa] = useState(false);

  // Estados para edición
  const [editandoPersonal, setEditandoPersonal] = useState(false);
  const [editandoAcademico, setEditandoAcademico] = useState(false);
  const [editandoInstituciones, setEditandoInstituciones] = useState(false);
  const [datosPersonales, setDatosPersonales] = useState(null);
  const [datosAcademicos, setDatosAcademicos] = useState(null);
  const [instituciones, setInstituciones] = useState([]);
  const [agregarInstitucion, setAgregarInstitucion] = useState(false);
  const [nuevaInstitucion, setNuevaInstitucion] = useState({
    nombre: "",
    cargo: "",
    telefono: "",
    direccion: "",
  });

  // Estados para datos de registro
  const [datosRegistro, setDatosRegistro] = useState({
    libro: "",
    pagina: "",
    num_cov: "",
  });
  const [pasoModal, setPasoModal] = useState(1);

  const documentosMetadata = {
    Fondo_negro_credencial: {
      nombre: "Credencial fondo negro",
      descripcion: "Credencial profesional con fondo negro",
      requerido: (tipo_profesion) => tipo_profesion !== "odontologo"
    },
    notas_curso: {
      nombre: "Notas del curso",
      descripcion: "Certificado de notas académicas",
      requerido: (tipo_profesion) => tipo_profesion !== "odontologo"
    },
    fondo_negro_titulo_bachiller: {
      nombre: "Título bachiller fondo negro",
      descripcion: "Título de bachiller con fondo negro",
      requerido: (tipo_profesion) => tipo_profesion !== "odontologo"
    },
    file_ci: {
      nombre: "Cédula de identidad",
      descripcion: "Copia escaneada por ambos lados",
      requerido: true
    },
    file_rif: {
      nombre: "RIF",
      descripcion: "Registro de Información Fiscal",
      requerido: true
    },
    file_fondo_negro: {
      nombre: "Título universitario fondo negro",
      descripcion: "Título de Odontólogo con fondo negro",
      requerido: true
    },
    file_mpps: {
      nombre: "Registro MPPS",
      descripcion: "Registro del Ministerio del Poder Popular para la Salud",
      requerido: true
    }
  };
  const obtenerNombreArchivo = (url) => {
    if (!url) return "";
    const partes = url.split('/');
    return partes[partes.length - 1];
  };

  // Función para verificar si todos los documentos están aprobados
  const allDocumentsApproved = () => {
    if (!documentosRequeridos || documentosRequeridos.length === 0) return false;

    // Verificar que todos los documentos requeridos tengan estado 'approved'
    return documentosRequeridos
      .filter(doc => doc.requerido) // Solo considerar documentos requeridos
      .every(doc => {
        // Si el documento no tiene URL (no está cargado), no puede estar aprobado
        if (!doc.url) return false;

        // Obtener el estado del documento, ya sea del estado local o del documento
        const status = documentosStatus[doc.id]?.status || doc.status;
        return status === 'approved';
      });
  };

  // Función para manejar cambios en el estado de los documentos
  const handleDocumentStatusChange = (updatedDocument) => {
    setDocumentosStatus(prev => ({
      ...prev,
      [updatedDocument.id]: {
        status: updatedDocument.status,
        rejectionReason: updatedDocument.rejectionReason || ''
      }
    }));

    // Si estamos en una solicitud rechazada, marcar el documento como de solo lectura
    // si ha sido aprobado previamente
    if (isRechazada && updatedDocument.status === 'approved') {
      const docsCopy = [...documentosRequeridos];
      const index = docsCopy.findIndex(doc => doc.id === updatedDocument.id);
      if (index !== -1) {
        docsCopy[index] = {
          ...docsCopy[index],
          status: 'approved',
          isReadOnly: true
        };
        setDocumentosRequeridos(docsCopy);
      }
    }
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Obtener datos del pendiente desde el store
      let pendienteData
      if (!recaudos) {
        pendienteData = await getColegiadoPendiente(pendienteId);
      } else {
        pendienteData = recaudos
      }
      if (pendienteData) {
        const documentosFormateados = [
          {
            id: "file_ci",
            nombre: documentosMetadata.file_ci.nombre,
            descripcion: documentosMetadata.file_ci.descripcion,
            archivo: obtenerNombreArchivo(pendienteData.file_ci_url),
            requerido: documentosMetadata.file_ci.requerido,
            url: pendienteData.file_ci_url,
            status: pendienteData.file_ci_status || 'pending',
            isReadOnly: pendienteData.file_ci_status === 'approved' && pendienteData.status === 'rechazado',
            rejectionReason: pendienteData.file_ci_rejection_reason || ''
          },
          {
            id: "file_rif",
            nombre: documentosMetadata.file_rif.nombre,
            descripcion: documentosMetadata.file_rif.descripcion,
            archivo: obtenerNombreArchivo(pendienteData.file_rif_url),
            requerido: documentosMetadata.file_rif.requerido,
            url: pendienteData.file_rif_url,
            status: pendienteData.file_rif_status || 'pending',
            isReadOnly: pendienteData.file_rif_status === 'approved' && pendienteData.status === 'rechazado',
            rejectionReason: pendienteData.file_rif_rejection_reason || ''
          },
          {
            id: "file_fondo_negro",
            nombre: documentosMetadata.file_fondo_negro.nombre,
            descripcion: documentosMetadata.file_fondo_negro.descripcion,
            archivo: obtenerNombreArchivo(pendienteData.file_fondo_negro_url),
            requerido: documentosMetadata.file_fondo_negro.requerido,
            url: pendienteData.file_fondo_negro_url,
            status: pendienteData.file_fondo_negro_status || 'pending',
            isReadOnly: pendienteData.file_fondo_negro_status === 'approved' && pendienteData.status === 'rechazado',
            rejectionReason: pendienteData.file_fondo_negro_rejection_reason || ''
          },
          {
            id: "file_mpps",
            nombre: documentosMetadata.file_mpps.nombre,
            descripcion: documentosMetadata.file_mpps.descripcion,
            archivo: obtenerNombreArchivo(pendienteData.file_mpps_url),
            requerido: documentosMetadata.file_mpps.requerido,
            url: pendienteData.file_mpps_url,
            status: pendienteData.file_mpps_status || 'pending',
            isReadOnly: pendienteData.file_mpps_status === 'approved' && pendienteData.status === 'rechazado',
            rejectionReason: pendienteData.file_mpps_rejection_reason || ''
          },
          {
            id: "Fondo_negro_credencial",
            nombre: documentosMetadata.Fondo_negro_credencial.nombre,
            descripcion: documentosMetadata.Fondo_negro_credencial.descripcion,
            archivo: obtenerNombreArchivo(pendienteData.Fondo_negro_credencial_url),
            requerido: documentosMetadata.Fondo_negro_credencial.requerido(pendienteData.tipo_profesion),
            url: pendienteData.Fondo_negro_credencial_url,
            status: pendienteData.Fondo_negro_credencial_status || 'pending',
            isReadOnly: pendienteData.Fondo_negro_credencial_status === 'approved' && pendienteData.status === 'rechazado',
            rejectionReason: pendienteData.Fondo_negro_credencial_rejection_reason || ''
          },
          {
            id: "notas_curso",
            nombre: documentosMetadata.notas_curso.nombre,
            descripcion: documentosMetadata.notas_curso.descripcion,
            archivo: obtenerNombreArchivo(pendienteData.notas_curso_url),
            requerido: documentosMetadata.notas_curso.requerido(pendienteData.tipo_profesion),
            url: pendienteData.notas_curso_url,
            status: pendienteData.notas_curso_status || 'pending',
            isReadOnly: pendienteData.notas_curso_status === 'approved' && pendienteData.status === 'rechazado',
            rejectionReason: pendienteData.notas_curso_rejection_reason || ''
          },
          {
            id: "fondo_negro_titulo_bachiller",
            nombre: documentosMetadata.fondo_negro_titulo_bachiller.nombre,
            descripcion: documentosMetadata.fondo_negro_titulo_bachiller.descripcion,
            archivo: obtenerNombreArchivo(pendienteData.fondo_negro_titulo_bachiller_url),
            requerido: documentosMetadata.fondo_negro_titulo_bachiller.requerido(pendienteData.tipo_profesion),
            url: pendienteData.fondo_negro_titulo_bachiller_url,
            status: pendienteData.fondo_negro_titulo_bachiller_status || 'pending',
            isReadOnly: pendienteData.fondo_negro_titulo_bachiller_status === 'approved' && pendienteData.status === 'rechazado',
            rejectionReason: pendienteData.fondo_negro_titulo_bachiller_rejection_reason || ''
          },
        ];
        setPendiente(pendienteData);

        // Inicializar estados de edición
        setDatosPersonales({ ...pendienteData.persona });
        setDatosAcademicos({
          instituto_bachillerato: pendienteData.instituto_bachillerato || "",
          universidad: pendienteData.universidad || "",
          fecha_egreso_universidad:
            pendienteData.fecha_egreso_universidad || "",
          num_registro_principal: pendienteData.num_registro_principal || "",
          fecha_registro_principal:
            pendienteData.fecha_registro_principal || "",
          num_mpps: pendienteData.num_mpps || "",
          fecha_mpps: pendienteData.fecha_mpps || "",
          observaciones: pendienteData.observaciones || "",
        });
        setInstituciones(
          pendienteData.instituciones ? [...pendienteData.instituciones] : []
        );

        // Verificar si los documentos están completos
        setDocumentosCompletos(
          !pendienteData.archivos_faltantes.tiene_faltantes
        );

        setDocumentosRequeridos(documentosFormateados);

        // Inicializar el estado de los documentos
        const initialDocStatus = {};
        documentosFormateados.forEach(doc => {
          initialDocStatus[doc.id] = {
            status: doc.status || 'pending',
            rejectionReason: doc.rejectionReason || '',
            isReadOnly: doc.isReadOnly || false
          };
        });
        setDocumentosStatus(initialDocStatus);

        setPagosPendientes(pendienteData.pago === null && !pendienteData.pago_exonerado);

        // Determinar si la solicitud está rechazada o anulada
        const isRechazada = pendienteData.status === "rechazado";
        const isDenegada = pendienteData.status === "denegado";
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error al cargar datos del pendiente:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pendienteId, getColegiadoPendiente, recaudos]);

  useEffect(() => {
    const LoadData = async () => {
      try {
        const tasa = await fetchDataSolicitudes("tasa-bcv");
        setTasaBcv(tasa.data.rate);
        const costo = await fetchDataSolicitudes(
          "costo",
          `?search=Inscripcion+${pendiente.tipo_profesion}&es_vigente=true`
        );
        setCostoInscripcion(Number(costo.data[0].monto_usd));
        const Mpagos = await fetchDataSolicitudes("metodo-de-pago");
        setMetodoPago(Mpagos.data);
      } catch (error) {
        setError(
          "Ocurrió un error al cargar los datos, verifique su conexión a internet"
        );
      }
    };
    if (!isLoading && pendiente) {
      LoadData();
    }
  }, [isLoading, pendiente]);

  // Función para obtener iniciales del nombre
  const obtenerIniciales = () => {
    if (!pendiente) return "CN";

    const { nombre, primer_apellido } = pendiente.persona;
    return `${nombre.charAt(0)}${primer_apellido.charAt(0)}`;
  };

  const handlePaymentComplete = async ({
    paymentDate = null,
    referenceNumber = null,
    paymentFile = null,
    totalAmount = null,
    metodo_de_pago = null,
  }) => {
    await updateColegiadoPendienteWithToken(pendienteId, {
      pago: {
        fecha_pago: paymentDate,
        num_referencia: referenceNumber,
        monto: totalAmount,
        metodo_de_pago: metodo_de_pago.id,
      },
    });
    const Form = new FormData()
    Form.append("comprobante", paymentFile);
    await updateColegiadoPendienteWithToken(pendienteId, Form, true)
    loadData()
    setPagosPendientes(false)
    handleForward()
  }

  // Funciones para gestión de documentos
  const handleVerDocumento = (documento) => {
    // Agregar el estado del documento al documento seleccionado
    const docStatus = documentosStatus[documento.id] || { status: 'pending', rejectionReason: '' };
    setDocumentoSeleccionado({
      ...documento,
      status: docStatus.status,
      rejectionReason: docStatus.rejectionReason,
      isReadOnly: documento.isReadOnly
    });
  };

  const handleCerrarVistaDocumento = () => {
    setDocumentoSeleccionado(null);
  };

  // Función para actualizar un documento
  const updateDocumento = (documentoActualizado) => {
    try {
      if (!recaudos) {
        updateColegiadoPendiente(pendienteId, documentoActualizado, true);
      } else {
        updateColegiadoPendienteWithToken(pendienteId, documentoActualizado, true)
      }
      loadData()
    } catch (error) {
      console.error("Error al actualizar documento:", error);
    }
  };

  const updateData = (id, newData) => {
    if (!recaudos) updateColegiadoPendiente(id, newData)
    else updateColegiadoPendienteWithToken(id, newData)
  }

  // Función para manejar aprobación
  const handleAprobarSolicitud = async () => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      // Verificar que todos los documentos requeridos estén aprobados
      if (!allDocumentsApproved()) {
        alert(
          "No se puede aprobar esta solicitud. Algunos documentos no han sido aprobados."
        );
        setIsSubmitting(false);
        return;
      }

      // Verificar que los pagos estén completos o exonerados
      if (pagosPendientes) {
        alert(
          "No se puede aprobar esta solicitud. Los pagos están pendientes y no han sido exonerados."
        );
        setIsSubmitting(false);
        return;
      }

      // Guardar cambios pendientes antes de aprobar
      if (cambiosPendientes) {
        const nuevosDatos = {
          ...pendiente,
          persona: datosPersonales,
          ...datosAcademicos,
          instituciones,
        };
        updateColegiadoPendiente(pendienteId, nuevosDatos);
      }

      // Guardar el estado de los documentos
      const documentosData = {};
      Object.entries(documentosStatus).forEach(([docId, data]) => {
        documentosData[`${docId}_status`] = data.status;
        if (data.rejectionReason) {
          documentosData[`${docId}_rejection_reason`] = data.rejectionReason;
        }
      });

      // Llamar a la función de aprobación del store con los datos de registro y estados de documentos
      const colegiadoAprobado = approveRegistration(pendienteId, {
        ...datosRegistro,
        ...documentosData
      });

      // Mostrar confirmación
      setConfirmacionExitosa(true);
      setMostrarConfirmacion(false);

      // Volver a la lista después de un tiempo con el colegiado aprobado
      setTimeout(() => {
        if (onVolver) {
          onVolver({
            aprobado: true,
            colegiado: colegiadoAprobado,
          });
        }
      }, 2000);
    } catch (error) {
      console.error("Error al aprobar solicitud:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para rechazar solicitud
  const handleRechazarSolicitud = async () => {
    try {
      if (!motivoRechazo.trim()) {
        alert("Debe ingresar un motivo de rechazo");
        return;
      }

      setIsSubmitting(true);

      // Obtener los documentos rechazados y sus motivos
      const documentosRechazados = Object.entries(documentosStatus)
        .filter(([_, data]) => data.status === 'rejected')
        .map(([docId, data]) => {
          const doc = documentosRequeridos.find(d => d.id === docId);
          return {
            id: docId,
            nombre: doc?.nombre || 'Documento',
            motivo: data.rejectionReason
          };
        });

      // Guardar estados de los documentos
      const documentosData = {};
      Object.entries(documentosStatus).forEach(([docId, data]) => {
        documentosData[`${docId}_status`] = data.status;
        if (data.rejectionReason) {
          documentosData[`${docId}_rejection_reason`] = data.rejectionReason;
        }
      });

      const nuevosDatos = {
        status: "rechazado",
        motivo_rechazo: motivoRechazo,
        documentos_rechazados: documentosRechazados,
        ...documentosData
      };

      await updateColegiadoPendiente(pendienteId, nuevosDatos);
      setRechazoExitoso(true);
      setMostrarRechazo(false);
      onVolver({ rechazado: true });
      loadData()

      // Volver a la lista después de un tiempo
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para denegar solicitud (rechazo definitivo)
  const handleDenegarSolicitud = async () => {
    try {
      if (!motivoRechazo.trim()) {
        alert("Debe ingresar un motivo de rechazo");
        return;
      }

      setIsSubmitting(true);

      // Obtener los documentos rechazados y sus motivos
      const documentosRechazados = Object.entries(documentosStatus)
        .filter(([_, data]) => data.status === 'rejected')
        .map(([docId, data]) => {
          const doc = documentosRequeridos.find(d => d.id === docId);
          return {
            id: docId,
            nombre: doc?.nombre || 'Documento',
            motivo: data.rejectionReason
          };
        });

      // Guardar estados de los documentos
      const documentosData = {};
      Object.entries(documentosStatus).forEach(([docId, data]) => {
        documentosData[`${docId}_status`] = data.status;
        if (data.rejectionReason) {
          documentosData[`${docId}_rejection_reason`] = data.rejectionReason;
        }
      });

      const nuevosDatos = {
        status: "denegado",
        motivo_rechazo: motivoRechazo,
        documentos_rechazados: documentosRechazados,
        ...documentosData
      };

      await updateColegiadoPendiente(pendienteId, nuevosDatos);
      setDenegacionExitosa(true);
      setMostrarRechazo(false);
      onVolver({ denegado: true });
      loadData()
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para exonerar pagos
  const handleExonerarPagos = async () => {
    try {
      if (!motivoExoneracion.trim()) {
        alert("Debe ingresar un motivo de exoneración");
        return;
      }

      setIsSubmitting(true);
      const nuevosDatos = {
        "pago_exonerado": true,
        "motivo_exonerado": motivoExoneracion
      };

      // Actualizar en el store
      await updateColegiadoPendiente(pendienteId, nuevosDatos);
      loadData()

      setExoneracionExitosa(true);
      setMostrarExoneracion(false);

      // Limpiar el motivo
      setMotivoExoneracion("");
    } catch (error) {
      console.error("Error al exonerar pagos:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para manejar retroceso
  const handleVolver = () => {
    // Preguntar si hay cambios sin guardar
    if (cambiosPendientes) {
      if (confirm("Hay cambios sin guardar. ¿Desea salir sin guardar?")) {
        onVolver({ aprobado: false });
      }
    } else {
      onVolver({ aprobado: false });
    }
  };

  // Función para manejar el reporte de ilegalidad
  const handleReportSubmit = (reportData) => {
    try {
      console.log("Reporte enviado:", reportData);

      // Aquí puedes enviar el reporte a tu backend
      // Por ejemplo: await sendIllegalityReport(reportData);

      // Cerrar modal y mostrar notificación
      setShowReportModal(false);
      alert("El reporte de ilegalidad ha sido enviado correctamente y será revisado por el comité de ética");
    } catch (error) {
      console.error("Error al enviar reporte de ilegalidad:", error);
      alert("Ocurrió un error al enviar el reporte. Por favor intente nuevamente.");
    }
  };

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
      </div>
    );
  }

  if (!pendiente) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-2">Error</p>
          <p className="text-gray-600">
            No se pudo cargar los datos del pendiente.
          </p>
        </div>
      </div>
    );
  }

  const nombreCompleto = `${pendiente.persona.nombre} ${pendiente.persona.segundo_nombre || ""
    } ${pendiente.persona.primer_apellido} ${pendiente.persona.segundo_apellido || ""
    }`.trim();
  const fechaSolicitud = pendiente.created_at
    ? (() => {
      const fecha = new Date(pendiente.created_at);
      const dia = String(fecha.getDate()).padStart(
        2,
        "0"
      );
      const mes = String(
        fecha.getMonth() + 1
      ).padStart(2, "0"); // Los meses empiezan en 0
      const año = fecha.getFullYear();
      const horas = String(
        fecha.getHours()
      ).padStart(2, "0");
      const minutos = String(
        fecha.getMinutes()
      ).padStart(2, "0");
      const segundos = String(
        fecha.getSeconds()
      ).padStart(2, "0");
      return `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
    })()
    : "-";

  // Determinar si la solicitud está rechazada o denegada
  const isRechazada = pendiente.status === "rechazado";
  const isDenegada = pendiente.status === "denegado";

  return (
    <div className={`cursor-default w-full px-4 md:px-10 py-10 md:py-28 ${isAdmin ? "bg-gray-50 " : ""}`}>
      {/* Breadcrumbs */}
      {isAdmin && (
        <div className="mb-6">
          <button
            onClick={handleVolver}
            className="text-md text-[#590248] hover:text-[#C40180] flex items-center cursor-pointer transition-colors duration-200"
          >
            <ChevronLeft size={20} className="mr-1" />
            Volver a la lista de colegiados
          </button>
        </div>
      )}

      {/* Alertas de estado */}
      <StatusAlerts
        confirmacionExitosa={confirmacionExitosa}
        rechazoExitoso={rechazoExitoso}
        denegacionExitosa={denegacionExitosa}
        exoneracionExitosa={exoneracionExitosa}
        cambiosPendientes={cambiosPendientes}
        documentosCompletos={documentosCompletos}
        isRechazada={isRechazada}
        isDenegada={isDenegada}
        pendiente={pendiente}
        setConfirmacionExitosa={setConfirmacionExitosa}
        setRechazoExitoso={setRechazoExitoso}
        setDenegacionExitosa={setDenegacionExitosa}
        setExoneracionExitosa={setExoneracionExitosa}
        setCambiosPendientes={setCambiosPendientes}
      />

      {/* Profile Card */}
      <ProfileCard
        props={{
          pendiente,
          obtenerIniciales,
          nombreCompleto,
          fechaSolicitud,
          documentosCompletos,
          pagosPendientes,
          setMostrarConfirmacion,
          setMostrarRechazo,
          setMostrarExoneracion,
          isRechazada,
          isDenegada,
          isAdmin,
          setShowReportModal, // Añadimos la función para mostrar el modal de reporte
          allDocumentsApproved: allDocumentsApproved() // Añadimos la verificación de documentos aprobados
        }}
      />

      {/* Main content sections */}
      <PersonalInfoSection
        props={{
          pendiente,
          datosPersonales,
          setDatosPersonales,
          editandoPersonal,
          setEditandoPersonal,
          updateData,
          pendienteId,
          setCambiosPendientes,
          isDenegada,
          isAdmin,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <AcademicInfoSection
          pendiente={pendiente}
          datosAcademicos={datosAcademicos}
          setDatosAcademicos={setDatosAcademicos}
          editandoAcademico={editandoAcademico}
          setEditandoAcademico={setEditandoAcademico}
          updateColegiadoPendiente={updateData}
          pendienteId={pendienteId}
          setCambiosPendientes={setCambiosPendientes}
          readonly={isDenegada}
        />

        <InstitutionsSection
          pendiente={pendiente}
          instituciones={instituciones}
          setInstituciones={setInstituciones}
          nuevaInstitucion={nuevaInstitucion}
          setNuevaInstitucion={setNuevaInstitucion}
          agregarInstitucion={agregarInstitucion}
          setAgregarInstitucion={setAgregarInstitucion}
          editandoInstituciones={editandoInstituciones}
          setEditandoInstituciones={setEditandoInstituciones}
          updateColegiadoPendiente={updateData}
          pendienteId={pendienteId}
          setCambiosPendientes={setCambiosPendientes}
          readonly={isDenegada}
        />
      </div>

      {/* Documentos y pagos */}
      <DocumentsSection
        documentosRequeridos={documentosRequeridos}
        handleVerDocumento={handleVerDocumento}
        updateDocumento={updateDocumento}
        onDocumentStatusChange={handleDocumentStatusChange} // Nueva prop para manejar los cambios de estado
      />

      {!isAdmin && pendiente.pago == null && pagosPendientes && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
        >
          <PagosColg
            props={{
              handlePaymentComplete,
              tasaBcv,
              costoInscripcion,
              metodoPago,
            }}
          />
        </motion.div>
      )}

      {/* Modals */}
      {mostrarConfirmacion && (
        <ApprovalModal
          nombreCompleto={nombreCompleto}
          datosRegistro={datosRegistro}
          setDatosRegistro={setDatosRegistro}
          pasoModal={pasoModal}
          setPasoModal={setPasoModal}
          handleAprobarSolicitud={handleAprobarSolicitud}
          documentosCompletos={allDocumentsApproved()} // Usar la nueva función de verificación
          onClose={() => setMostrarConfirmacion(false)}
        />
      )}

      {mostrarRechazo && (
        <RejectModal
          nombreCompleto={nombreCompleto}
          motivoRechazo={motivoRechazo}
          setMotivoRechazo={setMotivoRechazo}
          handleRechazarSolicitud={handleRechazarSolicitud}
          handleDenegarSolicitud={handleDenegarSolicitud}
          onClose={() => setMostrarRechazo(false)}
          isRechazada={isRechazada}
          documentosRechazados={Object.entries(documentosStatus)
            .filter(([_, data]) => data.status === 'rejected')
            .map(([docId, data]) => {
              const doc = documentosRequeridos.find(d => d.id === docId);
              return {
                id: docId,
                nombre: doc?.nombre || 'Documento',
                motivo: data.rejectionReason
              };
            })}
        />
      )}

      {mostrarExoneracion && (
        <ExonerationModal
          nombreCompleto={nombreCompleto}
          motivoExoneracion={motivoExoneracion}
          setMotivoExoneracion={setMotivoExoneracion}
          handleExonerarPagos={handleExonerarPagos}
          onClose={() => setMostrarExoneracion(false)}
        />
      )}

      {documentoSeleccionado && (
        <DocumentViewerModal
          documento={documentoSeleccionado}
          onClose={handleCerrarVistaDocumento}
          pendiente={pendiente}
        />
      )}

      {/* Modal de reporte de ilegalidades */}
      {showReportModal && (
        <ReportIllegalityModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportSubmit}
          colegiadoInfo={{
            nombre: nombreCompleto,
            id: pendienteId,
            cedula: pendiente.persona.identificacion
          }}
        />
      )}

      {!isAdmin && pendiente.pago != null && !pagosPendientes && (
        <div className="w-full flex items-center justify-center">
          <button
            onClick={handleForward}
            className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white p-4 rounded-md flex items-center text-sm font-medium hover:bg-purple-200 transition-colors "
          >
            <span>Reenviar Solicitud De Inscripcion</span>
          </button>

        </div>
      )}
    </div>
  );
}