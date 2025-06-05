"use client"
import useColegiadoUserStore from "@/store/colegiadoUserStore";
import { DollarSign } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PayPalProvider from "./paypalProvider";

function PaypalPaymentComponent({
  totalPendiente,
  onPaymentInfoChange,
  allowMultiplePayments,
  metodoDePagoId,
  handlePago,
  tasaBCV,
  tipo = ""
}) {
  const [montoPago, setMontoPago] = useState("0.00");
  const colegiadoUser = useColegiadoUserStore((store) => store.colegiadoUser);

  // Memoizar pagoDetalles para evitar recreaciones innecesarias
  const pagoDetalles = useMemo(() => ({
    user_id: colegiadoUser?.id,
    metodo_de_pago_id: metodoDePagoId,
    tasa_bcv_del_dia: tasaBCV,
    totalAmount: parseFloat(montoPago),
    costo: parseFloat(totalPendiente?.toFixed(2) || "0.00"),
    tipo: tipo,
    monto: parseFloat(montoPago)
  }), [colegiadoUser?.id, metodoDePagoId, tasaBCV, montoPago, totalPendiente, tipo]);

  // Efecto para inicializar el monto basado en totalPendiente
  useEffect(() => {
    if (totalPendiente > 0) {
      const newAmount = totalPendiente.toFixed(2);
      setMontoPago(newAmount);
    }
  }, [totalPendiente]);

  // Efecto separado para notificar cambios al componente padre
  useEffect(() => {
    if (!allowMultiplePayments) {
      onPaymentInfoChange?.({ montoPago: parseFloat(montoPago) });
    }
  }, [montoPago, allowMultiplePayments, onPaymentInfoChange]);

  const handleMontoChange = useCallback((e) => {
    const value = e.target.value;

    // Permitir campo vacío temporalmente
    if (!value) {
      setMontoPago("0.00");
      return;
    }

    // Validar formato numérico con regex más estricta
    if (!/^\d*\.?\d{0,2}$/.test(value)) return;

    const numericValue = parseFloat(value);

    // Validar que no exceda el total pendiente
    if (numericValue > totalPendiente) {
      alert(`El monto no puede ser mayor a USD$ ${totalPendiente.toFixed(2)}`);
      return;
    }

    // Actualizar estado con el nuevo valor
    setMontoPago(value);

    // Notificar cambio inmediatamente con el nuevo valor
    if (allowMultiplePayments) {
      onPaymentInfoChange?.({ montoPago: numericValue });
    }
  }, [totalPendiente, allowMultiplePayments, onPaymentInfoChange]);

  const calculatePaypalFee = useCallback((amount) => {
    if (!amount || isNaN(parseFloat(amount))) return "0.00";
    const numAmount = parseFloat(amount);
    // Fórmula: (monto + fee_fijo) / (1 - percentage_fee)
    const total = (numAmount + 0.3) / (1 - 0.054);
    return total.toFixed(2);
  }, []);

  const paypalAmount = useMemo(() =>
    calculatePaypalFee(montoPago), [montoPago, calculatePaypalFee]
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-3">
        <img src="/assets/icons/Paypal.png" alt="PayPal" className="h-10" />
      </div>

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
              inputMode="decimal"
              pattern="[0-9]*\.?[0-9]*"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Máximo: USD$ {totalPendiente?.toFixed(2) || "0.00"}
          </p>
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
              handlePago={handlePago}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaypalPaymentComponent;