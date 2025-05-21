"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Pencil, Phone } from "lucide-react";
import { useState } from "react";

import Modal from "@/Components/Solicitudes/ListaColegiados/Modal";
import InfoLaboral from "@/app/(Registro)/InfoLab";

export default function InstitutionsSection({
  pendiente,
  instituciones,
  setInstituciones,
  nuevaInstitucion,
  setNuevaInstitucion,
  agregarInstitucion,
  setAgregarInstitucion,
  updateColegiadoPendiente,
  pendienteId,
  setCambiosPendientes,
  readonly = false
}) {
  // Estados para modal y validación
  const [showModal, setShowModal] = useState(false);
  const [tempInstituciones, setTempInstituciones] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [attemptedSave, setAttemptedSave] = useState(false);

  // Manejador para guardar cambios
  const handleSaveChanges = (updates) => {
    // Si updates.laboralRegistros existe, usar eso, sino usar tempInstituciones
    const updatedInstituciones = updates?.laboralRegistros || tempInstituciones || [];
    
    // Validar datos
    if (!validateInstituciones(updatedInstituciones)) {
      setAttemptedSave(true);
      return; // No guardar si hay errores
    }
    
    // Actualizar estado local
    setInstituciones(updatedInstituciones);
    setTempInstituciones(null);

    // Enviar datos al componente padre
    updateColegiadoPendiente(pendienteId, { 
      instituciones: updatedInstituciones,
      workStatus: "labora"
    });

    // Marcar como guardado
    setCambiosPendientes(false);

    // Cerrar modal
    setShowModal(false);
  };

  // Validar instituciones
  const validateInstituciones = (instituciones) => {
    if (!instituciones || instituciones.length === 0) {
      // Si no hay instituciones, es válido (el usuario puede no estar laborando)
      return true;
    }

    // Para cada institución, validar los campos requeridos
    const requiredFields = ["institutionName", "institutionAddress", "institutionPhone", "cargo", "institutionType"];
    
    const errors = {};
    let isValid = true;

    instituciones.forEach((institucion, index) => {
      requiredFields.forEach(field => {
        if (!institucion[field] || institucion[field].trim() === "") {
          errors[`${field}_${index}`] = true;
          isValid = false;
        }
      });
    });

    setValidationErrors(errors);
    return isValid;
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

  // Formatear dirección completa
  const formatearDireccion = (institucion) => {
    if (!institucion) return "No especificada";
    
    const direccion = institucion.direccion || institucion.institutionAddress || "";
    const estado = institucion.selectedEstado || "";
    const ciudad = institucion.selectedCiudad || "";
    
    if (estado && ciudad && direccion) {
      return `${ciudad}, ${estado} - ${direccion}`;
    } else if (direccion) {
      return direccion;
    } else {
      return "No especificada";
    }
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
                {institucion.nombre || institucion.institutionName || "Institución sin nombre"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Tipo de institución
                  </p>
                  <p className="font-medium text-gray-800">
                    {getInstitucionTypeName(institucion.tipo_institucion || institucion.institutionType) || "No especificado"}
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
                    Estado
                  </p>
                  <p className="font-medium text-gray-800">
                    {institucion.selectedEstado || "No especificado"}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Ciudad/Municipio
                  </p>
                  <p className="font-medium text-gray-800">
                    {institucion.selectedCiudad || "No especificado"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Teléfono
                  </p>
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2 text-[#C40180]" />
                    <p className="font-medium text-gray-800">
                      {institucion.telefono || institucion.institutionPhone || "No especificado"}
                    </p>
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Dirección
                  </p>
                  <div className="flex items-start">
                    <MapPin size={16} className="mr-2 mt-0.5 text-[#C40180]" />
                    <p className="font-medium text-gray-800">
                      {formatearDireccion(institucion)}
                    </p>
                  </div>
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

      {/* Modal para edición utilizando InfoLaboral */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setTempInstituciones(null);
          setValidationErrors({});
          setAttemptedSave(false);
        }}
        title="Editar instituciones"
        maxWidth="max-w-4xl"
      >
        <InfoLaboral
          formData={{
            workStatus: "labora",
            laboralRegistros: instituciones
          }}
          onInputChange={(updates) => {
            if (updates.laboralRegistros) {
              setTempInstituciones(updates.laboralRegistros);
            }
            setCambiosPendientes(true);
          }}
          validationErrors={validationErrors}
          attemptedNext={attemptedSave}
          isEditMode={true}
          onSave={handleSaveChanges}
        />
      </Modal>
    </motion.div>
  );
}