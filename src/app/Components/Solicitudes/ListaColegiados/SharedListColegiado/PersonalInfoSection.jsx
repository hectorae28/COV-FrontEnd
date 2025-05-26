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

  // Estados para el modal, siguiendo el patrón de AcademicInfoSection
  const [showModal, setShowModal] = useState(false);
  const [tempFormData, setTempFormData] = useState(null);
  const [localFormData, setLocalFormData] = useState(null);

  // Extraer los valores iniciales para el formulario de edición
  const getInitialFormData = () => {
    return {
      documentType: datosPersonales?.nacionalidad === "extranjera" ? "pasaporte" : "cedula",
      identityCard: datosPersonales?.identificacion?.substring(0, 1) || "",
      idType: datosPersonales?.identificacion?.substring(1) || "V",
      firstName: datosPersonales?.nombre || "",
      secondName: datosPersonales?.segundo_nombre || "",
      firstLastName: datosPersonales?.primer_apellido || "",
      secondLastName: datosPersonales?.segundo_apellido || "",
      birthDate: datosPersonales?.fecha_de_nacimiento || "",
      gender: datosPersonales?.genero || "",
      maritalStatus: datosPersonales?.estado_civil || ""
    };
  };

  const handleOpenModal = () => {
    setLocalFormData(getInitialFormData());
    setShowModal(true);
  };

  const handleLocalInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setCambiosPendientes(true);
  };

  const handleSaveChanges = (updates) => {
    const dataToUpdate = localFormData || updates;
    const updatedPersona = {
      ...datosPersonales,
      nombre: dataToUpdate.firstName,
      segundo_nombre: dataToUpdate.secondName,
      primer_apellido: dataToUpdate.firstLastName,
      segundo_apellido: dataToUpdate.secondLastName,
      nacionalidad: dataToUpdate.documentType === "pasaporte" ? "extranjera" : "venezolana",
      identificacion: dataToUpdate.documentType === "pasaporte"
        ? dataToUpdate.identityCard
        : `${dataToUpdate.idType}-${dataToUpdate.identityCard}`,
      fecha_de_nacimiento: dataToUpdate.birthDate,
      genero: dataToUpdate.gender,
      estado_civil: dataToUpdate.maritalStatus
    };

    setDatosPersonales(updatedPersona);
    setTempFormData(null);
    setLocalFormData(null);
    updateData(pendienteId, { persona: updatedPersona });
    setShowModal(false);
  };

  const capitalizeText = (text) => {
    if (!text) return "";
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

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
      transition={{ delay: 0.1 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100"
    >
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
            onClick={handleOpenModal}
            className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:opacity-90 transition-colors"
          >
            <Pencil size={16} className="mr-1" />
            Editar
          </button>
        )}
      </div>

      {/* Vista de información personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Primera fila - Tipo de documento e identificación */}
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Tipo de documento
          </p>
          <p className="font-medium text-gray-800">
            {tempFormData?.documentType === "pasaporte" ? "Pasaporte" :
              (datosPersonales?.nacionalidad === "extranjera" ? "Pasaporte" : "Cédula de identidad")}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {(tempFormData?.documentType || datosPersonales?.nacionalidad === "extranjera") ? "Pasaporte" : "Cédula"}
          </p>
          <p className="font-medium text-gray-800">
            {tempFormData ?
              (tempFormData.documentType === "pasaporte" ?
                tempFormData.identityCard :
                `${tempFormData.idType || "V"}-${tempFormData.identityCard}`) :
              datosPersonales?.identificacion}
          </p>
        </div>

        {/* Segunda fila - Nombres */}
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Primer nombre</p>
          <p className="font-medium text-gray-800">{tempFormData?.firstName || datosPersonales?.nombre || "No especificado"}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Segundo nombre</p>
          <p className="font-medium text-gray-800">{tempFormData?.secondName || datosPersonales?.segundo_nombre || "No especificado"}</p>
        </div>

        {/* Tercera fila - Apellidos */}
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Primer apellido</p>
          <p className="font-medium text-gray-800">{tempFormData?.firstLastName || datosPersonales?.primer_apellido || "No especificado"}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Segundo apellido</p>
          <p className="font-medium text-gray-800">{tempFormData?.secondLastName || datosPersonales?.segundo_apellido || "No especificado"}</p>
        </div>
      </div>

      {/* Cuarta fila - Fecha de nacimiento, género y estado civil */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de nacimiento</p>
          <p className="font-medium text-gray-800">{formatearFecha(tempFormData?.birthDate || datosPersonales?.fecha_de_nacimiento)}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Género</p>
          <p className="font-medium text-gray-800">
            {tempFormData?.gender ?
              capitalizeText(tempFormData.gender) :
              (datosPersonales?.genero ? capitalizeText(datosPersonales.genero) : "No especificado")}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Estado civil</p>
          <p className="font-medium text-gray-800">
            {tempFormData?.maritalStatus ?
              capitalizeText(tempFormData.maritalStatus) :
              (datosPersonales?.estado_civil ? capitalizeText(datosPersonales.estado_civil) : "No especificado")}
          </p>
        </div>
      </div>

      {/* Modal para edición con formulario directo sin validaciones restrictivas */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setTempFormData(null);
          setLocalFormData(null);
        }}
        title="Editar información personal"
        maxWidth="max-w-3xl"
      >
        {localFormData && (
          <div className="space-y-6">
            {/* Tipo de documento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  Tipo de documento
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="documentType"
                  value={localFormData.documentType}
                  onChange={handleLocalInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                >
                  <option value="cedula">Cédula de identidad</option>
                  <option value="pasaporte">Pasaporte</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  {localFormData.documentType === "pasaporte" ? "Pasaporte" : "Cédula"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex">
                  {localFormData.documentType !== "pasaporte" && (
                    <select
                      name="idType"
                      value={localFormData.idType}
                      onChange={handleLocalInputChange}
                      className="w-20 px-2 py-3 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                    >
                      <option value="V">V</option>
                      <option value="E">E</option>
                    </select>
                  )}
                  <input
                    type="text"
                    name="identityCard"
                    value={localFormData.identityCard}
                    onChange={handleLocalInputChange}
                    className={`w-full px-4 py-3 border border-gray-200 ${localFormData.documentType !== "pasaporte" ? "rounded-r-xl" : "rounded-xl"} focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                    placeholder={localFormData.documentType === "pasaporte" ? "Ingrese su pasaporte" : "Ingrese su cédula"}
                  />
                </div>
              </div>
            </div>

            {/* Nombres */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  Primer Nombre
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={localFormData.firstName}
                  onChange={handleLocalInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                  placeholder="Ingrese su primer nombre"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  Segundo Nombre
                </label>
                <input
                  type="text"
                  name="secondName"
                  value={localFormData.secondName}
                  onChange={handleLocalInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                  placeholder="Ingrese su segundo nombre"
                />
              </div>
            </div>

            {/* Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  Primer Apellido
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="firstLastName"
                  value={localFormData.firstLastName}
                  onChange={handleLocalInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                  placeholder="Ingrese su primer apellido"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  Segundo Apellido
                </label>
                <input
                  type="text"
                  name="secondLastName"
                  value={localFormData.secondLastName}
                  onChange={handleLocalInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                  placeholder="Ingrese su segundo apellido"
                />
              </div>
            </div>

            {/* Fecha de nacimiento, género y estado civil */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  Fecha de Nacimiento
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={localFormData.birthDate ? localFormData.birthDate.split('T')[0] : ""}
                  onChange={handleLocalInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  Género
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="gender"
                  value={localFormData.gender}
                  onChange={handleLocalInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                >
                  <option value="" disabled>Seleccionar Género</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  Estado Civil
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="maritalStatus"
                  value={localFormData.maritalStatus}
                  onChange={handleLocalInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                >
                  <option value="" disabled>Seleccionar Estado Civil</option>
                  <option value="soltero">Soltero</option>
                  <option value="casado">Casado</option>
                  <option value="divorciado">Divorciado</option>
                  <option value="viudo">Viudo</option>
                </select>
              </div>
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

        {/* Usar el componente original como respaldo si localFormData no está listo */}
        {!localFormData && (
          <InfoPersonal
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
            isProfileEdit={false}
            isEditMode={true}
            onSave={handleSaveChanges}
          />
        )}
      </Modal>
    </motion.div>
  );
}