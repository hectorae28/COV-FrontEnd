"use client";

import { motion } from "framer-motion";
import { Award, Pencil } from "lucide-react";
import { useState } from "react";

import Modal from "@/Components/Solicitudes/ListaColegiados/Modal";
import InfoColegiado from "@/app/(Registro)/InfoColg";

export default function AcademicInfoSection({
  pendiente,
  datosAcademicos,
  setDatosAcademicos,
  updateData,
  pendienteId,
  setCambiosPendientes,
  readOnly = false
}) {
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [localFormData, setLocalFormData] = useState(null);

  // Formatear fechas
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "No especificada";
    try {
      return new Date(fechaISO).toLocaleDateString('es-ES');
    } catch {
      return fechaISO;
    }
  };

  // Extraer los valores iniciales para el formulario de edición
  const getInitialFormData = () => {
    return {
      tipo_profesion: pendiente?.tipo_profesion || "",
      graduateInstitute: datosAcademicos?.instituto_bachillerato || "",
      universityState: datosAcademicos?.estado_universidad || "",
      universityTitle: datosAcademicos?.nombre_universidad || "",
      mppsRegistrationNumber: datosAcademicos?.num_mpps || "",
      mppsRegistrationDate: datosAcademicos?.fecha_mpps || "",
      titleIssuanceDate: datosAcademicos?.fecha_emision_titulo || "",
      mainRegistrationNumber: datosAcademicos?.num_registro_principal || "",
      mainRegistrationDate: datosAcademicos?.fecha_registro_principal || "",
      // Campos adicionales para universidades personalizadas
      selectedEstado: datosAcademicos?.estado_universidad || "",
      selectedCiudad: datosAcademicos?.municipio_universidad || "",
      isCustomUniversity: datosAcademicos?.es_universidad_personalizada || false,
      customUniversityName: datosAcademicos?.nombre_universidad_personalizada || "",
      customUniversityAcronym: datosAcademicos?.acronimo_universidad_personalizada || ""
    };
  };

  const handleOpenModal = () => {
    setLocalFormData(getInitialFormData());
    setShowModal(true);
  };

  const handleLocalInputChange = (updates) => {
    setLocalFormData(prev => ({
      ...prev,
      ...updates
    }));
    setCambiosPendientes(true);
  };

  const handleSaveChanges = (updatedData = null) => {
    const dataToUpdate = updatedData || localFormData;

    const updatedAcademicos = {
      ...datosAcademicos,
      instituto_bachillerato: dataToUpdate.graduateInstitute,
      estado_universidad: dataToUpdate.universityState || dataToUpdate.selectedEstado,
      nombre_universidad: dataToUpdate.universityTitle,
      municipio_universidad: dataToUpdate.selectedCiudad,
      num_mpps: dataToUpdate.mppsRegistrationNumber,
      fecha_mpps: dataToUpdate.mppsRegistrationDate,
      fecha_emision_titulo: dataToUpdate.titleIssuanceDate,
      num_registro_principal: dataToUpdate.mainRegistrationNumber,
      fecha_registro_principal: dataToUpdate.mainRegistrationDate,
      // Campos adicionales
      es_universidad_personalizada: dataToUpdate.isCustomUniversity,
      nombre_universidad_personalizada: dataToUpdate.customUniversityName,
      acronimo_universidad_personalizada: dataToUpdate.customUniversityAcronym
    };

    // Actualizar también el tipo de profesión en el pendiente
    const updatedPendiente = {
      tipo_profesion: dataToUpdate.tipo_profesion
    };

    setDatosAcademicos(updatedAcademicos);
    setLocalFormData(null);
    updateData(pendienteId, { academicos: updatedAcademicos, ...updatedPendiente });
    setShowModal(false);
    setCambiosPendientes(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLocalFormData(null);
    setCambiosPendientes(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-5 border-b pb-3">
        <div className="flex items-center">
          <Award size={20} className="text-[#C40180] mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Información académica y profesional</h2>
        </div>

        {!readOnly && (
          <button
            onClick={handleOpenModal}
            className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:opacity-90 transition-colors"
          >
            <Pencil size={16} className="mr-1" />
            Editar
          </button>
        )}
      </div>

      {/* Fila 1: Tipo de Profesión y Ocupación */}
      <div className="bg-gray-50 p-3 rounded-md mt-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Tipo de Profesión/Ocupación</p>
          <p className="font-medium text-gray-800">
            {pendiente?.tipo_profesion
              ? (pendiente.tipo_profesion === "odontologo" ? "Odontólogo" :
                pendiente.tipo_profesion === "higienista" ? "Higienista" :
                  pendiente.tipo_profesion === "tecnico" ? "Técnico Dental" :
                    pendiente.tipo_profesion)
              : "No especificado"}
          </p>
      </div>

      {/* Fila 2: Liceo/Colegio de Egreso (Bachillerato) */}
      <div className="bg-gray-50 p-3 rounded-md mt-6">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Liceo / Colegio (Bachillerato)</p>
        <p className="font-medium text-gray-800">{datosAcademicos?.instituto_bachillerato || "No especificado"}</p>
      </div>

      {/* Fila 3: Institución de Educación Superior - Estado y Municipio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Estado de la Universidad</p>
          <p className="font-medium text-gray-800">{datosAcademicos?.estado_universidad || "No especificado"}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Municipio de la Universidad</p>
          <p className="font-medium text-gray-800">{datosAcademicos?.municipio_universidad || "No especificado"}</p>
        </div>
      </div>

      {/* Fila 4: Número MPPS y Fecha MPPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número MPPS</p>
          <p className="font-medium text-gray-800">{datosAcademicos?.num_mpps || "No especificado"}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha MPPS</p>
          <p className="font-medium text-gray-800">{formatearFecha(datosAcademicos?.fecha_mpps)}</p>
        </div>
      </div>

      {/* Fila 5: Fecha de Emisión de Título */}
      <div className="bg-gray-50 p-3 rounded-md mt-6">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de Emisión de Título</p>
        <p className="font-medium text-gray-800">{formatearFecha(datosAcademicos?.fecha_emision_titulo)}</p>
      </div>

      {/* Modal para edición */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Editar información académica"
        maxWidth="max-w-3xl"
      >
        {localFormData && (
          <InfoColegiado
            formData={localFormData}
            onInputChange={handleLocalInputChange}
            validationErrors={{}}
            isProfileEdit={false}
            isEditMode={true}
            onSave={handleSaveChanges}
          />
        )}
      </Modal>
    </motion.div>
  );
}