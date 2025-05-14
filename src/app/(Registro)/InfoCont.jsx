import CountryFlag from "@/Shared/CountryFlag";
import PhoneEstData from "@/Shared/EstadoData";
import phoneCodes from "@/Shared/TelefonoData";
import { motion } from "framer-motion";
import { ChevronDown, Mail, MapPin, Phone, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";


// Función para capitalizar la primera letra de cada palabra
const capitalizeWords = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function InfoContacto({ formData, onInputChange, validationErrors, isProfileEdit }) {
  const [cities, setCities] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  
  // Ordenamos los códigos telefónicos alfabéticamente por nombre de país
  const sortedPhoneCodes = useMemo(() => {
    return [...phoneCodes].sort((a, b) => a.pais.localeCompare(b.pais));
  }, []);
  
  // Filtramos los códigos telefónicos según el término de búsqueda
  // Permitimos búsqueda por nombre de país o por código telefónico
  const filteredPhoneCodes = useMemo(() => {
    if (!searchTerm.trim()) return sortedPhoneCodes;
    const searchLower = searchTerm.toLowerCase();
    return sortedPhoneCodes.filter(code => 
      code.pais.toLowerCase().includes(searchLower) || 
      code.codigo.includes(searchTerm)
    );
  }, [sortedPhoneCodes, searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "address") {
      // Capitalizamos la primera letra de cada palabra en la dirección
      onInputChange({ [name]: capitalizeWords(value) });
    } else if (name === "state") {
      onInputChange({ [name]: value, city: "" });
    } else {
      onInputChange({ [name]: value });
    }
  };

  // Manejador para seleccionar un código de país
  const handleSelectCountry = (code) => {
    onInputChange({ countryCode: code.codigo });
    setIsCountryDropdownOpen(false);
    setSearchTerm('');
  };

  // Cerrar el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Actualizar las ciudades cuando cambia el estado
  useEffect(() => {
    if (formData.state) {
      const normalizedState = formData.state.toLowerCase();
      setCities(PhoneEstData[normalizedState] || []);
    } else {
      setCities([]);
    }
  }, [formData.state]);

  // Validar formulario cuando cambia formData
  useEffect(() => {
    const requiredFields = [
      "email",
      "phoneNumber",
      "state",
      "city",
      "address"
    ];

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = formData.email && emailRegex.test(formData.email);

    // Validación de número de teléfono
    const isPhoneValid = formData.phoneNumber && formData.phoneNumber.length >= 10;

    // Verificar que todos los campos requeridos estén completos y válidos
    const isValid = requiredFields.every(field =>
      formData[field] && formData[field].trim() !== ""
    ) && isEmailValid && isPhoneValid;

    setIsFormValid(isValid);
  }, [formData]);

  const venezuelanStates = Object.keys(PhoneEstData).map(state =>
    state.charAt(0).toUpperCase() + state.slice(1)
  );

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
      {/* Email - SOLO ESTE CAMPO será no editable en modo perfil */}
      <div>
        <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
          Correo Electrónico
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          {isProfileEdit ? (
            // En modo perfil, email no editable
            <div className="relative">
              <input
                type="email"
                value={formData.email || ''}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
                disabled
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          ) : (
            // En modo normal, email editable
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border ${isFieldEmpty("email") ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
                placeholder="ejemplo@correo.com"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          )}
        </div>
        {isProfileEdit && (
          <p className="mt-1 text-xs text-gray-500">Este campo no se puede editar</p>
        )}
        {isFieldEmpty("email") && !isProfileEdit && (
          <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Número de Teléfono Móvil
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex items-center relative">
            {/* Selector de código de país mejorado con búsqueda */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="h-12 px-3 py-3 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] text-gray-700 flex items-center"
              >
                <div className="mr-2 flex items-center justify-center">
                  <CountryFlag 
                    countryCode={
                      (sortedPhoneCodes.find(c => c.codigo === formData.countryCode) || {}).codigo_pais || ''
                    } 
                  />
                </div>
                <span className="mx-1">{formData.countryCode || '+58'}</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
              
              {isCountryDropdownOpen && (
                <div className="absolute left-0 z-10 mt-1 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 max-h-80 overflow-y-auto">
                  <div className="p-2 border-b">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por país o código..."
                        className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7008A]"
                      />
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="py-1">
                    {filteredPhoneCodes.map((code, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectCountry(code)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <div className="mr-2 flex items-center justify-center w-6">
                          <CountryFlag countryCode={code.codigo_pais} />
                        </div>
                        <span className="mr-2 w-12 inline-block">{code.codigo}</span>
                        <span className="truncate">{code.pais}</span>
                      </button>
                    ))}
                    {filteredPhoneCodes.length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500">No se encontraron resultados</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Input para número de teléfono */}
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange({ target: { name: "phoneNumber", value } });
              }}
              maxLength={
                sortedPhoneCodes.find(c => c.codigo === formData.countryCode)?.longitud || 10
              }
              className={`w-full px-4 py-3 border ${
                isFieldEmpty("phoneNumber") ? "border-red-500 bg-red-50" : "border-gray-200"
              } rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]`}
              placeholder="Ingrese su número de teléfono"
              style={{ height: "48px" }}
            />
          </div>
          {isFieldEmpty("phoneNumber") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
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
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange({ target: { name: "homePhone", value } });
              }}
              maxLength="11"
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
              className={`cursor-pointer w-full px-4 py-3 border ${
                isFieldEmpty("state") ? "border-red-500 bg-red-50" : "border-gray-200"
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
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          {isFieldEmpty("state") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
        {/* Ciudad - depende del estado seleccionado */}
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Ciudad
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              className={`cursor-pointer w-full px-4 py-3 border ${
                isFieldEmpty("city") ? "border-red-500 bg-red-50" : "border-gray-200"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700 ${!formData.state ? 'bg-white' : ''}`}
            >
              <option value="">Seleccionar Ciudad</option>
              {cities.map((city) => (
                <option key={city} value={city.toLowerCase()}>
                  {city}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          {isFieldEmpty("city") && (
            <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>
          )}
        </div>
      </div>

      {/* Home Address - Capitaliza la primera letra de cada palabra */}
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
            className={`w-full pl-10 pr-4 py-3 border ${
              isFieldEmpty("address") ? "border-red-500 bg-red-50" : "border-gray-200"
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