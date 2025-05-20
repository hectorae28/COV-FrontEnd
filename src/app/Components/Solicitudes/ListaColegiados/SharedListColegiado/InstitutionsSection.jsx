"use client";

import { motion } from "framer-motion";
import { Briefcase, Pencil } from "lucide-react";
import { useState } from "react";

import Modal from "@/Components/Solicitudes/ListaColegiados/Modal";
import InfoLaboral from "@/app/(Registro)/InfoLab";

export default function InstitutionsSection({
  instituciones,
  setInstituciones,
  updateColegiadoPendiente,
  pendienteId,
  setCambiosPendientes,
  readonly = false
}) {
  // Nuevo estado para modal
  const [showModal, setShowModal] = useState(false);

  // Manejador para guardar cambios
  const handleSaveChanges = (updates) => {
    // Extraer instituciones actualizadas
    const updatedInstituciones = updates.laboralRegistros || [];

    // Actualizar estado local
    setInstituciones(updatedInstituciones);

    // Enviar al backend
    updateColegiadoPendiente(pendienteId, { instituciones: updatedInstituciones });

    // Marcar como guardado
    setCambiosPendientes(false);

    // Cerrar modal
    setShowModal(false);
  };

  // Obtener nombre del tipo de institución
  const getInstitucionTypeName = (code) => {
    const institucionesList = [
      { code: "ASP", name: "Agencias de Salud Pública" },
      { code: "CAA", name: "Centros de Atención Ambulatoria" },
      { code: "CC", name: "Clínicas" },
      { code: "CDP", name: "Consultorios" },
      { code: "EO", name: "Escuelas y Facultades de Odontología" },
      { code: "FAP", name: "Fuerzas Armadas y Servicios Penitenciarios" },
      { code: "FMD", name: "Fabricación de Materiales y Equipos Dentales" },
      { code: "HD", name: "Hospitales" },
      { code: "LDC", name: "Laboratorio" },
      { code: "OT", name: "Otros" },
      { code: "PMSB", name: "Programas Móviles de Salud Bucal" },
      { code: "UI", name: "Universidades e Institutos de Investigación" },
    ];
    const institucion = institucionesList.find(inst => inst.code === code);
    return institucion ? institucion.name : code;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-5 border-b pb-3">
        <div className="flex items-center">
          <Briefcase size={20} className="text-[#C40180] mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            Instituciones donde trabaja
          </h2>
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

      {/* Vista de instituciones */}
      {instituciones && instituciones.length > 0 ? (
        <div className="space-y-6">
          {instituciones.map((institucion, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-md mb-4 last:mb-0"
            >
              <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center">
                <Briefcase size={16} className="mr-2 text-[#C40180]" />
                {institucion.nombre}
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Tipo De Institución
                  </p>
                  <p className="font-medium text-gray-800">
                    {getInstitucionTypeName(institucion.tipo_institucion) || "No especificado"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Cargo
                  </p>
                  <p className="font-medium text-gray-800">
                    {institucion.cargo || "No especificado"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Teléfono
                  </p>
                  <p className="font-medium text-gray-800">
                    {institucion.telefono || "No especificado"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Dirección
                  </p>
                  <p className="font-medium text-gray-800">
                    {institucion.direccion || "No especificada"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md text-gray-500 italic flex items-center justify-center h-32">
          <div className="text-center">
            <Briefcase size={24} className="mx-auto mb-2 text-gray-400" />
            No hay instituciones registradas
          </div>
        </div>
      )}

      {/* Modal para edición */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Editar instituciones"
        maxWidth="max-w-4xl"
      >
        <InfoLaboral
          formData={{
            workStatus: "labora",
            laboralRegistros: instituciones
          }}
          onInputChange={handleSaveChanges}
          validationErrors={{}}
          currentStep={4}
          attemptedNext={false}
          validateStep={() => true}
          isEditMode={true}
        />
      </Modal>
    </motion.div>
  );
}