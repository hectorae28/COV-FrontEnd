"use client"
import PayPalProvider from "./paypalProvider"
import { useState, useEffect } from "react"
import { DollarSign } from "lucide-react"
import useColegiadoUserStore from "@/store/colegiadoUserStore";

function PaypalPaymentComponent({ 
  totalPendiente, 
  onPaymentInfoChange,
  allowMultiplePayments, // Add this prop
  metodoDePagoId,
  handlePago,
  tasaBCV
}) {
  console.log({metodoDePagoId})
  const [montoPago, setMontoPago] = useState("0.00");
  const colegiadoUser = useColegiadoUserStore((store) => store.colegiadoUser);
  const [pagoDetalles, setPagoDetalles] = useState(null);

  // Existing useEffect remains unchanged
  useEffect(() => {
    if (totalPendiente) {
      setMontoPago(totalPendiente.toFixed(2))
    } else {
      setMontoPago("0.00")
    }

    if (!allowMultiplePayments) {
      onPaymentInfoChange({
        montoPago,
      })
    }

    setPagoDetalles({
      user_id: colegiadoUser?.id,
      metodo_de_pago_id: metodoDePagoId,
      tasa_bcv: tasaBCV,
      monto: parseFloat(montoPago),
      costo: parseFloat(totalPendiente.toFixed(2))
    });
  }, [totalPendiente, montoPago])

  const handleMontoChange = (e) => {
    const value = e.target.value
    if (!value) {
      setMontoPago("0.00")
      return
    }

    if (!/^\d*\.?\d*$/.test(value)) return

    const numericValue = parseFloat(value)

    if (numericValue > totalPendiente) {
      alert(`El monto no puede ser mayor a USD$ ${totalPendiente.toFixed(2)}`)
      return
    }

    setMontoPago(value)
    onPaymentInfoChange({
      montoPago,
    })
    setPagoDetalles({...pagoDetalles, monto: montoPago})
  }

  const calculatePaypalFee = (amount) => {
    if (!amount || isNaN(parseFloat(amount))) return "0.00"
    const numAmount = parseFloat(amount)
    const total = (numAmount + 0.3) / (1 - 0.054)
    return total.toFixed(2)
  }

  const paypalAmount = calculatePaypalFee(montoPago)

  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-3">
        <img src="/assets/icons/Paypal.png" alt="PayPal" className="h-10" />
      </div>

      {/* Conditionally render amount input */}
      {allowMultiplePayments && (
        <div className="p-4 rounded-lg border border-blue-200 mb-4">
          <label className="block text-sm font-medium mb-2">
            Monto a pagar en USD <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <DollarSign className="h-4 w-4 text-blue-400" />
            </span>
            <input
              type="text"
              value={montoPago}
              onChange={handleMontoChange}
              className="pl-10 w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="0.00"
            />
          </div>
        </div>
      )}

      <div className="space-y-3 text-gray-700">
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-700">
              Monto a depositar en PayPal:
            </p>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </span>
              <input
                type="text"
                value={paypalAmount}
                disabled
                className="pl-10 w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 font-semibold text-sm"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-center">
            <PayPalProvider 
              amount={paypalAmount}
              pagoDetalles={pagoDetalles}
              handlePago={(pagoDetalles) => handlePago(pagoDetalles)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaypalPaymentComponent