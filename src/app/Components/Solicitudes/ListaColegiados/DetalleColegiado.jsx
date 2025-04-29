"use client"

import {
  AlertCircle,
  Eye,
  BarChart3,
  Book,
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronLeft,
  CreditCard,
  FileBox,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  PlusCircle,
  User,
  X
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import useDataListaColegiados from "@/app/Models/PanelControl/Solicitudes/ListaColegiadosData"
import NuevaSolicitudModal from "./NuevaSolicitudModal"
import TablaPagos from "./TablaPagos"
import TablaSolicitudes from "./TablaSolicitudes"
import TablaInscripciones from "./TablaInscripciones"
import EstadisticasUsuario from "./EstadisticasUsuario"

/**
 * Componente para visualizar y gestionar los detalles de un colegiado
 * Permite ver toda la información personal, profesional y trámites
 */
export default function DetalleColegiado({ params, onVolver, colegiado: providedColegiado }) {
  // Obtenemos el ID desde los parámetros de la URL
  const colegiadoId = params?.id || "1"

  // Obtenemos funciones del store centralizado
  const {
    getColegiado,
    getDocumentos,
    marcarTituloEntregado,
    addSolicitud
  } = useDataListaColegiados()

  // Estados locales
  const [colegiado, setColegiado] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tabActivo, setTabActivo] = useState("informacion")
  const [mostrarModalSolicitud, setMostrarModalSolicitud] = useState(false)
  const [tituloEntregado, setTituloEntregado] = useState(false)
  const [confirmarTitulo, setConfirmarTitulo] = useState(false)
  const [documentos, setDocumentos] = useState([])
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null)

  // Cargar datos desde el store centralizado
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // Usar el colegiado proporcionado o buscarlo en el store
        let colegiadoData = providedColegiado

        if (!colegiadoData) {
          colegiadoData = getColegiado(colegiadoId)
        }

        if (colegiadoData) {
          setColegiado(colegiadoData)

          // Cargar documentos
          const documentosData = getDocumentos(colegiadoId)
          setDocumentos(documentosData)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error al cargar datos del colegiado:", error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [colegiadoId, providedColegiado, getColegiado, getDocumentos])

  // Función para obtener iniciales del nombre
  const obtenerIniciales = () => {
    if (!colegiado) return "CN"

    const { nombre, primer_apellido } = colegiado.persona
    return `${nombre.charAt(0)}${primer_apellido.charAt(0)}`
  }

  // Función para confirmar entrega de título
  const handleConfirmarEntregaTitulo = async () => {
    try {
      // Llamar a la función del store
      marcarTituloEntregado(colegiadoId, true)

      // Actualizar estado local
      setColegiado(prev => ({
        ...prev,
        tituloEntregado: true
      }))

      setTituloEntregado(true)
      setConfirmarTitulo(false)
    } catch (error) {
      console.error("Error al confirmar entrega de título:", error)
    }
  }

  // Funciones para gestión de documentos
  const handleVerDocumento = (documento) => {
    setDocumentoSeleccionado(documento)
  }

  const handleCerrarVistaDocumento = () => {
    setDocumentoSeleccionado(null)
  }

  // Función para registrar nueva solicitud
  const handleNuevaSolicitud = (nuevaSolicitud) => {
    // Añadir la solicitud al store
    addSolicitud(colegiadoId, nuevaSolicitud)

    // Cerrar el modal
    setMostrarModalSolicitud(false)
  }

  // Función para formatear fechas
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "No especificada"
    return new Date(fechaISO).toLocaleDateString('es-ES')
  }

  if (isLoading) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
      </div>
    )
  }

  if (!colegiado) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          No se pudo encontrar la información del colegiado solicitado.
        </div>
        {onVolver ? (
          <button
            onClick={onVolver}
            className="mt-4 inline-flex items-center text-[#C40180] hover:underline cursor-pointer"
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
    )
  }

  // Para mostrar el nombre completo
  const nombreCompleto = `${colegiado.persona.nombre} ${colegiado.persona.segundo_nombre || ''} ${colegiado.persona.primer_apellido} ${colegiado.persona.segundo_apellido || ''}`.trim()

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

      {/* Notificación de título entregado */}
      {tituloEntregado && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6 flex items-start justify-between">
          <div className="flex items-center">
            <CheckCircle size={20} className="mr-2 flex-shrink-0" />
            <span>Se ha registrado la entrega del título físico correctamente.</span>
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
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col items-center md:flex-row">
          <div className="md:w-1/5 flex justify-center items-center mb-8 md:mb-0">
            {/* Iniciales en lugar de foto de perfil */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg shadow-black/40 bg-gradient-to-br from-[#C40180] to-[#7D0053] flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {obtenerIniciales()}
              </span>
            </div>
          </div>

          <div className="md:w-3/4 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{nombreCompleto}</h1>
                <p className="text-sm text-gray-500">N° COV: {colegiado.numeroRegistro}</p>
              </div>

              <div className="mt-4 md:mt-0 flex flex-wrap justify-center md:justify-end gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colegiado.solvente ? 'bg-green-100 text-green-800 font-bold' : 'bg-red-100 text-red-800'}`}
                >
                  {colegiado.solvente ? 'Solvente' : 'Insolvente'}
                </span>

                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colegiado.carnetVigente ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {colegiado.carnetVigente ? 'Carnet vigente' : 'Carnet vencido'}
                </span>
              </div>
            </div>

            {/* Grid de información de contacto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Columna izquierda */}
              <div>
                <div className="flex items-center justify-center md:justify-start">
                  <User className="text-gray-400 h-5 w-5 mr-2" />
                  <span className="text-gray-700">
                    {colegiado.persona.nacionalidad}-{colegiado.persona.identificacion}
                  </span>
                </div>

                <div className="flex items-center justify-center md:justify-start mt-4">
                  <Mail className="text-gray-400 h-5 w-5 mr-2" />
                  <span className="text-gray-700">{colegiado.persona.correo}</span>
                </div>

                <div className="flex items-center justify-center md:justify-start mt-4">
                  <Phone className="text-gray-400 h-5 w-5 mr-2" />
                  <span className="text-gray-700">{colegiado.persona.telefono_movil}</span>
                </div>
              </div>

              {/* Columna derecha */}
              <div>
                <div className="flex items-start justify-center md:justify-start mt-4">
                  <MapPin className="text-gray-400 h-5 w-5 mr-2 mt-0.5" />
                  <span className="text-gray-700">
                    {colegiado.persona.direccion.referencia}, {colegiado.persona.direccion.estado}
                  </span>
                </div>

                <div className="flex items-center justify-center md:justify-start mt-4">
                  <Calendar className="text-gray-400 h-5 w-5 mr-2" />
                  <span className="text-gray-700">Registrado: {formatearFecha(colegiado.fecha_registro_principal)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                onClick={() => setMostrarModalSolicitud(true)}
                className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <PlusCircle size={18} />
                <span>Nueva solicitud</span>
              </button>

              {!colegiado.tituloEntregado && (
                <button
                  onClick={() => setConfirmarTitulo(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                >
                  <CheckCircle size={18} />
                  <span>Confirmar entrega de título</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto justify-center">
            <button
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "informacion"
                ? 'border-b-2 border-[#C40180] text-[#C40180]'
                : 'text-gray-500 hover:text-gray-700'
                } transition-colors`}
              onClick={() => setTabActivo("informacion")}
            >
              <User size={16} className="inline-block mr-2" />
              Información
            </button>

            <button
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "pagos"
                ? 'border-b-2 border-[#C40180] text-[#C40180]'
                : 'text-gray-500 hover:text-gray-700'
                } transition-colors`}
              onClick={() => setTabActivo("pagos")}
            >
              <CreditCard size={16} className="inline-block mr-2" />
              Pagos
            </button>

            <button
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "inscripciones"
                ? 'border-b-2 border-[#C40180] text-[#C40180]'
                : 'text-gray-500 hover:text-gray-700'
                } transition-colors`}
              onClick={() => setTabActivo("inscripciones")}
            >
              <Book size={16} className="inline-block mr-2" />
              Inscripciones
            </button>

            <button
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "solicitudes"
                ? 'border-b-2 border-[#C40180] text-[#C40180]'
                : 'text-gray-500 hover:text-gray-700'
                } transition-colors`}
              onClick={() => setTabActivo("solicitudes")}
            >
              <FileText size={16} className="inline-block mr-2" />
              Solicitudes
            </button>

            <button
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "carnet"
                ? 'border-b-2 border-[#C40180] text-[#C40180]'
                : 'text-gray-500 hover:text-gray-700'
                } transition-colors`}
              onClick={() => setTabActivo("carnet")}
            >
              <CreditCard size={16} className="inline-block mr-2" />
              Carnet
            </button>

            <button
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "documentos"
                ? 'border-b-2 border-[#C40180] text-[#C40180]'
                : 'text-gray-500 hover:text-gray-700'
                } transition-colors`}
              onClick={() => setTabActivo("documentos")}
            >
              <FileBox size={16} className="inline-block mr-2" />
              Documentos
            </button>

            <button
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "chats"
                ? 'border-b-2 border-[#C40180] text-[#C40180]'
                : 'text-gray-500 hover:text-gray-700'
                } transition-colors`}
              onClick={() => setTabActivo("chats")}
            >
              <MessageSquare size={16} className="inline-block mr-2" />
              Chats
            </button>

            <button
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${tabActivo === "estadisticas"
                ? 'border-b-2 border-[#C40180] text-[#C40180]'
                : 'text-gray-500 hover:text-gray-700'
                } transition-colors`}
              onClick={() => setTabActivo("estadisticas")}
            >
              <BarChart3 size={16} className="inline-block mr-2" />
              Estadísticas
            </button>
          </nav>
        </div>

        {/* Contenido según el tab activo */}
        <div className="p-6">
        {tabActivo === "informacion" && (
  <div className="space-y-6">
    {/* Estado de solvencia */}
    <div className="mt-8">
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Estado de solvencia</p>
            <p className={`font-bold text-xl ${colegiado.solvente ? 'text-green-600' : 'text-red-600'} flex items-center justify-center`}>
              {colegiado.solvente ? (
                <>
                  <CheckCircle size={20} className="mr-2" />
                  Solvente
                </>
              ) : (
                <>
                  <AlertCircle size={20} className="mr-2" />
                  Insolvente
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
    
    {/* Información personal */}
    <div>
      <div className="flex items-center mb-5 border-b pb-3">
        <User size={20} className="text-[#C40180] mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Información personal</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Nombre completo</p>
            <p className="font-medium text-gray-800">{nombreCompleto}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Cédula</p>
            <p className="font-medium text-gray-800">{colegiado.persona.nacionalidad}-{colegiado.persona.identificacion}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de nacimiento</p>
            <p className="font-medium text-gray-800">{formatearFecha(colegiado.persona.fecha_nacimiento)}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Correo electrónico</p>
            <p className="font-medium text-gray-800">{colegiado.persona.correo}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Teléfono</p>
            <p className="font-medium text-gray-800">{colegiado.persona.telefono_movil}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Dirección</p>
            <p className="font-medium text-gray-800">{colegiado.persona.direccion.referencia}, {colegiado.persona.direccion.estado}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Título entregado en oficina</p>
            <p className={`font-medium flex items-center ${colegiado.tituloEntregado ? 'text-green-600' : 'text-yellow-600'}`}>
              {colegiado.tituloEntregado ? (
                <>
                  <CheckCircle size={16} className="mr-1" />
                  Sí, entregado
                </>
              ) : (
                <>
                  <AlertCircle size={16} className="mr-1" />
                  No entregado
                </>
              )}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de registro</p>
            <p className="font-medium text-gray-800">{formatearFecha(colegiado.fecha_registro_principal)}</p>
          </div>
        </div>
      </div>
    </div>
    
    {/* Información académica */}
    <div className="mt-8">
      <div className="flex items-center mb-5 border-b pb-3">
        <Book size={20} className="text-[#C40180] mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Información académica</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Universidad</p>
          <p className="font-medium text-gray-800">{colegiado.universidad || "No especificada"}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Especialidad</p>
          <p className="font-medium text-gray-800">{colegiado.especialidad || "No especificada"}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Año de graduación</p>
          <p className="font-medium text-gray-800">{colegiado.anio_graduacion || "No especificado"}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha MPPS</p>
          <p className="font-medium text-gray-800">{formatearFecha(colegiado.fecha_mpps)}</p>
        </div>
      </div>
    </div>
    
    {/* Información profesional */}
    <div className="mt-8">
      <div className="flex items-center mb-5 border-b pb-3">
        <Briefcase size={20} className="text-[#C40180] mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Información profesional</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número de registro</p>
          <p className="font-medium text-gray-800">{colegiado.numeroRegistro}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Años de experiencia</p>
          <p className="font-medium text-gray-800">{colegiado.anios_experiencia || "No especificado"}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Estado del carnet</p>
          <p className={`font-medium flex items-center ${colegiado.carnetVigente ? 'text-green-600' : 'text-yellow-600'}`}>
            {colegiado.carnetVigente ? (
              <>
                <CheckCircle size={16} className="mr-1" />
                Vigente hasta {colegiado.carnetVencimiento}
              </>
            ) : (
              <>
                <AlertCircle size={16} className="mr-1" />
                Vencido desde {colegiado.carnetVencimiento}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
    
    {/* Instituciones donde trabaja */}
    <div className="mt-8">
      <div className="flex items-center mb-5 border-b pb-3">
        <Briefcase size={20} className="text-[#C40180] mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Instituciones donde trabaja</h2>
      </div>
      {colegiado.instituciones && colegiado.instituciones.length > 0 ? (
        <div className="space-y-6">
          {colegiado.instituciones.map((institucion, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md mb-4 last:mb-0">
              <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center">
                <Briefcase size={16} className="mr-2 text-[#C40180]" />
                {institucion.nombre}
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Cargo</p>
                  <p className="font-medium text-gray-800">{institucion.cargo || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Teléfono</p>
                  <p className="font-medium text-gray-800">{institucion.telefono || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Dirección</p>
                  <p className="font-medium text-gray-800">{institucion.direccion || "No especificada"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md text-gray-500 italic flex items-center justify-center h-32">
          <div className="text-center">
            <Briefcase size={24} className="mx-auto mb-2 text-gray-400" />
            No hay instituciones registradas
          </div>
        </div>
      )}
    </div>
  </div>
)}

          {/* Contenido de la pestaña de pagos */}
          {tabActivo === "pagos" && (
            <TablaPagos
              colegiadoId={colegiadoId}
            />
          )}

          {/* Contenido de la pestaña de inscripciones */}
          {tabActivo === "inscripciones" && (
            <TablaInscripciones
              colegiadoId={colegiadoId}
            />
          )}

          {/* Contenido de la pestaña de solicitudes */}
          {tabActivo === "solicitudes" && (
            <TablaSolicitudes
              colegiadoId={colegiadoId}
            />
          )}

          {/* Contenido de la pestaña de carnet */}
          {tabActivo === "carnet" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Carnet de colegiado</h3>
                <p className="text-sm text-gray-500 mt-1">Información sobre el carnet del colegiado</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Vista previa del carnet */}
                  <div className="md:w-1/2 flex justify-center">
                    <div className="w-full max-w-md bg-gradient-to-r from-[#C40180] to-[#590248] rounded-xl shadow-lg overflow-hidden">
                      <div className="p-6 text-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xl font-bold">Colegio de Odontólogos</h4>
                            <p className="text-sm opacity-80">de Venezuela</p>
                          </div>
                          <div className="bg-white/20 p-2 rounded-lg">
                            <span className="text-sm font-semibold">N° {colegiado.numeroRegistro}</span>
                          </div>
                        </div>

                        <div className="flex mt-8 items-center gap-4">
                          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center text-[#C40180] text-2xl font-bold">
                            {obtenerIniciales()}
                          </div>
                          <div>
                            <h5 className="font-bold text-lg">{nombreCompleto}</h5>
                            <p className="text-white/80 text-sm">{colegiado.persona.nacionalidad}-{colegiado.persona.identificacion}</p>
                            <p className="text-white/80 text-sm">{colegiado.especialidad}</p>
                          </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-white/20 text-sm flex justify-between">
                          <div>
                            <p className="opacity-70">Válido hasta:</p>
                            <p className="font-semibold">{colegiado.carnetVencimiento}</p>
                          </div>
                          <div className="text-right">
                            <p className="opacity-70">Emitido:</p>
                            <p className="font-semibold">{formatearFecha(colegiado.fechaRegistro)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información del carnet */}
                  <div className="md:w-1/2">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">Estado del carnet</h4>
                        <div className="mt-4">
                          {colegiado.carnetVigente ? (
                            <div className="bg-green-100 text-green-800 p-4 rounded-md flex items-center">
                              <CheckCircle className="mr-2" size={20} />
                              <div>
                                <p className="font-medium">Carnet vigente</p>
                                <p className="text-sm">El carnet está activo y es válido hasta {colegiado.carnetVencimiento}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md flex items-center">
                              <AlertCircle className="mr-2" size={20} />
                              <div>
                                <p className="font-medium">Carnet vencido</p>
                                <p className="text-sm">El carnet venció el {colegiado.carnetVencimiento} y debe ser renovado</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número de registro</p>
                          <p className="font-medium text-gray-800">{colegiado.numeroRegistro}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de emisión</p>
                          <p className="font-medium text-gray-800">{formatearFecha(colegiado.fechaRegistro)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de vencimiento</p>
                          <p className="font-medium text-gray-800">{colegiado.carnetVencimiento}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Especialidad</p>
                          <p className="font-medium text-gray-800">{colegiado.especialidad}</p>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
                          <CreditCard size={16} />
                          <span>{colegiado.carnetVigente ? 'Descargar carnet' : 'Renovar carnet'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contenido de la pestaña de documentos */}
          {tabActivo === "documentos" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Documentos</h3>
                  <p className="text-sm text-gray-500 mt-1">Documentación del colegiado</p>
                </div>
                <button className="bg-[#C40180] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
                  <PlusCircle size={16} />
                  <span>Agregar documento</span>
                </button>
              </div>

              {documentos && documentos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documentos.map((documento) => (
                    <div
                      key={documento.id}
                      className="border rounded-lg border-gray-200 hover:border-[#C40180] hover:shadow-md transition-all duration-200"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="bg-[#F9E6F3] p-2 rounded-md mr-3">
                                <FileText
                                  className="text-[#C40180]"
                                  size={20}
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 flex items-center">
                                  {documento.nombre}
                                  {documento.requerido && <span className="text-red-500 ml-1">*</span>}
                                </h3>
                                <p className="text-xs text-gray-500">{documento.descripcion}</p>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleVerDocumento(documento)}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                            title="Ver documento"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center">
                  <FileText size={40} className="text-gray-300 mb-3" />
                  <p className="text-gray-500 text-center">No hay documentos disponibles</p>
                </div>
              )}
            </div>
          )}

          {/* Contenido de la pestaña de chats */}
          {tabActivo === "chats" && (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
              <MessageSquare size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500">Sistema de chat</h3>
              <p className="text-gray-400 mt-1">La funcionalidad de chat está en desarrollo</p>
            </div>
          )}

          {/* Contenido de la pestaña de estadísticas */}
          {tabActivo === "estadisticas" && (
            <EstadisticasUsuario colegiado={colegiado} />
          )}
        </div>
      </div>

      {/* Modal de confirmación para título */}
      {confirmarTitulo && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4 text-green-600">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
                Confirmar entrega de título
              </h3>
              <p className="text-center text-gray-600 mb-6">
                ¿Está seguro que desea registrar que <span className="font-medium">{nombreCompleto}</span> ha entregado su título físico en la oficina del COV?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirmarTitulo(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarEntregaTitulo}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirmar entrega
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver documento */}
      {documentoSeleccionado && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center">
                <FileText className="text-[#C40180] mr-2" size={20} />
                <h3 className="text-lg font-medium text-gray-900">
                  {documentoSeleccionado.nombre}
                </h3>
              </div>
              <button
                onClick={handleCerrarVistaDocumento}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100">
              {/* Aquí se mostraría el documento. En este caso usamos un placeholder */}
              <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-200 rounded-lg">
                <div className="text-center p-6">
                  <FileText size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 font-medium">Vista previa no disponible para {documentoSeleccionado.nombre}</p>
                  <p className="text-sm text-gray-400 mt-2">Archivo: {documentoSeleccionado.archivo}</p>
                  <button className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm font-medium flex items-center justify-center gap-2 mx-auto">
                    <FileText size={16} />
                    Descargar documento
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de nueva solicitud */}
      {mostrarModalSolicitud && (
        <NuevaSolicitudModal
          colegiado={colegiado}
          onClose={() => setMostrarModalSolicitud(false)}
          onSolicitudCreada={handleNuevaSolicitud}
        />
      )}
    </div>
  )
}