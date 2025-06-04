"use client"

import React from "react"

import { motion } from "framer-motion"
import { Check, DollarSign } from "lucide-react"
import { useState } from "react"

export default function CashPaymentSection({
  paymentAmount,
  tasaBCV,
  onCashPaymentSubmit,
  onContinue,
}) {
  const [amount, setAmount] = useState(paymentAmount || "")
  const [currencyMode, setCurrencyMode] = useState("USD")
  const [paymentRegistered, setPaymentRegistered] = useState(false)

  // Calcular el monto en la otra moneda
  const getConvertedAmount = () => {
    if (!amount || isNaN(Number.parseFloat(amount))) return "0.00"

    const numAmount = Number.parseFloat(amount)
    if (currencyMode === "USD") {
      return (numAmount * tasaBCV).toFixed(2)
    } else {
      return (numAmount / tasaBCV).toFixed(2)
    }
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    if (!/^\d*\.?\d*$/.test(value) && value !== "") return
    setAmount(value)
  }

  const handleCurrencyToggle = () => {
    const newMode = currencyMode === "USD" ? "BS" : "USD"

    // Convertir el monto actual a la nueva moneda
    if (amount && !isNaN(Number.parseFloat(amount))) {
      const numAmount = Number.parseFloat(amount)
      if (currencyMode === "USD") {
        // Cambiar de USD a BS
        setAmount((numAmount * tasaBCV).toFixed(2))
      } else {
        // Cambiar de BS a USD
        setAmount((numAmount / tasaBCV).toFixed(2))
      }
    }

    setCurrencyMode(newMode)
  }

  const handleRegisterPayment = () => {
    const amountUSD = currencyMode === "USD" ? amount : getConvertedAmount()
    const amountBs = currencyMode === "BS" ? amount : getConvertedAmount()

    // Preparar datos en el formato esperado por addPagosSolicitud
    const paymentData = {
      // Campos para addPagosSolicitud
      totalAmount: Number(currencyMode === "USD" ? amountUSD : amountBs),
      moneda: currencyMode === "USD" ? "usd" : "bs",
      tasa_bcv_del_dia: tasaBCV,
    }

    setPaymentRegistered(true)
    onCashPaymentSubmit(paymentData)
  }

  const handleContinue = () => {
    const amountUSD = currencyMode === "USD" ? amount : getConvertedAmount()
    const amountBs = currencyMode === "BS" ? amount : getConvertedAmount()

    const paymentData = {
      amountUSD,
      amountBs,
      receivedBy: "",
      notes: "",
      receiptNumber: "",
      currencyMode,
    }
    onContinue(paymentData)
  }

  const isFormValid = amount

  return (
    <div className="space-y-6">
      {/* Cash Payment Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#D7008A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#D7008A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#41023B] mb-2">Registro de Pago en Efectivo</h3>
          <p className="text-gray-600 text-sm">Registra el pago en efectivo recibido del colegiado</p>
        </div>

        {!paymentRegistered ? (
          <CashPaymentForm
            amount={amount}
            currencyMode={currencyMode}
            convertedAmount={getConvertedAmount()}
            tasaBCV={tasaBCV}
            onAmountChange={handleAmountChange}
            onCurrencyToggle={handleCurrencyToggle}
            onRegisterPayment={handleRegisterPayment}
            isFormValid={isFormValid}
          />
        ) : (
          <PaymentRegisteredConfirmation
            amountUSD={currencyMode === "USD" ? amount : getConvertedAmount()}
            amountBs={currencyMode === "BS" ? amount : getConvertedAmount()}
            receivedBy=""
            receiptNumber=""
            notes=""
            currencyMode={currencyMode}
            onEdit={() => setPaymentRegistered(false)}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  )
}

function CashPaymentForm({
  amount,
  currencyMode,
  convertedAmount,
  tasaBCV,
  onAmountChange,
  onCurrencyToggle,
  onRegisterPayment,
  isFormValid,
}) {
  return (
    <div className="space-y-4">
      {/* Exchange Rate Display */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
        <p className="text-sm font-medium text-blue-800">
          Tasa del día: <span className="font-bold">1 USD = {tasaBCV} Bs</span>
        </p>
      </div>

      {/* Amount Field with Currency Switch */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monto recibido <span className="text-red-500">*</span>
        </label>

        {/* Currency Toggle Switch */}
        <div className="flex items-center justify-center mb-3">
          <span className={`text-sm font-medium mr-3 ${currencyMode === "USD" ? "text-[#D7008A]" : "text-gray-500"}`}>
            USD
          </span>
          <button
            type="button"
            onClick={onCurrencyToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:ring-offset-2 ${
              currencyMode === "BS" ? "bg-[#D7008A]" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                currencyMode === "BS" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`text-sm font-medium ml-3 ${currencyMode === "BS" ? "text-[#D7008A]" : "text-gray-500"}`}>
            Bs
          </span>
        </div>

        {/* Amount Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {currencyMode === "USD" ? (
              <DollarSign className="h-5 w-5 text-gray-400" />
            ) : (
              <span className="text-gray-400 text-sm font-medium">Bs</span>
            )}
          </div>
          <input
            type="text"
            value={amount}
            onChange={onAmountChange}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] text-sm"
            placeholder="0.00"
            required
          />
        </div>

        {/* Converted Amount Display */}
        {amount && !isNaN(Number.parseFloat(amount)) && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Equivalente en {currencyMode === "USD" ? "Bs" : "USD"}:</span>
              <span className="text-sm font-semibold text-[#D7008A]">
                {currencyMode === "USD" ? `${convertedAmount} Bs` : `$${convertedAmount}`}
              </span>
            </div>
          </div>
        )}
      </div>
      <CashPaymentInfoAlert amount={amount} currencyMode={currencyMode} convertedAmount={convertedAmount} />

      <motion.button
        type="button"
        onClick={onRegisterPayment}
        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-xl text-base font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={isFormValid ? { scale: 1.02 } : {}}
        whileTap={isFormValid ? { scale: 0.98 } : {}}
        disabled={!isFormValid}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Registrar Pago en Efectivo
      </motion.button>
    </div>
  )
}

function CashPaymentInfoAlert({ amount, currencyMode, convertedAmount }) {
  if (!amount || isNaN(Number.parseFloat(amount))) return null

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
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-sm text-green-800">
          <p className="font-medium mb-1">Resumen del pago:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>
              Monto recibido: <strong>{currencyMode === "USD" ? `$${amount}` : `${amount} Bs`}</strong>
            </li>
            <li>
              Equivalente: <strong>{currencyMode === "USD" ? `${convertedAmount} Bs` : `$${convertedAmount}`}</strong>
            </li>
            <li>Verificar que el monto recibido coincida con lo registrado</li>
            <li>Entregar recibo al colegiado</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function PaymentRegisteredConfirmation({
  amountUSD,
  amountBs,
  receivedBy,
  receiptNumber,
  notes,
  currencyMode,
  onEdit,
  onContinue,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
      <SuccessIcon />

      <PaymentSummaryDisplay
        amountUSD={amountUSD}
        amountBs={amountBs}
        receivedBy={receivedBy}
        receiptNumber={receiptNumber}
        notes={notes}
        currencyMode={currencyMode}
      />

      <NextStepsAlert />

      <ActionButtons onEdit={onEdit} onContinue={onContinue} />
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

function PaymentSummaryDisplay({
  amountUSD,
  amountBs,
  receivedBy,
  receiptNumber,
  notes,
  currencyMode,
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold text-green-800">¡Pago en Efectivo Registrado!</h4>
      <p className="text-gray-600 text-sm">El pago ha sido registrado exitosamente</p>

      <div className="bg-gray-50 p-4 rounded-lg text-left">
        <h5 className="font-medium text-[#41023B] mb-3">Detalles del Pago</h5>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span className="font-medium">Monto recibido:</span>
            <span className="font-bold text-[#D7008A]">
              {currencyMode === "USD" ? `$${amountUSD}` : `${amountBs} Bs`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Equivalente:</span>
            <span className="font-bold text-[#D7008A]">
              {currencyMode === "USD" ? `${amountBs} Bs` : `$${amountUSD}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Recibo #:</span>
            <span className="font-mono">{receiptNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Recibido por:</span>
            <span>{receivedBy}</span>
          </div>
          {notes && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Observaciones:</strong> {notes}
              </p>
            </div>
          )}
        </div>
      </div>
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
            <li>Entregar el recibo físico al colegiado</li>
            <li>Archivar copia del recibo en los registros</li>
            <li>El pago quedará registrado en el sistema</li>
            <li>Verificar que el trámite se actualice correctamente</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

function ActionButtons({ onEdit, onContinue }) {
  return (
    <div className="flex gap-3">
      <motion.button
        type="button"
        onClick={onEdit}
        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Editar Datos
      </motion.button>

      <motion.button
        type="button"
        onClick={onContinue}
        className="flex-1 px-4 py-2 bg-[#D7008A] text-white rounded-lg hover:bg-[#b8006b] transition-colors text-sm font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Finalizar
      </motion.button>
    </div>
  )
}
