"use client";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LineaTPresi from "../../Components/SobreCOV/LineaTPresi";

// Gradient colors for visual variety
const GRADIENT_COLORS = [
  "from-[#C40180] to-[#590248]",
  "from-purple-600 to-blue-500",
  "from-pink-500 to-orange-400",
  "from-teal-400 to-emerald-500",
  "from-blue-400 to-cyan-600",
  "from-yellow-400 to-red-600"
];

// Image placeholder icon
const ImageOffIcon = ({ color = "#000000" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="opacity-60"
  >
    <line x1="2" y1="2" x2="22" y2="22" />
    <path d="M10.41 10.41a2 2 0 1 1-2.83-2.83" />
    <line x1="13.5" y1="13.5" x2="6" y2="21" />
    <line x1="18" y1="12" x2="21" y2="15" />
    <path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59" />
    <path d="M21 15V5a2 2 0 0 0-2-2H9" />
  </svg>
);

const Modal = ({ item, cardColor, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className={`p-6 sm:p-8`}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="h-64 md:h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOffIcon />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <div className={`inline-block px-4 py-2 rounded-lg text-white bg-gradient-to-br ${cardColor} mb-4`}>
                <h2 className="text-xl font-bold">{item.title}</h2>
                <p className="text-sm">Período: {item.year}</p>
              </div>
              
              {item.description && (
                <div className="prose max-w-none">
                  <p className="text-gray-700">{item.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TimelineItem = React.memo(({ item, index, isActive, isLastItem, itemsPerRow, onItemClick }) => {
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { once: false, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get gradient color based on index
  const cardColor = GRADIENT_COLORS[index % GRADIENT_COLORS.length];

  // Calculate shadow color for active items
  const getShadowColor = useCallback(() => {
    if (!isActive) return "";

    const colorMap = {
      purple: "102, 126, 234",
      pink: "236, 72, 153",
      teal: "45, 212, 191",
      blue: "59, 130, 246"
    };

    let colorValue = "196, 1, 128";

    for (const [key, value] of Object.entries(colorMap)) {
      if (cardColor.includes(key)) {
        colorValue = value;
        break;
      }
    }

    return `0 0 0 6px rgba(${colorValue}, 0.2)`;
  }, [isActive, cardColor]);

  // Common animation and style classes
  const isActiveOrHovered = isActive || isHovered;
  const hoverEffectClasses = isActiveOrHovered ? "shadow-2xl translate-y-[-5px] sm:translate-y-[-10px]" : "";

  // Determine if this item should show an arrow (only on larger screens)
  const showArrow = windowWidth >= 768 && index % itemsPerRow !== itemsPerRow - 1 && index !== itemsPerRow - 1;

  return (
    <motion.div
      ref={itemRef}
      className={`relative pt-16 transition-all duration-100 ${isActive ? "scale-105 z-30" : "z-20"}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } : { opacity: 0, y: 50 }}
    >
      {/* Timeline node/dot */}
      <motion.div
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-white z-30 shadow-lg bg-gradient-to-br ${cardColor}`}
        style={{ boxShadow: getShadowColor() }}
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
          transition: { duration: 0.5, repeat: isActive ? Number.POSITIVE_INFINITY : 0, repeatType: "loop" }
        }}
      />

      {/* Simple arrow connector to next item (only within the same row) */}
      {showArrow && isActive && (
        <motion.div
          className="absolute top-0 left-[calc(50%+16px)] h-2 z-20"
          style={{ width: "calc(100% - 16px)" }}
          initial={{ width: 0 }}
          animate={{ width: "calc(100% - 16px)" }}
          transition={{ duration: 0.2 }} // Faster animation
        >
          <div className={`h-full w-full flex items-center`}>
            <div className={`h-0.5 w-full bg-gradient-to-r ${cardColor}`}></div>
            <div
              className={`w-0 h-0 border-t-4 border-b-4 border-l-6 border-r-0 border-t-transparent border-b-transparent border-l-[#C40180]`}
              style={{ marginLeft: "-1px" }}
            ></div>
          </div>
        </motion.div>
      )}

      {/* Card with president info */}
      <motion.div
        className={`relative overflow-hidden bg-white rounded-xl border-0 shadow-lg transition-all duration-300 ease-out h-full ${hoverEffectClasses} cursor-pointer`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{
          y: -10,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
        }}
        onClick={() => onItemClick(item, cardColor)}
      >
        {/* Decorative background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${cardColor} opacity-5 transition-all duration-300 ease-out ${isActiveOrHovered ? 'opacity-20 scale-110' : 'scale-100'}`}
        />

        {/* Image container - now full width and height */}
        <div className="relative h-48 w-full bg-gray-100">
          {item.image ? (
            <motion.img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOffIcon />
            </div>
          )}
        </div>

        {/* Text content */}
        <div className="relative p-3 sm:p-4 flex flex-col h-full">
          <div className="flex items-start">
            <div
              className={`flex items-center justify-center mb-2 sm:mb-3 p-2 rounded-lg text-white bg-gradient-to-br ${cardColor} shadow-md transition-all duration-300 ease-out ${isActiveOrHovered ? "scale-110 rotate-2" : "rotate-0"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-black">Período: {item.year}</h3>
              <div
                className={`h-0.5 w-0 bg-gradient-to-r ${cardColor} mt-1 transition-all duration-300 ease-out ${isActiveOrHovered ? "w-full" : ""}`}
              ></div>
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-sm sm:text-base font-medium text-center text-gray-800">{item.title}</h4>
            {item.description && <p className="mt-1 text-gray-600 text-xs line-clamp-2">{item.description}</p>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

TimelineItem.displayName = "TimelineItem";

export default function Timeline() {
  const timelineRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");

  // Sort timeline items by year (oldest to newest)
  const sortedItems = useMemo(() => [...LineaTPresi].sort((a, b) => a.year - b.year), []);

  // Scroll animation setup
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"]
  });

  // Transform scroll progress to horizontal progress bar
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Update active item based on scroll position
  useEffect(() => {
    const handleScrollProgress = (value) => {
      const adjustedValue = value * 1;
      const newActiveIndex = Math.min(Math.floor(adjustedValue * sortedItems.length), sortedItems.length - 1);

      if (newActiveIndex !== activeIndex && newActiveIndex >= 0) {
        setActiveIndex(newActiveIndex);
      }
    };

    const unsubscribe = scrollYProgress.onChange(handleScrollProgress);
    return () => unsubscribe();
  }, [scrollYProgress, sortedItems.length, activeIndex]);

  // Current active item for header display
  const activeItem = useMemo(() => (activeIndex >= 0 ? sortedItems[activeIndex] : null), [activeIndex, sortedItems]);

  // Responsive grid layout
  const getItemsPerRow = () => {
    if (typeof window === "undefined") return 5;

    const width = window.innerWidth;
    if (width >= 1280) return 5;
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    return 2;
  };

  const itemsPerRow = getItemsPerRow();

  const handleItemClick = (item, color) => {
    setSelectedItem(item);
    setSelectedColor(color);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setSelectedColor("");
  };

  return (
    <main
      ref={timelineRef}
      className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-800 py-16 relative overflow-hidden"
    >
      {/* Fixed header with progress bar */}
      <div className="fixed top-16 left-0 w-full backdrop-blur-lg py-4 z-50">
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text mb-2">
            Galeria de Presidentes
          </h1>

          {/* Simple chronological indicator */}
          <div className="flex items-center justify-center mt-2 mb-2">
            <div className="flex items-center">

            </div>
          </div>

          {/* Current president indicator */}
          {activeItem && (
            <motion.div
              className="text-center mt-2 font-medium text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={activeItem.year}
              transition={{ duration: 0.3 }}
            >
              <span className="bg-gradient-to-r from-[#C40180] to-[#590248] px-3 py-0.5 rounded-full inline-block text-sm">
                {activeItem.title} • {activeItem.year}
              </span>
            </motion.div>
          )}

          {/* Progress bar */}
          <div className="relative mt-4">
            <div className="absolute left-0 top-1/2 h-1 bg-gray-200 w-full -mt-px z-0"></div>
            <motion.div
              className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-[#C40180] to-[#590248] -mt-px z-10"
              style={{ scaleX, transformOrigin: "left", width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* Timeline grid */}
      <div className="max-w-full mx-auto px-4 mt-70 md:px-18 md:mb-40">
        <div className="relative">
          <div className="space-y-20 escalera-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative z-20">
            {sortedItems.map((item, index) => {
              const columnIndex = index % itemsPerRow;

              return (
                <div
                  key={`${item.year}-${item.title}`}
                  className="escalera-item"
                  style={{ transform: `translateY(${columnIndex * 70}px)` }}
                >
                  <TimelineItem
                    item={item}
                    index={index}
                    isActive={index === activeIndex}
                    isLastItem={index === sortedItems.length - 1}
                    itemsPerRow={itemsPerRow}
                    onItemClick={handleItemClick}
                  />
                </div>
              );
            })}
          </div>

          {/* Vertical timeline arrows between rows - only on larger screens */}
          {window.innerWidth >= 768 && 
            Array.from({ length: Math.ceil(sortedItems.length / itemsPerRow) - 1 }).map((_, rowIndex) => {
              const lastColumnIndex = Math.min(itemsPerRow - 1, sortedItems.length - rowIndex * itemsPerRow - 1);
              const firstColumnIndex = 0;
              const isRowActive = Math.floor(activeIndex / itemsPerRow) === rowIndex;

              return (
                <div
                  key={`row-connector-${rowIndex}`}
                  className="absolute z-10"
                  style={{
                    top: `${70 * lastColumnIndex + 195 + rowIndex * 316}px`,
                    left: `${100 / (itemsPerRow * 2) + (100 / itemsPerRow) * lastColumnIndex}%`,
                    height: `${120 - 70 * lastColumnIndex + 70 * firstColumnIndex}px`,
                    width: "2px"
                  }}
                >
                  {isRowActive && (
                    <motion.div
                      className="h-full w-full"
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="h-full w-full bg-gradient-to-b from-[#C40180] to-[#590248]"></div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rotate-90">
                        <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-r-0 border-t-transparent border-b-transparent border-l-[#590248]"></div>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Modal for selected item */}
      <AnimatePresence>
        {selectedItem && (
          <Modal 
            item={selectedItem} 
            cardColor={selectedColor} 
            onClose={closeModal} 
          />
        )}
      </AnimatePresence>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -z-10 opacity-20">
        <svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C40180" />
              <stop offset="100%" stopColor="#590248" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="40" fill="none" stroke="url(#grad)" strokeWidth="1" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="url(#grad)" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="url(#grad)" strokeWidth="0.25" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-20">
        <svg width="300" height="300" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C40180" />
              <stop offset="100%" stopColor="#590248" />
            </linearGradient>
          </defs>
          <path d="M10,30 Q50,5 90,30 T90,70 Q50,95 10,70 T10,30" fill="none" stroke="url(#grad2)" strokeWidth="0.5" />
        </svg>
      </div>
    </main>
  );
}