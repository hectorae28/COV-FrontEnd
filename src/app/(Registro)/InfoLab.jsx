import institucionesList from "@/Shared/InstitucionesData";
import { motion } from "framer-motion";
import { Briefcase, BriefcaseBusiness, Phone, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import DireccionForm from "./DireccionForm";

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

export default function InfoLaboralWithDireccionForm({ formData, onInputChange, validationErrors, isEditMode = false, onSave }) {
  const [workStatus, setWorkStatus] = useState(formData.workStatus || "labora");
  const [localFormData, setLocalFormData] = useState(formData);

  const [registros, setRegistros] = useState(
    formData.laboralRegistros && formData.laboralRegistros.length > 0
      ? formData.laboralRegistros.map(registro => ({
        ...registro,
        institutionName: capitalizarPalabras(registro.institutionName || ""),
        institutionAddress: capitalizarPalabras(registro.institutionAddress || ""),
        cargo: capitalizarPalabras(registro.cargo || ""),
        selectedEstado: registro.selectedEstado || "",
        selectedMunicipio: registro.selectedMunicipio || ""
      }))
      : [
        {
          id: 1,
          id_direccion: formData.id_direccion,
          institutionType: formData.institutionType || "",
          institutionName: capitalizarPalabras(formData.institutionName || ""),
          institutionAddress: capitalizarPalabras(formData.institutionAddress || ""),
          institutionPhone: formData.institutionPhone || "",
          cargo: capitalizarPalabras(formData.cargo || ""),
          selectedEstado: formData.selectedEstado || "",
          NameEstado: formData.NameEstado || "",
          selectedMunicipio: formData.selectedMunicipio || "",
          NameMunicipio: formData.NameMunicipio || "",
        }
      ]
  );

  // Actualizar el estado local cuando cambian las props
  useEffect(() => {
    setLocalFormData(formData);

    // Actualizar registros si cambian en las props
    if (formData.laboralRegistros && formData.laboralRegistros.length > 0) {
      setRegistros(formData.laboralRegistros.map(registro => ({
        ...registro,
        institutionName: capitalizarPalabras(registro.institutionName || ""),
        institutionAddress: capitalizarPalabras(registro.institutionAddress || ""),
        cargo: capitalizarPalabras(registro.cargo || ""),
        selectedEstado: registro.selectedEstado || "",
        NameEstado: registro.NameEstado || "",
        selectedMunicipio: registro.selectedMunicipio || "",
        NameMunicipio: registro.NameMunicipio || ""
      })));
    }
  }, [formData]);

  // Actualizar workStatus cuando cambie en formData
  useEffect(() => {
    if (formData.workStatus !== undefined) {
      setWorkStatus(formData.workStatus);
    }
  }, [formData.workStatus]);

  const handleWorkStatusChange = (value) => {
    setWorkStatus(value);
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
    const registro = { ...nuevosRegistros[index], ...updates }; // Merge the updates
    nuevosRegistros[index] = registro;
    setRegistros(nuevosRegistros);

    const updatedData = { laboralRegistros: nuevosRegistros };
    if (isEditMode) {
      setLocalFormData(prev => ({ ...prev, ...updatedData }));
    } else {
      onInputChange(updatedData);
    }
  };

  // Agregar un nuevo registro laboral
  const agregarRegistro = () => {
    const nuevoId = registros.length > 0 ? Math.max(...registros.map(r => r.id)) + 1 : 1;
    const nuevosRegistros = [
      ...registros,
      {
        id: nuevoId,
        institutionType: "",
        institutionName: "",
        institutionAddress: "",
        institutionPhone: "",
        cargo: "",
        selectedEstado: "",
        selectedMunicipio: ""
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
          selectedMunicipio: nuevosRegistros[0].selectedMunicipio
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

  const isFieldEmpty = (registro, fieldName) => {
    if (workStatus === "noLabora") {
      return false;
    }
    if (!validationErrors) return false;
    if (registro.id === 1) {
      return validationErrors[fieldName];
    }
    return false;
  };

  const handleSaveClick = () => {
    // Validar que haya al menos una institución con datos válidos
    if (workStatus === "labora" && registros.length > 0) {
      const hasValidInstitution = registros.some(reg =>
        reg.institutionName && reg.institutionType && reg.institutionAddress
      );

      if (!hasValidInstitution) {
        alert("Debe completar los datos de al menos una institución");
        return;
      }

      // Actualizar datos en el formulario principal
      console.log(registros);
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
      // Si no labora, enviar estado con valores por defecto
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-semibold text-[#41023B] mb-4 sm:mb-0"></h2>
        <div className="bg-gray-100 rounded-lg p-1 flex w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleWorkStatusChange("labora")}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex-1 sm:flex-auto ${workStatus === "labora"
              ? "bg-white text-[#D7008A] shadow-sm"
              : "text-gray-600 hover:bg-gray-200"
              }`}
          >
            <BriefcaseBusiness size={18} />
            <span>Laborando</span>
          </button>
          <button
            type="button"
            onClick={() => handleWorkStatusChange("noLabora")}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex-1 sm:flex-auto ${workStatus === "noLabora"
              ? "bg-white text-[#D7008A] shadow-sm"
              : "text-gray-600 hover:bg-gray-200"
              }`}
          >
            <Briefcase size={18} />
            <span>No Laborando</span>
          </button>
        </div>
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
                  <p className="mt-1 text-xs text-gray-500">
                    Ingrese código de área y número. Ej: 0212 123 4567
                  </p>
                </div>
              </div>

              <DireccionForm
                formData={registro}
                onInputChange={(updates) => handleDireccionChange(index, updates)}
                isFieldEmpty={(fieldName) => isFieldEmpty(registro, fieldName)}
                isEditMode={false}
                fieldMapping={{
                  state: "selectedEstado",
                  municipio: "selectedMunicipio",
                  address: "institutionAddress",
                }}
                title="Dirección de Institución"
                addressPlaceholder="Calle, Avenida, Edificio, Piso, Oficina"
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