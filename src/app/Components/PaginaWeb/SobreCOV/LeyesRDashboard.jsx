"use client";

import React, { useState } from "react";
import { initialDocumentOptions, pageContent } from "../../../Models/PaginaWeb/SobreCOV/LeyesRData";
import { 
  FileText, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Plus, 
  Save, 
  Upload,
  Edit,
  ExternalLink
} from "lucide-react";

export default function LeyesRDashboard({ moduleInfo }) {
  // Estado para los documentos
  const [documents, setDocuments] = useState(initialDocumentOptions);
  const [pageTitle, setPageTitle] = useState(pageContent.title);
  const [pageSubtitle, setPageSubtitle] = useState(pageContent.subtitle);
  
  // Estado para el documento expandido
  const [expandedDoc, setExpandedDoc] = useState(null);
  
  // Funciones para manejar los documentos
  const addDocument = () => {
    const newDocument = {
      id: `doc-${Date.now()}`,
      title: "Nuevo Documento",
      description: "Descripción del nuevo documento",
      pdfPath: "/PdfLeyes.pdf",
      color: "from-[#C40180] to-[#590248]"
    };
    
    setDocuments([...documents, newDocument]);
    setExpandedDoc(newDocument.id);
  };
  
  const removeDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    if (expandedDoc === id) {
      setExpandedDoc(null);
    }
  };
  
  const updateDocument = (id, field, value) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, [field]: value } : doc
    ));
  };
  
  const moveDocumentUp = (id) => {
    const index = documents.findIndex(doc => doc.id === id);
    if (index > 0) {
      const newDocuments = [...documents];
      [newDocuments[index], newDocuments[index - 1]] = [newDocuments[index - 1], newDocuments[index]];
      setDocuments(newDocuments);
    }
  };
  
  const moveDocumentDown = (id) => {
    const index = documents.findIndex(doc => doc.id === id);
    if (index < documents.length - 1) {
      const newDocuments = [...documents];
      [newDocuments[index], newDocuments[index + 1]] = [newDocuments[index + 1], newDocuments[index]];
      setDocuments(newDocuments);
    }
  };
  
  // Función para guardar cambios
  const saveChanges = () => {
    // Aquí iría la lógica para guardar en la base de datos
    alert("Cambios guardados correctamente");
  };
  
  // Función para manejar la subida de archivos PDF
  const handleFileUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      // En un caso real, aquí subirías el archivo al servidor
      // y obtendrías la URL para actualizar el documento
      console.log(`Archivo seleccionado para ${id}:`, file.name);
      
      // Simulamos la actualización de la ruta del PDF
      updateDocument(id, 'pdfPath', `/uploads/${file.name}`);
      
      // Resetear el input de archivo
      e.target.value = null;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: moduleInfo.color }}>
        {moduleInfo.title}
      </h2>
      <p className="text-gray-600 mb-6">
        Aquí se edita la sección de Leyes y Reglamentos de la página web
      </p>
      {/* Sección de documentos */}
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Documentos Disponibles</h3>
            <button 
              onClick={addDocument}
              className="flex items-center gap-1 text-white px-3 py-1 rounded-md text-sm transition-colors"
              style={{ backgroundColor: moduleInfo.color }}
            >
              <Plus size={16} />
              Añadir Documento
            </button>
          </div>
          
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C40180] to-[#590248] flex items-center justify-center text-white">
                      <FileText size={16} />
                    </div>
                    <span className="font-medium">{doc.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveDocumentUp(doc.id);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveDocumentDown(doc.id);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDocument(doc.id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {expandedDoc === doc.id && (
                  <div className="p-4 border-t border-gray-200 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título del Documento</label>
                      <input
                        type="text"
                        value={doc.title}
                        onChange={(e) => updateDocument(doc.id, 'title', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                      <textarea
                        value={doc.description}
                        onChange={(e) => updateDocument(doc.id, 'description', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Archivo PDF Actual</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={doc.pdfPath}
                            onChange={(e) => updateDocument(doc.id, 'pdfPath', e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-md"
                            readOnly
                          />
                          <a 
                            href={doc.pdfPath} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink size={18} />
                          </a>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subir Nuevo PDF</label>
                        <div className="flex items-center">
                          <label 
                            className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                          >
                            <Upload size={16} />
                            <span>Seleccionar archivo</span>
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => handleFileUpload(doc.id, e)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Botón de guardar */}
      <div className="mt-8 flex justify-center">
        <button 
          onClick={saveChanges}
          className="flex items-center gap-2 text-white px-6 py-3 rounded-md shadow-md transition-colors"
          style={{ backgroundColor: moduleInfo.color }}
        >
          <Save size={20} />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
