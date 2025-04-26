"use client"

import { useState, useEffect } from "react"
import { 
  X, 
  AlertCircle, 
  FileText, 
  Upload, 
  CreditCard,
  Search,
  Check,
  User,
  FileCheck,
  ShoppingCart,
  Tag,
  Trash2
} from "lucide-react"

// Definición de tipos de solicitud y sus costos
const TIPOS_SOLICITUD = {
  Carnet: { 
    id: "carnet",
    nombre: "Carnet", 
    costo: 75.00, 
    codigo: "CARNET",
    descripcion: "Solicitud de carnet de identificación profesional",
    documentosRequeridos: ["Foto tipo carnet", "Comprobante de pago"]
  },
  Especializacion: { 
    id: "especializacion",
    nombre: "Especialización", 
    costo: 150.00, 
    codigo: "ESPEC",
    descripcion: "Registro de título de especialización odontológica",
    documentosRequeridos: ["Título de especialidad", "Copia de cédula", "Comprobante de pago"]
  },
  Solvencia: { 
    id: "solvencia",
    nombre: "Solvencia", 
    costo: 50.00, 
    codigo: "SOLV",
    descripcion: "Certificado de solvencia profesional",
    documentosRequeridos: ["Comprobante de pago"]
  },
  Constancia: { 
    id: "constancia",
    nombre: "Constancia", 
    costo: 0, // El costo dependerá del subtipo
    codigo: "CONST",
    descripcion: "Constancia profesional (requiere seleccionar tipo específico)",
    documentosRequeridos: ["Copia de cédula", "Comprobante de pago"],
    subtipos: [
      { nombre: "Inscripción del COV", costo: 60.00, codigo: "CONST-INSC" },
      { nombre: "Solvencia", costo: 45.00, codigo: "CONST-SOLV" },
      { nombre: "Libre ejercicio", costo: 55.00, codigo: "CONST-LIBRE" },
      { nombre: "Declaración de habilitación", costo: 70.00, codigo: "CONST-HAB" },
      { nombre: "Continuidad laboral", costo: 65.00, codigo: "CONST-CONT" },
      { nombre: "Deontología odontológica", costo: 80.00, codigo: "CONST-DEONT" }
    ]
  }
}

