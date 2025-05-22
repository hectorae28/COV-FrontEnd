"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function NewElementForm({
  formData,
  onInputChange,
  validationErrors,
  isEditMode = false,
  onSave,
  onCancel
}) {
  const [localFormData, setLocalFormData] = useState(formData || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(localFormData);
    } else {
      onInputChange(localFormData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Contenido del formulario aquí */}
      
      {isEditMode && (
        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
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