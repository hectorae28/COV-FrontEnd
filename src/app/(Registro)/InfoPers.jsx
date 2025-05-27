"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function InfoPersonal({ formData, onInputChange, validationErrors, isProfileEdit, isEditMode = false, onSave }) {
  const [age, setAge] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isAdult, setIsAdult] = useState(true);
  const [identityCardError, setIdentityCardError] = useState("");
  const [passportError, setPassportError] = useState("");
  const [days, setDays] = useState([]);

  // Constantes para los meses en español
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

  // Generación de años (desde 100 años atrás hasta el año actual menos 18)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => {
    const year = currentYear - 18 - i;
    return { value: year.toString(), label: year.toString() };
  });

  // Estado para almacenar la fecha seleccionada por partes
  const [birthDateParts, setBirthDateParts] = useState({
    year: "",
    month: "",
    day: ""
  });

  // Estado local para el formulario en modo edición
  const [localFormData, setLocalFormData] = useState(formData);

  // Función para capitalizar texto (primera letra después de espacio)
  const capitalizeText = (text) => {
    if (!text) return "";
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Función para validar caracteres en nombres y apellidos
  const validateNameChars = (value) => {
    // Usamos una expresión regular más permisiva que acepte letras, apóstrofes y espacios
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ'\s]+$/;
    return regex.test(value);
  };

  // Actualizar días según el mes y año seleccionados
  useEffect(() => {
    if (birthDateParts.month && birthDateParts.year) {
      const daysInMonth = new Date(
        parseInt(birthDateParts.year),
        parseInt(birthDateParts.month),
        0
      ).getDate();
      const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        return {
          value: day < 10 ? `0${day}` : day.toString(),
          label: day.toString()
        };
      });
      setDays(daysArray);
      // Si el día seleccionado es mayor que los días disponibles en el mes, resetear el día
      if (birthDateParts.day && parseInt(birthDateParts.day) > daysInMonth) {
        setBirthDateParts(prev => ({ ...prev, day: "" }));
      }
    }
  }, [birthDateParts.month, birthDateParts.year]);

  // Actualizar el estado local cuando cambian las props
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Aplicar capitalización y validación según el campo
    if (["firstName", "secondName", "firstLastName", "secondLastName"].includes(name)) {
      // Permitimos escribir espacios, pero eliminamos espacios dobles al procesar
      // No bloqueamos la entrada si hay espacios dobles
      processedValue = value.replace(/\s{2,}/g, ' ');
      processedValue = capitalizeText(processedValue);
      // Solo retornamos si hay caracteres no permitidos (que no sean espacios)
      if (processedValue && !validateNameChars(processedValue)) {
        return;
      }
    }

    // Modificar la validación para pasaporte: permitir formato alfanumérico
    if (name === "identityCard" && localFormData.documentType === "pasaporte") {
      // Permitir letras y números para pasaporte, convertir letras a mayúsculas
      processedValue = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    } else if (name === "identityCard" && localFormData.documentType === "cedula") {
      // Para cédula, solo permitir números
      processedValue = value.replace(/\D/g, "");
    }

    // Si estamos en modo edición, actualizamos el estado local
    if (isEditMode) {
      setLocalFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    } else {
      // Si no estamos en modo edición, comportamiento normal
      onInputChange({ [name]: processedValue });
    }

    // Si cambia el tipo de documento, reiniciar el valor de identityCard
    if (name === "documentType") {
      if (isEditMode) {
        setLocalFormData(prev => ({
          ...prev,
          documentType: value,
          identityCard: "",
          idType: value === "cedula" ? "V" : ""
        }));
      } else {
        onInputChange({
          documentType: value,
          identityCard: "",
          idType: value === "cedula" ? "V" : ""
        });
      }
      // Limpiar errores al cambiar de tipo de documento
      setIdentityCardError("");
      setPassportError("");
    }

    // Validate identity card length when it changes
    if (name === "identityCard") {
      if ((isEditMode ? localFormData.documentType : formData.documentType) === "cedula") {
        if (value.length > 0 && (value.length < 7 || value.length > 8)) {
          setIdentityCardError("La cédula debe tener entre 7 y 8 dígitos");
        } else {
          setIdentityCardError("");
        }
      } else if ((isEditMode ? localFormData.documentType : formData.documentType) === "pasaporte") {
        // Validar longitud de pasaporte (entre 4 y 15 caracteres)
        if (processedValue.length > 0 && (processedValue.length < 4 || processedValue.length > 15)) {
          setPassportError("El pasaporte debe tener entre 4 y 15 caracteres");
        } else {
          setPassportError("");
        }
      }
    }

    // Manejar los cambios en las partes de la fecha de nacimiento
    if (["birthDateYear", "birthDateMonth", "birthDateDay"].includes(name)) {
      const newBirthDateParts = {
        ...birthDateParts,
        [name.replace("birthDate", "").toLowerCase()]: value
      };
      setBirthDateParts(newBirthDateParts);
      // Si tenemos las tres partes, construir la fecha completa
      if (newBirthDateParts.year && newBirthDateParts.month && newBirthDateParts.day) {
        const fullDate = `${newBirthDateParts.year}-${newBirthDateParts.month}-${newBirthDateParts.day}`;
        calculateAge(fullDate);
        onInputChange({ birthDate: fullDate });
      } else {
        setAge("");
        setIsAdult(true);
        if (isEditMode) {
          setLocalFormData(prev => ({ ...prev, birthDate: "", age: "" }));
        } else {
          onInputChange({ birthDate: "", age: "" });
        }
      }
    }
  };

  // Modificar calculateAge para que actualice el estado local cuando estamos en modo edición
  const calculateAge = (birthDate) => {
    if (!birthDate) {
      setAge("");
      setIsAdult(true);
      return;
    }
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let calculatedAge = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      calculatedAge--;
    }
    // Verificar si es mayor de edad
    const isUserAdult = calculatedAge >= 18;
    setIsAdult(isUserAdult);
    
    if (isEditMode) {
      setLocalFormData(prev => ({
        ...prev,
        age: calculatedAge.toString(),
        birthDate: isUserAdult ? birthDate : ""
      }));
    } else {
      onInputChange({
        age: calculatedAge.toString(),
        birthDate: isUserAdult ? birthDate : ""
      });
    }
    
    setAge(calculatedAge.toString());
  };

  // Inicializar las partes de la fecha a partir de formData.birthDate cuando se carga el componente
  useEffect(() => {
    if (formData.birthDate) {
      const [year, month, day] = formData.birthDate.split('-');
      setBirthDateParts({ year, month, day });
    }
  }, []);

  // Validate form when formData changes
  useEffect(() => {
    const requiredFields = [
      "documentType",
      "identityCard",
      "firstName",
      "firstLastName",
      "birthDate",
      "gender",
      "maritalStatus"
    ];

    // Validar cédula o pasaporte según el tipo de documento
    let isIdentityCardValid = true;

    if (formData.documentType === "cedula" && formData.identityCard) {
      isIdentityCardValid = formData.identityCard.length >= 7 && formData.identityCard.length <= 8;
      if (!isIdentityCardValid) {
        setIdentityCardError("La cédula debe tener entre 7 y 8 dígitos");
      } else {
        setIdentityCardError("");
      }
    } else if (formData.documentType === "pasaporte" && formData.identityCard) {
      // Validar longitud de pasaporte
      if (formData.identityCard.length < 4 || formData.identityCard.length > 15) {
        setPassportError("El pasaporte debe tener entre 4 y 15 caracteres");
        isIdentityCardValid = false;
      } else {
        setPassportError("");
      }
    }

    const isValid = requiredFields.every(field => formData[field] && formData[field].trim() !== "") && isIdentityCardValid;
    setIsFormValid(isValid);
  }, [formData]);

  // Checks if a field has validation errors to display the required message
  const isFieldEmpty = (fieldName) => {
    return validationErrors && validationErrors[fieldName];
  };

  // Checks if a field has validation errors to display the required message
  const isFieldDuplicate = (fieldName) => {
    return validationErrors && validationErrors[fieldName+'-duplicate'];
  };

  // Determinar si es pasaporte para la validación
  const isPasaporte = formData.documentType === "pasaporte";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de Documento (anteriormente Nacionalidad) */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Tipo de Documento
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            {isProfileEdit ? (
              // En modo perfil, no editable
              <input
                type="text"
                value={formData.documentType === "cedula" ? "Cédula" : "Pasaporte"}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
                disabled
              />
            ) : (
              // En modo normal, editable
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                className={`cursor-pointer w-full px-4 py-3 border ${isFieldEmpty("documentType") ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
              >
                <option value="" disabled>
                  Tipo de Documento
                </option>
                <option value="cedula">Cédula</option>
                <option value="pasaporte">Pasaporte</option>
              </select>
            )}
            {!isProfileEdit && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            )}
          </div>
          {isProfileEdit && (
            <p className="mt-1 text-xs text-gray-500">Este campo no se puede editar</p>
          )}
          {isFieldEmpty("documentType") && !isProfileEdit && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>

        {/* Identity Card / Passport */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            {isPasaporte ? "Pasaporte" : "Identificación"}
            <span className="text-red-500 ml-1">*</span>
          </label>
          {isProfileEdit ? (
            // En modo perfil, no editable
            <input
              type="text"
              value={isPasaporte ? formData.identityCard : `${formData.idType} - ${formData.identityCard}`}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
              disabled
            />
          ) : (
            // En modo normal, editable según tipo de documento
            isPasaporte ? (
              // Caso Pasaporte: Campo de texto para formato alfanumérico
              <div>
                <input
                  type="text"
                  name="identityCard"
                  value={formData.identityCard}
                  maxLength={15}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${isFieldEmpty("identityCard") || passportError ? "border-red-500 bg-red-50" : "border-gray-200"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                  placeholder="Ingrese su número de pasaporte"
                  style={{ height: "48px" }}
                />
                {passportError && (
                  <p className="mt-1 text-xs text-red-500">{passportError}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Puede contener letras y números
                </p>
              </div>
            ) : (
              // Caso Cédula: Selector de V/E + campo numérico
              <div className="flex items-center relative">
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  className="h-full px-4 pr-10 py-3 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] text-gray-700 appearance-none"
                  style={{ height: "48px" }}
                >
                  <option value="V">V</option>
                  <option value="E">E</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-10">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  name="identityCard"
                  value={formData.identityCard}
                  minLength={7}
                  maxLength={8}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    handleChange({ target: { name: "identityCard", value } });
                  }}
                  className={`w-full px-4 py-3 border ${isFieldEmpty("identityCard") || identityCardError ? "border-red-500 bg-red-50" : "border-gray-200"
                    } rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                  placeholder="Ingrese su número de cédula"
                  style={{ height: "48px" }}
                />
              </div>
            )
          )}
          {isProfileEdit && (
            <p className="mt-1 text-xs text-gray-500">Este campo no se puede editar</p>
          )}
          {isFieldEmpty("identityCard") && !isProfileEdit && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
          {identityCardError && !isProfileEdit && formData.documentType === "cedula" && (
            <p className="mt-1 text-xs text-red-500">{identityCardError}</p>
          )}
          {isFieldDuplicate("identityCard") && !isProfileEdit && (
            <p className="mt-1 text-xs text-red-500">El numero de identificación ya se encuentra registrado.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Primer Nombre
            <span className="text-red-500 ml-1">*</span>
          </label>
          {isProfileEdit ? (
            // En modo perfil, no editable
            <input
              type="text"
              value={formData.firstName}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
              disabled
            />
          ) : (
            // En modo normal, editable
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${isFieldEmpty("firstName") ? "border-red-500 bg-red-50" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
              placeholder="Ingrese su primer nombre"
            />
          )}
          {isProfileEdit && (
            <p className="mt-1 text-xs text-gray-500">Este campo no se puede editar</p>
          )}
          {isFieldEmpty("firstName") && !isProfileEdit && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
        {/* Second Name - Siempre editable */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Segundo Nombre
          </label>
          <input
            type="text"
            name="secondName"
            value={formData.secondName || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
            placeholder="Ingrese su segundo nombre"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Last Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Primer Apellido
            <span className="text-red-500 ml-1">*</span>
          </label>
          {isProfileEdit ? (
            // En modo perfil, no editable
            <input
              type="text"
              value={formData.firstLastName || ""}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
              disabled
            />
          ) : (
            // En modo normal, editable
            <input
              type="text"
              name="firstLastName"
              value={formData.firstLastName || ""}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${isFieldEmpty("firstLastName") ? "border-red-500 bg-red-50" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
              placeholder="Ingrese su primer apellido"
            />
          )}
          {isProfileEdit && (
            <p className="mt-1 text-xs text-gray-500">Este campo no se puede editar</p>
          )}
          {isFieldEmpty("firstLastName") && !isProfileEdit && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
        {/* Second Last Name - Siempre editable */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Segundo Apellido
          </label>
          <input
            type="text"
            name="secondLastName"
            value={formData.secondLastName || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
            placeholder="Ingrese su segundo apellido"
          />
        </div>
      </div>

      {/* Nueva fila con tres columnas para fecha de nacimiento, género y estado civil */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fecha de Nacimiento (con selectores separados) */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Fecha de Nacimiento
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Selector de año */}
            <div className="relative">
              <select
                name="birthDateYear"
                value={birthDateParts.year}
                onChange={handleChange}
                className={`cursor-pointer w-full px-2 py-3 border ${isFieldEmpty("birthDate") ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
              >
                <option value="" disabled>
                  Año
                </option>
                {years.map(year => (
                  <option key={`year-${year.value}`} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {/* Selector de mes */}
            <div className="relative">
              <select
                name="birthDateMonth"
                value={birthDateParts.month}
                onChange={handleChange}
                className={`cursor-pointer w-full px-2 py-3 border ${isFieldEmpty("birthDate") ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
              >
                <option value="" disabled>
                  Mes
                </option>
                {months.map(month => (
                  <option key={`month-${month.value}`} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {/* Selector de día */}
            <div className="relative">
              <select
                name="birthDateDay"
                value={birthDateParts.day}
                onChange={handleChange}
                className={`cursor-pointer w-full px-2 py-3 border ${isFieldEmpty("birthDate") ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
              >
                <option value="" disabled>
                  Día
                </option>
                {days.map(day => (
                  <option key={`day-${day.value}`} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          {isFieldEmpty("birthDate") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
          {!isAdult && formData.birthDate && (
            <p className="mt-1 text-xs text-red-500">Debe ser mayor de edad (18 años o más)</p>
          )}
        </div>

        {/* Género */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Género
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`cursor-pointer w-full px-4 py-3 border ${isFieldEmpty("gender") ? "border-red-500 bg-red-50" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
            >
              <option value="" disabled>
                Seleccionar Género
              </option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
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
          {isFieldEmpty("gender") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>

        {/* Estado Civil */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Estado Civil
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className={`cursor-pointer w-full px-4 py-3 border ${isFieldEmpty("maritalStatus") ? "border-red-500 bg-red-50" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
            >
              <option value="" disabled>
                Seleccionar Estado Civil
              </option>
              <option value="soltero">Soltero</option>
              <option value="casado">Casado</option>
              <option value="divorciado">Divorciado</option>
              <option value="viudo">Viudo</option>
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
          {isFieldEmpty("maritalStatus") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
      </div>
     {/* Si estamos en modo edición, mostrar botones de guardar/cancelar */}
      {isEditMode && (
        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
          <button
            type="button"
            onClick={() => onSave ? onSave(localFormData) : onInputChange(localFormData)}
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