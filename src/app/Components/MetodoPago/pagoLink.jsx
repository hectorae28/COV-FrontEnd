"use client"

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

  const handleSendPaymentLink = () => {
    if (paymentLinkEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentLinkEmail)) {
      setPaymentLinkSent(true)
      onPaymentLinkSubmit(paymentLinkEmail)
      console.log("Sending payment link to:", paymentLinkEmail)
    } else {
      alert("Por favor ingresa un correo electrónico válido")
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
  const isValidEmail = paymentLinkEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentLinkEmail)

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correo Electrónico <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </div>
          <input
            type="email"
            value={paymentLinkEmail}
            onChange={(e) => setPaymentLinkEmail(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] text-sm"
            placeholder="ejemplo@correo.com"
            required
          />
        </div>
      </div>

      <PaymentInfoAlert paymentInfo={paymentInfo} />

      <motion.button
        type="button"
        onClick={onSendPaymentLink}
        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-xl text-base font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={!isValidEmail}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        Enviar Enlace de Pago
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
              El monto a pagar será de <strong>USD$ {paymentInfo}</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function PaymentLinkSentConfirmation({
  paymentLinkEmail,
  onSendToAnotherEmail,
  onContinue,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
      <SuccessIcon />

      <EmailConfirmationDisplay email={paymentLinkEmail} />

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

function EmailConfirmationDisplay({ email }) {
  return (
    <div className="space-y-2">
      <h4 className="text-lg font-semibold text-green-800">¡Enlace de Pago Enviado!</h4>
      <p className="text-gray-600 text-sm">Hemos enviado el enlace de pago a:</p>
      <p className="font-medium text-[#41023B] bg-gray-50 px-4 py-2 rounded-lg inline-block">{email}</p>
    </div>
  )
}

function NextStepsAlert() {
  return (
    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
      <div className="flex items-start">
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
