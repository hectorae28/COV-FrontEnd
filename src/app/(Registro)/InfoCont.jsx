import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function InfoContacto({ formData, onInputChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onInputChange({ [name]: value });
  };

  // Sample Venezuelan states
  const venezuelanStates = [
    'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar', 
    'Carabobo', 'Cojedes', 'Delta Amacuro', 'Falcón', 'Guárico', 'Lara', 
    'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa', 
    'Sucre', 'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Email */}
      <div>
        <label className="block mb-2 text-sm font-medium text-[#41023B]">
          Correo Electrónico
        </label>
        <div className="relative">
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
            placeholder="ejemplo@correo.com"
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Phone Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mobile Phone */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">
            Número de Teléfono Móvil
          </label>
          <div className="relative">
            <input 
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              maxLength="11"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
              placeholder="0412-1234567"
              pattern="[0-9]{4}-[0-9]{7}"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
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
              value={formData.homePhone}
              onChange={handleChange}
              maxLength="11"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
              placeholder="0212-1234567"
              pattern="[0-9]{4}-[0-9]{7}"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Home Address */}
      <div>
        <label className="block mb-2 text-sm font-medium text-[#41023B]">
          Dirección de Habitación
        </label>
        <div className="relative">
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-[#D7008A] 
            min-h-[100px]"
            placeholder="Ingrese su dirección completa"
          />
          <MapPin className="absolute left-3 top-4 text-gray-400" />
        </div>
      </div>

      {/* State and City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">
            Estado
          </label>
          <div className="relative">
            <select 
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-[#D7008A] 
              appearance-none text-gray-700"
            >
              <option value="">Seleccionar Estado</option>
              {venezuelanStates.map((state) => (
                <option key={state} value={state.toLowerCase()}>
                  {state}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">
            Ciudad
          </label>
          <input 
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
            placeholder="Ingrese su ciudad"
          />
        </div>
      </div>
    </motion.div>
  );
}