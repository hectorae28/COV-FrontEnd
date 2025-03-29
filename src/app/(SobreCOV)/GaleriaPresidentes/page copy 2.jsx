"use client";
import React, { useEffect, useState, useRef } from "react";
import LineaTPresi from "../../Components/SobreCOV/LineaTPresi";
import { motion, useScroll } from "framer-motion";

export default function Timeline() {
  const [points, setPoints] = useState([]);
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const itemsPerRow = 4;
  
  // Obtener el progreso del scroll para animar la línea
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

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

  // Efecto para animar la línea de tiempo con el scroll
  useEffect(() => {
    if (pathRef.current && points.length > 0) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = `${length}`;
      pathRef.current.style.strokeDashoffset = `${length}`;
      
      const handleScroll = () => {
        // Función de ease para suavizar la animación
        const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
        const scrollPercentage = scrollYProgress.get();
        const easedProgress = easeInOutQuad(scrollPercentage);
        const drawLength = length * easedProgress;
        pathRef.current.style.strokeDashoffset = length - drawLength;
      };
      
      const unsubscribe = scrollYProgress.onChange(handleScroll);
      return () => unsubscribe();
    }
  }, [scrollYProgress, points]);

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
    <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-gradient-to-b from-gray-100 to-white text-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-center mb-8 text-gray-800 mt-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Línea de Tiempo
        </motion.h1>
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
              
              {/* Filtro de brillo para la línea principal */}
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feFlood floodColor="#ffffff" floodOpacity="0.3" result="glow" />
                <feComposite in="glow" in2="blur" operator="in" result="coloredBlur" />
                <feComposite in="SourceGraphic" in2="coloredBlur" operator="over" />
              </filter>
            </defs>
            
            {/* Línea de fondo para efecto de profundidad */}
            {points.length > 0 && connectionPairs.map((pair, index) => {
              const fromPoint = points[pair.from];
              const toPoint = points[pair.to];
              if (fromPoint && toPoint) {
                return (
                  <path
                    key={`bg-${index}`}
                    d={createPath(fromPoint, toPoint)}
                    fill="none"
                    stroke="rgba(100,100,100,0.1)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              }
              return null;
            })}
            
            {/* Líneas principales animadas con el scroll */}
            {points.length > 0 && connectionPairs.map((pair, index) => {
              const fromPoint = points[pair.from];
              const toPoint = points[pair.to];
              if (fromPoint && toPoint) {
                return (
                  <path
                    key={index}
                    ref={index === 0 ? pathRef : null}
                    d={createPath(fromPoint, toPoint)}
                    fill="none"
                    stroke={`url(#gradient-${index})`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    className="transition-all duration-500 ease-in-out"
                  />
                );
              }
              return null;
            })}
            
            {/* Líneas de partículas para efecto visual */}
            {points.length > 0 && connectionPairs.map((pair, index) => {
              const fromPoint = points[pair.from];
              const toPoint = points[pair.to];
              if (fromPoint && toPoint) {
                return (
                  <path
                    key={`particle-${index}`}
                    d={createPath(fromPoint, toPoint)}
                    fill="none"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1"
                    strokeDasharray="2 8"
                    className="animate-pulse"
                    style={{ animationDuration: "3s" }}
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
              
              // Calcular el delay para las animaciones
              const delay = (row * itemsPerRow + col) * 0.1;
              
              return (
                <motion.div
                  key={item.year}
                  className="relative group z-10"
                  style={{ marginTop: `${verticalOffset}px` }} // Aplicar el desplazamiento
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay }}
                >
                  {/* Punto flotante con animación */}
                  <motion.div
                    className="timeline-point absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full shadow-md z-20 border-2 border-white"
                    style={{ backgroundColor: zigzagColors[index] }}
                      title={item.year}
                      data-index={index}
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: delay + 0.3,
                      }}
                    >
                      {/* Efecto de pulso alrededor del punto */}
                      <div 
                        className="absolute inset-0 rounded-full opacity-40 animate-ping"
                        style={{ 
                          backgroundColor: zigzagColors[index],
                          animationDuration: "3s", 
                          animationIterationCount: "infinite" 
                        }}
                      ></div>
                    </motion.div>
  
                    {/* Tarjeta con información (título y año) con animación */}
                    <motion.div 
                      className="bg-white rounded-lg shadow-md p-6 mt-8 border border-gray-200 relative z-10"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                        transition: { duration: 0.3 },
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: delay + 0.5 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                        <span 
                          className="text-sm font-medium text-white px-3 py-1 rounded-full"
                          style={{ backgroundColor: zigzagColors[index] }}
                        >
                          {item.year}
                        </span>
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
                      
                      {/* Elementos decorativos adicionales */}
                      <div 
                        className="absolute top-3 right-3 w-2 h-2 rounded-full opacity-70"
                        style={{ backgroundColor: zigzagColors[index] }}
                      ></div>
                      <div 
                        className="absolute top-3 right-7 w-1 h-1 rounded-full opacity-50"
                        style={{ backgroundColor: zigzagColors[index] }}
                      ></div>
                    </motion.div>
                    
                    {/* Línea vertical conectora con animación */}
                    <motion.div
                      className="absolute left-1/2 transform -translate-x-1/2 w-0.5"
                      style={{
                        top: "4px",
                        height: "40px",
                        backgroundColor: zigzagColors[index]
                      }}
                      initial={{ height: 0 }}
                      whileInView={{ height: "40px" }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: delay + 0.4 }}
                    >
                      {/* Partícula animada en la línea vertical */}
                      <motion.div
                        className="absolute w-2 h-2 rounded-full -left-0.75"
                        style={{ backgroundColor: zigzagColors[index] }}
                        animate={{
                          y: [0, 40, 0],
                          opacity: [0, 1, 0],
                          scale: [0.5, 1.2, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: Math.random() * 2,
                        }}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Indicador de scroll mejorado */}
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-gray-500"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <motion.div
                className="w-8 h-14 border-2 border-gray-300 rounded-full flex justify-center p-1 relative overflow-hidden"
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <motion.div
                  className="w-3 h-3 bg-gray-400 rounded-full"
                  animate={{
                    y: [0, 30, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                />
                {/* Efectos de partículas en el indicador de scroll */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-gray-400 rounded-full"
                    style={{
                      left: `${Math.random() * 80 + 10}%`,
                      top: `${Math.random() * 80 + 10}%`,
                    }}
                    animate={{
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </motion.div>
              <p className="mt-2 text-sm font-light">Scroll para explorar</p>
            </motion.div>
          </div>
        </div>
      </main>
    );
  }