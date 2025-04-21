"use client";

import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Edit, Plus, Save, Trash } from 'lucide-react';
import React from "react";
import useServiciosData, { getIconComponent } from '../../../Models/PaginaWeb/Inicio/ServiciosData';

// Componente para la tarjeta de servicio en modo visualización
const ServiceCard = ({ icon: Icon, number, title, description, index, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1
      }
    }}
    whileHover={{
      scale: 1.03,
      transition: { duration: 0.2 }
    }}
    className="relative py-10 px-6 sm:px-8 md:px-12 bg-white rounded-xl shadow-md hover:shadow-xl shadow-[#590248]/30 transition-all duration-300 border-t-4 border-b-2 border-[#C40180] overflow-hidden group"
  >
    <div className="absolute text-[20px] top-4 left-4 w-10 h-10 bg-gradient-to-br from-[#C40180] to-[#590248] rounded-full flex items-center justify-center text-white font-bold shadow-md">
      {number}
    </div>
    <div className="mb-6 mt-4 flex justify-center items-center">
      <h3 className="text-xl font-bold text-[#590248] text-center mr-8">
        {title}
      </h3>
      <div className="w-18 h-14 bg-gradient-to-br from-[#C40180] to-[#590248] rounded-lg flex items-center justify-center transform rotate-10 shadow-lg">
        <Icon className="w-10 h-10 text-white" />
      </div>
    </div>
    <div className="text-[#646566] text-sm pl-2 min-h-[100px] font-semibold text-center">
      {description}
    </div>

    {/* Botones de administración */}
    <div className="flex justify-between items-center mt-4">
      <motion.div
        className="flex items-center cursor-pointer text-blue-600 font-medium text-sm"
        whileHover={{ x: 5 }}
        onClick={onEdit}
      >
        <Edit className="w-4 h-4 mr-1 inline" /> Editar
      </motion.div>
      <motion.div
        className="flex items-center cursor-pointer text-red-600 font-medium text-sm"
        whileHover={{ x: 5 }}
        onClick={onDelete}
      >
        <Trash className="w-4 h-4 mr-1 inline" /> Eliminar
      </motion.div>
    </div>

    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C40180] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
  </motion.div>
);

// Componente para la tarjeta de servicio en modo edición
const ServiceCardEdit = ({ service, index, onSave, onCancel, iconOptions }) => {
  const [formData, setFormData] = React.useState({
    title: service.title,
    description: service.description,
    icon: service.icon
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(index, formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative py-10 px-6 sm:px-8 md:px-12 bg-white rounded-xl shadow-md border-t-4 border-b-2 border-blue-500 overflow-hidden"
    >
      <form onSubmit={handleSubmit}>
        <div className="absolute text-[20px] top-4 left-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-md">
          {index + 1}
        </div>

        <div className="mb-6 mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Título
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline min-h-[100px]"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Icono
          </label>
          <select
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            {iconOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          >
            <Save className="w-4 h-4 mr-2" /> Guardar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default function ServiciosDashboard({ moduleInfo }) {
  const {
    services,
    editingIndex,
    setEditingIndex,
    headerData,
    handleEditService,
    handleSaveService,
    handleDeleteService,
    handleAddService,
    iconOptions
  } = useServiciosData();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: moduleInfo.color }}>
        {moduleInfo.title}
      </h2>
      <p className="text-gray-600 mb-6">
        Administra la sección de servicios que se muestra en la página principal
      </p>

      {/* Sección de tarjetas de servicios */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#590248]"></h3>
          <button
            onClick={handleAddService}
            className="px-4 py-2 text-white rounded-md hover:bg-[#590248] transition-colors flex items-center"
            style={{ backgroundColor: moduleInfo.color, color: 'white' }}
          >
            <Plus className="w-4 h-4 mr-2" /> Añadir servicio
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            editingIndex === index ? (
              <ServiceCardEdit
                key={index}
                service={service}
                index={index}
                onSave={handleSaveService}
                onCancel={() => setEditingIndex(null)}
                iconOptions={iconOptions}
              />
            ) : (
              <ServiceCard
                key={index}
                icon={getIconComponent(service.icon)}
                number={index + 1}
                title={service.title}
                description={service.description}
                index={index}
                onEdit={() => handleEditService(index)}
                onDelete={() => handleDeleteService(index)}
              />
            )
          ))}
        </div>
      </div>

      {/* Botón de guardar cambios */}
      <div className="flex justify-end mt-8">
        <button className="px-6 py-3 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 flex items-center"
        style={{ backgroundColor: moduleInfo.color, color: 'white' }}>
          Guardar todos los cambios
          <Save className="w-5 h-5 ml-2" />
        </button>
      </div>

      {/* Vista previa */}
      <div className="mt-12 border-t pt-8">
        <h3 className="text-xl font-bold text-black mb-6">Vista previa</h3>

        <div className="bg-gray-100 p-8 rounded-xl">
          <div className="text-center mb-12">
            <motion.span
              className="text-sm font-medium text-[#C40180] uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {headerData.subtitle}
            </motion.span>
            <motion.h2
              className="text-3xl sm:text-4xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              {headerData.title}
            </motion.h2>
            <motion.p
              className="mt-6 max-w-2xl mx-auto text-gray-600 px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              {headerData.description}
            </motion.p>
          </div>
          

          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      delay: index * 0.1
                    }
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{
                    scale: 1.03,
                    transition: { duration: 0.2 }
                  }}
                  className="relative py-10 px-6 bg-white rounded-xl shadow-md hover:shadow-xl shadow-[#590248]/30 transition-all duration-300 border-t-4 border-b-2 border-[#C40180] overflow-hidden group"
                >
                  <div className="absolute text-[20px] top-4 left-4 w-10 h-10 bg-gradient-to-br from-[#C40180] to-[#590248] rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {index + 1}
                  </div>
                  <div className="mb-6 mt-4 flex justify-center items-center">
                    <h3 className="text-xl font-bold text-[#590248] text-center mr-8">
                      {service.title}
                    </h3>
                    <div className="w-18 h-14 bg-gradient-to-br from-[#C40180] to-[#590248] rounded-lg flex items-center justify-center transform rotate-10 shadow-lg">
                      {React.createElement(getIconComponent(service.icon), { className: "w-10 h-10 text-white" })}
                    </div>
                  </div>
                  <div className="text-[#646566] text-sm pl-2 min-h-[100px] font-semibold text-center">
                    {service.description}
                  </div>
                  <motion.div
                    className="flex items-center justify-end cursor-pointer text-[#C40180] font-medium text-sm mt-4"
                    whileHover={{ x: 5 }}
                  >
                    Ver más <ChevronRight className="w-4 h-4 ml-1 inline" />
                  </motion.div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C40180] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <button className="px-6 py-3 bg-gradient-to-r from-[#C40180] to-[#590248] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 flex items-center mx-auto">
              Ingresa Ahora
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}