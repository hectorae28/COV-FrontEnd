"use client"
import { useState, useEffect } from "react"
import { X, Download, FileText, CheckCircle,ExternalLink } from "lucide-react"
import { motion } from "framer-motion"


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

export default function DocumentViewerModal({ documento, onClose, pendiente }) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Determinar si es un documento exonerado
    const isExonerado = documento && documento.archivo && documento.archivo.toLowerCase().includes("exonerado")

    // Determinar si es un comprobante de pago
    const isComprobantePago =
        documento && (documento?.id?.includes("comprobante_pago") || documento?.nombre?.toLowerCase().includes("comprobante"))

    // Obtener el usuario que autorizó la exoneración
    const usuarioExoneracion = pendiente?.exoneracionPagos?.usuario
    const nombreUsuario = usuarioExoneracion
        ? usuarioExoneracion.username || usuarioExoneracion.name || usuarioExoneracion.email
        : "Administración COV"

    useEffect(() => {
        // Simular carga del documento
        const timer = setTimeout(() => {
            if (isExonerado) {
                setLoading(false)
            } else if (!documento.url) {
                setError("No se pudo cargar el documento. URL no disponible.")
                setLoading(false)
            } else {
                setLoading(false)
            }
        }, 1000)
        return () => clearTimeout(timer)
    }, [documento, isExonerado])

    // Determinar el tamaño del modal basado en el contenido
    const getModalSize = () => {
        if (isExonerado) {
            return "max-w-lg h-auto max-h-[90vh]" // Modal más pequeño para exoneraciones
        } else {
            return "max-w-4xl h-[80vh]" // Tamaño original para documentos
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-lg shadow-xl w-full flex flex-col ${getModalSize()}`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center">
                        <FileText className="text-[#C40180] mr-2" size={20} />
                        <h3 className="text-lg font-medium text-gray-900">{documento.nombre}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className={`overflow-auto p-4 bg-gray-100 ${isExonerado ? '' : 'flex-1'}`}>
                    {loading ? (
                        <div className="flex items-center justify-center h-full min-h-[300px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full min-h-[300px]">
                            <div className="text-center text-red-500">
                                <p className="text-xl mb-2">Error</p>
                                <p>{error}</p>
                            </div>
                        </div>
                    ) : isExonerado ? (
                        <div className="py-6">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-green-800 mb-2">Pago Exonerado</h3>
                                <p className="text-green-700 mb-4">
                                    Este pago ha sido exonerado administrativamente y no requiere comprobante.
                                </p>
                                <div className="text-left bg-white p-4 rounded-md border border-green-100 mt-2">
                                    <p className="text-sm text-gray-700 mb-1">
                                        <span className="font-semibold">Autorizado por:</span> {nombreUsuario}
                                    </p>
                                    {pendiente?.exoneracionPagos?.fecha && (
                                        <p className="text-sm text-gray-700 mb-1">
                                            <span className="font-semibold">Fecha:</span>{" "}
                                            {new Date(pendiente.exoneracionPagos.fecha).toLocaleDateString()}
                                        </p>
                                    )}
                                    {pendiente?.exoneracionPagos?.motivo && (
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold">Motivo:</span> {pendiente.exoneracionPagos.motivo}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : documento.url ? (
                        <div className="h-full flex items-center justify-center min-h-[400px]">
                            {documento.url.endsWith(".pdf") ? (
                               <PDFViewer pdfPath={process.env.NEXT_PUBLIC_BACK_HOST+documento.url} title={documento.nombre} />
                            ) : (
                                <img
                                    src={process.env.NEXT_PUBLIC_BACK_HOST+documento.url || "/placeholder.svg"}
                                    alt={documento.nombre}
                                    className="max-h-full max-w-full object-contain"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full min-h-[300px]">
                            <div className="text-center text-gray-500">
                                <p className="text-xl mb-2">No hay vista previa disponible</p>
                                <p>No se puede mostrar este documento.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t justify-between items-center hidden md:flex">
                    <div>
                        <p className="text-sm text-gray-500">
                            {isExonerado
                                ? "Documento exonerado administrativamente"
                                : documento.archivo
                                    ? `Archivo: ${documento.archivo}`
                                    : "No hay archivo disponible"}
                        </p>
                    </div>
                    {documento.url && !isExonerado && (
                        <div
                            href={process.env.NEXT_PUBLIC_BACK_HOST+documento.url}
                            download={documento.archivo || "documento"}
                            className=" cursor-pointer px-4 py-2 bg-[#C40180] text-white rounded-md hover:bg-[#A00160] transition-colors flex items-center gap-2"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Download size={16} />
                            <span>Descargar</span>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}