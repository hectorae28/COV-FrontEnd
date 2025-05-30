"use client";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Download,
  MessageSquare,
  X,
  FileCheck,
  Eye,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

// Componentes importados
import PagosColg from "@/Components/PagosModal"
import ConfirmacionModal from "@/Components/Solicitudes/Solicitudes/ConfirmacionModal";
import DocumentosSection from "@/Components/Solicitudes/Solicitudes/DocumentsManagerComponent";

import { DocumentViewer } from "@/Components/Solicitudes/ListaColegiados/SharedListColegiado/DocumentModule";
import SolicitudHeader from "@/Components/Solicitudes/Solicitudes/HeaderSolic";
import HistorialPagosSection from "@/Components/Solicitudes/Solicitudes/HistorialPagosSection";
import RechazoModal from "@/Components/Solicitudes/Solicitudes/RechazoModal";
import ServiciosSection from "@/Components/Solicitudes/Solicitudes/ServiciosSection";
import { useSolicitudesStore } from "@/store/SolicitudesStore";
import transformBackendData from "@/utils/formatDataSolicitudes";
import api from "@/api/api";
import { generateConstanciaPDF, downloadPDF, openPDF } from "@/utils/PDF/constanciasPDFService";

export default function DetalleSolicitud({ props }) {
  const { id, isAdmin } = props;

  const actualizarSolicitud = (solicitudActualizada) => {
    alert("Solicitud actualizada:", solicitudActualizada);
  };
  const getSolicitudById = useSolicitudesStore(
    (state) => state.getSolicitudById
  );
  const addPagosSolicitud = useSolicitudesStore(
    (state) => state.addPagosSolicitud
  );
  const updateDocumentoSolicitud = useSolicitudesStore(state => state.updateDocumentoSolicitud)


  const [isLoading, setIsLoading] = useState(true);
  const [alertaExito, setAlertaExito] = useState(null);
  const pagosSolicitud = useSolicitudesStore((state) => state.pagosSolicitud);
  const solicitud = useSolicitudesStore((state) => state.solicitudSeleccionada);

  // Estados de modales
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarRechazo, setMostrarRechazo] = useState(false);
  const [mostrarModalPagos, setMostrarModalPagos] = useState(false);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
  const [documentosSistema, setDocumentosSistema] = useState([]);
  const [loadingDocumentos, setLoadingDocumentos] = useState(false);

  // Estados para formularios
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const loadSolicitudById = async () => {
    const solicitud = await getSolicitudById(id);
    setIsLoading(false);

    // Verificar si todas las solicitudes hijas están aprobadas
    if (solicitud && solicitud.itemsSolicitud && 
        solicitud.itemsSolicitud.every(item => item.estado === 'Aprobada')) {
      cargarDocumentosSistema();
    }
  };

  useEffect(() => {
    loadSolicitudById();
  }, [id]);

  useEffect(() => {
    if (solicitud && solicitud.itemsSolicitud) {
      // Verificar si hay al menos una constancia o carnet aprobado
      const hayDocumentosAprobados = solicitud.itemsSolicitud.some(item => 
        (item.tipo === 'Constancia' || item.tipo === 'Carnet') && item.estado === 'Aprobada'
      );
      
      if (hayDocumentosAprobados) {
        cargarDocumentosSistema();
      }
    }
  }, [solicitud]);

  // Calcular totales
  const calcularTotales = (solicitudData) => {
    if (!solicitudData?.itemsSolicitud)
      return {
        totalOriginal: 0,
        totalExonerado: 0,
        totalPendiente: 0,
        totalPagado: 0,
      };

    // Fijar a 2 decimales para evitar errores de precisión
    const fijarDecimales = (valor) => Number(valor.toFixed(2));

    const totalOriginal = fijarDecimales(solicitudData.itemsSolicitud.reduce(
      (sum, item) => sum + item.costo,
      0
    ));
    
    const totalExonerado = fijarDecimales(solicitudData.itemsSolicitud.reduce(
      (sum, item) => sum + (item.exonerado ? item.costo : 0),
      0
    ));

    const totalPagado = fijarDecimales(pagosSolicitud.reduce((sum, pago) => {
      if (pago.moneda === 'bs') {
        return sum + (Number(pago.monto) / Number(pago.tasa_bcv_del_dia));
      }
      return sum + Number(pago.monto);
    }, 0));

    const totalPendiente = fijarDecimales(totalOriginal - totalExonerado - totalPagado);

    const todoExonerado = totalOriginal === totalExonerado || solicitudData?.estado === "Exonerada";
    const todoPagado = totalPendiente <= 0.01 && !todoExonerado;

    return {
      totalOriginal,
      totalExonerado,
      totalPendiente,
      totalPagado,
      todoExonerado,
      todoPagado,
    };
  };

  const totales = calcularTotales(solicitud);

  // Función para verificar que todos los documentos estén validados (todos los campos *_validate sean true)
  const verificarDocumentosValidados = (solicitudData) => {
    console.log({solicitudData})
    if (!solicitudData) return false;

    // Obtener todas las propiedades de la solicitud que terminan en '_validate'
    const camposValidacion = Object.keys(solicitudData).filter(key => key.endsWith('_validate'));
    
    // Usar reduce para verificar que todos los campos de validación sean true
    const todosValidados = camposValidacion.reduce((acumulador, campo) => {
      const valorCampo = solicitudData[campo];
      // Solo consideramos válido si el campo es explícitamente true
      return acumulador && valorCampo === true;
    }, true); // Inicializamos en true, si no hay campos de validación, retorna true

    // También verificar si hay campos de validación (para evitar casos donde no hay documentos)
    const hayDocumentosParaValidar = camposValidacion.length > 0;
    return {
      todosValidados,
      hayDocumentosParaValidar,
      camposValidacion,
      estadoValidacion: camposValidacion.reduce((estado, campo) => {
        estado[campo] = solicitudData[campo];
        return estado;
      }, {})
    };
  };

  const estadoValidacionDocumentos = solicitud?.isAllDocumentosValidados;
  

  // Función para aprobar la solicitud
  const handleAprobarSolicitud = async () => {
    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 800));

      const solicitudActualizada = {
        ...solicitud,
        estado: "Aprobada",
        fechaAprobacion: new Date().toLocaleDateString(),
        aprobadoPor: "Admin",
        observaciones: observaciones,
      };

      actualizarSolicitud(solicitudActualizada);
      setMostrarConfirmacion(false);
      mostrarAlerta("exito", "La solicitud ha sido aprobada correctamente");
    } catch (error) {
      console.error("Error al aprobar solicitud:", error);
    }
  };

  // Función para rechazar la solicitud
  const handleRechazarSolicitud = async () => {
    try {
      if (!motivoRechazo.trim()) {
        alert("Debe ingresar un motivo de rechazo");
        return;
      }

      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 800));

      const solicitudActualizada = {
        ...solicitud,
        estado: "Rechazada",
        fechaRechazo: new Date().toLocaleDateString(),
        rechazadoPor: "Admin",
        motivoRechazo: motivoRechazo,
        observaciones: observaciones,
      };

      actualizarSolicitud(solicitudActualizada);
      setSolicitud(solicitudActualizada);
      setMostrarRechazo(false);
      mostrarAlerta("alerta", "La solicitud ha sido rechazada");
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
    }
  };

  // Función para ver un documento
  const handleVerDocumento = (documento) => {
    // Si es un string, asumimos que es la URL directa
    if (typeof documento === 'string') {
      setDocumentoSeleccionado({ url: documento });
    } 
    // Si es un objeto, puede tener la URL en diferentes propiedades
    else if (typeof documento === 'object') {
      if (documento.url) {
        setDocumentoSeleccionado(documento);
      } else if (documento.archivo) {
        setDocumentoSeleccionado({ url: documento.archivo });
      } else {
        setDocumentoSeleccionado(documento);
      }
    }
  };

  // Función para iniciar proceso de pago
  const handleIniciarPago = () => {
    if (totales.totalPendiente === 0) {
      alert("No hay montos pendientes por pagar");
      return;
    }

    setMostrarModalPagos(true);
  };

  // Función que se ejecuta cuando se completa un pago
  const handlePaymentComplete = async (pagoInfo) => {
    try {
      await addPagosSolicitud(solicitud.id, {
        monto: Number(pagoInfo.totalAmount),
        moneda: pagoInfo.metodo_de_pago.moneda,
        num_referencia: pagoInfo.referenceNumber,
        metodo_de_pago: pagoInfo.metodo_de_pago.id,
        tasa_bcv_del_dia: pagoInfo.tasa_bcv_del_dia,
        comprobante: pagoInfo.paymentFile,
      });
      
      // Cerrar el modal de pagos
      setMostrarModalPagos(false);
      
      // Mostrar alerta de éxito
      mostrarAlerta("exito", "El pago se ha registrado correctamente");
      
      // Recargar la solicitud para obtener información actualizada
      await loadSolicitudById();
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      mostrarAlerta("alerta", "Ocurrió un error al procesar el pago");
    }
  };

  // Función para cargar documentos generados por el sistema
  const cargarDocumentosSistema = async () => {
    if (!solicitud || !solicitud.itemsSolicitud) {
      return;
    }
    
    setLoadingDocumentos(true);
    try {
      
      // Filtrar constancias aprobadas
      const constancias = solicitud.itemsSolicitud.filter(
        item => item.tipo === 'Constancia' && item.estado === 'Aprobada'
      );

      // Filtrar carnets aprobados
      const carnets = solicitud.itemsSolicitud.filter(
        item => item.tipo === 'Carnet' && item.estado === 'Aprobada'
      );

      const documentosGenerados = [
        // Mapear constancias
        ...constancias.map(constancia => ({
          id: constancia.id,
          nombre: constancia.nombre,
          tipo: constancia.tipoConstancia,
          solicitudId: solicitud.id,
          tipoDocumento: 'constancia'
        })),
        // Mapear carnets
        ...carnets.map(carnet => ({
          id: carnet.id,
          nombre: carnet.nombre,
          tipo: 'carnet',
          solicitudId: solicitud.id,
          tipoDocumento: 'carnet'
        }))
      ];

      setDocumentosSistema(documentosGenerados);
    } catch (error) {
      console.error("Error al cargar documentos del sistema:", error);
      mostrarAlerta("alerta", "Error al cargar los documentos del sistema");
    } finally {
      setLoadingDocumentos(false);
    }
  };

  // Función para visualizar PDF de constancia o carnet
  const handleVisualizarDocumento = async (documento) => {
    try {
      if (documento.tipoDocumento === 'carnet') {
        // Para carnets, extraer el ID real del SolicitudCarnet del formato compuesto
        const datosResponse = await api.get(`/solicitudes/solicitud_carnet/${documento.id}/datos/`);
        const datosCarnet = datosResponse.data;
        
        // Generar PDF de carnet usando la función correspondiente
        const { docDefinition } = generateConstanciaPDF(datosCarnet, 'carnet');
        const pdfUrl = await openPDF(docDefinition);
        setDocumentoSeleccionado({ url: pdfUrl, nombre: documento.nombre, isAPDF: true });
      } else {
        // Para constancias, extraer el ID real del SolicitudConstancia del formato compuesto
        
        const datosResponse = await api.get(`/solicitudes/solicitud_constancia/${documento.id}/datos/`);
        const datosCompletos = datosResponse.data;
        
        // Limpiar el tipo de constancia para el PDF
        let tipoConstanciaLimpio = documento.tipo;
        if (tipoConstanciaLimpio && tipoConstanciaLimpio.startsWith('constancia_')) {
          tipoConstanciaLimpio = tipoConstanciaLimpio.replace('constancia_', '');
        }
        
        const { docDefinition } = generateConstanciaPDF(datosCompletos, tipoConstanciaLimpio);
        const pdfUrl = await openPDF(docDefinition);
        setDocumentoSeleccionado({ url: pdfUrl, nombre: documento.nombre, isAPDF: true });
      }
    } catch (error) {
      console.error("Error al generar PDF:", error);
      mostrarAlerta("alerta", "Error al generar el documento PDF: " + (error.response?.data?.error || error.message || error));
    }
  };

  // Función para descargar PDF de constancia o carnet
  const handleDescargarDocumento = async (documento) => {
    try {
      
      if (documento.tipoDocumento === 'carnet') {
        // Para carnets, extraer el ID real del SolicitudCarnet del formato compuesto
        const datosResponse = await api.get(`/solicitudes/solicitud_carnet/${documento.id}/datos/`);
        const datosCarnet = datosResponse.data;
        
        // Generar PDF de carnet usando la función correspondiente
        const { docDefinition, fileName } = generateConstanciaPDF(datosCarnet, 'carnet');
        await downloadPDF(docDefinition, fileName);
        mostrarAlerta("exito", "Documento descargado correctamente");
      } else {
        // Para constancias, extraer el ID real del SolicitudConstancia del formato compuesto
        const datosResponse = await api.get(`/solicitudes/solicitud_constancia/${documento.id}/datos/`);
        const datosCompletos = datosResponse.data;
        
        // Limpiar el tipo de constancia para el PDF
        let tipoConstanciaLimpio = documento.tipo;
        if (tipoConstanciaLimpio && tipoConstanciaLimpio.startsWith('constancia_')) {
          tipoConstanciaLimpio = tipoConstanciaLimpio.replace('constancia_', '');
        }
        
        const { docDefinition, fileName } = generateConstanciaPDF(datosCompletos, tipoConstanciaLimpio);
        await downloadPDF(docDefinition, fileName);
        mostrarAlerta("exito", "Documento descargado correctamente");
      }
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      mostrarAlerta("alerta", "Error al descargar el documento PDF: " + (error.response?.data?.error || error.message || error));
    }
  };

  // Función para mostrar alertas temporales
  const mostrarAlerta = (tipo, mensaje) => {
    setAlertaExito({
      tipo: tipo,
      mensaje: mensaje,
    });

    // Limpiar alerta después de un tiempo
    setTimeout(() => {
      setAlertaExito(null);
    }, 5000);
  };

  const handleUpdateDocumento = async (formData) => {
    try {
      if (updateDocumentoSolicitud) {
        await updateDocumentoSolicitud(id,formData);
        await loadSolicitudById();
      }
    } catch (error) {
      console.error("Error al actualizar documento:", error);
    }
  };

  // Handler for document status change (approve/reject)
  const handleDocumentStatusChange = async (updatedDocument) => {
    try {
      // Determinar el nombre correcto del campo de validación
      let validateFieldName, motivoFieldName;
      
      // Caso especial para foto de carnet
      if (updatedDocument.id === 'foto') {
        validateFieldName = 'foto_validate';
        motivoFieldName = 'foto_motivo_rechazo';
      } else if (updatedDocument.id.startsWith('file_')) {
        validateFieldName = `${updatedDocument.id}_validate`;
        motivoFieldName = `${updatedDocument.id}_motivo_rechazo`;
      } else {
        validateFieldName = `file_${updatedDocument.id}_validate`;
        motivoFieldName = `file_${updatedDocument.id}_motivo_rechazo`;
      }

      const requestBody = {
        [validateFieldName]: updatedDocument.status === 'approved' ? true : 
                           updatedDocument.status === 'rechazado' ? false : null,
        [motivoFieldName]: updatedDocument.rejectionReason || ''
      }
      
      const response = await api.patch(`/solicitudes/solicitud/${solicitud.id}/`, requestBody);
      await loadSolicitudById();
    } catch (error) {
      console.error("Error al actualizar el estado del documento:", error);
      setAlertaExito({
        tipo: "alerta",
        mensaje: error.message || "Error al actualizar el estado del documento"
      });
    }
  };

  // Renderizar estado de carga
  if (isLoading) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C40180]"></div>
      </div>
    );
  }

  // Renderizar mensaje de error si no se encuentra la solicitud
  if (!solicitud) {
    return (
      <div className="w-full px-4 md:px-10 py-10 md:py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          No se pudo encontrar la información de la solicitud.
        </div>
        <Link
          href={isAdmin ? "/PanelControl/Solicitudes" : "/Colegiado/Solicitudes"}
        >
          <div
            className="mt-4 inline-flex items-center text-[#C40180] hover:underline"
          >
            <ChevronLeft size={20} className="mr-1" />
            Volver a la lista de solicitudes
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-10 py-6 md:py-28">
      {/* Botón de regreso */}
      <div className="mb-4">
        <Link
          href={isAdmin ? "/PanelControl/Solicitudes" : "/Colegiado/Solicitudes"}
        >
          <div
            className="cursor-pointer text-sm text-[#590248] hover:text-[#C40180] flex items-center"
          >
            <ChevronLeft size={20} className="mr-1" />
            Volver a la lista de solicitudes
          </div>
        </Link>
      </div>

      {/* Alertas de éxito o información */}
      {alertaExito && (
        <div
          className={`mb-4 p-3 rounded-md flex items-start justify-between ${alertaExito.tipo === "exito"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
            }`}
        >
          <div className="flex items-center">
            {alertaExito.tipo === "exito" ? (
              <CheckCircle size={18} className="mr-2 flex-shrink-0" />
            ) : (
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            )}
            <span>{alertaExito.mensaje}</span>
          </div>
          <button
            onClick={() => setAlertaExito(null)}
            className={
              alertaExito.tipo === "exito"
                ? "text-green-700"
                : "text-yellow-700"
            }
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Encabezado de solicitud */}
      <SolicitudHeader
        solicitud={solicitud}
        totales={totales}
        onAprobar={() => setMostrarConfirmacion(true)}
        onRechazar={() => setMostrarRechazo(true)}
        isAdmin={isAdmin}
      />

      {/* Documentos requeridos - esta sección es para verificación y siempre debe estar visible */}
      <DocumentosSection
        solicitud={solicitud}
        onVerDocumento={handleVerDocumento}
        updateDocumento={handleUpdateDocumento}
        onDocumentStatusChange={handleDocumentStatusChange}
        isAdmin={isAdmin}
      />

      {/* Documentos generados por el sistema - Visible cuando hay constancias o carnets aprobados */}
      {solicitud.itemsSolicitud && solicitud.itemsSolicitud.some(item => 
        (item.tipo === 'Constancia' || item.tipo === 'Carnet') && item.estado === 'Aprobada'
      ) && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-5">
          <h2 className="text-base font-medium text-gray-900 mb-3 flex items-center">
            <FileCheck size={18} className="mr-2 text-blue-600" />
            Documentos generados por el sistema
          </h2>
          
          {loadingDocumentos ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C40180]"></div>
              <span className="ml-2 text-gray-600">Cargando documentos...</span>
            </div>
          ) : documentosSistema.length > 0 ? (
            <div className="space-y-3">
              {documentosSistema.map((documento) => (
                <div key={documento.id} className="border rounded-lg p-3 flex justify-between items-center bg-gray-50">
                  <div className="flex items-center">
                    <FileText size={18} className="text-blue-500 mr-2" />
                    <div>
                      <p className="font-medium">{documento.nombre}</p>
                      <p className="text-sm text-gray-500">Documento disponible para generar</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVisualizarDocumento(documento)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors"
                      title="Visualizar documento"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => handleDescargarDocumento(documento)}
                      className="text-green-600 hover:text-green-800 p-2 rounded-md hover:bg-green-50 transition-colors"
                      title="Descargar documento"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText size={48} className="mx-auto mb-2 text-gray-300" />
              <p>No hay documentos disponibles</p>
              <p className="text-sm">Los documentos se generarán automáticamente cuando las constancias o carnets sean aprobados</p>
            </div>
          )}
        </div>
      )}

      {/* Servicios solicitados */}
      <div className="flex flex-col md:flex-row gap-4 ">
        <div className="md:w-1/2">

          <ServiciosSection
            solicitud={solicitud}
            totales={totales}
            onIniciarPago={handleIniciarPago}
            pagosAprobados={pagosSolicitud && pagosSolicitud.length > 0 && pagosSolicitud.every(pago => pago.status === 'aprobado') && totales.totalPendiente <= 0.01}
            pagosSolicitud={pagosSolicitud}
          />
        </div>

        {/* Historial de pagos */}
        {pagosSolicitud && pagosSolicitud.length > 0 && (
          <div className="md:w-1/2">

          <HistorialPagosSection
            comprobantes={pagosSolicitud}
              onVerDocumento={handleVerDocumento}
            />
          </div>
        )}
      </div>

      {/* Observaciones - solo en estado pendiente */}
      {solicitud.estado === "Pendiente" && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-5">
          <h2 className="text-base font-medium text-gray-900 mb-3">
            Observaciones
          </h2>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-sm"
            placeholder="Agregue observaciones o notas sobre esta solicitud..."
            rows="3"
          ></textarea>
        </div>
      )}

      {/* Botones adicionales */}
      <div className="flex flex-wrap gap-3">
        {solicitud.estado === "Aprobada" && solicitud.comprobantePago && (
          <button className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors text-sm">
            <Download size={16} />
            <span>Descargar comprobante</span>
          </button>
        )}

        <button className="cursor-pointer bg-gradient-to-t from-[#D7008A] to-[#41023B] text-white px-3 py-2 rounded-md flex items-center gap-2 hover:bg-purple-700 transition-colors text-sm">
          <MessageSquare size={16} />
          <span>Enviar mensaje al colegiado</span>
        </button>
      </div>

      {/* Modal de confirmación para aprobación */}
      {mostrarConfirmacion && (
        <ConfirmacionModal
          onCancel={() => setMostrarConfirmacion(false)}
          onConfirm={handleAprobarSolicitud}
        />
      )}

      {/* Modal de rechazo */}
      {mostrarRechazo && (
        <RechazoModal
          motivoRechazo={motivoRechazo}
          setMotivoRechazo={setMotivoRechazo}
          onCancel={() => setMostrarRechazo(false)}
          onConfirm={handleRechazarSolicitud}
        />
      )}

      {/* Modal para ver documento */}
      {documentoSeleccionado && (
        <DocumentViewer
          documento={documentoSeleccionado}
          onClose={() => setDocumentoSeleccionado(null)}
        />
      )}

      {/* Modal de pagos */}
      {mostrarModalPagos && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Registrar pago
              </h3>
              <button
                onClick={() => setMostrarModalPagos(false)}
                className="cursor-pointer text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <PagosColg
                props={{
                  costo: totales.totalPendiente,
                  allowMultiplePayments: true,
                  handlePago: handlePaymentComplete,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}