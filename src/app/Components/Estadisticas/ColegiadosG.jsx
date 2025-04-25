"use client"

import { FilterDropdown, SectionTitle } from "@/app/PanelControl/(Estadisticas)/Estadisticas/page";
import { useMemo, useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Datos modificados para los estados de Venezuela (sin profesiones)
const estadosVenezuelaData = [
  { estado: "Distrito Capital", value: 4320, shortName: "D. Capital" },
  { estado: "Miranda", value: 3850, shortName: "Miranda" },
  { estado: "Zulia", value: 3260, shortName: "Zulia" },
  { estado: "Carabobo", value: 2780, shortName: "Carabobo" },
  { estado: "Lara", value: 2340, shortName: "Lara" },
  { estado: "Aragua", value: 2150, shortName: "Aragua" },
  { estado: "Bolívar", value: 1920, shortName: "Bolívar" },
  { estado: "Anzoátegui", value: 1780, shortName: "Anzoátegui" },
  { estado: "Táchira", value: 1560, shortName: "Táchira" },
  { estado: "Mérida", value: 1450, shortName: "Mérida" },
  { estado: "Falcón", value: 1240, shortName: "Falcón" },
  { estado: "Portuguesa", value: 980, shortName: "Portuguesa" },
  { estado: "Barinas", value: 920, shortName: "Barinas" },
  { estado: "Sucre", value: 880, shortName: "Sucre" },
  { estado: "Monagas", value: 840, shortName: "Monagas" },
  { estado: "Trujillo", value: 780, shortName: "Trujillo" },
  { estado: "Guárico", value: 740, shortName: "Guárico" },
  { estado: "Yaracuy", value: 710, shortName: "Yaracuy" },
  { estado: "Cojedes", value: 580, shortName: "Cojedes" },
  { estado: "Nueva Esparta", value: 950, shortName: "N. Esparta" },
  { estado: "Vargas", value: 620, shortName: "Vargas" },
  { estado: "Apure", value: 520, shortName: "Apure" },
  { estado: "Delta Amacuro", value: 320, shortName: "Delta A." },
  { estado: "Amazonas", value: 260, shortName: "Amazonas" }
];

// Datos modificados para las universidades con más datos y abreviaturas
const universidadData = [
  { universidad: "Universidad Central de Venezuela", value: 3250, shortName: "UCV" },
  { universidad: "Universidad del Zulia", value: 2870, shortName: "LUZ" },
  { universidad: "Universidad de Carabobo", value: 2340, shortName: "UC" },
  { universidad: "Universidad de Los Andes", value: 2180, shortName: "ULA" },
  { universidad: "Universidad de Oriente", value: 1950, shortName: "UDO" },
  { universidad: "Universidad Centroccidental Lisandro Alvarado", value: 1780, shortName: "UCLA" },
  { universidad: "Universidad Nacional Experimental de Los Llanos Occidentales Ezequiel Zamora", value: 1420, shortName: "UNELLEZ" },
  { universidad: "Universidad Nacional Experimental Rómulo Gallegos", value: 1240, shortName: "UNERG" },
  { universidad: "Universidad Nacional Experimental Francisco de Miranda", value: 980, shortName: "UNEFM" },
  { universidad: "Universidad Bolivariana de Venezuela", value: 870, shortName: "UBV" },
  { universidad: "Universidad Nacional Experimental Politécnica Antonio José de Sucre", value: 720, shortName: "UNEXPO" },
  { universidad: "Universidad Nacional Experimental Sur del Lago Jesús María Semprum", value: 640, shortName: "UNESUR" },
  { universidad: "Universidad Pedagógica Experimental Libertador", value: 590, shortName: "UPEL" },
  { universidad: "Universidad Nacional Abierta", value: 520, shortName: "UNA" },
  { universidad: "Universidad Nacional Experimental de Guayana", value: 480, shortName: "UNEG" }
];

// Función para generar colores pastel
const generatePastelColors = (count) => {
  const pastelColors = [
    "#B5C9FF", "#C3B5FF", "#FFB5E8", "#FFD6A5", "#CAFFBF", 
    "#9BF6FF", "#BDB2FF", "#FFC6FF", "#FDFFB6", "#A0C4FF",
    "#FFC6C6", "#CAFFDE", "#FFE5A9", "#E5C9FF", "#BFFCC6",
    "#D4A5FF", "#FFABAB", "#A5DFFF", "#FFF5BA", "#FFCBC1",
    "#E0FFD8", "#D5AAFF", "#AFCBFF", "#FFD8BE", "#BFFFF3"
  ];
  
  // Si hay más elementos que colores base, repetimos con variaciones
  if (count <= pastelColors.length) {
    return pastelColors.slice(0, count);
  }
  
  // Duplicamos y variamos los colores si necesitamos más
  const colors = [...pastelColors];
  while (colors.length < count) {
    const color = pastelColors[colors.length % pastelColors.length];
    colors.push(color);
  }
  
  return colors;
};

// Componente personalizado para el tooltip
const EnhancedTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-lg rounded-md border border-gray-200">
        <p className="font-semibold text-[#41023B]">{data.estado || data.universidad}</p>
        <p className="text-gray-700">{payload[0].value.toLocaleString()} colegiados</p>
      </div>
    );
  }
  return null;
};

