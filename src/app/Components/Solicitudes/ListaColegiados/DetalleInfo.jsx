"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, ChevronLeft, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Componentes compartidos
import AcademicInfoSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/AcademicInfoSection";
import ContactInfoSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/ContactInfoSection";
import {
  DocumentSection,
  DocumentViewer,
} from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/DocumentModule";
import InstitutionsSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/InstitutionsSection";
import PaymentReceiptSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/PaymentReceiptSection";
import PersonalInfoSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/PersonalInfoSection";
import UserProfileCard from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/UserProfileCard";

// Componentes específicos para colegiados
import CarnetInfo from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/CarnetInfo";
import ChatSection from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/ChatSection";
import EstadisticasUsuario from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/EstadisticasUsuario";
import TablaInscripciones from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/TablaInscripciones";
import TablaPagos from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/TablaPagos";
import TablaSolicitudes from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/TablaSolicitudes";

// Modal para crear solicitudes
import CrearSolicitudModal from "@/Components/Solicitudes/Solicitudes/CrearSolicitudModal";

// Modales para pendientes
import {
  ApprovalModal,
  ExonerationModal,
  RejectModal,
  ReportIllegalityModal,
  TitleConfirmationModal,
} from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/ModalSystem";

// Otros imports necesarios
import { fetchDataSolicitudes } from "@/api/endpoints/landingPage";
import PagosColg from "@/app/Components/PagosModal";
import useDataListaColegiados from "@/store/ListaColegiadosData";

