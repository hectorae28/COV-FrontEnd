"use client"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, Film, Loader, Play, Tag, User } from "lucide-react"
import { useEffect, useState } from "react"
import ArticlePreview from "./article-preview"
import { parseContentJSON } from "./noticia-converter"
import { organizeElementsIntoRows } from "./utils"

// Función para extraer el ID de un video de YouTube
const extractYoutubeVideoId = (url) => {
  if (!url) return null

  // Patrón para diferentes formatos de URL de YouTube
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)

  return (match && match[2].length === 11) ? match[2] : null
}

// Función para extraer el ID de un video de Vimeo
const extractVimeoVideoId = (url) => {
  if (!url) return null

  // Patrón para diferentes formatos de URL de Vimeo
  const regExp = /vimeo\.com\/(?:video\/)?([0-9]+)/
  const match = url.match(regExp)

  return match ? match[1] : null
}

// Componente para mostrar etiquetas
const TagsDisplay = ({ tags }) => {
  // Si no hay etiquetas, no mostrar nada
  if (!tags || (Array.isArray(tags) && tags.length === 0)) {
    return null;
  }

  // Si es un string (categoría en formato antiguo), mostrar como una etiqueta
  if (typeof tags === 'string') {
    return (
      <div className="flex items-center bg-[#C40180] px-4 py-2 rounded-full shadow-md">
        <Tag className="w-4 h-4 mr-2 text-white" />
        <span className="text-sm font-medium text-white">{tags}</span>
      </div>
    );
  }

  // Si es un array, mostrar múltiples etiquetas
  return (
    <>
      {tags.map((tag, index) => (
        <div key={index} className="flex items-center bg-[#C40180] px-4 py-2 rounded-full shadow-md">
          <Tag className="w-4 h-4 mr-2 text-white" />
          <span className="text-sm font-medium text-white">{tag}</span>
        </div>
      ))}
    </>
  );
};

// Componente mejorado para manejar la portada (imagen o video)
const CoverMedia = ({ type, url, title }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [videoType, setVideoType] = useState('unknown')
  const [videoId, setVideoId] = useState(null)

  // Verificar URL y reiniciar estados cuando cambia
  useEffect(() => {
    setLoading(true)
    setError(false)

    if (!url) {
      setLoading(false);
      return;
    }

    // Detectar si es URL de video independientemente del 'type' proporcionado
    const youtubeId = extractYoutubeVideoId(url)
    const vimeoId = extractVimeoVideoId(url)

    // Si la URL es de YouTube o Vimeo, tratar como video aunque 'type' indique imagen
    if (youtubeId || vimeoId) {
      if (youtubeId) {
        setVideoType('youtube')
        setVideoId(youtubeId)
      } else if (vimeoId) {
        setVideoType('vimeo')
        setVideoId(vimeoId)
      }
      setLoading(false)
      return;
    }

    // Si no es URL de video conocido, respetar el 'type' proporcionado
    if (type === 'video') {
      setVideoType('generic')
      setLoading(false)
    }

    // Para 'type' imagen o valores no especificados, no hacer nada adicional ya que la carga se gestionará en el renderizado de la imagen
  }, [url, type])

  // Si no hay URL, mostrar placeholder
  if (!url) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        {type === 'video' || videoType !== 'unknown' ? (
          <Film className="w-16 h-16 text-gray-300" />
        ) : (
          <div className="text-center">
            <img
              src="/assets/placeholder-image.jpg"
              alt="Imagen no disponible"
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        )}
      </div>
    )
  }

  // Si la URL es de YouTube o Vimeo o el tipo es video, renderizar componente de video
  if (videoType === 'youtube' || videoType === 'vimeo' || type === 'video') {
    // Renderizar iframe para YouTube
    if (videoType === 'youtube' && videoId) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full absolute top-0 left-0"
          title="Video de YouTube"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    }

    // Renderizar iframe para Vimeo
    if (videoType === 'vimeo' && videoId) {
      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          className="w-full h-full absolute top-0 left-0"
          title="Video de Vimeo"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )
    }

    // Vista genérica para otros tipos de video
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/30 transition-colors">
            <Play className="h-10 w-10 text-white fill-white" />
          </div>
          <p className="text-white text-base max-w-lg mx-auto px-4">
            <span className="font-medium block mb-2">Vista previa no disponible</span>
            <span className="text-sm opacity-80 break-all">{url}</span>
          </p>
        </div>
      </div>
    )
  }

  // Para imágenes
  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-full">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>
      )}

      <img
        src={url}
        alt={title || "Portada"}
        className="w-full h-full object-cover"
        onLoad={() => {
          setLoading(false);
        }}
        onError={(e) => {
          console.error("Error al cargar la imagen:", url);
          setLoading(false);
          setError(true);
          e.target.src = "/assets/placeholder-image.jpg";
        }}
      />
    </div>
  )
}

const ArticleFullPreview = ({ article, onBack }) => {
  if (!article) return null

  // Procesar el contenido si está en formato JSON string
  let contentElements = article.contentElements || []

  // Si no hay contentElements pero hay contenido en formato string, intentar parsearlo
  if (!contentElements.length && article.contenido && typeof article.contenido === "string") {
    contentElements = parseContentJSON(article.contenido)
  }

  // Organizar elementos en filas para la visualización
  const elementRows = organizeElementsIntoRows(contentElements)

  // Generar párrafos desde el contenido completo o descripción si no hay elementos de contenido
  const paragraphs =
    contentElements.length === 0 ? (article.fullContent || article.description || "").split("\n\n") : []

  // Determinar si es un video o una imagen
  const isVideo = article.videoUrl || article.portada_tipo === "video"

  // Utilizar la URL correcta para la portada, priorizando imageUrl para visualización inmediata
  const mediaUrl = isVideo
    ? (article.videoUrl || "")
    : (article.imageUrl || article.imagen_portada_url || "/assets/placeholder-image.jpg")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center transition-colors hover:bg-gray-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </motion.button>
      </div>

      {/* Vista previa similar al componente NoticiaDetalle */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-[40vh] md:h-[50vh]">
          <CoverMedia
            type={isVideo ? 'video' : 'image'}
            url={mediaUrl}
            title={article.title || article.titulo}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Etiquetas en la esquina superior derecha */}
          <div className="absolute top-4 right-4 flex flex-wrap gap-2 justify-end max-w-[70%]">
            {/* Usar TagsDisplay para mostrar las etiquetas */}
            <TagsDisplay tags={article.tags || article.category} />
          </div>
        </div>

        <div className="p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
            {article.title || article.titulo}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-[#C40180] mb-8 justify-center">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">{article.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{article.time}</span>
            </div>
            {article.author && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span className="text-sm">{article.author}</span>
              </div>
            )}
          </div>

          {/* Mostrar descripción si existe */}
          {article.description && (
            <div className="mb-8 px-4 py-4 bg-gray-50 border-l-4 border-[#C40180] rounded-r-lg">
              <p className="text-xl text-gray-700 leading-relaxed font-medium italic">
                {article.description}
              </p>
            </div>
          )}

          {/* Contenido - basado en contentElements o contenido existente */}
          <div className="prose prose-lg max-w-none">
            {contentElements.length > 0 ? (
              <ArticlePreview article={article} contentElements={contentElements} elementRows={elementRows} />
            ) : (
              <>
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={
                      index === 0
                        ? "text-xl text-gray-700 leading-relaxed font-medium"
                        : "text-gray-700 leading-relaxed my-4"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleFullPreview