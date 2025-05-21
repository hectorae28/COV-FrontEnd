"use client";

import { fetchDataSolicitudes } from "@/api/endpoints/landingPage";
import useDataListaColegiados from "@/store/ListaColegiadosData";
import { motion } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";
import { useEffect, useState } from "react";

import PagosColg from "@/app/Components/PagosModal";

// Componentes compartidos
import AcademicInfoSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/AcademicInfoSection";
import ContactInfoSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/ContactInfoSection";
import InstitutionsSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/InstitutionsSection";
import PersonalInfoSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/PersonalInfoSection";

import { DocumentSection, DocumentViewer } from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/DocumentModule";
import {
  ApprovalModal,
  ExonerationModal,
  RejectModal,
  ReportIllegalityModal
} from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/ModalSystem";
import StatusAlerts from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/NotificationSystem";
import ProfileCard from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/UserProfileCard";

// Importar componente de formulario de registro para documentos
import DocsRequirements from "@/app/(Registro)/DocsRequirements";

export default function DetallePendiente({ params, onVolver, isAdmin = false, recaudos = null, handleForward = null }) {
  const [metodoPago, setMetodoPago] = useState([]);
  const [tasaBcv, setTasaBcv] = useState(0);
  const [costoInscripcion, setCostoInscripcion] = useState(0);
  const pendienteId = params?.id || "p1";

  // Obtenemos funciones del store centralizado
  const {
    getColegiadoPendiente,
    updateColegiadoPendiente,
    approveRegistration,
    updateColegiadoPendienteWithToken
  } = useDataListaColegiados();

  // Estados locales
  const [isLoading, setIsLoading] = useState(true);
  const [pendiente, setPendiente] = useState(null);
  const [cambiosPendientes, setCambiosPendientes] = useState(false);

  // Estados para datos
  const [datosPersonales, setDatosPersonales] = useState(null);
  const [datosContacto, setDatosContacto] = useState({
    email: "",
    phoneNumber: "",
    countryCode: "+58",
    homePhone: "",
    address: "",
    city: "",
    state: ""
  });
  const [datosAcademicos, setDatosAcademicos] = useState(null);
  const [instituciones, setInstituciones] = useState([]);
  const [nuevaInstitucion, setNuevaInstitucion] = useState({
    nombre: "",
    cargo: "",
    telefono: "",
    direccion: "",
    tipo_institucion: ""
  });
  const [agregarInstitucion, setAgregarInstitucion] = useState(false);

  // Estados para modales
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarRechazo, setMostrarRechazo] = useState(false);
  const [mostrarExoneracion, setMostrarExoneracion] = useState(false);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Estados para documentos y pagos
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

  // Estados para datos de registro
  const [datosRegistro, setDatosRegistro] = useState({
    libro: "",
    pagina: "",
    num_cov: "",
  });
  const [pasoModal, setPasoModal] = useState(1);

  const [documentoParaEditar, setDocumentoParaEditar] = useState(null);

  // Estado para manejar la edición de documentos usando el formulario de registro
  const [editandoDocumentos, setEditandoDocumentos] = useState(false);
  const [docsFormData, setDocsFormData] = useState({});
  const [docsValidationErrors, setDocsValidationErrors] = useState({});

  const documentosMetadata = {
    fondo_negro_credencial: {
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

    return documentosRequeridos
      .filter(doc => doc.requerido)
      .every(doc => {
        if (!doc.url) return false;
        const status = documentosStatus[doc.id]?.status || doc.status;
        return status === 'approved';
      });
  };

  // Función para manejar el estado de documentos
  const handleDocumentStatusChange = (updatedDocument) => {
    const docsCopy = [...documentosRequeridos];
    const index = docsCopy.findIndex(doc => doc.id === updatedDocument.id);
    if (index !== -1) {
      docsCopy[index] = {
        ...docsCopy[index],
        status: updatedDocument.status,
        rejectionReason: updatedDocument.rejectionReason || ''
      };
      setDocumentosRequeridos(docsCopy);
    }

    const updateData = {
      [`${updatedDocument.id}_validate`]: updatedDocument.status === 'pending' ? null : updatedDocument.status === 'approved' ? true : false,
    };
    if (updatedDocument.rejectionReason) {
      updateData[`${updatedDocument.id}_motivo_rechazo`] = updatedDocument.rejectionReason;
    }

    updateColegiadoPendiente(pendienteId, updateData);
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
  }

  const loadData = async () => {
    try {
      setIsLoading(true);
      let pendienteData;
      if (!recaudos) {
        pendienteData = await getColegiadoPendiente(pendienteId);
      } else {
        pendienteData = recaudos;
      }

      if (pendienteData) {
        // Datos personales - asegurar que sea un objeto nuevo
        setDatosPersonales(JSON.parse(JSON.stringify(pendienteData.persona || {})));

        // Datos de contacto
        setDatosContacto({
          email: pendienteData.persona?.correo || "",
          phoneNumber: pendienteData.persona?.telefono_movil?.split(" ")[1] || "",
          countryCode: pendienteData.persona?.telefono_movil?.split(" ")[0] || "+58",
          homePhone: pendienteData.persona?.telefono_de_habitacion || "",
          address: pendienteData.persona?.direccion?.referencia || "",
          city: pendienteData.persona?.direccion?.ciudad || "",
          state: pendienteData.persona?.direccion?.estado || ""
        });

        // Datos académicos
        setDatosAcademicos({
          instituto_bachillerato: pendienteData.instituto_bachillerato || "",
          universidad: pendienteData.universidad || "",
          fecha_egreso_universidad: pendienteData.fecha_egreso_universidad || "",
          num_registro_principal: pendienteData.num_registro_principal || "",
          fecha_registro_principal: pendienteData.fecha_registro_principal || "",
          num_mpps: pendienteData.num_mpps || "",
          fecha_mpps: pendienteData.fecha_mpps || "",
          observaciones: pendienteData.observaciones || "",
        });

        // Instituciones - crear copia para evitar referencias
        setInstituciones(pendienteData.instituciones ? JSON.parse(JSON.stringify(pendienteData.instituciones)) : []);

        // Documentos
        const documentosFormateados = [
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
          {
            id: "fondo_negro_credencial",
            nombre: documentosMetadata.fondo_negro_credencial.nombre,
            descripcion: documentosMetadata.fondo_negro_credencial.descripcion,
            archivo: obtenerNombreArchivo(pendienteData.fondo_negro_credencial_url),
            requerido: documentosMetadata.fondo_negro_credencial.requerido(pendienteData.tipo_profesion),
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
            requerido: documentosMetadata.notas_curso.requerido(pendienteData.tipo_profesion),
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
            requerido: documentosMetadata.fondo_negro_titulo_bachiller.requerido(pendienteData.tipo_profesion),
            url: pendienteData.fondo_negro_titulo_bachiller_url,
            status: pendienteData.fondo_negro_titulo_bachiller_validate === null ? 'pending' : pendienteData.fondo_negro_titulo_bachiller_validate ? 'approved' : 'rechazado',
            isReadOnly: pendienteData.fondo_negro_titulo_bachiller_status === 'approved' && pendienteData.status === 'rechazado',
            rejectionReason: pendienteData.fondo_negro_titulo_bachiller_motivo_rechazo || ''
          },
        ];

        setPendiente(pendienteData);
        setDocumentosCompletos(!pendienteData.archivos_faltantes?.tiene_faltantes);
        setDocumentosRequeridos(documentosFormateados);

        // Estado de documentos
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
        setError("Ocurrió un error al cargar los datos, verifique su conexión a internet");
      }
    };
    if (!isLoading && pendiente) {
      LoadData();
    }
  }, [isLoading, pendiente]);

  const updateData = (id, newData) => {
    // Crear copia profunda para evitar modificaciones accidentales
    const dataToUpdate = JSON.parse(JSON.stringify(newData));

    // Actualizar los estados locales según el tipo de datos
    if (dataToUpdate.persona) {
      setDatosPersonales(prev => ({
        ...prev,
        ...dataToUpdate.persona
      }));
    }

    // Si se están actualizando datos de contacto
    if (dataToUpdate.persona?.correo || dataToUpdate.persona?.telefono_movil || dataToUpdate.persona?.direccion) {
      const updatedContacto = { ...datosContacto };
      if (dataToUpdate.persona.correo) updatedContacto.email = dataToUpdate.persona.correo;
      if (dataToUpdate.persona.telefono_movil) {
        const parts = dataToUpdate.persona.telefono_movil.split(' ');
        if (parts.length === 2) {
          updatedContacto.countryCode = parts[0];
          updatedContacto.phoneNumber = parts[1];
        }
      }
      if (dataToUpdate.persona.telefono_de_habitacion) updatedContacto.homePhone = dataToUpdate.persona.telefono_de_habitacion;
      if (dataToUpdate.persona.direccion) {
        if (dataToUpdate.persona.direccion.referencia) updatedContacto.address = dataToUpdate.persona.direccion.referencia;
        if (dataToUpdate.persona.direccion.estado) updatedContacto.state = dataToUpdate.persona.direccion.estado;
        if (dataToUpdate.persona.direccion.ciudad) updatedContacto.city = dataToUpdate.persona.direccion.ciudad;
      }
      setDatosContacto(updatedContacto);
    }

    // Si son datos académicos
    if (dataToUpdate.instituto_bachillerato || dataToUpdate.universidad || dataToUpdate.num_registro_principal ||
      dataToUpdate.fecha_registro_principal || dataToUpdate.num_mpps || dataToUpdate.fecha_mpps ||
      dataToUpdate.fecha_egreso_universidad || dataToUpdate.observaciones) {
      setDatosAcademicos(prev => ({
        ...prev,
        ...dataToUpdate
      }));
    }

    // Si son instituciones
    if (dataToUpdate.instituciones) {
      setInstituciones(dataToUpdate.instituciones);
    }

    // Marcar que hay cambios pendientes
    setCambiosPendientes(true);
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
    const Form = new FormData();
    Form.append("comprobante", paymentFile);
    await updateColegiadoPendienteWithToken(pendienteId, Form, true);
    loadData();
    setPagosPendientes(false);
    handleForward();
  };

  // Funciones para gestión de documentos
  const handleVerDocumento = (documento) => {
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

  // Nuevo manejador para editar documento
  const handleEditarDocumento = (documento) => {
    setDocumentoParaEditar(documento);
  };

  // Función para editar documentos
  const handleEditarDocumentos = () => {
    // Preparar la data para el formulario de documentos
    const formDataDocs = {
      tipo_profesion: pendiente?.tipo_profesion || 'odontologo',
      ci: null,
      rif: null,
      titulo: null,
      mpps: null,
      fondo_negro_titulo_bachiller: null,
      fondo_negro_credencial: null,
      notas_curso: null
    };

    // Actualizamos el estado
    setDocsFormData(formDataDocs);
    setEditandoDocumentos(true);
  };

  // Función para manejar cambios en el formulario de documentos
  const handleDocsInputChange = (changes) => {
    setDocsFormData(prev => ({
      ...prev,
      ...changes
    }));
    setCambiosPendientes(true);
  };

  // Función para guardar cambios en documentos
  const handleSaveDocsChanges = (e) => {
    // Prevenir el comportamiento por defecto que podría recargar la página
    if (e) e.preventDefault();
    
    // Validar archivos requeridos
    const requiredDocs = ['ci', 'rif', 'titulo', 'mpps'];
    
    // Añadir documentos específicos para técnicos e higienistas
    if (pendiente.tipo_profesion === "tecnico" || pendiente.tipo_profesion === "higienista") {
      requiredDocs.push('fondo_negro_titulo_bachiller', 'fondo_negro_credencial', 'notas_curso');
    }

    // Crear objeto para la validación
    const validationErrors = {};
    let isValid = true;

    // Validar campos requeridos solo si no tienen documentos previos
    requiredDocs.forEach(field => {
      const fieldUrlKey = `${field}_url`;
      // Solo validar si no hay un archivo previo ya cargado
      if (!pendiente[fieldUrlKey] && !docsFormData[field]) {
        validationErrors[field] = true;
        isValid = false;
      }
    });

    if (!isValid) {
      setDocsValidationErrors(validationErrors);
      return;
    }

    // Aquí solo guardamos localmente, no enviamos al servidor todavía
    setCambiosPendientes(true);
    
    // Cerrar el modal
    setEditandoDocumentos(false);
  };

  // Función para manejar aprobación
  const handleAprobarSolicitud = async () => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      if (!allDocumentsApproved()) {
        alert("No se puede aprobar esta solicitud. Algunos documentos no han sido aprobados.");
        setIsSubmitting(false);
        return;
      }

      if (pagosPendientes) {
        alert("No se puede aprobar esta solicitud. Los pagos están pendientes y no han sido exonerados.");
        setIsSubmitting(false);
        return;
      }

      // Guardar cambios pendientes antes de aprobar
      if (cambiosPendientes) {
        // Crear un objeto completo con todos los datos actualizados
        const nuevosDatos = {
          persona: JSON.parse(JSON.stringify(datosPersonales)),
          ...JSON.parse(JSON.stringify(datosAcademicos)),
          instituciones: JSON.parse(JSON.stringify(instituciones)),
        };
        updateColegiadoPendiente(pendienteId, nuevosDatos);
        setCambiosPendientes(false);
      }

      // Guardar el estado de los documentos
      const documentosData = {};
      Object.entries(documentosStatus).forEach(([docId, data]) => {
        documentosData[`${docId}_status`] = data.status;
        if (data.rejectionReason) {
          documentosData[`${docId}_rejection_reason`] = data.rejectionReason;
        }
      });

      const colegiadoAprobado = await approveRegistration(pendienteId, {
        ...datosRegistro,
        ...documentosData
      });

      setConfirmacionExitosa(true);
      setMostrarConfirmacion(false);

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
      loadData();
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
      loadData();
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

      await updateColegiadoPendiente(pendienteId, nuevosDatos);
      loadData();

      setExoneracionExitosa(true);
      setMostrarExoneracion(false);
      setMotivoExoneracion("");
    } catch (error) {
      console.error("Error al exonerar pagos:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para manejar retroceso
  const handleVolver = () => {
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
      const dia = String(fecha.getDate()).padStart(2, "0");
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const año = fecha.getFullYear();
      const horas = String(fecha.getHours()).padStart(2, "0");
      const minutos = String(fecha.getMinutes()).padStart(2, "0");
      const segundos = String(fecha.getSeconds()).padStart(2, "0");
      return `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
    })()
    : "-";

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
        notifications={{
          confirmacionExitosa,
          rechazoExitoso,
          denegacionExitosa,
          exoneracionExitosa,
          cambiosPendientes,
          documentosCompletos
        }}
        handlers={{
          setConfirmacionExitosa,
          setRechazoExitoso,
          setDenegacionExitosa,
          setExoneracionExitosa,
          setCambiosPendientes
        }}
        pendiente={pendiente}
      />

      {/* Profile Card */}
      <ProfileCard
        data={pendiente}
        variant="pending"
        onMostrarConfirmacion={() => setMostrarConfirmacion(true)}
        onMostrarRechazo={() => setMostrarRechazo(true)}
        onMostrarExoneracion={() => setMostrarExoneracion(true)}
        onMostrarReporteIrregularidad={() => setShowReportModal(true)}
        isAdmin={isAdmin}
        allDocumentsApproved={allDocumentsApproved}
      />

      {/* Organización según los pasos originales */}
      <PersonalInfoSection
        props={{
          pendiente,
          datosPersonales,
          setDatosPersonales,
          updateData,
          pendienteId,
          setCambiosPendientes,
          isAdmin,
          readOnly: isDenegada
        }}
      />

      <ContactInfoSection
        pendiente={pendiente}
        datosContacto={datosContacto}
        setDatosContacto={setDatosContacto}
        updateData={updateData}
        pendienteId={pendienteId}
        setCambiosPendientes={setCambiosPendientes}
        isAdmin={isAdmin}
        readOnly={isDenegada}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <AcademicInfoSection
          pendiente={pendiente}
          datosAcademicos={datosAcademicos}
          setDatosAcademicos={setDatosAcademicos}
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
          updateColegiadoPendiente={updateData}
          pendienteId={pendienteId}
          setCambiosPendientes={setCambiosPendientes}
          readonly={isDenegada}
        />
      </div>

      {/* Documentos y pagos */}
      <DocumentSection
        documentos={documentosRequeridos}
        onViewDocument={handleVerDocumento}
        updateDocumento={updateDocumento}
        onDocumentStatusChange={handleDocumentStatusChange}
        title="Documentos requeridos"
        subtitle="Documentación obligatoria del solicitante"
        recaudosId={pendienteId}
        onEditSection={handleEditarDocumentos}
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
          documentosCompletos={allDocumentsApproved()}
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
        <DocumentViewer
          documento={documentoSeleccionado}
          onClose={handleCerrarVistaDocumento}
        />
      )}

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