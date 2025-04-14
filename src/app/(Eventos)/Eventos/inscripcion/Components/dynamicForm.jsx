"use client";
import { useState } from "react";

// Sample form configuration

export default function DynamicForm(props) {
  const { formulario } = props;
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState({});

  // Add a check to handle missing formulario prop
  if (!formulario || !formulario.campos) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">
            Error de configuración
          </h2>
          <p className="text-slate-600 text-sm">
            No se ha proporcionado la configuración del formulario
          </p>
        </div>
        <div className="p-6">
          <p className="text-slate-600">
            Por favor, proporcione la configuración del formulario para
            continuar.
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      setSelectedFileName((prev) => ({
        ...prev,
        [name]: files[0].name,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isDragging, setIsDragging] = useState(false);

  // ... (resto del código anterior)

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const inputName = e.currentTarget.dataset.inputName;

      setFormData((prev) => ({
        ...prev,
        [inputName]: file,
      }));
      setSelectedFileName((prev) => ({
        ...prev,
        [inputName]: file.name,
      }));
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const extra = new FormData();
    const personaData = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      identificacion: formData.identificacion,
      correo: formData.correo,
      telefono_movil: formData.telefono_movil,
      fecha_de_nacimiento: formData.fecha_de_nacimiento,
      evento: formulario.evento,
      curso: formulario.curso,
    };

    formulario.campos.forEach((campo) => {
      if (campo.tipo === "archivo") {
        extra.append(campo.nombre, formData[campo.nombre]);
      } else {
        extra.append(campo.nombre, formData[campo.nombre] || "");
      }
    });
    extra.append("persona", JSON.stringify(personaData));
    try {
      console.log("Form data to send:", extra);

      const response = await fetch(
        "process.env.NEXT_PUBLIC_BACK_HOST/api/v1/eventos/inscripcion/",
        {
          method: "POST",
          body: extra,
        }
      );
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error("Error al enviar el formulario", response);
      }

      const data = await response.json();
      console.log("Inscripción exitosa:", data);
      setSubmitStatus({
        success: true,
        message: "Formulario enviado con éxito",
      });
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus({
        success: false,
        message: "Error al enviar el formulario",
      });
      console.log("Error al enviar el formulario", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">
          {formulario.titulo || "Formulario de inscripción"}
        </h2>
        <p className="text-slate-600 text-sm">
          {formulario.descripcion || "Complete todos los campos requeridos"}
        </p>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="nombre"
              className="text-sm font-medium text-slate-700 flex items-center gap-1"
            >
              Nombre
              <span className="text-red-500">*</span>
            </label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              maxLength={250}
              required={true}
              onChange={(e) => handleChange(e)}
              placeholder="Ingrese su Nombre"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-slate-900 placeholder-slate-400"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="primer_apellido"
              className="text-sm font-medium text-slate-700 flex items-center gap-1"
            >
              Apellido
              <span className="text-red-500">*</span>
            </label>
            <input
              id="primer_apellido"
              type="text"
              name="primer_apellido"
              maxLength={250}
              required={true}
              onChange={(e) => handleChange(e)}
              placeholder="Ingrese su Apellido"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-slate-900 placeholder-slate-400"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="identificacion"
              className="text-sm font-medium text-slate-700 flex items-center gap-1"
            >
              Identificación
              <span className="text-red-500">*</span>
            </label>
            <input
              id="identificacion"
              type="text"
              name="identificacion"
              maxLength={250}
              required={true}
              onChange={(e) => handleChange(e)}
              placeholder="V00000000"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-slate-900 placeholder-slate-400"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="correo"
              className="text-sm font-medium text-slate-700 flex items-center gap-1"
            >
              Correo
              <span className="text-red-500">*</span>
            </label>
            <input
              id="correo"
              type="email"
              name="correo"
              maxLength={250}
              required={true}
              onChange={(e) => handleChange(e)}
              placeholder="Ejemplo@mail.com..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-slate-900 placeholder-slate-400"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="telefono_movil"
              className="text-sm font-medium text-slate-700 flex items-center gap-1"
            >
              Número de telefono
              <span className="text-red-500">*</span>
            </label>
            <input
              id="telefono_movil"
              type="phone"
              name="telefono_movil"
              maxLength={250}
              required={true}
              onChange={(e) => handleChange(e)}
              placeholder="4100000000"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-slate-900 placeholder-slate-400"
            />
          </div>
          {/* fecha_de_nacimiento */}
          <div className="space-y-2">
            <label
              htmlFor="telefono_movil"
              className="text-sm font-medium text-slate-700 flex items-center gap-1"
            >
              Fecha de nacimiento
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="fecha_de_nacimiento"
                type="date"
                name="fecha_de_nacimiento"
                required={true}
                onChange={(e) => handleChange(e)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-slate-900"
              />
            </div>
          </div>
          {formulario.campos.map((campo) => (
            <div key={campo.nombre} className="space-y-2">
              <label
                htmlFor={campo.nombre}
                className="text-sm font-medium text-slate-700 flex items-center gap-1"
              >
                {campo.nombre.charAt(0).toUpperCase() + campo.nombre.slice(1)}
                {campo.requerido === "true" && (
                  <span className="text-red-500">*</span>
                )}
              </label>

              {campo.tipo === "texto" && (
                <input
                  id={campo.nombre}
                  type="text"
                  name={campo.nombre}
                  maxLength={campo.longitud_maxima}
                  required={campo.requerido === "true"}
                  onChange={(e) => handleChange(e)}
                  placeholder={`Ingrese ${campo.nombre.toLowerCase()}`}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-slate-900 placeholder-slate-400"
                />
              )}

              {campo.tipo === "numero" && (
                <input
                  id={campo.nombre}
                  type="number"
                  name={campo.nombre}
                  required={campo.requerido === "true"}
                  onChange={(e) => handleChange(e)}
                  placeholder={`Ingrese ${campo.nombre.toLowerCase()}`}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-slate-900 placeholder-slate-400"
                />
              )}

              {campo.tipo === "seleccion" && (
                <div className="relative">
                  <select
                    id={campo.nombre}
                    name={campo.nombre}
                    required={campo.requerido === "true"}
                    defaultValue={campo.nombre.toLowerCase()}
                    onChange={(e) => handleSelectChange(e)}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-slate-900 bg-white appearance-none"
                  >
                    <option value={campo.nombre.toLowerCase()} disabled>
                      {`Seleccione ${campo.nombre.toLowerCase()}`}
                    </option>
                    {campo.opciones.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion.charAt(0).toUpperCase() + opcion.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                    <svg
                      className="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              )}

              {campo.tipo === "archivo" && (
                <div className="flex flex-col gap-2">
                  <div
                    className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 border-slate-300 ${
                      isDragging ? "border-blue-500" : ""
                    }`}
                    onDrop={(e) => handleDrop(e)}
                    onDragEnter={(e) => handleDragEnter(e)}
                    onDragLeave={(e) => handleDragLeave(e)}
                    onDragOver={(e) => handleDragOver(e)}
                    data-input-name={campo.nombre}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-2 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-slate-500">
                        <span className="font-semibold">
                          Haga clic para cargar
                        </span>{" "}
                        o arrastre y suelte
                      </p>
                      <p className="text-xs text-slate-500">
                        {campo.tipo_archivo === "imagen"
                          ? "PNG o JPG"
                          : "Cualquier tipo de archivo"}
                      </p>
                      {campo.tamano_maximo && (
                        <p className="text-xs text-slate-500">
                          Tamaño máximo: {campo.tamano_maximo}
                        </p>
                      )}
                    </div>
                    <input
                      id={campo.nombre}
                      type="file"
                      name={campo.nombre}
                      accept={campo.tipo_archivo === "imagen" ? "image/*" : "*"}
                      required={campo.requerido === "true"}
                      onChange={(e) => handleChange(e)}
                      className="hidden"
                    />
                  </div>
                  {selectedFileName[campo.nombre] && (
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                      {selectedFileName[campo.nombre]}
                    </p>
                  )}
                </div>
              )}

              {campo.tipo === "fecha" && (
                <div className="relative">
                  <input
                    id={campo.nombre}
                    type="date"
                    name={campo.nombre}
                    required={campo.requerido === "true"}
                    onChange={(e) => handleChange(e)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-slate-900"
                  />
                </div>
              )}

              {campo.descripcion && (
                <p className="text-xs text-slate-500 mt-1">
                  {campo.descripcion}
                </p>
              )}
            </div>
          ))}
        </form>
      </div>
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col gap-4">
        {submitStatus && (
          <div
            className={`w-full p-3 rounded-md text-sm ${
              submitStatus.success
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {submitStatus.message}
          </div>
        )}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md font-medium text-white ${
            isSubmitting
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          }`}
        >
          {isSubmitting ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
