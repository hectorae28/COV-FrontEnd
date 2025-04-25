"use client"

import { FilterDropdown, generateColors, SectionTitle } from "@/app/PanelControl/(Estadisticas)/Estadisticas/page";
import { useMemo, useState } from "react";
import {
  Bar, BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

// Tasa de cambio: 1 USD = 80 BS
const TASA_DOLAR = 80;

// Datos simulados para pagos vs trámite
const pagoTramiteData = [
  { tramite: "Inscripción", metodo: "Transferencia", value: 450 },
  { tramite: "Inscripción", metodo: "Efectivo", value: 120 },
  { tramite: "Inscripción", metodo: "Tarjeta", value: 280 },
  { tramite: "Inscripción", metodo: "Pago Móvil", value: 350 },
  { tramite: "Inscripción", metodo: "Zelle", value: 180 },
  
  { tramite: "Carnet", metodo: "Transferencia", value: 380 },
  { tramite: "Carnet", metodo: "Efectivo", value: 90 },
  { tramite: "Carnet", metodo: "Tarjeta", value: 220 },
  { tramite: "Carnet", metodo: "Pago Móvil", value: 310 },
  { tramite: "Carnet", metodo: "Zelle", value: 150 },
  
  { tramite: "Especialización", metodo: "Transferencia", value: 320 },
  { tramite: "Especialización", metodo: "Efectivo", value: 70 },
  { tramite: "Especialización", metodo: "Tarjeta", value: 180 },
  { tramite: "Especialización", metodo: "Pago Móvil", value: 240 },
  { tramite: "Especialización", metodo: "Zelle", value: 210 },
  
  { tramite: "Renovación", metodo: "Transferencia", value: 410 },
  { tramite: "Renovación", metodo: "Efectivo", value: 95 },
  { tramite: "Renovación", metodo: "Tarjeta", value: 240 },
  { tramite: "Renovación", metodo: "Pago Móvil", value: 320 },
  { tramite: "Renovación", metodo: "Zelle", value: 170 },
  
  { tramite: "Constancia", metodo: "Transferencia", value: 280 },
  { tramite: "Constancia", metodo: "Efectivo", value: 60 },
  { tramite: "Constancia", metodo: "Tarjeta", value: 150 },
  { tramite: "Constancia", metodo: "Pago Móvil", value: 210 },
  { tramite: "Constancia", metodo: "Zelle", value: 130 },
  
  { tramite: "Solvencia", metodo: "Transferencia", value: 340 },
  { tramite: "Solvencia", metodo: "Efectivo", value: 75 },
  { tramite: "Solvencia", metodo: "Tarjeta", value: 190 },
  { tramite: "Solvencia", metodo: "Pago Móvil", value: 260 },
  { tramite: "Solvencia", metodo: "Zelle", value: 160 },
];

// Datos simulados para recaudación mensual
const recaudacionMensualData = [
  // 2023
  { fecha: "Ene 2023", año: 2023, mes: "Ene", tramite: "Inscripción", monto: 45000 },
  { fecha: "Ene 2023", año: 2023, mes: "Ene", tramite: "Carnet", monto: 22000 },
  { fecha: "Ene 2023", año: 2023, mes: "Ene", tramite: "Especialización", monto: 35000 },
  { fecha: "Ene 2023", año: 2023, mes: "Ene", tramite: "Renovación", monto: 18000 },
  { fecha: "Ene 2023", año: 2023, mes: "Ene", tramite: "Constancia", monto: 12000 },
  { fecha: "Ene 2023", año: 2023, mes: "Ene", tramite: "Solvencia", monto: 15000 },
  
  { fecha: "Feb 2023", año: 2023, mes: "Feb", tramite: "Inscripción", monto: 48000 },
  { fecha: "Feb 2023", año: 2023, mes: "Feb", tramite: "Carnet", monto: 25000 },
  { fecha: "Feb 2023", año: 2023, mes: "Feb", tramite: "Especialización", monto: 38000 },
  { fecha: "Feb 2023", año: 2023, mes: "Feb", tramite: "Renovación", monto: 20000 },
  { fecha: "Feb 2023", año: 2023, mes: "Feb", tramite: "Constancia", monto: 13000 },
  { fecha: "Feb 2023", año: 2023, mes: "Feb", tramite: "Solvencia", monto: 16000 },
  
  // Continúa con más meses...
  { fecha: "Mar 2023", año: 2023, mes: "Mar", tramite: "Inscripción", monto: 52000 },
  { fecha: "Mar 2023", año: 2023, mes: "Mar", tramite: "Carnet", monto: 28000 },
  { fecha: "Mar 2023", año: 2023, mes: "Mar", tramite: "Especialización", monto: 42000 },
  { fecha: "Mar 2023", año: 2023, mes: "Mar", tramite: "Renovación", monto: 22000 },
  { fecha: "Mar 2023", año: 2023, mes: "Mar", tramite: "Constancia", monto: 14000 },
  { fecha: "Mar 2023", año: 2023, mes: "Mar", tramite: "Solvencia", monto: 18000 },
  
  // 2024
  { fecha: "Ene 2024", año: 2024, mes: "Ene", tramite: "Inscripción", monto: 55000 },
  { fecha: "Ene 2024", año: 2024, mes: "Ene", tramite: "Carnet", monto: 27000 },
  { fecha: "Ene 2024", año: 2024, mes: "Ene", tramite: "Especialización", monto: 45000 },
  { fecha: "Ene 2024", año: 2024, mes: "Ene", tramite: "Renovación", monto: 23000 },
  { fecha: "Ene 2024", año: 2024, mes: "Ene", tramite: "Constancia", monto: 15000 },
  { fecha: "Ene 2024", año: 2024, mes: "Ene", tramite: "Solvencia", monto: 19000 },
  
  { fecha: "Feb 2024", año: 2024, mes: "Feb", tramite: "Inscripción", monto: 58000 },
  { fecha: "Feb 2024", año: 2024, mes: "Feb", tramite: "Carnet", monto: 30000 },
  { fecha: "Feb 2024", año: 2024, mes: "Feb", tramite: "Especialización", monto: 48000 },
  { fecha: "Feb 2024", año: 2024, mes: "Feb", tramite: "Renovación", monto: 25000 },
  { fecha: "Feb 2024", año: 2024, mes: "Feb", tramite: "Constancia", monto: 16000 },
  { fecha: "Feb 2024", año: 2024, mes: "Feb", tramite: "Solvencia", monto: 20000 },
  
  { fecha: "Mar 2024", año: 2024, mes: "Mar", tramite: "Inscripción", monto: 62000 },
  { fecha: "Mar 2024", año: 2024, mes: "Mar", tramite: "Carnet", monto: 32000 },
  { fecha: "Mar 2024", año: 2024, mes: "Mar", tramite: "Especialización", monto: 52000 },
  { fecha: "Mar 2024", año: 2024, mes: "Mar", tramite: "Renovación", monto: 27000 },
  { fecha: "Mar 2024", año: 2024, mes: "Mar", tramite: "Constancia", monto: 18000 },
  { fecha: "Mar 2024", año: 2024, mes: "Mar", tramite: "Solvencia", monto: 22000 },
];

// Función para formatear montos en Bs y USD
const formatearMonto = (montoBs, mostrarSimbolos = true) => {
  const montoUsd = montoBs / TASA_DOLAR;
  
  if (mostrarSimbolos) {
    return `Bs. ${montoBs.toLocaleString()} / $${montoUsd.toFixed(2)}`;
  } else {
    return `${montoBs.toLocaleString()} / ${montoUsd.toFixed(2)}`;
  }
};

// Componente para Pagos vs Trámite
const PagoTramiteChart = () => {
  const [selectedTramite, setSelectedTramite] = useState("Todos");
  const [moneda, setMoneda] = useState("ambas");
  
  // Opciones para el filtro de moneda
  const monedaOptions = [
    { value: "ambas", label: "Bs / USD" },
    { value: "bs", label: "Bolívares" },
    { value: "usd", label: "Dólares" },
  ];
  
  // Trámites disponibles
  const tramites = useMemo(() => {
    const uniqueTramites = [...new Set(pagoTramiteData.map(item => item.tramite))];
    return ["Todos", ...uniqueTramites];
  }, []);
  
  // Opciones para el filtro
  const tramiteOptions = useMemo(() => {
    return tramites.map(tramite => ({ value: tramite, label: tramite }));
  }, [tramites]);
  
  // Métodos de pago disponibles
  const metodosPago = useMemo(() => {
    return [...new Set(pagoTramiteData.map(item => item.metodo))];
  }, []);
  
  // Procesar datos para el gráfico
  const processedData = useMemo(() => {
    if (selectedTramite === "Todos") {
      // Agrupar por método de pago
      const metodos = {};
      
      metodosPago.forEach(metodo => {
        // Inicializar el total para este método
        metodos[metodo] = {
          metodo,
          total: 0
        };
        
        // Sumar todos los trámites para este método
        pagoTramiteData
          .filter(item => item.metodo === metodo)
          .forEach(item => {
            metodos[metodo].total += item.value;
          });
      });
      
      return Object.values(metodos).sort((a, b) => b.total - a.total);
    } else {
      // Filtrar por trámite seleccionado
      return pagoTramiteData
        .filter(item => item.tramite === selectedTramite)
        .sort((a, b) => b.value - a.value);
    }
  }, [selectedTramite, metodosPago]);
  
  // Colores para cada método de pago
  const colors = useMemo(() => generateColors(processedData), [processedData]);
  
  // Total de pagos para el filtro seleccionado
  const totalPagos = useMemo(() => {
    if (selectedTramite === "Todos") {
      return pagoTramiteData.reduce((sum, item) => sum + item.value, 0);
    } else {
      return pagoTramiteData
        .filter(item => item.tramite === selectedTramite)
        .reduce((sum, item) => sum + item.value, 0);
    }
  }, [selectedTramite]);
  
  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h3 className="text-base font-semibold">Pagos por Método y Trámite</h3>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <FilterDropdown 
            currentValue={selectedTramite} 
            onChange={setSelectedTramite} 
            options={tramiteOptions}
            label="Trámite:"
          />
          <FilterDropdown 
            currentValue={moneda} 
            onChange={setMoneda} 
            options={monedaOptions}
            label="Moneda:"
          />
        </div>
      </div>
      
      <div className="text-sm text-center mb-4">
        <div>Total de pagos: <span className="font-semibold">
          {moneda === "ambas" 
            ? formatearMonto(totalPagos) 
            : moneda === "bs" 
              ? `Bs. ${totalPagos.toLocaleString()}` 
              : `$${(totalPagos / TASA_DOLAR).toFixed(2)}`}
        </span></div>
        <div className="text-xs text-gray-500 mt-1">Tasa de cambio: 1$ = {TASA_DOLAR.toLocaleString()}Bs</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gráfico de barras */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[300px] md:min-w-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={processedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey={selectedTramite === "Todos" ? "metodo" : "metodo"}
                  tick={{ fill: "#4B5563", fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#4B5563", fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                  domain={[0, 'dataMax']}
                  tickFormatter={(value) => {
                    if (moneda === "usd") {
                      return `$${(value / TASA_DOLAR).toFixed(0)}`;
                    } else {
                      return value;
                    }
                  }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (moneda === "ambas") {
                      return [formatearMonto(value, false), "Pagos"];
                    } else if (moneda === "bs") {
                      return [`${value.toLocaleString()}`, "Pagos (Bs)"];
                    } else {
                      return [`${(value / TASA_DOLAR).toFixed(2)}`, "Pagos ($)"];
                    }
                  }}
                  cursor={{ fill: "rgba(229, 231, 235, 0.3)" }}
                />
                <Bar 
                  dataKey={selectedTramite === "Todos" ? "total" : "value"} 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                >
                  {processedData.map((entry, index) => (
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
                data={processedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={selectedTramite === "Todos" ? "total" : "value"}
                nameKey="metodo"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => {
                  if (moneda === "ambas") {
                    return [formatearMonto(value, false), "Pagos"];
                  } else if (moneda === "bs") {
                    return [`${value.toLocaleString()}`, "Pagos (Bs)"];
                  } else {
                    return [`${(value / TASA_DOLAR).toFixed(2)}`, "Pagos ($)"];
                  }
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Componente para Recaudación Mensual
const RecaudacionMensualChart = () => {
  const [periodo, setPeriodo] = useState("todo");
  const [selectedTramite, setSelectedTramite] = useState("Todos");
  const [moneda, setMoneda] = useState("ambas");
  
  // Opciones para el filtro de período
  const periodoOptions = [
    { value: "todo", label: "Todo el período" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
  ];
  
  // Opciones para el filtro de moneda
  const monedaOptions = [
    { value: "ambas", label: "Bs / USD" },
    { value: "bs", label: "Bolívares" },
    { value: "usd", label: "Dólares" },
  ];
  
  // Tramites disponibles
  const tramites = useMemo(() => {
    const uniqueTramites = [...new Set(recaudacionMensualData.map(item => item.tramite))];
    return ["Todos", ...uniqueTramites];
  }, []);
  
  // Opciones para el filtro de trámite
  const tramiteOptions = useMemo(() => {
    return tramites.map(tramite => ({ value: tramite, label: tramite }));
  }, [tramites]);
  
  // Procesar datos para el gráfico
  const processedData = useMemo(() => {
    // Filtrar por período si es necesario
    const filteredByPeriod = periodo === "todo" 
      ? recaudacionMensualData 
      : recaudacionMensualData.filter(item => item.año.toString() === periodo);
    
    // Filtrar por trámite si es necesario
    const filteredData = selectedTramite === "Todos"
      ? filteredByPeriod
      : filteredByPeriod.filter(item => item.tramite === selectedTramite);
    
    // Agrupar por fecha (mes)
    const fechasMap = new Map();
    
    filteredData.forEach(item => {
      if (!fechasMap.has(item.fecha)) {
        fechasMap.set(item.fecha, {
          fecha: item.fecha,
          total: 0,
        });
      }
      
      const fechaData = fechasMap.get(item.fecha);
      
      if (selectedTramite === "Todos") {
        // Si estamos mostrando todos los trámites, agregar cada uno como propiedad
        if (!fechaData[item.tramite]) {
          fechaData[item.tramite] = 0;
        }
        fechaData[item.tramite] += item.monto;
      }
      
      fechaData.total += item.monto;
    });
    
    return Array.from(fechasMap.values());
  }, [periodo, selectedTramite]);
  
  // Calcular totales y promedios
  const estadisticas = useMemo(() => {
    if (processedData.length === 0) return { total: 0, promedio: 0, tendencia: 0 };
    
    const total = processedData.reduce((sum, item) => sum + item.total, 0);
    const promedio = Math.round(total / processedData.length);
    
    let tendencia = 0;
    if (processedData.length >= 2) {
      const ultimoMes = processedData[processedData.length - 1].total;
      const penultimoMes = processedData[processedData.length - 2].total;
      tendencia = ((ultimoMes - penultimoMes) / penultimoMes) * 100;
    }
    
    return { total, promedio, tendencia };
  }, [processedData]);
  
  // Trámites a mostrar en el gráfico (solo si se muestran todos los trámites)
  const tramitesParaGrafico = useMemo(() => {
    if (selectedTramite !== "Todos") return [];
    return tramites.filter(t => t !== "Todos");
  }, [selectedTramite, tramites]);
  
  // Colores para cada trámite
  const tramiteColors = {
    "Inscripción": "#3B82F6", // Azul
    "Carnet": "#10B981", // Verde
    "Especialización": "#F59E0B", // Amarillo
    "Renovación": "#8B5CF6", // Morado
    "Constancia": "#EC4899", // Rosa
    "Solvencia": "#06B6D4", // Cian
  };
  
  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h3 className="text-base font-semibold">Recaudación Mensual</h3>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <FilterDropdown 
            currentValue={periodo} 
            onChange={setPeriodo} 
            options={periodoOptions}
            label="Período:"
          />
          <FilterDropdown 
            currentValue={selectedTramite} 
            onChange={setSelectedTramite} 
            options={tramiteOptions}
            label="Trámite:"
          />
          <FilterDropdown 
            currentValue={moneda} 
            onChange={setMoneda} 
            options={monedaOptions}
            label="Moneda:"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-sm text-gray-600">Total recaudado</div>
          <div className="text-xl font-bold text-[#41023B]">
            {moneda === "ambas" 
              ? formatearMonto(estadisticas.total) 
              : moneda === "bs" 
                ? `Bs. ${estadisticas.total.toLocaleString()}` 
                : `$${(estadisticas.total / TASA_DOLAR).toFixed(2)}`}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-sm text-gray-600">Promedio mensual</div>
          <div className="text-xl font-bold text-[#41023B]">
            {moneda === "ambas" 
              ? formatearMonto(estadisticas.promedio) 
              : moneda === "bs" 
                ? `Bs. ${estadisticas.promedio.toLocaleString()}` 
                : `$${(estadisticas.promedio / TASA_DOLAR).toFixed(2)}`}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-sm text-gray-600">Tendencia último mes</div>
          <div className={`text-xl font-bold ${
            estadisticas.tendencia > 0 
              ? "text-green-600" 
              : estadisticas.tendencia < 0 
                ? "text-red-600" 
                : "text-gray-600"
          }`}>
            {estadisticas.tendencia > 0 ? "↑ " : estadisticas.tendencia < 0 ? "↓ " : ""}
            {Math.abs(estadisticas.tendencia).toFixed(1)}%
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 text-center mb-4">
        Tasa de cambio: 1$ = {TASA_DOLAR.toLocaleString()}Bs
      </div>
      
      <div className="w-full overflow-x-auto">
        <div className="min-w-[500px] md:min-w-0">
          <ResponsiveContainer width="100%" height={300}>
            {selectedTramite === "Todos" ? (
              <BarChart
                data={processedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="fecha"
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
                  tickFormatter={(value) => {
                    if (moneda === "usd") {
                      return `$${(value / TASA_DOLAR).toFixed(0)}`;
                    } else if (moneda === "bs") {
                      return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value;
                    } else {
                      return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value;
                    }
                  }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (moneda === "ambas") {
                      return [formatearMonto(value, false), name];
                    } else if (moneda === "bs") {
                      return [`${value.toLocaleString()}`, name];
                    } else {
                      return [`$${(value / TASA_DOLAR).toFixed(2)}`, name];
                    }
                  }}
                />
                <Legend />
                {tramitesParaGrafico.map((tramite) => (
                  <Bar 
                    key={tramite} 
                    dataKey={tramite} 
                    stackId="a" 
                    fill={tramiteColors[tramite] || "#8884d8"} 
                    name={tramite}
                  />
                ))}
              </BarChart>
            ) : (
              <LineChart
                data={processedData}
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
                  interval={0}
                  height={60}
                />
                <YAxis
                  tick={{ fill: "#4B5563", fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                  tickFormatter={(value) => {
                    if (moneda === "usd") {
                      return `$${(value / TASA_DOLAR).toFixed(0)}`;
                    } else if (moneda === "bs") {
                      return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value;
                    } else {
                      return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value;
                    }
                  }}
                />
                <Tooltip
                  formatter={(value) => {
                    if (moneda === "ambas") {
                      return [formatearMonto(value, false), selectedTramite];
                    } else if (moneda === "bs") {
                      return [`${value.toLocaleString()}`, `${selectedTramite} (Bs)`];
                    } else {
                      return [`${(value / TASA_DOLAR).toFixed(2)}`, `${selectedTramite} ($)`];
                    }
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  name={selectedTramite}
                  stroke="#41023B"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#41023B", stroke: "#41023B" }}
                  activeDot={{ r: 6, fill: "#D7008A", stroke: "#41023B" }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Componente principal para Estadísticas Financieras
const GraficoFinanciero = () => {
  return (
    <div>
      <SectionTitle 
        title="Estadísticas Financieras y Administrativas" 
        subtitle="Análisis de pagos y recaudación por trámites" 
      />
      <RecaudacionMensualChart />
        <PagoTramiteChart />
    </div>
  );
};

export default GraficoFinanciero;