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
import { dataBaseEstd } from "../../Models/Home/GraficosData";
import {
  CustomTooltip,
  FilterDropdown,
  generateColors,
  sortData,
} from "../../PanelControl/Components/Graficos";

const GraficosEstd = () => {
  const [sortType, setSortType] = useState("alphabetical");
  const [selectedBar, setSelectedBar] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const hoveredBarRef = useRef(null);

  const data = useMemo(() => sortData(dataBaseEstd, sortType), [sortType]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1200);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 900);
      setIsTablet(width >= 901 && width < 1200);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

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

  // Formato personalizado para el eje Y
  const formatYAxisLabel = (value) => {
    return value > 2000 ? "2000+" : value.toLocaleString();
  };

  return (
    <div className="bg-white p-4 md:p-6 shadow-md rounded-2xl transition-all duration-300 hover:shadow-lg w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 className="text-lg font-bold text-black">Colegiados por Estado</h3>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <div className="text-sm font-medium text-white bg-gradient-to-t from-[#D7008A] to-[#41023B] px-4 py-1 rounded-full w-full md:w-auto text-center">
            Total: {total.toLocaleString()}
          </div>
          <FilterDropdown currentValue={sortType} onChange={setSortType} />
        </div>
      </div>

      {/* Contenedor con scroll horizontal para móvil */}
      <div className="w-full overflow-x-auto pb-4">
        <div className={`${isMobile ? "min-w-[900px]" : "mx-auto"} md:min-w-0`}>
          <ResponsiveContainer
            width={isMobile || isTablet ? "130%" : "70%"}
            height={320}
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
              barCategoryGap={isMobile ? "20%" : "30%"}
              barGap={0}
              barSize={isMobile ? 80 : 100}
            >
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                tick={{ fill: "#4B5563", fontSize: isMobile ? 12 : 13 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tick={{
                  fill: "#4B5563",
                  fontSize: isMobile ? 12 : 13,
                  formatter: formatYAxisLabel,
                }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
                width={20}
                domain={[0, 3000]}
              />
              {!isMobile && (
                <Tooltip
                  content={
                    <CustomTooltip total={total} isUniversidad={false} />
                  }
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
          <div className="text-xs mt-1">
            Colegiados: {data[selectedBar].value.toLocaleString()}
          </div>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500 text-center md:hidden">
        Desliza horizontalmente para ver todos los estados
      </div>
    </div>
  );
};

export default GraficosEstd;
