"use client";

import useDataListaColegiados from "@/store/ListaColegiadosData";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Componentes compartidos
import AcademicInfoSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/AcademicInfoSection";
import ContactInfoSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/ContactInfoSection";
import InstitutionsSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/InstitutionsSection";
import PersonalInfoSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/PersonalInfoSection";
import ProfessionalInfoSection from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/ProfessionalInfoSection";

// Componentes existentes
import CarnetInfo from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/CarnetInfo";
import ChatSection from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/ChatSection";
import EstadisticasUsuario from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/EstadisticasUsuario";
import TablaInscripciones from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/TablaInscripciones";
import TablaPagos from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/TablaPagos";
import TablaSolicitudes from "@/Components/Solicitudes/ListaColegiados/DetalleColegiados/TablaSolicitudes";
import { DocumentSection, DocumentViewer } from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/DocumentModule";
import { TitleConfirmationModal } from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/ModalSystem";
import UserProfileCard from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/UserProfileCard";
import CrearSolicitudModal from "@/Components/Solicitudes/Solicitudes/CrearSolicitudModal";
import DetalleSolicitud from "@/Components/Solicitudes/Solicitudes/DetalleSolicitud";

// Importar componente de formulario de registro para documentos
import DocsRequirements from "@/app/(Registro)/DocsRequirements";

