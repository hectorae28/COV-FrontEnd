"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import FormFieldItem from "./FormFieldItem";
import FormPreview from "./FormPreview";

const FIELD_TYPES = [
  { value: "seleccion", label: "Selección", icon: "list" },
  { value: "numero", label: "Número", icon: "hash" },
  { value: "texto", label: "Texto", icon: "type" },
  { value: "archivo", label: "Archivo", icon: "file" },
  { value: "fecha", label: "Fecha", icon: "calendar" }
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
  }
};

export default function FormBuilder({ item, onBack, onSave }) {
  const [activeTab, setActiveTab] = useState("fields");
  const [formFields, setFormFields] = useState([]);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [isFormModified, setIsFormModified] = useState(false);

  // Nuevo estado para campos de pago
  const [includePriceField, setIncludePriceField] = useState(false);

  // Inicializar campos del formulario si el item ya tiene un formulario
  useEffect(() => {
    if (item?.formulario?.campos && Array.isArray(item.formulario.campos)) {
      setFormFields(item.formulario.campos);

      // Verificar si ya existe un campo de monto
      const hasPriceField = item.formulario.campos.some(
        field => field.nombre.toLowerCase().includes("monto") ||
          field.nombre.toLowerCase().includes("precio") ||
          field.nombre.toLowerCase().includes("pago")
      );
      setIncludePriceField(hasPriceField);
    } else {
      // Formulario predeterminado con campos básicos si es nuevo
      setFormFields([
        {
          tipo: "seleccion",
          nombre: "Tipo identificacion",
          opciones: ["cedula", "pasaporte", "otro"],
          requerido: "true"
        },
        {
          tipo: "numero",
          nombre: "Número identificacion",
          requerido: "true",
          longitud_maxima: 20
        }
      ]);
    }
  }, [item]);

  // Efecto para agregar/eliminar automáticamente el campo de monto si el evento es de pago
  useEffect(() => {
    // Si el evento es de pago y se activa includePriceField
    if (item?.isPaid && includePriceField) {
      // Verificar si ya existe un campo de monto
      const priceFieldExists = formFields.some(
        field => field.nombre.toLowerCase().includes("monto") ||
          field.nombre.toLowerCase().includes("precio") ||
          field.nombre.toLowerCase().includes("pago")
      );

      // Agregar campo de monto si no existe
      if (!priceFieldExists) {
        const priceField = {
          tipo: "numero",
          nombre: `Monto a pagar (${item.currency || 'USD'})`,
          requerido: "true",
          longitud_maxima: 10,
          valor_predeterminado: item.price || "0.00"
        };

        setFormFields(prev => [...prev, priceField]);
        setIsFormModified(true);
      }
    }
    // Si se desactiva la opción, eliminar el campo de monto si existe
    else if (!includePriceField) {
      const updatedFields = formFields.filter(
        field => !(
          field.nombre.toLowerCase().includes("monto") ||
          field.nombre.toLowerCase().includes("precio") ||
          field.nombre.toLowerCase().includes("pago")
        )
      );

      if (updatedFields.length !== formFields.length) {
        setFormFields(updatedFields);
        setIsFormModified(true);
      }
    }
  }, [includePriceField, item?.isPaid, item?.currency, item?.price]);

  // Añadir un nuevo campo
  const addField = (fieldType) => {
    const newField = { ...DEFAULT_FIELDS[fieldType], id: Date.now() };
    setFormFields([...formFields, newField]);
    setSelectedFieldIndex(formFields.length);
    setIsFormModified(true);
  };

  // Actualizar un campo existente
  const updateField = (index, updatedField) => {
    const updatedFields = [...formFields];
    updatedFields[index] = updatedField;
    setFormFields(updatedFields);
    setIsFormModified(true);
  };

  // Eliminar un campo
  const deleteField = (index) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
    setSelectedFieldIndex(null);
    setIsFormModified(true);
  };

  // Mover un campo hacia arriba o abajo
  const moveField = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === formFields.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedFields = [...formFields];
    [updatedFields[index], updatedFields[newIndex]] = [
      updatedFields[newIndex],
      updatedFields[index]
    ];

    setFormFields(updatedFields);
    setSelectedFieldIndex(newIndex);
    setIsFormModified(true);
  };

  // Guardar el formulario
  const handleSave = () => {
    const formData = {
      formulario: {
        campos: formFields
      }
    };

    // Mostrar el JSON en la consola como se especificó
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
            {item.formulario ? "Editar Formulario de Registro" : "Crear Formulario de Registro"}
          </h1>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#C40180]/20 flex items-center justify-center mr-4">
                <span className="text-[#C40180] text-xl font-bold">
                  {item.title?.charAt(0) || "E"}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.title || "Sin título"}
                </h2>
                <p className="text-sm text-gray-500">
                  {item.date} • {item.location || "Sin ubicación"}
                </p>
              </div>

              {/* Badge para evento pago/gratis */}
              {item.isPaid ? (
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  {item.price && `${item.currency || 'USD'} ${item.price}`} • Pago
                </div>
              ) : (
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Pase Libre
                </div>
              )}
            </div>

            {/* Opción para incluir campo de pago */}
            {item.isPaid && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="include-price-field"
                    checked={includePriceField}
                    onChange={(e) => setIncludePriceField(e.target.checked)}
                    className="h-4 w-4 text-[#C40180] focus:ring-[#C40180] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="include-price-field"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Incluir campo de monto a pagar en el formulario ({item.price} {item.currency})
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Esto añadirá automáticamente un campo para que el usuario vea el monto a pagar
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel izquierdo: Lista de campos y editor */}
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
                  <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-500 w-full mb-2">
                      Añadir nuevo campo:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {FIELD_TYPES.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => addField(type.value)}
                          className="cursor-pointer px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center hover:border-[#C40180] hover:text-[#C40180] transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          <span>{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {formFields.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      No hay campos en el formulario. Añade uno utilizando los botones de arriba.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formFields.map((field, index) => (
                        <div
                          key={index}
                          className={`p-3 border rounded-lg cursor-pointer hover:border-[#C40180] transition-colors ${selectedFieldIndex === index
                              ? "border-[#C40180] bg-[#C40180]/5"
                              : "border-gray-200"
                            } ${
                            // Destacar los campos de monto
                            field.nombre.toLowerCase().includes("monto") ||
                              field.nombre.toLowerCase().includes("precio") ||
                              field.nombre.toLowerCase().includes("pago")
                              ? "border-orange-200 bg-orange-50"
                              : ""
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

                              {/* No mostrar el botón de eliminar para campos de monto si includePriceField está activo */}
                              {!(includePriceField &&
                                (field.nombre.toLowerCase().includes("monto") ||
                                  field.nombre.toLowerCase().includes("precio") ||
                                  field.nombre.toLowerCase().includes("pago"))) && (
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
                        </div>
                      ))}
                    </div>
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
                        defaultValue="Enviar inscripción"
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

              {selectedFieldIndex !== null && activeTab === "fields" && (
                <div className="mt-6 p-4 border border-gray-200 rounded-xl">
                  <FormFieldItem
                    field={formFields[selectedFieldIndex]}
                    index={selectedFieldIndex}
                    onUpdate={(updatedField) =>
                      updateField(selectedFieldIndex, updatedField)
                    }
                    onMove={(direction) =>
                      moveField(selectedFieldIndex, direction)
                    }
                    onDelete={() => deleteField(selectedFieldIndex)}
                    isFirst={selectedFieldIndex === 0}
                    isLast={selectedFieldIndex === formFields.length - 1}
                    // Deshabilitar edición para campos de monto si includePriceField está activo
                    disableEditing={
                      includePriceField &&
                      (formFields[selectedFieldIndex].nombre.toLowerCase().includes("monto") ||
                        formFields[selectedFieldIndex].nombre.toLowerCase().includes("precio") ||
                        formFields[selectedFieldIndex].nombre.toLowerCase().includes("pago"))
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {/* Panel derecho: Vista previa */}
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}