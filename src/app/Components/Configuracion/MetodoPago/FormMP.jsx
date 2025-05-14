import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, X, Info, AlertTriangle } from "lucide-react";

const tiposMetodosPago = [
  { 
    id: "banco", 
    nombre: "Banco / Transferencia", 
    descripcion: "Transferencia o depósito bancario",
  },
  { 
    id: "paypal", 
    nombre: "Otros", 
    descripcion: "Diferentes Metodos de pago",
  }
];

const tiposAlertas = [
  { id: "info", nombre: "Informativa", color: "blue" },
  { id: "warning", nombre: "Advertencia", color: "amber" },
  { id: "danger", nombre: "Peligro", color: "red" },
  { id: "success", nombre: "Éxito", color: "green" },
];

export default function FormularioMetodoPago({ 
  metodo = null, 
  onSubmit,
  onCancel 
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    logo_url: null,
    logo_file: null,
    moneda: "USD",
    activo: true,
    tipo_metodo: "banco",
    datos_adicionales: {
      api: false,
      slug: "",
      alerta: "",
      tipo_alerta: "info",
      datos_cuenta: "",
      rif: "",
      titular: "",
      numero_cuenta: "",
      correo: "",
      url_pago: "",
    }
  });

  // Inicializar con datos existentes si estamos editando
  useEffect(() => {
    if (metodo) {
      const tipo = getTipoFromSlug(metodo?.datos_adicionales?.slug);
      setFormData({
        ...metodo,
        tipo_metodo: tipo,
        logo_file: null,
      });
    }
  }, [metodo]);

  // Determinar el tipo de método por su slug
  const getTipoFromSlug = (slug) => {
    if (!slug) return "banco";
    if (slug === "bdv" || slug.includes("banco")) return "banco";
    if (slug === "paypal") return "paypal";
    return "banco";
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name.includes('.')) {
      // Para campos anidados como datos_adicionales.slug
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else if (type === 'file') {
      // Para manejo de archivos (logo)
      if (files && files[0]) {
        const fileUrl = URL.createObjectURL(files[0]);
        setFormData({
          ...formData,
          logo_url: fileUrl,
          logo_file: files[0]
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    
    // Actualizar slug al cambiar nombre o tipo
    if (name === "nombre" || name === "tipo_metodo") {
      const nuevoSlug = generarSlug(
        name === "nombre" ? value : formData.nombre,
        name === "tipo_metodo" ? value : formData.tipo_metodo
      );
      
      setFormData(prev => ({
        ...prev,
        datos_adicionales: {
          ...prev.datos_adicionales,
          slug: nuevoSlug
        }
      }));
    }
    
    // Actualizar API flag para PayPal
    if (name === "tipo_metodo" && value === "paypal") {
      setFormData(prev => ({
        ...prev,
        datos_adicionales: {
          ...prev.datos_adicionales,
          api: true
        }
      }));
    } else if (name === "tipo_metodo" && value !== "paypal") {
      setFormData(prev => ({
        ...prev,
        datos_adicionales: {
          ...prev.datos_adicionales,
          api: false
        }
      }));
    }
  };
  
  // Generar un slug basado en el nombre y tipo de método
  const generarSlug = (nombre, tipo) => {
    if (!nombre) return tipo;
    
    if (tipo === "banco") {
      // Para bancos, verificamos si es Banco de Venezuela
      if (nombre.toLowerCase().includes("venezuela")) {
        return "bdv";
      }
      // Para otros bancos
      const nombreSimplificado = nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");
        
      return `banco_${nombreSimplificado}`;
    }
    
    // Para otros tipos, usamos el tipo como base
    return tipo;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de método de pago */}
      <div className="select-none cursor-defaul mb-6">
        <h3 className="text-lg font-medium text-[#41023B] mb-3">Tipo de método de pago</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tiposMetodosPago.map((tipo) => (
            <div 
              key={tipo.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                formData.tipo_metodo === tipo.id 
                  ? "border-[#D7008A] bg-[#D7008A]/5" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleChange({
                target: { name: "tipo_metodo", value: tipo.id }
              })}
            >
              <div className="font-medium mb-1">{tipo.nombre}</div>
              <div className="text-xs text-gray-500">{tipo.descripcion}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Vista previa del método de pago (movida arriba) */}
      <div className="pt-2">
        <h3 className="text-lg font-medium text-[#41023B] mb-3">
          Vista previa del método de pago
        </h3>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
              {formData.logo_url ? (
                <img 
                  src={formData.logo_url} 
                  alt={formData.nombre}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-2xl font-bold text-gray-400">
                  {formData.nombre?.charAt(0) || "?"}
                </div>
              )}
            </div>
            <div>
              <div className="font-medium">{formData.nombre || "Nombre del método"}</div>
              <div className="text-xs text-gray-500">{formData.descripcion || "Descripción breve"}</div>
              
              {/* Estado activo/inactivo */}
              {formData.activo ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full mt-1 inline-block">
                  Activo
                </span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                  Inactivo
                </span>
              )}
            </div>
          </div>
          
          {formData.datos_adicionales.alerta && (
            <div className={`mt-4 p-3 rounded-lg bg-${
              formData.datos_adicionales.tipo_alerta === "info" ? "blue" :
              formData.datos_adicionales.tipo_alerta === "warning" ? "amber" :
              formData.datos_adicionales.tipo_alerta === "danger" ? "red" : "green"
            }-50 border border-${
              formData.datos_adicionales.tipo_alerta === "info" ? "blue" :
              formData.datos_adicionales.tipo_alerta === "warning" ? "amber" :
              formData.datos_adicionales.tipo_alerta === "danger" ? "red" : "green"
            }-200`}>
              <div className="flex items-start">
                {formData.datos_adicionales.tipo_alerta === "info" && <Info size={16} className="text-blue-600 mt-0.5 mr-2" />}
                {formData.datos_adicionales.tipo_alerta === "warning" && <AlertTriangle size={16} className="text-amber-600 mt-0.5 mr-2" />}
                {formData.datos_adicionales.tipo_alerta === "danger" && <AlertTriangle size={16} className="text-red-600 mt-0.5 mr-2" />}
                <p className={`text-xs text-${
                  formData.datos_adicionales.tipo_alerta === "info" ? "blue" :
                  formData.datos_adicionales.tipo_alerta === "warning" ? "amber" :
                  formData.datos_adicionales.tipo_alerta === "danger" ? "red" : "green"
                }-700`}>
                  {formData.datos_adicionales.alerta}
                </p>
              </div>
            </div>
          )}
          
          {formData.datos_adicionales.datos_cuenta && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-700 whitespace-pre-line">
                {formData.datos_adicionales.datos_cuenta}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información básica */}
        <div>
          <h3 className="text-lg font-medium text-[#41023B] mb-3">Información básica</h3>
          <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del método de pago *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                placeholder={`Ej: ${
                  formData.tipo_metodo === "banco" 
                    ? "Banco de Venezuela" 
                    : "PayPal"
                }`}
                required
              />
            </div>
            
            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Identificador (slug)
              </label>
              <input
                type="text"
                name="datos_adicionales.slug"
                value={formData.datos_adicionales.slug}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] bg-gray-50"
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">
                Generado automáticamente para identificar este método de pago
              </p>
            </div>
            
            {/* Moneda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda principal
              </label>
              <select
                name="moneda"
                value={formData.moneda}
                onChange={handleChange}
                className="cursor-pointer w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
              >
                <option value="USD">Dólar (USD)</option>
                <option value="VES">Bolívar (VES)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>
            
            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción breve
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                placeholder="Breve descripción del método de pago"
                rows="2"
              ></textarea>
            </div>
            
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
              <div className="mt-1 flex items-center">
                <div className="relative">
                  <input
                    type="file"
                    name="logo_url"
                    id="logo-input"
                    onChange={handleChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <label
                    htmlFor="logo-input"
                    className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Upload size={16} className="mr-2" />
                    Subir logo
                  </label>
                </div>
                
                {formData.logo_url && (
                  <div className="ml-4 relative w-16 h-16 border rounded-lg overflow-hidden bg-white flex items-center justify-center">
                    <img
                      src={formData.logo_url}
                      alt="Logo preview"
                      className="max-w-full max-h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, logo_url: null, logo_file: null})}
                      className="cursor-pointer absolute top-0 right-0 bg-red-600 text-white rounded-bl-lg p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">Tamaño recomendado: 512x512px</p>
            </div>
            
            {/* Activo - Resaltado */}
            <div className="flex items-center bg-green-50 p-3 rounded-lg border border-green-200">
              <input
                type="checkbox"
                id="activo"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
                className="cursor-pointer h-5 w-5 text-green-600 focus:ring-green-500 border-green-300 rounded"
              />
              <label htmlFor="activo" className="ml-3 text-sm font-medium text-green-800">
                Método de pago activo
              </label>
              <p className="ml-1 text-xs text-green-600">
                (Los métodos inactivos no se mostrarán a los usuarios)
              </p>
            </div>
          </div>
        </div>
        
        {/* Detalles específicos según tipo */}
        <div>
          <h3 className="text-lg font-medium text-[#41023B] mb-3">Detalles del método de pago</h3>
          <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
            {/* Campos comunes para todos los métodos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico de contacto
              </label>
              <input
                type="email"
                name="datos_adicionales.correo"
                value={formData.datos_adicionales.correo || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                placeholder="Ej: pagos@ejemplo.com"
              />
            </div>
            
            {/* Tipo de alerta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de alerta
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {tiposAlertas.map((alerta) => (
                  <div
                    key={alerta.id}
                    className={`border rounded-lg p-2 text-center cursor-pointer text-sm transition-all ${
                      formData.datos_adicionales.tipo_alerta === alerta.id
                        ? `border-${alerta.color}-500 bg-${alerta.color}-50 text-${alerta.color}-700`
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleChange({
                      target: { name: "datos_adicionales.tipo_alerta", value: alerta.id }
                    })}
                  >
                    {alerta.nombre}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mensaje de alerta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje de alerta
              </label>
              <textarea
                name="datos_adicionales.alerta"
                value={formData.datos_adicionales.alerta || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                placeholder="Mensaje importante que se mostrará al usuario"
                rows="2"
              ></textarea>
            </div>
            
            {/* Campos específicos para bancos */}
            {formData.tipo_metodo === "banco" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de cuenta
                  </label>
                  <input
                    type="text"
                    name="datos_adicionales.numero_cuenta"
                    value={formData.datos_adicionales.numero_cuenta || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: 0102-0127-63-0000007511"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titular de la cuenta
                  </label>
                  <input
                    type="text"
                    name="datos_adicionales.titular"
                    value={formData.datos_adicionales.titular || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: Colegio de Odontólogos de Venezuela"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RIF / Identificación fiscal
                  </label>
                  <input
                    type="text"
                    name="datos_adicionales.rif"
                    value={formData.datos_adicionales.rif || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                    placeholder="Ej: J-00041277-4"
                  />
                </div>
              </>
            )}
            
            {/* Campos específicos para PayPal */}
            {formData.tipo_metodo === "paypal" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de pago (opcional)
                </label>
                <input
                  type="url"
                  name="datos_adicionales.url_pago"
                  value={formData.datos_adicionales.url_pago || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                  placeholder="Ej: https://www.paypal.com/paypalme/..."
                />
              </div>
            )}
            
            {/* Información adicional visible al usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Información adicional
              </label>
              <textarea
                name="datos_adicionales.datos_cuenta"
                value={formData.datos_adicionales.datos_cuenta || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                placeholder="Información detallada que se mostrará al usuario sobre este método de pago"
                rows="5"
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                Esta información se mostrará en la pantalla de pago. Puede incluir instrucciones específicas.
              </p>
            </div>
            
            {/* Comprobación de API para PayPal */}
            {formData.tipo_metodo === "paypal" && (
              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="api-enabled"
                  name="datos_adicionales.api"
                  checked={formData.datos_adicionales.api}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#D7008A] focus:ring-[#D7008A]"
                />
                <label htmlFor="api-enabled" className="ml-2 text-sm text-gray-700">
                  Usar cálculo de comisión de PayPal
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="pt-4 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <motion.button
          type="submit"
          className="cursor-pointer px-6 py-2 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-lg shadow-sm hover:shadow-md"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {metodo ? "Guardar cambios" : "Agregar método de pago"}
        </motion.button>
      </div>
    </form>
  );
}