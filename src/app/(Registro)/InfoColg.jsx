import { UniversidadData, capitalizarPalabras, estados } from "@/Shared/UniversidadData";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export default function InfoColegiado({
  formData,
  onInputChange,
  validationErrors,
  isProfileEdit
}) {
  const [showTitleDateWarning, setShowTitleDateWarning] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState("");
  const [universidadesDisponibles, setUniversidadesDisponibles] = useState([]);
  const [otraUniversidad, setOtraUniversidad] = useState(false);
  const [nombreUniversidad, setNombreUniversidad] = useState("");
  const [acronimoUniversidad, setAcronimoUniversidad] = useState("");

  // Manejador general para campos que no requieren formato especial
  const handleChange = (e) => {
    const { name, value } = e.target;
    onInputChange({ [name]: value });
  };

  // Actualizar las universidades disponibles cuando se selecciona un estado
  useEffect(() => {
    if (selectedEstado && UniversidadData[selectedEstado]) {
      setUniversidadesDisponibles(UniversidadData[selectedEstado]);
    } else {
      setUniversidadesDisponibles([]);
    }
  }, [selectedEstado]);

  // Cuando se carga el componente, intentar establecer el estado basado en los datos existentes
  useEffect(() => {
    if (formData.universityState) {
      setSelectedEstado(formData.universityState);

      // Si tenemos información de "otra universidad"
      if (formData.isCustomUniversity) {
        setOtraUniversidad(true);
        setNombreUniversidad(formData.customUniversityName || "");
        setAcronimoUniversidad(formData.customUniversityAcronym || "");
      }
    }
  }, [formData.universityState, formData.isCustomUniversity, formData.customUniversityName, formData.customUniversityAcronym]);

  // Manejar el ingreso de instituto de graduación (liceo)
  const handleGraduateInstituteChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = capitalizarPalabras(rawValue);

    // Actualizar el formData con el valor formateado
    onInputChange({ graduateInstitute: formattedValue });
  };

  // Manejar el cambio de estado
  const handleEstadoChange = (e) => {
    const nuevoEstado = e.target.value;
    setSelectedEstado(nuevoEstado);
    setOtraUniversidad(false);

    // Actualizar el formData
    onInputChange({
      universityState: nuevoEstado,
      universityTitle: "", // Resetear la universidad seleccionada
      isCustomUniversity: false,
      customUniversityName: "",
      customUniversityAcronym: ""
    });
  };

  // Manejar el cambio de universidad
  const handleUniversidadChange = (e) => {
    const value = e.target.value;

    if (value === "otra") {
      setOtraUniversidad(true);
      setNombreUniversidad("");
      setAcronimoUniversidad("");

      // Actualizar el formData
      onInputChange({
        universityTitle: "",
        isCustomUniversity: true,
        customUniversityName: "",
        customUniversityAcronym: ""
      });
    } else {
      setOtraUniversidad(false);

      // Buscar la universidad seleccionada para obtener el acrónimo
      const universidadSeleccionada = universidadesDisponibles.find(u => u.nombre === value);

      // Actualizar el formData
      onInputChange({
        universityTitle: value,
        isCustomUniversity: false,
        customUniversityName: "",
        customUniversityAcronym: universidadSeleccionada ? universidadSeleccionada.acronimo : ""
      });
    }
  };

  // Manejar el ingreso de nombre personalizado de universidad
  const handleCustomNameChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = capitalizarPalabras(rawValue);
    setNombreUniversidad(formattedValue);

    // Actualizar el formData
    onInputChange({
      customUniversityName: formattedValue,
      universityTitle: formattedValue
    });
  };

  // Manejar el ingreso de acrónimo personalizado
  const handleCustomAcronymChange = (e) => {
    const value = e.target.value.toUpperCase();
    setAcronimoUniversidad(value);

    // Actualizar el formData
    onInputChange({ customUniversityAcronym: value });
  };

  // Manejar el cambio en campo numérico (solo números permitidos)
  const handleNumericInput = (e) => {
    const { name, value } = e.target;
    // Filtrar para permitir solo dígitos
    const numericValue = value.replace(/\D/g, '');
    onInputChange({ [name]: numericValue });
  };

  // Checks if a field has validation errors to display the required message
  const isFieldEmpty = (fieldName) => {
    return validationErrors && validationErrors[fieldName];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Profesión */}
      <div>
        <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
          Tipo de Profesión / Ocupación
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          {isProfileEdit ? (
            // En modo perfil, no editable
            <input
              type="text"
              value={formData.tipo_profesion || "No especificada"}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
              disabled
            />
          ) : (
            // En modo normal, editable
            <>
              <select
                name="tipo_profesion"
                value={formData.tipo_profesion}
                onChange={handleChange}
                className={`cursor-pointer w-full px-4 py-3 border ${isFieldEmpty("tipo_profesion") ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
              >
                <option value="" disabled>
                  Seleccione una opción
                </option>
                <option value="tecnico">Técnico</option>
                <option value="odontologo">Odontólogo</option>
                <option value="higienista">Higienista</option>
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
            </>
          )}
        </div>
        {isFieldEmpty("tipo_profesion") && !isProfileEdit && (
          <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
        )}
      </div>

      {/* Graduate Institute - Con capitalización de palabras */}
      <div>
        <label className="mb-2 text-sm font-medium text-[#41023B] flex items-center">
          Liceo/Colegio de Egreso (Bachillerato)
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          name="graduateInstitute"
          value={formData.graduateInstitute}
          onChange={handleGraduateInstituteChange}
          className={`w-full px-4 py-3 border ${isFieldEmpty("graduateInstitute") ? "border-red-500 bg-red-50" : "border-gray-200"
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
          placeholder="Nombre del instituto de graduación"
        />
        {isFieldEmpty("graduateInstitute") && (
          <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
        )}
      </div>

      {/* University - Sistema de selección en dos pasos */}
      <div>
        <label className="mb-2 text-sm font-medium text-[#41023B] flex items-center">
          Institución de Educación Superior (universidad)
          <span className="text-red-500 ml-1">*</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Paso 1: Selección de Estado */}
          <div>
            <label className="mb-2 text-xs font-medium text-gray-700">
              Seleccione el Estado
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                name="universityState"
                value={selectedEstado}
                onChange={handleEstadoChange}
                className={`cursor-pointer w-full px-4 py-3 border ${isFieldEmpty("universityState") ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
                disabled={isProfileEdit}
              >
                <option value="" disabled>Seleccione un estado</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
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
            {isFieldEmpty("universityState") && (
              <p className="mt-1 text-xs text-red-500">Debe seleccionar un estado</p>
            )}
          </div>

          {/* Paso 2: Selección de Universidad */}
          <div>
            <label className={`mb-2 text-xs font-medium ${selectedEstado ? "text-gray-700" : "text-gray-400"}`}>
              Seleccione la Universidad
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                name="universityTitle"
                value={otraUniversidad ? "otra" : formData.universityTitle}
                onChange={handleUniversidadChange}
                className={`cursor-pointer w-full px-4 py-3 border ${isFieldEmpty("universityTitle") ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none ${selectedEstado ? "text-gray-700" : "text-gray-400 bg-gray-50"
                  }`}
                disabled={isProfileEdit || !selectedEstado}
              >
                <option value="" disabled>Seleccione una universidad</option>
                {universidadesDisponibles.map((univ) => (
                  <option key={univ.acronimo} value={univ.nombre}>
                    {univ.nombre} ({univ.acronimo})
                  </option>
                ))}
                <option value="otra">Otra (no está en la lista)</option>
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
            {isFieldEmpty("universityTitle") && selectedEstado && (
              <p className="mt-1 text-xs text-red-500">Debe seleccionar una universidad</p>
            )}
          </div>
        </div>

        {/* Campos adicionales para "Otra Universidad" */}
        {otraUniversidad && selectedEstado && (
          <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="text-sm font-medium text-[#41023B]">Ingrese los datos de la universidad</h4>

            {/* Nombre completo de la universidad */}
            <div>
              <label className="mb-2 text-xs font-medium text-gray-700">
                Nombre completo de la universidad
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={nombreUniversidad}
                onChange={handleCustomNameChange}
                className={`w-full px-4 py-3 border ${isFieldEmpty("customUniversityName") ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                placeholder="Nombre completo de la universidad"
              />
              {isFieldEmpty("customUniversityName") && (
                <p className="mt-1 text-xs text-red-500">Debe ingresar el nombre de la universidad</p>
              )}
            </div>

            {/* Acrónimo de la universidad */}
            <div>
              <label className="mb-2 text-xs font-medium text-gray-700">
                Acrónimo de la universidad (en MAYÚSCULAS)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={acronimoUniversidad}
                onChange={handleCustomAcronymChange}
                className={`w-full px-4 py-3 border ${isFieldEmpty("customUniversityAcronym") ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                placeholder="Ejemplo: UCV, USB, LUZ"
              />
              {isFieldEmpty("customUniversityAcronym") && (
                <p className="mt-1 text-xs text-red-500">Debe ingresar el acrónimo de la universidad</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Registration Number - Solo se muestra para odontólogos o si estamos en modo edición de perfil */}
      {(formData.tipo_profesion === "odontologo" || isProfileEdit) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
              Número de Registro Principal
              <span className="text-red-500 ml-1">*</span>
            </label>
            {isProfileEdit ? (
              // En modo perfil, no editable
              <input
                type="text"
                value={formData.mainRegistrationNumber ? `COV-${formData.mainRegistrationNumber}` : "No especificado"}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
                disabled
              />
            ) : (
              // En modo normal, editable"
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="mainRegistrationNumber"
                value={formData.mainRegistrationNumber}
                onChange={handleNumericInput}
                className={`w-full px-4 py-3 border ${isFieldEmpty("mainRegistrationNumber") ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                placeholder="Número de registro"
              />
            )}
            {isProfileEdit && (
              <p className="mt-1 text-xs text-gray-500">Este campo no se puede editar</p>
            )}
            {isFieldEmpty("mainRegistrationNumber") && !isProfileEdit && (
              <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
              Fecha de Registro Principal
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              {isProfileEdit ? (
                // En modo perfil, no editable
                <input
                  type="text"
                  value={formData.mainRegistrationDate || "No especificada"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
                  disabled
                />
              ) : (
                // En modo normal, editable
                <input
                  type="date"
                  name="mainRegistrationDate"
                  value={formData.mainRegistrationDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${isFieldEmpty("mainRegistrationDate") ? "border-red-500 bg-red-50" : "border-gray-200"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] text-gray-700`}
                />
              )}
            </div>
            {isProfileEdit && (
              <p className="mt-1 text-xs text-gray-500">Este campo no se puede editar</p>
            )}
            {isFieldEmpty("mainRegistrationDate") && !isProfileEdit && (
              <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
            )}
          </div>
        </div>
      )}

      {/* M.P.P.S Registration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Número de Registro M.P.P.S
            <span className="text-red-500 ml-1">*</span>
          </label>
          {isProfileEdit ? (
            // En modo perfil, no editable
            <input
              type="text"
              value={formData.mppsRegistrationNumber || "No especificado"}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
              disabled
            />
          ) : (
            // En modo normal, editable - Cambiado de type="number" a type="text"
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="mppsRegistrationNumber"
              value={formData.mppsRegistrationNumber}
              onChange={handleNumericInput}
              className={`w-full px-4 py-3 border ${isFieldEmpty("mppsRegistrationNumber") ? "border-red-500 bg-red-50" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
              placeholder="Número de registro M.P.P.S"
            />
          )}
          {isProfileEdit && (
            <p className="mt-1 text-xs text-gray-500">Este campo no se puede editar</p>
          )}
          {isFieldEmpty("mppsRegistrationNumber") && !isProfileEdit && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Fecha de Registro M.P.P.S
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            {isProfileEdit ? (
              // En modo perfil, no editable
              <input
                type="text"
                value={formData.mppsRegistrationDate || "No especificada"}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
                disabled
              />
            ) : (
              // En modo normal, editable
              <input
                type="date"
                name="mppsRegistrationDate"
                value={formData.mppsRegistrationDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${isFieldEmpty("mppsRegistrationDate") ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] text-gray-700`}
              />
            )}
          </div>
          {isProfileEdit && (
            <p className="mt-1 text-xs text-gray-500">Este campo no se puede editar</p>
          )}
          {isFieldEmpty("mppsRegistrationDate") && !isProfileEdit && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
      </div>

      {/* Title Issuance Date */}
      <div className="relative">
        <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
          Fecha de Emisión del Título
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <input
            type="date"
            name="titleIssuanceDate"
            value={formData.titleIssuanceDate}
            onChange={handleChange}
            onFocus={() => setShowTitleDateWarning(true)}
            onBlur={() => setShowTitleDateWarning(false)}
            className={`w-full px-4 py-3 border ${isFieldEmpty("titleIssuanceDate") ? "border-red-500 bg-red-50" : "border-gray-200"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] text-gray-700`}
          />
        </div>
        {isFieldEmpty("titleIssuanceDate") && (
          <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
        )}

        {/* Warning message that appears when date field is focused */}
        {showTitleDateWarning && (
          <div className="absolute z-10 mt-2 w-full sm:w-80 md:w-96 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r shadow-md">
            <div className="flex items-center">
              <AlertTriangle
                className="text-yellow-500 mr-2 flex-shrink-0"
                size={20}
              />
              <h3 className="text-sm font-semibold text-yellow-800">
                ¡Atención Colegiado!
              </h3>
            </div>
            <p className="mt-1 text-yellow-700 text-xs">
              La fecha de emisión del título es importante y aparecerá en
              documentos oficiales. Verifique que la información proporcionada
              sea precisa.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}