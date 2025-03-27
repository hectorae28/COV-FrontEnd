"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, ChevronRight, ChevronLeft, User, Phone, GraduationCap, Building } from "lucide-react";
import confetti from "canvas-confetti";

// Import step components
import InfoPersonal from "./InfoPers";
import InfoContacto from "./InfoCont";
import InfoColegiado from "./InfoColg";
import InfoLaboral from "./InfoLab";

const steps = [
  {
    id: 1,
    title: "Información Personal",
    description: "Datos básicos de identificación",
    icon: User,
    component: InfoPersonal
  },
  {
    id: 2,
    title: "Información de Contacto",
    description: "Cómo podemos comunicarnos contigo",
    icon: Phone,
    component: InfoContacto
  },
  {
    id: 3,
    title: "Información del Colegiado",
    description: "Datos de tu colegiatura profesional",
    icon: GraduationCap,
    component: InfoColegiado
  },
  {
    id: 4,
    title: "Información Laboral",
    description: "Tu experiencia y situación laboral actual",
    icon: Building,
    component: InfoLaboral,
    requiredFields: ["selectedOption"]
  },
];

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nationality: "",
    identityCard: "",
    firstName: "",
    lastName: "",
    birthPlace: "",
    birthDate: "",
    age: "",
    maritalStatus: "",
    email: "",
    phoneNumber: "",
    address: "",
    collegeNumber: "",
    professionalField: "",
    institutionName: "",
    institutionAddress: "",
    institutionPhone: "",
    clinicName: "",
    clinicAddress: "",
    clinicPhone: "",
    selectedOption: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isIntentionalSubmit, setIsIntentionalSubmit] = useState(false);

  const handleInputChange = (updates) => {
    setFormData((prevState) => ({
      ...prevState,
      ...updates,
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const isCurrentStepValid = () => {
    const currentStepData = steps[currentStep - 1];
    if (!currentStepData.requiredFields) return true;
    
    return currentStepData.requiredFields.every(field => 
      formData[field] && formData[field].trim() !== ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Solo procesar si hay una sumisión intencional
    if (isIntentionalSubmit) {
      setIsSubmitting(true);
  
      // Simular un retraso para procesar el formulario (opcional)
      await new Promise((resolve) => setTimeout(resolve, 1500));
  
      // Mostrar el confeti 
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
  
      // Finalizar el proceso y mostrar la pantalla de confirmación
      setIsSubmitting(false);
      setIsComplete(true);
    }
  };

  const CurrentStepComponent = steps.find(step => step.id === currentStep)?.component;
  const CurrentIcon = steps[currentStep - 1]?.icon;

  return (
    <div className="relative w-full min-h-screen bg-[#F9F9F9] overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#D7008A] to-[#41023B] bg-clip-text text-transparent mb-4">
              Registro de Nuevos Colegiados
            </h1>

            <p className="mt-3 text-gray-700 text-lg max-w-3xl mx-auto">
              Complete el formulario en 4 sencillos pasos para unirse a nuestra comunidad profesional
            </p>
          </div>

          <div className="relative">
            {!isComplete && (
              <div className="mb-8">
                <div className="flex justify-between mb-4 relative">
                  <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-400"></div>
                  
                  <div 
                    className="absolute top-5 left-0 h-2 bg-gradient-to-r from-[#D7008A] to-[#41023B] rounded-full transition-all duration-500"
                    style={{ 
                      width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
                    }}
                  ></div>
                  
                  {steps.map((step) => {
                    const StepIcon = step.icon;
                    const isCompleted = step.id < currentStep;
                    const isCurrent = step.id === currentStep;
                    
                    return (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(step.id)}
                        className="flex flex-col items-center group z-10"
                      >
                        <div className="relative">
                          <motion.div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              isCompleted
                                ? "bg-[#41023B] border-transparent"
                                : isCurrent
                                  ? "bg-white border-[#41023B]"
                                  : "bg-white border-gray-400"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isCompleted ? (
                              <Check className="w-6 h-6 text-white" />
                            ) : (
                              <StepIcon className={`w-6 h-6 ${isCurrent ? "text-[#41023B]" : "text-gray-400"}`} />
                            )}
                          </motion.div>
                        </div>
                        <span
                          className={`mt-2 text-sm font-medium ${
                            isCompleted 
                              ? "text-[#D7008A]" 
                              : isCurrent
                                ? "text-[#41023B]"
                                : "text-gray-700"
                          } hidden sm:block`}
                        >
                          {step.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white">
              {isComplete ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 p-8 text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-[#D7008A] to-[#41023B] rounded-full mx-auto flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#41023B] mb-4">¡Registro Completado!</h2>
                  <p className="text-gray-600 mb-8">
                    Gracias por registrarte. Hemos recibido tu información y pronto nos pondremos en contacto contigo.
                  </p>
                  <button
                    onClick={() => {
                      setIsComplete(false);
                      setCurrentStep(1);
                      setFormData({
                        nationality: "",
                        identityCard: "",
                        firstName: "",
                        lastName: "",
                        birthPlace: "",
                        birthDate: "",
                        age: "",
                        maritalStatus: "",
                        email: "",
                        phoneNumber: "",
                        address: "",
                        collegeNumber: "",
                        professionalField: "",
                        institutionName: "",
                        institutionAddress: "",
                        institutionPhone: "",
                        clinicName: "",
                        clinicAddress: "",
                        clinicPhone: "",
                        selectedOption: "",
                      });
                      setIsIntentionalSubmit(false);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-xl hover:opacity-90 transition-all"
                  >
                    Iniciar nuevo registro
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="relative z-10">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D7008A] to-[#41023B] flex items-center justify-center mr-4">
                        {CurrentIcon && <CurrentIcon className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <h2 className="sm:text-xl font-bold text-[#41023B]">
                          {steps[currentStep - 1].title}
                        </h2>
                        <p className="text-gray-700 text-sm">
                          {steps[currentStep - 1].description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="min-h-[400px]"
                      >
                        {CurrentStepComponent && (
                          <CurrentStepComponent
                            formData={formData}
                            onInputChange={handleInputChange}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="p-6 border-t border-gray-300 flex justify-between">
                    {currentStep > 1 ? (
                      <motion.button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center px-5 py-2.5 bg-white text-[#41023B] border border-gray-700 
                        rounded-xl text-base font-medium shadow-sm hover:shadow-md hover:bg-[#41023B] hover:text-white 
                        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#41023B] focus:ring-opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Anterior
                      </motion.button>
                    ) : (
                      <div></div>
                    )}

                    {currentStep < steps.length ? (
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center px-5 py-2.5 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white 
                        rounded-xl text-base font-medium shadow-md hover:shadow-lg hover:opacity-90 
                        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#41023B] focus:ring-opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Siguiente
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        onClick={() => setIsIntentionalSubmit(true)}
                        className={`flex items-center px-6 py-3 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white 
                        rounded-xl text-base font-medium shadow-md hover:shadow-lg hover:opacity-90 
                        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#41023B] focus:ring-opacity-50`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando...
                          </>
                        ) : (
                          "Completar registro"
                        )}
                      </motion.button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}