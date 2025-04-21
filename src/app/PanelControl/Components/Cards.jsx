import { AnimatePresence, motion, useAnimation } from "framer-motion";
import React, { useEffect, useState } from "react";
import cards from "../../Models/Home/CardsData";

const Card = ({
  title,
  subtitle,
  description,
  icon,
  accentColor = "indigo",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorMap = {
    indigo: "from-indigo-500 to-purple-500",
    blue: "from-blue-500 to-cyan-400",
    green: "from-green-500 to-emerald-400",
    red: "from-red-500 to-rose-400",
    amber: "from-amber-500 to-yellow-400",
  };

  const gradientColor = colorMap[accentColor] || colorMap.indigo;

  return (
    <motion.div
      className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg overflow-hidden transition-all duration-300 ease-in-out w-full"
      whileHover={{
        y: -5,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className={`absolute top-0 left-0 h-1 bg-gradient-to-r ${gradientColor} transition-all duration-300`}
        animate={{ width: isHovered ? "100%" : "30%" }}
      />

      <div className="flex flex-col items-start text-left">
        <div className="flex items-center mb-4 w-full">
          <motion.div
            className="flex-shrink-0 mr-4"
            animate={{
              rotate: isHovered ? 10 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
            }}
          >
            {icon}
          </motion.div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-4 leading-relaxed text-justify">
          {Array.isArray(description)
            ? description.map((item, index) => (
                <React.Fragment key={index}>{item}</React.Fragment>
              ))
            : description}
        </p>
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const checkIfMobileOrTablet = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };

    checkIfMobileOrTablet();
    window.addEventListener("resize", checkIfMobileOrTablet);

    return () => {
      window.removeEventListener("resize", checkIfMobileOrTablet);
    };
  }, []);

  const handleDragEnd = (e, { offset }) => {
    const swipe = offset.x;
    if (swipe < -50) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    } else if (swipe > 50) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
      );
    }
  };

  if (isMobileOrTablet) {
    return (
      <div className="container mx-auto px-4 sm:px-6">
        <div className="relative">
          <div className="overflow-hidden touch-pan-y">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="w-full"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
              >
                <Card {...cards[currentIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentIndex === index ? "bg-[#41023B]" : "bg-gray-300"
                }`}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
}
