"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Pencil, Phone } from "lucide-react";
import { useState } from "react";

import EmailVerification from "@/app/(Registro)/EmailVerification";
import InfoContacto from "@/app/(Registro)/InfoCont";
import Modal from "@/Components/Solicitudes/ListaColegiados/Modal";

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
  
  // Estados para verificación de correo
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState("");
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false); // Nuevo estado para mostrar confirmación

  // Función para formatear el número de teléfono al mostrarse
  const formatPhoneNumber = (phoneNumber, countryCode) => {
    if (!phoneNumber) return "No especificado";
    
    // Si phoneNumber viene con código incluido (ej: "+584123456789")
    if (phoneNumber.startsWith("+")) {
      return phoneNumber;
    }
    
    // Si phoneNumber es solo el número
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
      emailVerified: true, // En modo edición, el correo siempre está verificado inicialmente
      emailIsValid: true, // Para validación interna
      originalEmail: datosContacto?.email || "" // Guardar el correo original para comparar
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

  // Función para manejar la solicitud de verificación de correo
  const handleRequestEmailVerification = (email) => {
    setEmailToVerify(email);
    setShowEmailVerification(true);
  };

  // Función para manejar el éxito de la verificación
  const handleEmailVerificationSuccess = () => {
    setLocalFormData(prev => ({
      ...prev,
      emailVerified: true,
      emailChanged: false
    }));
    setShowEmailVerification(false);
    setEmailVerified(true); // Activar estado de confirmación
  };

  // Función para confirmar y guardar después de la verificación
  const handleConfirmSave = () => {
    setEmailVerified(false);
    handleSaveChanges();
  };

  // Función para volver de la verificación de correo
  const handleBackFromEmailVerification = () => {
    setShowEmailVerification(false);
  };

  // Función para reenviar código de verificación
  const handleResendVerificationCode = async () => {
    setIsResendingCode(true);
    try {
      await postDataUsuario("send-verification-email", {
        email: emailToVerify
      });
    } catch (error) {
      console.error("Error al reenviar código:", error);
    } finally {
      setIsResendingCode(false);
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
    setShowEmailVerification(false);
    setEmailVerified(false);
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
        {localFormData && !showEmailVerification && !emailVerified && (
          <InfoContacto
            formData={localFormData}
            onInputChange={handleLocalInputChange}
            validationErrors={{}}
            isProfileEdit={false}
            isEditMode={true}
            onSave={handleSaveChanges}
            requestEmailVerification={handleRequestEmailVerification}
            isAdmin={false}
          />
        )}
        
        {showEmailVerification && (
          <EmailVerification
            email={emailToVerify}
            onVerificationSuccess={handleEmailVerificationSuccess}
            onGoBack={handleBackFromEmailVerification}
            isResending={isResendingCode}
            onResendCode={handleResendVerificationCode}
          />
        )}

        {emailVerified && !showEmailVerification && (
          <div className="space-y-6 py-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Correo Verificado</h3>
              <p className="text-gray-600">
                Su correo electrónico ha sido verificado exitosamente.
                Ahora puede confirmar los cambios para guardar la información.
              </p>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  setEmailVerified(false);
                  setShowEmailVerification(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="cursor-pointer flex items-center px-5 py-2.5 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white
                  rounded-xl text-base font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}