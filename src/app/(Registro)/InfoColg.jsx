import { UniversidadData, capitalizarPalabras, estados } from "@/Shared/UniversidadData";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export default function InfoColegiado({
  formData,
  onInputChange,
  validationErrors,
  isProfileEdit,
  isEditMode = false,
  onSave
}) {
  const [showTitleDateWarning, setShowTitleDateWarning] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState("");
  const [universidadesDisponibles, setUniversidadesDisponibles] = useState([]);
  const [otraUniversidad, setOtraUniversidad] = useState(false);
  const [nombreUniversidad, setNombreUniversidad] = useState("");
  const [acronimoUniversidad, setAcronimoUniversidad] = useState("");

  // Estado local para el formulario en modo edición
  const [localFormData, setLocalFormData] = useState(formData);

  // Añadir estados para las partes de las fechas
  const [mppsDateParts, setMppsDateParts] = useState({
    day: formData.mppsRegistrationDate ? formData.mppsRegistrationDate.split('-')[2] : "",
    month: formData.mppsRegistrationDate ? formData.mppsRegistrationDate.split('-')[1] : "",
    year: formData.mppsRegistrationDate ? formData.mppsRegistrationDate.split('-')[0] : ""
  });

  const [titleDateParts, setTitleDateParts] = useState({
    day: formData.titleIssuanceDate ? formData.titleIssuanceDate.split('-')[2] : "",
    month: formData.titleIssuanceDate ? formData.titleIssuanceDate.split('-')[1] : "",
    year: formData.titleIssuanceDate ? formData.titleIssuanceDate.split('-')[0] : ""
  });

  const [mainRegDateParts, setMainRegDateParts] = useState({
    day: formData.mainRegistrationDate ? formData.mainRegistrationDate.split('-')[2] : "",
    month: formData.mainRegistrationDate ? formData.mainRegistrationDate.split('-')[1] : "",
    year: formData.mainRegistrationDate ? formData.mainRegistrationDate.split('-')[0] : ""
  });

  // Generar arrays para los selectores
  const years = Array.from({ length: 80 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const months = [
    { value: "01", label: "Enero" },
    { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" },
    { value: "06", label: "Junio" },
    { value: "07", label: "Julio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" }
  ];

  const getDaysInMonth = (year, month) => {
    if (!year || !month) return [];
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return {
        value: day < 10 ? `0${day}` : day.toString(),
        label: day.toString()
      };
    });
  };

  // Actualizar el estado local cuando cambian las props
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  // Manejador general para campos que no requieren formato especial
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isEditMode) {
      setLocalFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      onInputChange({ [name]: value });
    }
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

  if (isEditMode) {
    setLocalFormData(prev => ({
      ...prev,
      graduateInstitute: rawValue
    }));
  } else {
    onInputChange({ graduateInstitute: rawValue });
  }
};

  // Manejar el cambio de estado
  const handleEstadoChange = (e) => {
    const nuevoEstado = e.target.value;
    setSelectedEstado(nuevoEstado);
    setOtraUniversidad(false);

    // Actualizar el formData
    if (isEditMode) {
      setLocalFormData(prev => ({
        ...prev,
        universityState: nuevoEstado,
        universityTitle: "", // Resetear la universidad seleccionada
        isCustomUniversity: false,
        customUniversityName: "",
        customUniversityAcronym: ""
      }));
    } else {
      onInputChange({
        universityState: nuevoEstado,
        universityTitle: "", // Resetear la universidad seleccionada
        isCustomUniversity: false,
        customUniversityName: "",
        customUniversityAcronym: ""
      });
    }
  };

  // Manejar el cambio de universidad
  const handleUniversidadChange = (e) => {
    const value = e.target.value;

    if (value === "otra") {
      setOtraUniversidad(true);
      setNombreUniversidad("");
      setAcronimoUniversidad("");

      // Actualizar el formData
      if (isEditMode) {
        setLocalFormData(prev => ({
          ...prev,
          universityTitle: "",
          isCustomUniversity: true,
          customUniversityName: "",
          customUniversityAcronym: ""
        }));
      } else {
        onInputChange({
          universityTitle: "",
          isCustomUniversity: true,
          customUniversityName: "",
          customUniversityAcronym: ""
        });
      }
    } else {
      setOtraUniversidad(false);

      // Buscar la universidad seleccionada para obtener el acrónimo
      const universidadSeleccionada = universidadesDisponibles.find(u => u.nombre === value);

      // Actualizar el formData
      if (isEditMode) {
        setLocalFormData(prev => ({
          ...prev,
          universityTitle: value,
          isCustomUniversity: false,
          customUniversityName: "",
          customUniversityAcronym: universidadSeleccionada ? universidadSeleccionada.acronimo : ""
        }));
      } else {
        onInputChange({
          universityTitle: value,
          isCustomUniversity: false,
          customUniversityName: "",
          customUniversityAcronym: universidadSeleccionada ? universidadSeleccionada.acronimo : ""
        });
      }
    }
  };

  // Manejar el ingreso de nombre personalizado de universidad
  const handleCustomNameChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = capitalizarPalabras(rawValue);
    setNombreUniversidad(formattedValue);

    // Actualizar el formData
    if (isEditMode) {
      setLocalFormData(prev => ({
        ...prev,
        customUniversityName: formattedValue,
        universityTitle: formattedValue
      }));
    } else {
      onInputChange({
        customUniversityName: formattedValue,
        universityTitle: formattedValue
      });
    }
  };

  // Manejar el ingreso de acrónimo personalizado
  const handleCustomAcronymChange = (e) => {
    const value = e.target.value.toUpperCase();
    setAcronimoUniversidad(value);

    // Actualizar el formData
    if (isEditMode) {
      setLocalFormData(prev => ({
        ...prev,
        customUniversityAcronym: value
      }));
    } else {
      onInputChange({ customUniversityAcronym: value });
    }
  };

  // Manejar el cambio en campo numérico (solo números permitidos)
  const handleNumericInput = (e) => {
    const { name, value } = e.target;
    // Filtrar para permitir solo dígitos
    const numericValue = value.replace(/\D/g, '');
    
    if (isEditMode) {
      setLocalFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      onInputChange({ [name]: numericValue });
    }
  };

  // Para manejar cambios en los selectores de fecha MPPS
  const handleMppsDateChange = (field, value) => {
    const newDateParts = { ...mppsDateParts, [field]: value };
    setMppsDateParts(newDateParts);

    // Si tenemos las tres partes, actualizar la fecha completa
    if (newDateParts.year && newDateParts.month && newDateParts.day) {
      const fullDate = `${newDateParts.year}-${newDateParts.month}-${newDateParts.day}`;
      
      if (isEditMode) {
        setLocalFormData(prev => ({
          ...prev,
          mppsRegistrationDate: fullDate
        }));
      } else {
        onInputChange({ mppsRegistrationDate: fullDate });
      }
    }
  };

  // Para manejar cambios en los selectores de fecha de título
  const handleTitleDateChange = (field, value) => {
    const newDateParts = { ...titleDateParts, [field]: value };
    setTitleDateParts(newDateParts);

    // Si tenemos las tres partes, actualizar la fecha completa
    if (newDateParts.year && newDateParts.month && newDateParts.day) {
      const fullDate = `${newDateParts.year}-${newDateParts.month}-${newDateParts.day}`;
      
      if (isEditMode) {
        setLocalFormData(prev => ({
          ...prev,
          titleIssuanceDate: fullDate
        }));
      } else {
        onInputChange({ titleIssuanceDate: fullDate });
      }
    }
  };

  // Para manejar cambios en los selectores de fecha de registro principal
  const handleMainRegDateChange = (field, value) => {
    const newDateParts = { ...mainRegDateParts, [field]: value };
    setMainRegDateParts(newDateParts);

    // Si tenemos las tres partes, actualizar la fecha completa
    if (newDateParts.year && newDateParts.month && newDateParts.day) {
      const fullDate = `${newDateParts.year}-${newDateParts.month}-${newDateParts.day}`;
      
      if (isEditMode) {
        setLocalFormData(prev => ({
          ...prev,
          mainRegistrationDate: fullDate
        }));
      } else {
        onInputChange({ mainRegistrationDate: fullDate });
      }
    }
  };

  // Checks if a field has validation errors to display the required message
  const isFieldEmpty = (fieldName) => {
    return validationErrors && validationErrors[fieldName];
  };

  const handleSaveClick = () => {
  // Simplemente guardamos sin validación estricta en modo edición
  if (onSave) {
    onSave(localFormData);
  } else if (onInputChange) { // ← Agregar esta verificación
    onInputChange(localFormData);
  }
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
              value={typeof formData.tipo_profesion === 'object' ? formData.tipo_profesion.titulo : formData.tipo_profesion || "No especificada"}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
              disabled
            />
          ) : (
            // En modo normal, editable
            <>
              <select
                name="tipo_profesion"
                value={typeof formData.tipo_profesion === 'object' ? formData.tipo_profesion.id : formData.tipo_profesion}
                onChange={handleChange}
                className={`cursor-pointer w-full px-4 py-3 border ${isFieldEmpty("tipo_profesion") ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
              >
                <option value="" disabled>
                  Seleccione una opción
                </option>
                <option value="higienista">Higienista</option>
                <option value="odontologo">Odontólogo</option>
                <option value="tecnico">Técnico Dental</option>
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
                maxLength={6}
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
                maxLength={6}
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
                // En modo normal, editable con selectores
                <div className="grid grid-cols-3 gap-2">
                  {/* Selector de año */}
                  <div className="relative">
                    <select
                      value={mainRegDateParts.year}
                      onChange={(e) => handleMainRegDateChange('year', e.target.value)}
                      className={`cursor-pointer w-full px-2 py-3 border ${isFieldEmpty("mainRegistrationDate") ? "border-red-500 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
                    >
                      <option value="">Año</option>
                      {years.map(year => (
                        <option key={`mainreg-year-${year.value}`} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>

                  {/* Selector de mes */}
                  <div className="relative">
                    <select
                      value={mainRegDateParts.month}
                      onChange={(e) => handleMainRegDateChange('month', e.target.value)}
                      className={`cursor-pointer w-full px-2 py-3 border ${isFieldEmpty("mainRegistrationDate") ? "border-red-500 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
                    >
                      <option value="">Mes</option>
                      {months.map(month => (
                        <option key={`mainreg-month-${month.value}`} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>

                  {/* Selector de día */}
                  <div className="relative">
                    <select
                      value={mainRegDateParts.day}
                      onChange={(e) => handleMainRegDateChange('day', e.target.value)}
                      disabled={!mainRegDateParts.year || !mainRegDateParts.month}
                      className={`cursor-pointer w-full px-2 py-3 border ${isFieldEmpty("mainRegistrationDate") ? "border-red-500 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
                    >
                      <option value="">Día</option>
                      {getDaysInMonth(mainRegDateParts.year, mainRegDateParts.month).map(day => (
                        <option key={`mainreg-day-${day.value}`} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
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
              maxLength={6}
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
              maxLength={6}
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
              // En modo normal, editable con selectores
              <div className="grid grid-cols-3 gap-2">
                {/* Selector de año */}
                <div className="relative">
                  <select
                    value={mppsDateParts.year}
                    onChange={(e) => handleMppsDateChange('year', e.target.value)}
                    className={`cursor-pointer w-full px-2 py-3 border ${isFieldEmpty("mppsRegistrationDate") ? "border-red-500 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
                  >
                    <option value="">Año</option>
                    {years.map(year => (
                      <option key={`mpps-year-${year.value}`} value={year.value}>
                        {year.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                {/* Selector de mes */}
                <div className="relative">
                  <select
                    value={mppsDateParts.month}
                    onChange={(e) => handleMppsDateChange('month', e.target.value)}
                    className={`cursor-pointer w-full px-2 py-3 border ${isFieldEmpty("mppsRegistrationDate") ? "border-red-500 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
                  >
                    <option value="">Mes</option>
                    {months.map(month => (
                      <option key={`mpps-month-${month.value}`} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                {/* Selector de día */}
                <div className="relative">
                  <select
                    value={mppsDateParts.day}
                    onChange={(e) => handleMppsDateChange('day', e.target.value)}
                    disabled={!mppsDateParts.year || !mppsDateParts.month}
                    className={`cursor-pointer w-full px-2 py-3 border ${isFieldEmpty("mppsRegistrationDate") ? "border-red-500 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
                  >
                    <option value="">Día</option>
                    {getDaysInMonth(mppsDateParts.year, mppsDateParts.month).map(day => (
                      <option key={`mpps-day-${day.value}`} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
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
          {/* Selectores para fecha de emisión de título */}
          <div className="grid grid-cols-3 gap-2">
            {/* Selector de año */}
            <div className="relative">
              <select
                value={titleDateParts.year}
                onChange={(e) => handleTitleDateChange('year', e.target.value)}
                onFocus={() => setShowTitleDateWarning(true)}
                onBlur={() => setShowTitleDateWarning(false)}
                className={`cursor-pointer w-full px-2 py-3 border ${isFieldEmpty("titleIssuanceDate") ? "border-red-500 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
              >
                <option value="">Año</option>
                {years.map(year => (
                  <option key={`title-year-${year.value}`} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Selector de mes */}
            <div className="relative">
              <select
                value={titleDateParts.month}
                onChange={(e) => handleTitleDateChange('month', e.target.value)}
                onFocus={() => setShowTitleDateWarning(true)}
                onBlur={() => setShowTitleDateWarning(false)}
                className={`cursor-pointer w-full px-2 py-3 border ${isFieldEmpty("titleIssuanceDate") ? "border-red-500 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
              >
                <option value="">Mes</option>
                {months.map(month => (
                  <option key={`title-month-${month.value}`} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Selector de día */}
            <div className="relative">
              <select
                value={titleDateParts.day}
                onChange={(e) => handleTitleDateChange('day', e.target.value)}
                onFocus={() => setShowTitleDateWarning(true)}
                onBlur={() => setShowTitleDateWarning(false)}
                disabled={!titleDateParts.year || !titleDateParts.month}
                className={`cursor-pointer w-full px-2 py-3 border ${isFieldEmpty("titleIssuanceDate") ? "border-red-500 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
              >
                <option value="">Día</option>
                {getDaysInMonth(titleDateParts.year, titleDateParts.month).map(day => (
                  <option key={`title-day-${day.value}`} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
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