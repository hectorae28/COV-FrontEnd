import EstadoData from "@/Shared/EstadoData";
import institucionesList from "@/Shared/InstitucionesData";
import { motion } from "framer-motion";
import { Briefcase, BriefcaseBusiness, ChevronRight, Eye, FileText, Phone, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import DireccionForm from "./DireccionForm";

// Mayúsculas seguidas
const capitalizeWords = (text) => {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => /^[A-ZÁÉÍÓÚÜÑ.]+$/.test(word)
      ? word
      : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Primera letra mayúscula
const capitalizarPalabras = (texto) => {
  if (!texto) return "";
  return texto
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(' ');
};

const formatearTelefonoLocal = (value) => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (digits.length >= 4) {
    const areaCode = digits.substring(0, 4);
    const firstPart = digits.substring(4, 7);
    const secondPart = digits.substring(7, 11);
    if (digits.length <= 4) {
      return areaCode;
    } else if (digits.length <= 7) {
      return `${areaCode} ${firstPart}`;
    } else {
      return `${areaCode} ${firstPart} ${secondPart}`;
    }
  }
  return digits;
};

export default function InfoLaboralWithDireccionForm({ formData, onInputChange, validationErrors, attemptedNext, isEditMode = false, onSave }) {
  const [workStatus, setWorkStatus] = useState(formData.workStatus || "");
  const [localFormData, setLocalFormData] = useState(formData);
  const [showInitialSelection, setShowInitialSelection] = useState(!formData.workStatus);

  const [registros, setRegistros] = useState(
    formData.laboralRegistros && formData.laboralRegistros.length > 0
      ? formData.laboralRegistros.map(registro => {
        // Manejar diferentes estructuras de institutionAddress
        const getAddressData = (address) => {
          if (!address) return { referencia: "", estado: "", municipio: "" };

          // Si es un objeto con propiedades
          if (typeof address === 'object' && address.referencia !== undefined) {
            return {
              referencia: address.referencia || "",
              estado: address.estado || "",
              municipio: address.municipio || ""
            };
          }

          // Si es una string
          if (typeof address === 'string') {
            return {
              referencia: address,
              estado: "",
              municipio: ""
            };
          }

          return { referencia: "", estado: "", municipio: "" };
        };

        const addressData = getAddressData(registro.institutionAddress);

        return {
          ...registro,
          institutionName: capitalizarPalabras(registro.institutionName || ""),
          institutionAddress: capitalizeWords(addressData.referencia || registro.institutionAddress || ""),
          cargo: capitalizarPalabras(registro.cargo || ""),
          selectedEstado: registro.selectedEstado || addressData.estado || "",
          selectedMunicipio: registro.selectedMunicipio || addressData.municipio || "",
          NameEstado: registro.NameEstado || "",
          NameMunicipio: registro.NameMunicipio || "",
          constancia_trabajo: registro.constancia_trabajo || null
        };
      })
      : [
        {
          id: 1,
          id_direccion: formData.id_direccion,
          institutionType: formData.institutionType || "",
          institutionName: capitalizarPalabras(formData.institutionName || ""),
          institutionAddress: (() => {
            // Manejar institutionAddress del formData principal
            if (!formData.institutionAddress) return "";

            if (typeof formData.institutionAddress === 'object' && formData.institutionAddress.referencia !== undefined) {
              return capitalizeWords(formData.institutionAddress.referencia || "");
            }

            if (typeof formData.institutionAddress === 'string') {
              return capitalizeWords(formData.institutionAddress);
            }

            return "";
          })(),
          institutionPhone: formData.institutionPhone || "",
          cargo: capitalizarPalabras(formData.cargo || ""),
          selectedEstado: (() => {
            // Priorizar selectedEstado directo, luego institutionAddress.estado
            if (formData.selectedEstado) return formData.selectedEstado;
            if (formData.institutionAddress && typeof formData.institutionAddress === 'object') {
              return formData.institutionAddress.estado || "";
            }
            return "";
          })(),
          NameEstado: formData.NameEstado || "",
          selectedMunicipio: (() => {
            // Priorizar selectedMunicipio directo, luego institutionAddress.municipio
            if (formData.selectedMunicipio) return formData.selectedMunicipio;
            if (formData.institutionAddress && typeof formData.institutionAddress === 'object') {
              return formData.institutionAddress.municipio || "";
            }
            return "";
          })(),
          NameMunicipio: formData.NameMunicipio || "",
          constancia_trabajo: formData.constancia_trabajo || null
        }
      ]
  );

  // Estados para manejar municipios disponibles para cada registro
  const [municipiosDisponibles, setMunicipiosDisponibles] = useState({});

  // Actualizar el estado local cuando cambian las props
  useEffect(() => {
    setLocalFormData(formData);

    // Actualizar registros si cambian en las props
    if (formData.laboralRegistros && formData.laboralRegistros.length > 0) {
      setRegistros(formData.laboralRegistros.map(registro => {
        // Manejar diferentes estructuras de institutionAddress
        const getAddressData = (address) => {
          if (!address) return { referencia: "", estado: "", municipio: "" };

          // Si es un objeto con propiedades
          if (typeof address === 'object' && address.referencia !== undefined) {
            return {
              referencia: address.referencia || "",
              estado: address.estado || "",
              municipio: address.municipio || ""
            };
          }

          // Si es una string
          if (typeof address === 'string') {
            return {
              referencia: address,
              estado: "",
              municipio: ""
            };
          }

          return { referencia: "", estado: "", municipio: "" };
        };

        const addressData = getAddressData(registro.institutionAddress);

        return {
          ...registro,
          institutionName: capitalizarPalabras(registro.institutionName || ""),
          institutionAddress: capitalizeWords(addressData.referencia || registro.institutionAddress || ""),
          cargo: capitalizarPalabras(registro.cargo || ""),
          selectedEstado: registro.selectedEstado || addressData.estado || "",
          selectedMunicipio: registro.selectedMunicipio || addressData.municipio || "",
          NameEstado: registro.NameEstado || "",
          NameMunicipio: registro.NameMunicipio || "",
          constancia_trabajo: registro.constancia_trabajo || null
        };
      }));
    }
  }, [formData]);

  // Actualizar municipios disponibles cuando cambia el estado seleccionado
  useEffect(() => {
    const nuevosMunicipiosDisponibles = {};
    registros.forEach(registro => {
      if (registro.selectedEstado) {
        const estadoValue = typeof registro.selectedEstado === 'string'
          ? registro.selectedEstado
          : String(registro.selectedEstado);
        const estadoKey = estadoValue.toLowerCase();

        if (EstadoData[estadoKey]) {
          // Ordenar municipios alfabéticamente y capitalizar cada palabra
          nuevosMunicipiosDisponibles[registro.id] = EstadoData[estadoKey]
            .sort()
            .map(municipio => capitalizarPalabras(municipio));
        }
      }
    });
    setMunicipiosDisponibles(nuevosMunicipiosDisponibles);
  }, [registros]);

  // Actualizar workStatus cuando cambie en formData
  useEffect(() => {
    if (formData.workStatus !== undefined) {
      setWorkStatus(formData.workStatus);
      setShowInitialSelection(!formData.workStatus);
    }
  }, [formData.workStatus]);

  const handleWorkStatusChange = (value) => {
    setWorkStatus(value);
    setShowInitialSelection(false);

    if (value === "noLabora") {
      const updatedData = {
        workStatus: value,
        institutionType: "N/A",
        institutionName: "N/A",
        institutionAddress: "N/A",
        institutionPhone: "N/A",
        cargo: "N/A",
        selectedEstado: "N/A",
        selectedMunicipio: "N/A",
        laboralRegistros: []
      };

      if (isEditMode) {
        setLocalFormData(updatedData);
        setRegistros([]);
      } else {
        onInputChange(updatedData);
      }
    } else {
      // Si cambia a "Laborando", restauramos los registros
      const updatedData = {
        workStatus: value,
        laboralRegistros: registros
      };

      if (isEditMode) {
        setLocalFormData(prev => ({
          ...prev,
          ...updatedData
        }));
      } else {
        onInputChange(updatedData);
      }
    }
  };

  const handleRegistroChange = (index, field, value) => {
    const nuevosRegistros = [...registros];
    const registro = nuevosRegistros[index];

    if (field === "institutionName" || field === "cargo") {
      value = capitalizarPalabras(value);
    } else if (field === "institutionPhone") {
      value = formatearTelefonoLocal(value);
    } else if (field === "selectedEstado") {
      // Al cambiar el estado, resetear la ciudad
      registro.selectedMunicipio = "";
    }

    registro[field] = value;
    setRegistros(nuevosRegistros);

    const updatedData = { laboralRegistros: nuevosRegistros };

    if (index === 0) {
      updatedData[field] = value;
    }

    if (isEditMode) {
      setLocalFormData(prev => ({
        ...prev,
        ...updatedData
      }));
    } else {
      onInputChange(updatedData);
    }
  };

  const handleDireccionChange = (index, updates) => {
    const nuevosRegistros = [...registros];
    const registro = { ...nuevosRegistros[index] };

    // Aplicar las actualizaciones
    Object.keys(updates).forEach(key => {
      if (key === "institutionAddress") {
        registro[key] = capitalizeWords(updates[key]);
      } else {
        registro[key] = updates[key];
      }
    });

    nuevosRegistros[index] = registro;
    setRegistros(nuevosRegistros);

    const updatedData = { laboralRegistros: nuevosRegistros };

    // Si es el primer registro, también actualizar los campos principales
    if (index === 0) {
      Object.keys(updates).forEach(key => {
        updatedData[key] = registro[key];
      });
    }

    if (isEditMode) {
      setLocalFormData(prev => ({ ...prev, ...updatedData }));
    } else {
      onInputChange(updatedData);
    }
  };

  // Función para manejar la subida de archivos de constancia de trabajo
  const handleConstanciaChange = (index, file) => {
    if (file) {
      // Validar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo no puede ser mayor a 5MB");
        return;
      }

      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert("Solo se permiten archivos JPG, PNG o PDF");
        return;
      }

      handleRegistroChange(index, 'constancia_trabajo', file);
    }
  };

  // Función para abrir el archivo en una nueva pestaña
  const openFilePreview = (file) => {
    if (file) {
      if (typeof file === 'string') {
        // Si es una URL (archivo ya subido)
        window.open(file, '_blank');
      } else {
        // Si es un objeto File
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
        // Limpiar la URL después de un tiempo para liberar memoria
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    }
  };

  // Agregar un nuevo registro laboral
  const agregarRegistro = () => {
    const nuevoId = registros.length > 0 ? Math.max(...registros.map(r => r.id)) + 1 : 1;
    const nuevosRegistros = [
      ...registros,
      {
        id: nuevoId,
        id_direccion: null,
        institutionType: "",
        institutionName: "",
        institutionAddress: "",
        institutionPhone: "",
        cargo: "",
        selectedEstado: "",
        selectedMunicipio: "",
        NameEstado: "",
        NameMunicipio: "",
        constancia_trabajo: null
      }
    ];
    setRegistros(nuevosRegistros);

    const updatedData = { laboralRegistros: nuevosRegistros };

    if (isEditMode) {
      setLocalFormData(prev => ({
        ...prev,
        ...updatedData
      }));
    } else {
      onInputChange(updatedData);
    }
  };

  // Eliminar un registro
  const eliminarRegistro = (index) => {
    if (registros.length > 1) {
      const nuevosRegistros = [...registros];
      nuevosRegistros.splice(index, 1);
      setRegistros(nuevosRegistros);

      const updatedData = { laboralRegistros: nuevosRegistros };

      // Si se elimina el primer registro, actualizar los campos principales
      if (index === 0 && nuevosRegistros.length > 0) {
        Object.assign(updatedData, {
          institutionType: nuevosRegistros[0].institutionType,
          institutionName: nuevosRegistros[0].institutionName,
          institutionAddress: nuevosRegistros[0].institutionAddress,
          institutionPhone: nuevosRegistros[0].institutionPhone,
          cargo: nuevosRegistros[0].cargo,
          selectedEstado: nuevosRegistros[0].selectedEstado,
          selectedMunicipio: nuevosRegistros[0].selectedMunicipio,
          NameEstado: nuevosRegistros[0].NameEstado,
          NameMunicipio: nuevosRegistros[0].NameMunicipio,
          constancia_trabajo: nuevosRegistros[0].constancia_trabajo
        });
      }

      if (isEditMode) {
        setLocalFormData(prev => ({
          ...prev,
          ...updatedData
        }));
      } else {
        onInputChange(updatedData);
      }
    }
  };

  // ARREGLAR: Validación mejorada para múltiples registros
  const isFieldEmpty = (registro, fieldName) => {
    if (workStatus === "noLabora") {
      return false;
    }
    if (!validationErrors) return false;

    const registroIndex = registros.findIndex(r => r.id === registro.id);

    // Para el primer registro, usar validationErrors del formulario principal
    if (registroIndex === 0) {
      return validationErrors[fieldName];
    }

    // Para registros adicionales, verificar si hay error específico para este registro
    const errorKey = `${fieldName}_${registro.id}`;
    if (validationErrors[errorKey]) {
      return true;
    }

    // Validación adicional: verificar si el campo está vacío
    // Esto ayuda a mostrar errores inmediatamente mientras el usuario escribe
    if (!registro[fieldName] || (typeof registro[fieldName] === 'string' && registro[fieldName].trim() === "")) {
      // Solo mostrar error si ya se intentó enviar el formulario
      return attemptedNext || validationErrors[fieldName];
    }

    return false;
  };

  const handleSaveClick = () => {
    if (workStatus === "labora" && registros.length > 0) {
      // Validar cada registro
      let hasErrors = false;
      const newErrors = {};

      registros.forEach((registro, index) => {
        const requiredFields = ["institutionName", "institutionType", "institutionAddress", "selectedEstado", "selectedMunicipio", "cargo", "institutionPhone", "constancia_trabajo"];

        requiredFields.forEach(field => {
          // Validación especial para archivos
          if (field === "constancia_trabajo") {
            if (!registro[field]) {
              if (index === 0) {
                newErrors[field] = true;
              } else {
                newErrors[`${field}_${registro.id}`] = true;
              }
              hasErrors = true;
            }
          } else {
            // Validación normal para otros campos
            if (!registro[field] || (typeof registro[field] === 'string' && registro[field].trim() === "")) {
              if (index === 0) {
                newErrors[field] = true;
              } else {
                newErrors[`${field}_${registro.id}`] = true;
              }
              hasErrors = true;
            }
          }
        });
      });

      if (hasErrors) {
        // Si hay errores, actualizar validationErrors (esto requeriría un callback del padre)
        console.error("Debe completar todos los campos requeridos para cada institución");
        return;
      }

      const updatedData = {
        workStatus: workStatus,
        laboralRegistros: registros
      };

      if (onSave && isEditMode) {
        onSave(updatedData);
      } else if (onInputChange) {
        onInputChange(updatedData);
      }
    } else if (workStatus === "noLabora") {
      const updatedData = {
        workStatus: "noLabora",
        laboralRegistros: []
      };

      if (onSave && isEditMode) {
        onSave(updatedData);
      } else if (onInputChange) {
        onInputChange(updatedData);
      }
    }
  };

  // Pantalla inicial de selección
  if (showInitialSelection) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Mensaje principal */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[#D7008A] to-[#41023B] rounded-full mx-auto flex items-center justify-center mb-6">
            <BriefcaseBusiness className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-[#41023B] mb-4">
            Situación Laboral Actual
          </h2>

          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Para continuar con su proceso de colegiación, necesitamos conocer su situación laboral actual.
            Por favor, seleccione la opción que mejor describa su estado:
          </p>
        </div>

        {/* Opciones de selección */}
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opción: Laborando */}
            <motion.button
              type="button"
              onClick={() => handleWorkStatusChange("labora")}
              className="group relative p-8 bg-white border-2 border-gray-200 rounded-xl hover:border-[#D7008A] hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#D7008A] to-[#41023B] rounded-full mx-auto flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <BriefcaseBusiness className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#41023B] mb-2">
                  Actualmente Laborando
                </h3>
                <p className="text-gray-600 text-sm">
                  Estoy ejerciendo mi profesión en una o más instituciones
                </p>
                <div className="mt-4 flex items-center justify-center text-[#D7008A] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium mr-2">Continuar</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.button>

            {/* Opción: No Laborando */}
            <motion.button
              type="button"
              onClick={() => handleWorkStatusChange("noLabora")}
              className="group relative p-8 bg-white border-2 border-gray-200 rounded-xl hover:border-[#D7008A] hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                  <Briefcase className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#41023B] mb-2">
                  No Laborando Actualmente
                </h3>
                <p className="text-gray-600 text-sm">
                  No estoy ejerciendo mi profesión en este momento
                </p>
                <div className="mt-4 flex items-center justify-center text-[#D7008A] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium mr-2">Continuar</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Formulario principal (se muestra después de seleccionar)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        {/* Mostrar estado seleccionado */}
        <div className="flex items-center mb-4 sm:mb-0">
          <div className={`w-3 h-3 rounded-full mr-3 ${workStatus === "labora" ? "bg-green-500" : "bg-gray-500"}`}></div>
          <span className="text-lg font-medium text-[#41023B]">
            {workStatus === "labora" ? "Actualmente laborando" : "No laborando actualmente"}
          </span>
        </div>

        {/* Botón para cambiar selección */}
        <button
          type="button"
          onClick={() => setShowInitialSelection(true)}
          className="text-sm text-[#D7008A] hover:text-[#41023B] font-medium underline"
        >
          Cambiar selección
        </button>
      </div>

      {workStatus === "labora" && (
        <>
          {registros.map((registro, index) => (
            <div
              key={registro.id}
              className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#41023B] font-semibold text-lg">
                  {index === 0 ? "Información Laboral Principal" : `Institución Adicional ${index}`}
                </h3>
                {registros.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarRegistro(index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
                    Tipo de Institución
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="institutionType"
                      value={registro.institutionType}
                      onChange={(e) =>
                        handleRegistroChange(
                          index,
                          "institutionType",
                          e.target.value
                        )
                      }
                      className={`w-full px-4 py-3 border ${isFieldEmpty(registro, "institutionType")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
                    >
                      <option value="" disabled className="text-gray-500">
                        Seleccionar Tipo de Institución
                      </option>
                      {institucionesList.map((tipo, i) => (
                        <option key={i} value={tipo.code}>
                          {tipo.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  {isFieldEmpty(registro, "institutionType") && (
                    <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
                    Nombre de Institución
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={registro.institutionName}
                    onChange={(e) => handleRegistroChange(index, "institutionName", e.target.value)}
                    className={`w-full px-4 py-3 border ${isFieldEmpty(registro, "institutionName") ? "border-red-500 bg-red-50" : "border-gray-200"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                    placeholder="Nombre de la institución donde presta servicio"
                  />
                  {isFieldEmpty(registro, "institutionName") && (
                    <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
                    Cargo
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={registro.cargo}
                    onChange={(e) => handleRegistroChange(index, "cargo", e.target.value)}
                    className={`w-full px-4 py-3 border ${isFieldEmpty(registro, "cargo") ? "border-red-500 bg-red-50" : "border-gray-200"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                    placeholder="Cargo o posición que ocupa"
                  />
                  {isFieldEmpty(registro, "cargo") && (
                    <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
                    Teléfono de Institución
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={registro.institutionPhone || ''}
                      onChange={(e) => handleRegistroChange(index, "institutionPhone", e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border ${isFieldEmpty(registro, "institutionPhone") ? "border-red-500 bg-red-50" : "border-gray-200"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                      placeholder="0212 123 4567"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {isFieldEmpty(registro, "institutionPhone") && (
                    <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
                  )}
                </div>
              </div>

              {/* Campo de Constancia de Trabajo - Ancho completo */}
              <div className="w-full mt-4">
                <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
                  Constancia de Trabajo
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className={`cursor-pointer flex-1 px-4 py-3 border-2 border-dashed ${isFieldEmpty(registro, "constancia_trabajo")
                        ? "border-red-500 bg-red-50"
                        : registro.constancia_trabajo
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 bg-gray-50"
                      } rounded-xl hover:bg-gray-100 transition-colors`}>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleConstanciaChange(index, e.target.files[0])}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-2">
                        <Upload size={20} className={
                          registro.constancia_trabajo
                            ? "text-green-600"
                            : "text-gray-400"
                        } />
                        <span className={`text-sm font-medium ${registro.constancia_trabajo
                            ? "text-green-700"
                            : "text-gray-600"
                          }`}>
                          {registro.constancia_trabajo
                            ? (typeof registro.constancia_trabajo === 'string'
                              ? "Constancia subida"
                              : registro.constancia_trabajo.name)
                            : "Subir constancia de trabajo"
                          }
                        </span>
                      </div>
                    </label>

                    {registro.constancia_trabajo && (
                      <button
                        type="button"
                        onClick={() => openFilePreview(registro.constancia_trabajo)}
                        className="px-3 py-3 bg-[#D7008A] text-white rounded-xl hover:bg-[#B8006F] transition-colors flex items-center gap-1"
                        title="Ver documento"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                  </div>

                  {registro.constancia_trabajo && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <FileText size={16} />
                      <span>
                        {typeof registro.constancia_trabajo === 'string'
                          ? "Documento cargado correctamente"
                          : `${registro.constancia_trabajo.name} (${(registro.constancia_trabajo.size / 1024 / 1024).toFixed(2)} MB)`
                        }
                      </span>
                    </div>
                  )}

                  {isFieldEmpty(registro, "constancia_trabajo") && (
                    <p className="text-xs text-red-500">Este campo es obligatorio</p>
                  )}

                  <p className="text-xs text-gray-500">
                    Suba la constancia de trabajo de esta institución. Formatos permitidos: JPG, PNG, PDF (máx. 5MB)
                  </p>
                </div>
              </div>

              <DireccionForm
                formData={registro}
                onInputChange={(updates) => handleDireccionChange(index, updates)}
                isFieldEmpty={(fieldName) => isFieldEmpty(registro, fieldName)}
                isEditMode={false}
                localFormData={localFormData}
                setLocalFormData={setLocalFormData}
                fieldMapping={{
                  state: "selectedEstado",
                  municipio: "selectedMunicipio",
                  address: "institutionAddress",
                }}
                title="Dirección de Institución"
                addressPlaceholder="Calle, Avenida, Edificio, Piso, Oficina"
                attemptedNext={attemptedNext}
                municipiosDisponibles={municipiosDisponibles[registro.id] || []}
              />
            </div>
          ))}

          {/* Botón para agregar nuevo registro */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={agregarRegistro}
              className="px-4 py-2 bg-white border border-[#D7008A] text-[#D7008A] rounded-lg flex items-center gap-1 hover:bg-[#D7008A] hover:text-white transition-colors duration-300"
            >
              <Plus size={18} />
              Agregar otra institución
            </button>
          </div>

          {/* Explicación */}
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Información importante</h3>
            <p className="text-xs text-blue-600">
              Debe completar al menos la información de una institución donde presta servicio.
              Puede agregar tantas instituciones como sea necesario haciendo clic en el botón "Agregar otra institución".
            </p>
          </div>
        </>
      )}

      {workStatus === "noLabora" && (
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <Briefcase size={40} className="text-gray-400" />
          </div>
          <h3 className="text-center text-gray-700 font-medium mb-2">No laborando actualmente</h3>
          <p className="text-center text-gray-600 text-sm">
            Ha indicado que no se encuentra laborando actualmente.
          </p>
        </div>
      )}

      {/* Botón Guardar cambios */}
      {isEditMode && (
        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
          <button
            type="button"
            onClick={handleSaveClick}
            className="cursor-pointer flex items-center px-5 py-2.5 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white
              rounded-xl text-base font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-colors"
          >
            Guardar cambios
          </button>
        </div>
      )}
    </motion.div>
  );
}