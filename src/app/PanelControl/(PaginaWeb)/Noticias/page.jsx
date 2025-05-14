"use client"
import ArticleFullPreview from "@/app/Components/PaginaWeb/Noticias/article-full-preview"
import newsItems from "@/app/Models/PanelControl/PaginaWeb/Inicio/NoticiasData"
import ArticleEditor from "@/Components/PaginaWeb/Noticias/article-editor"
import ArticlesList from "@/Components/PaginaWeb/Noticias/articles-list"
import { convertToAppFormat } from "@/Components/PaginaWeb/Noticias/noticia-converter"
import { motion } from "framer-motion"
import { PlusCircle, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const NewsDashboard = () => {
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [fullPreview, setFullPreview] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [tagFilter, setCategoryFilter] = useState("")
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSelectedArticle({
      ...selectedArticle,
      [name]: value,
    })
  }

  // Cargar noticias al iniciar y convertirlas al formato de la aplicación
  useEffect(() => {
    const convertedArticles = newsItems.map((article) => {
      const convertedArticle = convertToAppFormat(article);
      if (!convertedArticle.tags && convertedArticle.category) {
        convertedArticle.tags = [convertedArticle.category];
      } else if (!convertedArticle.tags) {
        convertedArticle.tags = [];
      }
      return convertedArticle;
    });

    setArticles(convertedArticles)
    setFilteredArticles(convertedArticles)
  }, [])

  useEffect(() => {
    let result = [...articles]
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      result = result.filter((article) => {
        const title = article.title || article.titulo || ""
        const description = article.description || ""
        return title.toLowerCase().includes(query) || description.toLowerCase().includes(query)
      })
    }

    // Filtrar por etiqueta
    if (tagFilter !== "") {
      result = result.filter((article) => {
        if (Array.isArray(article.tags) && article.tags.length > 0) {
          return article.tags.includes(tagFilter)
        }
        return article.category === tagFilter
      })
    }

    setFilteredArticles(result)
  }, [articles, searchQuery, tagFilter])

  // Función para eliminar un artículo
  const handleDelete = (id) => {
    if (confirmDelete === id) {
      const updatedArticles = articles.filter((article) => article.id !== id)
      setArticles(updatedArticles)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
    }
  }

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setConfirmDelete(null)
  }

  // Función para editar un artículo
  const handleEdit = (article) => {
    if (!article.tags) {
      if (article.category) {
        article.tags = [article.category];
      } else {
        article.tags = [];
      }
    }

    setSelectedArticle({ ...article })
    setEditMode(true)
  }

  // Función para ver una vista previa de un artículo
  const handlePreview = (article) => {
    if (!article.tags) {
      if (article.category) {
        article.tags = [article.category];
      } else {
        article.tags = [];
      }
    }

    setSelectedArticle({ ...article })
    setFullPreview(true)
    setEditMode(false)
  }

  // Función para volver a la lista de artículos
  const handleBackToList = () => {
    setEditMode(false)
    setFullPreview(false)
    setSelectedArticle(null)
  }

  // Función para guardar cambios en un artículo
  const handleSaveArticle = (updatedArticle) => {
    // Determinar el tipo y la URL correcta para la portada
    const isVideo = updatedArticle.portada_tipo === "video" || updatedArticle.videoUrl
    const isLocalImage = !isVideo && updatedArticle.portada_source === "local"
    const isUrlImage = !isVideo && updatedArticle.portada_source === "url"

    let portadaUrl = "";
    if (isVideo) {
      portadaUrl = updatedArticle.videoUrl || "";
    } else {
      portadaUrl = updatedArticle.imageUrl || updatedArticle.imagen_portada_url || "";
    }

    // Crear el objeto NoticiaData con el formato requerido
    const noticiaData = {
      imagen_portada: isLocalImage ? updatedArticle.selectedFile : null,
      titulo: updatedArticle.title || updatedArticle.titulo,
      destacado: updatedArticle.destacado || true,
      contenido: JSON.stringify(updatedArticle.contentElements || []),
      description: updatedArticle.description,
      portada_tipo: isVideo ? "video" : "image",
      portada_source: isUrlImage ? "url" : "local",
      imagen_portada_url: !isVideo ? portadaUrl : null,
      videoUrl: isVideo ? portadaUrl : null,
      tags: updatedArticle.tags || [],
    }

    // Para logging
    console.log("NoticiaData guardada:", noticiaData)
    console.log("Portada URL:", portadaUrl)
    console.log("Tipo:", isVideo ? "video" : "image")
    console.log("Fuente:", isUrlImage ? "url" : "local")
    console.log("Etiquetas:", updatedArticle.tags || [])

    // Convertir al formato de la aplicación para la visualización
    const formattedArticle = convertToAppFormat({
      ...noticiaData,
      id: updatedArticle.id,
      date: updatedArticle.date,
      time: updatedArticle.time,
      tags: updatedArticle.tags || [],
      category: updatedArticle.category,
      imageUrl: !isVideo ? portadaUrl : null,
      imagen_portada_url: !isVideo ? portadaUrl : null,
      videoUrl: isVideo ? portadaUrl : null,
    })

    // Actualizar la lista de artículos
    const updatedArticles = articles.map((article) =>
      (article.id === formattedArticle.id ? formattedArticle : article)
    )

    setArticles(updatedArticles)
    setEditMode(false)
    setSelectedArticle(null)
  }

  // Obtener etiquetas únicas para el filtro
  const getAllTags = () => {
    const tagSet = new Set();

    articles.forEach(article => {
      if (Array.isArray(article.tags) && article.tags.length > 0) {
        article.tags.forEach(tag => tagSet.add(tag));
      }
      else if (article.category) {
        tagSet.add(article.category);
      }
    });

    return Array.from(tagSet).filter(Boolean);
  };

  // Lista de etiquetas únicas
  const uniqueTags = getAllTags();

  // Renderizar lista de artículos
  if (!editMode && !fullPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-18 pb-16 select-none cursor-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-8 md:mb-10 mt-16 md:mt-22"
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
            >
              Sección Noticias
            </motion.h1>
            <motion.p
              className="mt-4 max-w-full mx-auto text-gray-600 text-base md:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Gestión de contenidos de la sección <span className="font-bold text-[#C40180]">Noticias</span> del sitio
              web del Colegio Odontológico de Venezuela
            </motion.p>
          </motion.div>

          {/* Herramientas de búsqueda y filtrado */}
          <div className="mb-8 bg-white rounded-xl shadow-md p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">

              {/* Buscador */}
              <div className="w-full md:w-1/2 lg:w-2/3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180]"
                    placeholder="Buscar noticia..."
                  />
                </div>
              </div>

              <div className="flex w-full md:w-1/2 lg:w-1/3 gap-4">

                {/* Filtro por etiqueta */}
                <div className="flex-1">
                  <select
                    value={tagFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="cursor-pointer block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180]"
                  >
                    <option value="">Todas las etiquetas</option>
                    {uniqueTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botón para añadir nueva noticia */}
                <div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      handleEdit({
                        id: Date.now(),
                        titulo: "Nueva Noticia",
                        description: "Descripción de la noticia",
                        imageUrl: "Seleccione una Imagen",
                        tags: [],
                        destacado: true,
                        fullContent: "Contenido completo de la noticia.\n\nAquí puedes añadir más párrafos.",
                      })
                    }
                    className="cursor-pointer w-full px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-xl shadow-md flex items-center justify-center hover:bg-white whitespace-nowrap"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Nueva Noticia
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de artículos */}
          <ArticlesList
            articles={filteredArticles}
            confirmDelete={confirmDelete}
            onDelete={handleDelete}
            onCancelDelete={handleCancelDelete}
            onEdit={handleEdit}
            onPreview={handlePreview}
            searchQuery={searchQuery}
            categoryFilter={tagFilter}
            onClearFilters={() => {
              setSearchQuery("")
              setCategoryFilter("")
            }}
          />
        </div>
      </div>
    )
  }

  // Renderizar vista de edición o vista previa completa
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-16">
      {editMode ? (
        <ArticleEditor
          article={selectedArticle}
          onSave={handleSaveArticle}
          onCancel={handleBackToList}
          fullPreview={fullPreview}
          toggleFullPreview={() => setFullPreview(!fullPreview)}
          handleInputChange={handleInputChange}
        />
      ) : (
        <ArticleFullPreview article={selectedArticle} onBack={handleBackToList} />
      )}
    </div>
  )
}

export default NewsDashboard