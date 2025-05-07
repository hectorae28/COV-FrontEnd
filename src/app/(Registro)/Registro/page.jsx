"use client";
import BackgroundAnimation from "@/app/Components/Home/BackgroundAnimation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building,
  Check,
  ChevronLeft,
  ChevronRight,
  FilePlus,
  GraduationCap,
  Phone,
  User
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// Import step components
import { fetchDataSolicitudes } from "@/api/endpoints/landingPage";
import Head from "next/head";
import PagosColg from "../../Components/PagosModal";
import DocsRequirements from "../DocsRequirements";
import InfoColegiado from "../InfoColg";
import InfoContacto from "../InfoCont";
import InfoLaboral from "../InfoLab";
import InfoPersonal from "../InfoPers";

const steps = [
  {
    id: 1,
    title: "Información Personal",
    description: "Datos básicos de identificación",
    icon: User,
    component: InfoPersonal,
    requiredFields: [
      "nationality",
      "identityCard",
      "firstName",
      "firstLastName",
      "birthDate",
      "gender",
      "maritalStatus",
    ],
  },
  {
    id: 2,
    title: "Información de Contacto",
    description: "Cómo podemos comunicarnos contigo",
    icon: Phone,
    component: InfoContacto,
    requiredFields: ["email", "phoneNumber", "address", "city", "state"],
  },
  {
    id: 3,
    title: "Información del Colegiado",
    description: "Datos de tu colegiatura profesional",
    icon: GraduationCap,
    component: InfoColegiado,
    requiredFields: [
      "graduateInstitute",
      "universityTitle",
      "mppsRegistrationNumber",
      "mppsRegistrationDate",
      "titleIssuanceDate",
    ],
  },
  {
    id: 4,
    title: "Situación Laboral",
    description: "Tu experiencia y situación laboral actual",
    icon: Building,
    component: InfoLaboral,
    requiredFields: [
      "institutionName",
      "institutionAddress",
      "institutionPhone",
      "cargo"
    ]
  },
  {
    id: 5,
    title: "Documentos Requeridos",
    description: "Documentos necesarios",
    icon: FilePlus,
    component: DocsRequirements,
    requiredFields: [
      "ci",
      "rif",
      "titulo",
      "mpps",
    ],
  },
];

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [pagarLuego, setPagarLuego] = useState(false);

  const initialState = {
    tipo_profesion: "",
    nationality: "",
    identityCard: "",
    firstName: "",
    secondName: "",
    firstLastName: "",
    secondLastName: "",
    birthPlace: "",
    birthDate: "",
    gender: "",
    age: "",
    maritalStatus: "",
    email: "",
    countryCode: "+58",
    phoneNumber: "",
    homePhone: "",
    address: "",
    city: "",
    state: "",
    collegeNumber: "",
    professionalField: "",
    institutionName: "",
    institutionAddress: "",
    institutionPhone: "",
    clinicName: "",
    clinicAddress: "",
    clinicPhone: "",
    selectedOption: "",
    graduateInstitute: "",
    universityTitle: "",
    mainRegistrationNumber: "",
    mainRegistrationDate: "",
    mppsRegistrationNumber: "",
    mppsRegistrationDate: "",
    titleIssuanceDate: "",
    ci: null,
    rif: null,
    titulo: null,
    mpps: null,
  };
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isIntentionalSubmit, setIsIntentionalSubmit] = useState(false);
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [tasaBcv, setTasaBcv] = useState(0);
  const [costoInscripcion, setCostoInscripcion] = useState(0);
  const [metodoPago, setMetodoPago] = useState([]);
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({});
  const [attemptedNext, setAttemptedNext] = useState(false);

  useEffect(() => {
    // Only validate when attempted next is true
    if (attemptedNext) {
      validateStep(currentStep);
    }
  }, [formData, currentStep, attemptedNext]);

  useEffect(() => {
    const LoadData = async () => {
      try {
        const tasa = await fetchDataSolicitudes("tasa-bcv");
        setTasaBcv(tasa.data.rate);
        const costo = await fetchDataSolicitudes(
          "costo",
          `?search=Inscripcion+${formData.tipo_profesion}&es_vigente=true`
        );
        setCostoInscripcion(Number(costo.data[0].monto_usd));
        const Mpagos = await fetchDataSolicitudes("metodo-de-pago");
        setMetodoPago(Mpagos.data);
      } catch (error) {
        setError("Ocurrió un error al cargar los datos, verifique su conexión a internet");
      }
    };
    if (formData.tipo_profesion.length > 0) {
      LoadData();
    }
  }, [formData.tipo_profesion]);

  const handleInputChange = (updates) => {
    // Evitamos procesar actualizaciones isPersonalInfoValid
    // Esta propiedad causaba bucles de renderizado
    if (updates && updates.isPersonalInfoValid !== undefined) {
      const { isPersonalInfoValid, ...rest } = updates;
      updates = rest;
    }

    setFormData((prevState) => ({
      ...prevState,
      ...updates,
    }));

    // Clear validation errors for fields being updated
    if (updates) {
      const updatedFields = Object.keys(updates);
      const newValidationErrors = { ...validationErrors };

      updatedFields.forEach((field) => {
        if (newValidationErrors[field]) {
          delete newValidationErrors[field];
        }
      });

      setValidationErrors(newValidationErrors);
    }
  };

  const validateStep = (stepIndex) => {
    const step = steps[stepIndex - 1];
    const errors = {};
    let isValid = true;

    // Si es el paso de información laboral (paso 4) y ha seleccionado "no labora",
    // entonces saltamos la validación de los campos laborales
    if (stepIndex === 4 && formData.workStatus === "noLabora") {
      return true; // Validación exitosa, no hay errores
    }

    if (step.requiredFields && step.requiredFields.length > 0) {
      step.requiredFields.forEach((field) => {
        // Check for file fields (simplified check)
        if (["ci", "rif", "titulo", "mpps"].includes(field)) {
          if (!formData[field]) {
            errors[field] = true;
            isValid = false;
          }
        }
        // Check for other fields
        else if (
          !formData[field] ||
          (typeof formData[field] === "string" && formData[field].trim() === "")
        ) {
          errors[field] = true;
          isValid = false;
        }
      });
    }

    // Solo establecer errores de validación si estamos validando activamente (después de hacer clic en el botón)
    if (attemptedNext) {
      setValidationErrors(errors);
    }

    return isValid;
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      // For regular step navigation, only validate the current step without showing errors yet
      const isValid = validateStep(currentStep);

      if (isValid) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
        // Keep attemptedNext as false during normal navigation
        setAttemptedNext(false);
      } else {
        // Only show validation errors if trying to move to next step and fields are invalid
        setAttemptedNext(true);

        // Scroll to first error
        setTimeout(() => {
          const firstErrorElement = document.querySelector('.border-red-500');
          if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
      // Reset attempted next when going back
      setAttemptedNext(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Activar la bandera para mostrar errores de validación SOLO cuando intentamos proceder a pagos
    setAttemptedNext(true);

    // Validar el paso actual
    const isValid = validateStep(currentStep);

    if (isValid) {
      // Si todos los campos están completos, proceder
      if (isIntentionalSubmit) {
        setShowPaymentScreen(true);
        // No necesitamos reiniciar attemptedNext aquí ya que queremos mantener
        // los mensajes de error visibles si el usuario vuelve desde la pantalla de pagos
      }
    } else {
      // Si hay errores, hacer scroll al primer error
      setTimeout(() => {
        const firstErrorElement = document.querySelector('.border-red-500');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const handlePaymentComplete = async ({
    paymentDate = null,
    referenceNumber = null,
    paymentFile = null,
    totalAmount = null,
    metodo_de_pago = null,
  }) => {
    const Form = new FormData();
    Form.append("tipo_profesion", formData.tipo_profesion);
    Form.append(
      "persona",
      JSON.stringify({
        direccion: {
          referencia: formData.address,
          estado: 1,
        },
        nombre: formData.firstName,
        primer_apellido: formData.firstLastName,
        segundo_apellido: formData.secondLastName,
        segundo_nombre: formData.secondName,
        genero: formData.gender,
        nacionalidad: formData.nationality,
        identificacion: `${formData.idType}-${formData.identityCard}`,
        correo: formData.email,
        telefono_movil: `${formData.countryCode} ${formData.phoneNumber}`,
        telefono_de_habitacion: formData.homePhone,
        fecha_de_nacimiento: formData.birthDate,
        estado_civil: formData.maritalStatus,
      })
    );
    Form.append("instituto_bachillerato", formData.graduateInstitute);
    Form.append("universidad", formData.universityTitle);
    Form.append("fecha_egreso_universidad", formData.titleIssuanceDate);
    if(formData.tipo_profesion === "odontologo"){
      Form.append("num_registro_principal",formData.mainRegistrationNumber);
      Form.append("fecha_registro_principal",formData.mainRegistrationDate);
    }
    Form.append("num_mpps", formData.mppsRegistrationNumber);
    Form.append("fecha_mpps", formData.mppsRegistrationDate);
    Form.append(
      "instituciones",
      JSON.stringify(
        formData.laboralRegistros.map((registro) => ({
          nombre: registro.institutionName,
          cargo: registro.cargo,
          direccion: registro.institutionAddress,
          telefono: registro.institutionPhone,
          tipo_institucion: registro.institutionType,
        })) || []
      )
    );
    Form.append("file_ci", formData.ci || null);
    Form.append("file_rif", formData.rif || null);
    Form.append("file_fondo_negro", formData.titulo || null);
    Form.append("file_mpps", formData.mpps || null);
    Form.append("comprobante", paymentFile);
    if (
      formData.tipo_profesion === "tecnico" ||
      formData.tipo_profesion === "higienista"
    ) {
      Form.append("Fondo_negro_credencial", formData.Fondo_negro_credencial);
      Form.append("notas_curso", formData.notas_curso);
      Form.append(
        "fondo_negro_titulo_bachiller",
        formData.fondo_negro_titulo_bachiller
      );
    }
    !pagarLuego
      ? Form.append(
          "pago",
          JSON.stringify({
            fecha_pago: paymentDate,
            metodo_de_pago: metodo_de_pago.id,
            num_referencia: referenceNumber,
            monto: totalAmount,
          })
        )
      : Form.append("pago", null);
    setIsSubmitting(true);
    try {
      const response = await api.post("usuario/register/", Form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        setShowPaymentScreen(false);
        setIsComplete(true);
      }
    } catch (error) {
      console.error(
        "Error al enviar los datos:",
        error.response?.data || error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = steps.find(
    (step) => step.id === currentStep
  )?.component;
  const CurrentIcon = steps[currentStep - 1]?.icon;

  return (
    <>
      <Head>
        <title>Nuevo Colegiado - COV</title>
        <meta
          name="description"
          content="Formulario de registro para nuevos colegiados en el Colegio de Odontólogos de Venezuela."
        />
      </Head>
      <div className="relative w-full min-h-screen overflow-hidden mx-auto my-auto">
        {/* Header navigation - Improved responsiveness */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-4 right-0 left-0 z-20 px-4 sm:px-6 flex justify-between items-center"
        >
          {/* Botón Página Principal con Link */}
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-auto px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-xs sm:text-sm text-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1 sm:gap-2"
            >
              <span>Página Principal</span>
            </motion.button>
          </Link>

          {/* Enlace Iniciar Sesión */}
          <div className="flex items-center">
            <Link
              href="/Login"
              className="text-xs sm:text-sm text-gray-400 transition-colors duration-100 flex items-center group"
            >
              <span className="relative font-medium">
                ¿Ya tienes una cuenta?
                <span className="text-white hover:text-[#D7008A] text-sm sm:text-base ml-1 sm:ml-2 font-semibold group-hover:underline">
                  Iniciar sesión
                </span>
              </span>
            </Link>
          </div>
        </motion.div>

        <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-22">
          <div className="w-full max-w-full">
            {/* Responsive Row Layout */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-22">
              {/* Logo and Title Column */}
              <div className="w-full lg:w-4/12 flex flex-col items-center justify-center text-center mt-6">
                <motion.div
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-full"
                >
                  <div className="relative mb-6">
                    <Image
                      src="/assets/logo.png"
                      alt="Logo Colegio de Odontólogos de Venezuela"
                      width={420}
                      height={80}
                      className="mx-auto drop-shadow-md object-contain max-w-full h-auto mb-12"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Ccircle cx='90' cy='90' r='80' fill='%23ffffff' /%3E%3Ctext x='50%' y='50%' fontSize='24' textAnchor='middle' dominantBaseline='middle' fill='%23D7008A'%3ECOV%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-white bg-clip-text text-transparent mb-4">
                    {showPaymentScreen
                      ? "Registro de Pago"
                      : isComplete
                      ? "Registro Exitoso"
                      : "Registro de Nuevos Colegiados"}
                  </h1>
                  <p className="mt-3 text-white text-lg max-w-3xl mx-auto">
                    {showPaymentScreen
                      ? "Complete el pago para finalizar su registro"
                      : isComplete
                      ? "¡Gracias por completar su registro y pago!"
                      : "Complete el formulario en 5 sencillos pasos para unirse a nuestra comunidad profesional"}
                  </p>
                </motion.div>
              </div>
              {/* Form Column - Wider on larger screens */}
              <div className="w-full lg:w-8/12 lg:mt-8">
                <div className="relative">
                  {!isComplete && !showPaymentScreen && (
                    <div className="mb-8">
                      <div className="flex justify-between mb-4 relative">
                        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-400"></div>
                        <div
                          className="absolute top-5 left-0 h-2 bg-gradient-to-r from-[#D7008A] to-[#7a066f] rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(
                              ((currentStep - 1) / (steps.length - 1)) * 100,
                              currentStep === 1 ? 10 : 0
                            )}%`,
                          }}
                        ></div>
                        {steps.map((step) => {
                          const StepIcon = step.icon;
                          const isCompleted = step.id < currentStep;
                          const isCurrent = step.id === currentStep;
                          return (
                            <div
                              key={step.id}
                              className="flex flex-col items-center group z-10"
                            >
                              <div className="relative">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                    isCompleted
                                      ? "bg-[#D7008A] border-transparent"
                                      : isCurrent
                                      ? "bg-white border-[#D7008A]"
                                      : "bg-white border-gray-400"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <Check className="w-6 h-6 text-white" />
                                  ) : (
                                    <StepIcon
                                      className={`w-6 h-6 ${
                                        isCurrent
                                          ? "text-[#41023B]"
                                          : "text-gray-400"
                                      }`}
                                    />
                                  )}
                                </div>
                              </div>
                              <span
                                className={`mt-2 text-sm font-medium ${
                                  isCompleted
                                    ? "text-white"
                                    : isCurrent
                                    ? "text-[#D7008A]"
                                    : "text-gray-300"
                                } hidden sm:block`}
                              >
                                {step.title}
                              </span>
                            </div>
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
                        <h2 className="text-2xl font-bold text-[#41023B] mb-4">
                          ¡Registro Completado!
                        </h2>
                        <p className="text-gray-600 mb-8">
                          Gracias por registrarte y completar tu pago. Hemos
                          recibido tu información y pronto nos pondremos en
                          contacto contigo.
                        </p>
                        <button
                          onClick={() => {
                            setIsComplete(false);
                            setShowPaymentScreen(false);
                            setCurrentStep(1);
                            setFormData(initialState);
                            setIsIntentionalSubmit(false);
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-xl hover:opacity-90 transition-all"
                        >
                          Iniciar nuevo registro
                        </button>
                      </motion.div>
                    ) : showPaymentScreen ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 p-8"
                      >
                        {!pagarLuego && (
                          <PagosColg
                            props={{
                              handlePaymentComplete,
                              costo: costoInscripcion,
                              metodoPago,
                            }}
                          />
                        )}
                        <div className="flex flex-col space-y-4 mt-6">
                          <div className="p-4 bg-[#41023B]/20 rounded-xl border border-[#41023B]">
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={pagarLuego}
                                onChange={(e) =>
                                  setPagarLuego(e.target.checked)
                                }
                                className="h-5 w-5 text-[#D7008A] focus:ring-[#41023B] focus:bg-[#D7008A] rounded"
                              />
                              <p className="text-md text-gray-800">
                                <span className="text-[#41023B] font-bold text-lg">
                                  Pagar luego:
                                </span>{" "}
                                Al habilitar esta opción, el colegiado quedará
                                registrado con pago pendiente y podrá
                                completarlo posteriormente.
                              </p>
                            </label>
                          </div>
                        </div>
                        {pagarLuego && (
                          <div className="flex justify-center p-6">
                            <button
                              type="button"
                              onClick={handlePaymentComplete}
                              disabled={isSubmitting}
                              className="px-6 py-3 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                            >
                              {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                  <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Procesando...
                                </span>
                              ) : (
                                "Completar Registro"
                              )}
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="relative z-10">
                        <div className="p-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D7008A] to-[#41023B] flex items-center justify-center mr-4">
                              {CurrentIcon && (
                                <CurrentIcon className="w-5 h-5 text-white" />
                              )}
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

                        {/* Eliminado el panel de errores con lista de campos */}

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
                                  validationErrors={validationErrors}
                                  currentStep={currentStep} // Asegúrate de pasar currentStep como prop
                                  attemptedNext={attemptedNext} // Asegúrate de pasar attemptedNext como prop
                                  validateStep={validateStep}
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
                            rounded-xl text-base font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#41023B] focus:ring-opacity-50"
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
                              className="flex items-center px-6 py-3 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white
  rounded-xl text-base font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#41023B] focus:ring-opacity-50"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {isSubmitting ? (
                                <>
                                  <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Procesando...
                                </>
                              ) : (
                                "Continuar a Pagos"
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
        </div>
        <BackgroundAnimation />
        <div className="absolute inset-0 bg-white/13 backdrop-blur-md" />
      </div>
    </>
  );
}
