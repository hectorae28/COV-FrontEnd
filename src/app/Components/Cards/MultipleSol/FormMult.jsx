"use client";

import { useState, useEffect } from 'react';
import { 
  FileText, 
  ArrowLeft, 
  CheckCircle
} from 'lucide-react';
// Make sure to use the correct import path based on your project structure
import SolicitudesFormSteps from './FormPasosMult';

export default function SolicitudesForm({ initialSolicitudTipo = 'individual', onCancel }) {
  const [solicitudTipo, setSolicitudTipo] = useState(initialSolicitudTipo);
  const [solicitudes, setSolicitudes] = useState([
    { tipo: 'constancia', seleccionada: false, precio: 15 },
    { tipo: 'carnet', seleccionada: false, precio: 25 },
    { tipo: 'especialidad', seleccionada: false, precio: 30 }
  ]);
  const [activeStep, setActiveStep] = useState(1);
  const [archivos, setArchivos] = useState({});
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    correo: '',
    telefono: '',
    metodo: 'transferencia',
    referencia: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Actualizar solicitudTipo cuando cambia el prop
  useEffect(() => {
    setSolicitudTipo(initialSolicitudTipo);
  }, [initialSolicitudTipo]);

  // Calcular precio total de las solicitudes seleccionadas
  const calcularTotal = () => {
    let total = 0;
    solicitudes.forEach(sol => {
      if (sol.seleccionada) {
        total += sol.precio;
      }
    });
    return total;
  };

  // Verificar si hay al menos una solicitud seleccionada
  const haySolicitudSeleccionada = () => {
    return solicitudes.some(s => s.seleccionada);
  };

  // Manejar el toggle de solicitudes
  const toggleSolicitud = (index) => {
    const newSolicitudes = [...solicitudes];
    newSolicitudes[index].seleccionada = !newSolicitudes[index].seleccionada;
    setSolicitudes(newSolicitudes);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Limpiar errores cuando el usuario escribe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Manejar carga de archivos
  const handleFileUpload = (e, tipo) => {
    const file = e.target.files[0];
    if (file) {
      setArchivos({
        ...archivos,
        [tipo]: file
      });
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cedula) newErrors.cedula = 'La cédula es requerida';
    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!formData.correo) newErrors.correo = 'El correo es requerido';
    if (formData.correo && !/\S+@\S+\.\S+/.test(formData.correo)) 
      newErrors.correo = 'Correo inválido';
    if (!formData.telefono) newErrors.telefono = 'El teléfono es requerido';
    
    if (activeStep === 2) {
      solicitudes.forEach(sol => {
        if (sol.seleccionada && sol.tipo === 'especialidad' && !archivos['titulo']) {
          newErrors.titulo = 'El título de especialidad es requerido';
        }
      });
    }
    
    if (activeStep === 3) {
      if (!formData.referencia) newErrors.referencia = 'El número de referencia es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Avanzar al siguiente paso
  const nextStep = () => {
    if (validateForm()) {
      setActiveStep(activeStep + 1);
    }
  };

  // Retroceder al paso anterior
  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulación de envío al servidor
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        
        // Reiniciar formulario después de 3 segundos
        setTimeout(() => {
          setActiveStep(1);
          setSolicitudes(solicitudes.map(s => ({ ...s, seleccionada: false })));
          setFormData({
            cedula: '',
            nombre: '',
            correo: '',
            telefono: '',
            metodo: 'transferencia',
            referencia: ''
          });
          setArchivos({});
          setIsSuccess(false);
          
          // Volver al panel principal si hay función onCancel
          if (onCancel) {
            onCancel();
          }
        }, 3000);
      }, 1500);
    }
  };

  // Renderizar el título adecuado según la solicitud
  const renderTitulo = () => {
    if (solicitudTipo === 'multiple') return 'Solicitud Múltiple';
    
    const seleccionada = solicitudes.find(s => s.seleccionada);
    if (!seleccionada) return 'Nueva Solicitud';
    
    return `Solicitud de ${seleccionada.tipo.charAt(0).toUpperCase() + seleccionada.tipo.slice(1)}`;
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      {/* Cabecera */}
      <div className="bg-gradient-to-b from-[#41023B] to-[#D7008A] p-4 flex justify-between items-center">
        <h2 className="text-white font-semibold text-lg flex items-center">
          <FileText className="mr-2" size={20} />
          {renderTitulo()}
        </h2>
        
        {/* Botón para volver */}
        {onCancel && !isSuccess && (
          <button 
            onClick={onCancel}
            className="text-white hover:text-gray-200 flex items-center"
            title="Volver al panel principal"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span className="text-sm">Volver</span>
          </button>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle size={60} className="text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-600">¡Solicitud Enviada!</h3>
            <p className="text-gray-600 text-center mt-2">
              Su solicitud ha sido recibida y está siendo procesada
            </p>
          </div>
        ) : (
          <div>
            {/* Pasos del formulario */}
            <div className="flex justify-between mb-6">
              <div className={`flex flex-col items-center w-1/3 ${activeStep >= 1 ? 'text-[#D7008A]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 1 ? 'bg-[#D7008A] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  1
                </div>
                <span className="text-xs mt-1">Tipo</span>
              </div>
              <div className={`flex flex-col items-center w-1/3 ${activeStep >= 2 ? 'text-[#D7008A]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 2 ? 'bg-[#D7008A] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
                <span className="text-xs mt-1">Documentos</span>
              </div>
              <div className={`flex flex-col items-center w-1/3 ${activeStep >= 3 ? 'text-[#D7008A]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 3 ? 'bg-[#D7008A] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  3
                </div>
                <span className="text-xs mt-1">Pago</span>
              </div>
            </div>

            {/* Render the Steps component */}
            <SolicitudesFormSteps 
              activeStep={activeStep}
              solicitudTipo={solicitudTipo}
              setSolicitudTipo={setSolicitudTipo}
              solicitudes={solicitudes}
              toggleSolicitud={toggleSolicitud}
              haySolicitudSeleccionada={haySolicitudSeleccionada}
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
              archivos={archivos}
              handleFileUpload={handleFileUpload}
              calcularTotal={calcularTotal}
              nextStep={nextStep}
              prevStep={prevStep}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCancel={onCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
}