export default function DetalleColegiado({
  params,
  onVolver,
  colegiado: providedColegiado,
}) {
  // Obtenemos el ID desde los parámetros de la URL
  const colegiadoId = params?.id || "1";

  // Estado actual y vistas
  const [vistaActual, setVistaActual] = useState("informacion");
  const [solicitudSeleccionadaId, setSolicitudSeleccionadaId] = useState(null);
  const [colegiado, setColegiado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tabActivo, setTabActivo] = useState("informacion");
  const [mostrarModalSolicitud, setMostrarModalSolicitud] = useState(false);
  const [tituloEntregado, setTituloEntregado] = useState(false);
  const [confirmarTitulo, setConfirmarTitulo] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
  const [documentoParaEditar, setDocumentoParaEditar] = useState(null);
  const [refreshSolicitudes, setRefreshSolicitudes] = useState(0);
  const [solicitudItem, setSolicitudItem] = useState(null);
  const [cambiosPendientes, setCambiosPendientes] = useState(false);
  const [editandoProfesional, setEditandoProfesional] = useState(false);

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
  const [datosProfesionales, setDatosProfesionales] = useState(null);
  const [instituciones, setInstituciones] = useState([]);
  const [nuevaInstitucion, setNuevaInstitucion] = useState({
    nombre: "",
    cargo: "",
    telefono: "",
    direccion: "",
    tipo_institucion: ""
  });
  const [agregarInstitucion, setAgregarInstitucion] = useState(false);

  // Estado para manejar la edición de documentos usando el formulario de registro
  const [editandoDocumentos, setEditandoDocumentos] = useState(false);
  const [docsFormData, setDocsFormData] = useState({});
  const [docsValidationErrors, setDocsValidationErrors] = useState({});

  // Obtenemos funciones del store centralizado
  const {
    getColegiado,
    getDocumentos,
    marcarTituloEntregado,
    addSolicitud,
    getSolicitudes,
    updateColegiado
  } = useDataListaColegiados();

  // Función para ver detalle de solicitud
  const verDetalleSolicitud = (id) => {
    setSolicitudSeleccionadaId(id);
    setVistaActual("solicitudDetalle");
  };

  // Función para volver a la vista de tabs
  const volverATab = () => {
    const temporalParams = window.location.search;
    if (!temporalParams) {
      setVistaActual("informacion");
      setSolicitudSeleccionadaId(null);
      setRefreshSolicitudes((prev) => prev + 1);
    }
  };

  // Función para actualizar datos del colegiado
  const updateColegiadoData = async (colegiadoId, datosActualizados) => {
    try {
      // Para asegurar que no se modifican objetos originales
      const dataToSend = JSON.parse(JSON.stringify(datosActualizados));

      // Actualizar estados locales primero para feedback inmediato
      if (dataToSend.persona) {
        setDatosPersonales(prev => ({
          ...prev,
          ...dataToSend.persona
        }));
      }

      if (dataToSend.email || dataToSend.phoneNumber || dataToSend.address) {
        setDatosContacto(prev => ({
          ...prev,
          ...dataToSend
        }));
      }

      if (dataToSend.instituto_bachillerato || dataToSend.universidad ||
        dataToSend.num_registro_principal || dataToSend.fecha_registro_principal ||
        dataToSend.num_mpps || dataToSend.fecha_mpps ||
        dataToSend.fecha_egreso_universidad || dataToSend.observaciones) {
        setDatosAcademicos(prev => ({
          ...prev,
          ...dataToSend
        }));
      }

      if (dataToSend.instituciones) {
        setInstituciones(dataToSend.instituciones);
      }

      if (dataToSend.numeroRegistro || dataToSend.especialidad ||
        dataToSend.anios_experiencia || dataToSend.carnetVigente ||
        dataToSend.carnetVencimiento) {
        setDatosProfesionales(prev => ({
          ...prev,
          ...dataToSend
        }));
      }

      // Luego, enviar al backend
      await updateColegiado(colegiadoId, dataToSend);

      // Opcionalmente recargar datos completos
      // await loadData();

      // Indicar que los cambios están guardados
      setCambiosPendientes(false);
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      // Mantener la bandera de cambios pendientes
      setCambiosPendientes(true);
    }
  };

  // Función para manejar el estado de documentos
  const handleDocumentStatusChange = (updatedDocument) => {
    const docsCopy = [...documentos];
    const index = docsCopy.findIndex(doc => doc.id === updatedDocument.id);
    if (index !== -1) {
      docsCopy[index] = {
        ...docsCopy[index],
        status: updatedDocument.status,
        rejectionReason: updatedDocument.rejectionReason || ''
      };
      setDocumentos(docsCopy);
    }

    const updateData = {
      [`${updatedDocument.id}_status`]: updatedDocument.status
    };
    if (updatedDocument.rejectionReason) {
      updateData[`${updatedDocument.id}_rejection_reason`] = updatedDocument.rejectionReason;
    }

    updateColegiado(colegiadoId, updateData);
  };

  // Función para actualizar un documento
  const updateDocumento = async (formData) => {
    try {
      setIsLoading(true);
      // Implementar lógica de actualización
      await new Promise(resolve => setTimeout(resolve, 1000));
      await loadData();
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error al actualizar documento:", error);
      setIsLoading(false);
      throw error;
    }
  };

  // Cargar datos del colegiado
  const loadData = async () => {
    try {
      setIsLoading(true);
      const colegiadoData = await getColegiado(colegiadoId);
      setColegiado(colegiadoData);

      if (colegiadoData) {
        // Datos personales - crear copia profunda para evitar referencias
        setDatosPersonales({
          ...(JSON.parse(JSON.stringify(colegiadoData.recaudos?.persona || {}))),
        });

        // Datos de contacto
        const persona = colegiadoData.recaudos?.persona || {};
        setDatosContacto({
          email: persona.correo || "",
          phoneNumber: persona.telefono_movil?.split(" ")[1] || "",
          countryCode: persona.telefono_movil?.split(" ")[0] || "+58",
          homePhone: persona.telefono_de_habitacion || "",
          address: persona.direccion?.referencia || "",
          city: persona.direccion?.ciudad || "",
          state: persona.direccion?.estado || ""
        });

        // Datos académicos
        setDatosAcademicos({
          universidad: colegiadoData.universidad || colegiadoData.recaudos?.universidad || "",
          fecha_egreso_universidad: colegiadoData.fecha_egreso_universidad || "",
          num_registro_principal: colegiadoData.num_registro_principal || "",
          fecha_registro_principal: colegiadoData.fecha_registro_principal || "",
          num_mpps: colegiadoData.num_mpps || "",
          fecha_mpps: colegiadoData.fecha_mpps || "",
          observaciones: colegiadoData.observaciones || ""
        });

        // Datos profesionales
        setDatosProfesionales({
          numeroRegistro: colegiadoData.numeroRegistro || "",
          especialidad: colegiadoData.especialidad || "",
          anios_experiencia: colegiadoData.anios_experiencia || "",
          carnetVigente: colegiadoData.carnetVigente || false,
          carnetVencimiento: colegiadoData.carnetVencimiento || ""
        });

        // Instituciones - crear copia profunda
        setInstituciones(JSON.parse(JSON.stringify(colegiadoData.instituciones || [])));
      }

      // Cargar documentos del colegiado
      const docs = await getDocumentos(colegiadoId);
      setDocumentos(docs || []);

      setIsLoading(false);
    } catch (error) {
      console.error("Error al cargar datos del colegiado:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [colegiadoId]);

  // Función para confirmar entrega de título
  const handleConfirmarEntregaTitulo = async () => {
    try {
      await marcarTituloEntregado(colegiadoId, true);
      setColegiado((prev) => ({
        ...prev,
        titulo: true,
      }));
      setTituloEntregado(true);
      setConfirmarTitulo(false);
    } catch (error) {
      console.error("Error al confirmar entrega de título:", error);
    }
  };

  // Funciones para gestión de documentos
  const handleVerDocumento = (documento) => {
    setDocumentoSeleccionado(documento);
  };

  const handleCerrarVistaDocumento = () => {
    setDocumentoSeleccionado(null);
  };

  // Nuevo manejador para editar documento
  const handleEditarDocumento = (documento) => {
    setDocumentoParaEditar(documento);
  };

  // Función para registrar nueva solicitud
  const handleNuevaSolicitud = (nuevaSolicitud) => {
    console.log(nuevaSolicitud);
  };

  useEffect(() => {
    if (vistaActual === "solicitudDetalle" && solicitudSeleccionadaId) {
      setIsLoading(true);
      getSolicitudes(colegiadoId)
        .then(data => {
          const solicitudesArray = Array.isArray(data) ? data : [];
          const solicitudesValidas = solicitudesArray.filter(item => item && typeof item === 'object');
          setSolicitudItem(solicitudesValidas);
        })
        .catch(error => {
          console.error("Error fetching solicitudes:", error);
          setSolicitudItem([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [vistaActual, solicitudSeleccionadaId, colegiadoId]);

  // Función para editar documentos
  const handleEditarDocumentos = () => {
    // Preparar la data para el formulario de documentos
    const formDataDocs = {
      tipo_profesion: colegiado?.tipo_profesion || 'odontologo',
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
    if (colegiado.tipo_profesion === "tecnico" || colegiado.tipo_profesion === "higienista") {
      requiredDocs.push('fondo_negro_titulo_bachiller', 'fondo_negro_credencial', 'notas_curso');
    }

    // Crear objeto para la validación
    const validationErrors = {};
    let hasExistingDocs = false;

    // Verificar si ya hay documentos existentes
    documentos.forEach(doc => {
      if (doc.url) {
        hasExistingDocs = true;
      }
    });

    // Si hay documentos existentes, no es necesario validar estrictamente
    if (!hasExistingDocs) {
      // Validar campos requeridos
      requiredDocs.forEach(field => {
        if (!docsFormData[field]) {
          validationErrors[field] = true;
        }
      });

      if (Object.keys(validationErrors).length > 0) {
        setDocsValidationErrors(validationErrors);
        return;
      }
    }

    // Aquí solo guardamos localmente, no enviamos al servidor todavía
    setCambiosPendientes(true);
    
    // Cerrar el modal de edición
    setEditandoDocumentos(false);
  };

  // Renderizados condicionales para diferentes vistas
  if (vistaActual === "solicitudDetalle" && solicitudSeleccionadaId) {
    if (isLoading) {
      return (
        <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
        </div>
      );
    } else {
      return (
        <DetalleSolicitud
          solicitudId={solicitudSeleccionadaId}
          onVolver={volverATab}
          solicitudes={solicitudItem}
          actualizarSolicitud={() => { }}
          breadcrumbColegiado={colegiado?.persona?.nombre}
        />
      );
    }
  } else if (isLoading) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
      </div>
    );
  } else if (!colegiado) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          No se pudo encontrar la información del colegiado solicitado.
        </div>
        {onVolver ? (
          <button
            onClick={onVolver}
            className="cursor-pointer mt-4 inline-flex items-center text-[#C40180] hover:underline"
          >
            <ChevronLeft size={20} className="mr-1" />
            Volver a la lista de colegiados
          </button>
        ) : (
          <Link
            href="/colegiados"
            className="mt-4 inline-flex items-center text-[#C40180] hover:underline"
          >
            <ChevronLeft size={20} className="mr-1" />
            Volver a la lista de colegiados
          </Link>
        )}
      </div>
    );
  }

  // Vista principal
  return (
    <div className="w-full px-4 md:px-10 py-10 md:py-28">
      {/* Breadcrumbs */}
      <div className="mb-6">
        {onVolver ? (
          <button
            onClick={onVolver}
            className="text-md text-[#7D0053] hover:text-[#C40180] flex items-center cursor-pointer transition-colors duration-200"
          >
            <ChevronLeft size={20} className="mr-1" />
            Volver a la lista de colegiados
          </button>
        ) : (
          <Link
            href="/colegiados"
            className="text-md text-[#7D0053] hover:text-[#C40180] flex items-center"
          >
            <ChevronLeft size={20} className="mr-1" />
            Volver a la lista de colegiados
          </Link>
        )}
      </div>

      {/* Notificación de cambios pendientes */}
      {cambiosPendientes && (
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

      {/* Notificación de título entregado */}
      {tituloEntregado && (
        <div className="bg-green-100 text-green-800 p-4 mb-6 rounded-md flex items-start justify-between">
          <div className="flex items-center">
            <CheckCircle size={20} className="mr-2 flex-shrink-0" />
            <span>
              Se ha registrado la entrega del título físico correctamente.
            </span>
          </div>
          <button
            onClick={() => setTituloEntregado(false)}
            className="text-green-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Header con información principal */}
      <UserProfileCard
        data={colegiado}
        variant="registered"
        onNuevaSolicitud={() => setMostrarModalSolicitud(true)}
        onConfirmarTitulo={() => setConfirmarTitulo(true)}
        isAdmin={true}
      />

      {/* Estado de solvencia */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-100">
        <div className="flex justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Estado de solvencia</p>
            <p className={`font-bold text-xl ${colegiado.solvencia_status ? 'text-green-600' : 'text-red-600'} flex items-center justify-center`}>
              {colegiado.solvencia_status ? (
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

      {/* Tabs y contenido */}
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
              {/* Usando componentes compartidos */}
              <PersonalInfoSection
                props={{
                  pendiente: colegiado,
                  datosPersonales,
                  setDatosPersonales,
                  updateData: updateColegiadoData,
                  pendienteId: colegiadoId,
                  setCambiosPendientes,
                  isAdmin: true,
                  readOnly: false
                }}
              />

              {/* Sección de información de contacto */}
              <ContactInfoSection
                pendiente={colegiado}
                datosContacto={datosContacto}
                setDatosContacto={setDatosContacto}
                updateData={updateColegiadoData}
                pendienteId={colegiadoId}
                setCambiosPendientes={setCambiosPendientes}
                isAdmin={true}
                readOnly={false}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <AcademicInfoSection
                  pendiente={colegiado}
                  datosAcademicos={datosAcademicos}
                  setDatosAcademicos={setDatosAcademicos}
                  updateColegiadoPendiente={updateColegiadoData}
                  pendienteId={colegiadoId}
                  setCambiosPendientes={setCambiosPendientes}
                />

                <ProfessionalInfoSection
                  colegiado={colegiado}
                  datosProfesionales={datosProfesionales}
                  setDatosProfesionales={setDatosProfesionales}
                  editandoProfesional={editandoProfesional}
                  setEditandoProfesional={setEditandoProfesional}
                  updateColegiadoData={updateColegiadoData}
                  colegiadoId={colegiadoId}
                  setCambiosPendientes={setCambiosPendientes}
                />
              </div>

              <InstitutionsSection
                pendiente={colegiado}
                instituciones={instituciones}
                setInstituciones={setInstituciones}
                nuevaInstitucion={nuevaInstitucion}
                setNuevaInstitucion={setNuevaInstitucion}
                agregarInstitucion={agregarInstitucion}
                setAgregarInstitucion={setAgregarInstitucion}
                updateColegiadoPendiente={updateColegiadoData}
                pendienteId={colegiadoId}
                setCambiosPendientes={setCambiosPendientes}
              />
            </>
          )}

          {tabActivo === "pagos" && (
            <TablaPagos colegiadoId={colegiadoId} handleVerDocumento={handleVerDocumento} documentos={documentos || []} />
          )}

          {tabActivo === "inscripciones" && (
            <TablaInscripciones colegiadoId={colegiadoId} />
          )}

          {tabActivo === "solicitudes" && (
            <TablaSolicitudes
              colegiadoId={colegiadoId}
              forceUpdate={refreshSolicitudes}
              onVerDetalle={verDetalleSolicitud}
            />
          )}

          {tabActivo === "carnet" && <CarnetInfo colegiado={{ ...colegiado, persona: colegiado.recaudos.persona }} />}

          {tabActivo === "documentos" && (
            <DocumentSection
              documentos={documentos}
              onViewDocument={handleVerDocumento}
              updateDocumento={updateDocumento}
              onDocumentStatusChange={handleDocumentStatusChange}
              title="Documentos"
              subtitle="Documentación del colegiado"
              onEditSection={handleEditarDocumentos}
            />
          )}

          {tabActivo === "chats" && <ChatSection colegiado={colegiado} />}

          {tabActivo === "estadisticas" && (
            <EstadisticasUsuario colegiado={colegiado} />
          )}
        </div>
      </div>

      {/* Modales */}
      {confirmarTitulo && (
        <TitleConfirmationModal
          nombreColegiado={`${colegiado.recaudos?.persona?.nombre || ''} ${colegiado.recaudos?.persona?.primer_apellido || ''}`}
          onConfirm={handleConfirmarEntregaTitulo}
          onClose={() => setConfirmarTitulo(false)}
        />
      )}

      {documentoSeleccionado && (
        <DocumentViewer
          documento={documentoSeleccionado}
          onClose={handleCerrarVistaDocumento}
        />
      )}

      {mostrarModalSolicitud && (
        <CrearSolicitudModal
          colegiadoPreseleccionado={{
            id: colegiado.id,
            nombre: `${colegiado.recaudos?.persona?.nombre || ''} ${colegiado.recaudos?.persona?.primer_apellido || ''}`,
            cedula: colegiado.recaudos?.persona?.cedula || colegiado.recaudos?.persona?.identificacion,
            numeroRegistro: colegiado.numeroRegistro,
          }}
          onClose={() => setMostrarModalSolicitud(false)}
          onSolicitudCreada={handleNuevaSolicitud}
          onVerDetalle={verDetalleSolicitud}
          session={{
            user: {
              name: "Administrador",
              email: "admin@ejemplo.com",
              role: "admin",
              isAdmin: true,
            },
          }}
        />
      )}

      {/* Modal para editar documentos */}
      {editandoDocumentos && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Editar documentos
                </h3>
              </div>
              <button
                onClick={() => setEditandoDocumentos(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <DocsRequirements
                formData={docsFormData}
                onInputChange={handleDocsInputChange}
                validationErrors={docsValidationErrors}
                attemptedNext={Object.keys(docsValidationErrors).length > 0}
                isEditMode={true}
              />

              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button
                  onClick={() => setEditandoDocumentos(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveDocsChanges}
                  className="px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-md hover:opacity-90 transition-colors"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}