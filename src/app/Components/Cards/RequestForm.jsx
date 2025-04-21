"use client";

import { useState } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Upload, 
  UploadCloud,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Trash2
} from "lucide-react";

export default function RequestForm() {
  // Estado para el tipo de solicitud
  const [requestType, setRequestType] = useState("multiple");
  
  // Estado para las opciones de solicitud múltiple
  const [multipleOptions, setMultipleOptions] = useState({
    constancia: false,
    carnet: false,
    especialidad: false
  });
  
  // Estado para la solicitud individual
  const [singleOption, setSingleOption] = useState("constancia");
  
  // Estado para la especialidad seleccionada
  const [especialidad, setEspecialidad] = useState("");
  
  // Estado para mostrar el panel de especialidades
  const [showEspecialidades, setShowEspecialidades] = useState(false);
  
  // Estado para los archivos subidos
  const [files, setFiles] = useState([]);
  
  // Estado para el formulario
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Lista de especialidades disponibles
  const especialidades = [
    "Odontopediatría",
    "Ortodoncia",
    "Periodoncia",
    "Endodoncia",
    "Cirugía Bucal",
    "Rehabilitación Oral",
    "Patología Bucal",
    "Odontología Forense",
    "Implantología"
  ];

  // Manejar checkbox de solicitud múltiple
  const handleMultipleOptionChange = (option) => {
    setMultipleOptions({
      ...multipleOptions,
      [option]: !multipleOptions[option]
    });
    
    // Si se selecciona especialidad, mostrar el panel
    if (option === "especialidad" && !multipleOptions.especialidad) {
      setShowEspecialidades(true);
    }
  };

  // Manejar cambio de tipo de solicitud individual
  const handleSingleOptionChange = (option) => {
    setSingleOption(option);
    
    // Si se selecciona especialidad, mostrar el panel
    if (option === "especialidad") {
      setShowEspecialidades(true);
    } else {
      setShowEspecialidades(false);
    }
  };

  // Manejar selección de especialidad
  const handleEspecialidadChange = (e) => {
    setEspecialidad(e.target.value);
  };

  // Manejar subida de archivos
  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  // Eliminar archivo
  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  // Validar formulario
  const isValid = () => {
    if (requestType === "multiple") {
      // Verificar que al menos una opción esté seleccionada
      if (!multipleOptions.constancia && !multipleOptions.carnet && !multipleOptions.especialidad) {
        return false;
      }
      
      // Si especialidad está seleccionada, verificar que haya elegido una
      if (multipleOptions.especialidad && !especialidad) {
        return false;
      }
    } else {
      // Para solicitud individual, si es especialidad verificar que haya elegido una
      if (singleOption === "especialidad" && !especialidad) {
        return false;
      }
    }
    
    // Verificar que haya subido al menos un archivo
    return files.length > 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isValid()) return;
    
    setIsSubmitting(true);
    
    // Simular procesamiento de solicitud
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Restablecer después de mostrar éxito
      setTimeout(() => {
        setSuccess(false);
        // Reiniciar formulario
        setRequestType("multiple");
        setMultipleOptions({
          constancia: false,
          carnet: false,
          especialidad: false
        });
        setSingleOption("constancia");
        setEspecialidad("");
        setShowEspecialidades(false);
        setFiles([]);
      }, 3000);
    }, 1500);
  };

  // Calcular costo total
  const calculateCost = () => {
    let cost = 0;
    
    if (requestType === "multiple") {
      // Costos para solicitud múltiple
      if (multipleOptions.constancia) cost += 15;
      if (multipleOptions.carnet) cost += 25;
      if (multipleOptions.especialidad) cost += 35;
      
      // Aplicar descuento si hay más de una opción seleccionada
      const selectedCount = Object.values(multipleOptions).filter(Boolean).length;
      if (selectedCount > 1) {
        cost = cost * 0.9; // 10% de descuento
      }
    } else {
      // Costos para solicitud individual
      switch (singleOption) {
        case "constancia":
          cost = 15;
          break;
        case "carnet":
          cost = 25;
          break;
        case "especialidad":
          cost = 35;
          break;
      }
    }
    
    return cost.toFixed(2);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-[#41023B] to-[#D7008A] p-4">
        <h2 className="text-lg font-bold text-white">
          Formulario de Solicitud
        </h2>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {success ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">¡Solicitud Enviada!</h3>
            <p className="text-gray-600 text-center">
              Tu solicitud ha sido recibida correctamente. Puedes verificar su estado en el historial.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Tipo de solicitud */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Solicitud
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`border rounded-md p-4 cursor-pointer ${
                    requestType === "multiple"
                      ? "bg-purple-50 border-purple-300"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setRequestType("multiple")}
                >
                  <div className="flex items-center">
                    {requestType === "multiple" ? (
                      <CheckCircle className="mr-2 text-purple-600" size={20} />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 mr-2"></div>
                    )}
                    <span>Solicitud Múltiple</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-7">
                    Tramita varias solicitudes con un 10% de descuento
                  </p>
                </div>
                <div
                  className={`border rounded-md p-4 cursor-pointer ${
                    requestType === "individual"
                      ? "bg-purple-50 border-purple-300"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setRequestType("individual")}
                >
                  <div className="flex items-center">
                    {requestType === "individual" ? (
                      <CheckCircle className="mr-2 text-purple-600" size={20} />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 mr-2"></div>
                    )}
                    <span>Solicitud Individual</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-7">
                    Tramita una solicitud específica
                  </p>
                </div>
              </div>
            </div>

            {/* Opciones según tipo de solicitud */}
            {requestType === "multiple" ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecciona los documentos que necesitas
                </label>
                <div className="space-y-3 border rounded-md p-4">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleMultipleOptionChange("constancia")}
                  >
                    <div
                      className={`w-5 h-5 rounded border ${
                        multipleOptions.constancia
                          ? "bg-purple-600 border-purple-600"
                          : "border-gray-300"
                      } flex items-center justify-center mr-2`}
                    >
                      {multipleOptions.constancia && (
                        <CheckCircle className="text-white" size={16} />
                      )}
                    </div>
                    <span>Constancia ($15.00)</span>
                  </div>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleMultipleOptionChange("carnet")}
                  >
                    <div
                      className={`w-5 h-5 rounded border ${
                        multipleOptions.carnet
                          ? "bg-purple-600 border-purple-600"
                          : "border-gray-300"
                      } flex items-center justify-center mr-2`}
                    >
                      {multipleOptions.carnet && (
                        <CheckCircle className="text-white" size={16} />
                      )}
                    </div>
                    <span>Carnet ($25.00)</span>
                  </div>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleMultipleOptionChange("especialidad")}
                  >
                    <div
                      className={`w-5 h-5 rounded border ${
                        multipleOptions.especialidad
                          ? "bg-purple-600 border-purple-600"
                          : "border-gray-300"
                      } flex items-center justify-center mr-2`}
                    >
                      {multipleOptions.especialidad && (
                        <CheckCircle className="text-white" size={16} />
                      )}
                    </div>
                    <span>Especialidad ($35.00)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Documento
                </label>
                <div className="space-y-3 border rounded-md p-4">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSingleOptionChange("constancia")}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border ${
                        singleOption === "constancia"
                          ? "bg-purple-600 border-purple-600"
                          : "border-gray-300"
                      } flex items-center justify-center mr-2`}
                    >
                      {singleOption === "constancia" && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span>Constancia ($15.00)</span>
                  </div>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSingleOptionChange("carnet")}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border ${
                        singleOption === "carnet"
                          ? "bg-purple-600 border-purple-600"
                          : "border-gray-300"
                      } flex items-center justify-center mr-2`}
                    >
                      {singleOption === "carnet" && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span>Carnet ($25.00)</span>
                  </div>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSingleOptionChange("especialidad")}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border ${
                        singleOption === "especialidad"
                          ? "bg-purple-600 border-purple-600"
                          : "border-gray-300"
                      } flex items-center justify-center mr-2`}
                    >
                      {singleOption === "especialidad" && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span>Especialidad ($35.00)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Panel de especialidades (condicional) */}
            {((requestType === "multiple" && multipleOptions.especialidad) ||
              (requestType === "individual" && singleOption === "especialidad")) && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Especialidad
                  </label>
                  <button
                    type="button"
                    className="text-purple-600 flex items-center text-sm"
                    onClick={() => setShowEspecialidades(!showEspecialidades)}
                  >
                    {showEspecialidades ? (
                      <>
                        <ChevronUp size={16} className="mr-1" />
                        <span>Ocultar</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} className="mr-1" />
                        <span>Mostrar</span>
                      </>
                    )}
                  </button>
                </div>
                {showEspecialidades && (
                  <div className="border rounded-md p-4">
                    <select
                      value={especialidad}
                      onChange={handleEspecialidadChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:outline-none"
                    >
                      <option value="">Seleccionar especialidad</option>
                      {especialidades.map((esp, index) => (
                        <option key={index} value={esp}>
                          {esp}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Subida de documentos */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documentos Requeridos
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                <div className="text-center">
                  <UploadCloud className="mx-auto text-gray-400" size={36} />
                  <p className="mt-2 text-sm text-gray-600">
                    Arrastra y suelta tus archivos aquí, o
                  </p>
                  <label className="mt-2 inline-flex items-center cursor-pointer text-sm text-purple-600 hover:text-purple-700">
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <Upload className="mr-1" size={16} />
                    <span>selecciona archivos</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    PDF, JPG, PNG (Max. 5MB)
                  </p>
                </div>
              </div>

              {/* Lista de archivos */}
              {files.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Archivos cargados ({files.length})
                  </h4>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center mr-2">
                            <span className="text-xs text-gray-600">
                              {file.name.split(".").pop().toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Resumen y costo */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Resumen de Solicitud
              </h4>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Tipo: {requestType === "multiple" ? "Múltiple" : "Individual"}
                </span>
                <span className="text-lg font-semibold text-gray-800">
                  Total: ${calculateCost()}
                </span>
              </div>
              {requestType === "multiple" && (
                <div className="mt-1 flex items-center">
                  <AlertCircle className="text-blue-500 mr-1" size={14} />
                  <span className="text-xs text-blue-600">
                    10% de descuento aplicado en solicitudes múltiples
                  </span>
                </div>
              )}
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={!isValid() || isSubmitting}
              className={`w-full p-3 rounded-md text-white font-medium shadow-sm
                ${
                  isValid() && !isSubmitting
                    ? "bg-gradient-to-r from-[#41023B] to-[#D7008A] hover:from-[#510449] hover:to-[#e20091]"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              {isSubmitting ? "Procesando..." : "Enviar Solicitud"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}