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
  isAdmin,
  readOnly = false
}) {
  // Estado para modal
  const [showModal, setShowModal] = useState(false);

  // Estado para cambios temporales
  const [tempFormData, setTempFormData] = useState(null);
  
  // Estado local para formulario directo
  const [localFormData, setLocalFormData] = useState(null);

  // Extraer los valores iniciales para el formulario
  const getInitialFormData = () => {
    return {
      email: datosContacto?.email || "",
      phoneNumber: datosContacto?.phoneNumber || "",
      countryCode: datosContacto?.countryCode || "+58",
      homePhone: datosContacto?.homePhone || "",
      address: datosContacto?.address || "",
      city: datosContacto?.city || "",
      state: datosContacto?.state || ""
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
    // Usar los datos locales si estamos editando directamente
    const dataToUpdate = localFormData || updates;
    
    // Construir objeto actualizado
    const updatedContacto = {
      ...datosContacto,
      email: dataToUpdate.email,
      phoneNumber: dataToUpdate.phoneNumber,
      countryCode: dataToUpdate.countryCode,
      homePhone: dataToUpdate.homePhone,
      address: dataToUpdate.address,
      city: dataToUpdate.city,
      state: dataToUpdate.state
    };

    // Actualizar estado local
    setDatosContacto(updatedContacto);
    setTempFormData(null);
    setLocalFormData(null);

    // Enviar datos al componente padre (sin enviar a API)
    const dataToSend = {
      persona: {
        ...pendiente.persona,
        correo: dataToUpdate.email,
        telefono_movil: `${dataToUpdate.countryCode} ${dataToUpdate.phoneNumber}`,
        telefono_de_habitacion: dataToUpdate.homePhone,
        direccion: {
          ...pendiente.persona.direccion,
          referencia: dataToUpdate.address,
          estado: dataToUpdate.state,
          ciudad: dataToUpdate.city
        }
      }
    };
    updateData(pendienteId, dataToSend);

    // Marcar como guardado
    setCambiosPendientes(false);

    // Cerrar modal
    setShowModal(false);
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
          <Phone size={20} className="text-[#C40180] mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Información de contacto</h2>
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

      {/* Vista de información de contacto - en layout similar al formulario InfoCont */}
      <div className="space-y-6">
        {/* Email */}
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Correo electrónico
          </p>
          <div className="flex items-center">
            <Mail className="text-[#C40180] h-4 w-4 mr-2" />
            <p className="font-medium text-gray-800">{tempFormData?.email || datosContacto?.email || "No especificado"}</p>
          </div>
        </div>

        {/* Teléfonos en dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Teléfono móvil */}
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Teléfono móvil
            </p>
            <div className="flex items-center">
              <Phone className="text-[#C40180] h-4 w-4 mr-2" />
              <p className="font-medium text-gray-800">
                {tempFormData ? 
                  `${tempFormData.countryCode || "+"} ${tempFormData.phoneNumber || ""}` :
                  `${datosContacto?.countryCode} ${datosContacto?.phoneNumber || "No especificado"}`}
              </p>
            </div>
          </div>

          {/* Teléfono fijo */}
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Teléfono fijo
            </p>
            <div className="flex items-center">
              <Phone className="text-[#C40180] h-4 w-4 mr-2" />
              <p className="font-medium text-gray-800">{tempFormData?.homePhone || datosContacto?.homePhone || "No especificado"}</p>
            </div>
          </div>
        </div>

        {/* Estado y Ciudad/Municipio/Parroquia en dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Estado */}
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Estado</p>
            <p className="font-medium text-gray-800">{tempFormData?.state || datosContacto?.state || "No especificado"}</p>
          </div>

          {/* Ciudad/Municipio */}
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              {typeof (tempFormData?.state || datosContacto?.state) === 'string' && 
               (tempFormData?.state || datosContacto?.state).toLowerCase() === "distrito capital" ? "Parroquia" : "Municipio"}
            </p>
            <p className="font-medium text-gray-800">{tempFormData?.city || datosContacto?.city || "No especificada"}</p>
          </div>
        </div>

        {/* Dirección completa en una fila */}
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Dirección</p>
          <div className="flex items-start">
            <MapPin className="text-[#C40180] h-4 w-4 mr-2 mt-1" />
            <p className="font-medium text-gray-800">{tempFormData?.address || datosContacto?.address || "No especificada"}</p>
          </div>
        </div>
      </div>

      {/* Modal para edición con formulario directo */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setTempFormData(null);
          setLocalFormData(null);
        }}
        title="Editar información de contacto"
        maxWidth="max-w-3xl"
      >
        {localFormData && (
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-[#41023B]">
                Correo Electrónico
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={localFormData.email}
                  onChange={handleLocalInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                  placeholder="ejemplo@correo.com"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            {/* Teléfonos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Teléfono móvil */}
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  Número de Teléfono Móvil
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex">
                  <select
                    name="countryCode"
                    value={localFormData.countryCode}
                    onChange={handleLocalInputChange}
                    className="w-24 px-2 py-3 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                  >
                    <option value="+58">+58</option>
                    <option value="+1">+1</option>
                    <option value="+34">+34</option>
                    <option value="+57">+57</option>
                    <option value="+55">+55</option>
                    <option value="+56">+56</option>
                  </select>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={localFormData.phoneNumber}
                    onChange={handleLocalInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                    placeholder="Número de teléfono"
                  />
                </div>
              </div>
              
              {/* Teléfono fijo */}
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  Número de Teléfono Fijo
                </label>
                <input
                  type="text"
                  name="homePhone"
                  value={localFormData.homePhone}
                  onChange={handleLocalInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                  placeholder="Número de teléfono fijo"
                />
              </div>
            </div>
            
            {/* Estado y Ciudad/Municipio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Estado */}
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  Estado
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="state"
                  value={localFormData.state}
                  onChange={handleLocalInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                >
                  <option value="" disabled>Seleccionar Estado</option>
                  <option value="Amazonas">Amazonas</option>
                  <option value="Anzoátegui">Anzoátegui</option>
                  <option value="Apure">Apure</option>
                  <option value="Aragua">Aragua</option>
                  <option value="Barinas">Barinas</option>
                  <option value="Bolívar">Bolívar</option>
                  <option value="Carabobo">Carabobo</option>
                  <option value="Cojedes">Cojedes</option>
                  <option value="Delta Amacuro">Delta Amacuro</option>
                  <option value="Distrito Capital">Distrito Capital</option>
                  <option value="Falcón">Falcón</option>
                  <option value="Guárico">Guárico</option>
                  <option value="La Guaira">La Guaira</option>
                  <option value="Lara">Lara</option>
                  <option value="Mérida">Mérida</option>
                  <option value="Miranda">Miranda</option>
                  <option value="Monagas">Monagas</option>
                  <option value="Nueva Esparta">Nueva Esparta</option>
                  <option value="Portuguesa">Portuguesa</option>
                  <option value="Sucre">Sucre</option>
                  <option value="Táchira">Táchira</option>
                  <option value="Trujillo">Trujillo</option>
                  <option value="Yaracuy">Yaracuy</option>
                  <option value="Zulia">Zulia</option>
                </select>
              </div>
              
              {/* Ciudad/Municipio */}
              <div>
                <label className="block mb-2 text-sm font-medium text-[#41023B]">
                  {localFormData.state?.toLowerCase() === "distrito capital" ? "Parroquia" : "Municipio"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={localFormData.city}
                  onChange={handleLocalInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                  placeholder={localFormData.state?.toLowerCase() === "distrito capital" ? "Ingrese la parroquia" : "Ingrese el municipio"}
                />
              </div>
            </div>
            
            {/* Dirección */}
            <div>
              <label className="block mb-2 text-sm font-medium text-[#41023B]">
                Dirección completa
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="address"
                value={localFormData.address}
                onChange={handleLocalInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
                rows="3"
                placeholder="Ingrese la dirección completa"
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
          <InfoContacto
            formData={getInitialFormData()}
            onInputChange={(updates) => {
              // Almacenar cambios temporales para previsualización
              console.log("Cambios temporales en contacto:", updates);
              setTempFormData(prev => ({
                ...prev,
                ...updates
              }));
              // Marcar cambios pendientes
              setCambiosPendientes(true);
            }}
            validationErrors={{}}
            isEditMode={true}
            onSave={handleSaveChanges}
          />
        )}
      </Modal>
    </motion.div>
  );
}