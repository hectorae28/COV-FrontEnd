"use client"
import { patchDataUsuario, postDataUsuario } from "@/api/endpoints/colegiado"
import { fetchExistencePersona } from "@/api/endpoints/persona"
import BackgroundAnimation from "@/app/Components/Home/BackgroundAnimation"
import confetti from "canvas-confetti"
import { AnimatePresence, motion } from "framer-motion"
import { Building, Camera, Check, ChevronLeft, ChevronRight, FilePlus, GraduationCap, Mail, Phone, User, UserCheck, UserPlus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
// Import step components
import api from "@/api/api"
import { fetchDataSolicitudes } from "@/api/endpoints/landingPage"
import Alert from "@/app/Components/Alert"
import Head from "next/head"
import PagosColg from "../../Components/PagosModal"
import DocsRequirements from "../DocsRequirements"
import EmailVerification from "../EmailVerification"
import FotoColegiado from "../FotoColegiado"
import InfoColegiado from "../InfoColg"
import InfoContacto from "../InfoCont"
import InfoLaboralWithDireccionForm from "../InfoLab"
import InfoPersonal from "../InfoPers"

// Definir todos los pasos posibles
const allSteps = [
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
  {
    id: 6,
    title: "Foto Tipo Carnet",
    description: "Foto para su carnet de colegiado",
    icon: Camera,
    component: FotoColegiado,
    requiredFields: ["foto_colegiado"],
  },
]

export default function RegistrationForm({
  ...props
}) {
  const {
    onRegistroExitoso,
    isAdmin = false,
    isModal = false,
  } = props

  // Estados para tipo de registro
  const [tipoRegistro, setTipoRegistro] = useState("")
  const [showTipoSelection, setShowTipoSelection] = useState(true)

  const [currentStep, setCurrentStep] = useState(1)
  const [pagarLuego, setPagarLuego] = useState(false)
  const [exonerarPagos, setExonerarPagos] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [isResendingCode, setIsResendingCode] = useState(false)
  const [verifiedEmails, setVerifiedEmails] = useState([])
  const [recaudoCreado, setRecaudoCreado] = useState({})

  // Función para obtener los pasos filtrados según el tipo de registro
  const getFilteredSteps = () => {
    if (!tipoRegistro) return allSteps

    if (tipoRegistro === "viejo") {
      // Colegiado viejo: remover paso 6 (Foto)
      return allSteps.filter(step => step.id !== 6)
    } else if (tipoRegistro === "nuevo") {
      // Colegiado nuevo: remover paso 4 (Situación Laboral)
      return allSteps.filter(step => step.id !== 4)
    }

    return allSteps
  }

  // Obtener pasos filtrados
  const steps = getFilteredSteps()

  // Función para remapear el currentStep al índice correcto en los pasos filtrados
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === getCurrentStepId())
  }

  // Función para obtener el ID del paso actual basado en la posición
  const getCurrentStepId = () => {
    if (currentStep <= steps.length) {
      return steps[currentStep - 1]?.id
    }
    return steps[steps.length - 1]?.id
  }

  // Función para obtener el paso actual
  const getCurrentStep = () => {
    return steps.find(step => step.id === getCurrentStepId())
  }

  const initialState = {
    // Para tipo_profesion
    tipo_profesion: props?.tipo_profesion || "",

    // Persona data
    documentType: props?.persona?.documentType || "",
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
    emailVerified: false,
    countryCode: props?.persona?.telefono_movil?.split(" ")[0] || "+58",
    phoneNumber: props?.persona?.telefono_movil?.split(" ")[1] || "",
    homePhone: props?.persona?.telefono_de_habitacion || "",

    // Dirección
    address: props?.persona?.direccion?.referencia || "",
    city: props?.ciudad || "",
    state: "",

    // Información académica
    graduateInstitute: props?.instituto_bachillerato || "",
    universityTitle: props?.universidad || "",
    mainRegistrationNumber: props?.num_registro_principal || "",
    mppsRegistrationNumber: props?.num_mpps || "",
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

    // Foto del colegiado
    foto_colegiado: props?.file_foto_colegiado_url || null,

    // Datos laborales
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

  // Función para manejar la selección del tipo de registro
  const handleTipoRegistroChange = (tipo) => {
    setTipoRegistro(tipo)
    setShowTipoSelection(false)
    setCurrentStep(1) // Reiniciar al primer paso

    // Configurar valores según tipo de registro
    if (tipo === "viejo") {
      setFormData(prev => ({
        ...prev,
        tipoRegistro: "viejo"
        // Removido: workStatus: "labora" - dejar que el usuario seleccione
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        tipoRegistro: "nuevo"
      }))
    }
  }

  // Guardar el email original cuando se carga el componente o cuando cambia el email
  useEffect(() => {
    if (formData.emailVerified && formData.email && !verifiedEmails.includes(formData.email)) {
      setVerifiedEmails((prev) => [...prev, formData.email])
    }
  }, [formData.email, formData.emailVerified, verifiedEmails])

  useEffect(() => {
    if (attemptedNext) {
      validateStep(currentStep)
    }
  }, [formData, currentStep, attemptedNext, tipoRegistro])

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
    if (updates && updates.isPersonalInfoValid !== undefined) {
      const { isPersonalInfoValid, ...rest } = updates
      updates = rest
    }

    if (updates && updates.email !== undefined) {
      const isAlreadyVerified = verifiedEmails.includes(updates.email)
      updates.emailVerified = isAlreadyVerified
    }

    setFormData((prevState) => ({
      ...prevState,
      ...updates,
    }))

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
    const step = getCurrentStep()
    if (!step) return true

    const errors = {}
    let isValid = true

    // Validación especial para documentos (paso 5)
    const stepId = step.id
    if (stepId === 5) {
      let fieldsToValidate = [...step.requiredFields]

      if (formData.tipo_profesion === "tecnico" || formData.tipo_profesion === "higienista") {
        fieldsToValidate = [
          ...fieldsToValidate,
          "fondo_negro_titulo_bachiller",
          "fondo_negro_credencial",
          "notas_curso",
        ]
      }

      fieldsToValidate.forEach((field) => {
        if (!formData[field] || (typeof formData[field] === "string" && formData[field].trim() === "")) {
          errors[field] = true
          isValid = false
        }
      })

      if (attemptedNext) {
        setValidationErrors(errors)
      }
      return isValid
    }

    // Validación para foto (paso 6) - solo si está incluido
    if (stepId === 6) {
      if (!formData.foto_colegiado) {
        errors["foto_colegiado"] = true
        isValid = false
      }

      if (attemptedNext) {
        setValidationErrors(errors)
      }
      return isValid
    }

    // Validación para situación laboral (paso 4) - solo si está incluido
    if (stepId === 4) {
      if (formData.workStatus === "noLabora") {
        return true
      }

      if (!formData.laboralRegistros || formData.laboralRegistros.length === 0) {
        const requiredLabFields = ["institutionName", "institutionAddress", "institutionPhone", "cargo", "institutionType", "selectedEstado", "selectedMunicipio"]
        requiredLabFields.forEach(field => {
          errors[field] = true
        })
        isValid = false
      } else {
        formData.laboralRegistros.forEach((registro, index) => {
          const requiredLabFields = ["institutionName", "institutionAddress", "institutionPhone", "cargo", "institutionType", "selectedEstado", "selectedMunicipio"]

          requiredLabFields.forEach(field => {
            if (!registro[field] || (typeof registro[field] === "string" && registro[field].trim() === "")) {
              if (index === 0) {
                errors[field] = true
              }
              errors[`${field}_${registro.id}`] = true
              isValid = false
            }
          })
        })
      }

      if (attemptedNext) {
        setValidationErrors(errors)
      }
      return isValid
    }

    // Validación estándar para otros pasos
    if (step.requiredFields && step.requiredFields.length > 0) {
      step.requiredFields.forEach((field) => {
        if (!formData[field] || (typeof formData[field] === "string" && formData[field].trim() === "")) {
          errors[field] = true
          isValid = false
        }
      })
    }

    // Validación específica para cédula (solo en el paso 1)
    if (stepId === 1 && formData.documentType === "cedula" && formData.identityCard) {
      if (formData.identityCard.length < 7 || formData.identityCard.length > 8) {
        errors["identityCard"] = true
        isValid = false
      }
    }

    if (attemptedNext) {
      setValidationErrors(errors)
    }

    return isValid
  }

  const nextStep = async () => {
    if (currentStep < steps.length) {
      const currentStepId = getCurrentStepId()

      if (currentStepId === 1) {
        const isStepValid = validateStep(currentStep)
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

      // Para el paso 2 (Información de Contacto), verificar correo
      if (currentStepId === 2) {
        const isStepValid = validateStep(currentStep)

        if (isStepValid) {
          if (!formData.emailVerified) {
            setShowEmailVerification(true)
            setAttemptedNext(false)
            return
          }

          setCurrentStep(currentStep + 1)
          window.scrollTo(0, 0)
          setAttemptedNext(false)
        } else {
          setAttemptedNext(true)
          setTimeout(() => {
            const firstErrorElement = document.querySelector(".border-red-500")
            if (firstErrorElement) {
              firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" })
            }
          }, 100)
        }
        return
      }

      // Navegación regular
      const isValid = validateStep(currentStep)

      if (isValid) {
        setCurrentStep(currentStep + 1)
        window.scrollTo(0, 0)
        setAttemptedNext(false)
      } else {
        setAttemptedNext(true)
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
      setShowEmailVerification(false)
      setAttemptedNext(false)
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
      setAttemptedNext(false)
    } else if (currentStep === 1) {
      // Si estamos en el primer paso, volver a la selección de tipo
      setShowTipoSelection(true)
      setTipoRegistro("")
      setAttemptedNext(false)
    }
  }

  // Función para validar Número de identificación Duplicado
  const handleIdentityCardDuplicateVerification = async () => {
    const queryParams = new URLSearchParams({
      "tipo_identificacion": formData.documentType,
      "inicial": formData.idType,
      "identificacion": formData.identityCard,
    }).toString()
    const res = await fetchExistencePersona(`check-existence`, queryParams)
    return res.exists
  }

  const handleRequestEmailVerification = (email) => {
    if (!email) return
    setShowEmailVerification(true)
  }

  const handleResendVerificationCode = async () => {
    setIsResendingCode(true)
    const res = await postDataUsuario(`send-verification-email`, {
      "email": formData.email,
    })
    setIsResendingCode(false)
  }

  const handleEmailVerificationSuccess = () => {
    handleInputChange({ emailVerified: true })

    if (!verifiedEmails.includes(formData.email)) {
      setVerifiedEmails((prev) => [...prev, formData.email])
    }

    setShowEmailVerification(false)
    setCurrentStep(currentStep + 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAttemptedNext(true)
    const isValid = validateStep(currentStep)

    if (isValid) {
      if (isIntentionalSubmit) {
        const Form = new FormData()
        Form.append("tipo_profesion", formData.tipo_profesion)
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
            nacionalidad:
              formData.documentType === "cedula" ? "venezolana" : "extranjera",
            identificacion:
              formData.documentType === "cedula"
                ? `${formData.idType}${formData.identityCard}`
                : formData.identityCard,
            correo: formData.email,
            telefono_movil: `${formData.countryCode}${formData.phoneNumber}`,
            telefono_de_habitacion: formData.homePhone,
            fecha_de_nacimiento: formData.birthDate,
            estado_civil: formData.maritalStatus,
          })
        )
        Form.append("instituto_bachillerato", formData.graduateInstitute)
        Form.append("universidad", formData.universityTitle)
        Form.append("fecha_egreso_universidad", formData.titleIssuanceDate)

        if (formData.tipo_profesion === "odontologo") {
          Form.append("num_registro_principal", formData.mainRegistrationNumber)
        }

        Form.append("num_mpps", formData.mppsRegistrationNumber)

        // Solo agregar datos laborales si no es colegiado nuevo (que no tiene paso laboral)
        if (tipoRegistro !== "nuevo") {
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
          )

          // Agregar constancias de trabajo
          if (formData.laboralRegistros && formData.laboralRegistros.length > 0) {
            formData.laboralRegistros.forEach((registro, index) => {
              if (registro.constancia_trabajo) {
                Form.append(`constancia_trabajo_${index}`, registro.constancia_trabajo)
              }
            })
          }
        } else {
          // Para colegiados nuevos, enviar array vacío
          Form.append("instituciones", JSON.stringify([]))
        }

        Form.append("file_ci", formData.ci || null)
        Form.append("file_rif", formData.rif || null)
        Form.append("file_fondo_negro", formData.titulo || null)
        Form.append("file_mpps", formData.mpps || null)

        // Solo agregar foto si no es colegiado viejo (que no tiene paso de foto)
        if (tipoRegistro !== "viejo") {
          Form.append("file_foto_colegiado", formData.foto_colegiado || null)
        }

        if (formData.tipo_profesion === "tecnico" || formData.tipo_profesion === "higienista") {
          Form.append("fondo_negro_credencial", formData.fondo_negro_credencial)
          Form.append("notas_curso", formData.notas_curso)
          Form.append("fondo_negro_titulo_bachiller", formData.fondo_negro_titulo_bachiller)
        }

        try {
          if (!isCreated) {
            setIsSubmitting(true)
            const response = await api.post("usuario/register/", Form, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            if (response.status === 201) {
              setShowPaymentScreen(true)
              setIsComplete(false)
              setRecaudoCreado(response.data)
              setIsSubmitting(false)
              setIsCreated(true)
            }
          } else {
            const response = await api.patch(`usuario/register/${recaudoCreado.id}/`, Form, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            if (response.status === 200) {
              setShowPaymentScreen(true)
              setIsSubmitting(false)
            }
          }
        } catch (error) {
          setError("Ocurrió un error al cargar los datos, verifique su conexión a internet")
        } finally {
          setIsSubmitting(false)
        }
      }
    } else {
      setTimeout(() => {
        const firstErrorElement = document.querySelector(".border-red-500")
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
        }
      }, 100)
    }
  }

  const handlePago = async ({
    paymentDate = null,
    referenceNumber = null,
    paymentFile = null,
    totalAmount = null,
    metodo_de_pago = null,
  }) => {
    const PaymentForm = new FormData()
    if (!pagarLuego && !exonerarPagos) {
      PaymentForm.append(
        "pago",
        JSON.stringify({
          fecha_pago: paymentDate,
          metodo_de_pago: metodo_de_pago.id,
          num_referencia: referenceNumber,
          monto: totalAmount,
        }),
      )
      PaymentForm.append("comprobante", paymentFile)
      setIsSubmitting(true)
    }
    try {
      let res
      if (!pagarLuego && !exonerarPagos) {
        res = await patchDataUsuario(`register/${recaudoCreado.id}`, PaymentForm)
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
          if (onRegistroExitoso) {
            onRegistroExitoso()
          }
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
        if (onRegistroExitoso) {
          onRegistroExitoso()
        }
      }
    } catch (error) {
      setError("Ocurrió un error al cargar los datos, verifique su conexión a internet")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Pantalla de selección del tipo de registro
  const renderTipoSelectionScreen = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 py-8" // Agregado py-8 para espaciado vertical
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[#D7008A] to-[#41023B] rounded-full mx-auto flex items-center justify-center mb-6">
            <UserCheck className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-[#41023B] mb-4">
            Tipo de Registro
          </h2>

          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Para comenzar con su proceso de colegiación, necesitamos conocer su situación actual.
            Por favor, seleccione la opción que mejor describa su estado:
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opción: Colegiado Nuevo */}
            <motion.button
              type="button"
              onClick={() => handleTipoRegistroChange("nuevo")}
              className="group relative p-8 bg-white border-2 border-gray-200 rounded-xl hover:border-[#D7008A] hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#D7008A] to-[#41023B] rounded-full mx-auto flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#41023B] mb-2">
                  Nuevo Colegiado
                </h3>
                <p className="text-gray-600 text-sm">
                  Soy un profesional que desea colegiarse por primera vez
                </p>
                <div className="mt-4 flex items-center justify-center text-[#D7008A] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium mr-2">Continuar</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.button>

            {/* Opción: Colegiado Viejo */}
            <motion.button
              type="button"
              onClick={() => handleTipoRegistroChange("viejo")}
              className="group relative p-8 bg-white border-2 border-gray-200 rounded-xl hover:border-[#D7008A] hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                  <UserCheck className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#41023B] mb-2">
                  Colegiado
                </h3>
                <p className="text-gray-600 text-sm">
                  Ya estoy colegiado y deseo renovar o actualizar mi registro
                </p>
                <div className="mt-4 flex items-center justify-center text-[#D7008A] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium mr-2">Continuar</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Espaciador adicional para simular el footer */}
        <div className="h-16"></div>
      </motion.div>
    )
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

    const currentStepObj = getCurrentStep()
    const CurrentStepComponent = currentStepObj?.component

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

  const CurrentIcon = getCurrentStep()?.icon

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
        {/* Header navigation */}
        {!isModal && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute top-4 right-0 left-0 z-20 px-4 sm:px-6 flex justify-between items-center"
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-auto px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-xs sm:text-sm text-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1 sm:gap-2"
              >
                <span>Página Principal</span>
              </motion.button>
            </Link>

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
        )}

        <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-22">
          <div className="w-full max-w-full">
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
                          : showTipoSelection
                            ? "Registro de Colegiados"
                            : "Registro de Nuevos Colegiados"}
                  </h1>
                  <p className="mt-3 text-white text-lg max-w-3xl mx-auto">
                    {showPaymentScreen
                      ? "Complete el pago para finalizar su registro"
                      : isComplete
                        ? "¡Gracias por completar su registro y pago!"
                        : showEmailVerification
                          ? "Verifique su correo electrónico para continuar con el proceso de registro"
                          : showTipoSelection
                            ? "Seleccione su tipo de registro para comenzar el proceso de colegiación"
                            : `Complete el formulario en ${steps.length} sencillos pasos para unirse a nuestra comunidad profesional`}
                  </p>
                </motion.div>
              </div>

              {/* Form Column */}
              <div className="w-full lg:w-8/12 lg:mt-8">
                <div className="relative">
                  {!isComplete && !showPaymentScreen && !showEmailVerification && !showTipoSelection && (
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
                        {steps.map((step, index) => {
                          const StepIcon = step.icon
                          const isCompleted = index + 1 < currentStep
                          const isCurrent = index + 1 === currentStep
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

                        {pagarLuego && (
                          <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                            <p className="text-yellow-800 font-medium">
                              Para completar su solicitud, primero debe solicitar el enlace de pago desde la página de inicio de sesión. Una vez haya recibido el enlace y realizado el pago correspondiente, su solicitud será procesada.
                            </p>
                          </div>
                        )}
                        {exonerarPagos && (
                          <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                            <p className="text-green-800 font-medium">
                              El colegiado ha sido registrado exitosamente y exonerado del pago por administración.
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
                        {!pagarLuego && !exonerarPagos && (
                          <PagosColg props={{
                            costo: costoInscripcion,
                            allowMultiplePayments: false,
                            handlePago: handlePago,
                          }}
                          />
                        )}

                        <div className="w-full max-w-md mx-auto mt-6">
                          <div className="flex justify-center gap-4">
                            {isAdmin && isModal && !pagarLuego && (
                              <button
                                type="button"
                                onClick={() => setExonerarPagos(!exonerarPagos)}
                                className={`flex-1 px-6 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${exonerarPagos
                                  ? "bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white border-white shadow-md"
                                  : "bg-white text-[#41023B] border-[#41023B] hover:bg-[#41023B]/20"
                                  }`}
                              >
                                Exonerar
                              </button>
                            )}

                            {!exonerarPagos && (
                              <button
                                type="button"
                                onClick={() => setPagarLuego(!pagarLuego)}
                                className={`flex-1 px-6 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${pagarLuego
                                  ? "bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white border-white shadow-md"
                                  : "bg-white text-[#41023B] border-[#41023B] hover:bg-[#41023B]/10"
                                  }`}
                              >
                                Pagar luego
                              </button>
                            )}
                          </div>

                          {pagarLuego && (
                            <div className="mt-4 text-center text-sm text-[#41023B] font-medium">
                              El usuario podrá completar el pago más adelante.
                            </div>
                          )}
                          {exonerarPagos && (
                            <div className="mt-4 text-center text-sm text-[#41023B] font-medium">
                              El usuario será registrado como solvente sin pago.
                            </div>
                          )}
                        </div>
                        <div className="flex justify-center p-6 gap-6">
                          {(pagarLuego || exonerarPagos) && (
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
                                "Completar Registro"
                              )}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ) : showTipoSelection ? (
                      renderTipoSelectionScreen()
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
                                {showEmailVerification ? "Verificación de Correo" : getCurrentStep()?.title}
                              </h2>
                              <p className="text-gray-700 text-sm">
                                {showEmailVerification
                                  ? "Ingrese el código enviado a su correo"
                                  : getCurrentStep()?.description}
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
                          {(currentStep > 1 || showEmailVerification) ? (
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
                            <motion.button
                              type="button"
                              onClick={() => {
                                setShowTipoSelection(true)
                                setTipoRegistro("")
                              }}
                              className="cursor-pointer flex items-center px-5 py-2.5 bg-white text-[#41023B] border border-gray-700 rounded-xl text-base font-medium shadow-sm hover:shadow-md hover:bg-[#41023B] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#41023B] focus:ring-opacity-50"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <ChevronLeft className="w-5 h-5 mr-2" />
                              Cambiar Tipo
                            </motion.button>
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
                                  "Continuar"
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
        {!isModal && <BackgroundAnimation />}
        {!isModal && <div className="absolute inset-0 bg-white/13 backdrop-blur-md" />}
      </div>
    </>
  )
}