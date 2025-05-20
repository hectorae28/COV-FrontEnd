"use client";

import useDataListaColegiados from "@/store/ListaColegiadosData";
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
  const [refreshSolicitudes, setRefreshSolicitudes] = useState(0);
  const [solicitudItem, setSolicitudItem] = useState(null);
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
      await updateColegiado(colegiadoId, datosActualizados);
      loadData(); // Recargar datos
    } catch (error) {
      console.error("Error al actualizar datos:", error);
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
        // Datos personales
        setDatosPersonales({
          ...(colegiadoData.recaudos?.persona || {}),
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

        // Instituciones
        setInstituciones(colegiadoData.instituciones || []);
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
              onUpdateDocument={updateDocumento}
              onDocumentStatusChange={handleDocumentStatusChange}
              title="Documentos"
              subtitle="Documentación del colegiado"
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
    </div>
  );
}