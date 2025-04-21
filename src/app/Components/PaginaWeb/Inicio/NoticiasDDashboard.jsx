"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  PlusCircle,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  ChevronRight
} from "lucide-react";
import Image from "next/image";

// Importamos los datos iniciales de noticias
import initialNewsItems from "../../../Models/PaginaWeb/Inicio/NoticiasData";

export default function NoticiasDashboard({ moduleInfo }) {
  const [newsItems, setNewsItems] = useState(initialNewsItems);
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [previewNews, setPreviewNews] = useState(0);

  // Función para agregar una nueva noticia
  const addNewNews = () => {
    const newNews = {
      id: Date.now(),
      date: formatDate(new Date()),
      time: formatTime(new Date()),
      title: "Nueva noticia",
      description: "Descripción de la nueva noticia",
      imageUrl: "/assets/noticias/placeholder.png",
    };
    
    setNewsItems([...newsItems, newNews]);
    setExpandedPanel(newNews.id);
  };

  // Función para formatear la fecha
  const formatDate = (date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Función para formatear la hora
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')}${ampm}`;
  };

  // Función para eliminar una noticia
  const deleteNews = (id) => {
    setNewsItems(newsItems.filter(news => news.id !== id));
    if (expandedPanel === id) {
      setExpandedPanel(null);
    }
    // Actualizar la vista previa si es necesario
    if (previewNews >= newsItems.length - 1) {
      setPreviewNews(Math.max(0, newsItems.length - 2));
    }
  };

  // Función para actualizar una noticia
  const updateNews = (id, field, value) => {
    setNewsItems(newsItems.map(news => 
      news.id === id ? { ...news, [field]: value } : news
    ));
  };

  // Función para mover noticias arriba o abajo
  const moveNews = (id, direction) => {
    const index = newsItems.findIndex(news => news.id === id);
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === newsItems.length - 1)) {
      return;
    }
    
    const newNewsItems = [...newsItems];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newNewsItems[index], newNewsItems[newIndex]] = [newNewsItems[newIndex], newNewsItems[index]];
    
    setNewsItems(newNewsItems);
    
    // Actualizar la vista previa si es necesario
    if (previewNews === index) {
      setPreviewNews(newIndex);
    } else if (previewNews === newIndex) {
      setPreviewNews(index);
    }
  };

  // Función para cambiar imagen (simulada)
  const handleImageChange = (id) => {
    const placeholders = [
      "/assets/noticias/ancho.png",
      "/assets/noticias/normal2.png",
      "/assets/noticias/ancho2.png",
      "/assets/noticias/normal5.png",
      "/assets/noticias/alto.png",
      "/assets/noticias/placeholder.png"
    ];
    
    const currentImage = newsItems.find(news => news.id === id).imageUrl;
    const currentIndex = placeholders.indexOf(currentImage);
    const nextIndex = (currentIndex + 1) % placeholders.length;
    
    updateNews(id, 'imageUrl', placeholders[nextIndex]);
  };

  // Guardar cambios (simulado)
  const saveChanges = () => {
    alert("Cambios guardados correctamente");
    console.log("Noticias guardadas:", newsItems);
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
          Administra las noticias y actualizaciones que aparecerán en la página web
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Preview Panel - LEFT (4/6 width) */}
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewNews}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-full"
                >
                  <div className="flex flex-col md:flex-row w-full">
                    {/* Image Section */}
                    <div className="w-full md:w-1/2 h-64 md:h-96 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gray-900">
                        <Image
                          src={newsItems[previewNews]?.imageUrl || "/assets/noticias/placeholder.png"}
                          alt={newsItems[previewNews]?.title || "Sin título"}
                          fill
                          style={{ objectFit: 'cover', opacity: 0.9 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                      {/* Date & Time Badge */}
                      <div className="mb-4 flex items-center space-x-2 text-sm">
                        <div className="flex items-center text-[#C40180]">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="font-medium text-gray-800">
                            {newsItems[previewNews]?.date || "DD/MM/YYYY"}
                          </span>
                        </div>
                        <span className="text-gray-400">|</span>
                        <div className="flex items-center text-[#C40180]">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="font-medium text-gray-800">
                            {newsItems[previewNews]?.time || "HH:MMam"}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                          {newsItems[previewNews]?.title || "Sin título"}
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base mb-6">
                          {newsItems[previewNews]?.description || "Sin descripción"}
                        </p>
                      </div>
                      
                      {/* Read More Button */}
                      <div className="mt-auto flex justify-end">
                        <motion.button
                          className="flex items-center text-[#C40180] font-medium text-sm md:text-base group"
                          whileHover={{ x: 5 }}
                        >
                          Leer más
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation Dots */}
              <div className="absolute bottom-3 right-3 flex space-x-1">
                {newsItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPreviewNews(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      previewNews === index ? 'bg-white w-4' : 'bg-white/30 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Preview Navigation */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setPreviewNews((prev) => (prev === 0 ? newsItems.length - 1 : prev - 1))}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                disabled={newsItems.length === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-sm text-gray-500">
                {newsItems.length > 0 ? `${previewNews + 1} / ${newsItems.length}` : "No hay noticias"}
              </div>
              <button
                onClick={() => setPreviewNews((prev) => (prev === newsItems.length - 1 ? 0 : prev + 1))}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                disabled={newsItems.length === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Thumbnails Preview */}
            <div className="flex justify-center p-3 gap-2 overflow-x-auto border-t border-gray-200">
              {newsItems.map((item, index) => (
                <motion.div
                  key={index}
                  className={`relative cursor-pointer rounded-md overflow-hidden ${previewNews === index ? 'ring-2 ring-[#C40180]' : 'opacity-70'}`}
                  onClick={() => setPreviewNews(index)}
                  whileHover={{ scale: 1.05, opacity: 1 }}
                >
                  <div className="w-20 h-12 relative">
                    <Image
                      src={item.imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    {previewNews === index && (
                      <motion.div
                        className="absolute inset-0 bg-[#C40180]/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Editor Panel - RIGHT (2/6 width) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Noticias</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addNewNews}
                className="px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium"
                style={{ backgroundColor: moduleInfo.color, color: 'white' }}
              >
                <PlusCircle size={14} />
                <span>Agregar</span>
              </motion.button>
            </div>

            {/* News Items List */}
            <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {newsItems.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No hay noticias. Haz clic en "Agregar" para crear la primera.
                </div>
              ) : (
                newsItems.map((news, index) => (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                    {/* News Header */}
                    <div
                      className={`flex justify-between items-center p-3 cursor-pointer ${
                        expandedPanel === news.id ? 'bg-gray-50' : 'bg-white'
                      } hover:bg-gray-50 transition-colors duration-200`}
                      onClick={() => setExpandedPanel(expandedPanel === news.id ? null : news.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative h-10 w-16 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={news.imageUrl}
                            alt={news.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                            {news.title || "Sin título"}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {news.date} | {news.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span 
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ 
                            backgroundColor: previewNews === index ? `${moduleInfo.color}20` : 'rgb(243 244 246)',
                            color: previewNews === index ? moduleInfo.color : 'rgb(75 85 99)'
                          }}
                        >
                          #{index + 1}
                        </span>
                        {expandedPanel === news.id ? (
                          <ChevronUp size={18} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-500" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedPanel === news.id && (
                      <div className="p-3 border-t border-gray-200 bg-white">
                        <div className="grid grid-cols-1 gap-3">
                          {/* Imagen */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Imagen
                            </label>
                            <div className="relative h-36 bg-gray-100 rounded overflow-hidden">
                              <Image
                                src={news.imageUrl}
                                alt={news.title}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                              <button
                                onClick={() => handleImageChange(news.id)}
                                className="absolute bottom-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full text-gray-700 transition-colors"
                              >
                                <ImageIcon size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Fecha y Hora */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Fecha
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Calendar size={14} className="text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  value={news.date}
                                  onChange={(e) => updateNews(news.id, 'date', e.target.value)}
                                  placeholder="DD/MM/AAAA"
                                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:border-gray-300"
                                  style={{ 
                                    "--tw-ring-color": moduleInfo.color,
                                    borderColor: "var(--tw-ring-color)" 
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Hora
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Clock size={14} className="text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  value={news.time}
                                  onChange={(e) => updateNews(news.id, 'time', e.target.value)}
                                  placeholder="HH:MMam/pm"
                                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:border-gray-300"
                                  style={{ 
                                    "--tw-ring-color": moduleInfo.color,
                                    borderColor: "var(--tw-ring-color)" 
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Título */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Título
                            </label>
                            <input
                              type="text"
                              value={news.title}
                              onChange={(e) => updateNews(news.id, 'title', e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:border-gray-300"
                              style={{ 
                                "--tw-ring-color": moduleInfo.color,
                                borderColor: "var(--tw-ring-color)" 
                              }}
                            />
                          </div>
                          
                          {/* Descripción */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Descripción
                            </label>
                            <textarea
                              value={news.description}
                              onChange={(e) => updateNews(news.id, 'description', e.target.value)}
                              rows={3}
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
                                onClick={() => moveNews(news.id, 'up')}
                                disabled={index === 0}
                                className={`p-1 rounded ${index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`}
                                title="Mover arriba"
                              >
                                <ArrowUp size={16} />
                              </button>
                              <button
                                onClick={() => moveNews(news.id, 'down')}
                                disabled={index === newsItems.length - 1}
                                className={`p-1 rounded ${index === newsItems.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`}
                                title="Mover abajo"
                              >
                                <ArrowDown size={16} />
                              </button>
                            </div>
                            <button
                              onClick={() => deleteNews(news.id)}
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
