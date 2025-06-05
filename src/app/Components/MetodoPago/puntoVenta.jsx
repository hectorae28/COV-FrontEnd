"use client"

import { motion } from "framer-motion"
import { Check, CreditCard, DollarSign } from "lucide-react"
import { useState } from "react"

// Hook personalizado para lógica de conversión de moneda
const useCurrencyConverter = (tasaBCV) => {
  const convertAmount = (amount, fromCurrency) => {
    if (!amount || isNaN(Number.parseFloat(amount))) return "0.00"

    const numAmount = Number.parseFloat(amount)
    return fromCurrency === "USD"
      ? (numAmount * tasaBCV).toFixed(2)
      : (numAmount / tasaBCV).toFixed(2)
  }

  return { convertAmount }
}

export default function PuntoVentaSection({
  paymentAmount,
  tasaBCV,
  onCashPaymentSubmit,
  onContinue,
}) {
  const [formData, setFormData] = useState({
    amount: paymentAmount || "",
    referenceNumber: "",
    currencyMode: "USD"
  })
  const [paymentRegistered, setPaymentRegistered] = useState(false)

  const { convertAmount } = useCurrencyConverter(tasaBCV)

  const convertedAmount = convertAmount(formData.amount, formData.currencyMode)
  const isValid = formData.amount && formData.referenceNumber

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    if (!/^\d*\.?\d*$/.test(value) && value !== "") return
    updateFormData("amount", value)
  }

  const handleReferenceChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 12)
    updateFormData("referenceNumber", value)
  }

  const handleCurrencyToggle = () => {
    const newMode = formData.currencyMode === "USD" ? "BS" : "USD"

    if (formData.amount && !isNaN(Number.parseFloat(formData.amount))) {
      const convertedValue = convertAmount(formData.amount, formData.currencyMode)
      updateFormData("amount", convertedValue)
    }

    updateFormData("currencyMode", newMode)
  }

  const handleRegisterPayment = () => {
    if (!isValid) return

    const amountUSD = formData.currencyMode === "USD" ? formData.amount : convertedAmount
    const amountBs = formData.currencyMode === "BS" ? formData.amount : convertedAmount

    const paymentData = {
      totalAmount: Number(formData.currencyMode === "USD" ? amountUSD : amountBs),
      moneda: formData.currencyMode === "USD" ? "usd" : "bs",
      tasa_bcv_del_dia: tasaBCV,
      numero_referencia: formData.referenceNumber,
      metodo_pago: "punto_venta"
    }

    setPaymentRegistered(true)
    onCashPaymentSubmit(paymentData)
  }

  const handleContinue = () => {
    const amountUSD = formData.currencyMode === "USD" ? formData.amount : convertedAmount
    const amountBs = formData.currencyMode === "BS" ? formData.amount : convertedAmount

    const paymentData = {
      amountUSD,
      amountBs,
      referenceNumber: formData.referenceNumber,
      currencyMode: formData.currencyMode,
      paymentMethod: "punto_venta"
    }
    onContinue(paymentData)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <PaymentHeader
          icon={<CreditCard className="w-8 h-8 text-[#D7008A]" />}
          title="Registro de Pago con Punto de Venta"
          description="Registra el pago realizado con tarjeta de débito/crédito"
        />

        {!paymentRegistered ? (
          <PuntoVentaForm
            formData={formData}
            convertedAmount={convertedAmount}
            tasaBCV={tasaBCV}
            isValid={isValid}
            onAmountChange={handleAmountChange}
            onReferenceChange={handleReferenceChange}
            onCurrencyToggle={handleCurrencyToggle}
            onRegisterPayment={handleRegisterPayment}
          />
        ) : (
          <PaymentRegisteredConfirmation
            amountUSD={formData.currencyMode === "USD" ? formData.amount : convertedAmount}
            amountBs={formData.currencyMode === "BS" ? formData.amount : convertedAmount}
            referenceNumber={formData.referenceNumber}
            currencyMode={formData.currencyMode}
            paymentMethod="Punto de Venta"
            onEdit={() => setPaymentRegistered(false)}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  )
}

function PaymentHeader({ icon, title, description }) {
  return (
    <div className="text-center mb-6">
      <div className="w-16 h-16 bg-[#D7008A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-[#41023B] mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

function PuntoVentaForm({
  formData,
  convertedAmount,
  tasaBCV,
  isValid,
  onAmountChange,
  onReferenceChange,
  onCurrencyToggle,
  onRegisterPayment,
}) {
  return (
    <div className="space-y-4">
      <ExchangeRateDisplay tasaBCV={tasaBCV} />

      <CurrencyAmountField
        amount={formData.amount}
        currencyMode={formData.currencyMode}
        convertedAmount={convertedAmount}
        onAmountChange={onAmountChange}
        onCurrencyToggle={onCurrencyToggle}
      />

      <ReferenceNumberField
        value={formData.referenceNumber}
        onChange={onReferenceChange}
        placeholder="Ej: 123456789012"
        label="Número de Referencia de la Transacción"
      />

      <PuntoVentaInfoAlert
        amount={formData.amount}
        currencyMode={formData.currencyMode}
        convertedAmount={convertedAmount}
        referenceNumber={formData.referenceNumber}
      />

      <motion.button
        type="button"
        onClick={onRegisterPayment}
        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-xl text-base font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={isValid ? { scale: 1.02 } : {}}
        whileTap={isValid ? { scale: 0.98 } : {}}
        disabled={!isValid}
      >
        <CreditCard className="w-5 h-5 mr-2" />
        Registrar Pago con Punto de Venta
      </motion.button>
    </div>
  )
}

// Componentes auxiliares reutilizables
function ExchangeRateDisplay({ tasaBCV }) {
  return (
    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
      <p className="text-sm font-medium text-blue-800">
        Tasa del día: <span className="font-bold">1 USD = {tasaBCV} Bs</span>
      </p>
    </div>
  )
}

function CurrencyAmountField({
  amount,
  currencyMode,
  convertedAmount,
  onAmountChange,
  onCurrencyToggle
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Monto de la transacción <span className="text-red-500">*</span>
      </label>

      <div className="flex items-center justify-center mb-3">
        <span className={`text-sm font-medium mr-3 ${currencyMode === "USD" ? "text-[#D7008A]" : "text-gray-500"}`}>
          USD
        </span>
        <button
          type="button"
          onClick={onCurrencyToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#D7008A] focus:ring-offset-2 ${currencyMode === "BS" ? "bg-[#D7008A]" : "bg-gray-200"
            }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${currencyMode === "BS" ? "translate-x-6" : "translate-x-1"
              }`}
          />
        </button>
        <span className={`text-sm font-medium ml-3 ${currencyMode === "BS" ? "text-[#D7008A]" : "text-gray-500"}`}>
          Bs
        </span>
      </div>

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
  )
}

function ReferenceNumberField({ value, onChange, placeholder, label }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400 text-sm font-medium">#</span>
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] text-sm font-mono"
          placeholder={placeholder}
          maxLength={12}
          required
        />
      </div>
    </div>
  )
}

function PuntoVentaInfoAlert({ amount, currencyMode, convertedAmount, referenceNumber }) {
  if (!amount || isNaN(Number.parseFloat(amount)) || !referenceNumber) return null

  return (
    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
      <div className="flex items-start">
        <CreditCard className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-sm text-green-800">
          <p className="font-medium mb-1">Resumen de la transacción:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>
              Monto: <strong>{currencyMode === "USD" ? `$${amount}` : `${amount} Bs`}</strong>
            </li>
            <li>
              Equivalente: <strong>{currencyMode === "USD" ? `${convertedAmount} Bs` : `$${convertedAmount}`}</strong>
            </li>
            <li>
              Referencia: <strong>{referenceNumber}</strong>
            </li>
            <li>Verificar que los datos coincidan con el voucher del punto de venta</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function PaymentRegisteredConfirmation({
  amountUSD,
  amountBs,
  referenceNumber,
  currencyMode,
  paymentMethod,
  onEdit,
  onContinue,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-green-600" />
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-green-800">¡{paymentMethod} Registrado!</h4>
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
              <span className="font-medium">Referencia:</span>
              <span className="font-mono">{referenceNumber}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-start">
          <Check className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-2">Próximos pasos:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>El pago quedará registrado en el sistema</li>
              <li>Verificar que el trámite se actualice correctamente</li>
              <li>Mantener copia del voucher en los registros</li>
            </ol>
          </div>
        </div>
      </div>

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
    </motion.div>
  )
}