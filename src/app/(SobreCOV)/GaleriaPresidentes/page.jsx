"use client";
import React, { useEffect, useState, useRef } from "react";
import LineaTPresi from "../../Components/SobreCOV/LineaTPresi";

export default function Timeline() {
  const [points, setPoints] = useState([]);
  const containerRef = useRef(null);
  const itemsPerRow = 4;

  // Sort the timeline items by year (oldest to newest)
  const sortedItems = [...LineaTPresi].sort((a, b) => a.year - b.year);

  // Function to generate colors with good spacing to avoid repetition
  const generateColorSequence = (count) => {
    // Array of distinct colors - you can add more or change these
    const baseColors = [
      "#4A6FA5", // Blue
      "#FF6B6B", // Red
      "#47B881", // Green
      "#9C27B0", // Purple
      "#FFB400", // Amber
      "#26C6DA", // Cyan
      "#EC407A", // Pink
      "#5E35B1", // Deep Purple
      "#FF7043", // Deep Orange
      "#66BB6A", // Light Green
      "#3949AB", // Indigo
      "#8D6E63", // Brown
    ];

    // Create a sequence that ensures colors don't repeat too often
    // For length <= baseColors.length, we just use the base colors
    if (count <= baseColors.length) {
      return baseColors.slice(0, count);
    }

    // For longer sequences, we'll use a pattern that spaces out similar colors
    const result = [];
    let colorIndex = 0;

    for (let i = 0; i < count; i++) {
      // Use a prime number step to ensure good distribution
      colorIndex = (colorIndex + 5) % baseColors.length;
      result.push(baseColors[colorIndex]);
    }

    return result;
  };

  // Generate color sequence for our timeline items
  const colorSequence = generateColorSequence(sortedItems.length);

  useEffect(() => {
    // Wait a bit for the layout to stabilize
    const timer = setTimeout(() => {
      calculatePositions();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const calculatePositions = () => {
    if (containerRef.current) {
      // Get all point elements
      const pointElements = containerRef.current.querySelectorAll('.timeline-point');
      const pointPositions = [];

      // Collect positions of all points in their display order
      pointElements.forEach((point) => {
        const rect = point.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        pointPositions.push({
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top
        });
      });

      setPoints(pointPositions);
    }
  };

  // Handle window resize to recalculate positions
  useEffect(() => {
    const handleResize = () => {
      calculatePositions();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create a path between two points - straight for horizontal, arched for vertical
  const createPath = (start, end) => {
    // Determine if this is a horizontal or vertical connection
    const isHorizontal = Math.abs(end.x - start.x) > Math.abs(end.y - start.y);

    if (isHorizontal) {
      // For horizontal connections, use straight lines
      return `M ${start.x},${start.y} L ${end.x},${end.y}`;
    } else {
      // For vertical connections (between rows), create an arched curve
      const midX = (start.x + end.x) / 2;

      // Calculate the control point height based on the distance between points
      const controlPointOffset = Math.abs(end.y - start.y) * 0.5; // Adjust this multiplier to control arch height

      // Create a quadratic curve for the arch
      if (start.y < end.y) {
        // Going down (e.g., from 4 to 5 or 8 to 9)
        return `M ${start.x},${start.y} Q ${midX},${start.y + controlPointOffset} ${end.x},${end.y}`;
      } else {
        // Going up (although this shouldn't happen in your zigzag layout)
        return `M ${start.x},${start.y} Q ${midX},${start.y - controlPointOffset} ${end.x},${end.y}`;
      }
    }
  };

  // Organize items in a zigzag pattern for display
  const organizeZigzag = (items) => {
    const result = [];

    for (let i = 0; i < items.length; i += itemsPerRow) {
      const chunk = items.slice(i, i + itemsPerRow);

      // If this is an even-indexed row (0, 2, 4...), keep order left-to-right
      if (Math.floor(i / itemsPerRow) % 2 === 0) {
        result.push(...chunk);
      } else {
        // If this is an odd-indexed row (1, 3, 5...), reverse order (right-to-left)
        result.push(...chunk.reverse());
      }
    }

    return result;
  };

  // Get connection pairs based on the zigzag pattern
  const getConnectionPairs = () => {
    const pairs = [];
    const zigzagIndices = [];

    // Create the zigzag index mapping
    for (let i = 0; i < sortedItems.length; i += itemsPerRow) {
      const rowIndices = Array.from({ length: Math.min(itemsPerRow, sortedItems.length - i) }, (_, j) => i + j);

      if (Math.floor(i / itemsPerRow) % 2 === 0) {
        // Even rows (left to right)
        zigzagIndices.push(...rowIndices);
      } else {
        // Odd rows (right to left)
        zigzagIndices.push(...rowIndices.reverse());
      }
    }

    // Create connection pairs following the zigzag pattern
    for (let i = 0; i < zigzagIndices.length - 1; i++) {
      pairs.push({
        from: zigzagIndices[i],
        to: zigzagIndices[i + 1]
      });
    }

    return pairs;
  };

  // Organize the items in zigzag pattern for display
  const zigzagItems = organizeZigzag(sortedItems);

  // Get connection pairs
  const connectionPairs = getConnectionPairs();

  // Create the final order of colors based on the zigzag pattern
  const zigzagColors = zigzagItems.map((item, index) => {
    // Find the original index of this item in sortedItems
    const originalIndex = sortedItems.findIndex(sortedItem => sortedItem.year === item.year);
    // Return the color from our sequence that corresponds to the original index
    return colorSequence[originalIndex];
  });

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-white text-gray-800">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 text-gray-800 mt-20">
          Línea de Tiempo
        </h1>
        <div
          ref={containerRef}
          className="relative"
          style={{ minHeight: "600px" }}
        >
          {/* SVG for connecting lines */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            <defs>
              {/* Create gradient definitions for each connection */}
              {points.length > 0 && connectionPairs.map((pair, index) => {
                const fromColor = zigzagColors[pair.from];
                const toColor = zigzagColors[pair.to];

                return (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`gradient-${index}`}
                    gradientUnits="userSpaceOnUse"
                    x1={points[pair.from]?.x}
                    y1={points[pair.from]?.y}
                    x2={points[pair.to]?.x}
                    y2={points[pair.to]?.y}
                  >
                    <stop offset="0%" stopColor={fromColor} />
                    <stop offset="100%" stopColor={toColor} />
                  </linearGradient>
                );
              })}
            </defs>

            {points.length > 0 && connectionPairs.map((pair, index) => {
              const fromPoint = points[pair.from];
              const toPoint = points[pair.to];

              if (fromPoint && toPoint) {
                return (
                  <path
                    key={index}
                    d={createPath(fromPoint, toPoint)}
                    fill="none"
                    stroke={`url(#gradient-${index})`}
                    strokeWidth="2"
                    className="transition-all duration-500 ease-in-out"
                  />
                );
              }
              return null;
            })}
          </svg>

          {/* Grid container with zigzag layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {zigzagItems.map((item, index) => {
              // Calcular el desplazamiento vertical basado en la posición dentro de la fila
              const row = Math.floor(index / itemsPerRow); // Índice de la fila actual
              const col = index % itemsPerRow; // Índice de la columna actual
              const isEvenRow = row % 2 === 0; // Determinar si la fila es par o impar

              // Desplazamiento vertical escalonado
              const verticalOffset = isEvenRow
                ? col * 20 // En filas pares, incrementa hacia abajo
                : (itemsPerRow - col - 1) * 20; // En filas impares, decrementa hacia arriba

              return (
                <div
                  key={item.year}
                  className="relative group z-10"
                  style={{ marginTop: `${verticalOffset}px` }} // Aplicar el desplazamiento
                >
                  {/* Punto flotante */}
                  <div
                    className="timeline-point absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full shadow-md z-20 border-2 border-white"
                    style={{ backgroundColor: zigzagColors[index] }}
                    title={item.year}
                    data-index={index}
                  />
                  {/* Tarjeta con información (título y año) */}
                  <div className="bg-white rounded-lg shadow-md p-6 mt-8 border border-gray-200 transition-transform duration-300 group-hover:scale-105 relative z-10">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      <span className="text-sm font-medium text-gray-600">{item.year}</span>
                    </div>
                    {/* Línea decorativa en la parte inferior */}
                    <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden">
                      <div
                        style={{
                          width: '70%',
                          marginLeft: '15%',
                          borderRadius: '4px',
                          height: '100%',
                          backgroundColor: zigzagColors[index]
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}