"use client";
import newsItems from "@/app/Models/PanelControl/PaginaWeb/Inicio/NoticiasData";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, ChevronRight, Clock, Filter, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Componente para cada tarjeta de noticia
const NewsCard = ({ news, index, onReadMore }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer"
      onClick={() => onReadMore(news)}
    >
      <div className="relative overflow-hidden">
        <img
          src={`${process.env.NEXT_PUBLIC_BACK_HOST}${news.imagen_portada_url || news.imageUrl}`}
          alt={news.titulo || news.title}
          className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.target.src = "/assets/placeholder-image.jpg";
          }}
        />
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-2 text-xs">
          <Calendar className="w-3 h-3 text-[#C40180]" />
          <span>
            {news.created_at
              ? new Date(news.created_at).toLocaleDateString()
              : news.date}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {news.titulo || news.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {news.contenido || news.description}
        </p>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            <span>
              {news.created_at
                ? new Date(news.created_at).toLocaleTimeString()
                : news.time}
            </span>
          </div>
          <motion.button
            whileHover={{ x: 5 }}
            className="flex items-center text-sm font-medium text-[#C40180] group"
            onClick={(e) => {
              e.stopPropagation();
              onReadMore(news);
            }}
          >
            Leer más
            <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Componente de noticia destacada (para la primera noticia)
const FeaturedNewsCard = ({ news, onReadMore }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="col-span-1 md:col-span-2 bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 mb-8 cursor-pointer"
      onClick={() => onReadMore(news)}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 relative">
          <img
            src={`${process.env.NEXT_PUBLIC_BACK_HOST}${news.imagen_portada_url || news.imageUrl}`}
            alt={news.titulo || news.title}
            className="w-full h-64 md:h-full object-cover"
            onError={(e) => {
              e.target.src = "/assets/placeholder-image.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r" />
        </div>

        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-sm mb-4">
              <div className="flex items-center text-[#C40180]">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="font-medium">
                  {news.created_at
                    ? new Date(news.created_at).toLocaleDateString()
                    : news.date}
                </span>
              </div>
              <span className="text-gray-400">|</span>
              <div className="flex items-center text-[#C40180]">
                <Clock className="w-4 h-4 mr-1" />
                <span className="font-medium">
                  {news.created_at
                    ? new Date(news.created_at).toLocaleTimeString()
                    : news.time}
                </span>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {news.titulo || news.title}
            </h2>

            <p className="text-gray-600 mb-6 line-clamp-4">
              {news.contenido || news.description}
            </p>
          </div>

          <motion.button
            whileHover={{ x: 5 }}
            onClick={(e) => {
              e.stopPropagation();
              onReadMore(news);
            }}
            className="flex items-center text-[#C40180] font-medium group self-start px-4 py-2 border border-[#C40180] rounded-full hover:bg-[#C40180]/5 transition-colors"
          >
            Leer artículo completo
            <ArrowUpRight className="w-4 h-4 ml-2 group-hover:ml-3 transition-all" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Componente principal de Noticias
const Noticias = () => {
  const router = useRouter();
  const [allNews, setAllNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [currentPage, setCurrentPage] = useState(1);

  // Categorías modificadas
  const categories = ["Todas", "Actualización", "Podcast", "Revista", "Conferencias"];

  useEffect(() => {
    // En un proyecto real, aquí se haría la llamada a la API
    // por ahora usamos los datos de NoticiasData.jsx
    setAllNews(newsItems);
    setFilteredNews(newsItems);
  }, []);

  // Función para navegar a la página de detalle de la noticia
  const handleReadMore = (news) => {
    router.push(`/NoticiaDetalle/${news.id}`);
  };

  // Función para filtrar noticias
  const handleFilter = (category) => {
    setActiveCategory(category);
    setCurrentPage(1); // Resetear a la primera página al cambiar filtros

    if (category === "Todas") {
      setFilteredNews(allNews);
    } else {
      // Aquí se implementaría la lógica real de filtrado por categoría
      // Este es solo un ejemplo simulado basado en el título
      const filtered = allNews.filter(news =>
        (news.category || "").toLowerCase() === category.toLowerCase()
      );
      setFilteredNews(filtered.length > 0 ? filtered : []);
    }
  };

  // Función para buscar noticias
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Resetear a la primera página al buscar

    if (value.trim() === "") {
      handleFilter(activeCategory);
      return;
    }

    const searched = allNews.filter(news =>
      (news.title || news.titulo).toLowerCase().includes(value.toLowerCase()) ||
      (news.description || news.contenido).toLowerCase().includes(value.toLowerCase())
    );

    setFilteredNews(searched);
  };

  // Calcular noticias para la página actual (excluyendo la destacada)
  const newsPerPage = 9; // Máximo 9 noticias por página (sin incluir la destacada)

  // Separar la noticia destacada del resto
  const featuredNews = filteredNews.length > 0 ? filteredNews[0] : null;
  const regularNews = filteredNews.length > 0 ? filteredNews.slice(1) : [];

  // Calcular el índice de inicio y fin para la página actual
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;

  // Obtener las noticias para la página actual
  const currentNews = regularNews.slice(indexOfFirstNews, indexOfLastNews);

  // Calcular número total de páginas
  const totalPages = Math.ceil(regularNews.length / newsPerPage);

  // Animación para los elementos que aparecen
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <section className="bg-[#F9F9F9] py-34">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado de la página */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
          >
            Noticias y Actualizaciones
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-gray-600 max-w-2xl mx-auto"
          >
            Descubre las últimas noticias, eventos y actualizaciones importantes
            para la comunidad odontológica venezolana.
          </motion.p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Buscador */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Buscar noticias..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            {/* Filtros de categorías */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {categories.map((category, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleFilter(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-1 rounded-full text-sm ${activeCategory === category
                    ? "bg-[#C40180] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                    } transition-all`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido de noticias */}
        {filteredNews.length > 0 ? (
          <>
            {/* Noticia destacada (primera noticia) */}
            {featuredNews && (
              <FeaturedNewsCard
                news={featuredNews}
                onReadMore={handleReadMore}
              />
            )}

            {/* Cuadrícula de noticias */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {currentNews.map((news, index) => (
                <NewsCard
                  key={news.id || index}
                  news={news}
                  index={index}
                  onReadMore={handleReadMore}
                />
              ))}
            </motion.div>

            {/* Paginación - Solo mostrar si hay más de 9 noticias regulares */}
            {regularNews.length > 9 && (
              <div className="mt-12 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex space-x-2"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${page === currentPage
                        ? "bg-[#C40180] text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  {currentPage < totalPages && (
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-gray-600 hover:bg-gray-100 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </motion.div>
              </div>
            )}
          </>
        ) : (
          // Estado vacío - no se encontraron noticias
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-gray-400 mb-4">
              <Filter className="w-16 h-16 mx-auto opacity-30" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron noticias</h3>
            <p className="text-gray-500">
              No hay resultados que coincidan con tu búsqueda. Intenta con otros términos o elimina los filtros.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("Todas");
                setFilteredNews(allNews);
                setCurrentPage(1);
              }}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-full hover:shadow-lg transition-all"
            >
              Ver todas las noticias
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Noticias;