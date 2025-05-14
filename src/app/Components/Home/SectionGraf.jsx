"use client"
import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Componente personalizado para el tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const statusColors = {
      total: '#C40180',
      pendientes: '#F59E0B',
      aprobadas: '#10B981',
      rechazadas: '#EF4444',
    }
    return (
      <div className="bg-white p-3 border shadow-md rounded-md">
        <p className=" font-medium text-sm">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: statusColors[entry.dataKey] || '#333' }}>
            <span className="font-bold">{entry.name}: </span>
            {entry.value} solicitudes
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Componente para el gráfico de tendencia de solicitudes con sparkline
const SectionGraf = ({ datos, estadisticasSolicitudes, tendencia }) => {
  const [filtroTiempo, setFiltroTiempo] = useState("dia");
  
  // Función para filtrar datos según el período seleccionado
  const filtrarDatos = () => {
    // Aquí implementaríamos la lógica real para filtrar los datos
    // Por ahora, simulamos diferentes conjuntos de datos para cada filtro
    
    // En una implementación real, estos datos vendrían de la API o props
    switch(filtroTiempo) {
      case "dia":
        return datos;
      case "semana":
        // Simulamos datos agrupados por semana
        return datos.filter((_, index) => index % 7 === 0);
      case "mes":
        // Simulamos datos agrupados por mes
        return datos.filter((_, index) => index % 30 === 0);
      default:
        return datos;
    }
  };

  // Transformar los datos para incluir las categorías
  const chartData = filtrarDatos().map(item => ({
    dia: item.dia,
    total: item.cantidad,
    pendientes: Math.round(item.cantidad * (estadisticasSolicitudes.pendientes / estadisticasSolicitudes.total)),
    aprobadas: Math.round(item.cantidad * (estadisticasSolicitudes.aprobadas / estadisticasSolicitudes.total)),
    rechazadas: Math.round(item.cantidad * (estadisticasSolicitudes.rechazadas / estadisticasSolicitudes.total)),
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <BarChart3 className="mr-2 h-5 w-5 text-[#C40180]" />
          Tendencia de Solicitudes
        </h3>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${tendencia === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {tendencia === 'up' ? (
              <>
                <TrendingUp className="h-5 w-5 mr-1" />
                <span>Tendencia alcista</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-5 w-5 mr-1" />
                <span>Tendencia bajista</span>
              </>
            )}
          </div>
          
          {/* Filtros de tiempo */}
          <div className="flex bg-gray-100 rounded-md">
            <button 
              className={`cursor-pointer px-3 py-1 text-sm rounded-md ${filtroTiempo === 'dia' ? 'bg-[#C40180] text-white' : 'text-gray-600'}`}
              onClick={() => setFiltroTiempo('dia')}
            >
              Día
            </button>
            <button 
              className={`cursor-pointer px-3 py-1 text-sm rounded-md ${filtroTiempo === 'semana' ? 'bg-[#C40180] text-white' : 'text-gray-600'}`}
              onClick={() => setFiltroTiempo('semana')}
            >
              Semana
            </button>
            <button 
              className={`cursor-pointer px-3 py-1 text-sm rounded-md ${filtroTiempo === 'mes' ? 'bg-[#C40180] text-white' : 'text-gray-600'}`}
              onClick={() => setFiltroTiempo('mes')}
            >
              Mes
            </button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            barSize={30}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="dia"
              tick={{ fill: "#4B5563", fontSize: 12 }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#4B5563", fontSize: 12 }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" name="Total" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#C40180" />
              ))}
            </Bar>
            <Bar dataKey="pendientes" name="Pendientes" radius={[0, 0, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#F59E0B" />
              ))}
            </Bar>
            <Bar dataKey="aprobadas" name="Aprobadas" radius={[0, 0, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#10B981" />
              ))}
            </Bar>
            <Bar dataKey="rechazadas" name="Rechazadas" radius={[0, 0, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#EF4444" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Tarjetas de estadísticas integradas bajo el gráfico */}
      <div className="grid grid-cols-4 gap-4 mt-8">
        <div className="bg-gradient-to-br from-[#C40180]/5 to-[#590248]/5 rounded-lg p-4 border-l-4 border-[#C40180] shadow-sm">
          <h3 className="text-sm font-medium text-gray-700">Total</h3>
          <p className="text-2xl font-bold mt-1">{estadisticasSolicitudes.total}</p>
          <div className="mt-1 text-xs text-gray-500">Últimos 30 días</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/30 rounded-lg p-4 border-l-4 border-yellow-400 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700">Pendientes</h3>
          <p className="text-2xl font-bold mt-1">{estadisticasSolicitudes.pendientes}</p>
          <div className="mt-1 text-xs text-gray-500">
            {Math.round((estadisticasSolicitudes.pendientes / estadisticasSolicitudes.total) * 100)}% del total
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100/30 rounded-lg p-4 border-l-4 border-green-400 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700">Aprobadas</h3>
          <p className="text-2xl font-bold mt-1">{estadisticasSolicitudes.aprobadas}</p>
          <div className="mt-1 text-xs text-gray-500">
            {Math.round((estadisticasSolicitudes.aprobadas / estadisticasSolicitudes.total) * 100)}% del total
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100/30 rounded-lg p-4 border-l-4 border-red-400 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700">Rechazadas</h3>
          <p className="text-2xl font-bold mt-1">{estadisticasSolicitudes.rechazadas}</p>
          <div className="mt-1 text-xs text-gray-500">
            {Math.round((estadisticasSolicitudes.rechazadas / estadisticasSolicitudes.total) * 100)}% del total
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionGraf
