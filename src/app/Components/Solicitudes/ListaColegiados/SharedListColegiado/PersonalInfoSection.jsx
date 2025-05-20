"use client";

import { motion } from "framer-motion";
import { Clock, Pencil, User } from "lucide-react";
import { useState } from "react";

import SessionInfo from "@/Components/SessionInfo";
import Modal from "@/Components/Solicitudes/ListaColegiados/Modal";
import InfoPersonal from "@/app/(Registro)/InfoPers";

export default function PersonalInfoSection({
  props
}) {
  const {
    pendiente,
    datosPersonales,
    setDatosPersonales,
    updateData,
    pendienteId,
    setCambiosPendientes,
    readOnly = false
  } = props;

  // Nuevo estado para el modal
  const [showModal, setShowModal] = useState(false);

  // Extraer los valores iniciales para el formulario de edición
  const getInitialFormData = () => {
    return {
      documentType: datosPersonales?.nacionalidad === "extranjera" ? "pasaporte" : "cedula",
      identityCard: datosPersonales?.identificacion?.split('-')[1] || "",
      idType: datosPersonales?.identificacion?.split('-')[0] || "V",
      firstName: datosPersonales?.nombre || "",
      secondName: datosPersonales?.segundo_nombre || "",
      firstLastName: datosPersonales?.primer_apellido || "",
      secondLastName: datosPersonales?.segundo_apellido || "",
      birthDate: datosPersonales?.fecha_de_nacimiento || "",
      gender: datosPersonales?.genero || "",
      maritalStatus: datosPersonales?.estado_civil || ""
    };
  };

  // Manejador para guardar cambios desde el modal
  const handleSaveChanges = (updates) => {
    // Construir el objeto de persona actualizado
    const updatedPersona = {
      ...datosPersonales,
      nombre: updates.firstName,
      segundo_nombre: updates.secondName,
      primer_apellido: updates.firstLastName,
      segundo_apellido: updates.secondLastName,
      nacionalidad: updates.documentType === "pasaporte" ? "extranjera" : "venezolana",
      identificacion: updates.documentType === "pasaporte"
        ? updates.identityCard
        : `${updates.idType}-${updates.identityCard}`,
      fecha_de_nacimiento: updates.birthDate,
      genero: updates.gender,
      estado_civil: updates.maritalStatus
    };

    // Actualizar estado local
    setDatosPersonales(updatedPersona);

    // Guardar en el backend
    updateData(pendienteId, { persona: updatedPersona });

    // Indicar que los cambios se han guardado
    setCambiosPendientes(false);

    // Cerrar modal
    setShowModal(false);
  };

  // Función para capitalizar texto
  const capitalizeText = (text) => {
    if (!text) return "";
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Formatear el nombre completo para mostrar
  const nombreCompleto = datosPersonales ?
    `${datosPersonales.nombre || ''} ${datosPersonales.segundo_nombre || ''} ${datosPersonales.primer_apellido || ''} ${datosPersonales.segundo_apellido || ''}`.trim()
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
    >
      {/* Información del creador */}
      {pendiente?.creador && (
        <div className="pt-6 mb-8">
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

      <div className="flex items-center justify-between mb-5 border-b pb-3">
        <div className="flex items-center">
          <User size={20} className="text-[#C40180] mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Información personal</h2>
        </div>

        {!readOnly && (
          <button
            onClick={() => setShowModal(true)}
            className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:opacity-90 transition-colors"
          >
            <Pencil size={16} className="mr-1" />
            Editar
          </button>
        )}
      </div>

      {/* Vista de información personal - sin información de contacto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Primera columna */}
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Nombre completo</p>
          <p className="font-medium text-gray-800">{nombreCompleto}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {datosPersonales?.nacionalidad === "extranjera" ? "Pasaporte" : "Cédula"}
          </p>
          <p className="font-medium text-gray-800">
            {datosPersonales?.identificacion}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de nacimiento</p>
          <p className="font-medium text-gray-800">{datosPersonales?.fecha_de_nacimiento
            ? new Date(datosPersonales.fecha_de_nacimiento).toLocaleDateString('es-ES')
            : "No especificada"}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Estado civil</p>
          <p className="font-medium text-gray-800">
            {datosPersonales?.estado_civil
              ? capitalizeText(datosPersonales.estado_civil)
              : "No especificado"}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Género</p>
          <p className="font-medium text-gray-800">
            {datosPersonales?.genero
              ? capitalizeText(datosPersonales.genero)
              : "No especificado"}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Tipo de documento</p>
          <p className="font-medium text-gray-800">
            {datosPersonales?.nacionalidad === "extranjera" ? "Pasaporte" : "Cédula de identidad"}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Primer nombre</p>
          <p className="font-medium text-gray-800">{datosPersonales?.nombre || "No especificado"}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Segundo nombre</p>
          <p className="font-medium text-gray-800">{datosPersonales?.segundo_nombre || "No especificado"}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Primer apellido</p>
          <p className="font-medium text-gray-800">{datosPersonales?.primer_apellido || "No especificado"}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Segundo apellido</p>
          <p className="font-medium text-gray-800">{datosPersonales?.segundo_apellido || "No especificado"}</p>
        </div>
      </div>

      {/* Modal para edición */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Editar información personal"
        maxWidth="max-w-3xl"
      >
        <InfoPersonal
          formData={getInitialFormData()}
          onInputChange={handleSaveChanges}
          validationErrors={{}}
          currentStep={1}
          attemptedNext={false}
          validateStep={() => true}
          isEditMode={true}
        />
      </Modal>
    </motion.div>
  );
}