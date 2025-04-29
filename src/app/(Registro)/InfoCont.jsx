import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import phoneCodes from "@/app/Models/phoneCodes"; // Assuming you have a file with phone codes
export default function InfoContacto({ formData, onInputChange, validationErrors }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onInputChange({ [name]: value });
  };



  const venezuelanStates = [
    "Amazonas",
    "Anzoátegui",
    "Apure",
    "Aragua",
    "Barinas",
    "Bolívar",
    "Carabobo",
    "Cojedes",
    "Delta Amacuro",
    "Falcón",
    "Guárico",
    "Lara",
    "Mérida",
    "Miranda",
    "Monagas",
    "Nueva Esparta",
    "Portuguesa",
    "Sucre",
    "Táchira",
    "Trujillo",
    "Vargas",
    "Yaracuy",
    "Zulia",
  ];

  const isFieldEmpty = (fieldName) => {
    return (!formData[fieldName] || formData[fieldName].trim() === "" || (fieldName === 'phoneNumber' && formData[fieldName] === '+'));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Email */}
      <div>
        <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
          Correo Electrónico
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 border ${isFieldEmpty("email") ? "border-gray-200" : "border-gray-200"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
            placeholder="ejemplo@correo.com"
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {isFieldEmpty("email") && (
          <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Número de Teléfono Móvil
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex items-center">
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className="px-2 py-3 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] text-gray-700"
              style={{ height: "48px" }} 
            >
              {phoneCodes.map((code, index) => (
                <option key={index} value={code.codigo}>{code.codigo}</option>
              ))}
            </select>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange({ target: { name: "phoneNumber", value } });
              }}
              maxLength={phoneCodes.find(c => c.codigo === formData.countryCode)?.longitud || 10}
              className="w-full px-4 py-3 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
              placeholder="Ingrese su número de teléfono"
              style={{ height: "48px" }} 
            />
          </div>
          {isFieldEmpty("phoneNumber") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Debe ingresar el código de área seguido del número de servicio y número de teléfono. Ejemplo: 584241986646
          </p>
        </div>
        {/* Home Phone */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">
            Teléfono de Habitación
          </label>
          <div className="relative">
            <input
              type="tel"
              name="homePhone"
              value={formData.homePhone || ''}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
              placeholder="0212 123 4567"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      {/* State and City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Estado
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              name="state"
              value={formData.state || ''}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${isFieldEmpty("state") ? "border-gray-200" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
            >
              <option value="">Seleccionar Estado</option>
              {venezuelanStates.map((state) => (
                <option key={state} value={state.toLowerCase()}>
                  {state}
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
          {isFieldEmpty("state") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
        {/* City */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Ciudad
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${isFieldEmpty("city") ? "border-gray-200" : "border-gray-200"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
            placeholder="Ingrese su ciudad"
          />
          {isFieldEmpty("city") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
      </div>
      {/* Home Address */}
      <div>
        <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
          Dirección de Habitación
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <textarea
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 border ${isFieldEmpty("address") ? "border-gray-200" : "border-gray-200"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] min-h-[100px]`}
            placeholder="Ingrese su dirección completa"
          />
          <MapPin className="absolute left-3 top-4 text-gray-400" />
        </div>
        {isFieldEmpty("address") && (
          <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
        )}
      </div>
    </motion.div>
  );
}
