import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function InfoPersonal({ formData, onInputChange, validationErrors }) {
  const [age, setAge] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onInputChange({ [name]: value });

    // Special handling for birth date to calculate age
    if (name === "birthDate") {
      calculateAge(value);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) {
      setAge("");
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

    onInputChange({ age: calculatedAge.toString() });
    setAge(calculatedAge.toString());
  };

  // Validate form when formData changes - but don't call onInputChange here
  // This is what was creating the infinite loop
  useEffect(() => {
    const requiredFields = [
      "nationality",
      "identityCard",
      "firstName",
      "secondName",
      "firstLastName",
      "secondLastName",
      "birthDate",
      "gender",
      "maritalStatus"
    ];

    const isValid = requiredFields.every(field => formData[field] && formData[field].trim() !== "");
    setIsFormValid(isValid);

  }, [formData]);

  const isFieldEmpty = (fieldName) => {
    return (!formData[fieldName] || formData[fieldName].trim() === "");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nationality */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Nacionalidad
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${isFieldEmpty("nationality") ? "border-gray-200" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
            >
              <option value="" disabled>
                Seleccionar Nacionalidad
              </option>
              <option value="venezolano">Venezolana</option>
              <option value="extranjero">Extranjera</option>
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
          {isFieldEmpty("nationality") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>

        {/* Identity Card */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Número de Identificación
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex items-center">
            {/* Select for V or E */}
            <select
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              className="h-full px-4 py-3 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] text-gray-700"
              style={{ height: "48px" }} // Asegura que el select tenga la misma altura
            >
              <option value="V">V</option>
              <option value="E">E</option>
            </select>
            {/* Input for identity card */}
            <input
              type="text"
              name="identityCard"
              value={formData.identityCard}
              maxLength={8}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                handleChange({ target: { name: "identityCard", value } });
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
              placeholder="Ingrese su número de identificación"
              style={{ height: "48px" }} // Asegura que el input tenga la misma altura
            />
          </div>
          {isFieldEmpty("identityCard") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
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
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${isFieldEmpty("firstName") ? "border-gray-200" : "border-gray-200"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
            placeholder="Ingrese su primer nombre"
          />
          {isFieldEmpty("firstName") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>

        {/* Second Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Segundo Nombre
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="secondName"
            value={formData.secondName || ""}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${isFieldEmpty("secondName") ? "border-gray-200" : "border-gray-200"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
            placeholder="Ingrese su segundo nombre"
          />
          {isFieldEmpty("secondName") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Last Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Primer Apellido
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="firstLastName"
            value={formData.firstLastName || ""}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${isFieldEmpty("firstLastName") ? "border-gray-200" : "border-gray-200"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
            placeholder="Ingrese su primer apellido"
          />
          {isFieldEmpty("firstLastName") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>

        {/* Second Last Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Segundo Apellido
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="secondLastName"
            value={formData.secondLastName || ""}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${isFieldEmpty("secondLastName") ? "border-gray-200" : "border-gray-200"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
            placeholder="Ingrese su segundo apellido"
          />
          {isFieldEmpty("secondLastName") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Birth Date */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Fecha de Nacimiento
            <span className="text-red-500 ml-1">*</span>
            {formData.age && formData.age > 0 && ` (${formData.age} años)`}
          </label>
          <div className="relative">
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${isFieldEmpty("birthDate") ? "border-gray-200" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] text-gray-700`}
            />
          </div>
          {isFieldEmpty("birthDate") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>

        {/* Gender */}
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
              className={`w-full px-4 py-3 border ${isFieldEmpty("gender") ? "border-gray-200" : "border-gray-200"
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

      {/* Marital Status as dropdown */}
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
            className={`w-full px-4 py-3 border ${isFieldEmpty("maritalStatus") ? "border-gray-200" : "border-gray-200"
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