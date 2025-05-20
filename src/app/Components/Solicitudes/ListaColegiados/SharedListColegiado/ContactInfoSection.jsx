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

  // Manejador para guardar cambios
  const handleSaveChanges = (updates) => {
    // Construir objeto actualizado
    const updatedContacto = {
      ...datosContacto,
      email: updates.email,
      phoneNumber: updates.phoneNumber,
      countryCode: updates.countryCode,
      homePhone: updates.homePhone,
      address: updates.address,
      city: updates.city,
      state: updates.state
    };

    // Actualizar estado local
    setDatosContacto(updatedContacto);

    // Enviar al backend - adaptar según la estructura esperada por tu API
    updateData(pendienteId, {
      persona: {
        ...pendiente.persona,
        correo: updates.email,
        telefono_movil: `${updates.countryCode} ${updates.phoneNumber}`,
        telefono_de_habitacion: updates.homePhone,
        direccion: {
          ...pendiente.persona.direccion,
          referencia: updates.address,
          estado: updates.state,
          ciudad: updates.city
        }
      }
    });

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
            onClick={() => setShowModal(true)}
            className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:opacity-90 transition-colors"
          >
            <Pencil size={16} className="mr-1" />
            Editar
          </button>
        )}
      </div>

      {/* Vista de información de contacto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="bg-gray-50 p-3 rounded-md">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
      Correo electrónico
    </p>
    <div className="flex items-center">
      <Mail className="text-[#C40180] h-4 w-4 mr-2" />
      <p className="font-medium text-gray-800">{datosContacto?.email || "No especificado"}</p>
    </div>
  </div>

  <div className="bg-gray-50 p-3 rounded-md">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
      Teléfono móvil
    </p>
    <div className="flex items-center">
      <Phone className="text-[#C40180] h-4 w-4 mr-2" />
      <p className="font-medium text-gray-800">
        {datosContacto?.countryCode} {datosContacto?.phoneNumber || "No especificado"}
      </p>
    </div>
  </div>

  <div className="bg-gray-50 p-3 rounded-md">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
      Teléfono fijo
    </p>
    <div className="flex items-center">
      <Phone className="text-[#C40180] h-4 w-4 mr-2" />
      <p className="font-medium text-gray-800">{datosContacto?.homePhone || "No especificado"}</p>
    </div>
  </div>

  <div className="bg-gray-50 p-3 rounded-md">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Estado</p>
    <p className="font-medium text-gray-800">{datosContacto?.state || "No especificado"}</p>
  </div>

  <div className="bg-gray-50 p-3 rounded-md">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Ciudad/Municipio</p>
    <p className="font-medium text-gray-800">{datosContacto?.city || "No especificada"}</p>
  </div>

  <div className="bg-gray-50 p-3 rounded-md md:col-span-3">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Dirección</p>
    <div className="flex items-start">
      <MapPin className="text-[#C40180] h-4 w-4 mr-2 mt-1" />
      <p className="font-medium text-gray-800">{datosContacto?.address || "No especificada"}</p>
    </div>
  </div>
</div>

      {/* Modal para edición */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Editar información de contacto"
        maxWidth="max-w-3xl"
      >
        <InfoContacto
          formData={getInitialFormData()}
          onInputChange={handleSaveChanges}
          validationErrors={{}}
          isEditMode={true}
        />
      </Modal>
    </motion.div>
  );
}