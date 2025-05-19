"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { useState } from "react";

export default function FormFieldItem({
  field,
  index,
  onUpdate,
  onMove,
  onDelete,
  isFirst,
  isLast,
  disableEditing = false // Nueva prop para deshabilitar la edición
}) {
  const [fieldData, setFieldData] = useState(field);

  const handleChange = (e) => {
    if (disableEditing) return;
    
    const { name, value } = e.target;
    const updatedField = { ...fieldData, [name]: value };
    setFieldData(updatedField);
    onUpdate(updatedField);
  };

  const handleRequiredChange = (e) => {
    if (disableEditing) return;
    
    const value = e.target.checked ? "true" : "false";
    const updatedField = { ...fieldData, requerido: value };
    setFieldData(updatedField);
    onUpdate(updatedField);
  };

  const handleOptionChange = (index, value) => {
    if (disableEditing) return;
    if (!fieldData.opciones) return;
    
    const updatedOptions = [...fieldData.opciones];
    updatedOptions[index] = value;
    
    const updatedField = { ...fieldData, opciones: updatedOptions };
    setFieldData(updatedField);
    onUpdate(updatedField);
  };

  const addOption = () => {
    if (disableEditing) return;
    
    if (!fieldData.opciones) {
      const updatedField = { ...fieldData, opciones: ["Nueva opción"] };
      setFieldData(updatedField);
      onUpdate(updatedField);
      return;
    }
    
    const updatedOptions = [...fieldData.opciones, "Nueva opción"];
    const updatedField = { ...fieldData, opciones: updatedOptions };
    setFieldData(updatedField);
    onUpdate(updatedField);
  };

  const removeOption = (index) => {
    if (disableEditing) return;
    if (!fieldData.opciones) return;
    
    const updatedOptions = fieldData.opciones.filter((_, i) => i !== index);
    const updatedField = { ...fieldData, opciones: updatedOptions };
    setFieldData(updatedField);
    onUpdate(updatedField);
  };
  
  // Verificar si es un campo de monto
  const isPriceField = 
    fieldData.nombre.toLowerCase().includes("monto") || 
    fieldData.nombre.toLowerCase().includes("precio") ||
    fieldData.nombre.toLowerCase().includes("pago");

  return (
    <div className={`${disableEditing ? "opacity-75" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-gray-700 flex items-center">
          Editar Campo #{index + 1}
          {disableEditing && (
            <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
              Auto-generado
            </span>
          )}
        </h3>
        <div className="flex space-x-1">
          <button
            onClick={() => onMove("up")}
            disabled={isFirst || disableEditing}
            className={`p-1 rounded ${
              isFirst || disableEditing ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
            }`}
            title="Mover arriba"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMove("down")}
            disabled={isLast || disableEditing}
            className={`p-1 rounded ${
              isLast || disableEditing ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
            }`}
            title="Mover abajo"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={disableEditing}
            className={`p-1 rounded ${
              disableEditing ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:bg-red-50"
            }`}
            title="Eliminar campo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del campo
          </label>
          <input
            type="text"
            name="nombre"
            value={fieldData.nombre || ""}
            onChange={handleChange}
            disabled={disableEditing}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
              disableEditing ? "bg-gray-100" : ""
            }`}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id={`required-${index}`}
            checked={fieldData.requerido === "true"}
            onChange={handleRequiredChange}
            disabled={disableEditing}
            className={`h-4 w-4 text-[#C40180] focus:ring-[#C40180] border-gray-300 rounded ${
              disableEditing ? "opacity-60" : ""
            }`}
          />
          <label
            htmlFor={`required-${index}`}
            className="ml-2 block text-sm text-gray-700"
          >
            Campo requerido
          </label>
        </div>
        
        {/* Campo especial para monto */}
        {isPriceField && fieldData.tipo === "numero" && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-700">
              Este campo muestra el monto a pagar. Se actualizará automáticamente con el precio configurado en el evento.
            </p>
            
            {fieldData.valor_predeterminado && (
              <p className="text-xs mt-1 text-gray-600">
                Valor predeterminado: {fieldData.valor_predeterminado}
              </p>
            )}
          </div>
        )}

        {fieldData.tipo === "seleccion" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opciones
            </label>
            <div className="space-y-2">
              {fieldData.opciones?.map((option, i) => (
                <div key={i} className="flex items-center">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    disabled={disableEditing}
                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                      disableEditing ? "bg-gray-100" : ""
                    }`}
                  />
                  <button
                    onClick={() => removeOption(i)}
                    disabled={fieldData.opciones.length <= 1 || disableEditing}
                    className={`ml-2 p-1 rounded ${
                      fieldData.opciones.length <= 1 || disableEditing
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-red-500 hover:bg-red-50"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {!disableEditing && (
                <button
                  onClick={addOption}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  + Añadir opción
                </button>
              )}
            </div>
          </div>
        )}

        {fieldData.tipo === "numero" && !isPriceField && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitud máxima
            </label>
            <input
              type="number"
              name="longitud_maxima"
              value={fieldData.longitud_maxima || 20}
              onChange={handleChange}
              min="1"
              max="100"
              disabled={disableEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                disableEditing ? "bg-gray-100" : ""
              }`}
            />
          </div>
        )}

        {fieldData.tipo === "texto" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitud máxima
            </label>
            <input
              type="number"
              name="longitud_maxima"
              value={fieldData.longitud_maxima || 100}
              onChange={handleChange}
              min="1"
              max="1000"
              disabled={disableEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                disableEditing ? "bg-gray-100" : ""
              }`}
            />
          </div>
        )}

        {fieldData.tipo === "archivo" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de archivo
              </label>
              <select
                name="tipo_archivo"
                value={fieldData.tipo_archivo || "imagen"}
                onChange={handleChange}
                disabled={disableEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  disableEditing ? "bg-gray-100" : ""
                }`}
              >
                <option value="imagen">Imagen</option>
                <option value="documento">Documento</option>
                <option value="pdf">PDF</option>
                <option value="cualquiera">Cualquier archivo</option>
              </select>
            </div>
          </div>
        )}

        {fieldData.tipo === "fecha" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Formato de fecha
            </label>
            <select
              name="formato"
              value={fieldData.formato || "DD/MM/YYYY"}
              onChange={handleChange}
              disabled={disableEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                disableEditing ? "bg-gray-100" : ""
              }`}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}