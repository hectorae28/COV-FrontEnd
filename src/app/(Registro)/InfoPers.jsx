import React, { useState } from "react";
import { motion } from "framer-motion";

export default function InfoPersonal({ formData, onInputChange }) {
  const [age, setAge] = useState("");

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
          <label className="block mb-2 text-sm font-medium text-[#41023B]">
            Nacionalidad
          </label>
          <div className="relative">
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-[#D7008A] 
              appearance-none text-gray-700"
            >
              <option value="">Seleccionar Nacionalidad</option>
              <option value="cedula">Venezolana</option>
              <option value="pasaporte">Extranjera</option>
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
        </div>

        {/* Identity Card */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">
            Número de Identificación
          </label>
          <input
            type="text"
            name="identityCard"
            value={formData.identityCard}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
            placeholder="Ingrese su número de identificación"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">
            Nombre(s)
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
            placeholder="Ingrese su nombre"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">
            Apellido(s)
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
            placeholder="Ingrese su apellido"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Birth Place */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">
            Lugar de Nacimiento
          </label>
          <input
            type="text"
            name="birthPlace"
            value={formData.birthPlace}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
            placeholder="Ciudad / Estado"
          />
        </div>

        {/* Birth Date */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">
            Fecha de Nacimiento
          </label>
          <div className="relative">
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-[#D7008A] 
              text-gray-700"
            />
          </div>
        </div>

        {/* Age (Read-only) */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">
            Edad
          </label>
          <input
            type="text"
            name="age"
            value={age}
            readOnly
            className="w-full px-4 py-3 border border-gray-200 rounded-xl 
            bg-gray-100 cursor-not-allowed"
            placeholder="Mayor de 18 años de edad"
          />
        </div>
      </div>

      {/* Marital Status */}
      <div>
        <label className="block mb-2 text-sm font-medium text-[#41023B]">
          Estado Civil
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Soltero", "Casado", "Divorciado", "Viudo"].map((status) => (
            <label
              key={status}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name="maritalStatus"
                value={status.toLowerCase()}
                checked={formData.maritalStatus === status.toLowerCase()}
                onChange={handleChange}
                className="text-[#D7008A] focus:ring-[#D7008A]"
              />
              <span className="text-gray-700">{status}</span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