// Componente para Estados de Venezuela
const EstadosVenezuelaChart = () => {
  const [sortType, setSortType] = useState("highest");
  
  // Ordenar datos según el tipo de ordenamiento
  const filteredData = useMemo(() => {
    switch (sortType) {
      case "alphabetical":
        return [...estadosVenezuelaData].sort((a, b) => a.estado.localeCompare(b.estado));
      case "highest":
        return [...estadosVenezuelaData].sort((a, b) => b.value - a.value);
      case "lowest":
        return [...estadosVenezuelaData].sort((a, b) => a.value - b.value);
      default:
        return estadosVenezuelaData;
    }
  }, [sortType]);
  
  // Colores pastel para cada barra
  const colors = useMemo(() => generatePastelColors(filteredData.length), [filteredData.length]);
  
  // Total de colegiados
  const totalColegiados = useMemo(() => {
    return estadosVenezuelaData.reduce((sum, item) => sum + item.value, 0);
  }, []);
  
  return (
    <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h3 className="text-lg font-semibold text-[#41023B]">Colegiados por Estado</h3>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <FilterDropdown 
            currentValue={sortType}
            onChange={setSortType}
          />
        </div>
      </div>
      
      <div className="mt-4 flex flex-col items-center">
        <div className="text-sm font-medium text-white mb-4 bg-gradient-to-r from-[#D7008A] to-[#41023B] px-4 py-2 rounded-full">
          Total nacional: {totalColegiados.toLocaleString()} colegiados
        </div>
        
        <div className="w-full overflow-x-auto">
          <div className="min-w-[300px] md:min-w-0">
            <ResponsiveContainer width="100%" height={700}>
              <BarChart
                data={filteredData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barSize={22}
                layout="vertical"
              >
                <XAxis
                  type="number"
                  tick={{ fill: "#4B5563", fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  dataKey="shortName"
                  type="category"
                  tick={{ fill: "#4B5563", fontSize: 13, fontWeight: 500 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                  width={90}
                  interval={0} // Asegura que se muestren todos los ticks
                />
                <Tooltip content={<EnhancedTooltip />} />
                <Bar 
                  dataKey="value" 
                  radius={[0, 6, 6, 0]}
                  animationDuration={1500}
                >
                  {filteredData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]} 
                      stroke={"#9CA3AF"}
                      strokeWidth={0.5}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para Universidades
const UniversidadesChart = () => {
  const [sortType, setSortType] = useState("highest");
  
  // Ordenar datos según el tipo de ordenamiento
  const filteredData = useMemo(() => {
    switch (sortType) {
      case "alphabetical":
        return [...universidadData].sort((a, b) => a.universidad.localeCompare(b.universidad));
      case "highest":
        return [...universidadData].sort((a, b) => b.value - a.value);
      case "lowest":
        return [...universidadData].sort((a, b) => a.value - b.value);
      default:
        return universidadData;
    }
  }, [sortType]);
  
  // Colores pastel para cada barra
  const colors = useMemo(() => generatePastelColors(filteredData.length), [filteredData.length]);
  
  // Total de colegiados
  const totalUniversidades = useMemo(() => {
    return universidadData.reduce((sum, item) => sum + item.value, 0);
  }, []);
  
  return (
    <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-100 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h3 className="text-lg font-semibold text-[#41023B]">Colegiados por Universidad</h3>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <FilterDropdown 
            currentValue={sortType}
            onChange={setSortType}
          />
        </div>
      </div>
      
      <div className="mt-4 flex flex-col items-center">
        <div className="text-sm font-medium text-white mb-4 bg-gradient-to-r from-[#D7008A] to-[#41023B] px-4 py-2 rounded-full">
          Total: {totalUniversidades.toLocaleString()} colegiados
        </div>
        
        <div className="w-full overflow-x-auto">
          <div className="min-w-[300px] md:min-w-0">
            <ResponsiveContainer width="100%" height={550}>
              <BarChart
                data={filteredData}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                barSize={22}
                layout="vertical"
              >
                <XAxis
                  type="number"
                  tick={{ fill: "#4B5563", fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  dataKey="shortName"
                  type="category"
                  tick={{ fill: "#4B5563", fontSize: 13, fontWeight: 500 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                  width={90}
                  interval={0} // Asegura que se muestren todos los ticks
                />
                <Tooltip content={<EnhancedTooltip />} />
                <Bar 
                  dataKey="value" 
                  radius={[0, 6, 6, 0]}
                  animationDuration={1500}
                >
                  {filteredData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]} 
                      stroke={"#9CA3AF"}
                      strokeWidth={0.5}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal para Estadísticas de Colegiados
const GraficoColegiados = () => {
  return (
    <div className="py-6">
      <SectionTitle 
        title="Estadísticas de Colegiados"
        subtitle="Distribución demográfica de los colegiados por estado y universidad"
      />
      
      <div className="flex flex-col gap-6 mt-6">
        <EstadosVenezuelaChart />
        <UniversidadesChart />
      </div>
    </div>
  );
};

export default GraficoColegiados;
