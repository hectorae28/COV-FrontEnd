import { motion } from "framer-motion";
import { Pencil, Save, X } from 'lucide-react';
import { useState } from 'react';

export default function EditableSection({
  title,
  icon,
  readOnly = false,
  onSave,
  onCancel,
  renderViewMode,
  renderEditMode,
  initialData,
  initiallyEditing = false,
  transitionDelay = 0,
  className = ""
}) {
  const [editing, setEditing] = useState(initiallyEditing);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    await onSave();
    setEditing(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setHasChanges(false);
    if (onCancel) onCancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: transitionDelay }}
      className={`bg-white rounded-lg shadow-md p-6 border border-gray-100 ${className}`}
    >
      <div className="flex items-center justify-between mb-5 border-b pb-3">
        <div className="flex items-center">
          {icon && <span className="text-[#C40180] mr-2">{icon}</span>}
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>

        {!editing && !readOnly ? (
          <button
            onClick={() => setEditing(true)}
            className="cursor-pointer bg-gradient-to-r from-[#C40180] to-[#590248] text-white px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:opacity-90 transition-colors"
          >
            <Pencil size={16} className="mr-1" />
            Editar
          </button>
        ) : !readOnly ? (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="cursor-pointer bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md flex items-center text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <X size={16} className="mr-1" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`cursor-pointer bg-green-100 text-green-700 px-3 py-1.5 rounded-md flex items-center text-sm font-medium ${hasChanges ? 'hover:bg-green-200' : 'opacity-60 cursor-not-allowed'} transition-colors`}
            >
              <Save size={16} className="mr-1" />
              Guardar
            </button>
          </div>
        ) : null}
      </div>

      {editing ? renderEditMode(setHasChanges) : renderViewMode()}
    </motion.div>
  );
}