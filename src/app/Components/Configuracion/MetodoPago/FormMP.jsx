import { motion } from "framer-motion";
import { AlertTriangle, CreditCard, DollarSign, Info, Landmark, MoreHorizontal, Smartphone, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

import BancoPayment from "./BancoPayment";
import EfectivoPayment from "./EfectivoPayment";
import OtrosPayment from "./OtrosPayment";
import PaypalPayment from "./PaypalPayment";
import PuntoVentaPayment from "./PuntoVentaPayment";

const tiposMetodosPago = [
  {
    id: "banco",
    nombre: "Banco / Transferencia",
    descripcion: "Transferencias y depósitos bancarios",
    icon: Landmark,
  },
  {
    id: "punto_venta",
    nombre: "Punto de Venta",
    descripcion: "Pagos con tarjetas de débito/crédito",
    icon: CreditCard,
  },
  {
    id: "efectivo",
    nombre: "Efectivo",
    descripcion: "Pagos en efectivo en oficinas físicas",
    icon: DollarSign,
  },
  {
    id: "paypal",
    nombre: "PayPal",
    descripcion: "Pagos internacionales con PayPal",
    icon: Smartphone,
  },
  {
    id: "otros",
    nombre: "Otros",
    descripcion: "Zelle, Zinli y otros métodos",
    icon: MoreHorizontal,
  }
];

const tiposAlertas = [
  { id: "info", nombre: "Informativa", color: "blue" },
  { id: "warning", nombre: "Advertencia", color: "amber" },
  { id: "danger", nombre: "Peligro", color: "red" },
  { id: "success", nombre: "Éxito", color: "green" },
];

const monedas = [
  { id: "USD", nombre: "Dólar (USD)", simbolo: "$" },
  { id: "VES", nombre: "Bolívar (VES)", simbolo: "Bs." },
  { id: "EUR", nombre: "Euro (EUR)", simbolo: "€" },
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
    subtipo_metodo: "",
    datos_adicionales: {
      api: false,
      slug: "",
      alerta: "",
      tipo_alerta: "info",
      datos_cuenta: "",
      correo: "",
      telefono: "",
    }
  });

  // Inicializar con datos existentes si estamos editando
  useEffect(() => {
    if (metodo) {
      const tipo = getTipoFromSlug(metodo?.datos_adicionales?.slug);
      const subtipo = getSubtipoFromSlug(metodo?.datos_adicionales?.slug);
      setFormData({
        ...metodo,
        tipo_metodo: tipo,
        subtipo_metodo: subtipo,
        logo_file: null,
      });
    }
  }, [metodo]);

  // Determinar el tipo de método por su slug
  const getTipoFromSlug = (slug) => {
    if (!slug) return "banco";
    if (slug.includes("banco") || slug === "bdv") return "banco";
    if (slug.includes("punto_venta") || slug.includes("pos")) return "punto_venta";
    if (slug.includes("efectivo") || slug.includes("cash")) return "efectivo";
    if (slug.includes("paypal")) return "paypal";
    if (slug.includes("zelle") || slug.includes("zinli")) return "otros";
    return "banco";
  };

  // Determinar el subtipo para métodos "otros"
  const getSubtipoFromSlug = (slug) => {
    if (!slug) return "";
    if (slug.includes("zelle")) return "zelle";
    if (slug.includes("zinli")) return "zinli";
    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else if (type === 'file') {
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

    // Actualizar slug al cambiar nombre, tipo o subtipo
    if (name === "nombre" || name === "tipo_metodo" || name === "subtipo_metodo") {
      const nuevoSlug = generarSlug(
        name === "nombre" ? value : formData.nombre,
        name === "tipo_metodo" ? value : formData.tipo_metodo,
        name === "subtipo_metodo" ? value : formData.subtipo_metodo
      );

      setFormData(prev => ({
        ...prev,
        datos_adicionales: {
          ...prev.datos_adicionales,
          slug: nuevoSlug
        }
      }));
    }

    // Resetear subtipo cuando se cambia el tipo principal
    if (name === "tipo_metodo" && value !== "otros") {
      setFormData(prev => ({
        ...prev,
        subtipo_metodo: ""
      }));
    }

    // Configuraciones específicas por tipo
    if (name === "tipo_metodo") {
      let apiEnabled = false;
      let monedaPorDefecto = "USD";

      switch (value) {
        case "punto_venta":
        case "paypal":
          apiEnabled = true;
          break;
        case "banco":
          if (formData.nombre?.toLowerCase().includes("venezuela")) {
            monedaPorDefecto = "VES";
          }
          break;
        default:
          break;
      }

      setFormData(prev => ({
        ...prev,
        moneda: monedaPorDefecto,
        datos_adicionales: {
          ...prev.datos_adicionales,
          api: apiEnabled
        }
      }));
    }
  };

  // Generar un slug basado en el nombre, tipo y subtipo
  const generarSlug = (nombre, tipo, subtipo = "") => {
    if (!nombre) return tipo;

    const nombreSimplificado = nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");

    if (tipo === "otros" && subtipo) {
      return `${subtipo}_${nombreSimplificado}`;
    }

    switch (tipo) {
      case "banco":
        if (nombre.toLowerCase().includes("venezuela")) return "bdv";
        return `banco_${nombreSimplificado}`;
      case "punto_venta":
        return `pos_${nombreSimplificado}`;
      case "efectivo":
        return `efectivo_${nombreSimplificado}`;
      case "paypal":
        return `paypal_${nombreSimplificado}`;
      default:
        return `${tipo}_${nombreSimplificado}`;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderMetodoEspecifico = () => {
    switch (formData.tipo_metodo) {
      case "banco":
        return (
          <BancoPayment
            formData={formData}
            onChange={handleChange}
          />
        );
      case "punto_venta":
        return (
          <PuntoVentaPayment
            formData={formData}
            onChange={handleChange}
          />
        );
      case "efectivo":
        return (
          <EfectivoPayment
            formData={formData}
            onChange={handleChange}
          />
        );
      case "paypal":
        return (
          <PaypalPayment
            formData={formData}
            onChange={handleChange}
          />
        );
      case "otros":
        return (
          <OtrosPayment
            formData={formData}
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de método de pago */}
      <div className="select-none cursor-default mb-6">
        <h3 className="text-lg font-medium text-[#41023B] mb-3">Tipo de método de pago</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {tiposMetodosPago.map((tipo) => {
            const IconComponent = tipo.icon;
            return (
              <div
                key={tipo.id}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${formData.tipo_metodo === tipo.id
                  ? "border-[#D7008A] bg-[#D7008A]/5"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
                onClick={() => handleChange({
                  target: { name: "tipo_metodo", value: tipo.id }
                })}
              >
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className={`w-5 h-5 ${formData.tipo_metodo === tipo.id ? "text-[#D7008A]" : "text-gray-400"
                    }`} />
                </div>
                <div className="font-medium text-center text-xs mb-1">{tipo.nombre}</div>
                <div className="text-xs text-gray-500 text-center leading-tight">{tipo.descripcion}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vista previa del método de pago */}
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

              <div className="flex items-center gap-2 mt-1">
                {formData.activo ? (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    Activo
                  </span>
                ) : (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    Inactivo
                  </span>
                )}
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {tiposMetodosPago.find(t => t.id === formData.tipo_metodo)?.nombre}
                  {formData.subtipo_metodo && ` - ${formData.subtipo_metodo.charAt(0).toUpperCase() + formData.subtipo_metodo.slice(1)}`}
                </span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  {formData.moneda}
                </span>
              </div>
            </div>
          </div>

          {formData.datos_adicionales.alerta && (
            <div className={`mt-4 p-3 rounded-lg bg-${formData.datos_adicionales.tipo_alerta === "info" ? "blue" :
              formData.datos_adicionales.tipo_alerta === "warning" ? "amber" :
                formData.datos_adicionales.tipo_alerta === "danger" ? "red" : "green"
              }-50 border border-${formData.datos_adicionales.tipo_alerta === "info" ? "blue" :
                formData.datos_adicionales.tipo_alerta === "warning" ? "amber" :
                  formData.datos_adicionales.tipo_alerta === "danger" ? "red" : "green"
              }-200`}>
              <div className="flex items-start">
                {formData.datos_adicionales.tipo_alerta === "info" && <Info size={16} className="text-blue-600 mt-0.5 mr-2" />}
                {(formData.datos_adicionales.tipo_alerta === "warning" || formData.datos_adicionales.tipo_alerta === "danger") && <AlertTriangle size={16} className={`${formData.datos_adicionales.tipo_alerta === "warning" ? "text-amber-600" : "text-red-600"} mt-0.5 mr-2`} />}
                <p className={`text-xs text-${formData.datos_adicionales.tipo_alerta === "info" ? "blue" :
                  formData.datos_adicionales.tipo_alerta === "warning" ? "amber" :
                    formData.datos_adicionales.tipo_alerta === "danger" ? "red" : "green"
                  }-700`}>
                  {formData.datos_adicionales.alerta}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                placeholder={`Ej: ${formData.tipo_metodo === "banco" ? "Banco de Venezuela" :
                  formData.tipo_metodo === "punto_venta" ? "POS Principal" :
                    formData.tipo_metodo === "efectivo" ? "Caja Principal" :
                      formData.tipo_metodo === "paypal" ? "PayPal Oficial" :
                        "Método Digital"
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
                {monedas.map(moneda => (
                  <option key={moneda.id} value={moneda.id}>
                    {moneda.nombre}
                  </option>
                ))}
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
              />
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
                      onClick={() => setFormData({ ...formData, logo_url: null, logo_file: null })}
                      className="cursor-pointer absolute top-0 right-0 bg-red-600 text-white rounded-bl-lg p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">Tamaño recomendado: 512x512px</p>
            </div>

            {/* Activo */}
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
          <h3 className="text-lg font-medium text-[#41023B] mb-3">
            Detalles del {tiposMetodosPago.find(t => t.id === formData.tipo_metodo)?.nombre}
            {formData.subtipo_metodo && ` - ${formData.subtipo_metodo.charAt(0).toUpperCase() + formData.subtipo_metodo.slice(1)}`}
          </h3>
          <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
            {/* Campos comunes */}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono de contacto
              </label>
              <input
                type="tel"
                name="datos_adicionales.telefono"
                value={formData.datos_adicionales.telefono || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A]"
                placeholder="Ej: +58 212 1234567"
              />
            </div>

            {/* Componente específico del método */}
            {renderMetodoEspecifico()}

            {/* Tipo de alerta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de alerta
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {tiposAlertas.map((alerta) => (
                  <div
                    key={alerta.id}
                    className={`border rounded-lg p-2 text-center cursor-pointer text-sm transition-all ${formData.datos_adicionales.tipo_alerta === alerta.id
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
              />
            </div>
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