export default function CrearSolicitudModal({ 
  onClose, 
  onSolicitudCreada, 
  colegiados, 
  colegiadoPreseleccionado = null 
}) {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    colegiadoId: colegiadoPreseleccionado ? colegiadoPreseleccionado.id : "",
    urgente: false,
    descripcion: "",
  })
  
  const [documentosAdjuntos, setDocumentosAdjuntos] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showColegiadosList, setShowColegiadosList] = useState(false)
  
  // Estados para gestionar las nuevas funcionalidades
  const [tiposSeleccionados, setTiposSeleccionados] = useState([])
  const [subtipoConstancia, setSubtipoConstancia] = useState(null)
  const [itemsCarrito, setItemsCarrito] = useState([])
  const [totalCarrito, setTotalCarrito] = useState(0)

  // Si hay un colegiado preseleccionado, establecer el ID en el formulario
  useEffect(() => {
    if (colegiadoPreseleccionado) {
      setFormData(prev => ({
        ...prev,
        colegiadoId: colegiadoPreseleccionado.id
      }))
    }
  }, [colegiadoPreseleccionado])

  // Función para agregar un item al carrito
  const agregarAlCarrito = (tipo) => {
    if (tipo === "Constancia" && !subtipoConstancia) {
      alert("Debe seleccionar un tipo específico de constancia")
      return
    }

    let nuevoItem;
    
    if (tipo === "Constancia") {
      // Buscar el subtipo de constancia seleccionado
      const subtipo = TIPOS_SOLICITUD.Constancia.subtipos.find(
        st => st.nombre === subtipoConstancia
      )
      
      nuevoItem = {
        id: `${subtipo.codigo}-${Date.now()}`,
        tipo: "Constancia",
        subtipo: subtipoConstancia,
        nombre: `Constancia: ${subtipoConstancia}`,
        costo: subtipo.costo,
        exonerado: false,
        codigo: subtipo.codigo,
        documentosRequeridos: [...TIPOS_SOLICITUD.Constancia.documentosRequeridos]
      }
    } else {
      // Para otros tipos de solicitud
      const tipoInfo = TIPOS_SOLICITUD[tipo]
      
      nuevoItem = {
        id: `${tipoInfo.codigo}-${Date.now()}`,
        tipo: tipo,
        subtipo: null,
        nombre: tipoInfo.nombre,
        costo: tipoInfo.costo,
        exonerado: false,
        codigo: tipoInfo.codigo,
        documentosRequeridos: [...tipoInfo.documentosRequeridos]
      }
    }
    
    setItemsCarrito([...itemsCarrito, nuevoItem])
    actualizarTotal([...itemsCarrito, nuevoItem])
    
    // Si es constancia, desmarcar después de agregar
    if (tipo === "Constancia") {
      const nuevosTiposSeleccionados = tiposSeleccionados.filter(t => t !== "Constancia")
      setTiposSeleccionados(nuevosTiposSeleccionados)
      setSubtipoConstancia(null)
    }
  }

  // Función para actualizar el total del carrito
  const actualizarTotal = (items) => {
    const nuevoTotal = items.reduce((sum, item) => {
      return sum + (item.exonerado ? 0 : item.costo)
    }, 0)
    
    setTotalCarrito(nuevoTotal)
  }

  // Función para eliminar un item del carrito
  const eliminarDelCarrito = (itemId) => {
    // Encontrar el item a eliminar para obtener su tipo
    const itemAEliminar = itemsCarrito.find(item => item.id === itemId);
    
    if (itemAEliminar) {
      // Eliminar del carrito
      const nuevosItems = itemsCarrito.filter(item => item.id !== itemId);
      setItemsCarrito(nuevosItems);
      actualizarTotal(nuevosItems);
      
      // Actualizar la selección en la lista de tipos
      if (itemAEliminar.tipo === "Constancia") {
        // Si era una constancia, quitar la selección del subtipo
        setSubtipoConstancia(null);
        
        // Verificar si aún hay otras constancias
        const sigueHabiendoConstancias = nuevosItems.some(item => item.tipo === "Constancia");
        
        // Si no hay más constancias, quitar también del tipo principal
        if (!sigueHabiendoConstancias) {
          setTiposSeleccionados(prev => prev.filter(tipo => tipo !== "Constancia"));
        }
      } else {
        // Para otros tipos, verificar si aún hay otros items del mismo tipo
        const sigueHabiendoDelMismoTipo = nuevosItems.some(item => item.tipo === itemAEliminar.tipo);
        
        // Si no hay más items del mismo tipo, quitar de la selección
        if (!sigueHabiendoDelMismoTipo) {
          setTiposSeleccionados(prev => prev.filter(tipo => tipo !== itemAEliminar.tipo));
        }
      }
    }
  }

  // Función para toggle de exoneración de pago
  const toggleExoneracion = (itemId) => {
    const nuevosItems = itemsCarrito.map(item => {
      if (item.id === itemId) {
        return {...item, exonerado: !item.exonerado}
      }
      return item
    })
    
    setItemsCarrito(nuevosItems)
    actualizarTotal(nuevosItems)
  }

  // Función para exonerar todos los pagos
  const exonerarTodos = () => {
    const nuevosItems = itemsCarrito.map(item => ({
      ...item,
      exonerado: true
    }))
    
    setItemsCarrito(nuevosItems)
    setTotalCarrito(0)
  }

  // Manejar selección de tipos
  const handleSeleccionTipo = (tipo) => {
    // Para Constancia, solo puede haber una seleccionada
    if (tipo === "Constancia") {
      // Si ya está seleccionada, la quitamos
      if (tiposSeleccionados.includes(tipo)) {
        setTiposSeleccionados(tiposSeleccionados.filter(t => t !== tipo))
        setSubtipoConstancia(null)
      } else {
        // Si no está, la agregamos
        setTiposSeleccionados([...tiposSeleccionados, tipo])
      }
    } else {
      // Para otros tipos, toggle normal y agregar/quitar automáticamente del carrito
      if (tiposSeleccionados.includes(tipo)) {
        // Si está seleccionado, lo quitamos
        setTiposSeleccionados(tiposSeleccionados.filter(t => t !== tipo))
        
        // También eliminar del carrito
        const itemsParaEliminar = itemsCarrito.filter(item => item.tipo === tipo)
        if (itemsParaEliminar.length > 0) {
          const nuevosItems = itemsCarrito.filter(item => item.tipo !== tipo)
          setItemsCarrito(nuevosItems)
          actualizarTotal(nuevosItems)
        }
      } else {
        // Si no está seleccionado, lo agregamos
        setTiposSeleccionados([...tiposSeleccionados, tipo])
        
        // Y agregamos automáticamente al carrito
        const tipoInfo = TIPOS_SOLICITUD[tipo]
        
        const nuevoItem = {
          id: `${tipoInfo.codigo}-${Date.now()}`,
          tipo: tipo,
          subtipo: null,
          nombre: tipoInfo.nombre,
          costo: tipoInfo.costo,
          exonerado: false,
          codigo: tipoInfo.codigo,
          documentosRequeridos: [...tipoInfo.documentosRequeridos]
        }
        
        // Actualizar carrito
        const nuevosItems = [...itemsCarrito, nuevoItem]
        setItemsCarrito(nuevosItems)
        actualizarTotal(nuevosItems)
      }
    }
  }

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
    
    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  // Manejar subida de archivos
  const handleFileChange = (e, documentoId, itemId) => {
    const file = e.target.files[0]
    if (file) {
      setDocumentosAdjuntos(prev => ({
        ...prev,
        [`${itemId}-${documentoId}`]: file
      }))
    }
  }

  // Seleccionar un colegiado de la lista
  const selectColegiado = (colegiado) => {
    setFormData(prev => ({
      ...prev,
      colegiadoId: colegiado.id
    }))
    setShowColegiadosList(false)
    setSearchTerm("")
    
    // Limpiar error si existe
    if (errors.colegiadoId) {
      setErrors(prev => ({
        ...prev,
        colegiadoId: null
      }))
    }
  }

  // Filtrar colegiados por término de búsqueda
  const colegiadosFiltrados = colegiados.filter(colegiado => 
    colegiado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colegiado.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colegiado.numeroRegistro.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Obtener el colegiado seleccionado
  const colegiadoSeleccionado = colegiados.find(c => c.id === formData.colegiadoId)
  
  // Validar el formulario antes de enviar
  const validarFormulario = () => {
    const nuevosErrores = {}
    
    if (!formData.colegiadoId) nuevosErrores.colegiadoId = "Debe seleccionar un colegiado"
    if (itemsCarrito.length === 0) nuevosErrores.items = "Debe agregar al menos un tipo de solicitud"
    
    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validarFormulario()) return
    
    setIsSubmitting(true)
    
    try {
      // Simular envío a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Crear lista de documentos requeridos única (sin duplicados)
      const todosDocumentosRequeridos = []
      itemsCarrito.forEach(item => {
        item.documentosRequeridos.forEach(doc => {
          if (!todosDocumentosRequeridos.includes(doc)) {
            todosDocumentosRequeridos.push(doc)
          }
        })
      })
      
      // Crear objeto de nueva solicitud
      const nuevaSolicitud = {
        id: `sol-${Date.now()}`,
        tipo: itemsCarrito.length === 1 
          ? itemsCarrito[0].nombre 
          : `Solicitud múltiple (${itemsCarrito.length} ítems)`,
        colegiadoId: formData.colegiadoId,
        colegiadoNombre: colegiadoSeleccionado?.nombre || "Colegiado",
        fecha: new Date().toLocaleDateString(),
        estado: "Pendiente",
        urgente: formData.urgente,
        descripcion: formData.descripcion || "Solicitud de servicios al Colegio",
        referencia: `REF-${Date.now().toString().slice(-6)}`,
        costo: totalCarrito,
        documentosRequeridos: todosDocumentosRequeridos,
        documentosAdjuntos: Object.keys(documentosAdjuntos).map(key => documentosAdjuntos[key].name || "documento.pdf"),
        itemsSolicitud: itemsCarrito
      }
      
      onSolicitudCreada(nuevaSolicitud)
    } catch (error) {
      console.error("Error al crear solicitud:", error)
      setErrors({
        general: "Ocurrió un error al procesar la solicitud. Inténtelo nuevamente."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Nueva solicitud</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Selección de colegiado */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colegiado <span className="text-red-500">*</span>
              </label>
              
              {errors.colegiadoId && (
                <div className="text-red-500 text-xs mb-2">
                  {errors.colegiadoId}
                </div>
              )}
              
              <div className="relative">
                {colegiadoSeleccionado ? (
                  <div className="flex items-center justify-between border rounded-lg p-3 mb-2">
                    <div className="flex items-center">
                      <User size={20} className="text-gray-400 mr-2" />
                      <div>
                        <p className="font-medium">{colegiadoSeleccionado.nombre}</p>
                        <p className="text-xs text-gray-500">
                          {colegiadoSeleccionado.cedula} · {colegiadoSeleccionado.numeroRegistro}
                        </p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, colegiadoId: "" }));
                        setShowColegiadosList(true);
                      }}
                      className="text-[#C40180] text-sm hover:underline"
                    >
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar colegiado por nombre, cédula o registro..."
                      className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowColegiadosList(true);
                      }}
                      onFocus={() => setShowColegiadosList(true)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                )}
                
                {showColegiadosList && !colegiadoSeleccionado && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {colegiadosFiltrados.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">No se encontraron colegiados</div>
                    ) : (
                      colegiadosFiltrados.map(colegiado => (
                        <div 
                          key={colegiado.id}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                          onClick={() => selectColegiado(colegiado)}
                        >
                          <p className="font-medium">{colegiado.nombre}</p>
                          <p className="text-xs text-gray-500">
                            {colegiado.cedula} · {colegiado.numeroRegistro}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Selección de tipos de solicitud */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipos de solicitud <span className="text-red-500">*</span>
              </label>
              
              {errors.items && (
                <div className="text-red-500 text-xs mb-2">
                  {errors.items}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {Object.keys(TIPOS_SOLICITUD).map((tipo) => (
                  <div 
                    key={tipo}
                    className={`
                      border rounded-md p-3 cursor-pointer transition-colors
                      ${tiposSeleccionados.includes(tipo) 
                        ? 'border-[#C40180] bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => handleSeleccionTipo(tipo)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{TIPOS_SOLICITUD[tipo].nombre}</p>
                        {tipo !== 'Constancia' ? (
                          <p className="text-xs text-gray-500">
                            Costo: ${TIPOS_SOLICITUD[tipo].costo.toFixed(2)}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">
                            Requiere selección de tipo específico
                          </p>
                        )}
                      </div>
                      {tiposSeleccionados.includes(tipo) && (
                        <div className="bg-[#C40180] text-white rounded-full p-1">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
                                {/* Subtipos de constancia si está seleccionada */}
              {tiposSeleccionados.includes('Constancia') && (
                <div className="border border-[#C40180] rounded-md p-4 mb-4 bg-purple-50">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Seleccione un tipo de constancia:</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TIPOS_SOLICITUD.Constancia.subtipos.map((subtipo) => (
                      <div 
                        key={subtipo.codigo}
                        className={`
                          border rounded p-2 cursor-pointer
                          ${subtipoConstancia === subtipo.nombre 
                            ? 'border-[#C40180] bg-white' 
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                        onClick={() => {
                          // Establecer el subtipo seleccionado
                          setSubtipoConstancia(subtipo.nombre);
                          
                          // Agregar automáticamente al carrito
                          // Primero eliminar cualquier constancia existente
                          const nuevosItemsSinConstancias = itemsCarrito.filter(item => item.tipo !== "Constancia");
                          
                          // Crear nuevo item de constancia
                          const nuevoItem = {
                            id: `${subtipo.codigo}-${Date.now()}`,
                            tipo: "Constancia",
                            subtipo: subtipo.nombre,
                            nombre: `Constancia: ${subtipo.nombre}`,
                            costo: subtipo.costo,
                            exonerado: false,
                            codigo: subtipo.codigo,
                            documentosRequeridos: [...TIPOS_SOLICITUD.Constancia.documentosRequeridos]
                          };
                          
                          // Actualizar carrito
                          const nuevosItems = [...nuevosItemsSinConstancias, nuevoItem];
                          setItemsCarrito(nuevosItems);
                          actualizarTotal(nuevosItems);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm">{subtipo.nombre}</p>
                            <p className="text-xs text-gray-500">
                              ${subtipo.costo.toFixed(2)}
                            </p>
                          </div>
                          {subtipoConstancia === subtipo.nombre && (
                            <Check size={16} className="text-[#C40180]" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Mensaje informativo */}
              {tiposSeleccionados.length > 0 && (
                <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                  <p className="flex items-center">
                    <ShoppingCart size={16} className="mr-1 text-[#C40180]" />
                    Los servicios seleccionados se agregan automáticamente al carrito
                  </p>
                </div>
              )}
            </div>
            
            {/* Carrito de compras */}
            <div className="mb-6 border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                <h3 className="font-medium text-gray-800 flex items-center">
                  <ShoppingCart size={18} className="mr-2 text-[#C40180]" /> 
                  Servicios seleccionados
                </h3>
                
                {itemsCarrito.length > 0 && (
                  <span className="text-sm text-gray-600">
                    Total: <strong className="text-[#C40180]">${totalCarrito.toFixed(2)}</strong>
                  </span>
                )}
              </div>
              
              {itemsCarrito.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Aún no ha agregado servicios a su solicitud
                </div>
              ) : (
                <div>
                  {/* Lista de items */}
                  <ul className="divide-y">
                    {itemsCarrito.map((item) => (
                      <li key={item.id} className="p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="font-medium">{item.nombre}</span>
                            <span className={`ml-3 ${item.exonerado ? 'line-through text-gray-400' : 'text-[#C40180]'}`}>
                              ${item.costo.toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <label className="inline-flex items-center cursor-pointer">
                              <span className="text-xs text-gray-600 mr-2">Exonerar</span>
                              <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={item.exonerado}
                                onChange={() => toggleExoneracion(item.id)}
                              />
                              <div className="relative w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                            
                            <button 
                              type="button"
                              onClick={() => eliminarDelCarrito(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        {/* Documentos requeridos para este item */}
                        {item.documentosRequeridos.length > 0 && (
                          <div className="pl-2 border-l-2 border-gray-200 mt-1">
                            <p className="text-xs text-gray-500 mb-1">Documentos requeridos:</p>
                            <ul className="space-y-2">
                              {item.documentosRequeridos.map((doc, index) => (
                                <li key={`${item.id}-${index}`} className="flex items-center">
                                  <FileText size={14} className="text-gray-400 mr-1" />
                                  <span className="text-xs">{doc}</span>
                                  
                                  <input
                                    type="file"
                                    id={`documento-${item.id}-${index}`}
                                    onChange={(e) => handleFileChange(e, index, item.id)}
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                  />
                                  <label
                                    htmlFor={`documento-${item.id}-${index}`}
                                    className="ml-2 text-xs text-blue-600 cursor-pointer hover:underline"
                                  >
                                    {documentosAdjuntos[`${item.id}-${index}`] 
                                      ? <span className="text-green-600 flex items-center">
                                          <FileCheck size={14} className="mr-1" />
                                          {documentosAdjuntos[`${item.id}-${index}`].name.length > 15 
                                            ? documentosAdjuntos[`${item.id}-${index}`].name.substring(0, 15) + '...' 
                                            : documentosAdjuntos[`${item.id}-${index}`].name}
                                        </span>
                                      : "Adjuntar"}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Acciones del carrito */}
                  <div className="bg-gray-50 p-3 border-t flex justify-between items-center">
                    <span className="text-sm font-bold">
                      Total a pagar: ${totalCarrito.toFixed(2)}
                    </span>
                    
                    <button
                      type="button"
                      onClick={exonerarTodos}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Exonerar todos
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Información adicional o notas */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Información adicional (opcional)
              </label>
              
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Agregue cualquier información relevante para esta solicitud..."
                rows="2"
              ></textarea>
            </div>
            
            {/* Opción de urgente (comentada pero no eliminada) */}
            {/* <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="urgente"
                  name="urgente"
                  checked={formData.urgente}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#C40180] border-gray-300 rounded focus:ring-[#C40180]"
                />
                <label htmlFor="urgente" className="ml-2 block text-sm text-gray-900">
                  Marcar como urgente
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Las solicitudes urgentes tienen prioridad de procesamiento
              </p>
            </div> */}
            
            {/* Mensaje de error general */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                {errors.general}
              </div>
            )}
          </div>
          
          <div className="flex justify-end p-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 mr-3"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-[#C40180] text-white rounded-md ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#590248]'
              }`}
            >
              {isSubmitting ? 'Procesando...' : 'Crear solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}