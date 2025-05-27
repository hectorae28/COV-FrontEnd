// page.jsx
"use client";

import GraficoColegiados from "@/Components/Estadisticas/ColegiadosG";
import GraficoEspecializaciones from "@/Components/Estadisticas/EspecializacionesG";
import GraficoEventos from "@/Components/Estadisticas/EventosG";
import GraficoFinanciero from "@/Components/Estadisticas/FinanzasG";
import GraficoInscripciones from "@/Components/Estadisticas/InscripcionesG";
import { useState } from "react";
import { SectionTitle } from "./EstadisticasUtils";

const GraficosB = () => {
  const [activeTab, setActiveTab] = useState("colegiados");
  const tabs = [
    { id: "colegiados", label: "Colegiados" },
    { id: "especializaciones", label: "Especializaciones" },
    { id: "eventos", label: "Eventos" },
    { id: "finanzas", label: "Finanzas" },
    { id: "inscripciones", label: "Inscripciones" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 mt-28">
      <SectionTitle title="Estadísticas Generales" subtitle="Panel estadístico visual e interactivo para el gremio." />
      <div className="flex flex-row space-x-2 justify-center mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
              ${activeTab === tab.id
                ? "bg-[#41023B] text-white shadow-md"
                : "bg-gray-100 text-[#41023B] hover:bg-gray-200"}
            `}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {activeTab === "colegiados" && <GraficoColegiados />}
        {activeTab === "especializaciones" && <GraficoEspecializaciones />}
        {activeTab === "eventos" && <GraficoEventos />}
        {activeTab === "finanzas" && <GraficoFinanciero />}
        {activeTab === "inscripciones" && <GraficoInscripciones />}
      </div>
    </div>
  );
};

export default GraficosB;
