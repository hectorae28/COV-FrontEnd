"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  User, Phone, Mail, MapPin, Calendar, School, Award, FileText, 
  CreditCard, CheckCircle, AlertCircle, Book, MessageSquare, FileBox, 
  PlusCircle, BarChart3, ChevronLeft, X
} from "lucide-react"
import Link from "next/link"
import NuevaSolicitudModal from "./NuevaSolicitudModal"
import TablaInscripciones from "./TablaInscripciones"
import TablaPagos from "./TablaPagos"
import TablaSolicitudes from "./TablaSolicitudes"
import EstadisticasUsuario from "./EstadisticasUsuario"

export default function DetalleColegiado({ params }) {
  // Obtenemos el ID desde los parámetros de la URL
  const colegiadoId = params?.id || "1"
  
  const [colegiado, setColegiado] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tabActivo, setTabActivo] = useState("informacion") // informacion, pagos, inscripciones, solicitudes, carnet, archivos, chats
  const [mostrarModalSolicitud, setMostrarModalSolicitud] = useState(false)
  const [tituloEntregado, setTituloEntregado] = useState(false)
  const [confirmarTitulo, setConfirmarTitulo] = useState(false)

  // Simulación de obtención de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // En un caso real, aquí se haría la llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Datos de ejemplo
        setColegiado({
          id: colegiadoId,
          nombre: "María González",
          cedula: "V-12345678",
          numeroRegistro: "ODV-1234",
          email: "maria.gonzalez@mail.com",
          telefono: "+58 412-1234567",
          direccion: "Av. Libertador, Edificio Centro, Apto 5-B, Caracas",
          fechaNacimiento: "15/03/1985",
          fechaRegistro: "12/04/2023",
          universidad: "Universidad Central de Venezuela",
          anoGraduacion: "2010",
          especialidad: "Ortodoncia",
          estado: "Activo",
          solvente: true,
          tituloEntregado: false,
          saldo: 150.00,
          carnetVigente: true,
          carnetVencimiento: "12/04/2025",
          fotoPerfil: "/api/placeholder/200/200",
          estadisticas: {
            solicitudesMes: 2,
            inscripcionesMes: 1,
            asistenciaEventos: 5,
            pagosPendientes: 0,
            ultimoAcceso: "Hace 3 días"
          }
        })
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching colegiado data:", error)
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [colegiadoId])

  // Función para marcar que se entregó el título
  const handleConfirmarEntregaTitulo = async () => {
    try {
      // Aquí iría la llamada a la API para actualizar
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Actualizar el estado local
      setColegiado(prev => ({
        ...prev,
        tituloEntregado: true
      }))
      
      setTituloEntregado(true)
      setConfirmarTitulo(false)
    } catch (error) {
      console.error("Error al confirmar entrega del título:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
      </div>
    )
  }

  if (!colegiado) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          No se pudo encontrar la información del colegiado solicitado.
        </div>
        <Link 
          href="/colegiados" 
          className="mt-4 inline-flex items-center text-[#C40180] hover:underline"
        >
          <ChevronLeft size={16} className="mr-1" />
          Volver a la lista de colegiados
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full px-4 md:px-10 py-10 md:py-12">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Link 
          href="/colegiados" 
          className="text-sm text-gray-600 hover:text-[#C40180] flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" />
          Volver a la lista de colegiados
        </Link>
      </div>
      
      {/* Notificación de título entregado */}
      {tituloEntregado && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6 flex items-start justify-between">
          <div className="flex items-center">
            <CheckCircle size={20} className="mr-2 flex-shrink-0" />
            <span>Se ha registrado la entrega del título físico correctamente.</span>
          </div>
          <button 
            onClick={() => setTituloEntregado(false)}
            className="text-green-700"
          >
            <X size={18} />
          </button>
        </div>
      )}
      
      {/* Header con información básica */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img 
                src={colegiado.fotoPerfil} 
                alt={colegiado.nombre} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-3/4">
            <div className="flex flex-col md:flex-row md:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{colegiado.nombre}</h1>
                <p className="text-sm text-gray-500">Registro: {colegiado.numeroRegistro}</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  colegiado.solvente ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {colegiado.solvente ? 'Solvente' : 'Insolvente'}
                </span>
                
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  colegiado.estado === "Activo" ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {colegiado.estado}
                </span>
                
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  colegiado.carnetVigente ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {colegiado.carnetVigente ? 'Carnet vigente' : 'Carnet vencido'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Mail className="text-gray-400 h-5 w-5 mr-2" />
                <span className="text-gray-700">{colegiado.email}</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="text-gray-400 h-5 w-5 mr-2" />
                <span className="text-gray-700">{colegiado.telefono}</span>
              </div>
              
              <div className="flex items-center">
                <User className="text-gray-400 h-5 w-5 mr-2" />
                <span className="text-gray-700">{colegiado.cedula}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="text-gray-400 h-5 w-5 mr-2" />
                <span className="text-gray-700">Registrado: {colegiado.fechaRegistro}</span>
              </div>
              
              <div className="flex items-start sm:col-span-2">
                <MapPin className="text-gray-400 h-5 w-5 mr-2 mt-0.5" />
                <span className="text-gray-700">{colegiado.direccion}</span>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setMostrarModalSolicitud(true)}
                className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <PlusCircle size={18} />
                <span>Nueva solicitud</span>
              </button>
              
              {!colegiado.tituloEntregado && (
                <button
                  onClick={() => setConfirmarTitulo(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                >
                  <CheckCircle size={18} />
                  <span>Confirmar entrega de título</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs de navegación */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                tabActivo === "informacion" 
                  ? 'border-b-2 border-[#C40180] text-[#C40180]' 
                  : 'text-gray-500 hover:text-gray-700'
              } transition-colors`}
              onClick={() => setTabActivo("informacion")}
            >
              <User size={16} className="inline-block mr-2" />
              Información
            </button>
            
            <button
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                tabActivo === "pagos" 
                  ? 'border-b-2 border-[#C40180] text-[#C40180]' 
                  : 'text-gray-500 hover:text-gray-700'
              } transition-colors`}
              onClick={() => setTabActivo("pagos")}
            >
              <CreditCard size={16} className="inline-block mr-2" />
              Pagos
            </button>
            
            <button
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                tabActivo === "inscripciones" 
                  ? 'border-b-2 border-[#C40180] text-[#C40180]' 
                  : 'text-gray-500 hover:text-gray-700'
              } transition-colors`}
              onClick={() => setTabActivo("inscripciones")}
            >
              <Book size={16} className="inline-block mr-2" />
              Inscripciones
            </button>
            
            <button
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                tabActivo === "solicitudes" 
                  ? 'border-b-2 border-[#C40180] text-[#C40180]' 
                  : 'text-gray-500 hover:text-gray-700'
              } transition-colors`}
              onClick={() => setTabActivo("solicitudes")}
            >
              <FileText size={16} className="inline-block mr-2" />
              Solicitudes
            </button>
            
            <button
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                tabActivo === "carnet" 
                  ? 'border-b-2 border-[#C40180] text-[#C40180]' 
                  : 'text-gray-500 hover:text-gray-700'
              } transition-colors`}
              onClick={() => setTabActivo("carnet")}
            >
              <CreditCard size={16} className="inline-block mr-2" />
              Carnet
            </button>
            
            <button
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                tabActivo === "archivos" 
                  ? 'border-b-2 border-[#C40180] text-[#C40180]' 
                  : 'text-gray-500 hover:text-gray-700'
              } transition-colors`}
              onClick={() => setTabActivo("archivos")}
            >
              <FileBox size={16} className="inline-block mr-2" />
              Archivos
            </button>
            
            <button
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                tabActivo === "chats" 
                  ? 'border-b-2 border-[#C40180] text-[#C40180]' 
                  : 'text-gray-500 hover:text-gray-700'
              } transition-colors`}
              onClick={() => setTabActivo("chats")}
            >
              <MessageSquare size={16} className="inline-block mr-2" />
              Chats
            </button>
            
            <button
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm ${
                tabActivo === "estadisticas" 
                  ? 'border-b-2 border-[#C40180] text-[#C40180]' 
                  : 'text-gray-500 hover:text-gray-700'
              } transition-colors`}
              onClick={() => setTabActivo("estadisticas")}
            >
              <BarChart3 size={16} className="inline-block mr-2" />
              Estadísticas
            </button>
          </nav>
        </div>
        
        {/* Contenido según el tab activo */}
        <div className="p-6">
          {tabActivo === "informacion" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Información profesional</h3>
                <div className="bg-gray-50 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Universidad</p>
                    <p className="font-medium flex items-center">
                      <School size={16} className="mr-1 text-gray-400" />
                      {colegiado.universidad}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Año de graduación</p>
                    <p className="font-medium">{colegiado.anoGraduacion}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Especialidad</p>
                    <p className="font-medium flex items-center">
                      <Award size={16} className="mr-1 text-gray-400" />
                      {colegiado.especialidad || "Ninguna"}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Título entregado en oficina</p>
                    <p className={`font-medium flex items-center ${colegiado.tituloEntregado ? 'text-green-600' : 'text-yellow-600'}`}>
                      {colegiado.tituloEntregado ? (
                        <>
                          <CheckCircle size={16} className="mr-1" />
                          Sí, entregado
                        </>
                      ) : (
                        <>
                          <AlertCircle size={16} className="mr-1" />
                          No entregado
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Información personal</h3>
                <div className="bg-gray-50 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Fecha de nacimiento</p>
                    <p className="font-medium">{colegiado.fechaNacimiento}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Dirección</p>
                    <p className="font-medium">{colegiado.direccion}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Correo electrónico</p>
                    <p className="font-medium">{colegiado.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium">{colegiado.telefono}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Estado financiero</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-4 md:mb-0">
                      <p className="text-sm text-gray-500">Estado de solvencia</p>
                      <p className={`font-medium ${colegiado.solvente ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                        {colegiado.solvente ? (
                          <>
                            <CheckCircle size={16} className="mr-1" />
                            Solvente
                          </>
                        ) : (
                          <>
                            <AlertCircle size={16} className="mr-1" />
                            Insolvente
                          </>
                        )}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Saldo actual</p>
                      <p className={`font-medium ${colegiado.saldo > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                        {colegiado.saldo.toFixed(2)} USD
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {tabActivo === "pagos" && (
            <TablaPagos colegiadoId={colegiado.id} />
          )}
          
          {tabActivo === "inscripciones" && (
            <TablaInscripciones colegiadoId={colegiado.id} />
          )}
          
          {tabActivo === "solicitudes" && (
            <TablaSolicitudes colegiadoId={colegiado.id} />
          )}
          
          {tabActivo === "carnet" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Carnet del colegiado</h3>
                  <p className="text-sm text-gray-500 mt-1">Información del carnet vigente</p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <PlusCircle size={18} />
                    Renovar carnet
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-[#3C0064] to-[#5E0099] text-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Colegio de Odontólogos de Venezuela</h3>
                    <p className="text-xs">Tarjeta de identificación profesional</p>
                  </div>
                  <div className="font-bold text-xl">ODV</div>
                </div>
                
                <div className="flex mt-4">
                  <div className="mr-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                      <img src={colegiado.fotoPerfil} alt="Foto carnet" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-sm opacity-70">Nombre</p>
                      <p className="font-semibold">{colegiado.nombre}</p>
                      
                      <p className="text-sm opacity-70 mt-2">Nº Registro</p>
                      <p className="font-semibold">{colegiado.numeroRegistro}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm opacity-70 mt-2">Especialidad</p>
                      <p className="font-semibold">{colegiado.especialidad || "Odontología General"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="text-xs opacity-70">Fecha de vencimiento</p>
                  <p className="font-semibold">{colegiado.carnetVencimiento}</p>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-xs">ID: {colegiado.id}</div>
                  <div className="h-8 w-20 bg-white bg-opacity-20 rounded flex items-center justify-center">
                    <span className="text-xs font-mono">123456789</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Estado del carnet</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <p className="font-medium text-green-600 flex items-center">
                      <CheckCircle size={16} className="mr-1" />
                      Vigente
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Fecha de emisión</p>
                    <p className="font-medium">12/04/2023</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Fecha de vencimiento</p>
                    <p className="font-medium">{colegiado.carnetVencimiento}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2">
                  <FileText size={18} />
                  Descargar PDF
                </button>
                
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Mail size={18} />
                  Enviar por correo
                </button>
              </div>
            </div>
          )}
          
          {tabActivo === "archivos" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Archivos del colegiado</h3>
                  <p className="text-sm text-gray-500 mt-1">Documentos y archivos asociados al colegiado</p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <button className="bg-[#C40180] text-white px-4 py-2 rounded-md hover:bg-[#590248] transition-colors flex items-center gap-2">
                    <PlusCircle size={18} />
                    Añadir archivo
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded mr-3">
                        <FileText size={24} className="text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Título universitario</h4>
                        <p className="text-xs text-gray-500">PDF · 2.4 MB · Subido 12/04/2023</p>
                      </div>
                    </div>
                    <button className="text-blue-600 text-sm hover:underline">
                      Ver
                    </button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded mr-3">
                        <FileText size={24} className="text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Cédula de identidad</h4>
                        <p className="text-xs text-gray-500">JPG · 1.1 MB · Subido 12/04/2023</p>
                      </div>
                    </div>
                    <button className="text-blue-600 text-sm hover:underline">
                      Ver
                    </button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded mr-3">
                        <FileText size={24} className="text-purple-700" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Constancia de trabajo</h4>
                        <p className="text-xs text-gray-500">PDF · 0.9 MB · Subido 15/05/2023</p>
                      </div>
                    </div>
                    <button className="text-blue-600 text-sm hover:underline">
                      Ver
                    </button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="bg-yellow-100 p-2 rounded mr-3">
                        <FileText size={24} className="text-yellow-700" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Certificado de especialidad</h4>
                        <p className="text-xs text-gray-500">PDF · 1.8 MB · Subido 20/05/2023</p>
                      </div>
                    </div>
                    <button className="text-blue-600 text-sm hover:underline">
                      Ver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {tabActivo === "chats" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Historial de comunicaciones</h3>
                <p className="text-sm text-gray-500 mt-1">Chats y comunicaciones con el colegiado</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-md text-center">
                <MessageSquare size={40} className="text-gray-400 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-700">No hay mensajes recientes</h3>
                <p className="text-sm text-gray-500 mb-4">No se han registrado comunicaciones con este colegiado</p>
                <button className="bg-[#C40180] text-white px-4 py-2 rounded-md hover:bg-[#590248] transition-colors">
                  Iniciar conversación
                </button>
              </div>
            </div>
          )}
          
          {tabActivo === "estadisticas" && (
            <EstadisticasUsuario colegiado={colegiado} />
          )}
        </div>
      </div>
      
      {/* Modal de confirmación para título */}
      {confirmarTitulo && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4 text-green-600">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
                Confirmar entrega de título
              </h3>
              <p className="text-center text-gray-600 mb-6">
                ¿Está seguro que desea registrar que <span className="font-medium">{colegiado.nombre}</span> ha entregado su título físico en la oficina del COV?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirmarTitulo(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarEntregaTitulo}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirmar entrega
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de nueva solicitud */}
      {mostrarModalSolicitud && (
        <NuevaSolicitudModal 
          colegiado={colegiado}
          onClose={() => setMostrarModalSolicitud(false)}
          onSolicitudCreada={(nuevaSolicitud) => {
            // Lógica para añadir la nueva solicitud
            setMostrarModalSolicitud(false)
          }}
        />
      )}
    </div>
  )
}