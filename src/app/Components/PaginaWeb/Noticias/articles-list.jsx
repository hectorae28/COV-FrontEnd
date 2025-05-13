"use client"
import { motion } from "framer-motion"
import { Eye, Pencil, Trash2, Check, X, Calendar, Clock, RotateCcw } from "lucide-react"

const ArticlesList = ({
  articles,
  confirmDelete,
  onDelete,
  onCancelDelete,
  onEdit,
  onPreview,
  searchQuery,
  categoryFilter,
  dateFilter,
  onClearFilters,
}) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md">
        <p className="text-gray-500">No se encontraron noticias con los criterios de búsqueda.</p>
        {(searchQuery || categoryFilter || dateFilter) && (
          <button
            onClick={onClearFilters}
            className="mt-4 px-4 py-2 bg-[#C40180] text-white rounded-lg inline-flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpiar filtros
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {articles.map((article, index) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
        >
          <div className="md:flex">
            <div className="md:w-1/4 flex-shrink-0">
              <img
                src={
                  process.env.NEXT_PUBLIC_BACK_HOST
                    ? `${process.env.NEXT_PUBLIC_BACK_HOST}${article.imagen_portada_url || article.imageUrl}`
                    : article.imageUrl
                }
                alt={article.title}
                className="h-48 w-full object-cover md:h-full"
                onError={(e) => {
                  e.target.src = "/assets/placeholder-image.jpg"
                }}
              />
            </div>
            <div className="p-6 md:w-3/4">
              <div className="flex items-center mb-2">
                <span className="px-3 py-1 bg-[#C40180]/10 text-[#C40180] text-xs font-medium rounded-full">
                  {article.category || "Sin categoría"}
                </span>
                <div className="flex items-center ml-4 text-gray-500 text-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{article.date}</span>
                  <Clock className="w-3 h-3 ml-3 mr-1" />
                  <span>{article.time}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{article.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{article.description}</p>

              {/* Acciones */}
              <div className="flex space-x-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPreview(article)}
                  className="cursor-pointer px-4 py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center transition-colors hover:bg-blue-100"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Vista Previa
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(article)}
                  className="cursor-pointer px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg flex items-center transition-colors hover:bg-emerald-100"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </motion.button>
                {confirmDelete === article.id ? (
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDelete(article.id)}
                      className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg flex items-center transition-colors"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Confirmar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onCancelDelete}
                      className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center transition-colors hover:bg-gray-200"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(article.id)}
                    className="cursor-pointer px-4 py-2 bg-red-50 text-red-600 rounded-lg flex items-center transition-colors hover:bg-red-100 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default ArticlesList
