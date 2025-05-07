import { motion } from "framer-motion";
import { Plus, Trash2, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import institucionesList from "@/app/Models/institucionesList";

export default function InfoLaboral({ formData, onInputChange, validationErrors }) {
  // Estado para manejar el estado laboral
  const [workStatus, setWorkStatus] = useState(formData.workStatus || "labora");

  // Estado para manejar múltiples registros laborales
  const [registros, setRegistros] = useState(
    formData.laboralRegistros && formData.laboralRegistros.length > 0
      ? formData.laboralRegistros
      : [
          {
            institutionName: formData.institutionName || "",
            institutionAddress: formData.institutionAddress || "",
            institutionPhone: formData.institutionPhone || "",
            cargo: formData.cargo || "",
            institutionType: formData.institutionType || "",
          },
        ]
  );

  // Actualizar workStatus cuando cambie en formData
  useEffect(() => {
    if (formData.workStatus !== undefined) {
      setWorkStatus(formData.workStatus);
    }
  }, [formData.workStatus]);

  // Manejar el cambio en el estado laboral
  const handleWorkStatusChange = (e) => {
    const { value } = e.target;
    setWorkStatus(value);

    // Si selecciona "No Laborando", limpiamos los campos laborales
    if (value === "noLabora") {
      // Limpiar campos laborales
      onInputChange({
        workStatus: value,
        institutionName: "N/A",  // Valor por defecto para pasar la validación
        institutionAddress: "N/A", // Valor por defecto para pasar la validación
        institutionPhone: "N/A", // Valor por defecto para pasar la validación
        cargo: "N/A", // Valor por defecto para pasar la validación
        laboralRegistros: []
      });
    } else {
      // Si cambia a "Laborando", restauramos los registros
      onInputChange({
        workStatus: value,
        laboralRegistros: registros
      });
    }
  };

  // Format phone number - only adds + at beginning
  const formatPhone = (value) => {
    if (!value) return '+';
    // Remove all non-digit characters except the initial + if present
    if (value.startsWith('+')) {
      const digits = value.substring(1).replace(/\D/g, '');
      return `+${digits}`;
    } else {
      const digits = value.replace(/\D/g, '');
      return `+${digits}`;
    }
  };

  // Manejar cambios en un registro específico
  const handleRegistroChange = (index, field, value) => {
    const nuevosRegistros = [...registros];
    nuevosRegistros[index] = {
      ...nuevosRegistros[index],
      [field]: value,
    };
    setRegistros(nuevosRegistros);

    if (index === 0) {
      onInputChange({ [field]: value });
    }

    onInputChange({ laboralRegistros: nuevosRegistros });
  };

  const handlePhoneFocus = (index) => {
    const registro = registros[index];
    if (!registro.institutionPhone) {
      handleRegistroChange(index, "institutionPhone", "+");
    }
  };

  const agregarRegistro = () => {
    const nuevosRegistros = [
      ...registros,
      {
        institutionName: "",
        institutionAddress: "",
        institutionPhone: "",
        cargo: "",
        institutionType: "",
      },
    ];
    setRegistros(nuevosRegistros);
    onInputChange({ laboralRegistros: nuevosRegistros });
  };

  // Eliminar un registro
  const eliminarRegistro = (index) => {
    if (registros.length > 1) {
      const nuevosRegistros = [...registros];
      nuevosRegistros.splice(index, 1);
      setRegistros(nuevosRegistros);
      onInputChange({ laboralRegistros: nuevosRegistros });
      // Si se elimina el primer registro, actualizar los campos principales
      if (index === 0 && nuevosRegistros.length > 0) {
        onInputChange({
          institutionName: nuevosRegistros[0].institutionName,
          institutionAddress: nuevosRegistros[0].institutionAddress,
          institutionPhone: nuevosRegistros[0].institutionPhone,
          cargo: nuevosRegistros[0].cargo,
          institutionType: nuevosRegistros[0].institutionType,
        });
      }
    }
  };

  // Checks if a field has validation errors to display the required message
  const isFieldEmpty = (registro, fieldName) => {
    // Si no está laborando, no mostrar errores
    if (workStatus === "noLabora") {
      return false;
    }

    // Solo mostrar errores si validationErrors existe y contiene campos de este registro
    if (!validationErrors) return false;

    // Para el primer registro, podemos usar los nombres de campo directos
    if (registro.id === 1) {
      return validationErrors[fieldName];
    }

    // Para registros adicionales, habría que implementar una lógica más compleja
    // si se quiere validar cada registro individualmente
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-[#41023B]">
          Estado Laboral Actual
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="workStatus"
              value="labora"
              checked={workStatus === "labora"}
              onChange={handleWorkStatusChange}
              className="w-4 h-4 text-[#D7008A] focus:ring-[#D7008A]"
            />
            <span>Actualmente Laborando</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="workStatus"
              value="noLabora"
              checked={workStatus === "noLabora"}
              onChange={handleWorkStatusChange}
              className="w-4 h-4 text-[#D7008A] focus:ring-[#D7008A]"
            />
            <span>No Laborando Actualmente</span>
          </label>
        </div>
      </div>

      {/* Mostrar información laboral solo si está laborando */}
      {workStatus === "labora" && (
        <>
                {registros.map((registro, index) => (
        <div
          key={index}
          className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm relative"
        >
          {/* Título del registro */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#41023B] font-semibold text-lg">
              Información Laboral
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
          {/* Datos de la institución */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div >
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
                  className={`w-full px-4 py-3 border ${
                    isFieldEmpty(registro, "institutionType")
                      ? "border-gray-200"
                      : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
                >
                  <option value="" disabled className="text-gray-500">
                    Seleccionar Tipo de Institución
                  </option>
                  {institucionesList.map((tipo, index) => (
                    <option key={index} value={tipo.code}>
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
                <p className="mt-1 text-xs text-red-500">
                  Este campo es obligatorio
                </p>
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
                onChange={(e) =>
                  handleRegistroChange(index, "institutionName", e.target.value)
                }
                className={`w-full px-4 py-3 border ${
                  isFieldEmpty(registro, "institutionName")
                    ? "border-gray-200"
                    : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                placeholder="Nombre de la institución donde presta servicio"
              />
              {isFieldEmpty(registro, "institutionName") && (
                <p className="mt-1 text-xs text-red-500">
                  Este campo es obligatorio
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mt-3" >
              <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
                Cargo
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={registro.cargo}
                onChange={(e) =>
                  handleRegistroChange(index, "cargo", e.target.value)
                }
                className={`w-full px-4 py-3 border ${
                  isFieldEmpty(registro, "cargo")
                    ? "border-gray-200"
                    : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                placeholder="Cargo o posición que ocupa"
              />
              {isFieldEmpty(registro, "cargo") && (
                <p className="mt-1 text-xs text-red-500">
                  Este campo es obligatorio
                </p>
              )}
            </div>
            <div className="mt-3">
              <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
                Teléfono de Institución
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={registro.institutionPhone || ""}
                  onChange={(e) =>
                    handleRegistroChange(
                      index,
                      "institutionPhone",
                      e.target.value
                    )
                  }
                  onFocus={() => handlePhoneFocus(index)}
                  maxLength={11}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    isFieldEmpty(registro, "institutionPhone")
                      ? "border-gray-200"
                      : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                  placeholder="+584241234567"
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {isFieldEmpty(registro, "institutionPhone") && (
                <p className="mt-1 text-xs text-red-500">
                  Este campo es obligatorio
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Debe ingresar el código de área seguido del número de teléfono.
                Ejemplo: +584241234567
              </p>
            </div>
          </div>

          <div className="mt-3">
            <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
              Dirección de Institución
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={registro.institutionAddress}
              onChange={(e) =>
                handleRegistroChange(
                  index,
                  "institutionAddress",
                  e.target.value
                )
              }
              className={`w-full px-4 py-3 border ${
                isFieldEmpty(registro, "institutionAddress")
                  ? "border-gray-200"
                  : "border-gray-200"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
              placeholder="Dirección completa de la institución"
            />
            {isFieldEmpty(registro, "institutionAddress") && (
              <p className="mt-1 text-xs text-red-500">
                Este campo es obligatorio
              </p>
            )}
          </div>
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

      {/* Mensaje informativo si no está laborando */}
      {workStatus === "noLabora" && (
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
          <p className="text-gray-700">
            Ha indicado que no se encuentra laborando actualmente. Puede continuar con el siguiente paso.
          </p>
        </div>
      )}
    </motion.div>
  );
}