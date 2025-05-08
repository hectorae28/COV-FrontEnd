"use client";

import useDataListaColegiados from "@/app/Models/PanelControl/Solicitudes/ListaColegiadosData";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// Import components
import AcademicInfoSection from "./DetallePendiente/AcademicInfoSection ";
import {
  ApprovalModal,
  ExonerationModal,
  RejectModal,
} from "./DetallePendiente/ActionsModals";
import DocumentsSection from "./DetallePendiente/DocumentsSection";
import DocumentViewerModal from "./DetallePendiente/DocumentViewerModal";
import InstitutionsSection from "./DetallePendiente/InstitutionsSection ";
import PaymentsSection from "./DetallePendiente/PaymentsSection";
import PersonalInfoSection from "./DetallePendiente/PersonalInfoSection ";
import ProfileCard from "./DetallePendiente/ProfileCard";
import StatusAlerts from "./DetallePendiente/StatusAlerts";

export default function DetallePendiente({ params, onVolver, isAdmin=false }) {
  const { data: session } = useSession();
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

  // Estados para datos
  const [pagosPendientes, setPagosPendientes] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [motivoExoneracion, setMotivoExoneracion] = useState("");
  const [documentosCompletos, setDocumentosCompletos] = useState(false);
  const [documentosRequeridos, setDocumentosRequeridos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


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
      requerido: (tipo_profesion)=> tipo_profesion!=="odontologo"
    },
    notas_curso: {
      nombre: "Notas del curso",
      descripcion: "Certificado de notas académicas",
      requerido: (tipo_profesion)=> tipo_profesion!=="odontologo"
    },
    fondo_negro_titulo_bachiller: {
      nombre: "Título bachiller fondo negro",
      descripcion: "Título de bachiller con fondo negro",
      requerido: (tipo_profesion)=> tipo_profesion!=="odontologo"
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
  const loadData = async () => {
    try {
      setIsLoading(true);
      // Obtener datos del pendiente desde el store
      const pendienteData = await getColegiadoPendiente(pendienteId);
      if (pendienteData) {
        const documentosFormateados = [
          {
            id: "file_ci",
            nombre: documentosMetadata.file_ci.nombre,
            descripcion: documentosMetadata.file_ci.descripcion,
            archivo: obtenerNombreArchivo(pendienteData.file_ci_url),
            requerido: documentosMetadata.file_ci.requerido,
            url: pendienteData.file_ci_url
          },
          {
            id: "file_rif",
            nombre: documentosMetadata.file_rif.nombre,
            descripcion: documentosMetadata.file_rif.descripcion,
            archivo: obtenerNombreArchivo(pendienteData.file_rif_url),
            requerido: documentosMetadata.file_rif.requerido,
            url: pendienteData.file_rif_url
          },
          {
            id: "file_fondo_negro",
            nombre: documentosMetadata.file_fondo_negro.nombre,
            descripcion: documentosMetadata.file_fondo_negro.descripcion,
            archivo: obtenerNombreArchivo(pendienteData.file_fondo_negro_url),
            requerido: documentosMetadata.file_fondo_negro.requerido,
            url: pendienteData.file_fondo_negro_url
          },
          {
            id: "file_mpps",
            nombre: documentosMetadata.file_mpps.nombre,
            descripcion: documentosMetadata.file_mpps.descripcion,
            archivo: obtenerNombreArchivo(pendienteData.file_mpps_url),
            requerido: documentosMetadata.file_mpps.requerido,
            url: pendienteData.file_mpps_url
          },
          {
            id: "Fondo_negro_credencial",
            nombre: documentosMetadata.Fondo_negro_credencial.nombre,
            descripcion: documentosMetadata.Fondo_negro_credencial.descripcion,
            archivo: obtenerNombreArchivo(pendienteData.Fondo_negro_credencial_url),
            requerido: documentosMetadata.Fondo_negro_credencial.requerido(pendienteData.tipo_profesion),
            url: pendienteData.Fondo_negro_credencial_url
          },
          {
            id: "notas_curso",
            nombre: documentosMetadata.notas_curso.nombre,
            descripcion: documentosMetadata.notas_curso.descripcion,
            archivo: obtenerNombreArchivo(pendienteData.notas_curso_url),
            requerido: documentosMetadata.notas_curso.requerido(pendienteData.tipo_profesion),
            url: pendienteData.notas_curso_url
          },
          {
            id: "fondo_negro_titulo_bachiller",
            nombre: documentosMetadata.fondo_negro_titulo_bachiller.nombre,
            descripcion: documentosMetadata.fondo_negro_titulo_bachiller.descripcion,
            archivo: obtenerNombreArchivo(pendienteData.fondo_negro_titulo_bachiller_url),
            requerido: documentosMetadata.fondo_negro_titulo_bachiller.requerido(pendienteData.tipo_profesion),
            url: pendienteData.fondo_negro_titulo_bachiller_url
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
        if (pendienteData.documentos) {

          // Verificar documentos requeridos (excluyendo los exonerados)
          const docsRequeridos = pendienteData.documentos.filter(
            (doc) =>
              doc.requerido &&
              !doc.archivo?.toLowerCase().includes("exonerado")
          );
        }
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
  }, [pendienteId,getColegiadoPendiente]);

  // Función para obtener iniciales del nombre
  const obtenerIniciales = () => {
    if (!pendiente) return "CN";

    const { nombre, primer_apellido } = pendiente.persona;
    return `${nombre.charAt(0)}${primer_apellido.charAt(0)}`;
  };
  const handleForward = () => {
    alert('tiene vida');
  }
  // Funciones para gestión de documentos
  const handleVerDocumento = (documento) => {
    setDocumentoSeleccionado(documento);
  };

  const handleCerrarVistaDocumento = () => {
    setDocumentoSeleccionado(null);
  };

  // Función para actualizar un documento
  const updateDocumento = (documentoActualizado) => {
    try {
      updateColegiadoPendiente(pendienteId, documentoActualizado, true);
      loadData()
    } catch (error) {
      console.error("Error al actualizar documento:", error);
    }
  };

  // Función para manejar aprobación
  const handleAprobarSolicitud = async () => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      // Verificar que todos los documentos requeridos estén presentes
      if (!documentosCompletos) {
        alert(
          "No se puede aprobar esta solicitud. Faltan documentos requeridos."
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

      // Llamar a la función de aprobación del store
      const colegiadoAprobado = approveRegistration(pendienteId, datosRegistro);

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

      // Guardar cambios pendientes antes de rechazar

      const nuevosDatos = {
        status: "rechazado",
        motivo_rechazo: motivoRechazo,
      };
      await updateColegiadoPendiente(pendienteId, nuevosDatos);
      setRechazoExitoso(true);
      setMostrarRechazo(false);
      onVolver({ rechazado: true });
      loadData()

      // Volver a la lista después de un tiem
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

      // Guardar cambios pendientes antes de rechazar

      const nuevosDatos = {
        status: "denegado",
        motivo_rechazo: motivoRechazo,
      };
      await updateColegiadoPendiente(pendienteId, nuevosDatos);
      setRechazoExitoso(true);
      setMostrarRechazo(false);
      onVolver({ denegado: true });
      loadData()

      // Volver a la lista después de un tiem
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
        "pago_exonerado":true,
        "motivo_exonerado":motivoExoneracion
      };


      // Actualizar en el store
      await updateColegiadoPendiente(pendienteId, nuevosDatos);
      loadData()

      // Actualizar el estado local
    //   setPendiente(nuevosDatos);
    //   setPagosPendientes(false);
    //   setDocumentosRequeridos(nuevosDatos.documentos);

      // Mostrar confirmación de exoneración
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

  const nombreCompleto = `${pendiente.persona.nombre} ${
    pendiente.persona.segundo_nombre || ""
  } ${pendiente.persona.primer_apellido} ${
    pendiente.persona.segundo_apellido || ""
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
    <div className="select-none cursor-default w-full px-4 md:px-10 py-10 md:py-28 bg-gray-50">
      {/* Breadcrumbs */}
      {
        isAdmin&&(
          <div className="mb-6">
            <button
              onClick={handleVolver}
              className="text-md text-[#590248] hover:text-[#C40180] flex items-center cursor-pointer transition-colors duration-200"
            >
              <ChevronLeft size={20} className="mr-1" />
              Volver a la lista de colegiados
            </button>
          </div>
        )
      }

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
          isAdmin
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
            updateColegiadoPendiente,
            pendienteId,
            setCambiosPendientes,
            isDenegada,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <AcademicInfoSection
          pendiente={pendiente}
          datosAcademicos={datosAcademicos}
          setDatosAcademicos={setDatosAcademicos}
          editandoAcademico={editandoAcademico}
          setEditandoAcademico={setEditandoAcademico}
          updateColegiadoPendiente={updateColegiadoPendiente}
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
          updateColegiadoPendiente={updateColegiadoPendiente}
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
      />

      <PaymentsSection
        documentosRequeridos={documentosRequeridos}
        handleVerDocumento={handleVerDocumento}
        pendiente={pendiente}
        updateDocumento={updateDocumento}
      />

      {/* Modals */}
      {mostrarConfirmacion && (
        <ApprovalModal
          nombreCompleto={nombreCompleto}
          datosRegistro={datosRegistro}
          setDatosRegistro={setDatosRegistro}
          pasoModal={pasoModal}
          setPasoModal={setPasoModal}
          handleAprobarSolicitud={handleAprobarSolicitud}
          documentosCompletos={documentosCompletos}
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

      {!isAdmin&&(
        <button
            onClick={handleForward}
            className="cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 shadow-sm font-medium"
        >
            
            <span>Reenviar Solicitud De Inscripcion</span>
        </button>
      )}
    </div>
  );
}
