import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onNextPage,
  onPrevPage,
  isNextDisabled,
  isPrevDisabled,
}) {
  return (
    <motion.div
      className="flex flex-col md:flex-row justify-between items-center mt-6 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
          onClick={onPrevPage}
          disabled={isPrevDisabled}
          className={`p-2 rounded-md ${
            isPrevDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <div className="md:hidden flex items-center justify-center px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm">
          <span className="text-sm font-medium">
            {currentPage} / {totalPages}
          </span>
        </div>

        <div className="hidden md:flex space-x-2">
          {Array.from(
            { length: Math.min(5, totalPages) },
            (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <motion.button
                  key={pageNum}
                  whileHover={{
                    scale: currentPage === pageNum ? 1 : 1.05,
                  }}
                  whileTap={{
                    scale: currentPage === pageNum ? 1 : 0.95,
                  }}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer shadow-sm ${
                    currentPage === pageNum
                      ? "text-white font-medium bg-gray-600"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </motion.button>
              );
            }
          )}
        </div>

        <motion.button
          whileHover={{
            scale: isNextDisabled ? 1 : 1.05,
          }}
          whileTap={{
            scale: isNextDisabled ? 1 : 0.95,
          }}
          onClick={onNextPage}
          disabled={isNextDisabled}
          className={`p-2 rounded-md ${
            isNextDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm cursor-pointer"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}