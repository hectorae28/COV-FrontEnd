"use client";

import { motion } from "framer-motion";

export default function LoadingState() {
  return (
    <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <div className="h-8 w-64 bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
          <div className="h-4 w-96 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto mt-6 md:mt-0">
          <div className="h-10 w-72 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="hidden md:block h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              {[...Array(8)].map((_, i) => (
                <th key={i} className="px-4 py-3.5 text-left">
                  <div className="h-4 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                {[...Array(8)].map((_, j) => (
                  <td key={j} className="px-4 py-4 whitespace-nowrap">
                    <div
                      className="h-4 bg-gray-200 rounded-lg animate-pulse"
                      style={{
                        width: `${Math.floor(Math.random() * 50) + 50}px`,
                      }}
                    ></div>
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-6">
        <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse mb-4 md:mb-0"></div>
        <div className="flex items-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
