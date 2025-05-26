"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, ChevronLeft, X } from "lucide-react";
import { useEffect, useState } from "react";

// Componentes compartidos
import AcademicInfoSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/AcademicInfoSection";
import ContactInfoSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/ContactInfoSection";
import {
  DocumentSection,
  DocumentViewer,
} from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/DocumentModule";
import InstitutionsSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/InstitutionsSection";
import NotificationSystem from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/NotificationSystem";
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
  isColegiado = false,
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

  // Función unificada para actualizar datos
  const updateData = async (id, datosActualizados) => {
    try {
      const dataToSend = JSON.parse(JSON.stringify(datosActualizados));

      // Actualizar estados locales según el tipo de datos
      if (dataToSend.persona) {
        setDatosPersonales((prev) => ({ ...prev, ...dataToSend.persona }));
      }

      if (
        dataToSend.contacto ||
        dataToSend.email ||
        dataToSend.phoneNumber ||
        dataToSend.address
      ) {
        const contactData = dataToSend.contacto || dataToSend;
        setDatosContacto((prev) => ({ ...prev, ...contactData }));
      }

      if (
        dataToSend.academicos ||
        dataToSend.instituto_bachillerato ||
        dataToSend.universidad ||
        dataToSend.num_registro_principal ||
        dataToSend.fecha_registro_principal ||
        dataToSend.num_mpps ||
        dataToSend.fecha_mpps ||
        dataToSend.fecha_egreso_universidad ||
        dataToSend.observaciones
      ) {
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
      console.error("Error al actualizar datos:", error);
      setCambiosPendientes(true);
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
        console.log("Datos cargados:", entityData);
        setEntityData(entityData);

        // Inicializar estados según el tipo
        if (tipo === "pendiente") {
          initializePendienteData(entityData);
          loadComprobanteData(entityData);
        } else {
          initializeColegiadoData(entityData);
        }

        // Cargar documentos SOLO para colegiados registrados
        // Para pendientes, DocumentModule maneja esto internamente
        if (tipo === "colegiado") {
          try {
            const docs = await getDocumentos(entityId);
            setDocumentos(docs || []);
          } catch (docError) {
            console.error("Error cargando documentos:", docError);
            setDocumentos([]);
          }
        } else {
          // Para pendientes, establecer array vacío ya que DocumentModule maneja la carga
          setDocumentos([]);
        }
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar datos del comprobante
  const loadComprobanteData = (pendienteData) => {
    console.log("Cargando datos del comprobante:", pendienteData); // Debug

    // Verificar diferentes posibles ubicaciones del comprobante
    const comprobanteUrl =
      pendienteData.comprobante_url ||
      pendienteData.comprobante ||
      pendienteData.pago?.comprobante_url ||
      pendienteData.pago?.comprobante;

    // También verificar si hay un archivo de comprobante en los campos de archivos
    const tieneComprobante =
      comprobanteUrl ||
      pendienteData.comprobante_pago_url ||
      pendienteData.file_comprobante_url ||
      (pendienteData.pago && pendienteData.pago.comprobante);

    if (tieneComprobante) {
      const url =
        comprobanteUrl ||
        pendienteData.comprobante_pago_url ||
        pendienteData.file_comprobante_url ||
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
          pendienteData.comprobante_validate === null
            ? "pending"
            : pendienteData.comprobante_validate === true
              ? "approved"
              : pendienteData.comprobante_validate === false
                ? "rechazado"
                : "pending",
        rejectionReason: pendienteData.comprobante_motivo_rechazo || "",
      };

      setComprobanteData(comprobanteInfo);

      console.log("Comprobante cargado:", {
        url: url,
        status: pendienteData.comprobante_validate,
      }); // Debug
    } else {
      console.log("No se encontró comprobante"); // Debug
      setComprobanteData(null);
    }
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
      state: data.persona?.direccion?.estado || "",
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

    setInstituciones(
      data.instituciones ? JSON.parse(JSON.stringify(data.instituciones)) : []
    );
    setPagosPendientes(data.pago === null && !data.pago_exonerado);
  };

  // Inicializar datos para colegiados
  const initializeColegiadoData = (data) => {
    setDatosPersonales(
      JSON.parse(JSON.stringify(data.recaudos?.persona || {}))
    );

    const persona = data.recaudos?.persona || {};
    setDatosContacto({
      email: persona.correo || "",
      phoneNumber: persona.telefono_movil?.split(" ")[1] || "",
      countryCode: persona.telefono_movil?.split(" ")[0] || "+58",
      homePhone: persona.telefono_de_habitacion || "",
      address: persona.direccion?.referencia || "",
      city: persona.direccion?.ciudad || "",
      state: persona.direccion?.estado || "",
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
          const tasa = await fetchDataSolicitudes("tasa-bcv");
          setTasaBcv(tasa.data.rate);

          const costo = await fetchDataSolicitudes(
            "costo",
            `?search=Inscripcion+${entityData.tipo_profesion?.titulo}&es_vigente=true`
          );

          // Verificar que existan datos antes de acceder a monto_usd
          if (costo.data && costo.data.length > 0) {
            setCostoInscripcion(Number(costo.data[0].monto_usd));
          } else {
            console.warn("No se encontraron datos de costo de inscripción");
            setCostoInscripcion(0); // Valor por defecto
          }

          const Mpagos = await fetchDataSolicitudes("metodo-de-pago");
          setMetodoPago(Mpagos.data);
        } catch (error) {
          console.error("Error cargando datos de pago:", error);
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

  // Función para actualizar documento
  const updateDocumento = (documentoActualizado) => {
    try {
      if (!recaudos) {
        updateColegiadoPendiente(entityId, documentoActualizado, true);
      } else {
        updateColegiadoPendienteWithToken(entityId, documentoActualizado, true);
      }
      loadData();
    } catch (error) {
      console.error("Error al actualizar documento:", error);
    }
  };

  // Función para manejar el estado de documentos
  const handleDocumentStatusChange = (updatedDocument) => {
    const docsCopy = [...documentos];
    const index = docsCopy.findIndex((doc) => doc.id === updatedDocument.id);
    if (index !== -1) {
      docsCopy[index] = {
        ...docsCopy[index],
        status: updatedDocument.status,
        rejectionReason: updatedDocument.rejectionReason || "",
      };
      setDocumentos(docsCopy);
    }

    const updateData = {
      [`${updatedDocument.id}_validate`]:
        updatedDocument.status === "pending"
          ? null
          : updatedDocument.status === "approved"
            ? true
            : false,
    };
    if (updatedDocument.rejectionReason) {
      updateData[`${updatedDocument.id}_motivo_rechazo`] =
        updatedDocument.rejectionReason;
    }

    updateColegiadoPendiente(entityId, updateData);
  };

  // Función para manejar el upload del comprobante
  const handleUploadComprobante = async (formData) => {
    try {
      console.log("Subiendo comprobante...");

      let response;
      if (!recaudos) {
        response = await updateColegiadoPendiente(entityId, formData, true);
      } else {
        response = await updateColegiadoPendienteWithToken(
          entityId,
          formData,
          true
        );
      }

      console.log("Respuesta de upload:", response);

      // Actualizar solo el estado del comprobante sin recargar toda la página
      if (response && response.data) {
        const updatedData = response.data;

        // Actualizar entityData localmente
        setEntityData((prevData) => ({
          ...prevData,
          ...updatedData,
        }));

        // Actualizar el comprobante directamente
        const nuevoComprobante = {
          id: "comprobante_pago",
          nombre: "Comprobante de pago",
          archivo: "comprobante_pago.pdf",
          url:
            updatedData.comprobante_url ||
            updatedData.comprobante ||
            updatedData.pago?.comprobante_url,
          status:
            updatedData.comprobante_validate === null
              ? "pending"
              : updatedData.comprobante_validate === true
                ? "approved"
                : updatedData.comprobante_validate === false
                  ? "rechazado"
                  : "pending",
          rejectionReason: updatedData.comprobante_motivo_rechazo || "",
        };

        setComprobanteData(nuevoComprobante);
        console.log("Comprobante actualizado localmente:", nuevoComprobante);
      }

      return response;
    } catch (error) {
      console.error("Error al subir comprobante:", error);
      throw error;
    }
  };

  // Función para manejar el estado del comprobante
  const handleComprobanteStatusChange = (updatedComprobante) => {
    // Actualizar estado local inmediatamente
    setComprobanteData((prev) => ({
      ...prev,
      status: updatedComprobante.status,
      rejectionReason: updatedComprobante.rejectionReason || "",
    }));

    // Actualizar en el backend
    const updateData = {
      comprobante_validate:
        updatedComprobante.status === "pending"
          ? null
          : updatedComprobante.status === "approved"
            ? true
            : false,
    };

    if (updatedComprobante.rejectionReason) {
      updateData.comprobante_motivo_rechazo =
        updatedComprobante.rejectionReason;
    }

    // Actualizar en backend sin recargar
    updateColegiadoPendiente(entityId, updateData)
      .then((response) => {
        if (response && response.data) {
          // Actualizar entityData con la respuesta
          setEntityData((prevData) => ({
            ...prevData,
            ...response.data,
          }));
        }
      })
      .catch((error) => {
        console.error("Error al actualizar estado del comprobante:", error);
      });
  };

  // Validación actualizada para incluir comprobante
  const allDocumentsApproved = () => {
    // Obtener el tipo de profesión
    const tipoProfesion = entityData?.tipo_profesion || "odontologo";

    // Para odontólogos: verificar solo 4 documentos base
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

    // Verificar directamente en entityData en lugar de usar documentos state
    const docsApproved = documentosRequeridos.every((docId) => {
      const validateField = `${docId}_validate`;
      const urlField = `${docId}_url`;

      return entityData?.[urlField] && entityData?.[validateField] === true;
    });

    console.log("Documentos aprobados:", docsApproved);
    console.log("Tipo profesión:", tipoProfesion);
    console.log("Documentos requeridos:", documentosRequeridos);

    // Verificar comprobante de pago si no está exonerado
    if (!entityData?.pago_exonerado) {
      const comprobanteApproved =
        comprobanteData?.status === "approved" && comprobanteData?.url;
      console.log("Comprobante aprobado:", comprobanteApproved);

      return docsApproved && comprobanteApproved;
    }

    return docsApproved;
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
      console.error("Error al aprobar solicitud:", error);
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
      console.error("Error al rechazar solicitud:", error);
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
      console.error("Error al denegar solicitud:", error);
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
      console.error("Error al exonerar pagos:", error);
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
    // Implementar lógica para confirmar entrega de título
    console.log("Confirmar entrega de título para colegiado:", entityId);
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
    } ${entityData.persona?.segundo_nombre ||
    entityData.recaudos?.persona?.segundo_nombre ||
    ""
    } ${entityData.persona?.primer_apellido ||
    entityData.recaudos?.persona?.primer_apellido ||
    ""
    } ${entityData.persona?.segundo_apellido ||
    entityData.recaudos?.persona?.segundo_apellido ||
    ""
    }`.trim();

  return (
    <div
      className={`w-full px-4 md:px-10 py-10 md:py-28 ${isAdmin ? "bg-gray-50" : ""
        }`}
    >
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

      {/* Notificaciones */}
      {tipo === "pendiente" && (
        <NotificationSystem
          notifications={{
            confirmacionExitosa,
            rechazoExitoso,
            denegacionExitosa,
            exoneracionExitosa,
            cambiosPendientes,
            documentosCompletos: allDocumentsApproved(),
          }}
          handlers={{
            setConfirmacionExitosa,
            setRechazoExitoso,
            setDenegacionExitosa,
            setExoneracionExitosa,
            setCambiosPendientes,
          }}
          pendiente={entityData}
        />
      )}

      {/* Notificación de cambios pendientes para colegiados */}
      {tipo === "colegiado" && cambiosPendientes && (
        <div className="bg-blue-100 text-blue-800 p-4 mb-6 rounded-md flex items-start justify-between shadow-sm">
          <div className="flex items-center">
            <AlertCircle size={20} className="mr-2 flex-shrink-0" />
            <span>
              Hay cambios sin guardar. Por favor guarde los cambios antes de
              continuar.
            </span>
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
              <p
                className={`font-bold text-xl ${entityData.solvencia_status
                    ? "text-green-600"
                    : "text-red-600"
                  } flex items-center justify-center`}
              >
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
        // Vista para pendientes - Solo información y documentos
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
            isAdmin={isAdmin} // ← AGREGAR ESTA LÍNEA
          />

          <DocumentSection
            documentos={[]} // Array vacío ya que ahora DocumentModule maneja la carga
            onViewDocument={handleVerDocumento}
            updateDocumento={updateDocumento}
            onDocumentStatusChange={handleDocumentStatusChange}
            title="Documentos requeridos"
            subtitle="Documentación obligatoria del solicitante"
            readonly={entityData?.status === "anulado"}
            isColegiado={isColegiado}
            pendienteData={entityData} // NUEVO: Pasar los datos del pendiente
          />

          {/* Nueva sección de comprobante de pago */}
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
                  isAdmin={isAdmin} // ← AGREGAR ESTA LÍNEA
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
                  // Función para ver detalle de solicitud si es necesaria
                  console.log("Ver detalle solicitud:", id);
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
                console.log("Reporte enviado:", reportData);
                setShowReportModal(false);
                alert("El reporte de ilegalidad ha sido enviado correctamente");
              }}
              colegiadoInfo={{
                nombre: nombreCompleto,
                id: entityId,
                cedula:
                  entityData.persona?.identificacion ||
                  entityData.recaudos?.persona?.identificacion,
              }}
            />
          )}
        </>
      )}

      {/* Modal para crear solicitud - para colegiados registrados */}
      {showCrearSolicitudModal && (
        <CrearSolicitudModal
          onClose={() => setShowCrearSolicitudModal(false)}
          onSolicitudCreada={(nuevaSolicitud) => {
            console.log("Nueva solicitud creada:", nuevaSolicitud);
            setShowCrearSolicitudModal(false);
            // Recargar datos si es necesario
            loadData();
          }}
          colegiados={[entityData]}
          colegiadoPreseleccionado={entityData}
          isAdmin={isAdmin}
          session={{
            user: {
              name: "Admin",
              email: "admin@system.com",
              role: "admin",
              isAdmin: true,
            },
          }}
        />
      )}

      {/* Modal de reporte de irregularidad */}
      {showReportModal && tipo === "colegiado" && (
        <ReportIllegalityModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onSubmit={(reportData) => {
            console.log("Reporte enviado:", reportData);
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
    </div>
  );
}