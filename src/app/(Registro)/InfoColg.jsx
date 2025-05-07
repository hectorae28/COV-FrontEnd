import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function InfoColegiado({ formData, onInputChange, validationErrors, isProfileEdit }) {
  const [showTitleDateWarning, setShowTitleDateWarning] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onInputChange({ [name]: value });
  };

  // Checks if a field has validation errors to display the required message
  const isFieldEmpty = (fieldName) => {
    return validationErrors && validationErrors[fieldName];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Graduate Institute */}
      <div>
        <label className="mb-2 text-sm font-medium text-[#41023B] flex items-center">
          Liceo/Colegio de Egreso (Bachillerato)
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          name="graduateInstitute"
          value={formData.graduateInstitute}
          onChange={handleChange}
          className={`w-full px-4 py-3 border ${isFieldEmpty("graduateInstitute") ? "border-red-500 bg-red-50" : "border-gray-200"
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
          placeholder="Nombre del instituto de graduación"
        />
        {isFieldEmpty("graduateInstitute") && (
          <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
        )}
      </div>

      {/* University */}
      <div>
        <label className="mb-2 text-sm font-medium text-[#41023B] flex items-center">
          Institución de Educación Superior (universidad)
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          name="universityTitle"
          value={formData.universityTitle}
          onChange={handleChange}
          className={`w-full px-4 py-3 border ${isFieldEmpty("universityTitle") ? "border-red-500 bg-red-50" : "border-gray-200"
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
          placeholder="Nombre completo de la universidad"
        />
        {isFieldEmpty("universityTitle") && (
          <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
        )}
      </div>

      {/* Registration Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Número de Registro Principal
            <span className="text-red-500 ml-1">*</span>
          </label>
          {isProfileEdit ? (
            // En modo perfil, no editable
            <input
              type="text"
              value={formData.mainRegistrationNumber ? `COV-${formData.mainRegistrationNumber}` : "No especificado"}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
              disabled
            />
          ) : (
            // En modo normal, editable
            <input
              type="text"
              name="mainRegistrationNumber"
              value={formData.mainRegistrationNumber}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${isFieldEmpty("mainRegistrationNumber") ? "border-red-500 bg-red-50" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
              placeholder="Número de registro"
            />
          )}
          {isProfileEdit && (
            <p className="mt-1 text-xs text-gray-500">Este campo no se puede editar</p>
          )}
          {isFieldEmpty("mainRegistrationNumber") && !isProfileEdit && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Fecha de Registro Principal
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            {isProfileEdit ? (
              // En modo perfil, no editable
              <input
                type="text"
                value={formData.mainRegistrationDate || "No especificada"}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
                disabled
              />
            ) : (
              // En modo normal, editable
              <input
                type="date"
                name="mainRegistrationDate"
                value={formData.mainRegistrationDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${isFieldEmpty("mainRegistrationDate") ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] text-gray-700`}
              />
            )}
          </div>
          {isProfileEdit && (
            <p className="mt-1 text-xs text-gray-500">Este campo no se puede editar</p>
          )}
          {isFieldEmpty("mainRegistrationDate") && !isProfileEdit && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
      </div>

      {/* M.P.P.S Registration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Número de Registro M.P.P.S
            <span className="text-red-500 ml-1">*</span>
          </label>
          {isProfileEdit ? (
            // En modo perfil, no editable
            <input
              type="text"
              value={formData.mppsRegistrationNumber || "No especificado"}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
              disabled
            />
          ) : (
            // En modo normal, editable
            <input
              type="text"
              name="mppsRegistrationNumber"
              value={formData.mppsRegistrationNumber}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${isFieldEmpty("mppsRegistrationNumber") ? "border-red-500 bg-red-50" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
              placeholder="Número de registro M.P.P.S"
            />
          )}
          {isProfileEdit && (
            <p className="mt-1 text-xs text-gray-500">Este campo no se puede editar</p>
          )}
          {isFieldEmpty("mppsRegistrationNumber") && !isProfileEdit && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Fecha de Registro M.P.P.S
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            {isProfileEdit ? (
              // En modo perfil, no editable
              <input
                type="text"
                value={formData.mppsRegistrationDate || "No especificada"}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
                disabled
              />
            ) : (
              // En modo normal, editable
              <input
                type="date"
                name="mppsRegistrationDate"
                value={formData.mppsRegistrationDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${isFieldEmpty("mppsRegistrationDate") ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] text-gray-700`}
              />
            )}
          </div>
          {isProfileEdit && (
            <p className="mt-1 text-xs text-gray-500">Este campo no se puede editar</p>
          )}
          {isFieldEmpty("mppsRegistrationDate") && !isProfileEdit && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
      </div>

      {/* Title Issuance Date */}
      <div className="relative">
        <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
          Fecha de Emisión del Título
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <input
            type="date"
            name="titleIssuanceDate"
            value={formData.titleIssuanceDate}
            onChange={handleChange}
            onFocus={() => setShowTitleDateWarning(true)}
            onBlur={() => setShowTitleDateWarning(false)}
            className={`w-full px-4 py-3 border ${isFieldEmpty("titleIssuanceDate") ? "border-red-500 bg-red-50" : "border-gray-200"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] text-gray-700`}
          />
        </div>
        {isFieldEmpty("titleIssuanceDate") && (
          <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
        )}

        {/* Warning message that appears when date field is focused */}
        {showTitleDateWarning && (
          <div className="absolute z-10 mt-2 w-full sm:w-80 md:w-96 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r shadow-md">
            <div className="flex items-center">
              <AlertTriangle
                className="text-yellow-500 mr-2 flex-shrink-0"
                size={20}
              />
              <h3 className="text-sm font-semibold text-yellow-800">
                ¡Atención Colegiado!
              </h3>
            </div>
            <p className="mt-1 text-yellow-700 text-xs">
              La fecha de emisión del título es importante y aparecerá en
              documentos oficiales. Verifique que la información proporcionada
              sea precisa.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}