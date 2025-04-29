import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import phoneCodes from "@/app/Models/phoneCodes"; // Assuming you have a file with phone codes

// Datos de estados y ciudades de Venezuela
const venezuelaData = {
  "amazonas": ["Puerto Ayacucho", "La Esmeralda", "San Fernando de Atabapo", "Maroa", "San Juan de Manapiare", "San Carlos de Río Negro", "Isla Ratón"],
  
  "anzoátegui": ["Barcelona", "Puerto La Cruz", "El Tigre", "Anaco", "Puerto Píritu", "Lechería", "Cantaura", "Clarines", "Onoto", "Pariaguán", "San José de Guanipa", "Aragua de Barcelona", "El Chaparro", "Valle de Guanape", "Soledad", "San Mateo", "Guanta", "Boca de Uchire", "Santa Ana", "Mapire"],
  
  "apure": ["San Fernando de Apure", "Guasdualito", "Achaguas", "El Amparo", "Elorza", "Mantecal", "Bruzual", "San Juan de Payara", "Biruaca", "El Nula"],
  
  "aragua": ["Maracay", "Turmero", "La Victoria", "El Limón", "Cagua", "Villa de Cura", "Palo Negro", "Santa Cruz de Aragua", "Las Tejerías", "San Mateo", "San Casimiro", "Camatagua", "El Consejo", "Ocumare de la Costa", "Colonia Tovar", "Barbacoas", "San Sebastián", "Magdaleno"],
  
  "barinas": ["Barinas", "Barinitas", "Socopó", "Ciudad Bolivia", "Santa Bárbara", "Sabaneta", "Barrancas", "Libertad", "Obispos", "Pedraza", "Ciudad de Nutrias", "El Cantón", "Arismendi"],
  
  "bolívar": ["Ciudad Bolívar", "Ciudad Guayana", "Upata", "Guasipati", "El Callao", "Tumeremo", "Caicara del Orinoco", "El Dorado", "El Palmar", "El Manteco", "Ciudad Piar", "San Félix", "Puerto Ordaz", "Santa Elena de Uairén", "Maripa", "El Pao"],
  
  "carabobo": ["Valencia", "Puerto Cabello", "Guacara", "Los Guayos", "Morón", "San Diego", "Naguanagua", "Tocuyito", "Mariara", "Güigüe", "Tacarigua", "Bejuma", "Miranda", "Montalbán", "Urama", "San Joaquín"],
  
  "cojedes": ["San Carlos", "Tinaquillo", "El Baúl", "Libertad", "Las Vegas", "El Pao", "Tinaco", "Macapo", "La Sierra", "La Aguadita", "Apartaderos"],
  
  "delta amacuro": ["Tucupita", "Pedernales", "Curiapo", "Sierra Imataca", "Piacoa", "Casacoima", "San José de Amacuro"],
  
  "falcón": ["Coro", "Punto Fijo", "Santa Ana de Coro", "Dabajuro", "Tucacas", "Chichiriviche", "Morón", "La Vela de Coro", "Pueblo Nuevo", "Puerto Cumarebo", "Píritu", "Tocópero", "Mirimire", "Jacura", "Santa Cruz de Bucaral", "Churuguara", "Cabure", "San Juan de los Cayos"],
  
  "guárico": ["San Juan de los Morros", "Valle de la Pascua", "Calabozo", "Altagracia de Orituco", "Zaraza", "Camaguán", "Las Mercedes", "El Socorro", "Tucupido", "Chaguaramas", "Ortiz", "Guardatinajas", "San José de Guaribe", "Santa María de Ipire"],
  
  "lara": ["Barquisimeto", "Cabudare", "Carora", "Quíbor", "El Tocuyo", "Duaca", "Sarare", "Siquisique", "Sanare", "Río Claro", "Humocaro Alto", "Humocaro Bajo", "Cubiro", "Curarigua", "Guarico"],
  
  "mérida": ["Mérida", "Ejido", "El Vigía", "Tovar", "Mucuchíes", "Bailadores", "Santa Cruz de Mora", "Timotes", "Lagunillas", "Tabay", "Aricagua", "Santo Domingo", "Pueblo Llano", "Mucurubá", "Torondoy", "Zea", "Chiguará", "La Azulita"],
  
  "miranda": ["Los Teques", "Guatire", "Guarenas", "Ocumare del Tuy", "Charallave", "Higuerote", "Santa Teresa del Tuy", "Cúa", "Caucagua", "San José de los Altos", "Carrizal", "San Antonio de los Altos", "Baruta", "El Hatillo", "Petare", "Río Chico", "Santa Lucía", "Cúpira", "San Francisco de Yare"],
  
  "monagas": ["Maturín", "Caripito", "Punta de Mata", "Temblador", "Aragua de Maturín", "Quiriquire", "Aguasay", "Barrancas del Orinoco", "Caripe", "San Antonio de Maturín", "Caicara de Maturín", "Santa Bárbara", "Jusepin", "Tropical"],
  
  "nueva esparta": ["La Asunción", "Porlamar", "Pampatar", "Juan Griego", "Punta de Piedras", "San Juan Bautista", "Santa Ana", "El Valle del Espíritu Santo", "Villa Rosa", "La Plaza de Paraguachí", "Las Guevaras", "Las Hernández", "Pedro González"],
  
  "portuguesa": ["Guanare", "Acarigua", "Araure", "Biscucuy", "Guanarito", "Ospino", "Papelón", "Píritu", "Villa Bruzual", "Agua Blanca", "Turén", "Santa Rosalía", "Chabasquén", "San Rafael de Onoto", "Boconoíto"],
  
  "sucre": ["Cumaná", "Carúpano", "Güiria", "Río Caribe", "Araya", "Tunapuy", "Irapa", "Casanay", "San Antonio del Golfo", "El Pilar", "Yaguaraparo", "Cariaco", "Marigüitar", "San José de Aerocuar"],
  
  "táchira": ["San Cristóbal", "Táriba", "La Grita", "San Antonio del Táchira", "Rubio", "Capacho", "Colón", "Pregonero", "Umuquena", "Michelena", "Lobatera", "Ureña", "Delicias", "San Juan de Colón", "Santa Ana del Táchira", "San Simón", "Queniquea", "San Josecito", "Palmira", "Abejales"],
  
  "trujillo": ["Trujillo", "Valera", "Boconó", "Betijoque", "Escuque", "Sabana de Mendoza", "Motatán", "Pampanito", "Pampán", "Carache", "Monay", "La Puerta", "Santa Ana de Trujillo", "La Quebrada", "Jajó", "Santiago", "Carvajal"],
  
  "vargas": ["La Guaira", "Catia La Mar", "Maiquetía", "Naiguatá", "Caraballeda", "Macuto", "Carayaca", "El Junko", "Caruao", "La Sabana"],
  
  "yaracuy": ["San Felipe", "Yaritagua", "Chivacoa", "Nirgua", "Aroa", "Cocorote", "Urachiche", "Guama", "Sabana de Parra", "Boraure", "Yumare", "Farriar", "Marín", "San Pablo", "Guararito"],
  
  "zulia": ["Maracaibo", "Cabimas", "Ciudad Ojeda", "San Carlos del Zulia", "Santa Rita", "Machiques", "La Villa del Rosario", "San Rafael del Moján", "La Concepción", "Casigua El Cubo", "Mene Grande", "Lagunillas", "El Vigía", "Caja Seca", "Bobures", "Bachaquero", "El Chivo", "El Guayabo", "Encontrados", "Sinamaica"],
  
  "distrito capital": ["Caracas", "El Junquito", "Antimano", "La Pastora", "El Valle", "Coche", "Caricuao", "El Paraíso", "San Juan", "Catia", "Petare", "Chacao", "El Hatillo", "Baruta"]
};

