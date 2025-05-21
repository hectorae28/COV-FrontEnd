import { motion } from "framer-motion";
import { useState } from "react";
import useFormValidation from "@/utils/useFormValidation";

export default function DocsRequirements({
  formData,
  onInputChange,
  validationErrors,
  attemptedNext,
  isEditMode = false
}) {
  // Usar el hook de validación con paso 'docsRequirements'
  const {
    errors: localErrors,
    handleChange: handleValidatedChange
  } = useFormValidation(formData, 'docsRequirements');
  
  // Inicializar fileNames basado en archivos existentes en formData
  const [fileNames, setFileNames] = useState({
    ci: formData.ci ? (formData.ci.name || "Archivo seleccionado") : "",
    rif: formData.rif ? (formData.rif.name || "Archivo seleccionado") : "",
    titulo: formData.titulo ? (formData.titulo.name || "Archivo seleccionado") : "",
    mpps: formData.mpps ? (formData.mpps.name || "Archivo seleccionado") : "",
    fondo_negro_titulo_bachiller: formData.fondo_negro_titulo_bachiller ? (formData.fondo_negro_titulo_bachiller.name || "Archivo seleccionado") : "",
    fondo_negro_credencial: formData.fondo_negro_credencial ? (formData.fondo_negro_credencial.name || "Archivo seleccionado") : "",
    notas_curso: formData.notas_curso ? (formData.notas_curso.name || "Archivo seleccionado") : ""
  });

  // Verificar si un campo tiene error de validación
  const isFieldEmpty = (fieldName) => {
    return (attemptedNext && validationErrors && validationErrors[fieldName]) || 
           (localErrors && localErrors[fieldName]);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFileNames(prev => ({
        ...prev,
        [name]: files[0].name
      }));
      
      const updates = { [name]: files[0] };
      onInputChange(updates);
      handleValidatedChange(updates);
    }
  };

  // Determinar la etiqueta correcta para el fondo negro del título según la profesión
  const getTituloLabel = () => {
    if (formData.tipo_profesion === "odontologo") {
      return "Fondo Negro del Título";
    } else if (formData.tipo_profesion === "tecnico" || formData.tipo_profesion === "higienista") {
      return "Fondo Negro del Título de Bachiller";
    } else {
      return "Fondo Negro del Título";
    }
  };

   const handleSaveClick = () => {
    // Aquí podría haber validación, pero en este caso probablemente
    // solo queremos enviar los archivos que se han actualizado
    onInputChange(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Cédula de Identidad (C.I.)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="file"
              name="ci"
              id="ci"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="ci"
              className={`w-full px-4 py-3 border ${isFieldEmpty("ci") ? "border-gray-200 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] bg-white flex items-center justify-between cursor-pointer`}
            >
              <span className={` ${!fileNames.ci ? 'text-gray-400' : 'text-gray-800'}`}>
                {fileNames.ci || "Seleccionar archivo."}
              </span>
              <span className="bg-[#D7008A] text-white px-3 py-1 rounded-lg text-sm">
                Adjuntar Archivo
              </span>
            </label>
          </div>
          {isFieldEmpty("ci") && (
            <p className="mt-1 text-xs text-red-300">{localErrors?.ci || "Este campo es obligatorio"}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Registro de Información Fiscal (RIF)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="file"
              name="rif"
              id="rif"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="rif"
              className={`w-full px-4 py-3 border ${isFieldEmpty("rif") ? "border-gray-200 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] bg-white flex items-center justify-between cursor-pointer`}
            >
              <span className={` ${!fileNames.rif ? 'text-gray-400' : 'text-gray-800'}`}>
                {fileNames.rif || "Seleccionar archivo."}
              </span>
              <span className="bg-[#D7008A] text-white px-3 py-1 rounded-lg text-sm">
                Adjuntar Archivo
              </span>
            </label>
          </div>
          {isFieldEmpty("rif") && (
            <p className="mt-1 text-xs text-red-300">{localErrors?.rif || "Este campo es obligatorio"}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            {getTituloLabel()}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="file"
              name="titulo"
              id="titulo"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="titulo"
              className={`w-full px-4 py-3 border ${isFieldEmpty("titulo") ? "border-gray-200 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] bg-white flex items-center justify-between cursor-pointer`}
            >
              <span className={`truncate ${!fileNames.titulo ? 'text-gray-400' : 'text-gray-800'}`}>
                {fileNames.titulo || `Seleccionar archivo.`}
              </span>
              <span className="bg-[#D7008A] text-white px-3 py-1 rounded-lg text-sm">
                Adjuntar Archivo
              </span>
            </label>
          </div>
          {isFieldEmpty("titulo") && (
            <p className="mt-1 text-xs text-red-300">{localErrors?.titulo || "Este campo es obligatorio"}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Registro MPPS
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="file"
              name="mpps"
              id="mpps"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="mpps"
              className={`w-full px-4 py-3 border ${isFieldEmpty("mpps") ? "border-gray-200 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] bg-white flex items-center justify-between cursor-pointer`}
            >
              <span className={`truncate ${!fileNames.mpps ? 'text-gray-400' : 'text-gray-800'}`}>
                {fileNames.mpps || "Seleccionar archivo."}
              </span>
              <span className="bg-[#D7008A] text-white px-3 py-1 rounded-lg text-sm">
                Adjuntar Archivo
              </span>
            </label>
          </div>
          {isFieldEmpty("mpps") && (
            <p className="mt-1 text-xs text-red-300">{localErrors?.mpps || "Este campo es obligatorio"}</p>
          )}
        </div>
      </div>
      {formData.tipo_profesion === "tecnico" || formData.tipo_profesion === "higienista" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
                Fondo negro de la credencial tamaño carta
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="fondo_negro_credencial"
                  id="fondo_negro_credencial"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="fondo_negro_credencial"
                  className={`w-full px-4 py-3 border ${isFieldEmpty("fondo_negro_credencial") ? "border-gray-200 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] bg-white flex items-center justify-between cursor-pointer`}
                >
                  <span className={`truncate ${!fileNames.fondo_negro_credencial ? 'text-gray-400' : 'text-gray-800'}`}>
                    {fileNames.fondo_negro_credencial || "Seleccionar archivo."}
                  </span>
                  <span className="bg-[#D7008A] text-white px-3 py-1 rounded-lg text-sm">
                    Adjuntar Archivo
                  </span>
                </label>
              </div>
              {isFieldEmpty("fondo_negro_credencial") && (
                <p className="mt-1 text-xs text-red-300">{localErrors?.fondo_negro_credencial || "Este campo es obligatorio"}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
                Notas del curso
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="notas_curso"
                  id="notas_curso"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="notas_curso"
                  className={`w-full px-4 py-3 border ${isFieldEmpty("notas_curso") ? "border-gray-200 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] bg-white flex items-center justify-between cursor-pointer`}
                >
                  <span className={`truncate ${!fileNames.notas_curso ? 'text-gray-400' : 'text-gray-800'}`}>
                    {fileNames.notas_curso || "Seleccionar archivo."}
                  </span>
                  <span className="bg-[#D7008A] text-white px-3 py-1 rounded-lg text-sm">
                    Adjuntar Archivo
                  </span>
                </label>
              </div>
              {isFieldEmpty("notas_curso") && (
                <p className="mt-1 text-xs text-red-300">{localErrors?.notas_curso || "Este campo es obligatorio"}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
                Fondo negro del título de bachiller
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="fondo_negro_titulo_bachiller"
                  id="fondo_negro_titulo_bachiller"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="fondo_negro_titulo_bachiller"
                  className={`w-full px-4 py-3 border ${isFieldEmpty("fondo_negro_titulo_bachiller") ? "border-gray-200 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] bg-white flex items-center justify-between cursor-pointer`}
                >
                  <span className={`truncate ${!fileNames.fondo_negro_titulo_bachiller ? 'text-gray-400' : 'text-gray-800'}`}>
                    {fileNames.fondo_negro_titulo_bachiller || "Seleccionar archivo."}
                  </span>
                  <span className="bg-[#D7008A] text-white px-3 py-1 rounded-lg text-sm">
                    Adjuntar Archivo
                  </span>
                </label>
              </div>
              {isFieldEmpty("fondo_negro_titulo_bachiller") && (
                <p className="mt-1 text-xs text-red-300">{localErrors?.fondo_negro_titulo_bachiller || "Este campo es obligatorio"}</p>
              )}
            </div>
          </div>
        </>
      ) : null}

      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Información importante</h3>
        <p className="text-xs text-blue-600">
          Todos los documentos deben estar en formato PDF, JPG o PNG y ser claramente legibles.
          El tamaño máximo por archivo es de 5MB. Asegúrese de que los documentos estén completos
          y vigentes para evitar retrasos en su proceso de colegiación.
        </p>
      </div>
    {/* Si estamos en modo edición, mostrar botones de guardar/cancelar */}
      {isEditMode && (
        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
          <button
            type="button"
            onClick={handleSaveClick}
            className="cursor-pointer flex items-center px-5 py-2.5 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white
              rounded-xl text-base font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-colors"
          >
            Guardar cambios
          </button>
        </div>
      )}
    </motion.div>
  );
}