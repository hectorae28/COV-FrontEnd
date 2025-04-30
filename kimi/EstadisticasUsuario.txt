"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Activity, Clock, ArrowUp, ArrowDown } from "lucide-react"

/**
 * Componente para mostrar estadísticas y gráficos de un colegiado
 * @param {Object} colegiado - Datos del colegiado
 */
export default function EstadisticasUsuario({ colegiado }) {
  // Estados
  const [datosAsistencia, setDatosAsistencia] = useState([])
  const [datosPagos, setDatosPagos] = useState([])
  const [estadisticasGenerales, setEstadisticasGenerales] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Inicializar datos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Simulamos la carga con un retardo
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Datos simulados para el gráfico de asistencia
        setDatosAsistencia([
          { mes: 'Ene', eventos: 1, promedio: 0.8 },
          { mes: 'Feb', eventos: 2, promedio: 0.9 },
          { mes: 'Mar', eventos: 3, promedio: 1.2 },
          { mes: 'Abr', eventos: 1, promedio: 1.0 },
          { mes: 'May', eventos: 0, promedio: 1.1 },
          { mes: 'Jun', eventos: 1, promedio: 0.7 }
        ])
        
        // Datos simulados para el gráfico de pagos
        setDatosPagos([
          { name: 'Cuotas anuales', value: 120 },
          { name: 'Cursos', value: 85 },
          { name: 'Trámites', value: 50 },
          { name: 'Otros', value: 20 }
        ])
        
        // Estadísticas generales
        setEstadisticasGenerales([
          {
            titulo: "Actividad mensual",
            valor: "+12%",
            descripcion: "vs. mes anterior",
            tendencia: "up",
            color: "green"
          },
          {
            titulo: "Eventos asistidos",
            valor: colegiado.estadisticas?.asistenciaEventos || "5",
            descripcion: "en los últimos 6 meses",
            tendencia: "up",
            color: "blue"
          },
          {
            titulo: "Días desde último acceso",
            valor: "3",
            descripcion: "última actividad reciente",
            tendencia: "neutral",
            color: "gray"
          },
          {
            titulo: "Estado de pagos",
            valor: colegiado.solvente ? "100%" : "Pendiente",
            descripcion: colegiado.solvente ? "solvente" : "pagos por realizar",
            tendencia: colegiado.solvente ? "up" : "down",
            color: colegiado.solvente ? "green" : "red"
          }
        ])
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error al cargar datos estadísticos:", error)
        setIsLoading(false)
      }
    }
    
    cargarDatos()
  }, [colegiado])

  // Colores para el gráfico de pie
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d']

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Estadísticas del colegiado</h3>
        <p className="text-sm text-gray-500 mt-1">Actividad y comportamiento dentro del sistema</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
        </div>
      ) : (
        <>
          {/* Tarjetas de estadísticas generales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {estadisticasGenerales.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-sm text-gray-500">{stat.titulo}</p>
                <div className="flex items-end justify-between mt-2">
                  <p className={`text-2xl font-semibold text-${stat.color}-600`}>{stat.valor}</p>
                  <div className="flex items-center">
                    <p className="text-xs text-gray-500 mr-1">{stat.descripcion}</p>
                    {stat.tendencia === "up" && <ArrowUp size={14} className="text-green-500" />}
                    {stat.tendencia === "down" && <ArrowDown size={14} className="text-red-500" />}
                    {stat.tendencia === "neutral" && <Activity size={14} className="text-gray-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de asistencia a eventos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h4 className="text-base font-medium text-gray-900 mb-4">Asistencia a eventos</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={datosAsistencia}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar name="Eventos asistidos" dataKey="eventos" fill="#8884d8" />
                    <Bar name="Promedio COV" dataKey="promedio" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Gráfico de distribución de pagos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h4 className="text-base font-medium text-gray-900 mb-4">Distribución de pagos (USD)</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosPagos}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {datosPagos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, "Monto"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Sección informativa */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-1">Análisis de actividad</h4>
                <p className="text-sm text-gray-500">
                  {colegiado.nombre} muestra un nivel de participación {colegiado.estadisticas?.asistenciaEventos > 3 ? 'por encima del promedio' : 'normal'} en eventos del COV. 
                  En los últimos 6 meses, ha asistido a {colegiado.estadisticas?.asistenciaEventos || "5"} eventos y ha realizado {colegiado.estadisticas?.solicitudesMes || "2"} solicitudes.
                  {colegiado.solvente 
                    ? ' Mantiene un excelente historial de pagos y está al día con todas sus obligaciones.'
                    : ' Presenta algunas obligaciones pendientes de pago que deben ser regularizadas.'}
                </p>
                
                <div className="mt-4 bg-blue-50 text-blue-800 p-3 rounded-md text-sm">
                  <p className="font-medium">Recomendaciones</p>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    <li>Invitar a participar en el próximo congreso nacional (Mayo 2025)</li>
                    <li>Recordar la renovación de su carnet que vence en {colegiado.carnetVencimiento}</li>
                    {!colegiado.tituloEntregado && <li>Solicitar la entrega del título original en la sede del COV</li>}
                    {!colegiado.solvente && <li>Regularizar estado de solvencia con el pago de cuotas pendientes</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}