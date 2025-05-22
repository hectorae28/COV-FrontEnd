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
  variant = "pending", // "pending" | "registered"
  onNuevaSolicitud,
  onConfirmarTitulo,
  onMostrarConfirmacion,
  onMostrarRechazo,
  onMostrarExoneracion,
  onMostrarReporteIrregularidad,
  isAdmin = false,
  allDocumentsApproved = false
}) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/5 flex justify-center items-center mb-8 md:mb-0">
              <div className="w-32 h-32 rounded-full bg-gray-300"></div>
            </div>
            <div className="md:w-3/4 md:ml-2">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="h-16 bg-gray-300 rounded"></div>
                <div className="h-16 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Persona (pendiente vs registrado) - corregido para manejar ambos casos
  const persona = variant === "pending"
    ? data.persona || {}
    : (data.recaudos?.persona || {});

  // Estados y flags
  const isRechazada = variant === "pending" && data.status === "rechazado";
  const isDenegada = variant === "pending" && data.status === "denegado";
  const pagosPendientes = variant === "pending"
    ? (data.pago === null && !data.pago_exonerado)
    : false;

  // Iniciales
  const obtenerIniciales = () => {
    if (!persona.nombre || !persona.primer_apellido) return "CN";
    return `${persona.nombre.charAt(0)}${persona.primer_apellido.charAt(0)}`;
  };

  // Fecha formateada
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "No especificada";
    try {
      return new Date(fechaISO).toLocaleDateString('es-ES');
    } catch {
      return fechaISO;
    }
  };

  const fechaMostrada = variant === "pending"
    ? formatearFecha(data.created_at)
    : formatearFecha(data.fecha_de_inscripcion);

  // Nombre completo
  const nombreCompleto = [
    persona.nombre,
    persona.segundo_nombre,
    persona.primer_apellido,
    persona.segundo_apellido
  ].filter(Boolean).join(" ") || "Sin nombre";

  // --- PROFESIÓN: nunca renderices el objeto entero ---
  // 1) recoge el raw: si existe el campo "_display" úsalo, si no,
  //    toma directamente el objeto original que viene de la API
  const rawProfesionPendiente = data.tipo_profesion_display ?? data.tipo_profesion;
  const rawProfesionRegistrado = data.recaudos?.tipo_profesion_display
    ?? data.recaudos?.tipo_profesion
    ?? data.tipo_profesion_display
    ?? data.tipo_profesion;

  // 2) helper para que, si es objeto, extraiga el título; si no, lo use tal cual
  const mostrarProfesion = (prof) => {
    if (!prof) return "No especificado";
    if (typeof prof === 'object') {
      return prof.titulo || prof.nombre || "No especificado";
    }
    // Si es string, formatear según los valores conocidos
    switch (prof) {
      case "odontologo":
        return "Odontólogo";
      case "higienista":
        return "Higienista";
      case "tecnico":
        return "Técnico Dental";
      default:
        return prof;
    }
  };

  // Identificación formateada
  const getIdentificacion = () => {
    if (variant === "pending") {
      return persona.identificacion || "No especificada";
    } else {
      // Para colegiados registrados
      const nacionalidad = persona.nacionalidad || "V";
      const identificacion = persona.identificacion || "";

      // Si ya tiene formato "V-12345678", devolverlo tal como está
      if (identificacion.includes('-')) {
        return identificacion;
      }

      // Si no tiene formato, construirlo
      return `${nacionalidad}-${identificacion}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
    >
      <div className="flex flex-col md:flex-row">
        {/* Avatar */}
        <div className="md:w-1/5 flex justify-center items-center mb-8 md:mb-0">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg shadow-black/40 bg-gradient-to-br from-[#C40180] to-[#7D0053] flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{obtenerIniciales()}</span>
          </div>
        </div>

        <div className="md:w-4/5">
          {/* Header: nombre + estado */}
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
              {variant === "registered" && (
                <>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${data.solvencia_status ? 'bg-green-100 text-green-800 font-bold' : 'bg-red-100 text-red-800'
                    }`}>
                    {data.solvencia_status ? 'Solvente' : 'No Solvente'}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${data.carnetVigente ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {data.carnetVigente ? 'Carnet vigente' : 'Carnet vencido'}
                  </span>
                </>
              )}

              {variant === "pending" && isAdmin && (
                <>
                  {isRechazada ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      <AlertTriangle size={12} className="mr-1" /> Rechazada
                    </span>
                  ) : isDenegada ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      <UserX size={12} className="mr-1" /> Anulada
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      <Clock size={12} className="mr-1" /> Pendiente de aprobación
                    </span>
                  )}
                  {pagosPendientes && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      <XCircle size={12} className="mr-1" /> Pagos pendientes
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Datos de contacto y fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Correo */}
            <div className="flex items-center bg-gray-50 p-3 rounded-md">
              <Mail className="text-[#C40180] h-5 w-5 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 font-medium">Correo</p>
                <p className="text-sm text-gray-700 truncate">{persona.correo || "No especificado"}</p>
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex items-center bg-gray-50 p-3 rounded-md">
              <Phone className="text-[#C40180] h-5 w-5 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 font-medium">Teléfono</p>
                <p className="text-sm text-gray-700 truncate">{persona.telefono_movil || "No especificado"}</p>
              </div>
            </div>

            {/* Identificación */}
            <div className="flex items-center bg-gray-50 p-3 rounded-md">
              <User className="text-[#C40180] h-5 w-5 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 font-medium">Identificación</p>
                <p className="text-sm text-gray-700 truncate">{getIdentificacion()}</p>
              </div>
            </div>

            {/* Fecha */}
            <div className="flex items-center bg-gray-50 p-3 rounded-md">
              <Calendar className="text-[#C40180] h-5 w-5 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 font-medium">
                  {variant === "pending" ? "Fecha de solicitud" : "Fecha de inscripción"}
                </p>
                <p className="text-sm text-gray-700 truncate">{fechaMostrada}</p>
              </div>
            </div>
          </div>

          {/* Segunda fila de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Profesión/Ocupación */}
            <div className="flex items-center bg-gray-50 p-3 rounded-md">
              <GraduationCap className="text-[#C40180] h-5 w-5 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 font-medium">Profesión/Ocupación</p>
                <p className="text-sm text-gray-700 truncate">
                  {variant === "pending"
                    ? mostrarProfesion(rawProfesionPendiente)
                    : mostrarProfesion(rawProfesionRegistrado)
                  }
                </p>
              </div>
            </div>

            {/* Número de registro para colegiados o estado para pendientes */}
            {variant === "registered" ? (
              <div className="flex items-center bg-gray-50 p-3 rounded-md">
                <CreditCard className="text-[#C40180] h-5 w-5 mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium">Número de Registro</p>
                  <p className="text-sm text-gray-700 truncate">{data.numeroRegistro || "No asignado"}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center bg-gray-50 p-3 rounded-md">
                <Clock className="text-[#C40180] h-5 w-5 mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium">Estado de Solicitud</p>
                  <p className="text-sm text-gray-700 truncate">
                    {isRechazada ? "Rechazada" :
                      isDenegada ? "Anulada" :
                        pagosPendientes ? "Pendiente de pago" : "En revisión"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Información del creador */}
          {isAdmin && (
            <div className="mt-4">
              {variant === "pending" && data.user_admin_create_username && (
                <div className="bg-gray-50 p-2 rounded-md">
                  <SessionInfo
                    creador={{
                      username: data.user_admin_create_username,
                      fecha: data.created_at
                    }}
                    variant="compact"
                  />
                </div>
              )}
              {variant === "registered" && data.recaudos?.user_admin_create_username && (
                <div className="bg-gray-50 p-2 rounded-md">
                  <SessionInfo
                    creador={{
                      username: data.recaudos.user_admin_create_username,
                      fecha: data.recaudos.created_at
                    }}
                    variant="compact"
                  />
                </div>
              )}
            </div>
          )}

          {/* Botones de acción para administradores */}
          {isAdmin && variant === "pending" && !isDenegada && (
            <div className="mt-6 flex flex-wrap gap-3">
              {/* Botón de Aprobar */}
              <button
                onClick={onMostrarConfirmacion}
                disabled={!allDocumentsApproved || pagosPendientes}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${allDocumentsApproved && !pagosPendientes
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                title={
                  !allDocumentsApproved
                    ? "Debe aprobar todos los documentos primero"
                    : pagosPendientes
                      ? "Debe completar o exonerar los pagos primero"
                      : "Aprobar solicitud"
                }
              >
                <CheckCircle size={16} className="mr-1" />
                Aprobar
              </button>

              {/* Botón de Rechazar */}
              <button
                onClick={onMostrarRechazo}
                className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors"
              >
                <AlertTriangle size={16} className="mr-1" />
                Rechazar
              </button>

              {/* Botón de Exonerar Pagos */}
              {pagosPendientes && (
                <button
                  onClick={onMostrarExoneracion}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  <CreditCard size={16} className="mr-1" />
                  Exonerar Pagos
                </button>
              )}

              {/* Botón de Reportar Irregularidad */}
              <button
                onClick={onMostrarReporteIrregularidad}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <AlertTriangle size={16} className="mr-1" />
                Reportar Irregularidad
              </button>
            </div>
          )}

          {/* Botones de acción para colegiados registrados */}
          {isAdmin && variant === "registered" && (
            <div className="mt-6 flex flex-wrap gap-3">
              {/* Botón de Nueva Solicitud */}
              <button
                onClick={onNuevaSolicitud}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <PlusCircle size={16} className="mr-1" />
                Nueva Solicitud
              </button>

              {/* Botón de Confirmar Entrega de Título */}
              {!data.titulo && (
                <button
                  onClick={onConfirmarTitulo}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <CheckCircle size={16} className="mr-1" />
                  Confirmar Entrega Título
                </button>
              )}

              {/* Botón de Reportar Irregularidad */}
              <button
                onClick={onMostrarReporteIrregularidad}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <AlertTriangle size={16} className="mr-1" />
                Reportar Irregularidad
              </button>
            </div>
          )}

          {/* Mensaje de estado rechazado/denegado */}
          {variant === "pending" && (isRechazada || isDenegada) && (
            <div className={`mt-4 p-3 rounded-md border-l-4 ${isRechazada ? "bg-yellow-50 border-yellow-500" : "bg-red-50 border-red-500"
              }`}>
              <div className="flex items-center">
                {isRechazada ? (
                  <AlertTriangle size={20} className="text-yellow-600 mr-2" />
                ) : (
                  <XCircle size={20} className="text-red-600 mr-2" />
                )}
                <div>
                  <p className={`font-medium ${isRechazada ? "text-yellow-800" : "text-red-800"}`}>
                    Solicitud {isRechazada ? "Rechazada" : "Anulada"}
                  </p>
                  {data.motivo_rechazo && (
                    <p className={`text-sm mt-1 ${isRechazada ? "text-yellow-700" : "text-red-700"}`}>
                      Motivo: {data.motivo_rechazo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mensaje de pagos exonerados */}
          {variant === "pending" && data.pago_exonerado && (
            <div className="mt-4 p-3 bg-purple-50 rounded-md border-l-4 border-purple-500">
              <div className="flex items-center">
                <CheckCircle size={20} className="text-purple-600 mr-2" />
                <div>
                  <p className="font-medium text-purple-800">Pagos Exonerados</p>
                  {data.motivo_exonerado && (
                    <p className="text-sm text-purple-700 mt-1">
                      Motivo: {data.motivo_exonerado}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}