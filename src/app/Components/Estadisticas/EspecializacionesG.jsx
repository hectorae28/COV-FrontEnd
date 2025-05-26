"use client"

import { CustomTooltip, FilterDropdown, generateColors, SectionTitle } from "@/app/PanelControl/(Estadisticas)/Estadisticas/EstadisticasUtils";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Datos simulados para especializaciones por profesión
const especializacionProfesionData = [
  // Odontólogo General
  { profesion: "Odontólogo General", especializacion: "Ortodoncia", value: 380 },
  { profesion: "Odontólogo General", especializacion: "Implantología", value: 410 },
  { profesion: "Odontólogo General", especializacion: "Cirugía Maxilofacial", value: 230 },
  { profesion: "Odontólogo General", especializacion: "Endodoncia", value: 290 },
  { profesion: "Odontólogo General", especializacion: "Odontopediatría", value: 180 },
  { profesion: "Odontólogo General", especializacion: "Periodoncia", value: 200 },
  { profesion: "Odontólogo General", especializacion: "Estética Dental", value: 450 },
  
  // Cirujano Maxilofacial
  { profesion: "Cirujano Maxilofacial", especializacion: "Ortodoncia", value: 90 },
  { profesion: "Cirujano Maxilofacial", especializacion: "Implantología", value: 150 },
  { profesion: "Cirujano Maxilofacial", especializacion: "Cirugía Maxilofacial", value: 220 },
  { profesion: "Cirujano Maxilofacial", especializacion: "Endodoncia", value: 70 },
  { profesion: "Cirujano Maxilofacial", especializacion: "Odontopediatría", value: 40 },
  { profesion: "Cirujano Maxilofacial", especializacion: "Periodoncia", value: 60 },
  { profesion: "Cirujano Maxilofacial", especializacion: "Estética Dental", value: 110 },
  
  // Ortodoncista
  { profesion: "Ortodoncista", especializacion: "Ortodoncia", value: 240 },
  { profesion: "Ortodoncista", especializacion: "Implantología", value: 130 },
  { profesion: "Ortodoncista", especializacion: "Cirugía Maxilofacial", value: 80 },
  { profesion: "Ortodoncista", especializacion: "Endodoncia", value: 60 },
  { profesion: "Ortodoncista", especializacion: "Odontopediatría", value: 120 },
  { profesion: "Ortodoncista", especializacion: "Periodoncia", value: 70 },
  { profesion: "Ortodoncista", especializacion: "Estética Dental", value: 190 },
];

// Datos simulados para universidad vs especialización
const universidadEspecializacionData = [
  // UCV
  { universidad: "UCV", especializacion: "Ortodoncia", value: 180 },
  { universidad: "UCV", especializacion: "Implantología", value: 210 },
  { universidad: "UCV", especializacion: "Cirugía Maxilofacial", value: 150 },
  { universidad: "UCV", especializacion: "Endodoncia", value: 130 },
  { universidad: "UCV", especializacion: "Odontopediatría", value: 90 },
  { universidad: "UCV", especializacion: "Periodoncia", value: 110 },
  { universidad: "UCV", especializacion: "Estética Dental", value: 170 },
  
  // LUZ
  { universidad: "LUZ", especializacion: "Ortodoncia", value: 150 },
  { universidad: "LUZ", especializacion: "Implantología", value: 180 },
  { universidad: "LUZ", especializacion: "Cirugía Maxilofacial", value: 120 },
  { universidad: "LUZ", especializacion: "Endodoncia", value: 100 },
  { universidad: "LUZ", especializacion: "Odontopediatría", value: 70 },
  { universidad: "LUZ", especializacion: "Periodoncia", value: 90 },
  { universidad: "LUZ", especializacion: "Estética Dental", value: 140 },
  
  // UC
  { universidad: "UC", especializacion: "Ortodoncia", value: 110 },
  { universidad: "UC", especializacion: "Implantología", value: 130 },
  { universidad: "UC", especializacion: "Cirugía Maxilofacial", value: 85 },
  { universidad: "UC", especializacion: "Endodoncia", value: 75 },
  { universidad: "UC", especializacion: "Odontopediatría", value: 50 },
  { universidad: "UC", especializacion: "Periodoncia", value: 65 },
  { universidad: "UC", especializacion: "Estética Dental", value: 100 },
  
  // ULA
  { universidad: "ULA", especializacion: "Ortodoncia", value: 90 },
  { universidad: "ULA", especializacion: "Implantología", value: 110 },
  { universidad: "ULA", especializacion: "Cirugía Maxilofacial", value: 70 },
  { universidad: "ULA", especializacion: "Endodoncia", value: 60 },
  { universidad: "ULA", especializacion: "Odontopediatría", value: 40 },
  { universidad: "ULA", especializacion: "Periodoncia", value: 50 },
  { universidad: "ULA", especializacion: "Estética Dental", value: 85 },
];

