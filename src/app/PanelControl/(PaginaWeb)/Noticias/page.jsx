"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import newsItems from "@/app/Models/Home/NoticiasData"
import { motion } from "framer-motion"
import { Search, PlusCircle } from "lucide-react"
import ArticlesList from "@/Components/PaginaWeb/Noticias/articles-list"
import ArticleEditor from "@/Components/PaginaWeb/Noticias/article-editor"
import ArticleFullPreview from "@/app/Components/PaginaWeb/Noticias/article-full-preview.jsx"

const NewsDashboard = () => {
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [fullPreview, setFullPreview] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedArticle({
      ...selectedArticle,
      [name]: value,
    });
  }

  // Cargar noticias al iniciar
  useEffect(() => {
    setArticles(newsItems)
    setFilteredArticles(newsItems)
  }, [])

  // Filtrar artículos cuando cambian los criterios de búsqueda o filtrado
  useEffect(() => {
    let result = [...articles]

    // Filtrar por búsqueda
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (article) => article.title.toLowerCase().includes(query) || article.description.toLowerCase().includes(query),
      )
    }

    // Filtrar por categoría
    if (categoryFilter !== "") {
      result = result.filter((article) => article.category === categoryFilter)
    }

    // Filtrar por fecha
    if (dateFilter !== "") {
      result = result.filter((article) => {
        return article.date.includes(dateFilter)
      })
    }

    setFilteredArticles(result)
  }, [articles, searchQuery, categoryFilter, dateFilter])

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
    setSelectedArticle({ ...article })
    setEditMode(true)
  }

  // Función para ver una vista previa de un artículo
  const handlePreview = (article) => {
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
    const updatedArticles = articles.map((article) => (article.id === updatedArticle.id ? updatedArticle : article))
    setArticles(updatedArticles)
    setEditMode(false)
    setSelectedArticle(null)
  }

  // Obtener categorías únicas para el filtro
  const uniqueCategories = Array.from(new Set(articles.map((article) => article.category))).filter(Boolean)

  // Renderizar lista de artículos
  if (!editMode && !fullPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-18 pb-16 select-none cursor-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
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
          Gestión de contenidos de la sección <span className="font-bold text-[#C40180]">Noticias</span> del sitio web
          del Colegio Odontológico de Venezuela
        </motion.p>
      </motion.div>

          {/* Herramientas de búsqueda y filtrado */}
          <div className="mb-8 bg-white rounded-xl shadow-md p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Buscador */}
              <div className="flex-1">
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

              {/* Filtro por categoría */}
              <div className="w-full md:w-1/4">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="cursor-pointer block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180]"
                >
                  <option value="">Todas las categorías</option>
                  {uniqueCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por fecha */}
              <div className="w-full md:w-1/4">
                <input
                  type="month"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="cursor-pointer block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C40180] focus:border-[#C40180]"
                />
              </div>

              {/* Botón para añadir nueva noticia */}
              <div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    handleEdit({
                      id: Date.now(), // ID temporal
                      title: "Nueva Noticia",
                      description: "Descripción de la noticia",
                      imageUrl: "Seleccione una Imagen",
                      category: "Actualización",
                      fullContent: "Contenido completo de la noticia.\n\nAquí puedes añadir más párrafos.",
                    })
                  }
                  className="cursor-pointer w-full md:w-auto px-6 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-xl shadow-md flex items-center justify-center hover:bg-white"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Nueva Noticia
                </motion.button>
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
            categoryFilter={categoryFilter}
            dateFilter={dateFilter}
            onClearFilters={() => {
              setSearchQuery("")
              setCategoryFilter("")
              setDateFilter("")
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
    handleInputChange={handleInputChange} // Asegúrate de pasar handleInputChange
  />
) : (
  <ArticleFullPreview article={selectedArticle} onBack={handleBackToList} />
)}
    </div>
  )
}

export default NewsDashboard
