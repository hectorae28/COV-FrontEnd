// SharedListColegiado/NotificationSystem.jsx
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
  pendiente = null
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

  // Determinar estados especiales
  const isRechazada = pendiente?.status === "rechazado";
  const isDenegada = pendiente?.status === "denegado";

  return (
    <>
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
            <span>Se ha rechazado la solicitud. El solicitante podrá realizar correcciones. Redirigiendo...</span>
          </div>
          <button
            onClick={() => setRechazoExitoso(false)}
            className="text-yellow-700 hover:bg-yellow-200 p-1 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}

      {denegacionExitosa && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 text-red-800 p-4 rounded-md mb-6 flex items-start justify-between shadow-sm"
        >
          <div className="flex items-center">
            <XCircle size={20} className="mr-2 flex-shrink-0" />
            <span>Se ha denegado la solicitud permanentemente. Redirigiendo a la lista de colegiados...</span>
          </div>
          <button
            onClick={() => setDenegacionExitosa(false)}
            className="text-red-700 hover:bg-red-200 p-1 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}

      {exoneracionExitosa && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-100 text-purple-800 p-4 rounded-md mb-6 flex items-start justify-between shadow-sm"
        >
          <div className="flex items-center">
            <CheckCircle size={20} className="mr-2 flex-shrink-0" />
            <span>Los pagos han sido exonerados correctamente. Ya puede proceder con la aprobación.</span>
          </div>
          <button
            onClick={() => setExoneracionExitosa(false)}
            className="text-purple-700 hover:bg-purple-200 p-1 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}

      {cambiosPendientes && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-100 text-blue-800 p-4 rounded-md mb-6 flex items-start justify-between shadow-sm"
        >
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
        </motion.div>
      )}

      {/* Banner de solicitud rechazada o denegada, solo si hay pendiente */}
      {pendiente && isRechazada && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-r-md shadow-sm"
        >
          <div className="flex items-start">
            <AlertTriangle size={24} className="text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-yellow-800 font-medium">Solicitud rechazada</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Esta solicitud fue rechazada el {pendiente.updated_at || "N/A"}.
                <br />
                Motivo: {pendiente.motivo_rechazo || "No especificado"}
              </p>
              <p className="text-yellow-600 text-xs mt-2">
                El solicitante puede realizar correcciones y volver a enviar la solicitud.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {pendiente && isDenegada && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md shadow-sm"
        >
          <div className="flex items-start">
            <UserX size={24} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-medium">Solicitud Anulada permanentemente</h3>
              <p className="text-red-700 text-sm mt-1">
                Esta solicitud fue Anulada el {pendiente.fechaDenegacion || "N/A"}.
                <br />
                Motivo: {pendiente.motivoDenegacion || "No especificado"}
              </p>
              <p className="text-red-600 text-xs mt-2">
                Esta solicitud ha sido rechazada definitivamente y no se permitirán más acciones sobre ella.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Alerta de documentos faltantes */}
      {pendiente && documentosCompletos === false && !isDenegada && !isRechazada && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md shadow-sm"
        >
          <div className="flex items-start">
            <AlertCircle size={24} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-medium">Documentos incompletos</h3>
              <p className="text-red-700 text-sm mt-1">
                Esta solicitud no puede ser aprobada hasta que todos los documentos requeridos estén completos.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}