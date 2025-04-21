"use client"
import React, { useState, useEffect } from "react"
import {
  Clock,
  Award,
  BookOpen,
  Users,
  GlobeIcon,
  MedalIcon,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react"
import { LineaTSection } from "../../../Models/PaginaWeb/SobreCOV/LineaTHist"
import { ReflexionSection } from "../../../Models/PaginaWeb/SobreCOV/ReflexionSection"

// Iconos disponibles para seleccionar
const availableIcons = {
  Clock: Clock,
  Award: Award,
  BookOpen: BookOpen,
  Users: Users,
  GlobeIcon: GlobeIcon,
  MedalIcon: MedalIcon,
}

// Array de combinaciones de gradientes
const gradientCombinations = [
  "from-blue-500 to-cyan-400",
  "from-purple-600 to-indigo-500",
  "from-green-500 to-emerald-400",
  "from-pink-500 to-rose-400",
  "from-orange-500 to-yellow-400",
  "from-indigo-500 to-blue-400",
  "from-teal-500 to-green-400",
  "from-amber-500 to-orange-400",
  "from-violet-500 to-purple-400",
  "from-fuchsia-500 to-pink-400",
  "from-emerald-500 to-teal-400",
  "from-sky-500 to-blue-400",
  "from-lime-500 to-green-400",
  "from-rose-500 to-red-400",
]

export default function HistoriaDashboard({ moduleInfo }) {
  // Estado para la línea de tiempo
  const [timelineItems, setTimelineItems] = useState([])
  // Estado para las reflexiones
  const [reflectionItems, setReflectionItems] = useState([])
  // Estado para el título y subtítulo de la sección de reflexiones
  const [reflectionSection, setReflectionSection] = useState({
    title: "",
    subtitle: "",
    finalQuote: "",
    finalQuoteAuthor: "",
  })
  // Estado para controlar qué elemento está expandido
  const [expandedItem, setExpandedItem] = useState(null)
  const [expandedReflection, setExpandedReflection] = useState(null)
  // Estado para mostrar mensaje de guardado
  const [saveMessage, setSaveMessage] = useState("")

  // Cargar datos iniciales
  useEffect(() => {
    // Convertir los datos de la línea de tiempo a un formato editable
    const formattedTimeline = LineaTSection.map((item, index) => ({
      id: index,
      date: item.date,
      title: item.title,
      icon: Object.keys(availableIcons).find((key) => availableIcons[key] === item.icon),
      color: item.color,
      description: item.description,
      fullDescription: item.fullDescription.props.children,
    }))

    setTimelineItems(formattedTimeline)

    // Cargar datos de reflexiones
    if (ReflexionSection && ReflexionSection.length > 0) {
      // Extraer la cita final y su autor
      const finalQuoteElement = ReflexionSection[0].content.props.children[1].props.children[0]
      const finalQuoteAuthorElement = ReflexionSection[0].content.props.children[1].props.children[1]
      
      let finalQuote = ""
      let finalQuoteAuthor = ""
      
      if (finalQuoteElement && finalQuoteElement.props && finalQuoteElement.props.children) {
        finalQuote = finalQuoteElement.props.children
      }
      
      if (finalQuoteAuthorElement && finalQuoteAuthorElement.props && finalQuoteAuthorElement.props.children) {
        finalQuoteAuthor = finalQuoteAuthorElement.props.children
      }
      
      setReflectionSection({
        title: ReflexionSection[0].title,
        subtitle: ReflexionSection[0].subtitle,
        finalQuote: finalQuote,
        finalQuoteAuthor: finalQuoteAuthor,
      })

      // Extraer las reflexiones del contenido
      const reflections = []
      if (
        ReflexionSection[0].content.props.children[0] &&
        Array.isArray(ReflexionSection[0].content.props.children[0])
      ) {
        ReflexionSection[0].content.props.children[0].forEach((item, index) => {
          if (item && item.text && item.text.props && item.text.props.children) {
            reflections.push({
              id: index,
              title: item.title || "",
              text: item.text.props.children || "",
            })
          }
        })
      }

      setReflectionItems(reflections)
    }
  }, [])

  // Manejar cambios en los elementos de la línea de tiempo
  const handleTimelineChange = (id, field, value) => {
    setTimelineItems(timelineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  // Manejar cambios en las reflexiones
  const handleReflectionChange = (id, field, value) => {
    setReflectionItems(reflectionItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  // Añadir nuevo elemento a la línea de tiempo
  const addTimelineItem = () => {
    const newId = timelineItems.length > 0 ? Math.max(...timelineItems.map((item) => item.id)) + 1 : 0
    setTimelineItems([
      ...timelineItems,
      {
        id: newId,
        date: "Nueva fecha",
        title: "Nuevo título",
        icon: "Clock",
        color: gradientCombinations[newId % gradientCombinations.length],
        description: "Nueva descripción",
        fullDescription: "Descripción completa",
      },
    ])
    setExpandedItem(newId)
  }

  // Añadir nueva reflexión
  const addReflectionItem = () => {
    const newId = reflectionItems.length > 0 ? Math.max(...reflectionItems.map((item) => item.id)) + 1 : 0
    setReflectionItems([
      ...reflectionItems,
      {
        id: newId,
        title: "Nueva reflexión",
        text: "Texto de la reflexión",
      },
    ])
    setExpandedReflection(newId)
  }

  // Eliminar elemento de la línea de tiempo
  const removeTimelineItem = (id) => {
    setTimelineItems(timelineItems.filter((item) => item.id !== id))
    if (expandedItem === id) setExpandedItem(null)
  }

  // Eliminar reflexión
  const removeReflectionItem = (id) => {
    setReflectionItems(reflectionItems.filter((item) => item.id !== id))
    if (expandedReflection === id) setExpandedReflection(null)
  }

  // Mover elemento hacia arriba en la línea de tiempo
  const moveTimelineItemUp = (id) => {
    const index = timelineItems.findIndex((item) => item.id === id)
    if (index > 0) {
      const newItems = [...timelineItems]
      ;[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
      setTimelineItems(newItems)
    }
  }

  // Mover elemento hacia abajo en la línea de tiempo
  const moveTimelineItemDown = (id) => {
    const index = timelineItems.findIndex((item) => item.id === id)
    if (index < timelineItems.length - 1) {
      const newItems = [...timelineItems]
      ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
      setTimelineItems(newItems)
    }
  }

  // Mover reflexión hacia arriba
  const moveReflectionItemUp = (id) => {
    const index = reflectionItems.findIndex((item) => item.id === id)
    if (index > 0) {
      const newItems = [...reflectionItems]
      ;[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
      setReflectionItems(newItems)
    }
  }

  // Mover reflexión hacia abajo
  const moveReflectionItemDown = (id) => {
    const index = reflectionItems.findIndex((item) => item.id === id)
    if (index < reflectionItems.length - 1) {
      const newItems = [...reflectionItems]
      ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
      setReflectionItems(newItems)
    }
  }

  // Guardar cambios
  const saveChanges = () => {
    // Preparar los datos para guardar
    const formattedTimelineData = timelineItems.map((item) => ({
      date: item.date,
      title: item.title,
      icon: availableIcons[item.icon],
      color: item.color,
      description: item.description,
      fullDescription: {
        type: "p",
        props: {
          children: item.fullDescription,
        },
      },
    }))
    
    const formattedReflectionData = {
      title: reflectionSection.title,
      subtitle: reflectionSection.subtitle,
      content: {
        type: "div",
        props: {
          className: "space-y-4",
          children: [
            reflectionItems.map((item) => ({
              title: item.title,
              text: {
                type: "p",
                props: {
                  children: item.text,
                },
              },
            })),
            {
              type: "div",
              props: {
                className: "mt-6 border-t border-gray-300 pt-4",
                children: [
                  {
                    type: "blockquote",
                    props: {
                      className: "italic text-gray-700 text-sm pl-4 border-l-2 border-[#C40180]",
                      children: reflectionSection.finalQuote,
                    },
                  },
                  {
                    type: "p",
                    props: {
                      className: "text-right text-xs text-gray-500 mt-2",
                      children: reflectionSection.finalQuoteAuthor,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    }
    
    // Aquí implementarías la lógica para guardar los cambios en tu backend
    console.log("Línea de tiempo actualizada:", formattedTimelineData)
    console.log("Reflexiones actualizadas:", formattedReflectionData)
    
    // Mostrar mensaje de éxito
    setSaveMessage("Cambios guardados exitosamente")
    setTimeout(() => {
      setSaveMessage("")
    }, 3000)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4" style={{ color: moduleInfo.color }}>
          {moduleInfo.title}
        </h2>
        <p className="text-gray-600 mb-6">
          Aquí se edita la sección de Historia de la página web
        </p>
      </div>
      
      {saveMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {saveMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sección de Línea de Tiempo */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Línea de Tiempo</h3>
            <button
              onClick={addTimelineItem}
              className="flex items-center gap-1 text-white px-3 py-1 rounded-md text-sm transition-colors"
              style={{ backgroundColor: moduleInfo.color }}
            >
              <Plus size={16} />
              Añadir Evento
            </button>
          </div>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {timelineItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white`}
                    >
                      {React.createElement(availableIcons[item.icon], { size: 14 })}
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        moveTimelineItemUp(item.id)
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        moveTimelineItemDown(item.id)
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeTimelineItem(item.id)
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {expandedItem === item.id && (
                  <div className="p-4 border-t border-gray-200 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                      <input
                        type="text"
                        value={item.date}
                        onChange={(e) => handleTimelineChange(item.id, "date", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleTimelineChange(item.id, "title", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Corta</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleTimelineChange(item.id, "description", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Completa</label>
                      <textarea
                        value={item.fullDescription}
                        onChange={(e) => handleTimelineChange(item.id, "fullDescription", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Icono</label>
                        <select
                          value={item.icon}
                          onChange={(e) => handleTimelineChange(item.id, "icon", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          {Object.keys(availableIcons).map((iconName) => (
                            <option key={iconName} value={iconName}>
                              {iconName}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <select
                          value={item.color}
                          onChange={(e) => handleTimelineChange(item.id, "color", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          {gradientCombinations.map((gradient, index) => (
                            <option key={index} value={gradient}>
                              Gradiente {index + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vista previa</label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                        <div
                          className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white`}
                        >
                          {React.createElement(availableIcons[item.icon], { size: 16 })}
                        </div>
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-gray-600">{item.date}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Sección de Reflexiones */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Sección de Reflexiones</h3>
            <button
              onClick={addReflectionItem}
              className="flex items-center gap-1 text-white px-3 py-1 rounded-md text-sm transition-colors"
              style={{ backgroundColor: moduleInfo.color }}
            >
              <Plus size={16} />
              Añadir Reflexión
            </button>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Sección</label>
              <input
                type="text"
                value={reflectionSection.title}
                onChange={(e) => setReflectionSection({ ...reflectionSection, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
              <input
                type="text"
                value={reflectionSection.subtitle}
                onChange={(e) => setReflectionSection({ ...reflectionSection, subtitle: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {reflectionItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedReflection(expandedReflection === item.id ? null : item.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C40180] to-[#590248] flex items-center justify-center text-white">
                      <span className="text-xs font-bold">{item.id + 1}</span>
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        moveReflectionItemUp(item.id)
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        moveReflectionItemDown(item.id)
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeReflectionItem(item.id)
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {expandedReflection === item.id && (
                  <div className="p-4 border-t border-gray-200 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleReflectionChange(item.id, "title", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                      <textarea
                        value={item.text}
                        onChange={(e) => handleReflectionChange(item.id, "text", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md min-h-[150px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cita Final</label>
              <textarea
                value={reflectionSection.finalQuote}
                onChange={(e) => setReflectionSection({ ...reflectionSection, finalQuote: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
                placeholder="Ingrese la cita final que aparecerá al final de la sección de reflexiones"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Autor de la Cita</label>
              <input
                type="text"
                value={reflectionSection.finalQuoteAuthor}
                onChange={(e) => setReflectionSection({ ...reflectionSection, finalQuoteAuthor: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: — Discurso pronunciado con motivo del XXV Aniversario del C.O.V."
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          onClick={saveChanges}
          className="flex items-center gap-2 text-white px-6 py-3 rounded-md shadow-md transition-colors"
          style={{ backgroundColor: moduleInfo.color }}
        >
          <Save size={20} />
          Guardar Cambios
        </button>
      </div>
    </div>
  )
}
