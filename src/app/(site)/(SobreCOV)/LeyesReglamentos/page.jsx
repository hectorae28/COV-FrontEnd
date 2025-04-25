"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronDown, Download, ExternalLink } from "lucide-react";
import { fetchLeyes } from "@/api/endpoints/landingPage";

const formatDocuments = (rows) => {
  return rows.map((row) => {
    // Generar un id único en formato slug
    const idSlug = row.titulo
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]/g, "");

    // Formatear el pdfPath (extraer la ruta del archivo)
    const pdfPath = row.archivo_pdf_url;

    return {
      id: idSlug,
      title: row.titulo,
      description: row.resumen,
      pdfPath: `${process.env.NEXT_PUBLIC_BACK_HOST}${pdfPath}`,
    };
  });
};

const DocumentCard = ({ document, isSelected, onClick }) => {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-lg border-0 shadow-md
        transition-all duration-300 ease-out cursor-pointer
        ${
          isSelected
            ? "shadow-lg ring-2 ring-[#C40180] bg-gradient-to-tr from-[#C40180]/10 to-[#C40180]/5"
            : "bg-gradient-to-tr from-white to-gray-100"
        }
      `}
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      onClick={onClick}
    >
      <div className="relative p-4">
        <div className="flex items-start">
          {/* Icon */}
          <div className="mr-4">
            <motion.div
              className={`
                flex items-center justify-center p-2 rounded-lg text-white
                bg-gradient-to-br ${
                  isSelected
                    ? "from-[#C40180] to-[#C40180]"
                    : "from-[#C40180] to-[#590248]"
                } shadow-md
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
            <h3
              className={`text-md font-bold mb-1 ${
                isSelected ? "text-[#C40180]" : "text-gray-800"
              }`}
            >
              {document.title}
            </h3>
            <p className="text-gray-600 text-xs">{document.description}</p>
          </div>
        </div>

        {/* Active indicator */}
        {isSelected && (
          <div className="absolute top-0 left-0 w-1 h-full bg-[#C40180]"></div>
        )}
      </div>
    </motion.div>
  );
};

const PDFViewer = ({ pdfPath, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Comprobar al cargar y cuando cambia el tamaño de la ventana
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  useEffect(() => {
    // Cargar el PDF como Blob
    const fetchPdf = async () => {
      try {
        const response = await fetch(pdfPath);
        if (!response.ok) {
          throw new Error(`Error al cargar el PDF: ${response.statusText}`);
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar el PDF:", error);
        setIsLoading(false);
      }
    };

    if (pdfPath) {
      fetchPdf();
    }
  }, [pdfPath]);

  // Versión móvil - Botones de descarga y abrir
  if (isMobile) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex justify-between items-center mb-4 p-3 bg-gradient-to-t from-[#C40180] to-[#590248] rounded-lg">
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 rounded-lg p-8">
          <div className="text-center mb-6">
            <p className="text-gray-700 mb-2">Ver o descargar el documento</p>
            <p className="text-sm text-gray-600">
              Acceda al documento desde su dispositivo
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
            <motion.a
              href={pdfPath}
              download
              className="flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#C40180] to-[#590248] text-white shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              about="_blank"
            >
              <Download className="w-5 h-5 mr-2" />
              <span className="font-medium">Descargar</span>
            </motion.a>

            <motion.a
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-6 py-3 rounded-lg border-2 border-[#C40180] text-[#C40180] shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              <span className="font-medium">Abrir</span>
            </motion.a>
          </div>
        </div>
      </div>
    );
  }

  // Versión desktop - Visor de PDF
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
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C40180]"></div>
              <p className="mt-3 text-sm text-gray-600">
                Cargando documento...
              </p>
            </div>
          </div>
        ) : pdfBlobUrl ? (
          <iframe
            src={`${pdfBlobUrl}#toolbar=0&navpanes=0`}
            className="w-full h-full rounded-lg"
            title={title}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-red-500">Error al cargar el documento</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MobileDocumentSelector = ({ documents, selectedDocument, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

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
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
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
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`
                    p-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100
                    ${selectedDocument.id === doc.id ? "bg-gray-50" : ""}
                  `}
                  onClick={() => {
                    onSelect(doc);
                    setIsOpen(false);
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
  );
};

export default function LeyesyReglamentos() {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [leyes, setLeyes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLeyes();
      const formattedLeyes = formatDocuments(data.data);
      setLeyes(formattedLeyes);
      setIsLoading(false);
      if (formattedLeyes.length > 0) {
        setSelectedDocument(formattedLeyes[0]);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Cargando presidentes...</div>;
  }

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
            Marco legal y normativo que rige el ejercicio de la odontología en
            Venezuela
          </motion.p>
        </motion.div>

        {/* Mobile Document Selector (visible only on small screens) */}
        <div className="md:hidden">
          <MobileDocumentSelector
            documents={leyes}
            selectedDocument={selectedDocument}
            onSelect={setSelectedDocument}
          />
        </div>

        {/* Main Content - Two Columns */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative flex flex-col md:flex-row gap-8 min-h-full"
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

            {leyes.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                isSelected={selectedDocument?.id == doc.id}
                onClick={() => setSelectedDocument(doc)}
              />
            ))}
          </motion.section>

          {/* PDF Viewer - Right Column */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-2/3 h-[30vh] md:h-[70vh]"
          >
            <PDFViewer
              pdfPath={selectedDocument.pdfPath}
              title={selectedDocument.title}
            />
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
}
