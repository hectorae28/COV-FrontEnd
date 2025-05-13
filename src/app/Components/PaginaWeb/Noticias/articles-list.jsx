"use client"
import { motion } from "framer-motion"
import { Calendar, Check, Clock, Eye, Film, Pencil, Play, RotateCcw, Trash2, X } from "lucide-react"
import { useState } from "react"

// Función para extraer el ID de video de YouTube
const extractYoutubeVideoId = (url) => {
  if (!url) return null

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)

  return (match && match[2].length === 11) ? match[2] : null
}

// Componente para mostrar múltiples etiquetas
const TagsList = ({ tags }) => {
  // Si no hay etiquetas o es un string (formato antiguo), mostrar una etiqueta
  if (!tags || tags.length === 0) {
    return (
      <span className="px-3 py-1 bg-[#C40180]/10 text-[#C40180] text-xs font-medium rounded-full">
        Sin etiqueta
      </span>
    );
  }

  // Si es un string (categoría en formato antiguo)
  if (typeof tags === 'string') {
    return (
      <span className="px-3 py-1 bg-[#C40180]/10 text-[#C40180] text-xs font-medium rounded-full">
        {tags}
      </span>
    );
  }

  // Si es un array, mostrar múltiples etiquetas
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-[#C40180]/10 text-[#C40180] text-xs font-medium rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

// Componente ArticleMediaPreview
const ArticleMediaPreview = ({ article }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Función para determinar si una URL es de video
  const isVideoURL = (url) => {
    if (!url) return false;

    const patterns = [
      /youtube\.com\/watch\?v=([^&]+)/,  // YouTube watch
      /youtu\.be\/([^?]+)/,              // YouTube short URL
      /youtube\.com\/embed\/([^?]+)/,    // YouTube embed
      /vimeo\.com\/(?:video\/)?([0-9]+)/ // Vimeo
    ];

    return patterns.some(pattern => pattern.test(url));
  };

  // Determinar si es un video (por tipo explícito, URL de video, o URL que parece video)
  const isExplicitVideo = article.videoUrl || article.portada_tipo === "video";
  const mediaUrl = isExplicitVideo
    ? article.videoUrl || article.imagen_portada_url || article.imageUrl
    : (article.imageUrl || article.imagen_portada_url);

  const isVideo = isExplicitVideo || isVideoURL(mediaUrl);

  // Para videos de YouTube, mostrar thumbnail
  if (isVideo && mediaUrl) {
    const youtubeId = extractYoutubeVideoId(mediaUrl);

    if (youtubeId) {
      // Usar la miniatura de YouTube
      return (
        <div className="relative h-48 w-full md:h-full">
          <img
            src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
            alt={article.title || article.titulo}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="rounded-full bg-white/30 p-3 backdrop-blur-sm">
              <Play className="h-8 w-8 text-white" fill="white" />
            </div>
          </div>
        </div>
      );
    }

    // Para otros videos, mostrar placeholder
    return (
      <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 md:h-full">
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Film className="h-6 w-6 text-white" />
          </div>
          <p className="text-white">Video</p>
        </div>
      </div>
    );
  }

  // Para imágenes
  return (
    <div className="relative h-48 w-full md:h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C40180] border-t-transparent"></div>
        </div>
      )}
      <img
        src={mediaUrl || "/assets/placeholder-image.jpg"}
        alt={article.title || article.titulo}
        className="h-full w-full object-cover"
        onLoad={() => setLoading(false)}
        onError={(e) => {
          setLoading(false);
          setError(true);
          e.target.src = "/assets/placeholder-image.jpg";
        }}
      />
    </div>
  );
};

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
              <ArticleMediaPreview article={article} />
            </div>
            <div className="p-6 md:w-3/4">
              <div className="flex items-center mb-2">
                {/* Reemplazar la categoría única por múltiples etiquetas */}
                <TagsList tags={article.tags || article.category} />

                <div className="flex items-center ml-4 text-gray-500 text-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{article.date}</span>
                  <Clock className="w-3 h-3 ml-3 mr-1" />
                  <span>{article.time}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{article.title || article.titulo}</h3>
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