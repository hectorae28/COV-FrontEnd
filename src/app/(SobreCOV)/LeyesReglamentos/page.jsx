"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, ChevronDown, Download, ExternalLink } from "lucide-react"

// Document options with their titles and PDF paths
const documentOptions = [
  {
    id: "ley-ejercicio",
    title: "Ley del Ejercicio de la Odontología",
    description: "Marco legal que regula el ejercicio profesional de la odontología en Venezuela",
    pdfPath: "/PdfLeyes.pdf",
    color: "from-[#C40180] to-[#590248]"
  },
  {
    id: "codigo-deontologia",
    title: "Código de Deontología Odontológica",
    description: "Principios éticos que rigen la práctica odontológica",
    pdfPath: "/PdfLeyes.pdf",
    color: "from-[#C40180] to-[#590248]"
  },
  {
    id: "reglamento-ley",
    title: "Reglamento de la Ley de Ejercicio de la Odontología",
    description: "Disposiciones que desarrollan la aplicación de la Ley de Ejercicio",
    pdfPath: "/PdfLeyes.pdf",
    color: "from-[#C40180] to-[#590248]"
  },
  {
    id: "reglamento-interno",
    title: "Reglamento Interno",
    description: "Normas que rigen el funcionamiento interno del Colegio de Odontólogos",
    pdfPath: "/PdfLeyes.pdf",
    color: "from-[#C40180] to-[#590248]"
  },
  {
    id: "reglamento-educacion",
    title: "Reglamento para Realización de las Actividades de Educación Odontológica Permanente",
    description: "Normativa para la formación continua de los profesionales",
    pdfPath: "/PdfLeyes.pdf",
    color: "from-[#C40180] to-[#590248]"
  },
  {
    id: "reglamento-academico",
    title: "Reglamento de Reconocimiento Académico",
    description: "Lineamientos para el reconocimiento de méritos académicos",
    pdfPath: "/PdfLeyes.pdf",
    color: "from-[#C40180] to-[#590248]"
  },
  {
    id: "reglamento-electoral",
    title: "Reglamento Electoral",
    description: "Normas que rigen los procesos electorales del Colegio",
    pdfPath: "/PdfLeyes.pdf",
    color: "from-[#C40180] to-[#590248]"
  }
]

const DocumentCard = ({ document, isSelected, onClick }) => {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-lg border-0 shadow-md
        transition-all duration-300 ease-out cursor-pointer
        ${isSelected ? "shadow-lg ring-2 ring-[#C40180]" : ""}
      `}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      onClick={onClick}
    >
      <div className="relative p-4 bg-gradient-to-tr from-white to-gray-100">
        <div className="flex items-start">
          {/* Icon */}
          <div className="mr-4">
            <motion.div
              className={`
                flex items-center justify-center p-2 rounded-lg text-white
                bg-gradient-to-br ${document.color} shadow-md
                transition-all duration-500 ease-out
                w-10 h-10
              `}
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <FileText className="w-5 h-5" />
            </motion.div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-md font-bold text-gray-800 mb-1">{document.title}</h3>
            <p className="text-gray-600 text-xs">{document.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const PDFViewer = ({ pdfPath, title }) => {
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef(null)

  useEffect(() => {
    if (iframeRef.current) {
      setIsLoading(true)
      
      const handleLoad = () => {
        setIsLoading(false)
      }
      
      iframeRef.current.addEventListener('load', handleLoad)
      
      return () => {
        if (iframeRef.current) {
          iframeRef.current.removeEventListener('load', handleLoad)
        }
      }
    }
  }, [pdfPath])

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-4 p-3 bg-gradient-to-t from-[#C40180] to-[#590248] rounded-lg">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <div className="flex space-x-4">
          <motion.a
            href={pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            <span className="text-xs">Abrir</span>
          </motion.a>
          <motion.a
            href={pdfPath}
            download
            className="flex items-center justify-center p-2 rounded-md bg-white text-[#590248]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="text-xs">Descargar</span>
          </motion.a>
        </div>
      </div>
      
      <div className="relative flex-grow bg-gray-200 rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C40180]"></div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={`${pdfPath}#toolbar=0&navpanes=0`}
          className="w-full h-full rounded-lg"
          title={title}
        />
      </div>
    </div>
  )
}

const MobileDocumentSelector = ({ documents, selectedDocument, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative mb-6">
      <motion.button
        className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow-md"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center">
          <FileText className="w-5 h-5 mr-2 text-[#C40180]" />
          <span className="font-medium">{selectedDocument.title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-30 mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="max-h-80 overflow-y-auto">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className={`
                    p-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100
                    ${selectedDocument.id === doc.id ? 'bg-gray-50' : ''}
                  `}
                  onClick={() => {
                    onSelect(doc)
                    setIsOpen(false)
                  }}
                >
                  <p className="font-medium text-sm">{doc.title}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function LeyesyReglamentos() {
  const [selectedDocument, setSelectedDocument] = useState(documentOptions[0])

  return (
    <div className="flex flex-col mt-12 lg:mt-20">
      <main className="container mx-auto px-4 py-20 flex-grow">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative z-20"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-4xl font-bold mt-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          >
            Leyes y Reglamentos
          </motion.h1>
          <motion.p
            className="mt-6 max-w-4xl mx-auto text-gray-600 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Marco legal y normativo que rige el ejercicio de la odontología en Venezuela
          </motion.p>
        </motion.div>

        {/* Mobile Document Selector (visible only on small screens) */}
        <div className="md:hidden">
          <MobileDocumentSelector 
            documents={documentOptions}
            selectedDocument={selectedDocument}
            onSelect={setSelectedDocument}
          />
        </div>

        {/* Main Content - Two Columns */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative flex flex-col md:flex-row gap-8 min-h-[600px]"
        >
          {/* Document Options - Left Column (hidden on mobile) */}
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:block md:w-1/3 space-y-4"
          >
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text">
              Documentos Disponibles
            </h2>
            
            {documentOptions.map(doc => (
              <DocumentCard
                key={doc.id}
                document={doc}
                isSelected={selectedDocument.id === doc.id}
                onClick={() => setSelectedDocument(doc)}
              />
            ))}
          </motion.section>

          {/* PDF Viewer - Right Column */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-2/3 h-[70vh]"
          >
            <PDFViewer 
              pdfPath={selectedDocument.pdfPath} 
              title={selectedDocument.title}
            />
          </motion.section>
        </motion.div>
      </main>
    </div>
  )
}
