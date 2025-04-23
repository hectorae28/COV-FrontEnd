"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Sector,
    Tooltip,
} from "recharts";
import {
    chartSizes,
    dataGroups,
    groupTitles,
} from "../../Models/Home/GraficosData";
import {
    FilterDropdown,
    generateColors,
} from "../../PanelControl/Components/Graficos";

const GraficosDonutMultiple = () => {
  const [sortType, setSortType] = useState("highest");
  const [selectedSlice, setSelectedSlice] = useState({
    group: null,
    index: null,
  });
  const [isMobile] = useState(false);

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

  // Ordenar datos según el filtro seleccionado
  const sortData = (data, sortType) => {
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

  // Aplicar filtros a todos los grupos de datos
  const sortedData = useMemo(() => {
    const result = {};
    Object.keys(dataGroups).forEach((key) => {
      result[key] = sortData(dataGroups[key], sortType);
    });
    return result;
  }, [sortType]);

  // Generar colores para cada grupo
  const colors = useMemo(() => {
    const result = {};
    Object.keys(dataGroups).forEach((key) => {
      result[key] = generateColors(dataGroups[key]);
    });
    return result;
  }, []);

  // Calcular totales para cada grupo
  const totals = useMemo(() => {
    const result = {};
    Object.keys(dataGroups).forEach((key) => {
      result[key] = dataGroups[key].reduce((sum, item) => sum + item.value, 0);
    });
    return result;
  }, []);

  // Renderizado activo para el sector seleccionado
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#000"
          strokeWidth={2}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 4}
          outerRadius={innerRadius - 1}
          fill={fill}
        />
      </g>
    );
  };

  // Componente personalizado para el tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const groupKey = payload[0].name;
      const total = totals[groupKey];

      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Colegiados:</span>{" "}
            {data.value.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {((data.value / total) * 100).toFixed(2)}% del total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 md:p-6 shadow-md rounded-2xl transition-all duration-300 hover:shadow-lg w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold text-black">
          Distribución de Colegiados
        </h3>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <FilterDropdown currentValue={sortType} onChange={setSortType} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {Object.keys(sortedData).map((groupKey) => (
          <div key={groupKey} className="p-">
            <h4 className="text-center font-medium mb-2">
              {groupTitles[groupKey]}
            </h4>
            <div className="text-center text-xs mb-2">
              Total: {totals[groupKey].toLocaleString()}
            </div>

            <div className="w-full h-[200px] md:h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={
                      selectedSlice.group === groupKey
                        ? selectedSlice.index
                        : undefined
                    }
                    activeShape={renderActiveShape}
                    data={sortedData[groupKey]}
                    cx="50%"
                    cy="50%"
                    innerRadius={chartSizes[groupKey].innerRadius}
                    outerRadius={chartSizes[groupKey].outerRadius}
                    dataKey="value"
                    paddingAngle={2}
                    onClick={(_, index) => {
                      if (
                        selectedSlice.group === groupKey &&
                        selectedSlice.index === index
                      ) {
                        setSelectedSlice({ group: null, index: null });
                      } else {
                        setSelectedSlice({ group: groupKey, index });
                      }
                    }}
                    isAnimationActive={false}
                    nameKey={groupKey}
                    cursor="pointer"
                  >
                    {sortedData[groupKey].map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[groupKey][index]}
                        stroke={
                          selectedSlice.group === groupKey &&
                          selectedSlice.index === index
                            ? "#000000"
                            : colors[groupKey][index]
                        }
                        strokeWidth={
                          selectedSlice.group === groupKey &&
                          selectedSlice.index === index
                            ? 2
                            : 1
                        }
                      />
                    ))}
                  </Pie>
                  {!isMobile && <Tooltip content={<CustomTooltip />} />}
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap justify-center gap-1 mt-2">
              {sortedData[groupKey].map((entry, index) => (
                <div
                  key={`legend-${groupKey}-${index}`}
                  className={`flex items-center px-2 py-1 rounded-full text-xs cursor-pointer transition-all ${
                    selectedSlice.group === groupKey &&
                    selectedSlice.index === index
                      ? "bg-gray-200 shadow-md"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    if (
                      selectedSlice.group === groupKey &&
                      selectedSlice.index === index
                    ) {
                      setSelectedSlice({ group: null, index: null });
                    } else {
                      setSelectedSlice({ group: groupKey, index });
                    }
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: colors[groupKey][index] }}
                  />
                  <span className="mr-1">{entry.name}</span>
                  <span className="text-gray-500">
                    ({((entry.value / totals[groupKey]) * 100).toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>

            {selectedSlice.group === groupKey &&
              selectedSlice.index !== null && (
                <div className="mt-2 text-center text-xs text-[#41023B]">
                  <div className="font-medium">
                    {sortedData[groupKey][selectedSlice.index].name}:
                  </div>
                  <div>
                    {sortedData[groupKey][
                      selectedSlice.index
                    ].value.toLocaleString()}{" "}
                    colegiados
                  </div>
                  <div>
                    (
                    {(
                      (sortedData[groupKey][selectedSlice.index].value /
                        totals[groupKey]) *
                      100
                    ).toFixed(1)}
                    %)
                  </div>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraficosDonutMultiple;