// Componente para Especialización vs Profesión
const EspecializacionProfesionChart = () => {
  const [selectedProfesion, setSelectedProfesion] = useState("Odontólogo General");
  const [sortType, setSortType] = useState("highest");
  
  // Profesiones disponibles
  const profesiones = useMemo(() => {
    const uniqueProfesiones = [...new Set(especializacionProfesionData.map(item => item.profesion))];
    return uniqueProfesiones;
  }, []);
  
  // Opciones para el filtro
  const profesionOptions = useMemo(() => {
    return profesiones.map(profesion => ({ value: profesion, label: profesion }));
  }, [profesiones]);
  
  // Filtrar y ordenar datos según la profesión seleccionada
  const filteredData = useMemo(() => {
    const filtered = especializacionProfesionData.filter(item => item.profesion === selectedProfesion);
    
    switch (sortType) {
      case "alphabetical":
        return [...filtered].sort((a, b) => a.especializacion.localeCompare(b.especializacion));
      case "highest":
        return [...filtered].sort((a, b) => b.value - a.value);
      case "lowest":
        return [...filtered].sort((a, b) => a.value - b.value);
      default:
        return filtered;
    }
  }, [selectedProfesion, sortType]);
  
  // Colores para las barras
  const colors = useMemo(() => generateColors(filteredData), [filteredData]);
  
  // Total de solicitudes para la profesión seleccionada
  const totalSolicitudes = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.value, 0);
  }, [filteredData]);
  
  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h3 className="text-base font-semibold">Colegiados por Especialización</h3>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <FilterDropdown 
            currentValue={selectedProfesion} 
            onChange={setSelectedProfesion} 
            options={profesionOptions}
            label="Profesión:"
          />
          <FilterDropdown 
            currentValue={sortType} 
            onChange={setSortType}
          />
        </div>
      </div>
      
      <div className="text-sm text-center mb-4">
        Total de solicitudes: <span className="font-semibold">{totalSolicitudes.toLocaleString()}</span>
      </div>
      
      <div className="w-full overflow-x-auto">
        <div className="min-w-[500px] md:min-w-0">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="especializacion"
                angle={-45}
                textAnchor="end"
                tick={{ fill: "#4B5563", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
                interval={0}
                height={60}
              />
              <YAxis
                tick={{ fill: "#4B5563", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip total={totalSolicitudes} tooltipType="profesion" />}
                cursor={{ fill: "rgba(229, 231, 235, 0.3)" }}
              />
              <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Componente para Universidad vs Especialización
const UniversidadEspecializacionChart = () => {
  const [selectedEspecializacion, setSelectedEspecializacion] = useState("Ortodoncia");
  const [sortType, setSortType] = useState("highest");
  
  // Especializaciones disponibles
  const especializaciones = useMemo(() => {
    const uniqueEspecializaciones = [...new Set(universidadEspecializacionData.map(item => item.especializacion))];
    return uniqueEspecializaciones;
  }, []);
  
  // Opciones para el filtro
  const especializacionOptions = useMemo(() => {
    return especializaciones.map(especializacion => ({ value: especializacion, label: especializacion }));
  }, [especializaciones]);
  
  // Filtrar y ordenar datos según la especialización seleccionada
  const filteredData = useMemo(() => {
    const filtered = universidadEspecializacionData.filter(item => item.especializacion === selectedEspecializacion);
    
    switch (sortType) {
      case "alphabetical":
        return [...filtered].sort((a, b) => a.universidad.localeCompare(b.universidad));
      case "highest":
        return [...filtered].sort((a, b) => b.value - a.value);
      case "lowest":
        return [...filtered].sort((a, b) => a.value - b.value);
      default:
        return filtered;
    }
  }, [selectedEspecializacion, sortType]);
  
  // Colores para las barras
  const colors = useMemo(() => generateColors(filteredData), [filteredData]);
  
  // Total para la especialización seleccionada
  const totalEspecializacion = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.value, 0);
  }, [filteredData]);
  
  // Datos para gráfico de pastel
  const pieData = useMemo(() => {
    return filteredData.map(item => ({
      name: item.universidad,
      value: item.value,
      porcentaje: (item.value / totalEspecializacion) * 100
    }));
  }, [filteredData, totalEspecializacion]);
  
  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h3 className="text-base font-semibold">Especialización por Universidades</h3>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <FilterDropdown 
            currentValue={selectedEspecializacion} 
            onChange={setSelectedEspecializacion} 
            options={especializacionOptions}
            label="Especialización:"
          />
          <FilterDropdown 
            currentValue={sortType} 
            onChange={setSortType}
          />
        </div>
      </div>
      
      <div className="mt-4 flex flex-col items-center">
        <div className="text-sm font-medium text-[#41023B] mb-2">
          {selectedEspecializacion}: {totalEspecializacion.toLocaleString()} solicitudes
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Gráfico de barras */}
          <div className="overflow-x-auto">
            <div className="min-w-[300px] md:min-w-0">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={filteredData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="universidad"
                    tick={{ fill: "#4B5563", fontSize: 12 }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#4B5563", fontSize: 12 }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomTooltip total={totalEspecializacion} tooltipType="universidad" />}
                    cursor={{ fill: "rgba(229, 231, 235, 0.3)" }}
                  />
                  <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                    {filteredData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Gráfico de pastel */}
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${value.toLocaleString()} (${((value / totalEspecializacion) * 100).toFixed(1)}%)`,
                    "Solicitudes"
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal para Estadísticas de Especializaciones
const GraficoEspecializaciones = () => {
  return (
    <div>
      <SectionTitle 
        title="Estadísticas de Especializaciones" 
        subtitle="Análisis de solicitudes de especializaciones por profesión y universidad" 
      />
      
      <div className="grid grid-cols-1 gap-6">
        <EspecializacionProfesionChart />
        <UniversidadEspecializacionChart />
      </div>
    </div>
  );
};

export default GraficoEspecializaciones;