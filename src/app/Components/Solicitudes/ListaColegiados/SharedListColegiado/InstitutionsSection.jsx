"use client";

import InfoLaboralWithDireccionForm from "@/app/(Registro)/InfoLabWithDireccionForm";
import { motion } from "framer-motion";
import { Briefcase, Eye, FileText, MapPin, Pencil, Phone } from "lucide-react";
import { useState } from "react";

import Modal from "@/Components/Solicitudes/ListaColegiados/Modal";
import VerificationSwitch from "../VerificationSwitch";

export default function InstitutionsSection({
  pendiente,
  instituciones,
  setInstituciones,
  updateData,
  pendienteId,
  setCambiosPendientes,
  readOnly = false,
  isAdmin = false
}) {
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [localFormData, setLocalFormData] = useState(null);
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
  console.log({instituciones})

  // Formatear dirección completa
  const formatearDireccion = (institucion) => {
    if (!institucion) return "No especificada";

    const direccion = institucion.direccion || institucion.institutionAddress || "";

    if (direccion) {
      return `${direccion.municipio_nombre}, ${direccion.estado_nombre} - ${direccion.referencia}`;

    } else {
      return "No especificada";
    }
  };

  // Función para abrir documentos en nueva pestaña
  const openDocument = (documentUrl) => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  };

  // Extraer los valores iniciales para el formulario de edición
  const getInitialFormData = () => {
    const workStatus = instituciones && instituciones.length > 0 ? "labora" : "noLabora";

    // Si hay instituciones, adaptarlas al formato de laboralRegistros
    const laboralRegistros = instituciones && instituciones.length > 0
      ? instituciones.map((inst, index) => ({
        id: index + 1,
        institutionType: inst.tipo_institucion || inst.institutionType || "",
        institutionName: inst.nombre || inst.institutionName || "",
        institutionAddress: inst.direccion.referencia || "",
        institutionPhone: inst.telefono || inst.institutionPhone || "",
        cargo: inst.cargo || "",
        id_direccion: inst.direccion.id || "",
        selectedEstado: inst.direccion.estado || "",
        NameEstado: inst.direccion.estado_nombre || "",
        selectedMunicipio: inst.direccion.municipio || "",
        NameMunicipio: inst.direccion.municipio_nombre || "",
        verification_status: inst.verification_status || undefined,
        rejection_reason: inst.rejection_reason || '',
        constancia_trabajo: inst.constancia_trabajo || null
      }))
      : [];

    return {
      workStatus,
      laboralRegistros,
      // Añadir campos individuales por compatibilidad (usando la primera institución si existe)
      ...(laboralRegistros.length > 0 ? laboralRegistros[0] : {})
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
    console.log(updatedData);
    // Si no está laborando, limpiar instituciones
    if (dataToUpdate.workStatus === "noLabora") {
      setInstituciones([]);
      updateData(pendienteId, { instituciones: [] });
    } else {
      const updatedInstituciones = dataToUpdate.laboralRegistros.map(reg => ({
        id: reg?.id,
        tipo_institucion: reg.institutionType,
        nombre: reg.institutionName,
        direccion: {
          id: reg.id_direccion,
          estado: reg.selectedEstado,
          municipio: reg.selectedMunicipio,
          referencia: reg.institutionAddress,
          estado_nombre: reg.NameEstado,
          municipio_nombre: reg.NameMunicipio
        },
        telefono: reg.institutionPhone,
        cargo: reg.cargo,
        selectedEstado: reg.selectedEstado,
        selectedMunicipio: reg.selectedMunicipio,
        verificado: reg.verification_status || undefined,
        motivo_rechazo: reg.rejection_reason || '',
        constancia_trabajo: reg.constancia_trabajo || null
      }));

      setInstituciones(updatedInstituciones);
      updateData(pendienteId, { instituciones: updatedInstituciones });
    }

    setLocalFormData(null);
    setShowModal(false);
    setCambiosPendientes(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLocalFormData(null);
    setCambiosPendientes(false);
  };

  // Manejar cambio de estado de verificación de instituciones
  const handleInstitutionStatusChange = (updatedInstitution, index) => {
    console.log(updatedInstitution);
    console.log(index);
    const updatedInstituciones = [...instituciones];
    updatedInstituciones[index] = {
      ...updatedInstituciones[index],
      verificado: updatedInstitution.verificado,
      motivo_rechazo: updatedInstitution.motivo_rechazo || ''
    };

    setInstituciones(updatedInstituciones);
    // Actualizar en backend
    const updateData_verification = {
      instituciones: updatedInstituciones,
    };

    updateData(pendienteId, updateData_verification);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6 md:col-span-2 border border-gray-100 mb-6"
    >
      <div className="flex items-center justify-between mb-5 border-b pb-3">
        <div className="flex items-center">
          <Briefcase size={20} className="text-[#C40180] mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            Instituciones donde trabaja
          </h2>
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

              {/* 1ra línea: Tipo de institución y Nombre de institución */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                    Nombre de institución
                  </p>
                  <p className="font-medium text-gray-800">
                    {institucion.nombre || institucion.institutionName || "No especificado"}
                  </p>
                </div>
              </div>

              {/* 2da línea: Cargo y Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                    Teléfono de Institución
                  </p>
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2 text-[#C40180]" />
                    <p className="font-medium text-gray-800">
                      {institucion.telefono || institucion.institutionPhone || "No especificado"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3ra línea: Estado y Municipio/Parroquia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Estado
                  </p>
                  <p className="font-medium text-gray-800">
                    {institucion.direccion.estado_nombre || "No especificado"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Municipio/Parroquia
                  </p>
                  <p className="font-medium text-gray-800">
                    {institucion.direccion.municipio_nombre || "No especificado"}
                  </p>
                </div>
              </div>

              {/* 4ta línea: Dirección */}
              <div className="mb-4">
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

              {/* 5ta línea: Constancia de Trabajo */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Constancia de Trabajo
                </p>
                {institucion.constancia_trabajo ? (
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#C40180]" />
                    <span className="font-medium text-gray-800 flex-1">
                      Constancia subida
                    </span>
                    <button
                      onClick={() => openDocument(institucion.constancia_trabajo)}
                      className="px-3 py-1 bg-[#C40180] text-white rounded-md hover:bg-[#A0016B] transition-colors flex items-center gap-1 text-sm"
                      title="Ver constancia de trabajo"
                    >
                      <Eye size={14} />
                      Ver
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <FileText size={16} className="text-gray-400" />
                    <span className="italic">No se ha subido constancia</span>
                  </div>
                )}
              </div>

              {/* Switch de verificación para admin */}
              {isAdmin && !readOnly && (
                <div className="pt-4 border-t border-gray-200">
                  <VerificationSwitch
                    item={institucion}
                    type="institucion"
                    onChange={handleInstitutionStatusChange}
                    index={index}
                  />
                </div>
              )}
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
        onClose={handleCloseModal}
        title="Editar instituciones donde trabaja"
        maxWidth="max-w-4xl"
      >
        {localFormData && (
          <InfoLaboralWithDireccionForm
            formData={localFormData}
            onInputChange={handleLocalInputChange}
            validationErrors={{}}
            isEditMode={true}
            onSave={handleSaveChanges}
          />
        )}
      </Modal>
    </motion.div>
  );
}