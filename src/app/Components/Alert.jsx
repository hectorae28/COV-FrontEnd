import React from 'react'
import { motion } from "framer-motion"
const Alert = ({children,type}) => {
  const optionsType={
    info:"flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 ",
    alert:"flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50",
    success:"flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50",
    warning:"flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50"
  }
  return (
    <motion.div
    initial={{ y: "100%" }}
    animate={{ y: "0%" }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
        className={optionsType[type] || optionsType.alert}
        role="alert"
      >
        <svg
          className="shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <div>
          {children}
        </div>
        </motion.div>
  )
}

export default Alert