"use client";

import { useState, useEffect } from "react";
import { 
  ClipboardEdit,
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  MessageSquare,
  Send,
  Paperclip,
  Download
} from "lucide-react";

export default function AdminUpdateRequest() {
  // Estado para la solicitud actual
  const [solicitud, setSolicitud] = useState({
    id: "SOL-004",
    tipo: "Especialidad",
    fecha: "10/04/2023",
    costo: "$35.00",
    estado: "en revisión",
    documentos: [
      { id: 1, nombre: "Documento de Identidad.pdf", tipo: "PDF", tamaño: "1.2 MB" },
      { id: 2, nombre: "Comprobante de Pago.pdf", tipo: "PDF", tamaño: "0.8 MB" }
    ],
    historial: [
      { fecha: "10/04/2023 10:30", mensaje: "Solicitud recibida", autor: "Sistema" },
      { fecha: "10/04/2023 14:15", mensaje: "Solicitud en revisión por el personal administrativo", autor: "Sistema" }
    ]
  });

  // Estado para el nuevo estado
  const [nuevoEstado, setNuevoEstado] = useState(solicitud.estado);
  
  // Estado para el comentario
  const [comentario, setComentario] = useState("");
  
  // Estado para archivos adjuntos
  const [archivosAdjuntos, setArchivosAdjuntos] = useState([]);
  
  // Estado para mostrar confirmación
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  
  // Estado para mostrar éxito
  const [exito, setExito] = useState(false);
  
  // Función para manejar archivos adjuntos
  const handleFileUpload = (e) => {
    const nuevosArchivos = Array.from(e.target.files);
    setArchivosAdjuntos([...archivosAdjuntos, ...nuevosArchivos]);
  };

  // Eliminar archivo adjunto
  const eliminarArchivo = (index) => {
    const archivosActualizados = [...archivosAdjuntos];
    archivosActualizados.splice(index, 1);
    setArchivosAdjuntos(archivosActualizados);
  };

  // Función para actualizar estado
  const actualizarEstado = () => {
    // Mostrar confirmación
    setMostrarConfirmacion(true);
  };

  // Confirmar actualización
  const confirmarActualizacion = () => {
    // Crear nuevo evento en el historial
    const nuevoEvento = {
      fecha: new Date().toLocaleString('es-VE'),
      mensaje: comentario || `Estado actualizado a "${nuevoEstado}"`,
      autor: "Administrador"
    };
    
    // Actualizar solicitud
    setSolicitud({
      ...solicitud,
      estado: nuevoEstado,
      historial: [...solicitud.historial, nuevoEvento]
    });
    
    // Limpiar
    setComentario("");
    setArchivosAdjuntos([]);
    setMostrarConfirmacion(false);
    
    // Mostrar éxito
    setExito(true);
    setTimeout(() => setExito(false), 3000);
  };

  // Cancelar confirmación
  const cancelarConfirmacion = () => {
    setMostrarConfirmacion(false);
  };

  // Obtener color según estado
  const getStatusColor = (estado) => {
    switch (estado) {
      case "completado":
        return "bg-green-100 text-green-800";
      case "pendiente":
        return "bg-blue-100 text-blue-800";
      case "en revisión":
        return "bg-yellow-100 text-yellow-800";
      case "rechazado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Obtener icono según estado
  const getStatusIcon = (estado) => {
    switch (estado) {
      case "completado":
        return <CheckCircle size={14} />;
      case "pendiente":
        return <MessageSquare size={14} />;
      case "en revisión":
        return <AlertTriangle size={14} />;
      case "rechazado":
        return <XCircle size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-[#41023B] to-[#D7008A] p-4">
        <h2 className="text-lg font-bold text-white flex items-center">
          <ClipboardEdit className="mr-2" size={20} />
          Actualizar Solicitud
        </h2>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Información de la solicitud */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de la Solicitud</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">ID de Solicitud</p>
              <p className="text-sm font-medium">{solicitud.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tipo</p>
              <p className="text-sm font-medium">{solicitud.tipo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha</p>
              <p className="text-sm font-medium">{solicitud.fecha}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Costo</p>
              <p className="text-sm font-medium">{solicitud.costo}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Estado Actual</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(solicitud.estado)}`}>
                {getStatusIcon(solicitud.estado)}
                <span className="ml-1">{solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Documentos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Documentos</h3>
          
          <div className="space-y-2">
            {solicitud.documentos.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center mr-2">
                    <span className="text-xs text-gray-600">{doc.tipo}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{doc.nombre}</p>
                    <p className="text-xs text-gray-500">{doc.tamaño}</p>
                  </div>
                </div>
                <button className="text-purple-600 hover:text-purple-900 focus:outline-none">
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Historial */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Historial</h3>
          
          <div className="border rounded-md divide-y">
            {solicitud.historial.map((evento, index) => (
              <div key={index} className="p-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-1 mr-3 mt-0.5">
                      <MessageSquare size={12} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{evento.mensaje}</p>
                      <p className="text-xs text-gray-500">Por: {evento.autor}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{evento.fecha}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {exito ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex">
              <CheckCircle className="text-green-500 mr-3" size={20} />
              <div>
                <p className="text-green-800 font-medium">¡Actualización exitosa!</p>
                <p className="text-green-700 text-sm">La solicitud ha sido actualizada correctamente.</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Formulario de actualización */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Actualizar Estado</h3>
              
              <div className="space-y-4">
                {/* Selector de estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nuevo Estado
                  </label>
                  <select
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:outline-none"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en revisión">En revisión</option>
                    <option value="completado">Completado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </div>
                
                {/* Comentario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comentario (opcional)
                  </label>
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:outline-none"
                    placeholder="Agregar un comentario sobre esta actualización..."
                  ></textarea>
                </div>
                
                {/* Subida de archivos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adjuntar Documentos (opcional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                    <div className="text-center">
                      <label className="cursor-pointer text-sm text-purple-600 hover:text-purple-700">
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          onChange={handleFileUpload}
                        />
                        <Paperclip className="inline-block mr-1" size={16} />
                        <span>Seleccionar archivos</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Lista de archivos */}
                  {archivosAdjuntos.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Archivos adjuntos:</p>
                      <ul className="space-y-1">
                        {archivosAdjuntos.map((archivo, index) => (
                          <li key={index} className="flex justify-between items-center text-xs bg-gray-50 p-1 rounded">
                            <span className="truncate max-w-xs">{archivo.name}</span>
                            <button
                              onClick={() => eliminarArchivo(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              &times;
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end">
              <button
                onClick={actualizarEstado}
                className="px-4 py-2 bg-gradient-to-r from-[#41023B] to-[#D7008A] hover:from-[#510449] hover:to-[#e20091] text-white font-medium rounded-md shadow-sm focus:outline-none"
              >
                Actualizar Estado
              </button>
            </div>
          </>
        )}

        {/* Modal de confirmación */}
        {mostrarConfirmacion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Confirmar Actualización
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                ¿Estás seguro de que deseas actualizar el estado de esta solicitud a "{nuevoEstado}"?
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelarConfirmacion}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarActualizacion}
                  className="px-4 py-2 bg-gradient-to-r from-[#41023B] to-[#D7008A] text-white rounded-md hover:from-[#510449] hover:to-[#e20091] focus:outline-none"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}