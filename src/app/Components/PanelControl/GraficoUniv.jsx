"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CustomTooltip,
  FilterDropdown,
  generateColors,
  sortData,
} from "../../PanelControl/Components/Graficos";
import { universidadData } from "../../Models/Home/GraficosData";

const GraficoUniv = () => {
  const [sortType, setSortType] = useState("alphabetical");
  const [selectedBar, setSelectedBar] = useState(null);
  const [isMobile] = useState(false);
  const [isTablet] = useState(false);
  const hoveredBarRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      select option:hover,
      select option:focus {
        background-color: #10B981 !important;
        color: white !important;
      }
  
      select {
        cursor: pointer;
      }
  
      select:focus {
        outline: none;
        border-color: #10B981;
        box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Aplicar filtros a los datos
  const data = useMemo(() => sortData(universidadData, sortType), [sortType]);

  // Generar colores para cada conjunto de datos
  const colors = useMemo(() => generateColors(data), [data]);

  // Calcular total
  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  // Manejadores de eventos memoizados para evitar recreaciones
  const handleMouseMove = useCallback(
    (dataPoint) => {
      if (
        !isMobile &&
        dataPoint &&
        dataPoint.activeTooltipIndex !== undefined
      ) {
        hoveredBarRef.current = dataPoint.activeTooltipIndex;
      }
    },
    [isMobile]
  );

  const handleMouseLeave = useCallback(() => {
    hoveredBarRef.current = null;
  }, []);

  const handleClick = useCallback(
    (data, index) => {
      setSelectedBar(selectedBar === index ? null : index);
    },
    [selectedBar]
  );

  return (
    <div className="bg-white p-4 md:p-6 shadow-md rounded-2xl transition-all duration-300 hover:shadow-lg w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold text-black">
          Colegiados por Universidad
        </h3>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <div className="text-sm font-medium text-white bg-gradient-to-t from-[#D7008A] to-[#41023B] px-4 py-1 rounded-full w-full md:w-auto text-center">
            Total: {total.toLocaleString()}
          </div>
          <FilterDropdown currentValue={sortType} onChange={setSortType} />
        </div>
      </div>

      {/* Contenedor con scroll horizontal para móvil */}
      <div className="w-full overflow-x-auto pb-4">
        <div className={`${isMobile ? "min-w-[700px]" : "mx-auto"} md:min-w-0`}>
          <ResponsiveContainer
            width={isMobile || isTablet ? "130%" : "50%"}
            height={370}
            className="mx-auto"
          >
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={(data) => {
                if (data && data.activeTooltipIndex !== undefined) {
                  handleClick(data, data.activeTooltipIndex);
                }
              }}
              barCategoryGap={isMobile ? "5%" : "10%"}
              barGap={0}
            >
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                tick={{ fill: "#4B5563", fontSize: 11 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tick={{ fill: "#4B5563", fontSize: 11 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
                width={20}
              />
              {!isMobile && (
                <Tooltip
                  content={<CustomTooltip total={total} isUniversidad={true} />}
                  cursor={{ fill: "rgba(229, 231, 235, 0.3)" }}
                  position={{ x: "auto", y: "auto" }}
                  wrapperStyle={{ pointerEvents: "none" }}
                  allowEscapeViewBox={{ x: true, y: true }}
                  isAnimationActive={false}
                />
              )}
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
                cursor="pointer"
                barSize={isMobile ? 55 : undefined}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      selectedBar === index
                        ? `${colors[index]}`
                        : hoveredBarRef.current === index
                        ? `${colors[index]}E6`
                        : `${colors[index]}CC`
                    }
                    stroke={selectedBar === index ? "#000000" : colors[index]}
                    strokeWidth={selectedBar === index ? 2 : 1}
                    style={
                      selectedBar === index
                        ? {
                            filter:
                              "drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.3))",
                          }
                        : {}
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {selectedBar !== null && (
        <div className="mt-2 text-center text-sm text-[#41023B] font-medium">
          <div>{data[selectedBar].name}</div>
          <div className="text-xs mt-1">{data[selectedBar].fullName}</div>
          <div className="text-xs">
            Colegiados: {data[selectedBar].value.toLocaleString()}
          </div>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500 text-center md:hidden">
        Desliza horizontalmente para ver todas las universidades
      </div>
    </div>
  );
};

export default GraficoUniv;
