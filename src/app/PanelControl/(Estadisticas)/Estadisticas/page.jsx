"use client"

import React, { useState } from "react"
import GraficoColegiados from "../../Components/Estadisticas/ColegiadosG"
import GraficoEspecializaciones from "../../Components/Estadisticas/EspecializacionesG"
import GraficoEventos from "../../Components/Estadisticas/EventosG"
import GraficoFinanciero from "../../Components/Estadisticas/FinanzasG"
import GraficoInscripciones from "../../Components/Estadisticas/InscripcionesG"

// CustomTooltip
export const CustomTooltip = React.memo(({ active, payload, label, total, tooltipType = "default" }) => {
  if ((active && payload && payload.length) || payload?.length) {
    const entry = payload[0].payload;
    
    // Tooltip personalizado según el tipo de gráfico
    switch(tooltipType) {
      case "mapa":
        return (
          <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 max-w-[250px]">
            <p className="font-semibold break-words hyphens-auto">
              {entry.state || label}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Colegiados:</span> {payload[0].value.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {total ? ((payload[0].value / total) * 100).toFixed(2) + "% del total" : ""}
            </p>
          </div>
        );
        
      case "universidad":
        return (
          <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 max-w-[250px]">
            <p className="font-semibold break-words hyphens-auto">
              {entry.fullName || entry.universidad || label}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Colegiados:</span> {payload[0].value.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {total ? ((payload[0].value / total) * 100).toFixed(2) + "% del total" : ""}
            </p>
          </div>
        );
        
      case "profesion":
        return (
          <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 max-w-[280px]">
            <p className="font-semibold break-words hyphens-auto">
              {entry.profesion || label}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">{entry.categoria || "Valor"}:</span> {payload[0].value.toLocaleString()}
            </p>
            {entry.porcentaje && (
              <p className="text-xs text-gray-500 mt-1">
                {entry.porcentaje.toFixed(2)}% del total
              </p>
            )}
          </div>
        );
        
      case "financiero":
        return (
          <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 max-w-[280px]">
            <p className="font-semibold break-words hyphens-auto">
              {entry.tramite || label}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Monto:</span> {(entry.monto || payload[0].value).toLocaleString()} Bs
            </p>
            {entry.metodo && (
              <p className="text-xs text-gray-500 mt-1">
                Método de pago: {entry.metodo}
              </p>
            )}
          </div>
        );
        
      default:
        return (
          <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 max-w-[250px]">
            <p className="font-semibold break-words hyphens-auto">
              {label}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Valor:</span> {payload[0].value.toLocaleString()}
            </p>
            {total && (
              <p className="text-xs text-gray-500 mt-1">
                {((payload[0].value / total) * 100).toFixed(2)}% del total
              </p>
            )}
          </div>
        );
    }
  }
  return null;
});

// Componente para mostrar los filtros
export const FilterDropdown = ({ currentValue, onChange, options = [], label = "Filtrar por:" }) => (
  <div className="flex items-center space-x-2 text-sm w-full md:w-auto">
    <span className="text-black font-medium whitespace-nowrap">{label}</span>
    <select
      value={currentValue}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white border border-gray-300 text-black py-1.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41023B] focus:border-[#41023B] w-full"
      style={{
        background: "white",
        color: "black",
      }}
    >
      {options.length > 0 ? (
        options.map((option) => (
          <option key={option.value} value={option.value} style={{ backgroundColor: "white", color: "black" }}>
            {option.label}
          </option>
        ))
      ) : (
        <>
          <option value="alphabetical" style={{ backgroundColor: "white", color: "black" }}>
            Alfabético
          </option>
          <option value="highest" style={{ backgroundColor: "white", color: "black" }}>
            Mayor → Menor
          </option>
          <option value="lowest" style={{ backgroundColor: "white", color: "black" }}>
            Menor → Mayor
          </option>
        </>
      )}
    </select>
  </div>
)

// Función para generar colores únicos
export const generateColors = (data) => {
  const colors = [
    "#3B82F6", // Azul
    "#10B981", // Verde
    "#F59E0B", // Amarillo
    "#8B5CF6", // Morado
    "#EC4899", // Rosa
    "#06B6D4", // Cian
    "#EF4444", // Rojo
    "#14B8A6", // Verde azulado
    "#6366F1", // Indigo
    "#F43F5E", // Rosa rojo
    "#0EA5E9", // Celeste
    "#FBBF24", // Amarillo dorado
    "#84CC16", // Lima
    "#FB7185", // Rosa claro
    "#3730A3", // Azul oscuro
    "#D946EF", // Magenta
    "#F97316", // Naranja
    "#9333EA", // Púrpura
    "#64748B", // Gris azulado
    "#DC2626", // Rojo intenso
  ]
  return data.map((_, index) => colors[index % colors.length])
}

// Función para ordenar datos
export const sortData = (data, sortType, valueKey = "value", nameKey = "name") => {
  switch (sortType) {
    case "alphabetical":
      return [...data].sort((a, b) => a[nameKey].localeCompare(b[nameKey]))
    case "highest":
      return [...data].sort((a, b) => b[valueKey] - a[valueKey])
    case "lowest":
      return [...data].sort((a, b) => a[valueKey] - b[valueKey])
    default:
      return data
  }
}

// Componente de título de sección
export const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-6 text-center">
    <h2 className="text-2xl font-bold text-[#41023B]">{title}</h2>
    {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
  </div>
)

// Componente principal
const GraficosB = () => {
  const [activeTab, setActiveTab] = useState("colegiados");
  
  const tabs = [
    { id: "colegiados", name: "Estadísticas Colegiados" },
    { id: "inscripciones", name: "Inscripciones" },
    { id: "especializaciones", name: "Especializaciones" },
    { id: "eventos", name: "Eventos y Cursos" },
    { id: "financiero", name: "Estadísticas Financieras" },
  ];

  return (
    <div className="p-2 md:p-6 rounded-3xl mt-28">
      {/* Tabs de navegación */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all ${
              activeTab === tab.id 
                ? "bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white shadow-md" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Contenido de las pestañas */}
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {activeTab === "colegiados" && <GraficoColegiados />}
        {activeTab === "inscripciones" && <GraficoInscripciones />}
        {activeTab === "especializaciones" && <GraficoEspecializaciones />}
        {activeTab === "eventos" && <GraficoEventos />}
        {activeTab === "financiero" && <GraficoFinanciero />}
      </div>
    </div>
  )
}

export default GraficosB