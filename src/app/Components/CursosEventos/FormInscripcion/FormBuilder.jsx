"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Plus, Save, Trash2, ToggleLeft, X } from "lucide-react";
import { useEffect, useState } from "react";
import FormFieldItem from "./FormFieldItem";
import FormPreview from "./FormPreview";

const FIELD_TYPES = [
  { value: "seleccion", label: "Selección", icon: "list" },
  { value: "numero", label: "Número", icon: "hash" },
  { value: "texto", label: "Texto", icon: "type" },
  { value: "archivo", label: "Archivo", icon: "file" },
  { value: "fecha", label: "Fecha", icon: "calendar" },
  { value: "interruptor", label: "Interruptor", icon: "toggle-left" }
];

const DEFAULT_FIELDS = {
  // Keep existing DEFAULT_FIELDS
  seleccion: {
    tipo: "seleccion",
    nombre: "Nueva selección",
    opciones: ["Opción 1", "Opción 2", "Opción 3"],
    requerido: "true"
  },
  numero: {
    tipo: "numero",
    nombre: "Nuevo campo numérico",
    requerido: "true",
    longitud_maxima: 20
  },
  texto: {
    tipo: "texto",
    nombre: "Nuevo campo de texto",
    requerido: "true",
    longitud_maxima: 100
  },
  archivo: {
    tipo: "archivo",
    nombre: "Nuevo campo de archivo",
    requerido: "true",
    tipo_archivo: "imagen",
    tamano_maximo: "5MB"
  },
  fecha: {
    tipo: "fecha",
    nombre: "Nueva fecha",
    formato: "DD/MM/YYYY",
    requerido: "true"
  },
  interruptor: {
    tipo: "interruptor",
    nombre: "Nuevo interruptor",
    requerido: "true",
    valor_predeterminado: "false"
  }
};

