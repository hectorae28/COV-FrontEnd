import { motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  UserX,
  X,
  XCircle
} from "lucide-react";

export default function NotificationSystem({
  notifications = {},
  handlers = {},
  pendiente = null,
  allDocumentsUploaded = false
}) {
  const {
    confirmacionExitosa,
    rechazoExitoso,
    denegacionExitosa,
    exoneracionExitosa,
    cambiosPendientes,
    documentosCompletos
  } = notifications;

  const {
    setConfirmacionExitosa,
    setRechazoExitoso,
    setDenegacionExitosa,
    setExoneracionExitosa,
    setCambiosPendientes
  } = handlers;

  // Función para formatear fecha
  const formatearFechaSimple = (fechaISO) => {
    if (!fechaISO) return "fecha desconocida";
    try {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return "fecha desconocida";
    }
  };

  // Estados especiales
  const isRechazada = pendiente?.status === "rechazado";
  const isDenegada = pendiente?.status === "anulado";

  // Componente de notificación reutilizable
  const NotificationCard = ({ 
    type, 
    icon: Icon, 
    title, 
    message, 
    onClose, 
    bgColor, 
    textColor, 
    borderColor 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} ${textColor} p-4 rounded-md mb-6 flex items-start justify-between shadow-sm border ${borderColor}`}
    >
      <div className="flex items-center">
        <Icon size={20} className="mr-2 flex-shrink-0" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm mt-1">{message}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className={`${textColor.replace('text-', 'hover:bg-').replace('-800', '-200')} p-1 rounded-full transition-colors`}
      >
        <X size={18} />
      </button>
    </motion.div>
  );

  // Componente de banner de estado
  const StatusBanner = ({ 
    type, 
    icon: Icon, 
    title, 
    message, 
    bgColor, 
    borderColor, 
    textColor 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} ${borderColor} p-4 mb-6 rounded-r-md shadow-sm border-l-4`}
    >
      <div className="flex items-start">
        <Icon size={24} className={`${textColor} mr-3 mt-0.5 flex-shrink-0`} />
        <div>
          <h3 className={`${textColor} font-medium`}>{title}</h3>
          <div className={`${textColor.replace('-500', '-700')} text-sm mt-1`}>
            {message}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Notificaciones de éxito */}
      {confirmacionExitosa && (
        <NotificationCard
          type="success"
          icon={CheckCircle}
          title="Solicitud aprobada"
          message="Se ha aprobado la solicitud correctamente. Redirigiendo a la lista de colegiados..."
          onClose={() => setConfirmacionExitosa(false)}
          bgColor="bg-green-100"
          textColor="text-green-800"
          borderColor="border-green-200"
        />
      )}

      {rechazoExitoso && (
        <NotificationCard
          type="warning"
          icon={AlertCircle}
          title="Solicitud rechazada"
          message="Se ha rechazado la solicitud. El solicitante podrá realizar correcciones. Redirigiendo..."
          onClose={() => setRechazoExitoso(false)}
          bgColor="bg-yellow-100"
          textColor="text-yellow-800"
          borderColor="border-yellow-200"
        />
      )}

      {denegacionExitosa && (
        <NotificationCard
          type="error"
          icon={XCircle}
          title="Solicitud anulada"
          message="Se ha anulado la solicitud permanentemente. Redirigiendo a la lista de colegiados..."
          onClose={() => setDenegacionExitosa(false)}
          bgColor="bg-red-100"
          textColor="text-red-800"
          borderColor="border-red-200"
        />
      )}

      {exoneracionExitosa && (
        <NotificationCard
          type="info"
          icon={CheckCircle}
          title="Pagos exonerados"
          message="Los pagos han sido exonerados correctamente. Ya puede proceder con la aprobación."
          onClose={() => setExoneracionExitosa(false)}
          bgColor="bg-purple-100"
          textColor="text-purple-800"
          borderColor="border-purple-200"
        />
      )}

      {cambiosPendientes && (
        <NotificationCard
          type="info"
          icon={AlertCircle}
          title="Cambios sin guardar"
          message="Hay cambios sin guardar. Por favor guarde los cambios antes de continuar."
          onClose={() => setCambiosPendientes(false)}
          bgColor="bg-blue-100"
          textColor="text-blue-800"
          borderColor="border-blue-200"
        />
      )}

      {/* Banners de estado de solicitud */}
      {pendiente && isRechazada && (
        <StatusBanner
          type="warning"
          icon={AlertTriangle}
          title="Solicitud rechazada"
          message={
            <>
              Esta solicitud fue rechazada el {formatearFechaSimple(pendiente.updated_at)}.
              <br />
              Motivo: {pendiente.motivo_rechazo || "No especificado"}
              <br />
              <span className="text-yellow-600 text-xs mt-2 block">
                El solicitante puede realizar correcciones y volver a enviar la solicitud.
              </span>
            </>
          }
          bgColor="bg-yellow-50"
          borderColor="border-yellow-500"
          textColor="text-yellow-500"
        />
      )}

      {pendiente && isDenegada && (
        <StatusBanner
          type="error"
          icon={UserX}
          title="Solicitud Anulada permanentemente"
          message={
            <>
              Esta solicitud fue anulada el {formatearFechaSimple(pendiente.updated_at)}.
              <br />
              Motivo: {pendiente.motivo_rechazo || "No especificado"}
              <br />
              <span className="text-red-600 text-xs mt-2 block">
                Esta solicitud ha sido rechazada definitivamente y no se permitirán más acciones sobre ella.
              </span>
            </>
          }
          bgColor="bg-red-50"
          borderColor="border-red-500"
          textColor="text-red-500"
        />
      )}

      {/* Alerta de documentos faltantes */}
      {pendiente && !allDocumentsUploaded && !isDenegada && !isRechazada && (
        <StatusBanner
          type="error"
          icon={AlertCircle}
          title="Documentos incompletos"
          message={
            <>
              Esta solicitud no puede ser aprobada hasta que todos los documentos requeridos estén subidos, incluyendo el comprobante de pago.
              <br />
              <span className="text-red-600 text-xs mt-2 block">
                Una vez subidos todos los documentos, podrán ser revisados y aprobados individualmente.
              </span>
            </>
          }
          bgColor="bg-red-50"
          borderColor="border-red-500"
          textColor="text-red-500"
        />
      )}

      {/* Nueva notificación cuando documentos están subidos pero no aprobados */}
      {pendiente && allDocumentsUploaded && !documentosCompletos && !isDenegada && !isRechazada && (
        <StatusBanner
          type="warning"
          icon={AlertTriangle}
          title="Documentos pendientes de aprobación"
          message={
            <>
              Todos los documentos requeridos han sido subidos. La solicitud no puede ser aprobada hasta que todos los documentos sean revisados y aprobados individualmente.
              <br />
              <span className="text-yellow-600 text-xs mt-2 block">
                Por favor revise cada documento en la sección de documentos y márquelos como aprobados o rechazados.
              </span>
            </>
          }
          bgColor="bg-yellow-50"
          borderColor="border-yellow-500"
          textColor="text-yellow-500"
        />
      )}
    </>
  );
}