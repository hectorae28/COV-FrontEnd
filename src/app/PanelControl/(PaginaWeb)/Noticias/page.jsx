"use client"
import newsItems from "@/app/Models/PanelControl/PaginaWeb/Inicio/NoticiasData"
import { motion } from "framer-motion"
import { ArrowLeft, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Importar componentes
import DeleteConfirmation from "@/app/Components/PaginaWeb/Noticias/DeleteConfirmation"
import NewsList from "@/app/Components/PaginaWeb/Noticias/NewList"
import NewsForm from "@/app/Components/PaginaWeb/Noticias/NewsForm"
import Notification from "@/app/Components/PaginaWeb/Noticias/Notification"
import PreviewSection from "@/app/Components/PaginaWeb/Noticias/PreviewSection"

const NoticiasAdmin = () => {
  const router = useRouter()
  const [news, setNews] = useState([])
  const [currentView, setCurrentView] = useState("list") // list, edit, create
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    date: new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    imageUrl: "",
    description: "",
    category: "Actualización",
    fullContent: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [newsToDelete, setNewsToDelete] = useState(null)
  const [notification, setNotification] = useState(null)

  // Cargar datos de noticias
  useEffect(() => {
    // En un caso real, aquí se haría la llamada a la API
    const fetchNews = async () => {
      // Simulación de carga para mostrar progreso real
      setNews([]) // Inicialmente vacío
      await new Promise((resolve) => setTimeout(resolve, 500))
      setNews(newsItems)
    }

    fetchNews()
  }, [])

  // Mostrar notificación
  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
  }

  // Ocultar notificación
  const hideNotification = () => {
    setNotification(null)
  }

  // Manejar edición de noticia
  const handleEditNews = (item) => {
    setFormData({
      id: item.id,
      title: item.title || "",
      date: item.date || "",
      time: item.time || "",
      imageUrl: item.imageUrl || "",
      description: item.description || "",
      category: item.category || "Actualización",
      fullContent: item.fullContent || item.description || "",
    })
    setCurrentView("edit")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Manejar creación de nueva noticia
  const handleCreateNews = () => {
    setFormData({
      id: Date.now(), // ID temporal
      title: "",
      date: new Date().toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      imageUrl: "",
      description: "",
      category: "Actualización",
      fullContent: "",
    })
    setCurrentView("create")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Confirmar eliminación
  const handleDeleteConfirm = (id) => {
    setNewsToDelete(id)
    setShowDeleteConfirm(true)
  }

  // Procesar eliminación
  const handleDeleteNews = () => {
    setNews((prevNews) => prevNews.filter((item) => item.id !== newsToDelete))
    setShowDeleteConfirm(false)
    setNewsToDelete(null)
    showNotification("Noticia eliminada correctamente", "success")
  }

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
    setNewsToDelete(null)
  }

  // Validar formulario
  const validateForm = () => {
    if (!formData.title.trim()) {
      showNotification("El título es obligatorio", "error")
      return false
    }

    if (!formData.description.trim()) {
      showNotification("La descripción es obligatoria", "error")
      return false
    }

    if (!formData.imageUrl) {
      showNotification("La imagen es recomendada para una mejor visualización", "info")
      // No bloqueamos el envío, solo advertimos
    }

    return true
  }

  // Guardar cambios
  const handleSaveNews = () => {
    if (!validateForm()) return

    setIsSaving(true)

    // Simular llamada a API con un pequeño retraso
    setTimeout(() => {
      if (currentView === "create") {
        // Agregar nueva noticia
        setNews((prevNews) => [formData, ...prevNews])
        showNotification("Noticia creada correctamente", "success")
      } else {
        // Actualizar noticia existente
        setNews((prevNews) => prevNews.map((item) => (item.id === formData.id ? formData : item)))
        showNotification("Noticia actualizada correctamente", "success")
      }

      setIsSaving(false)
      setCurrentView("list")
    }, 800)
  }

  // Cancelar y volver a la lista
  const handleCancel = () => {
    if (formData.title || formData.description || formData.fullContent) {
      if (window.confirm("¿Estás seguro que deseas cancelar? Los cambios no se guardarán.")) {
        setCurrentView("list")
      }
    } else {
      setCurrentView("list")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado de la página */}
        <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center"
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
        >
          Noticias
        </motion.h1>
        <motion.p
          className="mt-4 max-w-full mx-auto text-gray-600 text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Gestión de contenidos de <span className="font-bold text-[#C40180]">Noticias</span> del sitio web del Colegio Odontológico de Venezuela
        </motion.p>
      </motion.div>

        {/* Contenido principal */}
        {currentView === "list" ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6 flex justify-end">
              <button
                onClick={handleCreateNews}
                className="px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-md flex items-center shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crear Noticia
              </button>
            </div>

            <NewsList news={news} onEdit={handleEditNews} onDelete={handleDeleteConfirm} />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Botón de volver */}
            <button
              onClick={handleCancel}
              className="mb-6 flex items-center text-gray-600 hover:text-[#C40180] transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver al listado
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Formulario */}
              <div className="lg:col-span-2 space-y-6">
                <NewsForm
                  formData={formData}
                  setFormData={setFormData}
                  onSave={handleSaveNews}
                  onCancel={handleCancel}
                  isSaving={isSaving}
                />
              </div>

              {/* Vista previa */}
              <div className="space-y-6">
                <PreviewSection news={formData} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Notificación */}
        {notification && (
          <Notification message={notification.message} type={notification.type} onClose={hideNotification} />
        )}

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && <DeleteConfirmation onDelete={handleDeleteNews} onCancel={handleCancelDelete} />}
      </div>
    </div>
  )
}

export default NoticiasAdmin
