"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Image as ImageIcon, PlusCircle, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { createNewSection, getNextImage, initialSections } from "@/app/Models/PanelControl/PaginaWeb/Inicio/PresentacionData";

export default function PresentacionDashboard({ moduleInfo }) {
  const [sections, setSections] = useState(initialSections);
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [previewSection, setPreviewSection] = useState(0);

  // Función para agregar una nueva sección
  const addNewSection = () => {
    const newSection = createNewSection();
    setSections([...sections, newSection]);
    setExpandedPanel(newSection.id);
  };

  // Función para eliminar una sección
  const deleteSection = (id) => {
    setSections(sections.filter(section => section.id !== id));
    if (expandedPanel === id) {
      setExpandedPanel(null);
    }
    // Actualizar la vista previa si es necesario
    if (previewSection >= sections.length - 1) {
      setPreviewSection(Math.max(0, sections.length - 2));
    }
  };

  // Función para actualizar una sección
  const updateSection = (id, field, value) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  // Función para mover secciones arriba o abajo
  const moveSection = (id, direction) => {
    const index = sections.findIndex(section => section.id === id);
    if ((direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)) {
      return;
    }

    const newSections = [...sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];

    setSections(newSections);

    // Actualizar la vista previa si es necesario
    if (previewSection === index) {
      setPreviewSection(newIndex);
    } else if (previewSection === newIndex) {
      setPreviewSection(index);
    }
  };

  // Función para cambiar imagen (usando la función del archivo de datos)
  const handleImageChange = (id) => {
    const currentImage = sections.find(section => section.id === id).image;
    const nextImage = getNextImage(currentImage);
    updateSection(id, 'image', nextImage);
  };

  // Guardar cambios (simulado)
  const saveChanges = () => {
    alert("Cambios guardados correctamente");
    console.log("Secciones guardadas:", sections);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <h2 className="text-2xl font-bold mb-2" style={{ color: moduleInfo.color }}>
          {moduleInfo.title}
        </h2>
        <p className="text-gray-600 text-sm">
          Personaliza las secciones de presentación que aparecerán en la página web
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Preview Panel - LEFT (1/3 width) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-4"
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Vista Previa</h3>
            </div>

            <div className="relative">
              {/* Visual Preview */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <div className="absolute inset-0 bg-gray-900">
                  <Image
                    src={sections[previewSection]?.image || "/assets/presentacion/placeholder.jpg"}
                    alt="Preview"
                    fill
                    style={{ objectFit: 'cover', opacity: 0.9 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-bold">
                    {sections[previewSection]?.title || "Sin título"}
                  </h3>
                  <p className="text-sm mt-1">
                    {sections[previewSection]?.description || "Sin descripción"}
                  </p>
                  <button
                    className="mt-3 px-4 py-1.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: moduleInfo.color }}
                  >
                    Más información
                  </button>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="absolute bottom-3 right-3 flex space-x-1">
                {sections.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPreviewSection(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${previewSection === index ? 'bg-white w-4' : 'bg-white/30 w-2'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Preview Navigation */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setPreviewSection((prev) => (prev === 0 ? sections.length - 1 : prev - 1))}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                disabled={sections.length === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-sm text-gray-500">
                {sections.length > 0 ? `${previewSection + 1} / ${sections.length}` : "No hay secciones"}
              </div>
              <button
                onClick={() => setPreviewSection((prev) => (prev === sections.length - 1 ? 0 : prev + 1))}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                disabled={sections.length === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Editor Panel - RIGHT (2/3 width) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Secciones</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addNewSection}
                className="px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium"
                style={{ backgroundColor: moduleInfo.color, color: 'white' }}
              >
                <PlusCircle size={14} />
                <span>Agregar</span>
              </motion.button>
            </div>

            {/* Sections List */}
            <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {sections.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No hay secciones. Haz clic en "Agregar" para crear la primera.
                </div>
              ) : (
                sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Section Header */}
                    <div
                      className={`flex justify-between items-center p-3 cursor-pointer ${expandedPanel === section.id ? 'bg-gray-50' : 'bg-white'
                        } hover:bg-gray-50 transition-colors duration-200`}
                      onClick={() => setExpandedPanel(expandedPanel === section.id ? null : section.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative h-10 w-16 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={section.image}
                            alt={section.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                            {section.title || "Sin título"}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {section.description || "Sin descripción"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: previewSection === index ? `${moduleInfo.color}20` : 'rgb(243 244 246)',
                            color: previewSection === index ? moduleInfo.color : 'rgb(75 85 99)'
                          }}
                        >
                          #{index + 1}
                        </span>
                        {expandedPanel === section.id ? (
                          <ChevronUp size={18} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-500" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedPanel === section.id && (
                      <div className="p-3 border-t border-gray-200 bg-white">
                        <div className="grid grid-cols-1 gap-3">
                          {/* Imagen */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Imagen
                            </label>
                            <div className="relative h-36 bg-gray-100 rounded overflow-hidden">
                              <Image
                                src={section.image}
                                alt={section.title}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                              <button
                                onClick={() => handleImageChange(section.id)}
                                className="absolute bottom-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full text-gray-700 transition-colors"
                              >
                                <ImageIcon size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Campos de texto */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Título
                            </label>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:border-gray-300"
                              style={{
                                "--tw-ring-color": moduleInfo.color,
                                borderColor: "var(--tw-ring-color)"
                              }}
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Descripción
                            </label>
                            <textarea
                              value={section.description}
                              onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:border-gray-300 resize-none"
                              style={{
                                "--tw-ring-color": moduleInfo.color,
                                borderColor: "var(--tw-ring-color)"
                              }}
                            />
                          </div>

                          {/* Acciones */}
                          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                            <div className="flex gap-1">
                              <button
                                onClick={() => moveSection(section.id, 'up')}
                                disabled={index === 0}
                                className={`p-1 rounded ${index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`}
                                title="Mover arriba"
                              >
                                <ArrowUp size={16} />
                              </button>
                              <button
                                onClick={() => moveSection(section.id, 'down')}
                                disabled={index === sections.length - 1}
                                className={`p-1 rounded ${index === sections.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`}
                                title="Mover abajo"
                              >
                                <ArrowDown size={16} />
                              </button>
                            </div>
                            <button
                              onClick={() => deleteSection(section.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveChanges}
            className="w-full py-2 text-white rounded-lg font-medium flex justify-center items-center gap-2 shadow-sm"
            style={{ backgroundColor: moduleInfo.color }}
          >
            <Save size={16} />
            <span>Guardar Cambios</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}