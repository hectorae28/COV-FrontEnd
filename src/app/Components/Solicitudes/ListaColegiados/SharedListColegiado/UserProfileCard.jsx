// SharedListColegiado/UserProfileCard.jsx
import SessionInfo from "@/Components/SessionInfo";
import { motion } from "framer-motion";
import {
  AlertTriangle, Calendar, CheckCircle, Clock, CreditCard,
  GraduationCap, Mail, Phone,
  PlusCircle,
  User, UserX, XCircle
} from "lucide-react";

export default function UserProfileCard({
  data,
  variant = "pending", // "pending" o "registered"
  onNuevaSolicitud,
  onConfirmarTitulo,
  onMostrarConfirmacion,
  onMostrarRechazo,
  onMostrarExoneracion,
  onMostrarReporteIrregularidad,
  isAdmin = false,
  allDocumentsApproved = false
}) {
  // Verificación de que data existe
  if (!data) {
    return <div>Cargando información...</div>; // o algún estado de carga
  }

  // Extraer datos según el variant con verificaciones
  const persona = variant === "pending"
    ? (data.persona || {})
    : ((data.recaudos && data.recaudos.persona) || {});

  const isRechazada = variant === "pending" && data.status === "rechazado";
  const isDenegada = variant === "pending" && data.status === "denegado";
  const pagosPendientes = variant === "pending" ? (data.pago === null && !data.pago_exonerado) : false;

  // Obtener iniciales del nombre con verificación
  const obtenerIniciales = () => {
    if (!persona || !persona.nombre || !persona.primer_apellido) return "CN";
    return `${persona.nombre.charAt(0)}${persona.primer_apellido.charAt(0)}`;
  };

  // Formatear fechas con verificación
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "No especificada";
    return new Date(fechaISO).toLocaleDateString('es-ES');
  };

  // Nombre completo con verificaciones para cada parte
  const nombreCompleto = `${persona.nombre || ''} ${persona.segundo_nombre || ''} ${persona.primer_apellido || ''} ${persona.segundo_apellido || ''}`.trim() || "Sin nombre";

  // Fecha mostrada según variante con verificación
  const fechaMostrada = variant === "pending"
    ? (data.created_at ? formatearFecha(data.created_at) : "No especificada")
    : (data.fecha_de_inscripcion ? formatearFecha(data.fecha_de_inscripcion) : "No especificada");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/5 flex justify-center items-center mb-8 md:mb-0">
          {/* Iniciales */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg shadow-black/40 bg-gradient-to-br from-[#C40180] to-[#7D0053] flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{obtenerIniciales()}</span>
          </div>
        </div>

        <div className="md:w-3/4">
          <div className="flex flex-col md:flex-row md:justify-between mb-4">
            <div className="md:ml-2">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">{nombreCompleto}</h1>

              {variant === "pending" ? (
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={14} className="mr-1" />
                  <span>Solicitud pendiente desde {fechaMostrada}</span>
                </div>
              ) : (
                <p className="text-sm text-gray-500">N° COV: {data.num_cov}</p>
              )}
            </div>

            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              {/* Estados de solicitud o colegiado */}
              {variant === "registered" && (
                <>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${data.solvencia_status ? 'bg-green-100 text-green-800 font-bold' : 'bg-red-100 text-red-800'}`}>
                    {data.solvencia_status ? 'Solvente' : 'No Solvente'}
                  </span>

                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${data.carnetVigente ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {data.carnetVigente ? 'Carnet vigente' : 'Carnet vencido'}
                  </span>
                </>
              )}

              {variant === "pending" && isAdmin && (
                <>
                  {isRechazada ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      <AlertTriangle size={12} className="mr-1" />
                      Rechazada
                    </span>
                  ) : isDenegada ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      <UserX size={12} className="mr-1" />
                      Anulada
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      <Clock size={12} className="mr-1" />
                      Pendiente de aprobación
                    </span>
                  )}

                  {/* Estado de pagos pendientes */}
                  {pagosPendientes && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      <XCircle size={12} className="mr-1" />
                      Pagos pendientes
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Grid de información de contacto */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mt-4 w-full">
            <div className="flex items-center bg-gray-50 p-3 rounded-md sm:w-[45%]">
              <Mail className="text-[#C40180] h-5 w-5 mr-3" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Correo electrónico</p>
                <p className="text-sm text-gray-700 truncate max-w-full">{persona.correo}</p>
              </div>
            </div>
            <div className="flex items-center bg-gray-50 p-3 rounded-md sm:w-[45%]">
              <Phone className="text-[#C40180] h-5 w-5 mr-3" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Teléfono</p>
                <p className="text-sm text-gray-700">{persona.telefono_movil}</p>
              </div>
            </div>
            <div className="flex items-center bg-gray-50 p-3 rounded-md sm:w-[45%]">
              <User className="text-[#C40180] h-5 w-5 mr-3" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Identificación</p>
                <p className="text-sm text-gray-700">
                  {persona.nacionalidad}-{persona.identificacion}
                </p>
              </div>
            </div>
            <div className="flex items-center bg-gray-50 p-3 rounded-md sm:w-[45%]">
              <Calendar className="text-[#C40180] h-5 w-5 mr-3" />
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  {variant === "pending" ? "Fecha de solicitud" : "Fecha de inscripción"}
                </p>
                <p className="text-sm text-gray-700">{fechaMostrada}</p>
              </div>
            </div>

            {variant === "registered" && (
              <div className="flex items-center bg-gray-50 p-3 rounded-md sm:w-[45%]">
                <GraduationCap className="text-[#C40180] h-5 w-5 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Profesión/Ocupación</p>
                  <p className="text-sm text-gray-700">
                    {data.recaudos.tipo_profesion_display}
                  </p>
                </div>
              </div>
            )}

            {variant === "pending" && (
              <div className="flex items-center bg-gray-50 p-3 rounded-md sm:w-[45%]">
                <GraduationCap className="text-[#C40180] h-5 w-5 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Profesión/Ocupación</p>
                  <p className="text-sm text-gray-700">{data.tipo_profesion_display}</p>
                </div>
              </div>
            )}

            {/* Información del creador del registro */}
            {(variant === "pending" && data.user_admin_create_username && isAdmin) && (
              <div className="bg-gray-50 p-2 rounded-md col-span-2 mt-4 w-full">
                <SessionInfo
                  creador={{ username: data.user_admin_create_username, fecha: data.created_at }}
                  variant="compact"
                />
              </div>
            )}

            {(variant === "registered" && data.recaudos?.user_admin_create_username) && (
              <div className="bg-gray-50 p-2 rounded-md col-span-2 mt-4 w-full">
                <SessionInfo
                  creador={{ username: data.recaudos.user_admin_create_username, fecha: data.recaudos.created_at }}
                  variant="compact"
                />
              </div>
            )}

            {/* Información de rechazo */}
            {(variant === "pending" && isRechazada && data.user_admin_update_username && isAdmin) && (
              <div className="bg-yellow-50 p-2 rounded-md col-span-2 mt-4 border border-yellow-100 w-full">
                <div className="flex items-start">
                  <AlertTriangle size={18} className="text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Rechazada por: {data.user_admin_update_username}
                    </p>
                    <p className="text-xs text-yellow-700">Fecha: {data.updated_at}</p>
                    <p className="text-xs text-yellow-700 mt-1">Motivo: {data.motivo_rechazo}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {variant === "registered" && (
              <>
                <button
                  onClick={onNuevaSolicitud}
                  className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <PlusCircle size={18} />
                  <span>Nueva solicitud</span>
                </button>

                {!data.titulo && (
                  <button
                    onClick={onConfirmarTitulo}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={18} />
                    <span>Confirmar entrega de título</span>
                  </button>
                )}
              </>
            )}

            {/* Botones de administrador para pendientes */}
            {(variant === "pending" && !isDenegada && isAdmin) && (
              <>
                <button
                  onClick={onMostrarConfirmacion}
                  disabled={!allDocumentsApproved || (pagosPendientes && !data.exoneracionPagos?.fecha)}
                  className={`cursor-pointer bg-gradient-to-r ${!allDocumentsApproved || (pagosPendientes && !data.exoneracionPagos?.fecha)
                    ? "from-gray-400 to-gray-500 cursor-not-allowed"
                    : "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    } text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-sm font-medium`}
                  title={
                    !allDocumentsApproved
                      ? "Debe aprobar todos los documentos para continuar"
                      : pagosPendientes && !data.exoneracionPagos?.fecha
                        ? "Complete el pago o exonere el pago para aprobar"
                        : "Aprobar Solicitud"
                  }
                >
                  <CheckCircle size={18} />
                  <span>Aprobar Solicitud</span>
                </button>

                <button
                  onClick={onMostrarRechazo}
                  className={`cursor-pointer bg-gradient-to-r ${isRechazada ? "from-red-600 to-red-700" : "from-yellow-600 to-yellow-700"
                    } text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 shadow-sm font-medium`}
                >
                  <XCircle size={18} />
                  <span>{isRechazada ? "Anular Solicitud" : "Rechazar Solicitud"}</span>
                </button>

                {pagosPendientes && (
                  <button
                    onClick={onMostrarExoneracion}
                    className="cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 shadow-sm font-medium"
                  >
                    <CreditCard size={18} />
                    <span>Exonerar pagos</span>
                  </button>
                )}

                <button
                  onClick={onMostrarReporteIrregularidad}
                  className="cursor-pointer bg-gradient-to-r from-red-700 to-red-800 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 shadow-sm font-medium"
                >
                  <AlertTriangle size={18} />
                  <span>Reportar Irregularidad</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}