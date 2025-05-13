"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, ChevronDown, ChevronUp, ChevronRight, Star, MoveUp, MoveDown } from "lucide-react"
import Image from "next/image"

// Importamos los datos iniciales de noticias
import initialNewsItems from "@/app/Models/PanelControl/PaginaWeb/Inicio/NoticiasData"

export default function NoticiasDashboard({ moduleInfo }) {
  // Convertir todos los elementos al formato unificado
  const normalizeNewsItems = (items) => {
    return items.map((item) => ({
      id: item.id,
      title: item.title || item.titulo || "Sin título",
      description: item.description || "Sin descripción",
      imageUrl: item.imageUrl || item.imagen_portada_url || "/assets/noticias/placeholder.png",
      date: item.date || "01/01/2024",
      time: item.time || "12:00pm",
      destacado: item.destacado || false,
    }))
  }

  const [newsItems, setNewsItems] = useState(() => normalizeNewsItems(initialNewsItems))
  const [expandedPanel, setExpandedPanel] = useState(null)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [featuredItems, setFeaturedItems] = useState(() => {
    // Inicializar con los items que ya están destacados
    return newsItems.filter((item) => item.destacado).map((item) => item.id)
  })

  // Filtrar noticias destacadas para la vista previa
  const featuredNews = newsItems.filter((item) => featuredItems.includes(item.id))

  // Función para mover noticias arriba o abajo
  const moveNews = (id, direction) => {
    const index = newsItems.findIndex((news) => news.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === newsItems.length - 1)) {
      return
    }

    const newNewsItems = [...newsItems]
    const newIndex = direction === "up" ? index - 1 : index + 1
    ;[newNewsItems[index], newNewsItems[newIndex]] = [newNewsItems[newIndex], newNewsItems[index]]

    setNewsItems(newNewsItems)
  }

  // Función para mover a una posición específica
  const moveToPosition = (id, position) => {
    if (position < 0 || position >= newsItems.length) return

    const currentIndex = newsItems.findIndex((news) => news.id === id)
    if (currentIndex === position) return

    const newNewsItems = [...newsItems]
    const itemToMove = newNewsItems.splice(currentIndex, 1)[0]
    newNewsItems.splice(position, 0, itemToMove)

    setNewsItems(newNewsItems)
  }

  // Función para marcar/desmarcar como destacado
  const toggleFeatured = (id) => {
    if (featuredItems.includes(id)) {
      // Si ya está destacado, lo quitamos
      setFeaturedItems(featuredItems.filter((itemId) => itemId !== id))
    } else {
      // Si no está destacado y no hemos llegado al límite, lo agregamos
      if (featuredItems.length < 5) {
        setFeaturedItems([...featuredItems, id])
      } else {
        alert("Solo puedes tener un máximo de 5 noticias destacadas.")
      }
    }
  }

  // Actualizar previewIndex cuando cambian las noticias destacadas
  useEffect(() => {
    if (featuredNews.length > 0 && previewIndex >= featuredNews.length) {
      setPreviewIndex(featuredNews.length - 1)
    }
  }, [featuredItems, featuredNews.length, previewIndex])

  // Guardar cambios (simulado)
  const saveChanges = () => {
    // Aquí se implementaría la lógica para guardar los cambios en el backend
    const updatedNewsItems = newsItems.map((item) => ({
      ...item,
      destacado: featuredItems.includes(item.id),
    }))

    console.log("Noticias actualizadas:", updatedNewsItems)
    alert("Cambios guardados correctamente")
  }

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
          Administra el orden y las noticias destacadas que aparecerán en la página web
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
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Vista Previa de Noticias Destacadas</h3>
              <div className="text-sm text-gray-500">
                {featuredNews.length > 0
                  ? `${previewIndex + 1} / ${featuredNews.length}`
                  : "No hay noticias destacadas"}
              </div>
            </div>

            <div className="relative">
              {/* Visual Preview */}
              <AnimatePresence mode="wait">
                {featuredNews.length > 0 ? (
                  <motion.div
                    key={previewIndex}
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
                            src={featuredNews[previewIndex]?.imageUrl || "/assets/noticias/placeholder.png"}
                            alt={featuredNews[previewIndex]?.title || "Sin título"}
                            fill
                            style={{ objectFit: "cover", opacity: 0.9 }}
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
                              {featuredNews[previewIndex]?.date || "DD/MM/YYYY"}
                            </span>
                          </div>
                          <span className="text-gray-400">|</span>
                          <div className="flex items-center text-[#C40180]">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="font-medium text-gray-800">
                              {featuredNews[previewIndex]?.time || "HH:MMam"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                            {featuredNews[previewIndex]?.title || "Sin título"}
                          </h3>
                          <p className="text-gray-600 text-sm md:text-base mb-6">
                            {featuredNews[previewIndex]?.description || "Sin descripción"}
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
                ) : (
                  <div className="flex items-center justify-center h-64 md:h-96 bg-gray-50 text-gray-500">
                    <div className="text-center p-6">
                      <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No hay noticias destacadas</p>
                      <p className="text-sm mt-2">Marca hasta 5 noticias como destacadas para verlas aquí</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>

              {/* Navigation Dots */}
              {featuredNews.length > 0 && (
                <div className="absolute bottom-3 right-3 flex space-x-1">
                  {featuredNews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setPreviewIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        previewIndex === index ? "bg-white w-4" : "bg-white/30 w-2"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Preview Navigation */}
            {featuredNews.length > 0 && (
              <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                <button
                  onClick={() => setPreviewIndex((prev) => (prev === 0 ? featuredNews.length - 1 : prev - 1))}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setPreviewIndex((prev) => (prev === featuredNews.length - 1 ? 0 : prev + 1))}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Thumbnails Preview */}
            {featuredNews.length > 0 && (
              <div className="flex justify-center p-3 gap-2 overflow-x-auto border-t border-gray-200">
                {featuredNews.map((item, index) => (
                  <motion.div
                    key={index}
                    className={`relative cursor-pointer rounded-md overflow-hidden ${previewIndex === index ? "ring-2 ring-[#C40180]" : "opacity-70"}`}
                    onClick={() => setPreviewIndex(index)}
                    whileHover={{ scale: 1.05, opacity: 1 }}
                  >
                    <div className="w-20 h-12 relative">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      {previewIndex === index && (
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
            )}
          </div>
        </motion.div>

        {/* News Management Panel - RIGHT (2/6 width) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Noticias</h3>
              <div className="text-sm text-gray-500">
                <span className="font-medium">{featuredItems.length}</span>/5 destacadas
              </div>
            </div>

            {/* News Items List */}
            <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {newsItems.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">No hay noticias disponibles.</div>
              ) : (
                newsItems.map((news, index) => (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`border rounded-lg overflow-hidden ${
                      featuredItems.includes(news.id) ? "border-[#C40180] bg-[#C40180]/5" : "border-gray-200"
                    }`}
                  >
                    {/* News Header */}
                    <div
                      className={`flex justify-between items-center p-3 cursor-pointer ${
                        expandedPanel === news.id ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-50 transition-colors duration-200 ${
                        featuredItems.includes(news.id) ? "bg-[#C40180]/5" : ""
                      }`}
                      onClick={() => setExpandedPanel(expandedPanel === news.id ? null : news.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative h-10 w-16 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={news.imageUrl || "/placeholder.svg"}
                            alt={news.title}
                            fill
                            style={{ objectFit: "cover" }}
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
                            backgroundColor: featuredItems.includes(news.id)
                              ? `${moduleInfo.color}20`
                              : "rgb(243 244 246)",
                            color: featuredItems.includes(news.id) ? moduleInfo.color : "rgb(75 85 99)",
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
                          {/* Imagen y Detalles */}
                          <div className="flex gap-3">
                            <div className="relative h-24 w-36 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={news.imageUrl || "/placeholder.svg"}
                                alt={news.title}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm mb-1">{news.title}</h4>
                              <p className="text-xs text-gray-500 mb-2 line-clamp-2">{news.description}</p>
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span className="mr-2">{news.date}</span>
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{news.time}</span>
                              </div>
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                            {/* Mover a posición */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Mover a posición</label>
                              <div className="flex gap-1">
                                {[0, 1, 2].map((pos) => (
                                  <button
                                    key={pos}
                                    onClick={() => moveToPosition(news.id, pos)}
                                    className={`p-1.5 rounded text-xs font-medium ${
                                      index === pos
                                        ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                    disabled={index === pos}
                                  >
                                    {pos + 1}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Destacar */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Destacar</label>
                              <button
                                onClick={() => toggleFeatured(news.id)}
                                className={`p-1.5 rounded text-xs font-medium w-full flex items-center justify-center gap-1 ${
                                  featuredItems.includes(news.id)
                                    ? "bg-[#C40180] text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                <Star size={14} className={featuredItems.includes(news.id) ? "fill-white" : ""} />
                                {featuredItems.includes(news.id) ? "Destacada" : "Destacar"}
                              </button>
                            </div>
                          </div>

                          {/* Mover arriba/abajo */}
                          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                            <div className="flex gap-1">
                              <button
                                onClick={() => moveNews(news.id, "up")}
                                disabled={index === 0}
                                className={`p-1.5 rounded flex items-center gap-1 text-xs ${
                                  index === 0
                                    ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                                    : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                                }`}
                                title="Mover arriba"
                              >
                                <MoveUp size={14} />
                                <span>Subir</span>
                              </button>
                              <button
                                onClick={() => moveNews(news.id, "down")}
                                disabled={index === newsItems.length - 1}
                                className={`p-1.5 rounded flex items-center gap-1 text-xs ${
                                  index === newsItems.length - 1
                                    ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                                    : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                                }`}
                                title="Mover abajo"
                              >
                                <MoveDown size={14} />
                                <span>Bajar</span>
                              </button>
                            </div>
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
            <span>Guardar Cambios</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
