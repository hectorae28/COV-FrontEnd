"use client";

import { motion } from "framer-motion";
import {
  Check,
  DollarSign,
  FileText,
  Smartphone,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";

// Hook personalizado para lógica de conversión de moneda
const useCurrencyConverter = (tasaBCV) => {
  const convertAmount = (amount) => {
    if (!amount || isNaN(Number.parseFloat(amount))) return "0.00";

    const numAmount = Number.parseFloat(amount);
    return (numAmount * tasaBCV).toFixed(2);
  };

  return { convertAmount };
};

export default function PagoMovilSection({
  paymentAmount,
  tasaBCV,
  onCashPaymentSubmit,
  onContinue,
}) {
  const [formData, setFormData] = useState({
    amount: paymentAmount || "",
    referenceNumber: "",
    cedula: "",
    phoneNumber: "",
    comprobante: null,
  });
  const [paymentRegistered, setPaymentRegistered] = useState(false);

  const { convertAmount } = useCurrencyConverter(tasaBCV);

  const convertedAmount = convertAmount(formData.amount);
  const isValid =
    formData.amount &&
    formData.referenceNumber &&
    formData.cedula &&
    formData.phoneNumber &&
    formData.comprobante;

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (!/^\d*\.?\d*$/.test(value) && value !== "") return;
    updateFormData("amount", value);
  };

  const handleReferenceChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 12);
    updateFormData("referenceNumber", value);
  };

  const handleCedulaChange = (e) => {
    let value = e.target.value.toUpperCase();
    if (!value.match(/^[VE]/)) {
      value = value.replace(/^/, "V");
    }
    value = value.replace(/[^VE\d-]/g, "");
    if (value.length > 1 && !value.includes("-")) {
      value = value.slice(0, 1) + "-" + value.slice(1);
    }
    value = value.slice(0, 11);
    updateFormData("cedula", value);
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 4) {
      value = value.slice(0, 4) + "-" + value.slice(4, 11);
    }
    updateFormData("phoneNumber", value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo debe ser menor a 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Solo se permiten imágenes");
        return;
      }
      updateFormData("comprobante", file);
    }
  };

  const handleRegisterPayment = () => {
    if (!isValid) return;

    const paymentData = {
      totalAmount: Number(formData.amount),
      moneda: "usd",
      tasa_bcv_del_dia: tasaBCV,
      numero_referencia: formData.referenceNumber,
      cedula: formData.cedula,
      telefono: formData.phoneNumber,
      comprobante: formData.comprobante,
      metodo_pago: "pago_movil",
    };

    setPaymentRegistered(true);
    onCashPaymentSubmit(paymentData);
  };

  const handleContinue = () => {
    const paymentData = {
      amountUSD: formData.amount,
      amountBs: convertedAmount,
      referenceNumber: formData.referenceNumber,
      cedula: formData.cedula,
      phoneNumber: formData.phoneNumber,
      comprobante: formData.comprobante,
      currencyMode: "USD",
      paymentMethod: "pago_movil",
    };
    onContinue(paymentData);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <PaymentHeader
          icon={<Smartphone className="w-8 h-8 text-[#D7008A]" />}
          title="Registro de Pago Móvil"
          description="Registra el pago móvil recibido del colegiado"
        />

        {!paymentRegistered ? (
          <PagoMovilForm
            formData={formData}
            convertedAmount={convertedAmount}
            tasaBCV={tasaBCV}
            isValid={isValid}
            onAmountChange={handleAmountChange}
            onReferenceChange={handleReferenceChange}
            onCedulaChange={handleCedulaChange}
            onPhoneChange={handlePhoneChange}
            onFileChange={handleFileChange}
            onRegisterPayment={handleRegisterPayment}
          />
        ) : (
          <PaymentRegisteredConfirmation
            amountUSD={formData.amount}
            amountBs={convertedAmount}
            referenceNumber={formData.referenceNumber}
            cedula={formData.cedula}
            phoneNumber={formData.phoneNumber}
            paymentMethod="Pago Móvil"
            onEdit={() => setPaymentRegistered(false)}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
}

function PagoMovilForm({
  formData,
  convertedAmount,
  tasaBCV,
  isValid,
  onAmountChange,
  onReferenceChange,
  onCedulaChange,
  onPhoneChange,
  onFileChange,
  onRegisterPayment,
}) {
  return (
    <div className="space-y-4">
      <ExchangeRateDisplay tasaBCV={tasaBCV} />

      <AmountField
        amount={formData.amount}
        convertedAmount={convertedAmount}
        onAmountChange={onAmountChange}
      />

      <ReferenceNumberField
        value={formData.referenceNumber}
        onChange={onReferenceChange}
        placeholder="Ej: 123456789012"
        label="Número de Referencia del Pago Móvil"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CedulaField value={formData.cedula} onChange={onCedulaChange} />

        <PhoneField value={formData.phoneNumber} onChange={onPhoneChange} />
      </div>

      <ComprobanteField file={formData.comprobante} onChange={onFileChange} />

      <PagoMovilInfoAlert
        formData={formData}
        convertedAmount={convertedAmount}
      />

      <motion.button
        type="button"
        onClick={onRegisterPayment}
        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#D7008A] to-[#41023B] text-white rounded-xl text-base font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={isValid ? { scale: 1.02 } : {}}
        whileTap={isValid ? { scale: 0.98 } : {}}
        disabled={!isValid}
      >
        <Smartphone className="w-5 h-5 mr-2" />
        Registrar Pago Móvil
      </motion.button>
    </div>
  );
}

function AmountField({ amount, convertedAmount, onAmountChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Monto del pago móvil (USD) <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <DollarSign className="h-5 w-5 text-gray-400" />
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
            <span className="text-sm text-gray-600">Equivalente en Bs:</span>
            <span className="text-sm font-semibold text-[#D7008A]">
              {convertedAmount} Bs
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function CedulaField({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Cédula <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] text-sm"
        placeholder="V-12345678"
        maxLength={11}
        required
      />
    </div>
  );
}

function PhoneField({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Número de Teléfono <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-[#D7008A] focus:border-[#D7008A] text-sm"
        placeholder="0414-1234567"
        maxLength={12}
        required
      />
    </div>
  );
}

function ComprobanteField({ file, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Comprobante de Pago <span className="text-red-500">*</span>
      </label>

      {!file ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#D7008A] transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className="hidden"
            id="comprobante-upload"
          />
          <label htmlFor="comprobante-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Arrastra una imagen o haz clic para seleccionar
            </p>
            <p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
          </label>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#D7008A]/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#D7008A]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 truncate max-w-48">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById("comprobante-upload");
                if (input) {
                  input.value = "";
                  const event = new Event("change", { bubbles: true });
                  input.dispatchEvent(event);
                }
              }}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PagoMovilInfoAlert({ formData, convertedAmount }) {
  const { amount, referenceNumber, cedula, phoneNumber } = formData;

  if (!amount || !referenceNumber || !cedula || !phoneNumber) return null;

  return (
    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
      <div className="flex items-start">
        <Smartphone className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-sm text-green-800">
          <p className="font-medium mb-1">Resumen del pago móvil:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>
              Monto: <strong>${amount} USD</strong>
            </li>
            <li>
              Equivalente: <strong>{convertedAmount} Bs</strong>
            </li>
            <li>
              Referencia: <strong>{referenceNumber}</strong>
            </li>
            <li>
              Cédula: <strong>{cedula}</strong>
            </li>
            <li>
              Teléfono: <strong>{phoneNumber}</strong>
            </li>
            <li>Verificar que todos los datos coincidan con el comprobante</li>
          </ul>
        </div>
      </div>
    </div>
  );
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
  );
}

function ExchangeRateDisplay({ tasaBCV }) {
  return (
    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
      <p className="text-sm font-medium text-blue-800">
        Tasa del día: <span className="font-bold">1 USD = {tasaBCV} Bs</span>
      </p>
    </div>
  );
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
  );
}

function PaymentRegisteredConfirmation({
  amountUSD,
  amountBs,
  referenceNumber,
  cedula,
  phoneNumber,
  paymentMethod,
  onEdit,
  onContinue,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-4"
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-green-600" />
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-green-800">
          ¡{paymentMethod} Registrado!
        </h4>
        <p className="text-gray-600 text-sm">
          El pago ha sido registrado exitosamente
        </p>

        <div className="bg-gray-50 p-4 rounded-lg text-left">
          <h5 className="font-medium text-[#41023B] mb-3">Detalles del Pago</h5>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span className="font-medium">Monto:</span>
              <span className="font-bold text-[#D7008A]">${amountUSD} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Equivalente:</span>
              <span className="font-bold text-[#D7008A]">{amountBs} Bs</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Referencia:</span>
              <span className="font-mono">{referenceNumber}</span>
            </div>
            {cedula && (
              <div className="flex justify-between">
                <span className="font-medium">Cédula:</span>
                <span>{cedula}</span>
              </div>
            )}
            {phoneNumber && (
              <div className="flex justify-between">
                <span className="font-medium">Teléfono:</span>
                <span>{phoneNumber}</span>
              </div>
            )}
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
              <li>Mantener copia del comprobante en los registros</li>
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
  );
}
