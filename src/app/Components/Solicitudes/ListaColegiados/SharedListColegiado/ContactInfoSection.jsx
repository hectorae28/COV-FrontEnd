"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Pencil, Phone } from "lucide-react";
import { useState } from "react";

import Modal from "@/Components/Solicitudes/ListaColegiados/Modal";
import InfoContacto from "@/app/(Registro)/InfoCont";

export default function ContactInfoSection({
  pendiente,
  datosContacto,
  setDatosContacto,
  updateData,
  pendienteId,
  setCambiosPendientes,
  readOnly = false
}) {
  console.log({datosContacto})
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [localFormData, setLocalFormData] = useState(null);

  // Función para formatear el número de teléfono al mostrarse
  const formatPhoneNumber = (phoneNumber, countryCode) => {
    if (!phoneNumber) return "No especificado";
    return `${countryCode || "+58"} ${phoneNumber}`;
  };

  // Función de validación que faltaba
  const validateForm = () => {
    if (!localFormData) return false;

    const requiredFields = ["email", "phoneNumber", "state", "city", "address"];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Verificar campos requeridos
    const hasRequiredFields = requiredFields.every(field =>
      localFormData[field] && (typeof localFormData[field] === 'string' ? localFormData[field].trim() !== "" : true)
    );

    // Verificar email válido
    const isEmailValid = emailRegex.test(localFormData.email);

    // Verificar teléfono válido
    const isPhoneValid = localFormData.phoneNumber && localFormData.phoneNumber.length >= 10;

    return hasRequiredFields && isEmailValid && isPhoneValid;
  };

  // Extraer los valores iniciales para el formulario de edición
  const getInitialFormData = () => {
    return {
      email: datosContacto?.email || "",
      phoneNumber: datosContacto?.phoneNumber || "",
      countryCode: datosContacto?.countryCode || "+58",
      homePhone: datosContacto?.homePhone || "",
      state: datosContacto?.state || "",
      state_name: datosContacto?.state_name || "",
      city: datosContacto?.city || "",
      city_name: datosContacto?.city_name || "",
      municipio: datosContacto?.city || "", // Añadir para compatibilidad
      municipio_name: datosContacto?.city_name || "", // Añadir para compatibilidad
      address: datosContacto?.address || "",
      emailVerified: datosContacto?.emailVerified || false,
      emailIsValid: true // Para validación interna
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

  // Función ficticia para la verificación de correo
  const requestEmailVerification = (email) => {
    console.log("Solicitud de verificación para:", email);
    // Aquí iría la lógica real de verificación
    // Por ahora solo actualizamos el estado local
    if (localFormData) {
      setLocalFormData(prev => ({
        ...prev,
        emailVerified: true
      }));
    }
  };

  const handleSaveChanges = (updatedData = null) => {
    const dataToUpdate = updatedData || localFormData;

    // Validar antes de guardar
    if (!validateForm()) {
      console.warn("Formulario no válido");
      return;
    }

    const updatedContacto = {
      ...datosContacto,
      ...dataToUpdate
    };

    setDatosContacto(updatedContacto);
    setLocalFormData(null);
    updateData(pendienteId, { contacto: updatedContacto });
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
          <Mail size={20} className="text-[#C40180] mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Información de Contacto</h2>
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

      {/* Fila 1: Correo electrónico */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Correo electrónico
          </p>
          <div className="font-medium text-gray-800 flex items-center">
            <Mail size={14} className="mr-1 text-gray-400" />
            {datosContacto?.email || "No especificado"}
          </div>
        </div>
      </div>

      {/* Fila 2: Teléfonos móvil y de habitación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Teléfono móvil
          </p>
          <div className="font-medium text-gray-800 flex items-center">
            <Phone size={14} className="mr-1 text-gray-400" />
            {formatPhoneNumber(datosContacto?.phoneNumber, datosContacto?.countryCode)}
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Teléfono de habitación
          </p>
          <div className="font-medium text-gray-800 flex items-center">
            <Phone size={14} className="mr-1 text-gray-400" />
            {datosContacto?.homePhone || "No especificado"}
          </div>
        </div>
      </div>

      {/* Fila 3: Dirección de habitación */}
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Estado */}
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Estado
            </p>
            <p className="font-medium text-gray-800">
              {datosContacto?.state_name || "No especificado"}
            </p>
          </div>

          {/* Municipio / Parroquia */}
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Municipio / Parroquia
            </p>
            <p className="font-medium text-gray-800">
              {datosContacto?.city_name || "No especificado"}
            </p>
          </div>
        </div>

        {/* Dirección específica */}
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Dirección
          </p>
          <div className="font-medium text-gray-800 flex items-start">
            <MapPin size={14} className="mr-1 mt-1 text-gray-400" />
            <span>{datosContacto?.address || "No especificada"}</span>
          </div>
        </div>
      </div>

      {/* Modal para edición */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Editar Información de Contacto"
        maxWidth="max-w-3xl"
      >
        {localFormData && (
          <InfoContacto
            formData={localFormData}
            onInputChange={handleLocalInputChange}
            validationErrors={{}}
            isProfileEdit={false}
            isEditMode={true}
            onSave={handleSaveChanges}
            requestEmailVerification={requestEmailVerification}
            isAdmin={false}
          />
        )}
      </Modal>
    </motion.div>
  );
}