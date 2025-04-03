"use client";

import { useState, useRef, useEffect } from "react";
import { ExternalLink, Mail, Download, MessageCircle } from "lucide-react";

// Componente PDFViewer con manejo mejorado de la carga y versión móvil como botón de descarga
const PDFViewer = ({ pdfPath, title, className, lastUpdated }) => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef(null);
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
    if (iframeRef.current && !isMobile) {
      setIsLoading(true);

      // Función para manejar el evento load
      const handleLoad = () => {
        setIsLoading(false);
        console.log("PDF cargado correctamente.");
      };

      // Función para manejar errores en la carga
      const handleError = () => {
        setIsLoading(false);
        console.error("Error al cargar el PDF.");
      };

      // Verificar si el iframe ya está cargado
      if (iframeRef.current.contentDocument?.readyState === "complete") {
        setIsLoading(false);
      } else {
        // Adjuntar listeners para eventos load y error
        iframeRef.current.addEventListener("load", handleLoad);
        iframeRef.current.addEventListener("error", handleError);
      }

      // Limpiar listeners al desmontar el componente
      return () => {
        if (iframeRef.current) {
          iframeRef.current.removeEventListener("load", handleLoad);
          iframeRef.current.removeEventListener("error", handleError);
        }
      };
    }
  }, [pdfPath, isMobile]);

  // Mejorar la URL del PDF con parámetros de zoom
  const enhancedPdfUrl = `${pdfPath}#view=FitH&toolbar=0&navpanes=0`;

  // Versión móvil - Botón de descarga
  if (isMobile) {
    return (
      <div className={`relative bg-gray-100 rounded-lg overflow-hidden shadow-md ${className} flex flex-col`}>
        {/* Header */}
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#C40180] to-[#590248] rounded-t-lg">
          <h3 className="text-sm font-bold text-white">{title}</h3>
        </div>
        
        {/* Contenido para móvil - Botón de descarga */}
        <div className="flex-grow flex flex-col items-center justify-center p-8 bg-gray-50">
          <div className="mb-4 text-center">
            <p className="text-gray-600 mb-2">Ver o descargar el documento</p>
            <p className="text-xs text-gray-500">{lastUpdated && `Actualizado: ${lastUpdated}`}</p>
          </div>
          <div className="flex gap-4">
            <a
              href={pdfPath}
              download
              className="flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#C40180] to-[#590248] text-white hover:opacity-90 transition-all duration-300 shadow-md"
            >
              <Download className="w-5 h-5 mr-2" />
              <span className="font-medium">Descargar</span>
            </a>
            <button
              onClick={() => window.open(pdfPath, '_blank')}
              className="flex items-center justify-center px-6 py-3 rounded-lg border-2 border-[#C40180] text-[#C40180] hover:bg-[#fcf2f8] transition-all duration-300 shadow-md"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              <span className="font-medium">Abrir</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Versión desktop - Visor de PDF
  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden shadow-md ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#C40180] to-[#590248] rounded-t-lg">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => window.open(pdfPath, '_blank')}
            className="flex items-center justify-center px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-all duration-300"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            <span className="text-xs">Abrir</span>
          </button>
          <a
            href={pdfPath}
            download
            className="flex items-center justify-center px-2 py-1 rounded-md bg-white text-[#590248] hover:bg-gray-100 transition-all duration-300"
          >
            <Download className="w-4 h-4 mr-1" />
            <span className="text-xs">Descargar</span>
          </a>
        </div>
      </div>

      {/* Spinner de carga */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C40180]"></div>
            <p className="mt-2 text-sm text-gray-600">Cargando documento...</p>
          </div>
        </div>
      )}

      {/* Contenido del PDF */}
      <iframe
        ref={iframeRef}
        src={enhancedPdfUrl}
        className="w-full h-full rounded-b-lg"
        title={title}
        style={{ minHeight: "100%" }}
      />

      {/* Fecha de última actualización */}
      {lastUpdated && (
        <div className="absolute bottom-0 right-0 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-tl-md text-xs text-gray-700">
          Actualizado: {lastUpdated}
        </div>
      )}
    </div>
  );
};

// Componente de botón moderno para acciones
const ActionButton = ({ icon, label, href, className }) => {
  const Icon = icon;

  return (
    <a
      href={href}
      className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-300 ${className}`}
    >
      {icon && <Icon className="w-5 h-5" />}
      <span className="font-medium">{label}</span>
    </a>
  );
};

// Componente principal
export default function NuevaLey() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 mt-18 md:mt-22">
      <main className="container mx-auto px-4 py-12 lg:py-20 flex-grow">
        {/* Sección de título */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-4xl md:text-4xl font-bold bg-gradient-to-r from-[#C40180] to-[#590248] text-transparent bg-clip-text">
            Propuesta Anteproyecto Nueva Ley del Ejercicio de la Odontología
          </h1>
          <p className="mt-4 text-gray-600 text-lg max-w-3xl mx-auto">
            Borrador final propuesta Anteproyecto nueva Ley del Ejercicio de la Odontología
          </p>
        </div>

        {/* Contenido principal con diseño responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vista previa del documento principal */}
          <section className="h-[30vh] md:h-[65vh]">
            <PDFViewer
              pdfPath="/NuevaLey.pdf"
              title="Documento"
              className="h-full"
              lastUpdated="5/12/2022"
            />
          </section>

          {/* Columna derecha con presentación y botones de acción */}
          <section className="flex flex-col gap-6">
            {/* Presentación ejecutiva */}
            <div className="h-[30vh] md:h-[50vh]">
              <PDFViewer
                pdfPath="/NuevaLeyPresentacion.pdf"
                title="Presentación"
                className="h-full"
                lastUpdated="5/12/2022"
              />
            </div>

            {/* Botones de acción */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
              <ActionButton
                icon={Mail}
                label="Contactar por Email"
                href="mailto:nuevaleydeodontologia@elcov.org"
                className="bg-white border-2 border-[#C40180] text-[#C40180] hover:bg-[#fcf2f8] shadow-md hover:shadow-lg"
              />

              <ActionButton
                icon={MessageCircle}
                label="Foro de Discusión"
                href="/foro"
                className="bg-gradient-to-r from-[#C40180] to-[#590248] text-white hover:opacity-90 shadow-md hover:shadow-lg"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}