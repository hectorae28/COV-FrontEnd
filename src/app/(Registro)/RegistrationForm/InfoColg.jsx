import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function InfoColegiado({ formData, onInputChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onInputChange({ [name]: value });
  };

  const professionalFields = [
    'Medicina', 'Ingeniería', 'Derecho', 'Arquitectura', 
    'Psicología', 'Contaduría', 'Otra'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Graduate Institute */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
          Instituto donde se Graduó
        </label>
        <input 
          type="text"
          name="graduateInstitute"
          value={formData.graduateInstitute}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
          placeholder="Nombre del instituto de graduación"
        />
      </div>

      {/* University */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
          Universidad que Expidió el Título
        </label>
        <input 
          type="text"
          name="universityTitle"
          value={formData.universityTitle}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
          placeholder="Nombre completo de la universidad"
        />
      </div>

      {/* Registration Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Número de Registro Principal
          </label>
          <input 
            type="text"
            name="mainRegistrationNumber"
            value={formData.mainRegistrationNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
            placeholder="Número de registro"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Fecha de Registro Principal
          </label>
          <div className="relative">
            <input 
              type="date"
              name="mainRegistrationDate"
              value={formData.mainRegistrationDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-[#D7008A] 
              text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* M.P.P.S Registration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Número de Registro M.P.P.S
          </label>
          <input 
            type="text"
            name="mppsRegistrationNumber"
            value={formData.mppsRegistrationNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
            placeholder="Número de registro M.P.P.S"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Fecha de Registro M.P.P.S
          </label>
          <div className="relative">
            <input 
              type="date"
              name="mppsRegistrationDate"
              value={formData.mppsRegistrationDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-[#D7008A] 
              text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Title Issuance Date */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Fecha de Emisión del Título
        </label>
        <div className="relative">
          <input 
            type="date"
            name="titleIssuanceDate"
            value={formData.titleIssuanceDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-[#D7008A] 
            text-gray-700"
          />
        </div>
      </div>

      {/* Attention Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
        <div className="flex items-center">
          <AlertTriangle className="text-yellow-500 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-yellow-800">
            ¡Atención Colegiado!
          </h3>
        </div>
        <p className="mt-2 text-yellow-700 text-sm">
          La fecha de emisión del título es importante y aparecerá en documentos oficiales. 
          Verifique que la información proporcionada sea precisa y coincida con sus documentos originales.
        </p>
      </div>
    </motion.div>
  );
}