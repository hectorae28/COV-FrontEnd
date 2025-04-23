"use client"

import React, { useState, useMemo } from "react"
import { Line, LineChart, Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { CustomTooltip, FilterDropdown, generateColors, SectionTitle } from "../../(Estadisticas)/Estadisticas/page"

// Datos simulados para inscripciones por tiempo
const inscripcionesData = [
  // 2023
  { fecha: "Ene 2023", año: 2023, mes: "Ene", value: 75 },
  { fecha: "Feb 2023", año: 2023, mes: "Feb", value: 82 },
  { fecha: "Mar 2023", año: 2023, mes: "Mar", value: 98 },
  { fecha: "Abr 2023", año: 2023, mes: "Abr", value: 110 },
  { fecha: "May 2023", año: 2023, mes: "May", value: 120 },
  { fecha: "Jun 2023", año: 2023, mes: "Jun", value: 85 },
  { fecha: "Jul 2023", año: 2023, mes: "Jul", value: 70 },
  { fecha: "Ago 2023", año: 2023, mes: "Ago", value: 95 },
  { fecha: "Sep 2023", año: 2023, mes: "Sep", value: 115 },
  { fecha: "Oct 2023", año: 2023, mes: "Oct", value: 125 },
  { fecha: "Nov 2023", año: 2023, mes: "Nov", value: 130 },
  { fecha: "Dic 2023", año: 2023, mes: "Dic", value: 90 },
  
  // 2024
  { fecha: "Ene 2024", año: 2024, mes: "Ene", value: 85 },
  { fecha: "Feb 2024", año: 2024, mes: "Feb", value: 95 },
  { fecha: "Mar 2024", año: 2024, mes: "Mar", value: 115 },
  { fecha: "Abr 2024", año: 2024, mes: "Abr", value: 140 },
  { fecha: "May 2024", año: 2024, mes: "May", value: 150 },
  { fecha: "Jun 2024", año: 2024, mes: "Jun", value: 120 },
  { fecha: "Jul 2024", año: 2024, mes: "Jul", value: 95 },
  { fecha: "Ago 2024", año: 2024, mes: "Ago", value: 110 },
  { fecha: "Sep 2024", año: 2024, mes: "Sep", value: 135 },
  { fecha: "Oct 2024", año: 2024, mes: "Oct", value: 145 }
];

// Datos simulados para inscripciones por estado y status
const inscripcionesEstadoData = [
  { estado: "Distrito Capital", status: "Aprobado", value: 550 },
  { estado: "Distrito Capital", status: "Pendiente", value: 120 },
  { estado: "Distrito Capital", status: "Rechazado", value: 30 },
  
  { estado: "Miranda", status: "Aprobado", value: 480 },
  { estado: "Miranda", status: "Pendiente", value: 95 },
  { estado: "Miranda", status: "Rechazado", value: 25 },
  
  { estado: "Zulia", status: "Aprobado", value: 420 },
  { estado: "Zulia", status: "Pendiente", value: 85 },
  { estado: "Zulia", status: "Rechazado", value: 20 },
  
  { estado: "Carabobo", status: "Aprobado", value: 350 },
  { estado: "Carabobo", status: "Pendiente", value: 75 },
  { estado: "Carabobo", status: "Rechazado", value: 18 },
  
  { estado: "Lara", status: "Aprobado", value: 310 },
  { estado: "Lara", status: "Pendiente", value: 65 },
  { estado: "Lara", status: "Rechazado", value: 15 },
];

// Componente para graficar inscripciones por tiempo
const InscripcionesTimeChart = () => {
  const [periodo, setPeriodo] = useState("todo");
  
  // Opciones para el filtro de período
  const periodoOptions = [
    { value: "todo", label: "Todo el período" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
  ];
  
  // Filtrar datos según el período seleccionado
  const filteredData = useMemo(() => {
    if (periodo === "todo") {
      return inscripcionesData;
    } else {
      return inscripcionesData.filter(item => item.año.toString() === periodo);
    }
  }, [periodo]);
  
  // Total de inscripciones en el período seleccionado
  const totalInscripciones = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.value, 0);
  }, [filteredData]);
  
  // Promedio mensual
  const promedioMensual = useMemo(() => {
    return Math.round(totalInscripciones / filteredData.length);
  }, [totalInscripciones, filteredData]);
  
  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h3 className="text-base font-semibold">Inscripciones por Período</h3>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <FilterDropdown 
            currentValue={periodo} 
            onChange={setPeriodo} 
            options={periodoOptions}
            label="Período:"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-sm text-gray-600">Total inscripciones</div>
          <div className="text-xl font-bold text-[#41023B]">{totalInscripciones.toLocaleString()}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-sm text-gray-600">Promedio mensual</div>
          <div className="text-xl font-bold text-[#41023B]">{promedioMensual.toLocaleString()}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-sm text-gray-600">Tendencia</div>
          <div className="text-xl font-bold text-green-600">
            {filteredData.length >= 2 && 
              (filteredData[filteredData.length - 1].value > filteredData[filteredData.length - 2].value ? 
                "↑ Aumento" : "↓ Disminución")
            }
          </div>
        </div>
      </div>
      
      <div className="w-full overflow-x-auto">
        <div className="min-w-[500px] md:min-w-0">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="fecha"
                angle={-45}
                textAnchor="end"
                tick={{ fill: "#4B5563", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
                height={60}
              />
              <YAxis
                tick={{ fill: "#4B5563", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
              />
              <Tooltip
                content={
                  <CustomTooltip 
                    tooltipType="default" 
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="value"
                name="Inscripciones"
                stroke="#41023B"
                strokeWidth={2}
                dot={{ r: 4, fill: "#41023B", stroke: "#41023B" }}
                activeDot={{ r: 6, fill: "#D7008A", stroke: "#41023B" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Componente para Inscripciones por Estado y Status
const InscripcionesEstadoChart = () => {
  const [sortType, setSortType] = useState("highest");
  
  // Estados únicos
  const estados = useMemo(() => {
    const uniqueEstados = [...new Set(inscripcionesEstadoData.map(item => item.estado))];
    return uniqueEstados;
  }, []);
  
  // Procesar datos para el gráfico de barras apiladas
  const processedData = useMemo(() => {
    // Agrupar por estado
    const estadosData = [];
    
    estados.forEach(estado => {
      const estadoData = {
        estado,
        total: 0,
      };
      
      // Buscar cada status para este estado
      const statusItems = inscripcionesEstadoData.filter(item => item.estado === estado);
      
      statusItems.forEach(item => {
        estadoData[item.status] = item.value;
        estadoData.total += item.value;
      });
      
      estadosData.push(estadoData);
    });
    
    // Ordenar
    switch (sortType) {
      case "alphabetical":
        return [...estadosData].sort((a, b) => a.estado.localeCompare(b.estado));
      case "highest":
        return [...estadosData].sort((a, b) => b.total - a.total);
      case "lowest":
        return [...estadosData].sort((a, b) => a.total - b.total);
      default:
        return estadosData;
    }
  }, [estados, sortType]);
  
  // Status únicos para la leyenda
  const statusList = useMemo(() => {
    return [...new Set(inscripcionesEstadoData.map(item => item.status))];
  }, []);
  
  // Colores para cada status
  const statusColors = {
    "Aprobado": "#4ADE80", // Verde
    "Pendiente": "#FBBF24", // Amarillo
    "Rechazado": "#F87171", // Rojo
  };
  
  // Total de inscripciones
  const totalInscripciones = useMemo(() => {
    return inscripcionesEstadoData.reduce((sum, item) => sum + item.value, 0);
  }, []);
  
  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h3 className="text-base font-semibold">Inscripciones por Estado</h3>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <FilterDropdown 
            currentValue={sortType} 
            onChange={setSortType}
          />
        </div>
      </div>
      
      <div className="text-sm text-center mb-4">
        Total de inscripciones: <span className="font-semibold">{totalInscripciones.toLocaleString()}</span>
      </div>
      
      <div className="w-full overflow-x-auto">
        <div className="min-w-[500px] md:min-w-0">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={processedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="estado"
                tick={{ fill: "#4B5563", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#4B5563", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
              />
              <Tooltip />
              <Legend />
              {statusList.map((status) => (
                <Bar 
                  key={status} 
                  dataKey={status} 
                  stackId="a" 
                  fill={statusColors[status] || "#8884d8"} 
                  name={status}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Componente principal para Estadísticas de Inscripciones
const GraficoInscripciones = () => {
  return (
    <div>
      <SectionTitle 
        title="Estadísticas de Inscripciones" 
        subtitle="Análisis de tendencias y estados de las inscripciones" 
      />
      
      <div className="grid grid-cols-1 gap-6">
        <InscripcionesTimeChart />
        <InscripcionesEstadoChart />
      </div>
    </div>
  );
};

export default GraficoInscripciones;