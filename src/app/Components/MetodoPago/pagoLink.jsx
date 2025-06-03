"use client"

import api from "@/api/api"
import { postDataSolicitud } from "@/api/endpoints/solicitud"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useState } from "react"

export default function PaymentLinkSection({
  paymentInfo,
  onPaymentLinkSubmit,
  onContinue,
}) {
  const [paymentLinkEmail, setPaymentLinkEmail] = useState("")
  const [paymentLinkSent, setPaymentLinkSent] = useState(false)
  const [linkGenerated, setLinkGenerated] = useState(null);

  const handleSendPaymentLink = async () => {
    if (paymentLinkEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentLinkEmail)) {
        onPaymentLinkSubmit(paymentLinkEmail)
        const response = await api.post("solicitudes/pagos-token/",{
            "generic_id": paymentInfo.id,
            "type_id": paymentInfo.type_id,
            "email": paymentLinkEmail
        });
        setLinkGenerated(`${process.env.NEXT_PUBLIC_REDIRECT}Pago/${response.data.token}`)
        setPaymentLinkSent(true)
    }
  }

  const handleSendToAnotherEmail = () => {
    setPaymentLinkSent(false)
    setPaymentLinkEmail("")
  }

  const handleContinue = () => {
    onContinue(paymentLinkEmail)
  }

  return (
    <div className="space-y-6">
      {/* Payment Link Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#D7008A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#D7008A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#41023B] mb-2">Enlace de Pago por Correo</h3>
          <p className="text-gray-600 text-sm">
            Ingresa tu correo electrónico y te enviaremos un enlace seguro para completar tu pago
          </p>
        </div>

        {!paymentLinkSent ? (
          <EmailInputForm
            paymentLinkEmail={paymentLinkEmail}
            setPaymentLinkEmail={setPaymentLinkEmail}
            paymentInfo={paymentInfo}
            onSendPaymentLink={handleSendPaymentLink}
          />
        ) : (
          <PaymentLinkSentConfirmation
            paymentLinkEmail={paymentLinkEmail}
            linkGenerated={linkGenerated}
            onSendToAnotherEmail={handleSendToAnotherEmail}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  )
}

function EmailInputForm({
  paymentLinkEmail,
  setPaymentLinkEmail,
  paymentInfo,
  onSendPaymentLink,
}) {
  const [showValidation, setShowValidation] = useState(false)
  const [hasTyped, setHasTyped] = useState(false)
  
  const isValidEmail = paymentLinkEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentLinkEmail)
  const shouldShowError = hasTyped && paymentLinkEmail && !isValidEmail
  const isEmpty = hasTyped && !paymentLinkEmail

  const handleEmailChange = (e) => {
    const value = e.target.value
    setPaymentLinkEmail(value)
    
    if (!hasTyped && value) {
      setHasTyped(true)
    }
  }

  const handleEmailBlur = () => {
    if (paymentLinkEmail) {
      setShowValidation(true)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correo Electrónico <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className={`h-5 w-5 transition-colors ${
                shouldShowError || isEmpty 
                  ? 'text-red-400' 
                  : isValidEmail && hasTyped 
                    ? 'text-green-400' 
                    : 'text-gray-400'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </div>
          
          {/* Icono de validación */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {hasTyped && paymentLinkEmail && (
              <>
                {isValidEmail ? (
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </>
            )}
          </div>

          <input
            type="email"
            value={paymentLinkEmail}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            className={`block w-full pl-10 pr-10 py-3 border rounded-lg text-sm transition-colors focus:ring-2 focus:ring-offset-2 ${
              shouldShowError || isEmpty
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : isValidEmail && hasTyped
                  ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:border-[#D7008A] focus:ring-[#D7008A]'
            }`}
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        {/* Mensajes de validación */}
        {hasTyped && (
          <div className="mt-2 min-h-[20px]">
            {isEmpty && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                El correo electrónico es obligatorio
              </motion.p>
            )}
            
            {shouldShowError && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Por favor ingresa un correo electrónico válido
              </motion.p>
            )}
            
            {isValidEmail && hasTyped && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-green-600 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Correo electrónico válido
              </motion.p>
            )}
          </div>
        )}
      </div>

      <PaymentInfoAlert paymentInfo={paymentInfo} />

      <motion.button
        type="button"
        onClick={onSendPaymentLink}
        className={`w-full flex items-center justify-center px-6 py-3 rounded-xl text-base font-medium shadow-md transition-all duration-300 ${
          isValidEmail
            ? 'bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white hover:shadow-lg hover:opacity-90'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        whileHover={isValidEmail ? { scale: 1.02 } : {}}
        whileTap={isValidEmail ? { scale: 0.98 } : {}}
        disabled={!isValidEmail}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        {isValidEmail ? 'Enviar Enlace de Pago' : 'Ingresa un email válido'}
      </motion.button>
    </div>
  )
}

function PaymentInfoAlert({ paymentInfo }) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <div className="flex items-start">
        <svg
          className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Información importante:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Recibirás un correo con el enlace de pago en los próximos minutos</li>
            <li>El enlace será válido por 7 días</li>
            <li>Revisa tu carpeta de spam si no ves el correo</li>
            <li>
              El monto a pagar será de <strong>USD$ {paymentInfo.monto}</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function PaymentLinkSentConfirmation({
  paymentLinkEmail,
  linkGenerated,
  onSendToAnotherEmail,
  onContinue,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
      <SuccessIcon />

      <EmailConfirmationDisplay email={paymentLinkEmail} linkGenerated={linkGenerated} />

      <NextStepsAlert />

      <ActionButtons onSendToAnotherEmail={onSendToAnotherEmail} onContinue={onContinue} />
    </motion.div>
  )
}

function SuccessIcon() {
  return (
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
      <Check className="w-8 h-8 text-green-600" />
    </div>
  )
}

function EmailConfirmationDisplay({ email, linkGenerated }) {
  return (
    <div className="space-y-2">
      <h4 className="text-lg font-semibold text-green-800">¡Enlace de Pago Enviado!</h4>
      <p className="text-gray-600 text-sm">Hemos enviado el enlace de pago a:</p>
      <p className="font-medium text-[#41023B] bg-gray-50 px-4 py-2 rounded-lg inline-block">{email}</p>
      <p className="text-gray-600 text-sm">El enlace de pago es:</p>
      <a href={linkGenerated} target="_blank" className="font-medium text-[#41023B] bg-gray-50 px-4 py-2 rounded-lg inline-block">{linkGenerated}</a>
    </div>
  )
}

function NextStepsAlert() {
  return (
    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
      <div className="flex items-start justify-center">
      <svg
          className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-sm text-green-800">
          <p className="font-medium mb-2">Próximos pasos:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Revisa tu correo electrónico (incluyendo spam)</li>
            <li>Haz clic en el enlace de pago seguro</li>
            <li>Completa el pago siguiendo las instrucciones</li>
            <li>Recibirás una confirmación una vez procesado</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

function ActionButtons({ onSendToAnotherEmail, onContinue }) {
  return (
    <div className="flex gap-3">
      <motion.button
        type="button"
        onClick={onSendToAnotherEmail}
        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Enviar a Otro Correo
      </motion.button>

      <motion.button
        type="button"
        onClick={onContinue}
        className="flex-1 px-4 py-2 bg-[#D7008A] text-white rounded-lg hover:bg-[#b8006b] transition-colors text-sm font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Continuar
      </motion.button>
    </div>
  )
}
