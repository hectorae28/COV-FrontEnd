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
  
  // Estado para cambios temporales durante la edición
  const [tempFormData, setTempFormData] = useState(null);
  
  // Estado local para formulario directo
  const [localFormData, setLocalFormData] = useState(null);

  // Extraer valores iniciales para el formulario
  const getInitialFormData = () => {
    return {
      tipo_profesion: pendiente?.tipo_profesion || "",
      graduateInstitute: datosAcademicos?.instituto_bachillerato || "",
      universityTitle: datosAcademicos?.universidad || "",
      universityState: datosAcademicos?.estado_universidad || "",
      mainRegistrationNumber: datosAcademicos?.num_registro_principal || "",
      mainRegistrationDate: datosAcademicos?.fecha_registro_principal || "",
      mppsRegistrationNumber: datosAcademicos?.num_mpps || "",
      mppsRegistrationDate: datosAcademicos?.fecha_mpps || "",
      titleIssuanceDate: datosAcademicos?.fecha_egreso_universidad || "",
      observaciones: datosAcademicos?.observaciones || ""
    };
  };
  
  // Inicializar datos locales cuando se abre el modal
  const handleOpenModal = () => {
    setLocalFormData(getInitialFormData());
    setShowModal(true);
  };
  
  // Función para manejar cambios en el formulario local
  const handleLocalInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setCambiosPendientes(true);
  };

  // Manejador para guardar cambios
  const handleSaveChanges = (updates) => {
    // Usar datos locales si estamos editando directamente
    const dataToUpdate = localFormData || updates;
    
    // Construir objeto actualizado
    const updatedData = {
      instituto_bachillerato: dataToUpdate.graduateInstitute,
      universidad: dataToUpdate.universityTitle,
      estado_universidad: dataToUpdate.universityState,
      num_registro_principal: dataToUpdate.mainRegistrationNumber,
      fecha_registro_principal: dataToUpdate.mainRegistrationDate,
      num_mpps: dataToUpdate.mppsRegistrationNumber,
      fecha_mpps: dataToUpdate.mppsRegistrationDate,
      fecha_egreso_universidad: dataToUpdate.titleIssuanceDate,
      observaciones: dataToUpdate.observaciones
    };

    // Actualizar estado local
    setDatosAcademicos(updatedData);
    setTempFormData(null);
    setLocalFormData(null);

    // Enviar al backend - solo pasar los datos al componente padre
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
            onClick={handleOpenModal}
            className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:opacity-90 transition-colors"
          >
            <Pencil size={16} className="mr-1" />
            Editar
          </button>
        )}
      </div>

      {/* Vista de información académica con layout mejorado */}
      <div className="space-y-6">
        {/* Primera sección: Tipo de profesión y Instituto de bachillerato */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tipo de profesión/ocupación */}
          {pendiente?.tipo_profesion && (
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Tipo de Profesión</p>
              <p className="font-medium text-gray-800">
                {tempFormData?.tipo_profesion || (
                  pendiente?.tipo_profesion === "odontologo" ? "Odontólogo" : 
                  pendiente?.tipo_profesion === "trabajador" ? "Trabajador" : pendiente?.tipo_profesion
                )}
              </p>
            </div>
          )}

          {/* Instituto de bachillerato */}
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Instituto de bachillerato</p>
            <p className="font-medium text-gray-800">
              {tempFormData?.graduateInstitute || datosAcademicos?.instituto_bachillerato || "No especificado"}
            </p>
          </div>
        </div>
        
        {/* Segunda sección: Universidad y Estado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Universidad */}
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Universidad</p>
            <p className="font-medium text-gray-800">
              {tempFormData?.universityTitle || (
                typeof datosAcademicos?.universidad === 'object' 
                ? (datosAcademicos?.universidad?.titulo || "No especificada") 
                : (datosAcademicos?.universidad || "No especificada")
              )}
            </p>
          </div>

          {/* Estado de la Universidad */}
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Estado de la Universidad</p>
            <p className="font-medium text-gray-800">
              {tempFormData?.universityState || datosAcademicos?.estado_universidad || "No especificado"}
            </p>
          </div>
        </div>

        {/* Tercera sección: Fecha de egreso */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Fecha de egreso */}
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de egreso</p>
            <p className="font-medium text-gray-800">
              {tempFormData?.titleIssuanceDate 
                ? formatearFecha(tempFormData.titleIssuanceDate)
                : formatearFecha(datosAcademicos?.fecha_egreso_universidad)
              }
            </p>
          </div>
          
          {/* Espacio vacío para alineación si es necesario */}
          {pendiente?.tipo_profesion !== "odontologo" && <div></div>}
        </div>

        {/* Campos específicos para odontólogos */}
        {pendiente?.tipo_profesion === "odontologo" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número de registro principal</p>
              <p className="font-medium text-gray-800">
                {tempFormData?.mainRegistrationNumber || datosAcademicos?.num_registro_principal || "No especificado"}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de registro principal</p>
              <p className="font-medium text-gray-800">
                {tempFormData?.mainRegistrationDate 
                  ? formatearFecha(tempFormData.mainRegistrationDate)
                  : formatearFecha(datosAcademicos?.fecha_registro_principal)
                }
              </p>
            </div>
          </div>
        )}

        {/* Cuarta sección: Número y Fecha MPPS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Número MPPS */}
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Número MPPS</p>
            <p className="font-medium text-gray-800">
              {tempFormData?.mppsRegistrationNumber || datosAcademicos?.num_mpps || "No especificado"}
            </p>
          </div>

          {/* Fecha MPPS */}
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha MPPS</p>
            <p className="font-medium text-gray-800">
              {tempFormData?.mppsRegistrationDate 
                ? formatearFecha(tempFormData.mppsRegistrationDate)
                : formatearFecha(datosAcademicos?.fecha_mpps)
              }
            </p>
          </div>
        </div>

        {/* Quinta sección: Observaciones */}
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Observaciones</p>
          <p className="font-medium text-gray-800">
            {tempFormData?.observaciones || datosAcademicos?.observaciones || "Ninguna"}
          </p>
        </div>
      </div>

      {/* Modal para edición con formulario directo sin restricciones */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setTempFormData(null);
          setLocalFormData(null);
        }}
        title="Editar información académica"
        maxWidth="max-w-4xl"
      >
        {localFormData && (
          <div className="space-y-6">
            {/* Instituto de bachillerato */}
            <div>
              <label className="block mb-2 text-sm font-medium text-[#41023B]">
                Instituto de bachillerato
              </label>
              <input
                type="text"
                name="graduateInstitute"
                value={localFormData.graduateInstitute}
                onChange={handleLocalInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                placeholder="Nombre del instituto"
              />
            </div>
            
            {/* Universidad y Estado de la universidad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  Universidad
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="universityTitle"
                  value={localFormData.universityTitle}
                  onChange={handleLocalInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                  placeholder="Nombre de la universidad"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  Estado de la universidad
                </label>
                <input
                  type="text"
                  name="universityState"
                  value={localFormData.universityState}
                  onChange={handleLocalInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                  placeholder="Estado donde se ubica la universidad"
                />
              </div>
            </div>
            
            {/* Fecha de egreso */}
            <div>
              <label className="block mb-2 text-sm font-medium text-[#41023B]">
                Fecha de egreso
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                name="titleIssuanceDate"
                value={localFormData.titleIssuanceDate ? localFormData.titleIssuanceDate.split('T')[0] : ""}
                onChange={handleLocalInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
              />
            </div>
            
            {/* Campos específicos para odontólogos */}
            {pendiente?.tipo_profesion === "odontologo" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-[#41023B]">
                    Número de registro principal
                  </label>
                  <input
                    type="text"
                    name="mainRegistrationNumber"
                    value={localFormData.mainRegistrationNumber}
                    onChange={handleLocalInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                    placeholder="Número de registro principal"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-[#41023B]">
                    Fecha de registro principal
                  </label>
                  <input
                    type="date"
                    name="mainRegistrationDate"
                    value={localFormData.mainRegistrationDate ? localFormData.mainRegistrationDate.split('T')[0] : ""}
                    onChange={handleLocalInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                  />
                </div>
              </div>
            )}
            
            {/* Número MPPS y Fecha MPPS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  Número MPPS
                </label>
                <input
                  type="text"
                  name="mppsRegistrationNumber"
                  value={localFormData.mppsRegistrationNumber}
                  onChange={handleLocalInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                  placeholder="Número MPPS"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  Fecha MPPS
                </label>
                <input
                  type="date"
                  name="mppsRegistrationDate"
                  value={localFormData.mppsRegistrationDate ? localFormData.mppsRegistrationDate.split('T')[0] : ""}
                  onChange={handleLocalInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                />
              </div>
            </div>
            
            {/* Observaciones */}
            <div>
              <label className="block mb-2 text-sm font-medium text-[#41023B]">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={localFormData.observaciones}
                onChange={handleLocalInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                rows="3"
                placeholder="Observaciones adicionales"
              ></textarea>
            </div>
            
            {/* Botón de guardar */}
            <div className="flex justify-end pt-4 border-t mt-6">
              <button
                onClick={() => handleSaveChanges(null)}
                className="cursor-pointer flex items-center px-5 py-2.5 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-xl text-base font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-colors"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        )}

        {/* Usar el componente original como respaldo */}
        {!localFormData && (
          <InfoColegiado
            formData={getInitialFormData()}
            onInputChange={(updates) => {
              // Almacenar cambios temporales para previsualización
              setTempFormData(prev => ({
                ...prev,
                ...updates
              }));
              // Marcar que hay cambios pendientes
              setCambiosPendientes(true);
            }}
            validationErrors={{}}
            currentStep={3}
            attemptedNext={false}
            validateStep={() => true}
            isEditMode={true}
            onSave={handleSaveChanges}
          />
        )}
      </Modal>
    </motion.div>
  );
}