import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function InfoPersonal({ formData, onInputChange, validationErrors, isProfileEdit }) {
  const [age, setAge] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isAdult, setIsAdult] = useState(true);
  const [identityCardError, setIdentityCardError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    onInputChange({ [name]: value });

    // Special handling for birth date to calculate age
    if (name === "birthDate") {
      calculateAge(value);
    }

    // Si cambia el tipo de documento, reiniciar el valor de identityCard
    if (name === "documentType") {
      onInputChange({
        documentType: value,
        identityCard: "",
        idType: value === "cedula" ? "V" : ""
      });
    }

    // Validate identity card length when it changes
    if (name === "identityCard" && formData.documentType === "cedula") {
      if (value.length > 0 && (value.length < 7 || value.length > 8)) {
        setIdentityCardError("La cédula debe tener entre 7 y 8 dígitos");
      } else {
        setIdentityCardError("");
      }
    }
  };

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
    onInputChange({
      age: calculatedAge.toString(),
      birthDate: isUserAdult ? birthDate : ""
    });
    setAge(calculatedAge.toString());
  };

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

    // Check if identity card meets the length requirement for cédula
    let isIdentityCardValid = true;
    if (formData.documentType === "cedula" && formData.identityCard) {
      isIdentityCardValid = formData.identityCard.length >= 7 && formData.identityCard.length <= 8;

      if (!isIdentityCardValid) {
        setIdentityCardError("La cédula debe tener entre 7 y 8 dígitos");
      } else {
        setIdentityCardError("");
      }
    }

    const isValid = requiredFields.every(field => formData[field] && formData[field].trim() !== "") && isIdentityCardValid;
    setIsFormValid(isValid);
  }, [formData]);

  // Checks if a field has validation errors to display the required message
  const isFieldEmpty = (fieldName) => {
    return validationErrors && validationErrors[fieldName];
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
            {isPasaporte ? "Número de Pasaporte" : "Número de Identificación"}
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
              // Caso Pasaporte: Solo campo de texto para el número
              <input
                type="text"
                name="identityCard"
                value={formData.identityCard}
                maxLength={15}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${isFieldEmpty("identityCard") ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                placeholder="Ingrese su número de pasaporte"
                style={{ height: "48px" }}
              />
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
        </div>
      </div>

      {/* Rest of the component remains the same */}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Birth Date - Siempre editable */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Fecha de Nacimiento
            {formData.age && formData.age > 0 && ` (Mayor de Edad)`}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${(!isAdult && formData.birthDate) || isFieldEmpty("birthDate") ? "border-red-500 bg-red-50" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] text-gray-700`}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
            />
          </div>
          {isFieldEmpty("birthDate") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
          {!isAdult && formData.birthDate && (
            <p className="mt-1 text-xs text-red-500">Debe ser mayor de edad (18 años o más)</p>
          )}
        </div>
        {/* Gender - Siempre editable */}
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
      </div>
      {/* Marital Status as dropdown - Siempre editable */}
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
    </motion.div>
  );
}
