"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// Importar componentes personalizados
import FormularioMetodoPago from "@/Components/Configuracion/MetodoPago/FormMP";
import PanelPagosPreview from "@/Components/Configuracion/MetodoPago/PanelPreviewMP";

export default function MetodosPagoConfig() {
  // Estados principales
  const [metodosPago, setMetodosPago] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  
  // Estados para la modalidad del formulario
  const [modoFormulario, setModoFormulario] = useState(null); // 'crear', 'editar' o null
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  
  // Estado para la vista previa
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
  
  // Estados para datos adicionales
  const [tazaBcv, setTazaBcv] = useState(36.75);
  const [costoInscripcion, setCostoInscripcion] = useState(50);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Simulación para desarrollo
        setTimeout(() => {
          // Datos simulados
          const metodosSimulados = [
            {
              id: 1,
              nombre: "Banco de Venezuela",
              descripcion: "Transferencia bancaria en bolívares",
              moneda: "VES",
              logo_url: "/assets/icons/BDV.png",
              activo: true,
              datos_adicionales: {
                api: false,
                slug: "bdv",
                alerta: "SI VA A REALIZAR TRÁMITES EN LINEA DEBERÁ DEPOSITAR SOLAMENTE EN LA CUENTA DEL BANCO DE VENEZUELA.",
                tipo_alerta: "danger",
                datos_cuenta: "Números de cuentas del Colegio de Odontólogos de Venezuela \nRIF.: J-00041277-4 \nA nombre del Colegio de Odontólogos de Venezuela \nCorreo: secretariafinanzas@elcov.org",
                rif: "J-00041277-4",
                titular: "Colegio de Odontólogos de Venezuela",
                numero_cuenta: "0102-0127-63-0000007511",
                correo: "secretariafinanzas@elcov.org"
              }
            },
            {
              id: 2,
              nombre: "PayPal",
              descripcion: "Pago a través de plataforma PayPal",
              moneda: "USD",
              logo_url: "/assets/icons/Paypal.png",
              activo: true,
              datos_adicionales: {
                api: true,
                slug: "paypal",
                alerta: "Recomendamos no colocar dirección de envío y liberar el pago. Hasta que este disponible el pago puede ser aceptado su trámite.",
                tipo_alerta: "info",
                datos_cuenta: "Para realizar los pagos desde PayPal deberás calcular la comisión en el siguiente formulario. Una vez conozca el monto a depositar deberás colocarlo en el formulario y sabrás el monto a depositar por PayPal. Tienes el botón de acceso directo para pagar en PayPal o el correo. \nSi estás realizando el trámite en línea deberás reportarlo adjuntando el pago a la página. En caso contrario deberás notificarlo al correo secretariafinanzas@elcov.org indicando información necesaria.",
                correo: "paypalelcov@gmail.com",
                url_pago: "https://www.paypal.com/paypalme/elcov"
              }
            },
            {
              id: 3,
              nombre: "Zelle",
              descripcion: "Transferencia en dólares vía Zelle",
              moneda: "USD",
              logo_url: "/assets/icons/Zelle.png",
              activo: false,
              datos_adicionales: {
                api: false,
                slug: "paypal",
                alerta: "Por el momento, este método de pago no está disponible.",
                tipo_alerta: "warning",
                datos_cuenta: "Información de Zelle no disponible actualmente.",
                correo: "pagos@elcov.org",
                url_pago: ""
              }
            }
          ];
          
          setMetodosPago(metodosSimulados);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar los métodos de pago. Por favor, intente de nuevo.");
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  // Manejar creación de método de pago
  const handleCrearMetodo = (nuevoMetodo) => {
    try {
      setLoading(true);
      
      // Simulación para desarrollo
      setTimeout(() => {
        const nuevoMetodoConId = {
          ...nuevoMetodo,
          id: Date.now()
        };
        
        // Eliminar el archivo de logo para simular que ya fue procesado
        if (nuevoMetodoConId.logo_file) {
          delete nuevoMetodoConId.logo_file;
        }
        
        setMetodosPago(prev => [...prev, nuevoMetodoConId]);
        setModoFormulario(null);
        mostrarNotificacion("Método de pago agregado correctamente", "success");
        
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error al crear método de pago:", err);
      mostrarNotificacion("Error al crear el método de pago", "error");
      setLoading(false);
    }
  };

  // Manejar edición de método de pago
  const handleEditarMetodo = (metodoEditado) => {
    try {
      setLoading(true);
      
      // Simulación para desarrollo
      setTimeout(() => {
        // Eliminar el archivo de logo para simular que ya fue procesado
        const metodoActualizado = { ...metodoEditado };
        if (metodoActualizado.logo_file) {
          delete metodoActualizado.logo_file;
        }
        
        setMetodosPago(prev => prev.map(m => m.id === metodoActualizado.id ? metodoActualizado : m));
        setModoFormulario(null);
        setMetodoSeleccionado(null);
        mostrarNotificacion("Método de pago actualizado correctamente", "success");
        
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error(`Error al actualizar método de pago:`, err);
      mostrarNotificacion("Error al actualizar el método de pago", "error");
      setLoading(false);
    }
  };

  // Manejar eliminación de método de pago
  const handleEliminarMetodo = (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este método de pago?")) {
      try {
        setLoading(true);
        
        // Simulación para desarrollo
        setTimeout(() => {
          setMetodosPago(prev => prev.filter(m => m.id !== id));
          mostrarNotificacion("Método de pago eliminado correctamente", "success");
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error(`Error al eliminar método de pago:`, err);
        mostrarNotificacion("Error al eliminar el método de pago", "error");
        setLoading(false);
      }
    }
  };

  // Mostrar notificación
  const mostrarNotificacion = (mensaje, tipo = "success") => {
    setNotification({
      show: true,
      message: mensaje,
      type: tipo
    });
    
    // Auto-ocultar notificación
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 5000);
  };

  // Obtener métodos de pago activos para la vista previa
  const getMetodosPagoActivos = () => {
    return metodosPago.filter(metodo => metodo.activo);
  };

  // Renderizar contenido según el estado de carga
  if (loading && metodosPago.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen md:py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D7008A]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-20 py-28">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#41023B] mb-2">
            Métodos de Pago
          </h1>
          <p className="text-gray-600">
            Administre los métodos de pago disponibles para los usuarios
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <motion.button
            onClick={() => setMostrarVistaPrevia(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye size={18} />
            <span>Vista previa</span>
          </motion.button>
          
          <motion.button
            onClick={() => {
              setModoFormulario("crear");
              setMetodoSeleccionado(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#D7008A] text-white rounded-lg hover:bg-[#41023B] transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} />
            <span>Agregar método</span>
          </motion.button>
        </div>
      </div>
      
      {/* Notificación */}
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`mb-6 p-4 rounded-lg ${
            notification.type === "success" ? "bg-green-50 border border-green-200" :
            notification.type === "error" ? "bg-red-50 border border-red-200" :
            "bg-blue-50 border border-blue-200"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
            ) : (
              <AlertTriangle className="text-red-500 mr-3 flex-shrink-0" size={20} />
            )}
            <p className={`text-sm ${
              notification.type === "success" ? "text-green-700" : "text-red-700"
            }`}>
              {notification.message}
            </p>
            <button
              onClick={() => setNotification({ ...notification, show: false })}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Error de carga */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="text-red-500 mr-3 flex-shrink-0" size={20} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {/* Formulario para crear o editar */}
      {modoFormulario && (
        <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-[#f8f9fa] border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#41023B]">
              {modoFormulario === "crear" ? "Agregar Nuevo Método de Pago" : "Editar Método de Pago"}
            </h2>
            <button
              onClick={() => {
                setModoFormulario(null);
                setMetodoSeleccionado(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6">
            <FormularioMetodoPago
              metodo={metodoSeleccionado}
              onSubmit={modoFormulario === "crear" ? handleCrearMetodo : handleEditarMetodo}
              onCancel={() => {
                setModoFormulario(null);
                setMetodoSeleccionado(null);
              }}
            />
          </div>
        </div>
      )}
      
      {/* Listado de métodos de pago */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-[#f8f9fa] border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#41023B]">
            Métodos de Pago Existentes
          </h2>
        </div>
        
        {metodosPago.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No hay métodos de pago configurados
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Agrega tu primer método de pago para que los usuarios puedan realizar sus pagos.
            </p>
            <button
              onClick={() => setModoFormulario("crear")}
              className="px-4 py-2 bg-[#D7008A] text-white rounded-lg hover:bg-[#41023B] transition-colors inline-flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Agregar método de pago
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {metodosPago.map((metodo) => (
              <div key={metodo.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-start">
                    <div className="w-14 h-14 mr-4 rounded-lg overflow-hidden flex items-center justify-center bg-white border border-gray-200">
                      {metodo.logo_url ? (
                        <img
                          src={metodo.logo_url}
                          alt={metodo.nombre}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <CreditCard className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900 mr-2">{metodo.nombre}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          metodo.activo
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {metodo.activo ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{metodo.descripcion}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                          {metodo.moneda || "USD"}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                          {metodo.datos_adicionales.slug}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setMetodoSeleccionado(metodo);
                        setMostrarVistaPrevia(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Vista previa"
                    >
                      <Eye size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setMetodoSeleccionado(metodo);
                        setModoFormulario("editar");
                      }}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEliminarMetodo(metodo.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Vista previa del panel completo */}
      {mostrarVistaPrevia && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <PanelPagosPreview
            metodosPago={metodoSeleccionado ? 
              (metodoSeleccionado.activo ? [metodoSeleccionado] : []) : 
              getMetodosPagoActivos()}
            tazaBcv={tazaBcv}
            costoInscripcion={costoInscripcion}
            onClose={() => {
              setMostrarVistaPrevia(false);
              setMetodoSeleccionado(null);
            }}
          />
        </div>
      )}
      
      {/* Overlay de carga */}
      {loading && metodosPago.length > 0 && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-[#D7008A] border-b-[#D7008A] border-r-transparent border-l-transparent mr-3"></div>
            <p className="text-gray-700">Procesando...</p>
          </div>
        </div>
      )}
    </div>
  );
}