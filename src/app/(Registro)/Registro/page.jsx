"use client"
import { patchDataUsuario, postDataUsuario } from "@/api/endpoints/colegiado"
import { fetchExistencePersona } from "@/api/endpoints/persona"
import BackgroundAnimation from "@/app/Components/Home/BackgroundAnimation"
import confetti from "canvas-confetti"
import { AnimatePresence, motion } from "framer-motion"
import { Building, Check, ChevronLeft, ChevronRight, FilePlus, GraduationCap, Mail, Phone, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
// Import step components
import api from "@/api/api"
import { fetchDataSolicitudes } from "@/api/endpoints/landingPage"
import Alert from "@/app/Components/Alert"
import { Form } from "antd"
import Head from "next/head"
import PagosColg from "../../Components/PagosModal"
import DocsRequirements from "../DocsRequirements"
import EmailVerification from "../EmailVerification"
import InfoColegiado from "../InfoColg"
import InfoContacto from "../InfoCont"
import InfoLaboralWithDireccionForm from "../InfoLab"
import InfoPersonal from "../InfoPers"

const steps = [
  {
    id: 1,
    title: "Información Personal",
    description: "Datos básicos de identificación",
    icon: User,
    component: InfoPersonal,
    requiredFields: [
      "documentType",
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
    requiredFields: ["email", "phoneNumber", "address", "state", "municipio"],
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
      "tipo_profesion",
    ],
  },
  {
    id: 4,
    title: "Situación Laboral",
    description: "Tu experiencia y situación laboral actual",
    icon: Building,
    component: InfoLaboralWithDireccionForm,
    requiredFields: ["institutionName", "institutionAddress", "institutionPhone", "cargo", "institutionType"],
  },
  {
    id: 5,
    title: "Documentos Requeridos",
    description: "Documentos necesarios",
    icon: FilePlus,
    component: DocsRequirements,
    requiredFields: ["ci", "rif", "titulo", "mpps"],
  },
]

export default function RegistrationForm(props) {
  const [currentStep, setCurrentStep] = useState(1)
  const [pagarLuego, setPagarLuego] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [isResendingCode, setIsResendingCode] = useState(false)
  const [verifiedEmails, setVerifiedEmails] = useState([])
  const [recaudoCreado, setRecaudoCreado] = useState({})

  const initialState = {
    // Para tipo_profesion
    tipo_profesion: props?.tipo_profesion || "",

    // Persona data
    documentType: props?.persona?.documentType || "", // Nuevo campo para tipo de documento (vacío por defecto)
    identityCard: props?.persona?.identificacion?.substring(0, 1) || "",
    idType: props?.persona?.identificacion?.substring(1) || "V",
    firstName: props?.persona?.nombre || "",
    secondName: props?.persona?.segundo_nombre || "",
    firstLastName: props?.persona?.primer_apellido || "",
    secondLastName: props?.persona?.segundo_apellido || "",
    birthDate: props?.persona?.fecha_de_nacimiento || "",
    gender: props?.persona?.genero || "",
    maritalStatus: props?.persona?.estado_civil || "",
    email: props?.persona?.correo || "",
    emailVerified: false, // Nuevo campo para rastrear si el correo electrónico se ha verificado
    countryCode: props?.persona?.telefono_movil?.split(" ")[0] || "+58",
    phoneNumber: props?.persona?.telefono_movil?.split(" ")[1] || "",
    homePhone: props?.persona?.telefono_de_habitacion || "",

    // Dirección
    address: props?.persona?.direccion?.referencia || "",
    city: props?.ciudad || "",
    state: "", // || "",

    // Información académica
    graduateInstitute: props?.instituto_bachillerato || "",
    universityTitle: props?.universidad || "",
    mainRegistrationNumber: props?.num_registro_principal || "",
    mainRegistrationDate: props?.fecha_registro_principal || "",
    mppsRegistrationNumber: props?.num_mpps || "",
    mppsRegistrationDate: props?.fecha_mpps || "",
    titleIssuanceDate: props?.fecha_egreso_universidad || "",

    // Archivos requeridos
    ci: props?.file_ci_url || null,
    rif: props?.file_rif_url || null,
    titulo: props?.file_fondo_negro_url || null,
    mpps: props?.file_mpps_url || null,

    // Archivos adicionales para técnicos e higienistas
    fondo_negro_credencial: props?.file_fondo_negro_credencial_url || null,
    notas_curso: props?.file_notas_curso_url || null,
    fondo_negro_titulo_bachiller: props?.file_fondo_negro_titulo_bachiller_url || null,

    // Datos laborales (que se recorren como un array)
    laboralRegistros:
      props?.instituciones?.map((inst) => ({
        institutionName: inst.nombre || "",
        cargo: inst.cargo || "",
        institutionAddress: inst.direccion || "",
        institutionPhone: inst.telefono || "",
        institutionType: inst.tipo_institucion || "CDP",
      })) || [],
  }
  const [formData, setFormData] = useState(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isIntentionalSubmit, setIsIntentionalSubmit] = useState(false)
  const [showPaymentScreen, setShowPaymentScreen] = useState(false)
  const [tasaBcv, setTasaBcv] = useState(0)
  const [costoInscripcion, setCostoInscripcion] = useState(0)
  const [metodoPago, setMetodoPago] = useState([])
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const [attemptedNext, setAttemptedNext] = useState(false)
  const [isCreated, setIsCreated] = useState(false)

  // Guardar el email original cuando se carga el componente o cuando cambia el email
  useEffect(() => {
    // Si el correo está verificado y no está en la lista de correos verificados, añadirlo
    if (formData.emailVerified && formData.email && !verifiedEmails.includes(formData.email)) {
      setVerifiedEmails((prev) => [...prev, formData.email])
    }
  }, [formData.email, formData.emailVerified, verifiedEmails])

  useEffect(() => {
    // Only validate when attempted next is true
    if (attemptedNext) {
      validateStep(currentStep)
    }
  }, [formData, currentStep, attemptedNext])

  useEffect(() => {
    const LoadData = async () => {
      try {
        const tasa = await fetchDataSolicitudes("tasa-bcv")
        setTasaBcv(tasa.data.rate)
        const costo = await fetchDataSolicitudes(
          "costo",
          `?search=Inscripcion+${formData.tipo_profesion}&es_vigente=true`,
        )
        setCostoInscripcion(Number(costo.data[0].monto_usd))
        const Mpagos = await fetchDataSolicitudes("metodo-de-pago")
        setMetodoPago(Mpagos.data)
      } catch (error) {
        setError("Ocurrió un error al cargar los datos, verifique su conexión a internet")
      }
    }
    if (formData.tipo_profesion.length > 0) {
      LoadData()
    }
  }, [formData.tipo_profesion])

  const handleInputChange = (updates) => {
    // Evitamos procesar actualizaciones isPersonalInfoValid
    // Esta propiedad causaba bucles de renderizado
    if (updates && updates.isPersonalInfoValid !== undefined) {
      const { isPersonalInfoValid, ...rest } = updates
      updates = rest
    }

    // Si hay un cambio de email, verificar si necesita nueva verificación
    if (updates && updates.email !== undefined) {
      // Verificar si el nuevo correo ya ha sido verificado anteriormente
      const isAlreadyVerified = verifiedEmails.includes(updates.email)

      // Actualizar el estado de verificación según corresponda
      updates.emailVerified = isAlreadyVerified
    }

    setFormData((prevState) => ({
      ...prevState,
      ...updates,
    }))

    // Clear validation errors for fields being updated
    if (updates) {
      const updatedFields = Object.keys(updates)
      const newValidationErrors = { ...validationErrors }

      updatedFields.forEach((field) => {
        if (newValidationErrors[field]) {
          delete newValidationErrors[field]
        }
      })

      setValidationErrors(newValidationErrors)
    }
  }

  const validateStep = (stepIndex) => {
    console.log({ formData })
    const step = steps[stepIndex - 1]
    const errors = {}
    let isValid = true

    // Si es el paso 5 (Documentos), agregar campos adicionales según tipo_profesion
    if (stepIndex === 5) {
      // Crear una copia de los campos requeridos base
      let fieldsToValidate = [...step.requiredFields]
      // Agregar campos adicionales para técnicos e higienistas
      if (formData.tipo_profesion === "tecnico" || formData.tipo_profesion === "higienista") {
        fieldsToValidate = [
          ...fieldsToValidate,
          "fondo_negro_titulo_bachiller",
          "fondo_negro_credencial",
          "notas_curso",
        ]
      }
      // Validar todos los campos requeridos
      fieldsToValidate.forEach((field) => {
        if (!formData[field]) {
          errors[field] = true
          isValid = false
        }
      })
      // Establecer errores de validación si estamos validando activamente
      if (attemptedNext) {
        setValidationErrors(errors)
      }
      return isValid
    }

    // Para los demás pasos, mantener la validación estándar
    if (stepIndex === 4 && formData.workStatus === "noLabora") {
      return true // Validación exitosa, no hay errores
    }

    if (step.requiredFields && step.requiredFields.length > 0) {
      step.requiredFields.forEach((field) => {
        if (!formData[field] || (typeof formData[field] === "string" && formData[field].trim() === "")) {
          errors[field] = true
          isValid = false
        }
      })
    }

    // Validación específica para cédula (solo en el paso 1)
    if (stepIndex === 1 && formData.documentType === "cedula" && formData.identityCard) {
      // Verificar que la cédula tenga entre 7 y 8 dígitos
      if (formData.identityCard.length < 7 || formData.identityCard.length > 8) {
        errors["identityCard"] = true
        isValid = false
      }
    }

    // Solo establecer errores de validación si estamos validando activamente
    if (attemptedNext) {
      setValidationErrors(errors)
    }
    console.log({ isValid })
    return isValid
  }

  const nextStep = async () => {
    if (currentStep < steps.length) {
      if (currentStep == 1) {
        const isStepValid = validateStep(currentStep);
        if (isStepValid) {
          const exists = await handleIdentityCardDuplicateVerification()
          const errors = {}
          if (exists) {
            errors["identityCard-duplicate"] = true
            setValidationErrors(errors)
            return
          } else {
            errors["identityCard-duplicate"] = false
            setValidationErrors(errors)
          }
        }
      }

      // Para el paso 2 (Información de Contacto), verificar si el correo ya está verificado
      if (currentStep === 2) {
        // Validar primero el paso actual
        const isStepValid = validateStep(currentStep)

        if (isStepValid) {
          // Si el correo no está verificado, mostrar la pantalla de verificación
          if (!formData.emailVerified) {
            setShowEmailVerification(true)
            // Reiniciar attemptedNext para la próxima vez
            setAttemptedNext(false)
            return // Detener aquí, no avanzar al siguiente paso todavía
          }

          // Si el correo ya está verificado, proceder normalmente
          setCurrentStep(currentStep + 1)
          window.scrollTo(0, 0)
          setAttemptedNext(false)
        } else {
          // Mostrar errores de validación
          setAttemptedNext(true)

          // Scroll al primer error
          setTimeout(() => {
            const firstErrorElement = document.querySelector(".border-red-500")
            if (firstErrorElement) {
              firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" })
            }
          }, 100)
        }
        return
      }

      // Para regular step navigation, only validate the current step without showing errors yet
      const isValid = validateStep(currentStep)

      if (isValid) {
        setCurrentStep(currentStep + 1)
        window.scrollTo(0, 0)
        // Keep attemptedNext as false during normal navigation
        setAttemptedNext(false)
      } else {
        // Only show validation errors if trying to move to next step and fields are invalid
        setAttemptedNext(true)

        // Scroll to first error
        setTimeout(() => {
          const firstErrorElement = document.querySelector(".border-red-500")
          if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 100)
      }
    }
  }

  const prevStep = () => {
    if (showEmailVerification) {
      // Si estamos en la pantalla de verificación, volver al paso 2
      setShowEmailVerification(false)
      // Resetear attempted next
      setAttemptedNext(false)
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
      // Reset attempted next when going back
      setAttemptedNext(false)
    }
  }

  // Función para validar Número de identificación Duplicado
  const handleIdentityCardDuplicateVerification = async () => {
    const queryParams = new URLSearchParams({
      "tipo_identificacion": formData.documentType,
      "inicial": formData.idType,
      "identificacion": formData.identityCard,
    }).toString();
    const res = await fetchExistencePersona(`check-existence`, queryParams);
    return res.exists
  }

  // Función para iniciar el proceso de verificación de correo
  const handleRequestEmailVerification = (email) => {
    if (!email) return
    setShowEmailVerification(true)
  }

  // Función para manejar el reenvío del código
  const handleResendVerificationCode = async () => {
    setIsResendingCode(true)

    // Simulación de reenvío (aquí irían las llamadas a la API real)
    const res = await postDataUsuario(`send-verification-email`, {
      "email": formData.email,
    })
    setIsResendingCode(false)

    // Aquí puedes implementar la llamada real a tu API para reenviar el código
  }

  // Función que se ejecuta cuando la verificación de correo es exitosa
  const handleEmailVerificationSuccess = () => {
    // Actualizar formData para marcar el correo como verificado
    handleInputChange({ emailVerified: true })

    // Añadir el correo a la lista de correos verificados
    if (!verifiedEmails.includes(formData.email)) {
      setVerifiedEmails((prev) => [...prev, formData.email])
    }

    // Ocultar la pantalla de verificación
    setShowEmailVerification(false)

    // Avanzar al paso 3
    setCurrentStep(3)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Activar la bandera para mostrar errores de validación SOLO cuando intentamos proceder a pagos
    setAttemptedNext(true);
    console.log({ formData })

    // Validar el paso actual
    const isValid = validateStep(currentStep);


    if (isValid) {
      // Si todos los campos están completos, proceder
      if (isIntentionalSubmit) {
        const Form = new FormData();
        Form.append("tipo_profesion", formData.tipo_profesion);
        Form.append(
          "persona",
          JSON.stringify({
            direccion: {
              referencia: formData.address,
              estado: Number(formData.state),
              municipio: formData.municipio,
            },
            nombre: formData.firstName,
            primer_apellido: formData.firstLastName,
            segundo_apellido: formData.secondLastName,
            segundo_nombre: formData.secondName,
            genero: formData.gender,
            // Ajustar para manejar pasaporte o cédula
            nacionalidad:
              formData.documentType === "cedula" ? "venezolana" : "extranjera",
            identificacion:
              formData.documentType === "cedula"
                ? `${formData.idType}${formData.identityCard}`
                : formData.identityCard,
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
        if (formData.tipo_profesion === "odontologo") {
          Form.append(
            "num_registro_principal",
            formData.mainRegistrationNumber
          );
          Form.append(
            "fecha_registro_principal",
            formData.mainRegistrationDate
          );
        }
        Form.append("num_mpps", formData.mppsRegistrationNumber);
        Form.append("fecha_mpps", formData.mppsRegistrationDate);
        Form.append(
          "instituciones",
          JSON.stringify(
            formData.laboralRegistros.map((registro) => ({
              nombre: registro.institutionName,
              cargo: registro.cargo,
              direccion: {
                estado: Number(registro.selectedEstado),
                municipio: Number(registro.selectedMunicipio),
                referencia: registro.institutionAddress
              },
              telefono: registro.institutionPhone,
              tipo_institucion: registro.institutionType,
            })) || []
          )
        );
        Form.append("file_ci", formData.ci || null);
        Form.append("file_rif", formData.rif || null);
        Form.append("file_fondo_negro", formData.titulo || null);
        Form.append("file_mpps", formData.mpps || null);
        if (
          formData.tipo_profesion === "tecnico" ||
          formData.tipo_profesion === "higienista"
        ) {
          Form.append(
            "fondo_negro_credencial",
            formData.fondo_negro_credencial
          );
          Form.append("notas_curso", formData.notas_curso);
          Form.append(
            "fondo_negro_titulo_bachiller",
            formData.fondo_negro_titulo_bachiller
          );
        }
        try {
          if (!isCreated) {
            setIsSubmitting(true);
            console.log({ Form })
            const response = await api.post("usuario/register/", Form, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            if (response.status === 201) {
              setShowPaymentScreen(true);
              setIsComplete(false);
              setRecaudoCreado(response.data);
              setIsSubmitting(false)
              setIsCreated(true)
            }
          } else {
            const response = await api.patch(`usuario/register/${recaudoCreado.id}/`, Form, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            if (response.status === 200) {
              setShowPaymentScreen(true);
              setIsSubmitting(false)
            }
          }
        } catch (error) {
          setError({ detail: `Error: ${error.response?.data || error}` });
        } finally {
          setIsSubmitting(false);
        }
        // No necesitamos reiniciar attemptedNext aquí ya que queremos mantener
        // los mensajes de error visibles si el usuario vuelve desde la pantalla de pagos
      }
    } else {
      // Si hay errores, hacer scroll al primer error
      setTimeout(() => {
        const firstErrorElement = document.querySelector(".border-red-500");
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }
  };

  const handlePago = async ({
    paymentDate = null,
    referenceNumber = null,
    paymentFile = null,
    totalAmount = null,
    metodo_de_pago = null,
  }) => {
    if (!pagarLuego) {
      const Form = new FormData()
      Form.append(
        "pago",
        JSON.stringify({
          fecha_pago: paymentDate,
          metodo_de_pago: metodo_de_pago.id,
          num_referencia: referenceNumber,
          monto: totalAmount,
        }),
      )
      Form.append("comprobante", paymentFile)
      setIsSubmitting(true)
    }
    try {
      let res
      if (!pagarLuego) {
        res = await patchDataUsuario(
          `register/${recaudoCreado.id}`,
          Form,
        );
        if (res?.status === 200) {
          setError(null)
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })
          setShowPaymentScreen(false)
          setIsComplete(true)
          setIsSubmitting(false)
          return
        }
      } else {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
        setShowPaymentScreen(false)
        setIsComplete(true)
        setIsSubmitting(false)
      }
    } catch (error) {
      setError({ detail: `error ${error.response?.data || error}` })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Determinar qué componente mostrar
  const renderCurrentStep = () => {
    if (showEmailVerification) {
      return (
        <EmailVerification
          email={formData.email}
          onVerificationSuccess={handleEmailVerificationSuccess}
          onGoBack={prevStep}
          isResending={isResendingCode}
          onResendCode={handleResendVerificationCode}
        />
      )
    }

    const CurrentStepComponent = steps.find((step) => step.id === currentStep)?.component

    if (CurrentStepComponent === InfoContacto) {
      return (
        <CurrentStepComponent
          formData={formData}
          onInputChange={handleInputChange}
          validationErrors={validationErrors}
          attemptedNext={attemptedNext}
          requestEmailVerification={handleRequestEmailVerification}
        />
      )
    }

    return (
      CurrentStepComponent && (
        <CurrentStepComponent
          formData={formData}
          onInputChange={handleInputChange}
          validationErrors={validationErrors}
          currentStep={currentStep}
          attemptedNext={attemptedNext}
          validateStep={validateStep}
        />
      )
    )
  }

  const CurrentIcon = steps[currentStep - 1]?.icon

  return (
    <>
      <Head>
        <title>Nuevo Colegiado - COV</title>
        <meta
          name="description"
          content="Formulario de registro para nuevos colegiados en el Colegio de Odontólogos de Venezuela."
        />
      </Head>
      <div className="select-none cursor-default relative w-full min-h-screen overflow-hidden mx-auto my-auto">
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
                        e.target.onerror = null
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Ccircle cx='90' cy='90' r='80' fill='%23ffffff' /%3E%3Ctext x='50%' y='50%' fontSize='24' textAnchor='middle' dominantBaseline='middle' fill='%23D7008A'%3ECOV%3C/text%3E%3C/svg%3E"
                      }}
                    />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-white bg-clip-text text-transparent mb-4">
                    {showPaymentScreen
                      ? "Registro de Pago"
                      : isComplete
                        ? "Registro Exitoso"
                        : showEmailVerification
                          ? "Verificación de Correo Electrónico"
                          : "Registro de Nuevos Colegiados"}
                  </h1>
                  <p className="mt-3 text-white text-lg max-w-3xl mx-auto">
                    {showPaymentScreen
                      ? "Complete el pago para finalizar su registro"
                      : isComplete
                        ? "¡Gracias por completar su registro y pago!"
                        : showEmailVerification
                          ? "Verifique su correo electrónico para continuar con el proceso de registro"
                          : "Complete el formulario en 5 sencillos pasos para unirse a nuestra comunidad profesional"}
                  </p>
                </motion.div>
              </div>
              {/* Form Column - Wider on larger screens */}
              <div className="w-full lg:w-8/12 lg:mt-8">
                <div className="relative">
                  {!isComplete && !showPaymentScreen && !showEmailVerification && (
                    <div className="mb-8">
                      <div className="flex justify-between mb-4 relative">
                        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-400"></div>
                        <div
                          className="absolute top-5 left-0 h-2 bg-gradient-to-r from-[#D7008A] to-[#7a066f] rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(
                              ((currentStep - 1) / (steps.length - 1)) * 100,
                              currentStep === 1 ? 10 : 0,
                            )}%`,
                          }}
                        ></div>
                        {steps.map((step) => {
                          const StepIcon = step.icon
                          const isCompleted = step.id < currentStep
                          const isCurrent = step.id === currentStep
                          return (
                            <div key={step.id} className="flex flex-col items-center group z-10">
                              <div className="relative">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
                                    ? "bg-[#D7008A] border-transparent"
                                    : isCurrent
                                      ? "bg-white border-[#D7008A]"
                                      : "bg-white border-gray-400"
                                    }`}
                                >
                                  {isCompleted ? (
                                    <Check className="w-6 h-6 text-white" />
                                  ) : (
                                    <StepIcon className={`w-6 h-6 ${isCurrent ? "text-[#41023B]" : "text-gray-400"}`} />
                                  )}
                                </div>
                              </div>
                              <span
                                className={`mt-2 text-sm font-medium ${isCompleted ? "text-white" : isCurrent ? "text-[#D7008A]" : "text-gray-300"
                                  } hidden sm:block`}
                              >
                                {step.title}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white pt-10 px-8">
                    {error && <Alert type="alert">{error.detail}</Alert>}
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
                        <h2 className="text-2xl font-bold text-[#41023B] mb-4">¡Su Solicitud de Registro ha sido enviado con éxito!</h2>
                        <p className="text-gray-600 mb-6">
                          Gracias por registrarse. Hemos recibido su información y pronto nos
                          pondremos en contacto con usted.
                        </p>

                        {/* Mensaje condicional si seleccionó pagar luego */}
                        {pagarLuego && (
                          <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                            <p className="text-yellow-800 font-medium">
                              Para completar su solicitud, primero debe solicitar el enlace de pago desde la página de inicio de sesión. Una vez haya recibido el enlace y realizado el pago correspondiente, su solicitud será procesada.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ) : showPaymentScreen ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10"
                      >
                        {/* Botón de regresar en la esquina superior izquierda */}
                        <div className="absolute top-4 left-4">
                          <button
                            type="button"
                            onClick={() => setShowPaymentScreen(false)}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                          >
                            <span className="flex items-center justify-center">
                              <ChevronLeft className="w-5 h-5 mr-1" />
                              Regresar
                            </span>
                          </button>
                        </div>
                        {!pagarLuego && (
                          <PagosColg props={{
                            costo: costoInscripcion,
                            allowMultiplePayments: false,
                            handlePago: handlePago,
                          }}
                          />
                        )}
                        {/* Sección de "Pagar luego" con el mismo estilo que RegistrarColegiadoModal */}
                        <div className="w-full max-w-md mx-auto mt-6">
                          <div className="flex justify-center gap-4">
                            {/* Pagar Luego */}
                            <button
                              type="button"
                              onClick={() => setPagarLuego(!pagarLuego)}
                              className={`flex-1 px-6 py-2 rounded-full text-sm font-semibold border transition-all duration-30 ${pagarLuego
                                ? "bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white border-white shadow-md"
                                : "bg-white text-[#41023B] border-[#41023B] hover:bg-[#41023B]/10"
                                }`}
                            >
                              Pagar luego
                            </button>
                          </div>

                          {/* Mensaje informativo */}
                          {pagarLuego && (
                            <div className="mt-4 text-center text-sm text-[#41023B] font-medium">
                              El usuario podrá completar el pago más adelante.
                            </div>
                          )}
                        </div>
                        <div className="flex justify-center p-6 gap-6">
                          {pagarLuego && (
                            <button
                              type="button"
                              onClick={handlePago}
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
                                "Enviar Solicitud de Registro"
                              )}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="relative z-10">
                        <div className="py-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D7008A] to-[#41023B] flex items-center justify-center mr-4">
                              {showEmailVerification ? (
                                <Mail className="w-5 h-5 text-white" />
                              ) : (
                                CurrentIcon && <CurrentIcon className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div>
                              <h2 className="sm:text-xl font-bold text-[#41023B]">
                                {showEmailVerification ? "Verificación de Correo" : steps[currentStep - 1].title}
                              </h2>
                              <p className="text-gray-700 text-sm">
                                {showEmailVerification
                                  ? "Ingrese el código enviado a su correo"
                                  : steps[currentStep - 1].description}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="py-6">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={showEmailVerification ? "verification" : currentStep}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.3 }}
                              className="min-h-[400px]"
                            >
                              {renderCurrentStep()}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        <div className="p-6 border-t border-gray-300 flex justify-between">
                          {currentStep > 1 || showEmailVerification ? (
                            <motion.button
                              type="button"
                              onClick={prevStep}
                              className="cursor-pointer flex items-center px-5 py-2.5 bg-white text-[#41023B] border border-gray-700 rounded-xl text-base font-medium shadow-sm hover:shadow-md hover:bg-[#41023B] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#41023B] focus:ring-opacity-50"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <ChevronLeft className="w-5 h-5 mr-2" />
                              Anterior
                            </motion.button>
                          ) : (
                            <div></div>
                          )}
                          {!showEmailVerification &&
                            (currentStep < steps.length ? (
                              <motion.button
                                type="button"
                                onClick={nextStep}
                                className="cursor-pointer flex items-center px-5 py-2.5 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white
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
                                className="cursor-pointer flex items-center px-6 py-3 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-xl text-base font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#41023B] focus:ring-opacity-50"
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
                                  "Pagar"
                                )}
                              </motion.button>
                            ))}
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
  )
}
