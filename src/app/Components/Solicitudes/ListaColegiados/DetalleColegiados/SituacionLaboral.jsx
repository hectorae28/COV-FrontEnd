"use client";

import InfoLaboralWithDireccionForm from "@/app/(Registro)/InfoLabWithDireccionForm";
import { motion } from "framer-motion";
import { Briefcase, Eye, FileText, MapPin, Pencil, Phone } from "lucide-react";
import { useState } from "react";

import Modal from "@/Components/Solicitudes/ListaColegiados/Modal";
import VerificationSwitch from "@/Components/Solicitudes/ListaColegiados/VerificationSwitch";

export default function SituacionLaboral({
  pendiente,
  instituciones,
  setInstituciones,
  updateData,
  pendienteId,
  setCambiosPendientes,
  readOnly = false,
  isAdmin = false,
  isColegiado = false,
  pendienteData = null,
  entityData = null
}) {
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [localFormData, setLocalFormData] = useState(null);
  
  // Estado para controlar qué vista mostrar
  const [vistaActiva, setVistaActiva] = useState("actuales");

  // ✅ DETERMINAR FUENTE DE DATOS: Compatibilidad dual (solo para instituciones)
  const sourceData = pendienteData || entityData || pendiente;
  
  // Función para mapear códigos a IDs numéricos que espera el backend
  const getTipoInstitucionId = (code) => {
    const tipoInstitucionMap = {
      "ISPU": 1,
      "ISPV": 2,
      
    };
    return tipoInstitucionMap[code] || 6; // Default a CDP (6) si no se encuentra
  };

  // Obtener nombre del tipo de institución
  const getInstitucionTypeName = (code) => {
    const institucionesList = [
      { code: "ISPU", name: "Instituto de Salud Pública" },
      { code: "ISPV", name: "Instituto de Salud Pública Veterinaria" },
    ];
    const institucion = institucionesList.find(inst => inst.code === code);
    return institucion ? institucion.name : code;
  };

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

  // Filtrar instituciones por estado (activo/inactivo)
  const institucionesActuales = instituciones?.filter(inst => 
    inst.estado_laboral !== "anterior" && inst.estado_laboral !== "inactivo"
  ) || [];
  
  const institucionesAnteriores = instituciones?.filter(inst => 
    inst.estado_laboral === "anterior" || inst.estado_laboral === "inactivo"
  ) || [];

  // Determinar qué instituciones mostrar según la vista activa
  const institucionesToShow = vistaActiva === "actuales" ? institucionesActuales : institucionesAnteriores;

  // Extraer los valores iniciales para el formulario de edición
  const getInitialFormData = () => {
    const workStatus = instituciones?.length > 0 ? "labora" : "noLabora";

    // Si hay instituciones, adaptarlas al formato de laboralRegistros
    const laboralRegistros = instituciones?.length > 0
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
        constancia_trabajo: inst.constancia_trabajo || null,
        estado_laboral: inst.estado_laboral || "actual"
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
    
    // Si no está laborando, limpiar instituciones
    if (dataToUpdate.workStatus === "noLabora") {
      console.log("📤 Enviando datos laborales - NO LABORA:", { instituciones: [] });
      
      // ✅ ACTUALIZAR ESTADO LOCAL según tipo
      if (setInstituciones) {
        setInstituciones([]);
      }
      updateData(pendienteId, { instituciones: [] });
    } else {
      // 🔄 NUEVO FORMATO: Enviar en el mismo formato que el registro
      const institucionesForBackend = dataToUpdate.laboralRegistros.map((registro, index) => ({
        nombre: registro.institutionName,
        cargo: registro.cargo,
        direccion: {
          estado: Number(registro.selectedEstado),
          municipio: Number(registro.selectedMunicipio),
          referencia: registro.institutionAddress
        },
        telefono: registro.institutionPhone,
        tipo_institucion: registro.institutionType,
        // Campos adicionales para mantener compatibilidad con vista
        //id: registro?.id,
        verificado: registro.verification_status,
        motivo_rechazo: registro.rejection_reason || '',
        // Si es un archivo nuevo, enviar nombre de campo, si es URL string mantenerla, si es null mantener null
        constancia_trabajo: registro.constancia_trabajo && typeof registro.constancia_trabajo !== 'string' 
          ? `constancia_trabajo_${index}` 
          : registro.constancia_trabajo || null,
        estado_laboral: registro.estado_laboral || "actual"
      }));

      console.log("📤 Enviando datos laborales - FORMATO BACKEND:", {
        instituciones: institucionesForBackend,
        cantidadInstituciones: institucionesForBackend.length
      });

      // Para mostrar en la vista, mantener el formato original
      const institucionesForView = dataToUpdate.laboralRegistros.map(reg => ({
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
        constancia_trabajo: reg.constancia_trabajo || null,
        estado_laboral: reg.estado_laboral || "actual"
      }));

      // ✅ ACTUALIZAR ESTADO LOCAL según tipo (mantener formato para vista)
      if (setInstituciones) {
        setInstituciones(institucionesForView);
      }

      // 🚀 ENVIAR AL BACKEND en formato correcto
      const dataToSend = { instituciones: institucionesForBackend };
      
      // Agregar constancias de trabajo como archivos separados si existen
      const hasFiles = dataToUpdate.laboralRegistros.some(reg => 
        reg.constancia_trabajo && typeof reg.constancia_trabajo !== 'string'
      );

      if (hasFiles) {
        const formData = new FormData();
        
        // Agregar instituciones como JSON
        formData.append('instituciones', JSON.stringify(institucionesForBackend));
        
        // Agregar constancias de trabajo con nombres únicos que coincidan con la referencia en el JSON
        dataToUpdate.laboralRegistros.forEach((registro, index) => {
          if (registro.constancia_trabajo && typeof registro.constancia_trabajo !== 'string') {
            formData.append(`constancia_trabajo_${index}`, registro.constancia_trabajo);
            console.log(`📎 Agregando constancia_trabajo_${index}:`, registro.constancia_trabajo.name);
          }
        });

        console.log("📤 Enviando con archivos (FormData)", formData);
        updateData(pendienteId, formData, true); // true indica que contiene archivos
      } else {
        console.log("📤 Enviando solo JSON (sin archivos nuevos)");
        updateData(pendienteId, dataToSend);
      }

      // Log para verificar estructura enviada
      console.log("✅ Datos preparados para backend:", {
        totalInstituciones: institucionesForBackend.length,
        formatoEstructura: institucionesForBackend[0] || "Sin instituciones",
        tieneArchivos: hasFiles
      });
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
    const institucionesToUpdate = vistaActiva === "actuales" ? institucionesActuales : institucionesAnteriores;
    const allInstituciones = [...instituciones];
    
    // Encontrar el índice real en el array completo
    const realIndex = allInstituciones.findIndex(inst => 
      inst.id === institucionesToUpdate[index].id || 
      (inst.nombre === institucionesToUpdate[index].nombre && 
       inst.cargo === institucionesToUpdate[index].cargo)
    );

    if (realIndex !== -1) {
      allInstituciones[realIndex] = {
        ...allInstituciones[realIndex],
        verificado: updatedInstitution.verificado,
        motivo_rechazo: updatedInstitution.motivo_rechazo || ''
      };

      // ✅ ACTUALIZAR ESTADO LOCAL según tipo
      if (setInstituciones) {
        setInstituciones(allInstituciones);
      }
      
      // Actualizar en backend
      const updateData_verification = {
        instituciones: allInstituciones,
      };

      updateData(pendienteId, updateData_verification);
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
            Situación Laboral
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

      {/* Selector de vista */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setVistaActiva("actuales")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              vistaActiva === "actuales"
                ? "bg-white text-[#C40180] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Instituciones Actuales
            {institucionesActuales.length > 0 && (
              <span className="ml-2 bg-[#C40180] text-white text-xs px-2 py-1 rounded-full">
                {institucionesActuales.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setVistaActiva("anteriores")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              vistaActiva === "anteriores"
                ? "bg-white text-[#C40180] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Trabajos Anteriores
            {institucionesAnteriores.length > 0 && (
              <span className="ml-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                {institucionesAnteriores.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Vista de instituciones */}
      {institucionesToShow && institucionesToShow.length > 0 ? (
        <div className="space-y-6">
          {institucionesToShow.map((institucion, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-md mb-4 last:mb-0"
            >
              <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center">
                <Briefcase size={16} className="mr-2 text-[#C40180]" />
                {institucion.nombre || institucion.institutionName || "Institución sin nombre"}
                {vistaActiva === "anteriores" && (
                  <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    Anterior
                  </span>
                )}
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

              {/* Switch de verificación para admin (solo para instituciones actuales) */}
              {isAdmin && !readOnly && vistaActiva === "actuales" && (
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
            {vistaActiva === "actuales" 
              ? "No hay instituciones actuales registradas"
              : "No hay trabajos anteriores registrados"
            }
          </div>
        </div>
      )}

      {/* Modal para edición */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Editar situación laboral"
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