export default function DetalleInfo({
  params,
  onVolver,
  tipo = "pendiente", // "pendiente" | "colegiado"
  data = null,
  isAdmin = false,
  recaudos = null,
  isColegiado=false,
  handleForward=null,

}) {
  const entityId = params?.id || "1";

  // Estado unificado
  const [isLoading, setIsLoading] = useState(true);
  const [entityData, setEntityData] = useState(null);
  const [cambiosPendientes, setCambiosPendientes] = useState(false);
  const [tabActivo, setTabActivo] = useState("informacion");

  // Estados para datos unificados
  const [datosPersonales, setDatosPersonales] = useState(null);
  const [datosContacto, setDatosContacto] = useState({
    email: "",
    phoneNumber: "",
    countryCode: "+58",
    homePhone: "",
    address: "",
    city: "",
    state: "",
  });
  const [datosAcademicos, setDatosAcademicos] = useState(null);
  const [instituciones, setInstituciones] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
  const [comprobanteData, setComprobanteData] = useState(null);

  // Estados específicos para pendientes
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarRechazo, setMostrarRechazo] = useState(false);
  const [mostrarExoneracion, setMostrarExoneracion] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCrearSolicitudModal, setShowCrearSolicitudModal] = useState(false);
  const [showTitleConfirmationModal, setShowTitleConfirmationModal] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [motivoExoneracion, setMotivoExoneracion] = useState("");
  const [datosRegistro, setDatosRegistro] = useState({
    libro: "",
    pagina: "",
    num_cov: "",
  });
  const [pasoModal, setPasoModal] = useState(1);

  // Estados para notificaciones
  const [confirmacionExitosa, setConfirmacionExitosa] = useState(false);
  const [rechazoExitoso, setRechazoExitoso] = useState(false);
  const [denegacionExitosa, setDenegacionExitosa] = useState(false);
  const [exoneracionExitosa, setExoneracionExitosa] = useState(false);

  // Estados para pagos (solo pendientes)
  const [metodoPago, setMetodoPago] = useState([]);
  const [tasaBcv, setTasaBcv] = useState(0);
  const [costoInscripcion, setCostoInscripcion] = useState(0);
  const [pagosPendientes, setPagosPendientes] = useState(false);
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);

  // Estado para forzar actualizaciones
  const [documentUpdateTrigger, setDocumentUpdateTrigger] = useState(0);

  // Funciones del store
  const {
    getColegiado,
    getColegiadoPendiente,
    updateColegiado,
    updateColegiadoPendiente,
    updateColegiadoPendienteWithToken,
    getDocumentos,
    approveRegistration,
  } = useDataListaColegiados();

  // 🔧 FUNCIÓN CRÍTICA: Validación de documentos aprobados
  const allDocumentsApproved = useCallback(() => {
    const currentData = entityData;

    if (!currentData) {
      return false;
    }

    const tipoProfesion = currentData.tipo_profesion || "odontologo";

    // Documentos requeridos según tipo
    const documentosRequeridosBase = [
      "file_ci",
      "file_rif",
      "file_fondo_negro",
      "file_mpps",
    ];

    const documentosAdicionales = [
      "fondo_negro_credencial",
      "notas_curso",
      "fondo_negro_titulo_bachiller",
    ];

    let documentosRequeridos;
    if (tipoProfesion === "odontologo") {
      documentosRequeridos = documentosRequeridosBase;
    } else {
      documentosRequeridos = [
        ...documentosRequeridosBase,
        ...documentosAdicionales,
      ];
    }

    // Verificar cada documento individualmente
    let documentosAprobados = 0;

    documentosRequeridos.forEach((docId) => {
      const validateField = `${docId}_validate`;
      const urlField = `${docId}_url`;

      const hasFile = !!currentData[urlField];
      const isApproved = currentData[validateField] === true;

      if (hasFile && isApproved) {
        documentosAprobados++;
      }
    });

    const docsApproved = documentosAprobados === documentosRequeridos.length;

    // Verificar comprobante de pago si no está exonerado
    if (!currentData.pago_exonerado) {
      const comprobanteHasFile = !!comprobanteData?.url;
      const comprobanteApproved = comprobanteData?.status === "approved";

      return docsApproved && comprobanteHasFile && comprobanteApproved;
    }

    return docsApproved;
  }, [entityData, comprobanteData]);

  // 🔧 FUNCIÓN CRÍTICA: Validación de documentos subidos
  const allDocumentsUploaded = useCallback(() => {
    const currentData = entityData;

    if (!currentData) {
      return false;
    }

    const tipoProfesion = currentData.tipo_profesion || "odontologo";

    // Documentos requeridos según tipo
    const documentosRequeridosBase = [
      "file_ci",
      "file_rif",
      "file_fondo_negro",
      "file_mpps",
    ];

    const documentosAdicionales = [
      "fondo_negro_credencial",
      "notas_curso",
      "fondo_negro_titulo_bachiller",
    ];

    let documentosRequeridos;
    if (tipoProfesion === "odontologo") {
      documentosRequeridos = documentosRequeridosBase;
    } else {
      documentosRequeridos = [
        ...documentosRequeridosBase,
        ...documentosAdicionales,
      ];
    }

    // Verificar cada documento - SOLO si tiene archivo subido
    let documentosSubidos = 0;

    documentosRequeridos.forEach((docId) => {
      const urlField = `${docId}_url`;
      const hasFile = !!currentData[urlField];

      if (hasFile) {
        documentosSubidos++;
      }
    });

    const docsUploaded = documentosSubidos === documentosRequeridos.length;

    // Verificar comprobante de pago si no está exonerado
    if (!currentData.pago_exonerado) {
      const comprobanteHasFile = !!comprobanteData?.url;
      return docsUploaded && comprobanteHasFile;
    }

    return docsUploaded;
  }, [entityData, comprobanteData]);

  // Función unificada para actualizar datos
  const updateData = async (id, datosActualizados) => {
    try {
      const dataToSend = JSON.parse(JSON.stringify(datosActualizados));

      // Actualizar estados locales según el tipo de datos
      if (dataToSend.persona) {
        setDatosPersonales((prev) => ({ ...prev, ...dataToSend.persona }));
      }

      if (dataToSend.contacto || dataToSend.email || dataToSend.phoneNumber || dataToSend.address) {
        const contactData = dataToSend.contacto || dataToSend;
        setDatosContacto((prev) => ({ ...prev, ...contactData }));
      }

      if (dataToSend.academicos || dataToSend.instituto_bachillerato || dataToSend.universidad) {
        const acadData = dataToSend.academicos || dataToSend;
        setDatosAcademicos((prev) => ({ ...prev, ...acadData }));
      }

      if (dataToSend.instituciones) {
        setInstituciones(dataToSend.instituciones);
      }

      // Marcar cambios pendientes
      setCambiosPendientes(true);

      // Llamar a la función apropiada según el tipo
      if (tipo === "pendiente") {
        if (!recaudos) {
          await updateColegiadoPendiente(id, dataToSend);
        } else {
          await updateColegiadoPendienteWithToken(id, dataToSend);
        }
      } else {
        await updateColegiado(id, dataToSend);
      }

      setCambiosPendientes(false);
    } catch (error) {
      setCambiosPendientes(true);
    }
  };

  // Función para cargar datos del comprobante
  const loadComprobanteData = useCallback((pendienteData) => {
    const comprobanteUrl = pendienteData.comprobante_url ||
      pendienteData.comprobante ||
      pendienteData.pago?.comprobante_url ||
      pendienteData.pago?.comprobante;

    const tieneComprobante = comprobanteUrl ||
      pendienteData.comprobante_pago_url ||
      pendienteData.file_comprobante_url ||
      (pendienteData.pago && pendienteData.pago.comprobante);

    if (tieneComprobante) {
      const url = comprobanteUrl ||
        pendienteData.comprobante_pago_url ||
        pendienteData.file_comprobante_url ||
        pendienteData.pago?.comprobante;

      const comprobanteInfo = {
        id: "comprobante_pago",
        nombre: "Comprobante de pago",
        archivo: typeof url === "string" ? url.split("/").pop() : "comprobante_pago.pdf",
        url: url,
        status: pendienteData.comprobante_validate === null ? "pending" :
          pendienteData.comprobante_validate === true ? "approved" :
            pendienteData.comprobante_validate === false ? "rechazado" : "pending",
        rejectionReason: pendienteData.comprobante_motivo_rechazo || "",
      };

      setComprobanteData(comprobanteInfo);
    } else {
      setComprobanteData(null);
    }
  }, []);

  // Función para cargar datos
  const loadData = async () => {
    try {
      setIsLoading(true);
      let entityData;

      if (tipo === "pendiente") {
        if (data) {
          entityData = data;
        } else if (!recaudos) {
          entityData = await getColegiadoPendiente(entityId);
        } else {
          entityData = recaudos;
        }
      } else {
        if (data) {
          entityData = data;
        } else {
          entityData = await getColegiado(entityId);
        }
      }

      if (entityData) {
        setEntityData(entityData);

        // Inicializar estados según el tipo
        if (tipo === "pendiente") {
          initializePendienteData(entityData);
          loadComprobanteData(entityData);
        } else {
          initializeColegiadoData(entityData);
        }

        // Cargar documentos SOLO para colegiados registrados
        if (tipo === "colegiado") {
          try {
            const docs = await getDocumentos(entityId);
            setDocumentos(docs || []);
          } catch (docError) {
            setDocumentos([]);
          }
        } else {
          setDocumentos([]);
        }
      }
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar datos del comprobante
  // const loadComprobanteData = (pendienteData) => {
  //   console.log("Cargando datos del comprobante:", pendienteData); // Debug

  //   // Verificar diferentes posibles ubicaciones del comprobante
  //   const comprobanteUrl =
  //     pendienteData.comprobante_url ||
  //     pendienteData.comprobante ||
  //     pendienteData.pago?.comprobante_url ||
  //     pendienteData.pago?.comprobante;

  //   // También verificar si hay un archivo de comprobante en los campos de archivos
  //   const tieneComprobante =
  //     comprobanteUrl ||
  //     pendienteData.comprobante_pago_url ||
  //     pendienteData.file_comprobante_url ||
  //     (pendienteData.pago && pendienteData.pago.comprobante);

  //   if (tieneComprobante) {
  //     const url =
  //       comprobanteUrl ||
  //       pendienteData.comprobante_pago_url ||
  //       pendienteData.file_comprobante_url ||
  //       pendienteData.pago?.comprobante;

  //     const comprobanteInfo = {
  //       id: "comprobante_pago",
  //       nombre: "Comprobante de pago",
  //       archivo:
  //         typeof url === "string"
  //           ? url.split("/").pop()
  //           : "comprobante_pago.pdf",
  //       url: url,
  //       status:
  //         pendienteData.comprobante_validate === null
  //           ? "pending"
  //           : pendienteData.comprobante_validate === true
  //             ? "approved"
  //             : pendienteData.comprobante_validate === false
  //               ? "rechazado"
  //               : "pending",
  //       rejectionReason: pendienteData.comprobante_motivo_rechazo || "",
  //     };

  //     setComprobanteData(comprobanteInfo);

  //     console.log("Comprobante cargado:", {
  //       url: url,
  //       status: pendienteData.comprobante_validate,
  //     }); // Debug
  //   } else {
  //     console.log("No se encontró comprobante"); // Debug
  //     setComprobanteData(null);
  //   }
  // };

  // Función para cargar documentos de pendientes
  const loadPendienteDocuments = (pendienteData) => {
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

    return [
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
      }
    ].filter(doc => doc.url || doc.requerido); // Solo mostrar documentos que existen o son requeridos
  };
  // Inicializar datos para pendientes
  const initializePendienteData = (data) => {
    setDatosPersonales(JSON.parse(JSON.stringify(data.persona || {})));
    setDatosContacto({
      email: data.persona?.correo || "",
      phoneNumber: data.persona?.telefono_movil?.split(" ")[1] || "",
      countryCode: data.persona?.telefono_movil?.split(" ")[0] || "+58",
      homePhone: data.persona?.telefono_de_habitacion || "",
      address: data.persona?.direccion?.referencia || "",
      city: data.persona?.direccion?.municipio || "",
      city_name: data.persona?.direccion?.municipio_nombre || "",
      state: data.persona?.direccion?.estado || "",
      state_name: data.persona?.direccion?.estado_nombre || "",
    });

    setDatosAcademicos({
      instituto_bachillerato: data.instituto_bachillerato || "",
      universidad: data.universidad || "",
      fecha_egreso_universidad: data.fecha_egreso_universidad || "",
      num_registro_principal: data.num_registro_principal || "",
      fecha_registro_principal: data.fecha_registro_principal || "",
      num_mpps: data.num_mpps || "",
      fecha_mpps: data.fecha_mpps || "",
      observaciones: data.observaciones || "",
      estado_universidad: data.estado_universidad || "",
      municipio_universidad: data.municipio_universidad || "",
      nombre_universidad: data.universidad || "",
      fecha_emision_titulo: data.fecha_egreso_universidad || "",
    });

    setInstituciones(data.instituciones ? JSON.parse(JSON.stringify(data.instituciones)) : []);
    setPagosPendientes(data.pago === null && !data.pago_exonerado);
  };

  // Inicializar datos para colegiados
  const initializeColegiadoData = (data) => {
    setDatosPersonales(JSON.parse(JSON.stringify(data.recaudos?.persona || {})));

    const persona = data.recaudos?.persona || {};
    setDatosContacto({
      email: persona.correo || "",
      phoneNumber: persona.telefono_movil?.split(" ")[1] || "",
      countryCode: persona.telefono_movil?.split(" ")[0] || "+58",
      homePhone: persona.telefono_de_habitacion || "",
      address: persona.direccion?.referencia || "",
      city: data.persona?.direccion?.municipio || "",
      city_name: data.persona?.direccion?.municipio_nombre || "",
      state: data.persona?.direccion?.estado || "",
      state_name: data.persona?.direccion?.estado_nombre || "",
    });

    setDatosAcademicos({
      universidad: data.universidad || data.recaudos?.universidad || "",
      fecha_egreso_universidad: data.fecha_egreso_universidad || "",
      num_registro_principal: data.num_registro_principal || "",
      fecha_registro_principal: data.fecha_registro_principal || "",
      num_mpps: data.num_mpps || "",
      fecha_mpps: data.fecha_mpps || "",
      observaciones: data.observaciones || "",
      instituto_bachillerato: data.instituto_bachillerato || "",
      estado_universidad: data.estado_universidad || "",
      municipio_universidad: data.municipio_universidad || "",
      nombre_universidad: data.universidad || data.recaudos?.universidad || "",
      fecha_emision_titulo: data.fecha_egreso_universidad || "",
    });

    setInstituciones(JSON.parse(JSON.stringify(data.instituciones || [])));
  };

  // Cargar datos de pago para pendientes
  useEffect(() => {
    if (tipo === "pendiente" && entityData && entityData.tipo_profesion) {
      const loadPaymentData = async () => {
        try {
          const [tasa, costo, Mpagos] = await Promise.all([
            fetchDataSolicitudes("tasa-bcv"),
            fetchDataSolicitudes("costo", `?search=Inscripcion+${entityData.tipo_profesion?.titulo}&es_vigente=true`),
            fetchDataSolicitudes("metodo-de-pago")
          ]);

          setTasaBcv(tasa.data.rate);
          setMetodoPago(Mpagos.data);

          if (costo.data && costo.data.length > 0) {
            setCostoInscripcion(Number(costo.data[0].monto_usd));
          } else {
            setCostoInscripcion(0);
          }
        } catch (error) {
          // Error handling
        }
      };

      loadPaymentData();
    }
  }, [tipo, entityData]);

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, [entityId, tipo]);

  // Función para ver documentos
  const handleVerDocumento = (documento) => {
    setDocumentoSeleccionado(documento);
  };

  const handleCerrarVistaDocumento = () => {
    setDocumentoSeleccionado(null);
  };

  // Función optimizada para actualizar documentos SIN recargar
  const updateDocumento = async (documentoActualizado) => {
    try {
      let response;
      if (!recaudos) {
        response = await updateColegiadoPendiente(entityId, documentoActualizado, true);
      } else {
        response = await updateColegiadoPendienteWithToken(entityId, documentoActualizado, true);
      }

      // Si el backend devuelve el pending completo, actualizar sin recargar
      if (response && response.data) {
        setEntityData(prevData => ({ ...prevData, ...response.data }));
        setDocumentUpdateTrigger(prev => prev + 1);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  // Manejador optimizado para cambios en documentos
  const handleDocumentStatusChange = useCallback(async (documentoActualizado) => {
    try {
      // 1. ACTUALIZA LOCALMENTE el estado del documento de forma optimista
      setEntityData(prevData => ({
        ...prevData,
        [`${documentoActualizado.id}_validate`]: documentoActualizado.status === "approved",
        [`${documentoActualizado.id}_motivo_rechazo`]: documentoActualizado.rejectionReason || ''
      }));

      // 2. Si es comprobante de pago, también actualiza el local del comprobante
      if (documentoActualizado.id === "comprobante_pago") {
        setComprobanteData(prev => ({
          ...prev,
          status: documentoActualizado.status,
          rejectionReason: documentoActualizado.rejectionReason || ''
        }));
      }

      // 3. Llama al backend para guardar el cambio
      const updateData = {
        [`${documentoActualizado.id}_validate`]: documentoActualizado.status === "approved"
      };
      if (documentoActualizado.status === "rechazado" && documentoActualizado.rejectionReason) {
        updateData[`${documentoActualizado.id}_motivo_rechazo`] = documentoActualizado.rejectionReason;
      }

      await updateColegiadoPendiente(entityId, updateData);
    } catch (error) {
      console.error("Error updating document status:", error);
    }
  }, [entityId, updateColegiadoPendiente, setComprobanteData]);


  // Función para manejar el upload del comprobante
  const handleUploadComprobante = async (formData) => {
    try {
      let response;
      if (!recaudos) {
        response = await updateColegiadoPendiente(entityId, formData, true);
      } else {
        response = await updateColegiadoPendienteWithToken(entityId, formData, true);
      }

      if (response && response.data) {
        setEntityData(prevData => ({ ...prevData, ...response.data }));
        setDocumentUpdateTrigger(prev => prev + 1);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  // Función para manejar el estado del comprobante
  const handleComprobanteStatusChange = (updatedComprobante) => {
    setComprobanteData((prev) => ({
      ...prev,
      status: updatedComprobante.status,
      rejectionReason: updatedComprobante.rejectionReason || "",
    }));

    const updateData = {
      comprobante_validate: updatedComprobante.status === "pending" ? null :
        updatedComprobante.status === "approved" ? true : false,
    };

    if (updatedComprobante.rejectionReason) {
      updateData.comprobante_motivo_rechazo = updatedComprobante.rejectionReason;
    }

    updateColegiadoPendiente(entityId, updateData)
      .then((response) => {
        if (response && response.data) {
          setEntityData((prevData) => ({
            ...prevData,
            ...response.data,
          }));
        }
      })
      .catch((error) => {
        // Error handling
      });
  };

  // Funciones para modales de pendientes
  const handleAprobarSolicitud = async () => {
    try {
      if (cambiosPendientes) {
        const nuevosDatos = {
          persona: JSON.parse(JSON.stringify(datosPersonales)),
          ...JSON.parse(JSON.stringify(datosAcademicos)),
          instituciones: JSON.parse(JSON.stringify(instituciones)),
        };
        updateColegiadoPendiente(entityId, nuevosDatos);
        setCambiosPendientes(false);
      }

      const documentosData = {};
      const colegiadoAprobado = await approveRegistration(entityId, {
        ...datosRegistro,
        ...documentosData,
      });

      setConfirmacionExitosa(true);
      setMostrarConfirmacion(false);

      setTimeout(() => {
        if (onVolver) {
          onVolver({ aprobado: true, colegiado: colegiadoAprobado });
        }
      }, 2000);
    } catch (error) {
      // Error handling
    }
  };

  const handleRechazarSolicitud = async () => {
    try {
      if (!motivoRechazo.trim()) {
        alert("Debe ingresar un motivo de rechazo");
        return;
      }

      const nuevosDatos = {
        status: "rechazado",
        motivo_rechazo: motivoRechazo,
      };

      await updateColegiadoPendiente(entityId, nuevosDatos);
      setRechazoExitoso(true);
      setMostrarRechazo(false);
      onVolver({ rechazado: true });
      loadData();
    } catch (error) {
      // Error handling
    }
  };

  const handleDenegarSolicitud = async () => {
    try {
      if (!motivoRechazo.trim()) {
        alert("Debe ingresar un motivo de rechazo");
        return;
      }

      const nuevosDatos = {
        status: "anulado",
        motivo_rechazo: motivoRechazo,
      };

      await updateColegiadoPendiente(entityId, nuevosDatos);
      setDenegacionExitosa(true);
      setMostrarRechazo(false);
      onVolver({ denegado: true });
      loadData();
    } catch (error) {
      // Error handling
    }
  };

  const handleExonerarPagos = async () => {
    try {
      if (!motivoExoneracion.trim()) {
        alert("Debe ingresar un motivo de exoneración");
        return;
      }

      const nuevosDatos = {
        pago_exonerado: true,
        motivo_exonerado: motivoExoneracion,
      };

      await updateColegiadoPendiente(entityId, nuevosDatos);
      loadData();

      setExoneracionExitosa(true);
      setMostrarExoneracion(false);
      setMotivoExoneracion("");
    } catch (error) {
      // Error handling
    }
  };

  const handlePaymentComplete = async ({
    paymentDate = null,
    referenceNumber = null,
    paymentFile = null,
    totalAmount = null,
    metodo_de_pago = null,
  }) => {
    await updateColegiadoPendienteWithToken(entityId, {
      pago: {
        fecha_pago: paymentDate,
        num_referencia: referenceNumber,
        monto: totalAmount,
        metodo_de_pago: metodo_de_pago.id,
      },
    });
    const Form = new FormData();
    Form.append("comprobante", paymentFile);
    await updateColegiadoPendienteWithToken(entityId, Form, true);
    loadData();
    setPagosPendientes(false);
  };

  // Manejadores para colegiados registrados
  const handleNuevaSolicitud = () => {
    setShowCrearSolicitudModal(true);
  };

  const handleReportarIrregularidad = () => {
    setShowReportModal(true);
  };

  const handleConfirmarTitulo = () => {
    setShowTitleConfirmationModal(true);
  };

  const handleConfirmTitleDelivery = async () => {
    try {
      // Implementar lógica para confirmar entrega de título
      setShowTitleConfirmationModal(false);
    } catch (error) {
      // Error handling
    }
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
      </div>
    );
  }

  if (!entityData) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          No se pudo encontrar la información solicitada.
        </div>
        {onVolver && (
          <button
            onClick={() => onVolver()}
            className="cursor-pointer mt-4 inline-flex items-center text-[#C40180] hover:underline"
          >
            <ChevronLeft size={20} className="mr-1" />
            Volver
          </button>
        )}
      </div>
    );
  }

  const nombreCompleto = `${entityData.persona?.nombre || entityData.recaudos?.persona?.nombre || ""
    } ${entityData.persona?.segundo_nombre || entityData.recaudos?.persona?.segundo_nombre || ""
    } ${entityData.persona?.primer_apellido || entityData.recaudos?.persona?.primer_apellido || ""
    } ${entityData.persona?.segundo_apellido || entityData.recaudos?.persona?.segundo_apellido || ""
    }`.trim();

  return (
    <div className={`w-full px-4 md:px-10 py-10 md:py-28 ${isAdmin ? "bg-gray-50" : ""}`}>
      {/* Breadcrumbs */}
      {!isColegiado && onVolver && (
        <div className="mb-6">
          <button
            onClick={() => onVolver()}
            className="text-md text-[#590248] hover:text-[#C40180] flex items-center cursor-pointer transition-colors duration-200"
          >
            <ChevronLeft size={20} className="mr-1" />
            Volver a la lista de colegiados
          </button>
        </div>
      )}

      {/* Notificación de cambios pendientes para colegiados */}
      {tipo === "colegiado" && cambiosPendientes && (
        <div className="bg-blue-100 text-blue-800 p-4 mb-6 rounded-md flex items-start justify-between shadow-sm">
          <div className="flex items-center">
            <AlertCircle size={20} className="mr-2 flex-shrink-0" />
            <span>Hay cambios sin guardar. Por favor guarde los cambios antes de continuar.</span>
          </div>
          <button
            onClick={() => setCambiosPendientes(false)}
            className="text-blue-700 hover:bg-blue-200 p-1 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Profile Card */}
      <UserProfileCard
        data={entityData}
        variant={tipo === "pendiente" ? "pending" : "registered"}
        onNuevaSolicitud={handleNuevaSolicitud}
        onConfirmarTitulo={handleConfirmarTitulo}
        onMostrarConfirmacion={() => setMostrarConfirmacion(true)}
        onMostrarRechazo={() => setMostrarRechazo(true)}
        onMostrarExoneracion={() => setMostrarExoneracion(true)}
        onMostrarReporteIrregularidad={handleReportarIrregularidad}
        isAdmin={isAdmin}
        allDocumentsApproved={allDocumentsApproved()}
      />

      {/* Estado de solvencia para colegiados */}
      {tipo === "colegiado" && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-100">
          <div className="flex justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Estado de solvencia</p>
              <p className={`font-bold text-xl ${entityData.solvencia_status ? "text-green-600" : "text-red-600"} flex items-center justify-center`}>
                {entityData.solvencia_status ? (
                  <>
                    <CheckCircle size={20} className="mr-2" />
                    Solvente
                  </>
                ) : (
                  <>
                    <AlertCircle size={20} className="mr-2" />
                    No Solvente
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {tipo === "pendiente" ? (
        // Vista para pendientes
        <>
          <PersonalInfoSection
            props={{
              pendiente: entityData,
              datosPersonales,
              setDatosPersonales,
              updateData,
              pendienteId: entityId,
              setCambiosPendientes,
              isAdmin,
              readOnly: entityData?.status === "anulado",
            }}
          />

          <ContactInfoSection
            pendiente={entityData}
            datosContacto={datosContacto}
            setDatosContacto={setDatosContacto}
            updateData={updateData}
            pendienteId={entityId}
            setCambiosPendientes={setCambiosPendientes}
            isAdmin={isAdmin}
            readOnly={entityData?.status === "anulado"}
          />

          <AcademicInfoSection
            pendiente={entityData}
            datosAcademicos={datosAcademicos}
            setDatosAcademicos={setDatosAcademicos}
            updateData={updateData}
            pendienteId={entityId}
            setCambiosPendientes={setCambiosPendientes}
            readOnly={entityData?.status === "anulado"}
          />

          <InstitutionsSection
            pendiente={entityData}
            instituciones={instituciones}
            setInstituciones={setInstituciones}
            updateData={updateData}
            pendienteId={entityId}
            setCambiosPendientes={setCambiosPendientes}
            readOnly={entityData?.status === "anulado"}
            isAdmin={isAdmin}
          />

          {/* DocumentSection optimizado */}
          <DocumentSection
            key={`docs-${entityId}-${documentUpdateTrigger}`}
            documentos={[]}
            onViewDocument={handleVerDocumento}
            updateDocumento={updateDocumento}
            onDocumentStatusChange={handleDocumentStatusChange}
            readonly={entityData?.status === "anulado"}
            isColegiado={isColegiado}
            pendienteData={entityData}
            isAdmin={isAdmin}
          />

          {/* Sección de comprobante de pago optimizada */}
          {isAdmin && !entityData.pago_exonerado && (
            <PaymentReceiptSection
              comprobanteData={comprobanteData}
              onUploadComprobante={handleUploadComprobante}
              onViewComprobante={handleVerDocumento}
              onStatusChange={handleComprobanteStatusChange}
              readOnly={entityData?.status === "anulado"}
              isAdmin={isAdmin}
            />
          )}

          {/* Sección de pagos para pendientes */}
          {!isAdmin && entityData.pago == null && pagosPendientes && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
            >
              <PagosColg
                props={{
                  costo: costoInscripcion,
                  allowMultiplePayments: false,
                  handlePago: handlePaymentComplete,
                }}
              />
            </motion.div>
          )}
        </>
      ) : (
        // Vista para colegiados - Con tabs
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {/* Sistema de tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto justify-center">
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "informacion"
                  ? "border-b-2 border-[#C40180] text-[#C40180]"
                  : "text-gray-500 hover:text-gray-700"
                  } transition-colors`}
                onClick={() => setTabActivo("informacion")}
              >
                Información
              </button>
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "pagos"
                  ? "border-b-2 border-[#C40180] text-[#C40180]"
                  : "text-gray-500 hover:text-gray-700"
                  } transition-colors`}
                onClick={() => setTabActivo("pagos")}
              >
                Pagos
              </button>
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "inscripciones"
                  ? "border-b-2 border-[#C40180] text-[#C40180]"
                  : "text-gray-500 hover:text-gray-700"
                  } transition-colors`}
                onClick={() => setTabActivo("inscripciones")}
              >
                Inscripciones
              </button>
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "solicitudes"
                  ? "border-b-2 border-[#C40180] text-[#C40180]"
                  : "text-gray-500 hover:text-gray-700"
                  } transition-colors`}
                onClick={() => setTabActivo("solicitudes")}
              >
                Solicitudes
              </button>
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "carnet"
                  ? "border-b-2 border-[#C40180] text-[#C40180]"
                  : "text-gray-500 hover:text-gray-700"
                  } transition-colors`}
                onClick={() => setTabActivo("carnet")}
              >
                Carnet
              </button>
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "documentos"
                  ? "border-b-2 border-[#C40180] text-[#C40180]"
                  : "text-gray-500 hover:text-gray-700"
                  } transition-colors`}
                onClick={() => setTabActivo("documentos")}
              >
                Documentos
              </button>
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "chats"
                  ? "border-b-2 border-[#C40180] text-[#C40180]"
                  : "text-gray-500 hover:text-gray-700"
                  } transition-colors`}
                onClick={() => setTabActivo("chats")}
              >
                Chats
              </button>
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "estadisticas"
                  ? "border-b-2 border-[#C40180] text-[#C40180]"
                  : "text-gray-500 hover:text-gray-700"
                  } transition-colors`}
                onClick={() => setTabActivo("estadisticas")}
              >
                Estadísticas
              </button>
            </nav>
          </div>

          {/* Contenido según el tab activo */}
          <div className="p-6">
            {tabActivo === "informacion" && (
              <>
                <PersonalInfoSection
                  props={{
                    pendiente: entityData,
                    datosPersonales,
                    setDatosPersonales,
                    updateData,
                    pendienteId: entityId,
                    setCambiosPendientes,
                    isAdmin: true,
                    readOnly: entityData?.status === "anulado",
                  }}
                />

                <ContactInfoSection
                  pendiente={entityData}
                  datosContacto={datosContacto}
                  setDatosContacto={setDatosContacto}
                  updateData={updateData}
                  pendienteId={entityId}
                  setCambiosPendientes={setCambiosPendientes}
                  readOnly={entityData?.status === "anulado"}
                />

                <AcademicInfoSection
                  pendiente={entityData}
                  datosAcademicos={datosAcademicos}
                  setDatosAcademicos={setDatosAcademicos}
                  updateData={updateData}
                  pendienteId={entityId}
                  setCambiosPendientes={setCambiosPendientes}
                  readonly={entityData?.status === "anulado"}
                />

                <InstitutionsSection
                  pendiente={entityData}
                  instituciones={instituciones}
                  setInstituciones={setInstituciones}
                  updateData={updateData}
                  pendienteId={entityId}
                  setCambiosPendientes={setCambiosPendientes}
                  readonly={entityData?.status === "anulado"}
                  isAdmin={isAdmin}
                />
              </>
            )}

            {tabActivo === "pagos" && (
              <TablaPagos
                colegiadoId={entityId}
                handleVerDocumento={handleVerDocumento}
                documentos={documentos || []}
              />
            )}

            {tabActivo === "inscripciones" && (
              <TablaInscripciones colegiadoId={entityId} />
            )}

            {tabActivo === "solicitudes" && (
              <TablaSolicitudes
                colegiadoId={entityId}
                onVerDetalle={(id) => {
                  // Implementar lógica
                }}
              />
            )}

            {tabActivo === "carnet" && (
              <CarnetInfo
                colegiado={{
                  ...entityData,
                  persona: entityData.recaudos?.persona,
                }}
              />
            )}

            {tabActivo === "documentos" && (
              <DocumentSection
                documentos={documentos}
                onViewDocument={handleVerDocumento}
                updateDocumento={updateDocumento}
                onDocumentStatusChange={handleDocumentStatusChange}
                title="Documentos"
                subtitle="Documentación del colegiado"
                isColegiado={isColegiado}
              />
            )}

            {tabActivo === "chats" && <ChatSection colegiado={entityData} />}

            {tabActivo === "estadisticas" && (
              <EstadisticasUsuario colegiado={entityData} />
            )}
          </div>
        </div>
      )}

      {/* Modales para pendientes */}
      {tipo === "pendiente" && (
        <>
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
              pendiente={entityData}
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
              isRechazada={entityData?.status === "rechazado"}
              documentosRechazados={documentos.filter(
                (doc) => doc.status === "rechazado"
              )}
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

          {showReportModal && (
            <ReportIllegalityModal
              isOpen={showReportModal}
              onClose={() => setShowReportModal(false)}
              onSubmit={(reportData) => {
                setShowReportModal(false);
                alert("El reporte de ilegalidad ha sido enviado correctamente");
              }}
              colegiadoInfo={{
                nombre: nombreCompleto,
                id: entityId,
                cedula: entityData.persona?.identificacion || entityData.recaudos?.persona?.identificacion,
              }}
            />
          )}
        </>
      )}

      {/* Modal para crear solicitud - para colegiados registrados */}
      {showCrearSolicitudModal && (
        <CrearSolicitudModal
          props={{
          onClose: () => setShowCrearSolicitudModal(false),
            onSolicitudCreada: (nuevaSolicitud) => {
              setShowCrearSolicitudModal(false);
              loadData();
            },
            colegiados: [entityData],
            colegiadoPreseleccionado: entityData,
            isAdmin: isAdmin,
            session: {
            user: {
              name: "Admin",
              email: "admin@system.com",
              role: "admin",
              isAdmin: true,
              },
            }}}
        />
      )}

      {/* Modal de confirmación de título */}
      {showTitleConfirmationModal && (
        <TitleConfirmationModal
          nombreColegiado={nombreCompleto}
          onConfirm={handleConfirmTitleDelivery}
          onClose={() => setShowTitleConfirmationModal(false)}
        />
      )}

      {/* Modal de reporte de irregularidad */}
      {showReportModal && tipo === "colegiado" && (
        <ReportIllegalityModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onSubmit={(reportData) => {
            setShowReportModal(false);
            alert("El reporte de ilegalidad ha sido enviado correctamente");
          }}
          colegiadoInfo={{
            nombre: nombreCompleto,
            id: entityId,
            cedula: entityData.recaudos?.persona?.identificacion,
          }}
        />
      )}

      {/* Modal para ver documentos */}
      {documentoSeleccionado && (
        <DocumentViewer
          documento={documentoSeleccionado}
          onClose={handleCerrarVistaDocumento}
        />
      )}
      {!isAdmin&& entityData.recaudos?.pago !== null && (
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