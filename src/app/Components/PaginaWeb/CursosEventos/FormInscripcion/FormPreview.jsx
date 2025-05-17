"use client";

export default function FormPreview({ fields, isPaid, price, currency }) {
  // Helper para obtener el símbolo de la moneda
  const getCurrencySymbol = (currencyCode) => {
    switch(currencyCode) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'BS': return 'Bs';
      default: return '$';
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-6">
        Formulario de Inscripción
      </h3>

      <div className="space-y-6">
        {fields.map((field, index) => {
          // Verificamos si es un campo de monto
          const isPriceField = 
            field.nombre.toLowerCase().includes("monto") || 
            field.nombre.toLowerCase().includes("precio") ||
            field.nombre.toLowerCase().includes("pago");
            
          return (
            <div key={index} className={`space-y-2 ${isPriceField ? "bg-gray-100 p-3 rounded-lg border border-[#590248]" : ""}`}>
              <label className="block text-sm font-medium text-gray-700">
                {field.nombre}
                {field.requerido === "true" && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>

              {field.tipo === "seleccion" && (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  disabled
                >
                  <option value="">Seleccione una opción</option>
                  {field.opciones?.map((option, i) => (
                    <option key={i} value={option.toLowerCase().replace(/ /g, "_")}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {field.tipo === "numero" && (
                <input
                  type="number"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${isPriceField ? "bg-[#590248]/10 border-[#590248] font-medium" : ""}`}
                  placeholder={`Ingrese un valor numérico (máx. ${field.longitud_maxima} dígitos)`}
                  value={isPriceField && price ? price : ""}
                  disabled
                />
              )}

              {field.tipo === "texto" && (
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder={`Ingrese texto (máx. ${field.longitud_maxima} caracteres)`}
                  disabled
                />
              )}

              {field.tipo === "archivo" && (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-center w-full">
                    <label
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-not-allowed bg-gray-50"
                    >
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
                          (máx. {field.tamano_maximo})
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {field.tipo === "fecha" && (
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  disabled
                />
              )}

              {field.tipo !== "archivo" && field.requerido === "true" && !isPriceField && (
                <p className="text-xs text-gray-500">Este campo es obligatorio</p>
              )}
              
              {isPriceField && (
                <p className="text-xs text-[#590248]">Monto a pagar por la inscripción</p>
              )}
            </div>
          );
        })}

        <div className="pt-4">
          <button className="w-full px-4 py-3 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow cursor-not-allowed">
            Enviar inscripción
          </button>
        </div>
      </div>
    </div>
  );
}