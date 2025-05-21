"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("fields");
  const [formFields, setFormFields] = useState(item.formulario?.campos || []);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [isFormModified, setIsFormModified] = useState(false);
  const [includePriceField, setIncludePriceField] = useState(
    formFields.some(field =>
      field.nombre.toLowerCase().includes("monto") ||
      field.nombre.toLowerCase().includes("precio") ||
      field.nombre.toLowerCase().includes("pago")
    )
  );
  const [submitButtonText, setSubmitButtonText] = useState("Enviar inscripción");

  // States for field adding flow
  const [showFieldTypes, setShowFieldTypes] = useState(false);
  const [tempNewField, setTempNewField] = useState(null);

  // Function to add a price field
  const addPriceField = () => {
    if (includePriceField) return;

    const priceField = {
      tipo: "numero",
      nombre: "Monto a pagar",
      requerido: "true",
      longitud_maxima: 10,
      id: Date.now()
    };

    setFormFields([...formFields, priceField]);
    setIncludePriceField(true);
    setIsFormModified(true);
  };

  // Field manipulation functions
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
      [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
      if (selectedFieldIndex === index) {
        setSelectedFieldIndex(index - 1);
      } else if (selectedFieldIndex === index - 1) {
        setSelectedFieldIndex(index);
      }
    } else if (direction === "down" && index < newFields.length - 1) {
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
      if (selectedFieldIndex === index) {
        setSelectedFieldIndex(index + 1);
      } else if (selectedFieldIndex === index + 1) {
        setSelectedFieldIndex(index);
      }
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

  // Field adding functions
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
    if (tempNewField) {
      setTempNewField(null);
    } else if (showFieldTypes) {
      setShowFieldTypes(false);
    }
  };

  const handleSave = () => {
    const formData = {
      formulario: {
        campos: formFields
      }
    };

    console.log(JSON.stringify(formData, null, 2));

    if (onSave) {
      onSave({ ...item, formulario: formData.formulario });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-16">
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

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <h1 className="text-2xl font-bold p-6 border-b border-gray-200">
            Crear Formulario
          </h1>
          <div className="p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium text-gray-700">Información del evento</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">
                    {item.isPaid || item.precio ? "Evento/Curso de pago" : "Evento/Curso gratuito"}
                  </span>
                  {(item.isPaid || item.precio) && (
                    <button
                      onClick={addPriceField}
                      disabled={includePriceField}
                      className={`px-3 py-1 text-xs rounded-md ${includePriceField
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                    >
                      {includePriceField ? "Campo de monto añadido" : "Añadir campo de monto"}
                    </button>
                  )}
                </div>
              </div>
              {(item.isPaid || item.precio) && (
                <p className="text-sm text-gray-500 mt-1">
                  Precio: {item.currency || "$"} {item.price || item.precio || "0.00"}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  {formFields.length === 0 && !tempNewField && !showFieldTypes ? (
                    <div className="text-center py-6 text-gray-500">
                      No hay campos en el formulario. Añade uno utilizando el botón de abajo.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formFields.map((field, index) => {
                        const isPriceField =
                          field.nombre.toLowerCase().includes("monto") ||
                          field.nombre.toLowerCase().includes("precio") ||
                          field.nombre.toLowerCase().includes("pago");

                        return (
                          <div
                            key={index}
                            className={`p-3 border rounded-lg transition-colors ${selectedFieldIndex === index ? 'border-[#C40180] bg-[#C40180]/5' : 'border-gray-200'} ${isPriceField ? 'border-orange-200 bg-orange-50' : ''}`}
                          >
                            <div
                              className="flex justify-between items-center cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFieldIndex(selectedFieldIndex === index ? null : index);
                              }}
                            >
                              <div className="flex items-center">
                                <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 mr-2">
                                  {FIELD_TYPES.find(t => t.value === field.tipo)?.label || field.tipo}
                                </span>
                                <span className="font-medium text-gray-800">{field.nombre}</span>
                              </div>
                              <div className="flex space-x-1">
                                {field.requerido === "true" && <span className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 mr-2">Requerido</span>}
                                <button
                                  onClick={(e) => { e.stopPropagation(); moveField(index, 'up'); }}
                                  disabled={index === 0}
                                  className={`p-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                                  type="button"
                                >
                                  <ArrowUp size={14} />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); moveField(index, 'down'); }}
                                  disabled={index === formFields.length - 1}
                                  className={`p-1 rounded ${index === formFields.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                                  type="button"
                                >
                                  <ArrowDown size={14} />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); deleteField(index); }}
                                  className="p-1 text-gray-400 hover:text-red-500"
                                  type="button"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            {selectedFieldIndex === index && (
                              <div
                                className="mt-3 border-t pt-3"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex justify-end mb-2">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedFieldIndex(null); }}
                                    className="text-gray-500 hover:text-[#C40180] flex items-center text-sm"
                                    type="button"
                                  >
                                    <X size={16} className="mr-1" /> Cerrar edición
                                  </button>
                                </div>
                                <FormFieldItem
                                  field={field}
                                  index={index}
                                  onUpdate={(updatedField) => updateField(index, updatedField)}
                                  onMove={(direction) => moveField(index, direction)}
                                  onDelete={() => deleteField(index)}
                                  isFirst={index === 0}
                                  isLast={index === formFields.length - 1}
                                  disableEditing={includePriceField && isPriceField}
                                  hideControls={true}
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
                      … (rest unchanged) …
                    </div>
                  )}

                  {/* Temporary field editor */}
                  {tempNewField && (
                    <div className="mt-4 p-4 border border-[#C40180] rounded-lg bg-[#C40180]/5">
                      … (rest unchanged) …
                    </div>
                  )}

                  {!tempNewField && !showFieldTypes && (
                    <button
                      onClick={(e) => { e.stopPropagation(); startAddingField(); }}
                      className="mt-4 w-full py-2 px-4 rounded-md font-medium text-[#C40180] border border-[#C40180] hover:bg-[#C40180]/5 transition-colors flex items-center justify-center"
                      type="button"
                    >
                      <Plus size={16} className="mr-1" /> Añadir nuevo campo
                    </button>
                  )}
                </>
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl">
                  … configuraciones …
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
                isPaid={item.isPaid || (item.precio && parseFloat(item.precio) > 0)}
                price={item.price || item.precio || "0.00"}
                currency={item.currency || "$"}
                submitButtonText={submitButtonText}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}