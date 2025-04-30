"use client"

import useDataListaColegiados from "@/app/Models/PanelControl/Solicitudes/ListaColegiadosData"
import SessionInfo from "@/Components/SessionInfo"
import { motion } from "framer-motion"
import {
  AlertCircle,
  Award,
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  Download,
  Eye,
  FileText,
  Mail,
  Phone,
  Upload,
  User,
  X,
  XCircle
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function DetallePendiente({ params, onVolver }) {

  const { data: session } = useSession();
  const pendienteId = params?.id || "p1"

  // Obtenemos funciones del store centralizado
  const {
    getColegiadoPendiente,
    updateColegiadoPendiente,
    approveRegistration,
    initSession
  } = useDataListaColegiados()

  // Estados locales
  const [pendiente, setPendiente] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [mostrarRechazo, setMostrarRechazo] = useState(false)
  const [motivoRechazo, setMotivoRechazo] = useState("")
  const [confirmacionExitosa, setConfirmacionExitosa] = useState(false)
  const [rechazoExitoso, setRechazoExitoso] = useState(false)
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null)
  const [documentosCompletos, setDocumentosCompletos] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [documentosRequeridos, setDocumentosRequeridos] = useState([])

  // Estados para datos de registro
  const [datosRegistro, setDatosRegistro] = useState({
    libro: "",
    pagina: "",
    tipo_profesion: "",
    num_cov: ""
  })
  const [pasoModal, setPasoModal] = useState(1)

  useEffect(() => {
    if (session) {
      initSession(session);
    }
  }, [session, initSession]);

  // Cargar datos del pendiente
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // Obtener datos del pendiente desde el store
        const pendienteData = getColegiadoPendiente(pendienteId)

        if (pendienteData) {
          setPendiente(pendienteData)

          // Verificar si los documentos están completos
          if (pendienteData.documentos) {
            setDocumentosRequeridos(pendienteData.documentos)
            setDocumentosCompletos(verificarDocumentosCompletos(pendienteData.documentos))
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error al cargar datos del pendiente:", error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [pendienteId, getColegiadoPendiente])

  // Función para obtener iniciales del nombre
  const obtenerIniciales = () => {
    if (!pendiente) return "CN"

    const { nombre, primer_apellido } = pendiente.persona
    return `${nombre.charAt(0)}${primer_apellido.charAt(0)}`
  }

  // Funciones para gestión de documentos
  const handleVerDocumento = (documento) => {
    setDocumentoSeleccionado(documento)
  }

  const handleCerrarVistaDocumento = () => {
    setDocumentoSeleccionado(null)
  }

  const handleReemplazarDocumento = (documento) => {
    // Implementar lógica para reemplazar documento
    alert(`Funcionalidad para reemplazar el documento: ${documento.nombre}`)
  }

  // Función para verificar si todos los documentos requeridos están completos
  const verificarDocumentosCompletos = (documentos) => {
    if (!Array.isArray(documentos)) {
      console.error("Error: Los documentos no son un array:", documentos)
      return false
    }

    const documentosFaltantes = documentos.filter(
      (doc) => doc.requerido && !doc.archivo
    )
    return documentosFaltantes.length === 0
  }

  // Funciones para el formulario de registro
  const handleDatosRegistroChange = (e) => {
    const { name, value } = e.target
    setDatosRegistro(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const avanzarPasoModal = () => {
    // Validar campos del primer paso
    if (!datosRegistro.libro || !datosRegistro.pagina || !datosRegistro.tipo_profesion || !datosRegistro.num_cov) {
      alert("Por favor complete todos los campos requeridos para continuar")
      return
    }

    setPasoModal(2)
  }

  const retrocederPasoModal = () => {
    setPasoModal(1)
  }

  // Función para aprobar solicitud
  const handleAprobarSolicitud = async () => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      // Asegurarnos de que la sesión esté inicializada
      if (session) {
        initSession(session);
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
            colegiado: colegiadoAprobado
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
        alert("Debe ingresar un motivo de rechazo")
        return
      }

      // Simular proceso de rechazo
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mostrar confirmación de rechazo
      setRechazoExitoso(true)
      setMostrarRechazo(false)

      // Volver a la lista después de un tiempo
      setTimeout(() => {
        if (onVolver) {
          onVolver()
        }
      }, 3000)
    } catch (error) {
      console.error("Error al rechazar solicitud:", error)
    }
  }

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
      </div>
    )
  }

  // Formato del nombre para mostrar
  const nombreCompleto = `${pendiente.persona.nombre} ${pendiente.persona.segundo_nombre || ''} ${pendiente.persona.primer_apellido} ${pendiente.persona.segundo_apellido || ''}`.trim()
  const fechaSolicitud = pendiente.fechaSolicitud || "No especificada"

  return (
    <div className="w-full px-4 md:px-10 py-10 md:py-28 bg-gray-50">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <button
          onClick={() => onVolver({ aprobado: false })}
          className="text-md text-[#590248] hover:text-[#C40180] flex items-center cursor-pointer transition-colors duration-200"
        >
          <ChevronLeft size={20} className="mr-1" />
          Volver a la lista de colegiados
        </button>
      </div>

      {/* Notificaciones de éxito */}
      {confirmacionExitosa && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100 text-green-800 p-4 rounded-md mb-6 flex items-start justify-between shadow-sm"
        >
          <div className="flex items-center">
            <CheckCircle size={20} className="mr-2 flex-shrink-0" />
            <span>Se ha aprobado la solicitud correctamente. Redirigiendo a la lista de colegiados...</span>
          </div>
          <button
            onClick={() => setConfirmacionExitosa(false)}
            className="text-green-700 hover:bg-green-200 p-1 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}

      {rechazoExitoso && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-6 flex items-start justify-between shadow-sm"
        >
          <div className="flex items-center">
            <AlertCircle size={20} className="mr-2 flex-shrink-0" />
            <span>Se ha rechazado la solicitud correctamente. Redirigiendo a la lista de colegiados...</span>
          </div>
          <button
            onClick={() => setRechazoExitoso(false)}
            className="text-yellow-700 hover:bg-yellow-200 p-1 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}

      {/* Header con información básica */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/5 flex justify-center items-center mb-8 md:mb-0">
            {/* Iniciales en lugar de foto de perfil */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg shadow-black/40 bg-gradient-to-br from-[#C40180] to-[#7D0053] flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {obtenerIniciales()}
              </span>
            </div>
          </div>

          <div className="md:w-3/4">
            <div className="flex flex-col md:flex-row md:justify-between mb-4">
              <div className="md:ml-2">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">{nombreCompleto}</h1>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={14} className="mr-1" />
                  <span>Solicitud pendiente desde {fechaSolicitud}</span>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                {/* Estados de la solicitud */}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                  <Clock size={12} className="mr-1" />
                  Pendiente de aprobación
                </span>

                {/* Estado de documentos */}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${documentosCompletos
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                >
                  {documentosCompletos ? (
                    <>
                      <CheckCircle size={12} className="mr-1" />
                      Documentación completa
                    </>
                  ) : (
                    <>
                      <AlertCircle size={12} className="mr-1" />
                      Documentación incompleta
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mt-4">
              <div className="flex items-center bg-gray-50 p-2 rounded-md">
                <Mail className="text-[#C40180] h-5 w-5 mr-2" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Correo electrónico</p>
                  <p className="text-sm text-gray-700">{pendiente.persona.correo}</p>
                </div>
              </div>

              <div className="flex items-center bg-gray-50 p-2 rounded-md">
                <Phone className="text-[#C40180] h-5 w-5 mr-2" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Teléfono</p>
                  <p className="text-sm text-gray-700">{pendiente.persona.telefono_movil}</p>
                </div>
              </div>

              <div className="flex items-center bg-gray-50 p-2 rounded-md">
                <User className="text-[#C40180] h-5 w-5 mr-2" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Identificación</p>
                  <p className="text-sm text-gray-700">{pendiente.persona.nacionalidad}-{pendiente.persona.identificacion}</p>
                </div>
              </div>

              <div className="flex items-center bg-gray-50 p-2 rounded-md">
                <Calendar className="text-[#C40180] h-5 w-5 mr-2" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Fecha de solicitud</p>
                  <p className="text-sm text-gray-700">{fechaSolicitud}</p>
                </div>
              </div>

              {/* Información del creador del registro */}
              {pendiente.creador && (
                <div className="bg-gray-50 p-2 rounded-md col-span-2 mt-4">
                  <SessionInfo
                    creador={pendiente.creador}
                    variant="compact"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setMostrarConfirmacion(true)}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-sm font-medium"
              >
                <CheckCircle size={18} />
                <span>Aprobar solicitud</span>
              </button>

              <button
                onClick={() => setMostrarRechazo(true)}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-sm font-medium"
              >
                <XCircle size={18} />
                <span>Rechazar solicitud</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Información Personal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
      >
        <div className="flex items-center mb-5 border-b pb-3">
          <User size={20} className="text-[#C40180] mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Información personal</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Primera columna: nombre, cédula, fecha de nacimiento */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Nombre completo</p>
              <p className="font-medium text-gray-800">{nombreCompleto}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Cédula de identidad</p>
              <p className="font-medium text-gray-800">{pendiente.persona.nacionalidad}-{pendiente.persona.identificacion}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de nacimiento</p>
              <p className="font-medium text-gray-800">{new Date(pendiente.persona.fecha_de_nacimiento).toLocaleDateString('es-ES')}</p>
            </div>
          </div>

          {/* Segunda columna: correo, teléfono móvil, teléfono de casa */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Correo electrónico</p>
              <p className="font-medium text-gray-800">{pendiente.persona.correo}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Teléfono móvil</p>
              <p className="font-medium text-gray-800">{pendiente.persona.telefono_movil}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Teléfono de habitación</p>
              <p className="font-medium text-gray-800">{pendiente.persona.telefono_de_habitacion || "No especificado"}</p>
            </div>
          </div>

          {/* Tercera columna: estado civil, género, dirección */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Estado civil</p>
              <p className="font-medium text-gray-800">{pendiente.persona.estado_civil || "No especificado"}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Género</p>
              <p className="font-medium text-gray-800">{pendiente.persona.genero === 'M' ? 'Masculino' : pendiente.persona.genero === 'F' ? 'Femenino' : pendiente.persona.genero}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Dirección</p>
              <p className="font-medium text-gray-800">{pendiente.persona.direccion.referencia}, {pendiente.persona.direccion.estado}</p>
            </div>
          </div>
        </div>

        {/* Agregar sección para información del creador al final */}
        {pendiente.creador && (
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center mb-5 border-b pb-3">
              <Clock size={20} className="text-[#C40180] mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Información del registro</h2>
            </div>

            <div className="bg-purple-50 p-4 rounded-md">
              <SessionInfo
                creador={pendiente.creador}
                variant="full"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Información Académica y Profesional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Información académica y profesional (2/3 del espacio) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6 md:col-span-2 border border-gray-100"
        >
          <div className="flex items-center mb-5 border-b pb-3">
            <Award size={20} className="text-[#C40180] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Información académica y profesional</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Primera columna */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Instituto de bachillerato</p>
                <p className="font-medium text-gray-800">{pendiente.instituto_bachillerato || "No especificado"}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Universidad</p>
                <p className="font-medium text-gray-800">{pendiente.universidad || "No especificado"}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de egreso</p>
                <p className="font-medium text-gray-800">{pendiente.fecha_egreso_universidad ? new Date(pendiente.fecha_egreso_universidad).toLocaleDateString('es-ES') : "No especificada"}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número de registro principal</p>
                <p className="font-medium text-gray-800">{pendiente.num_registro_principal || "No especificado"}</p>
              </div>
            </div>

            {/* Segunda columna */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de registro principal</p>
                <p className="font-medium text-gray-800">{pendiente.fecha_registro_principal ? new Date(pendiente.fecha_registro_principal).toLocaleDateString('es-ES') : "No especificado"}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número MPPS</p>
                <p className="font-medium text-gray-800">{pendiente.num_mpps || "No especificado"}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha MPPS</p>
                <p className="font-medium text-gray-800">{pendiente.fecha_mpps ? new Date(pendiente.fecha_mpps).toLocaleDateString('es-ES') : "No especificada"}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Observaciones</p>
                <p className="font-medium text-gray-800">{pendiente.observaciones || "Ninguna"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Instituciones donde trabaja (1/3 del espacio) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
        >
          <div className="flex items-center mb-5 border-b pb-3">
            <Briefcase size={20} className="text-[#C40180] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Instituciones donde trabaja</h2>
          </div>

          {pendiente.instituciones && pendiente.instituciones.length > 0 ? (
            <div className="space-y-6">
              {pendiente.instituciones.map((institucion, index) => (
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
        </motion.div>
      </div>

      {/* Sección de Documentos */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div className="flex items-center mb-5 md:mb-0 border-b md:border-b-0 pb-3 md:pb-0">
            <FileText size={20} className="text-[#C40180] mr-2" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Documentos</h2>
              <p className="text-sm text-gray-500">Documentación del colegiado</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentosRequeridos && documentosRequeridos.map((documento) => (
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

                  <div className="flex items-center space-x-1">
                    {documento.archivo && (
                      <button
                        onClick={() => handleVerDocumento(documento)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                        title="Ver documento"
                      >
                        <Eye size={18} />
                      </button>
                    )}

                    <button
                      onClick={() => handleReemplazarDocumento(documento)}
                      className="text-orange-600 hover:bg-orange-50 p-2 rounded-full transition-colors"
                      title="Reemplazar documento"
                    >
                      <Upload size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!documentosRequeridos || documentosRequeridos.length === 0 && (
          <div className="bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center">
            <FileText size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-500 text-center">No hay documentos disponibles</p>
          </div>
        )}
      </motion.div>

      {/* Modal de aprobación - Dos pasos */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden"
          >
            {pasoModal === 1 ? (
              // Paso 1: Formulario de registro
              <>
                <div className="bg-[#7D0053]/10 p-4 border-b border-[#7D0053]">
                  <div className="flex items-center justify-center mb-2 text-[#7D0053]">
                    <FileText size={40} />
                  </div>
                  <h3 className="text-xl font-semibold text-center text-gray-900">
                    Datos de registro de colegiado
                  </h3>
                  <p className="text-center text-gray-600 mt-2">
                    Ingrese los datos de registro para el colegiado <span className="font-medium text-gray-900">{nombreCompleto}</span>
                  </p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Libro <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="libro"
                          value={datosRegistro.libro}
                          onChange={handleDatosRegistroChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                          placeholder="Número de libro"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Página <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="pagina"
                          value={datosRegistro.pagina}
                          onChange={handleDatosRegistroChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                          placeholder="Número de página"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de profesión <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="tipo_profesion"
                        value={datosRegistro.tipo_profesion}
                        onChange={handleDatosRegistroChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        required
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="Odontólogo general">Odontólogo general</option>
                        <option value="Especialista en ortodoncia">Especialista en ortodoncia</option>
                        <option value="Especialista en endodoncia">Especialista en endodoncia</option>
                        <option value="Especialista en periodoncia">Especialista en periodoncia</option>
                        <option value="Especialista en odontopediatría">Especialista en odontopediatría</option>
                        <option value="Especialista en cirugía maxilofacial">Especialista en cirugía maxilofacial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número COV <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="num_cov"
                        value={datosRegistro.num_cov}
                        onChange={handleDatosRegistroChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        placeholder="Número de registro COV"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={() => setMostrarConfirmacion(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={avanzarPasoModal}
                      className="px-6 py-2 bg-gradient-to-br from-[#C40180] to-[#7D0053] text-white rounded-md hover:from-[#C40180] hover:to-[#C40180] transition-all shadow-sm font-medium"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Paso 2: Confirmación
              <>
                <div className="bg-green-50 p-4 border-b border-green-100">
                  <div className="flex items-center justify-center mb-2 text-green-600">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-xl font-semibold text-center text-gray-900">
                    Confirmar aprobación
                  </h3>
                </div>

                <div className="p-6">
                  <p className="text-center text-gray-600 mb-4">
                    ¿Está seguro que desea aprobar la solicitud de <span className="font-medium text-gray-900">{nombreCompleto}</span>?
                    Se generará un nuevo registro de colegiado en el sistema con los siguientes datos:
                  </p>

                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex justify-between">
                        <span className="font-medium">Libro:</span>
                        <span>{datosRegistro.libro}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="font-medium">Página:</span>
                        <span>{datosRegistro.pagina}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="font-medium">Tipo de profesión:</span>
                        <span>{datosRegistro.tipo_profesion}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="font-medium">Número COV:</span>
                        <span>{datosRegistro.num_cov}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={retrocederPasoModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Volver
                    </button>
                    <button
                      onClick={handleAprobarSolicitud}
                      className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-all shadow-sm font-medium"
                    >
                      Confirmar aprobación
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* Modal de rechazo */}
      {mostrarRechazo && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden"
          >
            <div className="bg-red-50 p-4 border-b border-red-100">
              <div className="flex items-center justify-center mb-2 text-red-600">
                <XCircle size={40} />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900">
                Rechazar solicitud
              </h3>
            </div>

            <div className="p-6">
              <p className="text-center text-gray-600 mb-4">
                Está a punto de rechazar la solicitud de <span className="font-medium text-gray-900">{nombreCompleto}</span>.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo del rechazo <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                  placeholder="Ingrese el motivo del rechazo"
                  rows="3"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  Este motivo será enviado al solicitante por correo electrónico.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setMostrarRechazo(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRechazarSolicitud}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-all shadow-sm font-medium"
                >
                  Rechazar solicitud
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal para ver documento */}
      {documentoSeleccionado && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
          >
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
              {/* Vista previa del documento (placeholder) */}
              <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-200 rounded-lg">
                <div className="text-center p-6">
                  <FileText size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 font-medium">Vista previa no disponible para {documentoSeleccionado.nombre}</p>
                  <p className="text-sm text-gray-400 mt-2">Archivo: {documentoSeleccionado.archivo}</p>
                  <button className="mt-6 bg-gradient-to-br from-[#C40180] to-[#7D0053] text-white px-5 py-2.5 rounded-md hover:opacity-90 transition-all shadow-sm font-medium flex items-center justify-center gap-2 mx-auto">
                    <Download size={16} />
                    Descargar documento
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}