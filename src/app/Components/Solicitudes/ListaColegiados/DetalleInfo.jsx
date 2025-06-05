"use client";

import { AlertCircle, CheckCircle, ChevronLeft, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Componentes compartidos
import AcademicInfoSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/AcademicInfoSection";
import ContactInfoSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/ContactInfoSection";
import {
  DocumentSection,
  DocumentViewer,
} from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/DocumentModule";
import PaymentReceiptSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/PaymentReceiptSection";
import PersonalInfoSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/PersonalInfoSection";
import UserProfileCard from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/UserProfileCard";

// Componentes específicos para colegiados
import CarnetInfo from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/CarnetInfo";
import ChatSection from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/ChatSection";
import EstadisticasUsuario from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/EstadisticasUsuario";
import SituacionLaboral from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/SituacionLaboral";
import TablaInscripciones from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/TablaInscripciones";
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
import useDataListaColegiados from "@/store/ListaColegiadosData";

export default function DetalleInfo({
  params,
  onVolver,
  tipo = "pendiente",
  data = null,
  isAdmin = false,
  recaudos = null,
  isColegiado = false,
  handleForward = null,
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

  // Validaciones desde componentes especializados
  const [documentsApproved, setDocumentsApproved] = useState(false);
  const [paymentApproved, setPaymentApproved] = useState(false);

  // Funciones del store
  const {
    getColegiado,
    getColegiadoPendiente,
    updateColegiado,
    updateColegiadoPendiente,
    updateColegiadoPendienteWithToken,
    getDocumentos,
    approveRegistration,
    marcarTituloEntregado,
  } = useDataListaColegiados();

  // HANDLERS para recibir estados de componentes especializados
  const handleDocumentsStatusChange = useCallback((allApproved) => {
    setDocumentsApproved(allApproved);
  }, []);

  const handlePaymentStatusChange = useCallback((approved) => {
    setPaymentApproved(approved);
  }, []);

  // MANEJAR PAGO EXONERADO: Si el pago está exonerado, se considera aprobado
  useEffect(() => {
    if (entityData?.pago_exonerado) {
      setPaymentApproved(true);
    }
  }, [entityData?.pago_exonerado]);

  // Función unificada para actualizar datos
  const updateData = async (id, datosActualizados, docs = false) => {
    try {
      // Si son datos con archivos, no intentar copiar
      const dataToSend = docs ? datosActualizados : JSON.parse(JSON.stringify(datosActualizados));

      // Actualizar estados locales según el tipo de datos (solo si no son archivos)
      if (!docs) {
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
          console.log("📝 Actualizando instituciones en estado local:", dataToSend.instituciones);
          setInstituciones(dataToSend.instituciones);
        }
      }

      // Marcar cambios pendientes
      setCambiosPendientes(true);

      let response;
      // Llamar a la función apropiada según el tipo
      if (tipo === "pendiente") {
        if (!recaudos) {
          response = await updateColegiadoPendiente(id, dataToSend, docs);
        } else {
          response = await updateColegiadoPendienteWithToken(id, dataToSend, docs);
        }
      } else {
        response = await updateColegiado(entityData?.recaudos?.id, dataToSend, docs);
      }

      setCambiosPendientes(false);
      return response;
    } catch (error) {
      console.error("❌ Error en updateData:", {
        error: error.message || error,
        details: error.response?.data || "Sin detalles adicionales"
      });
      setCambiosPendientes(true);
      throw error;
    }
  };

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
          // CARGAR COMPROBANTE PARA COLEGIADOS
          if (entityData.recaudos) {
            loadComprobanteData(entityData.recaudos);
          }
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
  const loadComprobanteData = (pendienteData) => {
    const comprobanteUrl =
      pendienteData.comprobante_url ||
      pendienteData.comprobante ||
      pendienteData.pago?.comprobante_url ||
      pendienteData.pago?.comprobante ||
      pendienteData.file_comprobante_url;

    const tieneComprobante =
      comprobanteUrl ||
      pendienteData.comprobante_pago_url ||
      (pendienteData.pago && pendienteData.pago.comprobante);

    if (tieneComprobante) {
      const url =
        comprobanteUrl ||
        pendienteData.comprobante_pago_url ||
        pendienteData.pago?.comprobante;

      const comprobanteInfo = {
        id: "comprobante_pago",
        nombre: "Comprobante de pago",
        archivo:
          typeof url === "string"
            ? url.split("/").pop()
            : "comprobante_pago.pdf",
        url: url,
        status:
          pendienteData.comprobante_validate === "aprobado"
            ? "approved"
            : pendienteData.comprobante_validate === "rechazado"
              ? "rechazado"
              : pendienteData.comprobante_validate === "revisando"
                ? "pending"
                : pendienteData.status === "aprobado"
                  ? "approved"
                  : pendienteData.status === "rechazado"
                    ? "rechazado"
                    : "pending",
        rejectionReason: pendienteData.comprobante_motivo_rechazo || "",
        // Agregar detalles del pago si están disponibles
        paymentDetails: pendienteData.pago ? {
          fecha_pago: pendienteData.pago.fecha_pago,
          numero_referencia: pendienteData.pago.num_referencia,
          monto: pendienteData.pago.monto,
          metodo_pago: pendienteData.pago.metodo_de_pago?.nombre ||
            pendienteData.pago.metodo_pago?.nombre,
          metodo_pago_slug: pendienteData.pago.metodo_de_pago?.datos_adicionales?.slug ||
            pendienteData.pago.metodo_pago?.datos_adicionales?.slug,
          tasa_bcv: pendienteData.pago.tasa_bcv_del_dia || pendienteData.pago.tasa_bcv
        } : null
      };

      setComprobanteData(comprobanteInfo);
    } else {
      setComprobanteData(null);
    }
  };

  // Inicializar datos para pendientes
  const initializePendienteData = (data) => {
    setDatosPersonales(JSON.parse(JSON.stringify(data.persona || {})));
    
    // Debug: Log para ver cómo llegan los datos de teléfono
    console.log("📱 Datos de teléfono (pendiente):", {
      telefono_movil: data.persona?.telefono_movil,
      telefono_habitacion: data.persona?.telefono_de_habitacion
    });
    
    // Función para separar teléfono correctamente
    const parsePhoneNumber = (telefono) => {
      if (!telefono) return { countryCode: "+58", phoneNumber: "" };
      
      const telefonoStr = String(telefono);
      
      // Si ya viene separado por espacio (ej: "+58 4123456789")
      if (telefonoStr.includes(" ")) {
        const [code, number] = telefonoStr.split(" ");
        return { countryCode: code || "+58", phoneNumber: number || "" };
      }
      
      // Si viene sin separar (ej: "+584123456789" o "584123456789")
      if (telefonoStr.startsWith("+58")) {
        return { countryCode: "+58", phoneNumber: telefonoStr.substring(3) };
      } else if (telefonoStr.startsWith("58")) {
        return { countryCode: "+58", phoneNumber: telefonoStr.substring(2) };
      }
      
      // Si es solo el número (sin código)
      return { countryCode: "+58", phoneNumber: telefonoStr };
    };
    
    const parsedPhone = parsePhoneNumber(data.persona?.telefono_movil);
    
    setDatosContacto({
      email: data.persona?.correo || "",
      phoneNumber: parsedPhone.phoneNumber,
      countryCode: parsedPhone.countryCode,
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
    
    // Debug: Log para ver cómo llegan los datos de teléfono
    console.log("📱 Datos de teléfono (colegiado):", {
      telefono_movil: persona.telefono_movil,
      telefono_habitacion: persona.telefono_de_habitacion
    });
    
    // Función para separar teléfono correctamente
    const parsePhoneNumber = (telefono) => {
      if (!telefono) return { countryCode: "+58", phoneNumber: "" };
      
      const telefonoStr = String(telefono);
      
      // Si ya viene separado por espacio (ej: "+58 4123456789")
      if (telefonoStr.includes(" ")) {
        const [code, number] = telefonoStr.split(" ");
        return { countryCode: code || "+58", phoneNumber: number || "" };
      }
      
      // Si viene sin separar (ej: "+584123456789" o "584123456789")
      if (telefonoStr.startsWith("+58")) {
        return { countryCode: "+58", phoneNumber: telefonoStr.substring(3) };
      } else if (telefonoStr.startsWith("58")) {
        return { countryCode: "+58", phoneNumber: telefonoStr.substring(2) };
      }
      
      // Si es solo el número (sin código)
      return { countryCode: "+58", phoneNumber: telefonoStr };
    };
    
    const parsedPhone = parsePhoneNumber(persona.telefono_movil);
    
    setDatosContacto({
      email: persona.correo || "",
      phoneNumber: parsedPhone.phoneNumber,
      countryCode: parsedPhone.countryCode,
      homePhone: persona.telefono_de_habitacion || "",
      address: persona.direccion?.referencia || "",
      city: persona.direccion?.municipio || "",
      city_name: persona.direccion?.municipio_nombre || "",
      state: persona.direccion?.estado || "",
      state_name: persona.direccion?.estado_nombre || "",
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

    // CARGAR DATOS DE COMPROBANTE PARA COLEGIADOS
    if (data.recaudos) {
      loadComprobanteData(data.recaudos);
    }
  };

  // Cargar datos de pago para pendientes
  useEffect(() => {
    if (tipo === "pendiente" && entityData && entityData.tipo_profesion) {
      const loadPaymentData = async () => {
        try {
          const [tasa, costo, Mpagos] = await Promise.all([
            fetchDataSolicitudes("tasa-bcv"),
            fetchDataSolicitudes("costo", `?search=Inscripcion+${entityData.tipo_profesion?.titulo}&es_vigente=true`),
            fetchDataSolicitudes("metodo-de-pago",`?es_visible_colegiado=true`)
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

  // Solo para actualizar archivos (NO validación)
  const updateDocumento = async (documentoActualizado) => {
    try {
      let response;
      if (!recaudos) {
        response = await updateColegiadoPendiente(entityId, documentoActualizado, true);
      } else {
        response = await updateColegiadoPendienteWithToken(entityId, documentoActualizado, true);
      }

      // Si el backend devuelve el pending completo, actualizar
      if (response && response.data) {
        setEntityData(prevData => ({ ...prevData, ...response.data }));
        loadComprobanteData(response.data);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  // Solo para manejar validación desde VerificationSwitch
  const handleDocumentValidationChange = useCallback(async (documentoActualizado) => {
    try {
      // Determinar valor de validación
      let validateValue = null;
      if (documentoActualizado.status === "approved") validateValue = true;
      if (documentoActualizado.status === "rechazado") validateValue = false;

      const updateData = {
        [`${documentoActualizado.id}_validate`]: validateValue
      };

      if (documentoActualizado.rejectionReason) {
        updateData[`${documentoActualizado.id}_motivo_rechazo`] = documentoActualizado.rejectionReason;
      }

      // Actualizar estado local inmediatamente
      setEntityData(prevData => ({
        ...prevData,
        ...updateData
      }));

      // Si es comprobante de pago, también actualizar el local del comprobante
      if (documentoActualizado.id === "comprobante_pago") {
        setComprobanteData(prev => ({
          ...prev,
          status: documentoActualizado.status,
          rejectionReason: documentoActualizado.rejectionReason || ''
        }));
      }

      // Actualizar en backend en segundo plano
      await updateColegiadoPendiente(entityId, updateData);
    } catch (error) {
      console.error("Error updating document validation:", error);
    }
  }, [entityId, updateColegiadoPendiente]);

  // Función para manejar el upload del comprobante
  const handleUploadComprobante = async (formData) => {
    try {
      let response;
      if (!recaudos) {
        response = await updateColegiadoPendiente(entityId, formData, formData instanceof FormData);
      } else {
        response = await updateColegiadoPendienteWithToken(entityId, formData, formData instanceof FormData);
      }

      if (response && response.data) {
        setEntityData(prevData => ({ ...prevData, ...response.data }));

        // Actualizar también los datos del comprobante local
        loadComprobanteData(response.data);

        // Recargar datos completos para asegurar sincronización
        setTimeout(() => {
          loadData();
        }, 1000);
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
      comprobante_validate: updatedComprobante.status === "pending" ? "revisando" :
        updatedComprobante.status === "approved" ? "aprobado" : "rechazado",
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
      marcarTituloEntregado(entityId);
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

  const nombreCompleto = [
    entityData.persona?.nombre || entityData.recaudos?.persona?.nombre,
    entityData.persona?.segundo_nombre || entityData.recaudos?.persona?.segundo_nombre,
    entityData.persona?.primer_apellido || entityData.recaudos?.persona?.primer_apellido,
    entityData.persona?.segundo_apellido || entityData.recaudos?.persona?.segundo_apellido
  ].filter(Boolean).join(" ") || "Sin nombre";

  // FUNCIÓN PARA EXTRAER INCIDENCIAS RECHAZADAS

  // Extraer documentos rechazados
  const getDocumentosRechazados = () => {
    // Para pendientes, los documentos están en entityData directamente
    if (tipo === "pendiente" && entityData) {
      const documentosRechazados = [];

      // Lista de documentos a verificar
      const documentosAVerificar = [
        { key: 'file_ci', nombre: 'Cédula de identidad' },
        { key: 'file_rif', nombre: 'RIF' },
        { key: 'file_fondo_negro', nombre: 'Título universitario fondo negro' },
        { key: 'file_mpps', nombre: 'Registro MPPS' },
        { key: 'fondo_negro_credencial', nombre: 'Credencial fondo negro' },
        { key: 'notas_curso', nombre: 'Notas del curso' },
        { key: 'fondo_negro_titulo_bachiller', nombre: 'Título bachiller fondo negro' },
        { key: 'file_foto_carnet_recaudos', nombre: 'Foto carnet recaudos' }
      ];

      documentosAVerificar.forEach(doc => {
        const validateField = `${doc.key}_validate`;
        const urlField = `${doc.key}_url`;
        const motivoField = `${doc.key}_motivo_rechazo`;

        const hasFile = !!entityData[urlField];
        const isRejected = entityData[validateField] === false || entityData[validateField] === "rechazado";

        console.log(`Documento ${doc.key}:`, {
          hasFile,
          validateValue: entityData[validateField],
          isRejected,
          motivo: entityData[motivoField]
        });

        if (hasFile && isRejected) {
          documentosRechazados.push({
            nombre: doc.nombre,
            rejectionReason: entityData[motivoField] || "Sin motivo especificado",
            tipo: "documento"
          });
        }
      });

      return documentosRechazados;
    }

    // Para colegiados registrados, usar el array de documentos
    if (documentos && Array.isArray(documentos)) {
      const rechazados = documentos.filter(doc => doc.status === "rechazado").map(doc => ({
        nombre: doc.nombre || "Documento",
        rejectionReason: doc.rejectionReason || doc.motivo_rechazo || "Sin motivo especificado",
        tipo: "documento"
      }));

      return rechazados;
    }

    return [];
  };

  // Extraer instituciones rechazadas
  const getInstitucionesRechazadas = () => {
    if (!instituciones || !Array.isArray(instituciones)) {
      return [];
    }

    const rechazadas = instituciones.filter(inst => {
      // Verificar diferentes campos que pueden indicar rechazo
      const isRejected = inst.verificado === false ||
        inst.verification_status === false ||
        inst.verification_status === "rechazado";

      console.log(`Institución ${inst.nombre || inst.institutionName}:`, {
        verificado: inst.verificado,
        verification_status: inst.verification_status,
        isRejected: isRejected,
        motivo: inst.motivo_rechazo || inst.rejection_reason
      });

      return isRejected;
    }).map(inst => ({
      nombre: inst.nombre || inst.institutionName || "Institución sin nombre",
      motivo_rechazo: inst.motivo_rechazo || inst.rejection_reason || "Sin motivo especificado",
      tipo: "institucion"
    }));

    return rechazadas;
  };

  // Extraer pagos rechazados  
  const getPagosRechazados = () => {
    const pagosRechazados = [];

    // Verificar pago en entityData
    if (entityData?.pago) {
      const pago = entityData.pago;
      const isRechazado = pago.status === "rechazado" ||
        pago.status === false ||
        pago.status === "false";

      console.log("Pago en entityData:", {
        status: pago.status,
        isRechazado: isRechazado,
        motivo: pago.motivo_rechazo
      });

      if (isRechazado) {
        pagosRechazados.push({
          nombre: "Comprobante de pago",
          motivo_rechazo: pago.motivo_rechazo || "Sin motivo especificado",
          monto: pago.monto,
          metodo_pago_slug: pago.metodo_de_pago?.datos_adicionales?.slug,
          tipo: "pago"
        });
      }
    }

    // También verificar en comprobanteData
    if (comprobanteData && comprobanteData.status === "rechazado") {
      console.log("Comprobante rechazado encontrado en comprobanteData");
      pagosRechazados.push({
        nombre: "Comprobante de pago",
        motivo_rechazo: comprobanteData.rejectionReason || "Sin motivo especificado",
        monto: comprobanteData.paymentDetails?.monto,
        metodo_pago_slug: comprobanteData.paymentDetails?.metodo_pago_slug,
        tipo: "pago"
      });
    }

    // Verificar campos de validación de comprobante en entityData
    if (entityData) {
      const comprobanteValidate = entityData.comprobante_validate;
      const isComprobanteRechazado = comprobanteValidate === false ||
        comprobanteValidate === "rechazado";

      console.log("Comprobante validate:", {
        comprobante_validate: comprobanteValidate,
        isRechazado: isComprobanteRechazado,
        motivo: entityData.comprobante_motivo_rechazo
      });

      if (isComprobanteRechazado && entityData.comprobante_url) {
        pagosRechazados.push({
          nombre: "Comprobante de pago",
          motivo_rechazo: entityData.comprobante_motivo_rechazo || "Sin motivo especificado",
          tipo: "pago"
        });
      }
    }

    return pagosRechazados;
  };

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
        documentsApproved={documentsApproved}
        paymentApproved={paymentApproved}
        isAdmin={isAdmin && !isColegiado}
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

          <DocumentSection
            documentos={[]}
            onViewDocument={handleVerDocumento}
            updateDocumento={updateDocumento}
            onValidationChange={handleDocumentValidationChange}
            readonly={entityData?.status === "anulado"}
            isColegiado={isColegiado}
            pendienteData={entityData}
            isAdmin={isAdmin && !isColegiado}
            onDocumentsStatusChange={handleDocumentsStatusChange}
          />

          {/* Sección de comprobante de pago */}
          {!entityData.pago_exonerado && (
            <PaymentReceiptSection
              comprobanteData={comprobanteData}
              onUploadComprobante={handleUploadComprobante}
              onViewComprobante={handleVerDocumento}
              onStatusChange={handleComprobanteStatusChange}
              readOnly={entityData?.status === "anulado"}
              isAdmin={isAdmin}
              costoInscripcion={costoInscripcion}
              metodoPago={metodoPago}
              tasaBCV={tasaBcv}
              entityData={entityData}
              onPaymentStatusChange={handlePaymentStatusChange}
              showPaymentHistory={tipo === "colegiado"}
              colegiadoId={tipo === "colegiado" ? entityId : null}
              handleVerDocumento={handleVerDocumento}
              documentos={documentos || []}
            />
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
                Información Personal
              </button>
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "situacion-laboral"
                  ? "border-b-2 border-[#C40180] text-[#C40180]"
                  : "text-gray-500 hover:text-gray-700"
                  } transition-colors`}
                onClick={() => setTabActivo("situacion-laboral")}
              >
                Situación Laboral
              </button>
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "documentacion"
                  ? "border-b-2 border-[#C40180] text-[#C40180]"
                  : "text-gray-500 hover:text-gray-700"
                  } transition-colors`}
                onClick={() => setTabActivo("documentacion")}
              >
                Documentación
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
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "comunicaciones"
                  ? "border-b-2 border-[#C40180] text-[#C40180]"
                  : "text-gray-500 hover:text-gray-700"
                  } transition-colors`}
                onClick={() => setTabActivo("comunicaciones")}
              >
                Comunicaciones
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
              </>
            )}

            {tabActivo === "situacion-laboral" && (
              <SituacionLaboral
                pendiente={entityData}
                instituciones={instituciones}
                setInstituciones={setInstituciones}
                updateData={updateData}
                pendienteId={entityId}
                setCambiosPendientes={setCambiosPendientes}
                readOnly={entityData?.status === "anulado"}
                isAdmin={isAdmin}
                isColegiado={isColegiado}
                pendienteData={tipo === "pendiente" ? entityData : null}
                entityData={tipo === "colegiado" ? entityData : null}
              />
            )}

            {tabActivo === "documentacion" && (
              <DocumentSection
                documentos={documentos}
                onViewDocument={handleVerDocumento}
                updateDocumento={updateDocumento}
                onValidationChange={handleDocumentValidationChange}
                readonly={entityData?.status === "anulado"}
                isColegiado={isColegiado}
                pendienteData={tipo === "pendiente" ? entityData : entityData?.recaudos}
                onDocumentsStatusChange={handleDocumentsStatusChange}
                isAdmin={isAdmin && !isColegiado}
              />
            )}

            {tabActivo === "pagos" && (
              <PaymentReceiptSection
                entityData={tipo === "pendiente" ? entityData : { ...entityData, ...entityData?.recaudos }}
                onUploadComprobante={handleUploadComprobante}
                onValidationChange={handleComprobanteStatusChange}
                readOnly={entityData?.status === "anulado"}
                isAdmin={isAdmin}
                costoInscripcion={costoInscripcion}
                metodoPago={metodoPago}
                tasaBCV={tasaBcv}
                onPaymentStatusChange={handlePaymentStatusChange}
                showPaymentHistory={tipo === "colegiado"}
                colegiadoId={tipo === "colegiado" ? entityId : null}
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

            {tabActivo === "comunicaciones" && <ChatSection colegiado={entityData} />}

            {tabActivo === "carnet" && (
              <CarnetInfo
                colegiado={{
                  ...entityData,
                  persona: entityData.recaudos?.persona,
                }}
              />
            )}

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
              documentosCompletos={documentsApproved && paymentApproved}
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
              documentosRechazados={getDocumentosRechazados()}
              institucionesRechazadas={getInstitucionesRechazadas()}
              pagosRechazados={getPagosRechazados()}
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
            }
          }}
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
      {!isAdmin && entityData.recaudos?.pago !== null && (
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