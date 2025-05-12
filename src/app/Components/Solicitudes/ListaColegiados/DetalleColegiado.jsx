"use client";

import useDataListaColegiados from "@/app/Models/PanelControl/Solicitudes/ListaColegiadosData";
import { CheckCircle, ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import CrearSolicitudModal from "@/Components/Solicitudes/Solicitudes/CrearSolicitudModal";
import DetalleSolicitud from "@/Components/Solicitudes/Solicitudes/DetalleSolicitud";
import CarnetInfo from "./DetalleColegiado/CarnetInfo";
import ChatSection from "./DetalleColegiado/ChatSection";
import ColegiadoCard from "./DetalleColegiado/ColegiadoCard";
import DocumentosLista from "./DetalleColegiado/DocumentosLista";
import EstadisticasUsuario from "./DetalleColegiado/EstadisticasUsuario";
import ModalConfirmacionTitulo from "./DetalleColegiado/ModalConfirmacionTitulo";
import ModalVisualizarDocumento from "./DetalleColegiado/ModalVisualizarDocumento";
import TablaInformacionPersonal from "./DetalleColegiado/TablaInformacionPersonal";
import TablaInscripciones from "./DetalleColegiado/TablaInscripciones";
import TablaPagos from "./DetalleColegiado/TablaPagos";
import TablaSolicitudes from "./DetalleColegiado/TablaSolicitudes";
export default function DetalleColegiado({
  params,
  onVolver,
  colegiado: providedColegiado,
}) {
  // Obtenemos el ID desde los parámetros de la URL
  const colegiadoId = params?.id || "1";

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

  // Obtenemos funciones del store centralizado
  const {
    getColegiado,
    getDocumentos,
    marcarTituloEntregado,
    addSolicitud,
    getSolicitudes,
  } = useDataListaColegiados();

  // Función para ver detalle de solicitud
  const verDetalleSolicitud = (id) => {
    setSolicitudSeleccionadaId(id);
    setVistaActual("solicitudDetalle");
  };

  // Función para volver a la vista de tabs
  const volverATab = () => {
    const temporalParams = window.location.search;
    console.log({ temporalParams });
    if (!temporalParams) {
      setVistaActual("informacion");
      setSolicitudSeleccionadaId(null);
      setRefreshSolicitudes((prev) => prev + 1);
    }

    // Función para actualizar una solicitud (cuando se aprueba, rechaza, etc.)
  };
  const actualizarSolicitud = (solicitudActualizada) => {
    console.log("Solicitud actualizada:", solicitudActualizada);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const colegiadoData = await getColegiado(colegiadoId)
        setColegiado(colegiadoData)

        // Cargar documentos del colegiado
        const docs = await getDocumentos(colegiadoId)
        setDocumentos(docs || [])

        setIsLoading(false)
      } catch (error) {
        console.error("Error al cargar datos del colegiado:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [colegiadoId, providedColegiado, getColegiado, getDocumentos]);

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
    console.log(nuevaSolicitud)
    // addSolicitud(colegiadoId, nuevaSolicitud);
    // setRefreshSolicitudes((prev) => prev + 1);
    // setMostrarModalSolicitud(false);
  };

  useEffect(() => {
    if (vistaActual === "solicitudDetalle" && solicitudSeleccionadaId) {
      setIsLoading(true);
      getSolicitudes(colegiadoId)
        .then(data => {
          // Make sure it's an array
          const solicitudesArray = Array.isArray(data) ? data : [];
          setSolicitudItem(solicitudesArray);
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

  let content;

  // Si estamos viendo el detalle de una solicitud
  if (vistaActual === "solicitudDetalle" && solicitudSeleccionadaId) {
    if (isLoading) {
      content = (
        <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
        </div>
      );
    } else {
      content = (
        <DetalleSolicitud
          solicitudId={solicitudSeleccionadaId}
          onVolver={volverATab}
          solicitudes={solicitudItem}
          actualizarSolicitud={actualizarSolicitud}
          breadcrumbColegiado={colegiado?.persona?.nombre}
        />
      );
    }
  }
  // Si está cargando
  else if (isLoading) {
    content = (
      <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
      </div>
    );
  }
  // Si no se encontró el colegiado
  else if (!colegiado) {
    content = (
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
  else {
    content = (
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

        {/* Notificación de título entregado */}
        {tituloEntregado && (
          <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6 flex items-start justify-between">
            <div className="flex items-center">
              <CheckCircle size={20} className="mr-2 flex-shrink-0" />
              <span>
                Se ha registrado la entrega del título físico correctamente.
              </span>
            </div>
            <button
              onClick={() => setTituloEntregado(true)}
              className="text-green-700"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Header con información principal */}
        <ColegiadoCard
          colegiado={colegiado}
          onNuevaSolicitud={() => setMostrarModalSolicitud(true)}
          onConfirmarTitulo={() => setConfirmarTitulo(true)}
        />

        {/* Tabs y contenido */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {/* Sistema de tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto justify-center">
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                  tabActivo === "informacion"
                    ? "border-b-2 border-[#C40180] text-[#C40180]"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setTabActivo("informacion")}
              >
                Información
              </button>
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                  tabActivo === "pagos"
                    ? "border-b-2 border-[#C40180] text-[#C40180]"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setTabActivo("pagos")}
              >
                Pagos
              </button>
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                  tabActivo === "inscripciones"
                    ? "border-b-2 border-[#C40180] text-[#C40180]"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setTabActivo("inscripciones")}
              >
                Inscripciones
              </button>
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                  tabActivo === "solicitudes"
                    ? "border-b-2 border-[#C40180] text-[#C40180]"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setTabActivo("solicitudes")}
              >
                Solicitudes
              </button>
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                  tabActivo === "carnet"
                    ? "border-b-2 border-[#C40180] text-[#C40180]"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setTabActivo("carnet")}
              >
                Carnet
              </button>
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                  tabActivo === "documentos"
                    ? "border-b-2 border-[#C40180] text-[#C40180]"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setTabActivo("documentos")}
              >
                Documentos
              </button>
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                  tabActivo === "chats"
                    ? "border-b-2 border-[#C40180] text-[#C40180]"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setTabActivo("chats")}
              >
                Chats
              </button>
              <button
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                  tabActivo === "estadisticas"
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
            {tabActivo === "informacion" && <TablaInformacionPersonal colegiado={colegiado} />}
            {tabActivo === "pagos" && (
              <TablaPagos colegiadoId={colegiadoId} handleVerDocumento={handleVerDocumento} documentos={documentos || []} />
            )}
            {tabActivo === "solicitudes" && (
              <TablaSolicitudes
                colegiadoId={colegiadoId}
                forceUpdate={refreshSolicitudes}
                onVerDetalle={verDetalleSolicitud}
              />
            )}
            {tabActivo === "carnet" && <CarnetInfo colegiado={{...colegiado, persona: colegiado.recaudos.persona}} />}
            {tabActivo === "documentos" && (
              <DocumentosLista
                documentos={documentos}
                handleVerDocumento={handleVerDocumento}
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
          <ModalConfirmacionTitulo
            nombreColegiado={`${colegiado.recaudos.persona.nombre} ${colegiado.recaudos.persona.primer_apellido}`}
            onConfirm={handleConfirmarEntregaTitulo}
            onClose={() => setConfirmarTitulo(false)}
          />
        )}

        {documentoSeleccionado && (
          <ModalVisualizarDocumento
            documento={documentoSeleccionado}
            onClose={handleCerrarVistaDocumento}
          />
        )}

        {mostrarModalSolicitud && (
          <CrearSolicitudModal
            colegiadoPreseleccionado={{
              id: colegiado.id,
              nombre: `${colegiado.recaudos.persona.nombre} ${colegiado.recaudos.persona.primer_apellido}`,
              cedula: colegiado.recaudos.persona.cedula,
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

  return content;
}
