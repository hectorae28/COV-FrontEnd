"use client"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react"
import ArticlePreview from "./article-preview"
import { organizeElementsIntoRows } from "./utils"

const ArticleFullPreview = ({ article, onBack }) => {
  if (!article) return null

  // Generar párrafos desde el contenido completo o descripción
  const paragraphs = (article.fullContent || article.description || "").split("\n\n")

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
          <img
            src={
              process.env.NEXT_PUBLIC_BACK_HOST
                ? `${process.env.NEXT_PUBLIC_BACK_HOST}${article.imagen_portada_url || article.imageUrl}`
                : article.imageUrl
            }
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/assets/placeholder-image.jpg"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Categoría en la esquina superior derecha */}
          {article.category && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center bg-[#C40180] px-4 py-2 rounded-full shadow-md">
                <Tag className="w-4 h-4 mr-2 text-white" />
                <span className="text-sm font-medium text-white">{article.category}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">{article.title}</h1>

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

          {/* Contenido - basado en contentElements o contenido existente */}
          <div className="prose prose-lg max-w-none">
            {article.contentElements ? (
              <ArticlePreview
                article={article}
                contentElements={article.contentElements}
                elementRows={organizeElementsIntoRows(article.contentElements)}
              />
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
