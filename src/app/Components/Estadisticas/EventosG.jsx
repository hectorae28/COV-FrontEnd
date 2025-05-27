"use client"

import { FilterDropdown, generateColors, SectionTitle } from "@/app/PanelControl/(Estadisticas)/Estadisticas/EstadisticasUtils";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Datos simulados para inscripciones a eventos y cursos vs status
const inscripcionesEventosData = [
  { tipo: "Curso", nombre: "Actualización en Endodoncia", status: "Inscrito", value: 120 },
  { tipo: "Curso", nombre: "Actualización en Endodoncia", status: "Confirmado", value: 100 },
  { tipo: "Curso", nombre: "Actualización en Endodoncia", status: "Cancelado", value: 15 },
  
  { tipo: "Curso", nombre: "Implantología Moderna", status: "Inscrito", value: 150 },
  { tipo: "Curso", nombre: "Implantología Moderna", status: "Confirmado", value: 130 },
  { tipo: "Curso", nombre: "Implantología Moderna", status: "Cancelado", value: 20 },
  
  { tipo: "Curso", nombre: "Ortodoncia Práctica", status: "Inscrito", value: 110 },
  { tipo: "Curso", nombre: "Ortodoncia Práctica", status: "Confirmado", value: 90 },
  { tipo: "Curso", nombre: "Ortodoncia Práctica", status: "Cancelado", value: 10 },
  
  { tipo: "Taller", nombre: "Técnicas de Estética Dental", status: "Inscrito", value: 90 },
  { tipo: "Taller", nombre: "Técnicas de Estética Dental", status: "Confirmado", value: 75 },
  { tipo: "Taller", nombre: "Técnicas de Estética Dental", status: "Cancelado", value: 8 },
  
  { tipo: "Taller", nombre: "Periodoncia Avanzada", status: "Inscrito", value: 80 },
  { tipo: "Taller", nombre: "Periodoncia Avanzada", status: "Confirmado", value: 65 },
  { tipo: "Taller", nombre: "Periodoncia Avanzada", status: "Cancelado", value: 7 },
  
  { tipo: "Congreso", nombre: "Congreso Nacional de Odontología", status: "Inscrito", value: 200 },
  { tipo: "Congreso", nombre: "Congreso Nacional de Odontología", status: "Confirmado", value: 180 },
  { tipo: "Congreso", nombre: "Congreso Nacional de Odontología", status: "Cancelado", value: 25 },
  
  { tipo: "Seminario", nombre: "Nuevas Tecnologías en Odontología", status: "Inscrito", value: 130 },
  { tipo: "Seminario", nombre: "Nuevas Tecnologías en Odontología", status: "Confirmado", value: 110 },
  { tipo: "Seminario", nombre: "Nuevas Tecnologías en Odontología", status: "Cancelado", value: 15 },
  
  { tipo: "Webinar", nombre: "Ética Profesional Odontológica", status: "Inscrito", value: 180 },
  { tipo: "Webinar", nombre: "Ética Profesional Odontológica", status: "Confirmado", value: 160 },
  { tipo: "Webinar", nombre: "Ética Profesional Odontológica", status: "Cancelado", value: 5 },
];

// Datos simulados para eventos por ubicación
const eventosUbicacionData = [
  { ubicacion: "Caracas", tipo: "Curso", eventos: 5, participantesTotal: 520 },
  { ubicacion: "Caracas", tipo: "Taller", eventos: 3, participantesTotal: 230 },
  { ubicacion: "Caracas", tipo: "Congreso", eventos: 1, participantesTotal: 180 },
  { ubicacion: "Caracas", tipo: "Seminario", eventos: 2, participantesTotal: 190 },
  { ubicacion: "Caracas", tipo: "Webinar", eventos: 0, participantesTotal: 0 },
  
  { ubicacion: "Maracaibo", tipo: "Curso", eventos: 3, participantesTotal: 280 },
  { ubicacion: "Maracaibo", tipo: "Taller", eventos: 2, participantesTotal: 150 },
  { ubicacion: "Maracaibo", tipo: "Congreso", eventos: 0, participantesTotal: 0 },
  { ubicacion: "Maracaibo", tipo: "Seminario", eventos: 1, participantesTotal: 85 },
  { ubicacion: "Maracaibo", tipo: "Webinar", eventos: 0, participantesTotal: 0 },
  
  { ubicacion: "Valencia", tipo: "Curso", eventos: 2, participantesTotal: 170 },
  { ubicacion: "Valencia", tipo: "Taller", eventos: 1, participantesTotal: 65 },
  { ubicacion: "Valencia", tipo: "Congreso", eventos: 0, participantesTotal: 0 },
  { ubicacion: "Valencia", tipo: "Seminario", eventos: 1, participantesTotal: 90 },
  { ubicacion: "Valencia", tipo: "Webinar", eventos: 0, participantesTotal: 0 },
  
  { ubicacion: "Barquisimeto", tipo: "Curso", eventos: 2, participantesTotal: 160 },
  { ubicacion: "Barquisimeto", tipo: "Taller", eventos: 1, participantesTotal: 70 },
  { ubicacion: "Barquisimeto", tipo: "Congreso", eventos: 0, participantesTotal: 0 },
  { ubicacion: "Barquisimeto", tipo: "Seminario", eventos: 0, participantesTotal: 0 },
  { ubicacion: "Barquisimeto", tipo: "Webinar", eventos: 0, participantesTotal: 0 },
  
  { ubicacion: "Mérida", tipo: "Curso", eventos: 1, participantesTotal: 80 },
  { ubicacion: "Mérida", tipo: "Taller", eventos: 1, participantesTotal: 60 },
  { ubicacion: "Mérida", tipo: "Congreso", eventos: 0, participantesTotal: 0 },
  { ubicacion: "Mérida", tipo: "Seminario", eventos: 0, participantesTotal: 0 },
  { ubicacion: "Mérida", tipo: "Webinar", eventos: 0, participantesTotal: 0 },
  
  { ubicacion: "Virtual", tipo: "Curso", eventos: 1, participantesTotal: 120 },
  { ubicacion: "Virtual", tipo: "Taller", eventos: 0, participantesTotal: 0 },
  { ubicacion: "Virtual", tipo: "Congreso", eventos: 0, participantesTotal: 0 },
  { ubicacion: "Virtual", tipo: "Seminario", eventos: 1, participantesTotal: 110 },
  { ubicacion: "Virtual", tipo: "Webinar", eventos: 3, participantesTotal: 440 },
];

// Componente para Inscripciones a Eventos y Cursos
const InscripcionesEventosChart = () => {
  const [selectedTipo, setSelectedTipo] = useState("Todos");
  const [sortType, setSortType] = useState("highest");
  
  // Tipos de eventos disponibles
  const tiposEvento = useMemo(() => {
    const uniqueTipos = [...new Set(inscripcionesEventosData.map(item => item.tipo))];
    return ["Todos", ...uniqueTipos];
  }, []);
  
  // Opciones para el filtro
  const tipoOptions = useMemo(() => {
    return tiposEvento.map(tipo => ({ value: tipo, label: tipo }));
  }, [tiposEvento]);
  
  // Procesar datos para el gráfico
  const processedData = useMemo(() => {
    // Filtrar por tipo si es necesario
    const filteredData = selectedTipo === "Todos" 
      ? inscripcionesEventosData 
      : inscripcionesEventosData.filter(item => item.tipo === selectedTipo);
    
    // Agrupar por nombre de evento
    const eventosMap = new Map();
    
    filteredData.forEach(item => {
      if (!eventosMap.has(item.nombre)) {
        eventosMap.set(item.nombre, {
          nombre: item.nombre,
          tipo: item.tipo,
          total: 0,
        });
      }
      
      const eventoData = eventosMap.get(item.nombre);
      eventoData[item.status] = item.value;
      eventoData.total += item.value;
    });
    
    const result = Array.from(eventosMap.values());
    
    // Ordenar
    switch (sortType) {
      case "alphabetical":
        return [...result].sort((a, b) => a.nombre.localeCompare(b.nombre));
      case "highest":
        return [...result].sort((a, b) => b.total - a.total);
      case "lowest":
        return [...result].sort((a, b) => a.total - b.total);
      default:
        return result;
    }
  }, [selectedTipo, sortType]);
  
  // Status únicos para la leyenda
  const statusList = useMemo(() => {
    return [...new Set(inscripcionesEventosData.map(item => item.status))];
  }, []);
  
  // Colores para cada status
  const statusColors = {
    "Inscrito": "#93C5FD", // Azul claro
    "Confirmado": "#4ADE80", // Verde
    "Cancelado": "#F87171", // Rojo
  };
  
  // Total de inscripciones
  const totalInscripciones = useMemo(() => {
    return processedData.reduce((sum, item) => sum + item.total, 0);
  }, [processedData]);
  
  // Acortar nombres largos para el gráfico
  const shortenName = (name) => {
    // Si el nombre tiene más de 25 caracteres, acortarlo y agregar "..."
    return name.length > 25 ? name.substring(0, 22) + "..." : name;
  };
  
  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h3 className="text-base font-semibold">Inscripciones a Eventos y Cursos</h3>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <FilterDropdown 
            currentValue={selectedTipo} 
            onChange={setSelectedTipo} 
            options={tipoOptions}
            label="Tipo:"
          />
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
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={processedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="nombre"
                angle={-45}
                textAnchor="end"
                tick={(props) => {
                  const { x, y, payload } = props;
                  // Usar versión acortada del nombre para el gráfico
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text 
                        x={0} 
                        y={0} 
                        dy={16} 
                        textAnchor="end" 
                        fill="#4B5563" 
                        fontSize={12}
                        transform="rotate(-45)"
                      >
                        {shortenName(payload.value)}
                      </text>
                    </g>
                  );
                }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
                interval={0}
                height={100}
              />
              <YAxis
                tick={{ fill: "#4B5563", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
              />
              <Tooltip
                formatter={(value, name) => [value.toLocaleString(), name]}
                labelFormatter={(label) => {
                  // Mostrar el nombre completo en el tooltip
                  const item = processedData.find(d => d.nombre === label);
                  return `${item.tipo}: ${label}`;
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{ paddingTop: "50px" }}
              />
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

// Componente para Eventos por Ubicación (solo gráfico de dona)
const EventosUbicacionChart = () => {
  const [selectedUbicacion, setSelectedUbicacion] = useState("Todas");
  
  // Ubicaciones disponibles
  const ubicaciones = useMemo(() => {
    const uniqueUbicaciones = [...new Set(eventosUbicacionData.map(item => item.ubicacion))];
    return ["Todas", ...uniqueUbicaciones];
  }, []);
  
  // Opciones para el filtro
  const ubicacionOptions = useMemo(() => {
    return ubicaciones.map(ubicacion => ({ value: ubicacion, label: ubicacion }));
  }, [ubicaciones]);
  
  // Procesar datos para el gráfico
  const processedData = useMemo(() => {
    if (selectedUbicacion === "Todas") {
      // Agrupar por ubicación para mostrar totales
      const ubicacionesMap = new Map();
      
      eventosUbicacionData.forEach(item => {
        if (!ubicacionesMap.has(item.ubicacion)) {
          ubicacionesMap.set(item.ubicacion, {
            ubicacion: item.ubicacion,
            totalEventos: 0,
            totalParticipantes: 0
          });
        }
        
        const ubicacionData = ubicacionesMap.get(item.ubicacion);
        ubicacionData.totalEventos += item.eventos;
        ubicacionData.totalParticipantes += item.participantesTotal;
      });
      
      return Array.from(ubicacionesMap.values())
        .sort((a, b) => b.totalParticipantes - a.totalParticipantes);
    } else {
      // Filtrar por ubicación seleccionada
      return eventosUbicacionData
        .filter(item => item.ubicacion === selectedUbicacion && item.participantesTotal > 0)
        .sort((a, b) => b.participantesTotal - a.participantesTotal);
    }
  }, [selectedUbicacion]);
  
  // Colores según el tipo de evento/ubicación
  const colors = useMemo(() => generateColors(processedData), [processedData]);
  
  // Total de eventos y participantes
  const totales = useMemo(() => {
    if (selectedUbicacion === "Todas") {
      return {
        eventos: processedData.reduce((sum, item) => sum + item.totalEventos, 0),
        participantes: processedData.reduce((sum, item) => sum + item.totalParticipantes, 0)
      };
    } else {
      return {
        eventos: processedData.reduce((sum, item) => sum + item.eventos, 0),
        participantes: processedData.reduce((sum, item) => sum + item.participantesTotal, 0)
      };
    }
  }, [processedData, selectedUbicacion]);
  
  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h3 className="text-base font-semibold">Eventos por Ubicación</h3>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <FilterDropdown 
            currentValue={selectedUbicacion} 
            onChange={setSelectedUbicacion} 
            options={ubicacionOptions}
            label="Ubicación:"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-sm text-gray-600">Total de eventos</div>
          <div className="text-xl font-bold text-[#41023B]">
            {selectedUbicacion === "Todas" ? 
              totales.eventos.toLocaleString() : 
              totales.eventos.toLocaleString()
            }
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-sm text-gray-600">Total de participantes</div>
          <div className="text-xl font-bold text-[#41023B]">
            {selectedUbicacion === "Todas" ? 
              totales.participantes.toLocaleString() : 
              totales.participantes.toLocaleString()
            }
          </div>
        </div>
      </div>
      
      {/* Gráfico de pastel para distribución de participantes por tipo/ubicación */}
      {processedData.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-4 text-center">
            Distribución de {selectedUbicacion === "Todas" ? "participantes por ubicación" : "participantes por tipo de evento"}
          </h4>
          
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={150}
                fill="#8884d8"
                dataKey={selectedUbicacion === "Todas" ? "totalParticipantes" : "participantesTotal"}
                nameKey={selectedUbicacion === "Todas" ? "ubicacion" : "tipo"}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  value.toLocaleString(),
                  "Participantes"
                ]}
              />
              <Legend 
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

// Componente principal para Estadísticas de Eventos y Cursos
const GraficoEventos = () => {
  return (
    <div>
      <SectionTitle 
        title="Estadísticas de Eventos y Cursos" 
        subtitle="Análisis de participación en los diferentes eventos y cursos" 
      />
      
      <div className="grid grid-cols-1 gap-6">
        <InscripcionesEventosChart />
        <EventosUbicacionChart />
      </div>
    </div>
  );
};

export default GraficoEventos;