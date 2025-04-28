import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

export default function InfoContacto({ formData, onInputChange, validationErrors }) {
  // Format phone number as user types - only adds + at beginning
  const formatMobilePhone = (value) => {
    if (!value) return '+';

    // Remove all non-digit characters except the initial + if present
    if (value.startsWith('+')) {
      const digits = value.substring(1).replace(/\D/g, '');
      return `+${digits}`;
    } else {
      const digits = value.replace(/\D/g, '');
      return `+${digits}`;
    }
  };

  const formatHomePhone = (value) => {
    if (!value) return '';

    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');

    // Format as XXXX XXX XXXX
    if (digits.length <= 4) {
      return digits;
    } else if (digits.length <= 7) {
      return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    } else {
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      onInputChange({ [name]: formatMobilePhone(value) });
    } else if (name === 'homePhone') {
      onInputChange({ [name]: formatHomePhone(value) });
    } else {
      onInputChange({ [name]: value });
    }
  };

  // Initialize mobile phone field with '+' when component mounts or when it's empty
  const handleMobilePhoneFocus = (e) => {
    if (!e.target.value) {
      onInputChange({ 'phoneNumber': '+' });
    }
  };

  // Sample Venezuelan states
  const venezuelanStates = [
    'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar',
    'Carabobo', 'Cojedes', 'Delta Amacuro', 'Falcón', 'Guárico', 'Lara',
    'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa',
    'Sucre', 'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia'
  ];

  // Checks if a field is empty to display the required message
  const isFieldEmpty = (fieldName) => {
    return (!formData[fieldName] || formData[fieldName].trim() === "" || (fieldName === 'phoneNumber' && formData[fieldName] === '+'));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Email */}
      <div>
        <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
          Correo Electrónico
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 border ${isFieldEmpty("email") ? "border-gray-200" : "border-gray-200"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
            placeholder="ejemplo@correo.com"
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {isFieldEmpty("email") && (
          <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
        )}
      </div>
      {/* Phone Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mobile Phone */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Número de Teléfono Móvil
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber || '+'}
              onChange={handleChange}
              onFocus={handleMobilePhoneFocus}
              className={`w-full pl-10 pr-4 py-3 border ${isFieldEmpty("phoneNumber") ? "border-gray-200" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
              placeholder="+584241986646"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {isFieldEmpty("phoneNumber") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Debe ingresar el código de área seguido del número de servicio y número de teléfono. Ejemplo: 584241986646
          </p>
        </div>
        {/* Home Phone */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">
            Teléfono de Habitación
          </label>
          <div className="relative">
            <input
              type="tel"
              name="homePhone"
              value={formData.homePhone || ''}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
              placeholder="0212 123 4567"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      {/* State and City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Estado
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              name="state"
              value={formData.state || ''}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${isFieldEmpty("state") ? "border-gray-200" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700`}
            >
              <option value="">Seleccionar Estado</option>
              {venezuelanStates.map((state) => (
                <option key={state} value={state.toLowerCase()}>
                  {state}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          {isFieldEmpty("state") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
        {/* City */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Ciudad
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${isFieldEmpty("city") ? "border-gray-200" : "border-gray-200"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
            placeholder="Ingrese su ciudad"
          />
          {isFieldEmpty("city") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
      </div>
      {/* Home Address */}
      <div>
        <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
          Dirección de Habitación
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <textarea
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 border ${isFieldEmpty("address") ? "border-gray-200" : "border-gray-200"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] min-h-[100px]`}
            placeholder="Ingrese su dirección completa"
          />
          <MapPin className="absolute left-3 top-4 text-gray-400" />
        </div>
        {isFieldEmpty("address") && (
          <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
        )}
      </div>
    </motion.div>
  );
}