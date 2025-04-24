import { motion } from "framer-motion"

export default function InfoLaboral({ formData, onInputChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onInputChange({ [name]: value })
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">Nombre de Institución</label>
          <input 
            type="text"
            name="institutionName"
            value={formData.institutionName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
            placeholder="Nombre de la institución donde presta servicio"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">Dirección de Institución</label>
          <input 
            type="text"
            name="institutionAddress"
            value={formData.institutionAddress}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
            placeholder="Dirección completa de la institución"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">Teléfono de Institución</label>
          <input 
            type="text"
            name="institutionPhone"
            value={formData.institutionPhone}
            onChange={handleChange}
            maxLength="11"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
            placeholder="Número de teléfono de la institución"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">Nombre de Clínica Privada</label>
          <input 
            type="text"
            name="clinicName"
            value={formData.clinicName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
            placeholder="Nombre de la clínica privada"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">Dirección de Clínica</label>
          <input 
            type="text"
            name="clinicAddress"
            value={formData.clinicAddress}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
            placeholder="Dirección completa de la clínica"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">Teléfono de Clínica</label>
          <input 
            type="text"
            name="clinicPhone"
            value={formData.clinicPhone}
            onChange={handleChange}
            maxLength="11"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
            placeholder="Número de teléfono de la clínica"
          />
        </div>
      </div>
    </motion.div>
  )
}