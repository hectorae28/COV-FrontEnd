"use client"
import { fetchEstados, fetchMunicipios } from "@/api/endpoints/ubicacion"
import { MapPin } from "lucide-react"
import { useEffect, useState } from "react"

const capitalizeWords = (text) => {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => /^[A-ZÁÉÍÓÚÜÑ.]+$/.test(word) 
      ? word 
      : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function DireccionForm({
  formData,
  onInputChange,
  isFieldEmpty,
  isEditMode = false,
  localFormData = null,
  setLocalFormData = null,
  fieldMapping = {
    state: "state",
    municipio: "municipio", 
    address: "address",
    city: "city"
  },
  title = "Dirección de habitación",
  addressPlaceholder = "Ingrese su dirección completa"
}) {
  const [estados, setEstados] = useState([])
  const [municipios, setMunicipios] = useState([])
  const [isLoadingMunicipios, setIsLoadingMunicipios] = useState(false)

  useEffect(() => {
  const loadEstados = async () => {
    try {
      const data = await fetchEstados();
      setEstados(data);
      
      // CORRECCIÓN: Usar currentFormData en lugar de 'state' indefinido
      const stateValue = currentFormData[fieldMapping.state];
      if (stateValue !== undefined && stateValue !== "" && stateValue !== null) {
        loadMunicipios(stateValue);
      }
    } catch (error) {
      console.error("Error al cargar los estados:", error);
    }
  };
  
  loadEstados();
}, []); 

  const loadMunicipios = async (estadoId) => {
    try {
      setIsLoadingMunicipios(true);
      const data = await fetchMunicipios(estadoId);
      setMunicipios(data);
    } catch (error) {
      console.error("Error al cargar los municipios:", error);
      setMunicipios([]);
    } finally {
      setIsLoadingMunicipios(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === fieldMapping.address) {
      // CAMBIO: Aplicar capitalización que permite mayúsculas seguidas
      const processedValue = capitalizeWords(value);
      
      if (isEditMode && setLocalFormData) {
        setLocalFormData(prev => ({ ...prev, [fieldMapping.address]: processedValue }));
      } else {
        onInputChange({ [fieldMapping.address]: processedValue });
      }
    } else if (name === fieldMapping.state) {
      if (isEditMode && setLocalFormData) {
        setLocalFormData(prev => ({ 
          ...prev, 
          [fieldMapping.state]: value,
          [fieldMapping.municipio]: "",
        }));
      } else {
        onInputChange({ 
          [fieldMapping.state]: value,
          [fieldMapping.municipio]: "",
        });
      }
      
      if (value) {
        loadMunicipios(value);
      } else {
        setMunicipios([]);
      }
    } else if (name === fieldMapping.municipio) {
      if (isEditMode && setLocalFormData) {
        setLocalFormData(prev => ({ 
          ...prev, 
          [fieldMapping.municipio]: value,

        }));
      } else {
        onInputChange({ 
          [fieldMapping.municipio]: value,

        });
      }
    }
  }

  const currentFormData = isEditMode && localFormData ? localFormData : formData;
  const state = currentFormData[fieldMapping.state];
  const estadoSeleccionado = estados.find(e => e.id === state);
  const isDistritoCapital = state === "10";
  const municipioLabel = isDistritoCapital ? "Parroquia" : "Municipio";

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <h3 className="text-lg font-medium text-[#41023B] mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">
            Estado <span className="text-red-500">*</span>
          </label>
          <select
            id={fieldMapping.state}
            name={fieldMapping.state}
            value={currentFormData[fieldMapping.state] || ""}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${isFieldEmpty(fieldMapping.state) ? "border-red-500 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none`}
            required
          >
            <option value="">Selecciona un estado</option>
            {estados.map((estado) => (
              <option key={estado.id} value={estado.id}>
                {estado.nombre}
              </option>
            ))}
          </select>
          {isFieldEmpty(fieldMapping.state) && <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-[#41023B]">
            {municipioLabel} <span className="text-red-500">*</span>
          </label>
          <select
            id={fieldMapping.municipio}
            name={fieldMapping.municipio}
            value={currentFormData[fieldMapping.municipio] || ""}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${isFieldEmpty(fieldMapping.municipio) ? "border-red-500 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] appearance-none ${!currentFormData[fieldMapping.state] ? "bg-white" : ""}`}
            disabled={isLoadingMunicipios || !currentFormData[fieldMapping.state]}
          >
            <option value="">
              {isLoadingMunicipios 
                ? "Cargando municipios..." 
                : !currentFormData[fieldMapping.state] 
                  ? "Selecciona un estado primero" 
                  : "Selecciona un municipio"}
            </option>
            {municipios.map((municipio) => (
              <option key={municipio.id} value={municipio.id}>
                {municipio.nombre}
              </option>
            ))}
          </select>
          {isFieldEmpty(fieldMapping.municipio) && <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>}
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-[#41023B]">
          Dirección <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <textarea
            name={fieldMapping.address}
            value={currentFormData[fieldMapping.address] || ""}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 border ${isFieldEmpty(fieldMapping.address) ? "border-red-500 bg-red-50" : "border-gray-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7008A] min-h-[100px]`}
            placeholder={addressPlaceholder}
          />
          <MapPin className="absolute left-3 top-4 text-gray-400" />
        </div>
        {isFieldEmpty(fieldMapping.address) && <p className="mt-1 text-xs text-red-500">Este campo es obligatorio</p>}
      </div>
    </div>
  );
}