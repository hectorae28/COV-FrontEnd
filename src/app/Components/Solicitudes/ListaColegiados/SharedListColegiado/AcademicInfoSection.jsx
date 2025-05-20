"use client";

import { motion } from "framer-motion";
import { Award, Pencil } from "lucide-react";
import { useState } from "react";

import InfoColegiado from "@/app/(Registro)/InfoColg";
import Modal from "@/app/Components/Solicitudes/ListaColegiados/Modal";

export default function AcademicInfoSection({
  pendiente,
  datosAcademicos,
  setDatosAcademicos,
  updateColegiadoPendiente,
  pendienteId,
  setCambiosPendientes,
  readonly = false
}) {
  // Nuevo estado para modal
  const [showModal, setShowModal] = useState(false);

  // Extraer valores iniciales para el formulario
  const getInitialFormData = () => {
    return {
      tipo_profesion: pendiente?.tipo_profesion || "",
      graduateInstitute: datosAcademicos?.instituto_bachillerato || "",
      universityTitle: datosAcademicos?.universidad || "",
      mainRegistrationNumber: datosAcademicos?.num_registro_principal || "",
      mainRegistrationDate: datosAcademicos?.fecha_registro_principal || "",
      mppsRegistrationNumber: datosAcademicos?.num_mpps || "",
      mppsRegistrationDate: datosAcademicos?.fecha_mpps || "",
      titleIssuanceDate: datosAcademicos?.fecha_egreso_universidad || "",
      observaciones: datosAcademicos?.observaciones || ""
    };
  };

  // Manejador para guardar cambios
  const handleSaveChanges = (updates) => {
    // Construir objeto actualizado
    const updatedData = {
      instituto_bachillerato: updates.graduateInstitute,
      universidad: updates.universityTitle,
      num_registro_principal: updates.mainRegistrationNumber,
      fecha_registro_principal: updates.mainRegistrationDate,
      num_mpps: updates.mppsRegistrationNumber,
      fecha_mpps: updates.mppsRegistrationDate,
      fecha_egreso_universidad: updates.titleIssuanceDate,
      observaciones: updates.observaciones
    };

    // Actualizar estado local
    setDatosAcademicos(updatedData);

    // Enviar al backend
    updateColegiadoPendiente(pendienteId, updatedData);

    // Marcar como guardado
    setCambiosPendientes(false);

    // Cerrar modal
    setShowModal(false);
  };

  // Formatear fechas para visualización
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "No especificada";

    try {
      return new Date(fechaISO).toLocaleDateString('es-ES');
    } catch (error) {
      return fechaISO;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg shadow-md p-6 md:col-span-2 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-5 border-b pb-3">
        <div className="flex items-center">
          <Award size={20} className="text-[#C40180] mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Información académica y profesional</h2>
        </div>

        {!readonly && (
          <button
            onClick={() => setShowModal(true)}
            className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:opacity-90 transition-colors"
          >
            <Pencil size={16} className="mr-1" />
            Editar
          </button>
        )}
      </div>

      {/* Vista de información académica */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {/* Universidad */}
  <div className="bg-gray-50 p-3 rounded-md">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Universidad</p>
    <p className="font-medium text-gray-800">{datosAcademicos?.universidad?.titulo || datosAcademicos?.universidad || "No especificado"}</p>
  </div>

  {/* Fecha de egreso */}
  <div className="bg-gray-50 p-3 rounded-md">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de egreso</p>
    <p className="font-medium text-gray-800">{formatearFecha(datosAcademicos?.fecha_egreso_universidad)}</p>
  </div>

  {/* Instituto de bachillerato */}
  <div className="bg-gray-50 p-3 rounded-md">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Instituto de bachillerato</p>
    <p className="font-medium text-gray-800">{datosAcademicos?.instituto_bachillerato || "No especificado"}</p>
  </div>

  {/* Campos específicos para odontólogos */}
  {pendiente?.tipo_profesion === "odontologo" && (
    <>
      <div className="bg-gray-50 p-3 rounded-md">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número de registro principal</p>
        <p className="font-medium text-gray-800">{datosAcademicos?.num_registro_principal || "No especificado"}</p>
      </div>

      <div className="bg-gray-50 p-3 rounded-md">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de registro principal</p>
        <p className="font-medium text-gray-800">{formatearFecha(datosAcademicos?.fecha_registro_principal)}</p>
      </div>
    </>
  )}

  {/* Número MPPS */}
  <div className="bg-gray-50 p-3 rounded-md">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número MPPS</p>
    <p className="font-medium text-gray-800">{datosAcademicos?.num_mpps || "No especificado"}</p>
  </div>

  {/* Fecha MPPS */}
  <div className="bg-gray-50 p-3 rounded-md">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha MPPS</p>
    <p className="font-medium text-gray-800">{formatearFecha(datosAcademicos?.fecha_mpps)}</p>
  </div>

  {/* Observaciones */}
  <div className="bg-gray-50 p-3 rounded-md col-span-2">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Observaciones</p>
    <p className="font-medium text-gray-800">{datosAcademicos?.observaciones || "Ninguna"}</p>
  </div>
</div>

      {/* Modal para edición */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Editar información académica"
      >
        <InfoColegiado
          formData={getInitialFormData()}
          onInputChange={handleSaveChanges}
          validationErrors={{}}
          currentStep={3}
          attemptedNext={false}
          validateStep={() => true}
          isEditMode={true}
        />
      </Modal>
    </motion.div>
  );
}