export default function InfoContacto({ formData, onInputChange, validationErrors }) {
  const [cities, setCities] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onInputChange({ [name]: value });

    // Si cambia el estado, actualizar las ciudades disponibles y resetear la ciudad seleccionada
    if (name === "state") {
      onInputChange({ city: "" });
    }
  };

  // Actualizar las ciudades cuando cambia el estado
  useEffect(() => {
    if (formData.state) {
      setCities(venezuelaData[formData.state.toLowerCase()] || []);
    } else {
      setCities([]);
    }
  }, [formData.state]);

  const venezuelanStates = Object.keys(venezuelaData).map(state => 
    state.charAt(0).toUpperCase() + state.slice(1)
  );

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B] flex items-center">
            Número de Teléfono Móvil
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex items-center relative">
            {/* Select for country code with custom arrow */}
            <div className="relative">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="h-full px-4 py-3 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] text-gray-700 appearance-none"
                style={{ height: "48px" }}
              >
                {phoneCodes.map((code, index) => (
                  <option key={index} value={code.codigo}>{code.codigo}</option>
                ))}
              </select>
              {/* Flecha personalizada */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
            {/* Input for phone number */}
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange({ target: { name: "phoneNumber", value } });
              }}
              maxLength={phoneCodes.find(c => c.codigo === formData.countryCode)?.longitud || 10}
              className="w-full px-4 py-3 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A]"
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
        {/* City - Dependent on State */}
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
              disabled={!formData.state}
              className={`w-full px-4 py-3 border ${isFieldEmpty("city") ? "border-gray-200" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none text-gray-700 ${!formData.state ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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

