"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll } from "framer-motion"

export default function Timeline() {
  const containerRef = useRef(null)
  const pathRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Timeline data (from most recent to oldest)
  const timelineData = [
    {
      year: 2023,
      title: "YOUR TEXT",
      description: "Brief description of what happened in 2023",
      icon: "🚀",
      color: "purple",
    },
    {
      year: 2022,
      title: "YOUR TEXT",
      description: "Brief description of what happened in 2022",
      icon: "💡",
      color: "indigo",
    },
    {
      year: 2021,
      title: "YOUR TEXT",
      description: "Brief description of what happened in 2021",
      icon: "🌟",
      color: "blue",
    },
    {
      year: 2020,
      title: "YOUR TEXT",
      description: "Brief description of what happened in 2020",
      icon: "🔍",
      color: "teal",
    },
    {
      year: 2019,
      title: "YOUR TEXT",
      description: "Brief description of what happened in 2019",
      icon: "🌈",
      color: "green",
    },
    {
      year: 2018,
      title: "YOUR TEXT",
      description: "Brief description of what happened in 2018",
      icon: "⚡",
      color: "yellow",
    },
    {
      year: 2017,
      title: "YOUR TEXT",
      description: "Brief description of what happened in 2017",
      icon: "🔮",
      color: "orange",
    },
    {
      year: 2016,
      title: "YOUR TEXT",
      description: "Brief description of what happened in 2016",
      icon: "🎯",
      color: "pink",
    },
    {
      year: 2015,
      title: "YOUR TEXT",
      description: "Brief description of what happened in 2015",
      icon: "✨",
      color: "purple",
    },
    {
      year: 2014,
      title: "YOUR TEXT",
      description: "Brief description of what happened in 2014",
      icon: "🛠️",
      color: "indigo",
    },
    {
      year: 2013,
      title: "YOUR TEXT",
      description: "Brief description of what happened in 2013",
      icon: "📱",
      color: "blue",
    },
    {
      year: 2012,
      title: "YOUR TEXT",
      description: "Brief description of what happened in 2012",
      icon: "🌐",
      color: "teal",
    },
  ]

  // Organize data into rows of 4 elements (changed from 3)
  const rows = []
  for (let i = 0; i < timelineData.length; i += 4) {
    rows.push(timelineData.slice(i, i + 4))
  }

  useEffect(() => {
    // Timeline animation
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength()
      pathRef.current.style.strokeDasharray = `${length}`
      pathRef.current.style.strokeDashoffset = `${length}`

      // Intersection Observer to trigger animation when visible
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        },
        { threshold: 0.1 },
      )

      if (containerRef.current) {
        observer.observe(containerRef.current)
      }
    }
  }, [])

  // Use scroll progress to animate the path with improved tracking
  useEffect(() => {
    const handleScroll = () => {
      if (pathRef.current && containerRef.current) {
        const length = pathRef.current.getTotalLength()
        const scrollPercentage = scrollYProgress.get()

        // Improved tracking with easing
        const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
        const easedProgress = easeInOutQuad(scrollPercentage)

        const drawLength = length * easedProgress
        pathRef.current.style.strokeDashoffset = length - drawLength
      }
    }

    const unsubscribe = scrollYProgress.onChange(handleScroll)
    return () => unsubscribe()
  }, [scrollYProgress])

  const getColorClass = (color) => {
    const colorMap = {
      purple: {
        bg: "bg-purple-400",
        text: "text-purple-600",
        border: "border-purple-400",
        gradient: "from-purple-400",
        shadow: "shadow-purple-400/20",
      },
      indigo: {
        bg: "bg-indigo-400",
        text: "text-indigo-600",
        border: "border-indigo-400",
        gradient: "from-indigo-400",
        shadow: "shadow-indigo-400/20",
      },
      blue: {
        bg: "bg-blue-400",
        text: "text-blue-600",
        border: "border-blue-400",
        gradient: "from-blue-400",
        shadow: "shadow-blue-400/20",
      },
      teal: {
        bg: "bg-teal-400",
        text: "text-teal-600",
        border: "border-teal-400",
        gradient: "from-teal-400",
        shadow: "shadow-teal-400/20",
      },
      green: {
        bg: "bg-green-400",
        text: "text-green-600",
        border: "border-green-400",
        gradient: "from-green-400",
        shadow: "shadow-green-400/20",
      },
      yellow: {
        bg: "bg-yellow-400",
        text: "text-yellow-600",
        border: "border-yellow-400",
        gradient: "from-yellow-400",
        shadow: "shadow-yellow-400/20",
      },
      orange: {
        bg: "bg-orange-400",
        text: "text-orange-600",
        border: "border-orange-400",
        gradient: "from-orange-400",
        shadow: "shadow-orange-400/20",
      },
      pink: {
        bg: "bg-pink-400",
        text: "text-pink-600",
        border: "border-pink-400",
        gradient: "from-pink-400",
        shadow: "shadow-pink-400/20",
      },
    }
    return colorMap[color] || colorMap.purple
  }

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-gradient-to-b from-gray-100 to-white text-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Línea de Tiempo
        </motion.h1>

        <div ref={containerRef} className="timeline-container relative w-full overflow-hidden pb-20">
          {/* SVG for the zigzag line with improved gradient and glow */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ minHeight: `${rows.length * 350}px` }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="20%" stopColor="#818cf8" />
                <stop offset="40%" stopColor="#38bdf8" />
                <stop offset="60%" stopColor="#4ade80" />
                <stop offset="80%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>

              {/* Animated glow filter */}
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feFlood floodColor="#ffffff" floodOpacity="0.3" result="glow" />
                <feComposite in="glow" in2="blur" operator="in" result="coloredBlur" />
                <feComposite in="SourceGraphic" in2="coloredBlur" operator="over" />
              </filter>

              {/* Particle effect */}
              <filter id="particles" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="1" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>

            {/* Background subtle path for depth */}
            <path
              d={generateZigzagPath(rows.length)}
              fill="none"
              stroke="rgba(100,100,100,0.1)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Main animated path with improved tracking */}
            <path
              ref={pathRef}
              d={generateZigzagPath(rows.length)}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              className="transition-all duration-1000"
            />

            {/* Particle effect path */}
            <path
              d={generateZigzagPath(rows.length)}
              fill="none"
              stroke="rgba(100,100,100,0.3)"
              strokeWidth="2"
              strokeDasharray="2 8"
              filter="url(#particles)"
              className="animate-pulse"
              style={{ animationDuration: "3s" }}
            />
          </svg>

          {/* Timeline grid with 4 items per row */}
          <div className="relative z-10 mt-24">
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-40"
                style={{
                  direction: rowIndex % 2 === 0 ? "ltr" : "rtl", // Alternate direction for zigzag
                }}
              >
                {row.map((item, colIndex) => {
                  const delay = (rowIndex * 4 + colIndex) * 0.1
                  const topPosition = rowIndex % 2 === 0 ? "80px" : "40px"
                  const colorClasses = getColorClass(item.color)

                  return (
                    <motion.div
                      key={item.year}
                      className="relative"
                      style={{ direction: "ltr" }} // Restore direction for content
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay }}
                    >
                      {/* Year marker with icon */}
                      <motion.div
                        className="absolute left-1/2 transform -translate-x-1/2"
                        style={{ top: topPosition }}
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
                        <div
                          className={`rounded-full w-16 h-16 flex items-center justify-center ${
                            colorClasses.bg
                          } text-white mb-2 shadow-xl z-20 relative border-4 border-white backdrop-blur-sm`}
                        >
                          <div
                            className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"
                            style={{ animationDuration: "3s", animationIterationCount: "infinite" }}
                          ></div>
                          <span className="text-2xl">{item.icon}</span>
                        </div>
                        <div
                          className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 ${colorClasses.text} font-bold text-xl`}
                        >
                          {item.year}
                        </div>
                      </motion.div>

                      {/* Card with glass effect - lighter colors */}
                      <motion.div
                        className={`bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 mt-40 relative z-10 border border-gray-200 ${colorClasses.shadow}`}
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
                        <div
                          className={`${colorClasses.bg} text-white text-sm font-semibold py-2 px-4 rounded-full inline-block shadow-md mb-3`}
                        >
                          {item.title}
                        </div>
                        <p className="text-gray-600 mt-2">{item.description}</p>

                        {/* Decorative elements */}
                        <div className={`absolute top-0 left-0 w-full h-1 rounded-t-xl ${colorClasses.bg}`}></div>
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gray-300 opacity-70"></div>
                        <div className="absolute top-3 right-7 w-1 h-1 rounded-full bg-gray-300 opacity-50"></div>
                      </motion.div>

                      {/* Vertical line connecting marker with card - improved tracking */}
                      <motion.div
                        className={`absolute left-1/2 transform -translate-x-1/2 w-1 ${colorClasses.bg} opacity-70`}
                        style={{
                          top: Number.parseInt(topPosition) + 16 + "px",
                          height: "90px",
                        }}
                        initial={{ height: 0 }}
                        whileInView={{ height: "90px" }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: delay + 0.4 }}
                      >
                        {/* Animated particles along the vertical line */}
                        <motion.div
                          className={`absolute w-3 h-3 rounded-full ${colorClasses.bg} -left-1`}
                          animate={{
                            y: [0, 90, 0],
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.2, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                            delay: Math.random() * 2,
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Improved scroll indicator with animated particles - lighter colors */}
          <motion.div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-gray-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <motion.div
              className="w-8 h-14 border-2 border-gray-300 rounded-full flex justify-center p-1 relative overflow-hidden"
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            >
              <motion.div
                className="w-3 h-3 bg-gray-400 rounded-full"
                animate={{
                  y: [0, 30, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />

              {/* Particle effects in the scroll indicator */}
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
                    repeat: Number.POSITIVE_INFINITY,
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
  )
}

// Function to generate the SVG zigzag path that follows the timeline
// Improved to handle 4 items per row
function generateZigzagPath(numRows) {
  let path = ""
  const startY = 120
  const rowHeight = 350
  const margin = 80
  const width = 1000 // Adjust based on your container width

  // Control points for curves with improved smoothness
  const controlPointOffset = 100

  for (let i = 0; i < numRows; i++) {
    const y = startY + i * rowHeight

    if (i === 0) {
      // First row: start from left
      path += `M${margin},${y} `
    }

    if (i % 2 === 0) {
      // Even rows: left to right with smoother curves
      const quarter = (width - 2 * margin) / 4

      // First segment
      const x1 = margin + quarter
      path += `C${margin + controlPointOffset},${y} ${x1 - controlPointOffset},${y} ${x1},${y} `

      // Second segment
      const x2 = margin + 2 * quarter
      path += `C${x1 + controlPointOffset},${y} ${x2 - controlPointOffset},${y} ${x2},${y} `

      // Third segment
      const x3 = margin + 3 * quarter
      path += `C${x2 + controlPointOffset},${y} ${x3 - controlPointOffset},${y} ${x3},${y} `

      // Fourth segment
      const x4 = width - margin
      path += `C${x3 + controlPointOffset},${y} ${x4 - controlPointOffset},${y} ${x4},${y} `

      // If not the last row, connect to the next row with a smooth curve
      if (i < numRows - 1) {
        path += `C${x4 + controlPointOffset},${y} ${x4 + controlPointOffset},${y + rowHeight / 2} ${x4},${y + rowHeight} `
      }
    } else {
      // Odd rows: right to left with smoother curves
      const quarter = (width - 2 * margin) / 4

      // First segment
      const x1 = width - margin - quarter
      path += `C${width - margin - controlPointOffset},${y} ${x1 + controlPointOffset},${y} ${x1},${y} `

      // Second segment
      const x2 = width - margin - 2 * quarter
      path += `C${x1 - controlPointOffset},${y} ${x2 + controlPointOffset},${y} ${x2},${y} `

      // Third segment
      const x3 = width - margin - 3 * quarter
      path += `C${x2 - controlPointOffset},${y} ${x3 + controlPointOffset},${y} ${x3},${y} `

      // Fourth segment
      const x4 = margin
      path += `C${x3 - controlPointOffset},${y} ${x4 + controlPointOffset},${y} ${x4},${y} `

      // If not the last row, connect to the next row with a smooth curve
      if (i < numRows - 1) {
        path += `C${x4 - controlPointOffset},${y} ${x4 - controlPointOffset},${y + rowHeight / 2} ${x4},${y + rowHeight} `
      }
    }
  }

  return path
}

