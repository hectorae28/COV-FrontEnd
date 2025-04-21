"use client";

import React from "react";
import GraficosEstd from "@/Components/PanelControl/GraficoEstd";
import GraficoUniv from "@/Components/PanelControl/GraficoUniv";
import GraficoDM from "@/Components/PanelControl/GraficosDM";

// CustomTooltip
export const CustomTooltip = React.memo(
  ({ active, payload, label, total, isUniversidad = false }) => {
    if ((active && payload && payload.length) || payload?.length) {
      const entry = payload[0].payload;

      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 max-w-[250px]">
          <p className="font-semibold break-words hyphens-auto">
            {isUniversidad ? entry.fullName : label}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Colegiados:</span>{" "}
            {payload[0].value.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {((payload[0].value / total) * 100).toFixed(2)}% del total
          </p>
        </div>
      );
    }
    return null;
  }
);

// Componente para mostrar los filtros
export const FilterDropdown = ({ currentValue, onChange }) => (
  <div className="flex items-center space-x-2 text-sm w-full md:w-auto">
    <span className="text-black font-medium whitespace-nowrap">
      Filtrar por:
    </span>
    <select
      value={currentValue}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white border border-gray-300 text-black py-1.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41023B] focus:border-[#41023B] w-full"
      style={{
        background: "white",
        color: "black",
      }}
    >
      <option
        value="alphabetical"
        style={{ backgroundColor: "white", color: "black" }}
      >
        Alfabético
      </option>
      <option
        value="highest"
        style={{ backgroundColor: "white", color: "black" }}
      >
        Mayor → Menor
      </option>
      <option
        value="lowest"
        style={{ backgroundColor: "white", color: "black" }}
      >
        Menor → Mayor
      </option>
    </select>
  </div>
);

// Función para generar colores únicos
export const generateColors = (data) => {
  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#EF4444",
    "#14B8A6",
    "#6366F1",
    "#F43F5E",
    "#0EA5E9",
    "#FBBF24",
    "#84CC16",
    "#FB7185",
    "#3730A3",
  ];
  return data.map((_, index) => colors[index % colors.length]);
};

// Función para ordenar datos
export const sortData = (data, sortType) => {
  switch (sortType) {
    case "alphabetical":
      return [...data].sort((a, b) => a.name.localeCompare(b.name));
    case "highest":
      return [...data].sort((a, b) => b.value - a.value);
    case "lowest":
      return [...data].sort((a, b) => a.value - b.value);
    default:
      return data;
  }
};

// Componente principal
const GraficosB = () => {
  return (
    <div className="p-2 md:p-6 rounded-3xl">
      <div className="grid grid-cols-1 gap-4 md:gap-8">
        {/* Gráficos */}
        <GraficosEstd />
        <GraficoUniv />
        <GraficoDM />
      </div>
    </div>
  );
};

export default GraficosB;