export default function FormBuilder({ item, onBack, onSave }) {
  // Keep all existing state variables
  const [activeTab, setActiveTab] = useState("fields");
  const [formFields, setFormFields] = useState([]);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [isFormModified, setIsFormModified] = useState(false);
  const [includePriceField, setIncludePriceField] = useState(false);
  const [submitButtonText, setSubmitButtonText] = useState("Enviar inscripción");
  
  // New states for field adding flow
  const [showFieldTypes, setShowFieldTypes] = useState(false);
  const [tempNewField, setTempNewField] = useState(null);

  // Add the missing functions for field manipulation
  const deleteField = (index) => {
    setFormFields(prev => {
      const newFields = [...prev];
      newFields.splice(index, 1);
      return newFields;
    });
    
    if (selectedFieldIndex === index) {
      setSelectedFieldIndex(null);
    } else if (selectedFieldIndex > index) {
      setSelectedFieldIndex(prev => prev - 1);
    }
    
    setIsFormModified(true);
  };

  const moveField = (index, direction) => {
    const newFields = [...formFields];
    
    if (direction === "up" && index > 0) {
      // Swap with the field above
      [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
      setSelectedFieldIndex(index - 1);
    } else if (direction === "down" && index < newFields.length - 1) {
      // Swap with the field below
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
      setSelectedFieldIndex(index + 1);
    }
    
    setFormFields(newFields);
    setIsFormModified(true);
  };

  const updateField = (index, updatedField) => {
    const newFields = [...formFields];
    newFields[index] = updatedField;
    setFormFields(newFields);
    setIsFormModified(true);
  };

  // Your existing field functions
  const startAddingField = () => {
    setShowFieldTypes(true);
    setSelectedFieldIndex(null);
  };

  const selectFieldType = (fieldType) => {
    const newField = { ...DEFAULT_FIELDS[fieldType], id: Date.now() };
    setTempNewField(newField);
    setShowFieldTypes(false);
  };

  const updateTempField = (updatedField) => {
    setTempNewField(updatedField);
  };

  const confirmAddField = () => {
    if (tempNewField) {
      setFormFields([...formFields, tempNewField]);
      setIsFormModified(true);
      setTempNewField(null);
    }
  };

  const cancelAddField = () => {
    setTempNewField(null);
    setShowFieldTypes(false);
  };

  const handleSave = () => {
    const formData = {
      formulario: {
        campos: formFields
      }
    };

    // Log the JSON as specified
    console.log(JSON.stringify(formData, null, 2));

    if (onSave) {
      onSave({ ...item, formulario: formData.formulario });
    }
  };
  
  // Rest of your component remains unchanged...
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-16">
      {/* All your existing JSX remains the same */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center transition-colors hover:text-[#590248]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="cursor-pointer px-4 py-2 bg-gradient-to-r from-[#C40180] to-[#590248] text-white rounded-lg flex items-center shadow-md hover:shadow-lg hover:from-[#e20091] hover:to-[#e20091] transition-shadow"
            disabled={!isFormModified}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Formulario
          </motion.button>
        </div>

        {/* Keep existing header info section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {/* Keep existing header content */}
          <h1 className="text-2xl font-bold p-6 border-b border-gray-200">
            Crear Formulario
          </h1>
          <div className="p-6">
            {/* Keep event info and price field option */}
            {/* ... */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left panel: Form fields and editor */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-240px)] overflow-y-auto">
            <div className="flex border-b border-gray-200">
              <button
                className={`cursor-pointer px-6 py-3 text-sm font-medium ${activeTab === "fields"
                  ? "border-b-2 border-[#C40180] text-[#C40180]"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setActiveTab("fields")}
              >
                Campos del Formulario
              </button>
              <button
                className={`cursor-pointer px-6 py-3 text-sm font-medium ${activeTab === "settings"
                  ? "border-b-2 border-[#C40180] text-[#C40180]"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setActiveTab("settings")}
              >
                Ajustes del Formulario
              </button>
            </div>

            <div className="p-6">
              {activeTab === "fields" ? (
                <>
                  {/* Display existing fields */}
                  {formFields.length === 0 && !tempNewField && !showFieldTypes ? (
                    <div className="text-center py-6 text-gray-500">
                      No hay campos en el formulario. Añade uno utilizando el botón de abajo.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formFields.map((field, index) => {
                        // Verificar si es un campo de monto
                        const isPriceField = 
                          field.nombre.toLowerCase().includes("monto") || 
                          field.nombre.toLowerCase().includes("precio") ||
                          field.nombre.toLowerCase().includes("pago");
                        
                        return (
                          <div
                            key={index}
                            className={`p-3 border rounded-lg cursor-pointer hover:border-[#C40180] transition-colors ${selectedFieldIndex === index
                                ? "border-[#C40180] bg-[#C40180]/5"
                                : "border-gray-200"
                              } ${
                              isPriceField ? "border-orange-200 bg-orange-50" : ""
                              }`}
                            onClick={() => setSelectedFieldIndex(index)}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 mr-2">
                                  {
                                    FIELD_TYPES.find(
                                      (t) => t.value === field.tipo
                                    )?.label || field.tipo
                                  }
                                </span>
                                <span className="font-medium text-gray-800">
                                  {field.nombre}
                                </span>
                              </div>
                              <div className="flex space-x-1">
                                {field.requerido === "true" && (
                                  <span className="text-xs px-2 py-1 rounded bg-red-50 text-red-600">
                                    Requerido
                                  </span>
                                )}

                                {!(includePriceField && isPriceField) && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteField(index);
                                      }}
                                      className="p-1 text-gray-400 hover:text-red-500"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                              </div>
                            </div>
                            
                            {selectedFieldIndex === index && (
                              <div className="mt-3 border-t pt-3">
                                <FormFieldItem
                                  field={field}
                                  index={index}
                                  onUpdate={(updatedField) => updateField(index, updatedField)}
                                  onMove={(direction) => moveField(index, direction)}
                                  onDelete={() => deleteField(index)}
                                  isFirst={index === 0}
                                  isLast={index === formFields.length - 1}
                                  disableEditing={includePriceField && isPriceField}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Field Type Selection */}
                  {showFieldTypes && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-700">Selecciona el tipo de campo:</h3>
                        <button 
                          onClick={cancelAddField}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {FIELD_TYPES.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => selectFieldType(type.value)}
                            className="py-2 px-3 border border-gray-200 rounded-lg text-sm flex items-center justify-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Temporary field editor */}
                  {tempNewField && (
                    <div className="mt-4 p-4 border border-[#C40180] rounded-lg bg-[#C40180]/5">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-700">
                          Configurar nuevo campo: {
                            FIELD_TYPES.find(t => t.value === tempNewField.tipo)?.label || tempNewField.tipo
                          }
                        </h3>
                        <button 
                          onClick={cancelAddField}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      
                      <FormFieldItem
                        field={tempNewField}
                        index={-1}
                        onUpdate={updateTempField}
                        onMove={() => {}}
                        onDelete={() => {}}
                        isFirst={true}
                        isLast={true}
                      />
                      
                      <div className="flex items-center space-x-3 mt-4">
                        <button
                          type="button"
                          onClick={confirmAddField}
                          className="flex-1 py-2 px-4 rounded-md font-semibold text-white bg-gradient-to-r from-[#C40180] to-[#590248] hover:from-[#a80166] hover:to-[#470137] transition-all duration-300 shadow-md"
                        >
                          Agregar al formulario
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Add field button - only show when not already adding */}
                  {!tempNewField && !showFieldTypes && (
                    <button
                      onClick={startAddingField}
                      className="mt-4 w-full py-2 px-4 rounded-md font-medium text-[#C40180] border border-[#C40180] hover:bg-[#C40180]/5 transition-colors flex items-center justify-center"
                    >
                      <Plus size={16} className="mr-1" /> Añadir nuevo campo
                    </button>
                  )}
                </>
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-base font-medium text-gray-700 mb-3">
                    Ajustes generales
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Texto del botón de envío
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        value={submitButtonText}
                        onChange={(e) => setSubmitButtonText(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mensaje de confirmación
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        rows="3"
                        defaultValue="¡Gracias por registrarte! Hemos recibido tu solicitud correctamente."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Preview */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-240px)] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-3">
              <h3 className="font-medium text-gray-800">Vista previa del formulario</h3>
            </div>
            <div className="p-6">
              <FormPreview
                fields={formFields}
                isPaid={item.isPaid}
                price={item.price}
                currency={item.currency}
                submitButtonText={submitButtonText}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}