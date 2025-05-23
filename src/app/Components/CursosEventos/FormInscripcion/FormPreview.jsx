"use client"
import { useState } from "react"

export default function FormPreview({ fields, isPaid, price, currency, submitButtonText = "Enviar inscripción" }) {
  const [formState, setFormState] = useState({})
  const [showDropdown, setShowDropdown] = useState(null)

  const handleChange = (fieldId, value) => {
    setFormState({ ...formState, [fieldId]: value })
  }

  const toggleDropdown = (index) => {
    setShowDropdown(showDropdown === index ? null : index)
  }

  // Si no hay campos, mostrar un mensaje
  if (!fields || fields.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Vista Previa del Formulario</h3>
        <p className="text-gray-500">
          No hay campos en el formulario. Añade campos utilizando el panel de la izquierda.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-6">Formulario de Inscripción</h3>

      <div className="space-y-6">
        {fields.map((field, index) => {
          const isPriceField =
            field.nombre.toLowerCase().includes("monto") ||
            field.nombre.toLowerCase().includes("precio") ||
            field.nombre.toLowerCase().includes("pago")

          const fieldId = `field-${index}`

          return (
            <div
              key={index}
              className={`space-y-2 ${isPriceField ? "bg-gray-100 p-3 rounded-lg border border-[#590248]" : ""}`}
            >
              <label className="block text-sm font-medium text-gray-700">
                {field.nombre}
                {field.requerido === "true" && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.tipo === "seleccion" && (
                <div className="relative">
                  <div
                    onClick={() => toggleDropdown(index)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white mb-2 cursor-pointer flex justify-between items-center"
                  >
                    <span>{formState[fieldId] || "Seleccione una opción"}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>

                  {showDropdown === index && (
                    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
                      {field.opciones?.map((option, i) => (
                        <div
                          key={i}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            handleChange(fieldId, option)
                            toggleDropdown(null)
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {field.tipo === "numero" && (
                <input
                  type="number"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${isPriceField ? "bg-[#590248]/10 border-[#590248] font-medium" : ""}`}
                  placeholder={`Ingrese un valor numérico (máx. ${field.longitud_maxima} dígitos)`}
                  value={isPriceField && price ? price : formState[fieldId] || ""}
                  onChange={(e) => handleChange(fieldId, e.target.value)}
                  readOnly={isPriceField}
                />
              )}

              {field.tipo === "texto" && (
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder={`Ingrese texto (máx. ${field.longitud_maxima} caracteres)`}
                  value={formState[fieldId] || ""}
                  onChange={(e) => handleChange(fieldId, e.target.value)}
                />
              )}

              {field.tipo === "archivo" && (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <p className="mb-1 text-sm text-gray-500">
                          <span className="font-medium">Haga clic para subir</span> o arrastre y suelte
                        </p>
                        <p className="text-xs text-gray-500">
                          {field.tipo_archivo === "imagen"
                            ? "PNG, JPG o GIF"
                            : field.tipo_archivo === "documento"
                              ? "DOC, DOCX o TXT"
                              : field.tipo_archivo === "pdf"
                                ? "PDF"
                                : "Cualquier archivo"}{" "}
                          (máx. {field.tamano_maximo || "5MB"})
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleChange(fieldId, e.target.files[0].name)
                          }
                        }}
                      />
                    </label>
                  </div>
                  {formState[fieldId] && (
                    <p className="text-xs text-gray-600">Archivo seleccionado: {formState[fieldId]}</p>
                  )}
                </div>
              )}

              {field.tipo === "fecha" && (
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={formState[fieldId] || ""}
                  onChange={(e) => handleChange(fieldId, e.target.value)}
                />
              )}

              {field.tipo === "interruptor" && (
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        formState[fieldId] !== undefined ? formState[fieldId] : field.valor_predeterminado === "true"
                      }
                      onChange={(e) => handleChange(fieldId, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C40180]"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {(formState[fieldId] !== undefined ? formState[fieldId] : field.valor_predeterminado === "true")
                        ? "Activado"
                        : "Desactivado"}
                    </span>
                  </label>
                </div>
              )}

              {field.tipo !== "archivo" && field.requerido === "true" && !isPriceField && (
                <p className="text-xs text-gray-500">Este campo es obligatorio</p>
              )}

              {isPriceField && <p className="text-xs text-[#590248]">Monto a pagar por la inscripción</p>}
            </div>
          )
        })}

        <div className="pt-4">
          <button
            onClick={() => alert("Formulario enviado (simulación)")}
            className="w-full px-4 py-3 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
          >
            {submitButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}
