import { motion } from "framer-motion";
import { Briefcase, BriefcaseBusiness, Phone, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function InfoLaboral({ formData, onInputChange, validationErrors }) {
  // Lista de tipos de instituciones
  const institucionesList = [
    { code: "publica", name: "Institución Pública" },
    { code: "privada", name: "Institución Privada" },
    { code: "mixta", name: "Institución Mixta" },
    { code: "ong", name: "ONG / Sin fines de lucro" },
    { code: "otro", name: "Otro tipo de institución" }
  ];

  // Estado para manejar el estado laboral
  const [workStatus, setWorkStatus] = useState(formData.workStatus || "labora");

  // Estado para manejar múltiples registros laborales
  const [registros, setRegistros] = useState(
    formData.laboralRegistros && formData.laboralRegistros.length > 0
      ? formData.laboralRegistros
      : [
        {
          id: 1,
          institutionType: formData.institutionType || "",
          institutionName: formData.institutionName || "",
          institutionAddress: formData.institutionAddress || "",
          institutionPhone: formData.institutionPhone || "",
          cargo: formData.cargo || "",
        }
      ]
  );

  // Actualizar workStatus cuando cambie en formData
  useEffect(() => {
    if (formData.workStatus !== undefined) {
      setWorkStatus(formData.workStatus);
    }
  }, [formData.workStatus]);

  // Manejar el cambio en el estado laboral
  const handleWorkStatusChange = (value) => {
    setWorkStatus(value);
    // Si selecciona "No Laborando", limpiamos los campos laborales
    if (value === "noLabora") {
      // Limpiar campos laborales
      onInputChange({
        workStatus: value,
        institutionType: "N/A",
        institutionName: "N/A",
        institutionAddress: "N/A",
        institutionPhone: "N/A",
        cargo: "N/A",
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
    // Si es el campo de teléfono, formatear el valor
    if (field === "institutionPhone") {
      value = formatPhone(value);
    }
    const nuevosRegistros = [...registros];
    nuevosRegistros[index] = {
      ...nuevosRegistros[index],
      [field]: value
    };
    setRegistros(nuevosRegistros);
    // Actualizar los campos principales con el primer registro (para compatibilidad)
    if (index === 0) {
      onInputChange({ [field]: value });
    }
    // Actualizar el array completo de registros
    onInputChange({ laboralRegistros: nuevosRegistros });
  };

  // Inicializar el campo de teléfono con + cuando recibe foco
  const handlePhoneFocus = (index) => {
    const registro = registros[index];
    if (!registro.institutionPhone) {
      handleRegistroChange(index, "institutionPhone", "+");
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
        cargo: ""
      }
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
          institutionType: nuevosRegistros[0].institutionType,
          institutionName: nuevosRegistros[0].institutionName,
          institutionAddress: nuevosRegistros[0].institutionAddress,
          institutionPhone: nuevosRegistros[0].institutionPhone,
          cargo: nuevosRegistros[0].cargo
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
      {/* Título y tabs de estado laboral */}
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

      {/* Mostrar información laboral solo si está laborando */}
      {workStatus === "labora" && (
        <>
          {registros.map((registro, index) => (
            <div
              key={registro.id}
              className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm relative"
            >
              {/* Título del registro */}
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
                {/* Tipo de Institución */}
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

                {/* Nombre de Institución */}
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

                {/* Cargo */}
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

                {/* Teléfono de Institución */}
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
                      onFocus={() => handlePhoneFocus(index)}
                      className={`w-full pl-10 pr-4 py-3 border ${isFieldEmpty(registro, "institutionPhone") ? "border-red-500 bg-red-50" : "border-gray-200"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                      placeholder="+584241234567"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {isFieldEmpty(registro, "institutionPhone") && (
                    <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Ingrese código de área y número. Ej: +584241234567
                  </p>
                </div>
              </div>

              {/* Dirección de Institución */}
              <div className="mt-3">
                <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
                  Dirección de Institución
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={registro.institutionAddress}
                  onChange={(e) => handleRegistroChange(index, "institutionAddress", e.target.value)}
                  className={`w-full px-4 py-3 border ${isFieldEmpty(registro, "institutionAddress") ? "border-red-500 bg-red-50" : "border-gray-200"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                  placeholder="Dirección completa de la institución"
                />
                {isFieldEmpty(registro, "institutionAddress") && (
                  <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
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
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <Briefcase size={40} className="text-gray-400" />
          </div>
          <h3 className="text-center text-gray-700 font-medium mb-2">No laborando actualmente</h3>
          <p className="text-center text-gray-600 text-sm">
            Ha indicado que no se encuentra laborando actualmente. Puede continuar con el siguiente paso.
            Esta sección puede ser modificada o completada posteriormente si su situación laboral cambia.
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700 text-center">
              Si comienza a laborar en el futuro, puede volver a esta sección y actualizar su información laboral.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}